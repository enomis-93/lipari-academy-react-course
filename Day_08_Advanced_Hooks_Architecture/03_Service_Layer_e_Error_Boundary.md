# 🏦 LipariBank — React Zero to Hero

> **Day 7 · Capitolo 06**
> **Argomento:** Service Layer, API e gestione degli errori
> **Durata stimata:** 65 minuti
> **Parte di LipariBank:** `apiClient.js`, `accountService.js`, `transactionService.js`, messaggi d'errore e `ErrorBoundary.jsx`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- isolare l'accesso ai dati in un service layer (`apiClient` + service per dominio);
- definire e usare una classe `ApiError` e trasformare gli errori in messaggi comprensibili all'utente;
- usare `import.meta.env.VITE_API_BASE_URL` per cambiare la base URL senza toccare i componenti;
- proteggere l'interfaccia con un `ErrorBoundary` (class component) e spiegare cosa **non** intercetta.

---

## 📋 Prerequisiti
- [Cap. 02 · useReducer](./02_useReducer.md): `BankContext.jsx` esiste (non ancora collegato).
- [Cap. 05 · Architettura](./05_Architettura_del_Progetto.md): `services/` non importa React.
- [Day 5 · Fetch API](../Day_05_Effects_API/04_Fetch_API.md): `fetch`, `response.ok`, `AbortController`.
- Facoltativo: [Extra React Legacy · Lifecycle Methods](../EXTRA_Legacy_React/03_Lifecycle_Methods.md), per approfondire le classi usate dall'`ErrorBoundary`.
- Stato: `src/services/transactionService.js` ha `getTransactions({ signal })` con `fetch("/data/transactions.json", { signal })`; `public/data/transactions.json` contiene un array di movimenti (i dati canonici del corso).

---

## 🧭 In questo capitolo
- Perché un service layer.
- `apiClient.js` con `ApiError`, `signal` e base URL configurabile.
- `transactionService.js` e `accountService.js` (+ `public/data/accounts.json`).
- Errori: da `ApiError` al messaggio per l'utente.
- `ErrorBoundary` e dove metterlo.

---

## 🧠 Theory

### Perché un service layer
Se ogni componente fa `fetch("/data/...")`, URL, gestione di `response.ok`, parsing JSON e messaggi di errore sono **duplicati ovunque**. Un service layer li concentra:

```text
componente/pagina → hook / Context → service (getTransactions) → apiClient (fetch) → rete / file JSON
```

Vantaggi: un solo posto dove cambiare l'URL, errori uniformi, i componenti non sanno **come** arrivano i dati. Nel corso i dati sono file JSON statici in `public/data/`: **non sono un'API reale di LipariBank**. Se un domani esistesse un endpoint reale, cambieresti i service (e la variabile `VITE_API_BASE_URL`), non le pagine.

### Tipi di errore da distinguere
| Situazione | Come si manifesta | Cosa dire all'utente |
|---|---|---|
| Rete assente / server irraggiungibile | `fetch` lancia `TypeError` | "Impossibile contattare il servizio." |
| Risposta con status 4xx/5xx | `response.ok === false` | "Dati non trovati" / "Servizio non disponibile" |
| Risposta non JSON o formato inatteso | `response.json()` lancia, o dati non validi | "Risposta non valida" |
| Richiesta annullata (cleanup, cambio pagina) | `AbortError` | **Niente**: non è un errore |
| Errore di rendering nel codice React | Eccezione durante il render | Schermata di ripiego (Error Boundary) |

### Principi di gestione errori
- Il service lancia un errore **significativo** (`ApiError`); non mostra nulla.
- `try/catch` solo dove puoi **aggiungere valore**: tradurre (`TypeError` → `ApiError`), recuperare o decidere cosa mostrare. Un `catch` che ingoia l'errore in silenzio è peggio di nessun `catch`.
- Il messaggio per l'utente dice **cosa è successo** e **cosa può fare**; i dettagli tecnici (stack, URL, status) vanno in console, non a schermo.
- `AbortError` si lascia passare invariato: chi ha annullato la richiesta sa che non è un fallimento.

> 💡 **Remember**
>
> Il service **non decide** cosa mostrare; lancia errori. Chi mostra (Context/pagina) decide il messaggio. L'`ErrorBoundary` non sostituisce `try/catch`: copre solo gli errori di rendering.

### Configurazione con `import.meta.env`
Vite espone le variabili d'ambiente che iniziano per `VITE_` tramite `import.meta.env`. `import.meta.env.VITE_API_BASE_URL ?? ""` significa: se non definita, usa stringa vuota, cioè stessa origine (i file in `public/`). Poiché queste variabili finiscono nel codice del browser, **non vi si mettono mai segreti** (token, chiavi). Il file `.env` lo vediamo nel [Day 9 · Environment e Deploy](../Day_09_Delivery/04_Environment_e_Deploy.md).

---

## 💻 Let's Code

### 1. `apiClient.js`
Crea `src/services/apiClient.js`:

```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiError extends Error {
  constructor(message, { status = null, cause } = {}) {
    super(message, { cause });
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiGet(path, { signal } = {}) {
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      signal,
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError("Impossibile contattare il servizio.", { cause: error });
  }

  if (!response.ok) {
    throw new ApiError(`Richiesta non riuscita (${response.status}).`, { status: response.status });
  }

  try {
    return await response.json();
  } catch (error) {
    throw new ApiError("Risposta del servizio non valida.", { status: response.status, cause: error });
  }
}
```

Cosa fa:
- **`ApiError`** estende `Error`, conserva lo `status` HTTP e la `cause` originale per il debug.
- **Il primo `try/catch`** traduce un fallimento di rete (`TypeError`) in `ApiError`, ma lascia passare `AbortError`.
- **`response.ok`**: `fetch` non lancia per 404 o 500; va controllato esplicitamente (come in Day 5).
- **Il secondo `try/catch`** gestisce JSON non valido. Alcuni server, per percorsi inesistenti, rispondono `200` con una pagina HTML: senza questo controllo l'errore sarebbe criptico.
- **`signal`** è inoltrato a `fetch`: l'annullamento continua a funzionare.

### 2. I dati dei conti
Crea `public/data/accounts.json` (stessi dati fittizi di `mockData.js`):

```json
[
  { "id": "acc-001", "name": "Conto Corrente", "iban": "IT00 0000 0000 0000 0000 0000 000", "balance": 4250.75, "currency": "EUR" },
  { "id": "acc-002", "name": "Conto Risparmio", "iban": "IT00 0000 0000 0000 0000 0000 001", "balance": 12800.0, "currency": "EUR" }
]
```

### 3. I service
Sostituisci il contenuto di `src/services/transactionService.js` (stessa firma di Day 5, quindi nulla cambia per chi la chiama):

```javascript
import { ApiError, apiGet } from "./apiClient";

export async function getTransactions({ signal } = {}) {
  const data = await apiGet("/data/transactions.json", { signal });
  if (!Array.isArray(data)) {
    throw new ApiError("Formato dei movimenti non valido.");
  }
  return data;
}
```

Crea `src/services/accountService.js`:

```javascript
import { ApiError, apiGet } from "./apiClient";

export async function getAccounts({ signal } = {}) {
  const data = await apiGet("/data/accounts.json", { signal });
  if (!Array.isArray(data)) {
    throw new ApiError("Formato dei conti non valido.");
  }
  return data;
}

export async function getAccountById(accountId, { signal } = {}) {
  const accounts = await getAccounts({ signal });
  const account = accounts.find((item) => item.id === accountId);
  if (!account) {
    throw new ApiError("Conto non trovato.", { status: 404 });
  }
  return account;
}
```

I service non hanno `try/catch`: non hanno nulla da aggiungere, lasciano propagare `ApiError`. Convalidano invece il **formato** dei dati ricevuti, perché un JSON valido non è per forza il JSON atteso.

### 4. Messaggi per l'utente
Crea `src/utils/errorMessages.js` (nuovo file in `utils/`):

```javascript
import { ApiError } from "../services/apiClient";

export function getErrorMessage(error) {
  if (error instanceof ApiError) {
    if (error.status === 404) return "I dati richiesti non sono stati trovati.";
    if (error.status !== null && error.status >= 500) {
      return "Il servizio non è al momento disponibile. Riprova tra qualche minuto.";
    }
    return error.message;
  }
  return "Si è verificato un errore imprevisto. Riprova più tardi.";
}
```

### 5. Aggiornare `BankContext.jsx`
Nel `BankProvider` (cap. 02) cambia gli import e la funzione `load` dentro l'effect. Import:

```jsx
import { getAccounts } from "../services/accountService";
import { getTransactions } from "../services/transactionService";
import { getErrorMessage } from "../utils/errorMessages";
```

Elimina l'import `accounts as mockAccounts` da `mockData` e sostituisci `load`:

```jsx
async function load() {
  dispatch({ type: "LOAD_START" });
  try {
    const [accounts, transactions] = await Promise.all([
      getAccounts({ signal: controller.signal }),
      getTransactions({ signal: controller.signal }),
    ]);
    dispatch({ type: "LOAD_SUCCESS", payload: { accounts, transactions } });
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error(error);
    dispatch({ type: "LOAD_ERROR", payload: getErrorMessage(error) });
  }
}
```

`Promise.all` carica conti e movimenti in parallelo; se uno fallisce, fallisce tutto con il primo errore. `console.error` lascia i dettagli tecnici agli sviluppatori; l'utente vede solo il messaggio tradotto.

### 6. `ErrorBoundary`
Gli errori **durante il rendering** (per esempio leggere `account.name` su `undefined`) farebbero sparire l'intera app, lasciando una pagina bianca. Un **Error Boundary** li intercetta e mostra un'interfaccia di ripiego. Crea `src/components/ErrorBoundary.jsx`:

```jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Errore intercettato dall'ErrorBoundary:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="error-boundary">
          <h2>Qualcosa è andato storto</h2>
          <p>Si è verificato un problema nella visualizzazione di questa pagina.</p>
          <button type="button" onClick={this.handleReset}>Riprova</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

**Sì, è una class component.** React invoca `getDerivedStateFromError` quando un discendente fallisce durante il rendering: il metodo aggiorna lo state per mostrare il fallback. `componentDidCatch` riceve l'errore per la diagnostica. `render` sceglie fra fallback e `this.props.children`. Non serve aver seguito l'extra: copia il componente e usalo come indicato; per approfondire le classi consulta il [modulo React Legacy facoltativo](../EXTRA_Legacy_React/03_Lifecycle_Methods.md). Gli Error Boundary non intercettano normalmente errori negli handler o nelle operazioni asincrone.

- `getDerivedStateFromError` aggiorna lo state per mostrare il ripiego al render successivo;
- `componentDidCatch` serve per i side effect, come il logging (qui `console.error`);
- `handleReset` prova a ridisegnare i figli.

**Cosa NON intercetta:** errori negli *event handler* (`onClick`), nel codice asincrono (`fetch`, `setTimeout`), nel server-side rendering e nell'Error Boundary stesso. Per `fetch` serve `try/catch` (come in `BankProvider`). Verificato con React 19: un errore di rendering intercettato viene comunque scritto in console, anche in presenza del boundary.

Usalo in `src/layouts/AppLayout.jsx` attorno a `<Outlet />`. Snippet parziale, tieni il resto del layout invariato (Header, `NavLink`, `navItems`):

```jsx
import { NavLink, Outlet, useLocation } from "react-router";
import ErrorBoundary from "../components/ErrorBoundary.jsx";

// dentro AppLayout
const location = useLocation();

// nel JSX, dentro <main className="app-main">, al posto del semplice <Outlet />
<ErrorBoundary key={location.pathname}>
  <Outlet />
</ErrorBoundary>
```

La `key` basata sul percorso fa ripartire il boundary quando navighi altrove: un errore in `/transactions` non blocca `/`. Header e navigazione restano fuori dal boundary e quindi sempre visibili.

### 7. Provare tutto
**A. Errore di rendering.** In `DashboardPage.jsx` aggiungi temporaneamente un componente che lancia:

```jsx
function BrokenWidget() {
  throw new Error("Errore di prova");
}

// nel JSX
<BrokenWidget />
```

Vedi la schermata "Qualcosa è andato storto" con Header e menu ancora funzionanti; in console vedi l'errore. In sviluppo React riporta comunque l'errore in console anche se è stato intercettato. Rimuovi `BrokenWidget`.

**B. Errore di rete.** Crea nella root di `liparibank/` il file `.env.local` con una sola riga:

```text
VITE_API_BASE_URL=http://localhost:9999
```

Riavvia `npm run dev` (le variabili si leggono all'avvio). Con il `BankProvider` collegato (cap. 07) vedrai "Impossibile contattare il servizio." Elimina `.env.local` e riavvia. Non committare `.env.local`: i file `.env*.local` sono di solito ignorati da Git nel template Vite; verificalo nel tuo `.gitignore`.

**C. File mancante.** Cambia temporaneamente in `transactionService.js` il percorso in `/data/non-esiste.json`: vedrai "I dati richiesti non sono stati trovati." oppure "Risposta del servizio non valida.", a seconda di come il server gestisce i percorsi inesistenti. Ripristina il percorso.

---

## 🏦 LipariBank in action
Cosa cambia per il resto dell'app:
- `getTransactions({ signal })` ha la **stessa firma** di Day 5: `App.jsx` continua a funzionare senza modifiche.
- Un solo punto per l'URL (`apiClient`) e un solo punto per i messaggi (`getErrorMessage`).
- Quando `LOAD_ERROR` mette il messaggio nello state, `ErrorMessage` lo mostra con un pulsante "Riprova" collegato a `reload` di `useBank`.
- I conti passano da `mockData.js` a `accounts.json`: restano `customer` e `beneficiaries` in `mockData.js` perché sono dati statici che non ha senso "caricare".

Esempio di uso del messaggio nell'UI (snippet parziale; `ErrorMessage` di Day 5 accetta `message` e `onRetry`):

```jsx
{error && <ErrorMessage message={error} onRetry={reload} />}
```

---

## 🧪 Your Turn
**Obiettivo:** estendere il service layer e verificare i casi di errore.

**Requisiti:**
1. `apiClient.js`, `transactionService.js`, `accountService.js` e `public/data/accounts.json` esistono come mostrato.
2. Nessun `fetch(` in `src/` fuori da `src/services/apiClient.js` (usa la ricerca di VS Code).
3. Aggiungi a `transactionService.js` la funzione `getTransactionsByAccount(accountId, { signal })` che riusa `getTransactions` e filtra per `accountId`.
4. Collega l'`ErrorBoundary` in `AppLayout` e dimostra con `BrokenWidget` che il menu resta usabile.
5. Esegui i test A, B e C della sezione 7 e annota i messaggi visti.

**Suggerimenti:** per il punto 3 non ripetere `apiGet`: componi funzioni esistenti. Per il test B ricorda di riavviare il dev server.

**Risultato atteso:** nessuna pagina bianca in nessuno dei tre scenari; l'utente vede sempre un messaggio comprensibile.

**Criteri di completamento:** requisiti 1-5 verificati, file temporanei rimossi, `npm run lint` e `npm run build` senza errori.

---

## ⚠️ Common Mistakes
- **Dimenticare di controllare `response.ok`**: un 404 sembra un successo e il parsing fallisce più avanti.
- **Trattare `AbortError` come errore**: in `StrictMode` l'effect parte, viene annullato e riparte; mostrare un errore sarebbe sbagliato.
- **`catch` che ingoia l'errore** (`catch {}`) senza log né messaggio: i problemi diventano invisibili.
- **Mostrare `error.message` o lo stack all'utente**: informazioni tecniche inutili (e a volte sensibili). Usa `getErrorMessage`.
- **Aspettarsi che l'Error Boundary intercetti errori di `fetch` o di `onClick`**: non lo fa.
- **Mettere segreti in `VITE_*`**: finiscono nel bundle pubblico.
- **Modificare `.env` e non riavviare** `npm run dev`.

---

## ✅ Checklist
- ☐ Esiste un solo punto in cui si chiama `fetch` (`apiClient.js`).
- ☐ `ApiError` espone `status` e `cause`.
- ☐ `AbortError` non viene trasformato né mostrato.
- ☐ `getErrorMessage` restituisce testi in italiano senza dettagli tecnici.
- ☐ `ErrorBoundary` è una class component e avvolge l'`<Outlet />`.
- ☐ So elencare tre tipi di errore che l'Error Boundary non intercetta.
- ☐ `VITE_API_BASE_URL` non contiene segreti.

---

## 🚀 Challenge
Aggiungi `apiPost(path, body, { signal })` a `apiClient.js` (metodo `POST`, header `Content-Type: application/json`, `JSON.stringify(body)`) riusando il più possibile la logica di `apiGet` (estrai una funzione interna `request`). Nel corso non ha un endpoint reale da chiamare: serve a capire come il service layer permetterebbe di passare da un bonifico simulato a uno reale cambiando un solo file.

---

## 📌 Recap
- Il service layer isola URL, `fetch`, controllo degli status e parsing dei dati.
- `ApiError` porta `status` e `cause`; `AbortError` passa invariato.
- `try/catch` nei service solo per tradurre o recuperare; l'UI decide cosa mostrare.
- I messaggi all'utente sono chiari e privi di dettagli tecnici; i dettagli vanno in console.
- L'Error Boundary (class component) copre solo errori di rendering; `fetch` ed event handler richiedono `try/catch`.

---

### ➡️ Next
Prossimo capitolo: [07 · Esercizio: Refactoring LipariBank](./07_Esercizio_Refactoring_LipariBank.md). Colleghiamo tutto e togliamo lo state da `App.jsx`, senza cambiare il comportamento dell'app.
