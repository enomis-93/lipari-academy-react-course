# 🏦 LipariBank — React Zero to Hero

> **Day 8 · Capitolo 03**
> **Argomento:** Service layer, API ed Error Boundary
> **Durata stimata:** 70 minuti
> **Parte di LipariBank:** `apiClient.js`, `accountService.js`, `transactionService.js`, messaggi d'errore, thunk aggiornati ed `ErrorBoundary.jsx`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- isolare l'accesso ai dati in un service layer (`apiClient` più un service per argomento);
- definire e usare una classe `ApiError` e trasformare gli errori in messaggi comprensibili all'utente;
- usare `import.meta.env.VITE_API_BASE_URL` per cambiare l'indirizzo dei dati senza toccare i componenti;
- collegare i service ai thunk dello store;
- proteggere l'interfaccia con un `ErrorBoundary` e spiegare che cosa **non** intercetta.

---

## 📋 Prerequisiti
- [Capitolo 01 · Custom Hooks](./01_Custom_Hooks.md): le pagine usano `useBankStatus()` per caricamento, errore e "Riprova".
- [Day 7 · Redux Toolkit: slice e thunk](../Day_07_Shared_State_Redux/04_Redux_Toolkit_Slice_e_Thunk.md): `fetchTransactions`, `status`, `extraReducers`.
- [Day 5 · Fetch API](../Day_05_Effects_API/04_Fetch_API.md): `fetch`, `response.ok`, `AbortController`.
- Facoltativo: [Extra React Legacy · Lifecycle Methods](../Extra_Legacy_React/03_Lifecycle_Methods.md), per approfondire le classi usate dall'`ErrorBoundary`.
- Stato: `src/services/transactionService.js` ha `getTransactions({ signal })` con `fetch("/data/transactions.json", { signal })`; i conti arrivano ancora da `mockData.js`.

---

## 🧭 In questo capitolo
- Perché un service layer.
- `apiClient.js` con `ApiError`, `signal` e indirizzo di base configurabile.
- `transactionService.js` e `accountService.js` (più `public/data/accounts.json`).
- Errori: da `ApiError` al messaggio per l'utente, passando dai thunk.
- `ErrorBoundary` e dove metterlo.

---

## 🧠 Theory

### Perché un service layer
Se ogni punto del codice fa `fetch("/data/...")`, indirizzi, controllo di `response.ok`, lettura del JSON e messaggi di errore sono **duplicati ovunque**. Un service layer li concentra:

```text
pagina → hook → store (thunk) → service (getTransactions) → apiClient (fetch) → rete / file JSON
```

Vantaggi: un solo posto dove cambiare l'indirizzo, errori uniformi, e nessun componente sa **come** arrivano i dati. Nel corso i dati sono file JSON statici in `public/data/`: **non sono un'API reale di LipariBank**. Se un domani esistesse un servizio vero, cambieresti i service (e la variabile `VITE_API_BASE_URL`), non le pagine.

### Tipi di errore da distinguere

| Situazione | Come si manifesta | Che cosa dire all'utente |
|---|---|---|
| Rete assente o server irraggiungibile | `fetch` lancia `TypeError` | "Impossibile contattare il servizio." |
| Risposta con status 4xx o 5xx | `response.ok === false` | "Dati non trovati" / "Servizio non disponibile" |
| Risposta non JSON o formato inatteso | `response.json()` lancia, o i dati non sono validi | "Risposta non valida" |
| Richiesta annullata | `AbortError` | **Niente**: non è un errore |
| Errore di rendering nel codice React | Eccezione durante il render | Schermata di ripiego (Error Boundary) |

### Principi di gestione degli errori
- Il service lancia un errore **significativo** (`ApiError`); non mostra nulla.
- `try`/`catch` solo dove puoi **aggiungere valore**: tradurre (`TypeError` → `ApiError`), recuperare, o decidere che cosa mostrare. Un `catch` che ingoia l'errore in silenzio è peggio di nessun `catch`.
- Il messaggio per l'utente dice **che cosa è successo** e **che cosa può fare**; i dettagli tecnici (stack, indirizzo, status) vanno in console, non a schermo.
- `AbortError` si lascia passare invariato: chi ha annullato la richiesta sa che non è un fallimento.

> 💡 **Remember**
>
> Il service **non decide** che cosa mostrare: lancia errori. Il thunk traduce l'errore in un messaggio e lo mette nello store; la pagina lo mostra. L'`ErrorBoundary` non sostituisce `try`/`catch`: copre solo gli errori di rendering.

### Configurazione con `import.meta.env`
Vite espone al codice le variabili d'ambiente che iniziano per `VITE_` tramite `import.meta.env`. `import.meta.env.VITE_API_BASE_URL ?? ""` significa: se non è definita, usa una stringa vuota, cioè la stessa origine della pagina (i file in `public/`). Poiché queste variabili finiscono nel codice inviato al browser, **non vi si mettono mai segreti** (token, chiavi). I file `.env` li vedremo nel Day 9.

---

## 💻 Let's Code

### 1. `apiClient.js`
Crea `src/services/apiClient.js`:

```javascript title="src/services/apiClient.js"
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

Che cosa fa:

- **`ApiError`** estende `Error`, conserva lo `status` HTTP e la `cause` originale per la diagnosi.
- **Il primo `try`/`catch`** traduce un fallimento di rete (`TypeError`) in `ApiError`, ma lascia passare `AbortError`.
- **`response.ok`**: `fetch` non lancia per un 404 o un 500; va controllato esplicitamente, come nel Day 5.
- **Il secondo `try`/`catch`** gestisce un JSON non valido. Alcuni server, per i percorsi inesistenti, rispondono `200` con una pagina HTML: senza questo controllo l'errore sarebbe incomprensibile.
- **`signal`** è inoltrato a `fetch`: l'annullamento continua a funzionare.

### 2. I dati dei conti
Crea `public/data/accounts.json` (gli stessi dati fittizi di `mockData.js`):

```json title="public/data/accounts.json"
[
  { "id": "acc-001", "name": "Conto Corrente", "iban": "IT00 0000 0000 0000 0000 0000 000", "balance": 4250.75, "currency": "EUR" },
  { "id": "acc-002", "name": "Conto Risparmio", "iban": "IT00 0000 0000 0000 0000 0000 001", "balance": 12800.0, "currency": "EUR" }
]
```

### 3. I service
Sostituisci il contenuto di `src/services/transactionService.js` (stessa firma del Day 5, quindi per chi la chiama non cambia nulla):

```javascript title="src/services/transactionService.js"
import { ApiError, apiGet } from "./apiClient.js";

export async function getTransactions({ signal } = {}) {
  const data = await apiGet("/data/transactions.json", { signal });
  if (!Array.isArray(data)) {
    throw new ApiError("Formato dei movimenti non valido.");
  }
  return data;
}
```

Crea `src/services/accountService.js`:

```javascript title="src/services/accountService.js"
import { ApiError, apiGet } from "./apiClient.js";

export async function getAccounts({ signal } = {}) {
  const data = await apiGet("/data/accounts.json", { signal });
  if (!Array.isArray(data)) {
    throw new ApiError("Formato dei conti non valido.");
  }
  return data;
}
```

I service non hanno `try`/`catch`: non hanno nulla da aggiungere e lasciano propagare `ApiError`. Convalidano invece il **formato** dei dati ricevuti, perché un JSON valido non è per forza il JSON atteso.

### 4. Messaggi per l'utente
Crea `src/utils/errorMessages.js`:

```javascript title="src/utils/errorMessages.js"
import { ApiError } from "../services/apiClient.js";

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

### 5. Aggiornare i thunk
Chi traduce l'errore in messaggio? Il thunk: è il punto in cui il risultato del service entra nello store.

In `src/store/transactionsSlice.js` aggiorna gli import e il thunk:

```javascript title="src/store/transactionsSlice.js"
import { createAsyncThunk, createSelector, createSlice, nanoid } from "@reduxjs/toolkit";
import { getTransactions } from "../services/transactionService.js";
import { getErrorMessage } from "../utils/errorMessages.js";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { signal, rejectWithValue }) => {
    try {
      return await getTransactions({ signal });
    } catch (error) {
      console.error(error);
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => getState().transactions.status !== "loading",
  },
);
```

`rejectWithValue` fa terminare il thunk con l'action `rejected`, mettendo nel `payload` il valore che gli passi: qui il messaggio per l'utente. `console.error` lascia i dettagli tecnici a chi sviluppa.

Nello stesso file aggiorna il caso `rejected`:

```javascript
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? getErrorMessage(null);
      });
```

Ora i conti. Finora erano nello state iniziale dello slice; adesso si caricano come i movimenti. Sostituisci `src/store/accountsSlice.js`:

```javascript title="src/store/accountsSlice.js"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAccounts } from "../services/accountService.js";
import { getErrorMessage } from "../utils/errorMessages.js";
import { transferAdded } from "./transactionsSlice.js";

export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async (_, { signal, rejectWithValue }) => {
    try {
      return await getAccounts({ signal });
    } catch (error) {
      console.error(error);
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => getState().accounts.status !== "loading",
  },
);

function roundCents(value) {
  return Math.round(value * 100) / 100;
}

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? getErrorMessage(null);
      })
      .addCase(transferAdded, (state, action) => {
        const account = state.items.find((item) => item.id === action.payload.accountId);
        if (account) {
          account.balance = roundCents(account.balance + action.payload.amount);
        }
      });
  },
});

export const selectAccounts = (state) => state.accounts.items;
export const selectAccountsStatus = (state) => state.accounts.status;
export const selectAccountsError = (state) => state.accounts.error;

export default accountsSlice.reducer;
```

Lo slice dei conti ha ora la stessa forma di quello dei movimenti: `items`, `status`, `error`, un thunk con `condition` e i tre casi del caricamento. Il caso `transferAdded` è rimasto identico.

Infine fai partire entrambi i caricamenti. In `src/App.jsx` aggiungi l'import di `fetchAccounts` e aggiorna l'effect (snippet parziale: il `return` con le route resta com'è):

```jsx
import { fetchAccounts } from "./store/accountsSlice.js";
import { fetchTransactions } from "./store/transactionsSlice.js";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchTransactions());
  }, [dispatch]);
```

### 6. Aggiornare `useBankStatus`
Adesso i caricamenti sono due. Una pagina è pronta quando **entrambi** sono riusciti, e deve mostrare l'errore se **uno dei due** è fallito. Sostituisci `src/hooks/useBankStatus.js`:

```javascript title="src/hooks/useBankStatus.js"
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccounts,
  selectAccountsError,
  selectAccountsStatus,
} from "../store/accountsSlice.js";
import {
  fetchTransactions,
  selectTransactionsError,
  selectTransactionsStatus,
} from "../store/transactionsSlice.js";

export function useBankStatus() {
  const dispatch = useDispatch();
  const accountsStatus = useSelector(selectAccountsStatus);
  const accountsError = useSelector(selectAccountsError);
  const transactionsStatus = useSelector(selectTransactionsStatus);
  const transactionsError = useSelector(selectTransactionsError);

  const statuses = [accountsStatus, transactionsStatus];
  const hasFailed = statuses.includes("failed");
  const isLoading =
    !hasFailed && statuses.some((status) => status === "idle" || status === "loading");

  function reload() {
    if (accountsStatus === "failed") dispatch(fetchAccounts());
    if (transactionsStatus === "failed") dispatch(fetchTransactions());
  }

  return {
    isLoading,
    error: hasFailed ? (accountsError ?? transactionsError) : null,
    reload,
  };
}
```

Ricarica l'app: funziona, e nel tab *Network* trovi una richiesta per `accounts.json` e una per `transactions.json`.

**Le pagine non sono cambiate di una riga.** Chiedono ancora `isLoading`, `error` e `reload`: come si calcolano è un dettaglio del hook. È il motivo per cui nel capitolo 01 valeva la pena estrarlo: se ogni pagina avesse ancora le proprie condizioni su `status`, ora dovresti correggerne quattro.

### 7. `ErrorBoundary`
Gli errori **durante il rendering** (per esempio leggere `account.name` quando `account` è `undefined`) farebbero sparire l'intera app, lasciando una pagina bianca. Un **Error Boundary** li intercetta e mostra un'interfaccia di ripiego. Crea `src/components/ErrorBoundary.jsx`:

```jsx title="src/components/ErrorBoundary.jsx"
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
          <button type="button" onClick={this.handleReset}>
            Riprova
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

**Sì, è una class component.** È l'unico caso del corso in cui serve: React non offre ancora un hook equivalente.

- `getDerivedStateFromError` viene chiamato quando un discendente fallisce durante il rendering: aggiorna lo state per mostrare il ripiego.
- `componentDidCatch` riceve l'errore per la diagnosi (qui `console.error`).
- `handleReset` prova a ridisegnare i figli.
- `render` sceglie tra ripiego e `this.props.children`.

Non serve aver seguito l'extra sulle classi: copia il componente e usalo come indicato. Per approfondire c'è il [modulo React Legacy facoltativo](../Extra_Legacy_React/03_Lifecycle_Methods.md).

**Che cosa NON intercetta:** gli errori negli *event handler* (`onClick`), nel codice asincrono (`fetch`, `setTimeout`) e nell'Error Boundary stesso. Per quelli servono `try`/`catch`, come nei thunk. In sviluppo React scrive comunque l'errore in console, anche quando il boundary lo intercetta.

Usalo attorno a `<Outlet />`. `src/layouts/AppLayout.jsx`:

```jsx title="src/layouts/AppLayout.jsx"
import { NavLink, Outlet, useLocation } from "react-router";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import Header from "../components/Header.jsx";
import { customer } from "../data/mockData.js";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/accounts", label: "Conti" },
  { to: "/transactions", label: "Movimenti" },
  { to: "/transfer", label: "Bonifico" },
];

function getLinkClassName({ isActive }) {
  return isActive ? "nav-link nav-link-active" : "nav-link";
}

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="app">
      <Header customer={customer} />

      <nav className="main-nav" aria-label="Navigazione principale">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={getLinkClassName}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="app-main">
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
```

La `key` basata sul percorso fa ripartire il boundary quando navighi altrove: un errore in `/transactions` non blocca `/`. È la tecnica vista nel [Day 3](../Day_03_State_Events/04_Virtual_DOM_e_Riconciliazione.md): una `key` diversa crea un componente nuovo, con lo state iniziale. Intestazione e menu restano fuori dal boundary e quindi sempre visibili.

### 8. Provare tutto
**A. Errore di rendering.** In `src/pages/DashboardPage.jsx` aggiungi temporaneamente un componente che lancia:

```jsx title="src/pages/DashboardPage.jsx"
function BrokenWidget() {
  throw new Error("Errore di prova");
}

// nel JSX
<BrokenWidget />
```

Vedi "Qualcosa è andato storto" con intestazione e menu ancora funzionanti. Rimuovi `BrokenWidget`.

**B. Errore di rete.** Nella cartella `liparibank/` crea il file `.env.local` con una sola riga:

```text
VITE_API_BASE_URL=http://localhost:9999
```

Riavvia `npm run dev` (le variabili si leggono all'avvio). Vedrai "Impossibile contattare il servizio." con il pulsante "Riprova". Nei Redux DevTools le action `rejected` hanno il messaggio nel `payload`. Elimina `.env.local` e riavvia. Non fare il commit di `.env.local`: il `.gitignore` del template Vite ignora già i file `*.local`.

**C. File mancante.** Cambia temporaneamente in `transactionService.js` il percorso in `/data/non-esiste.json`: vedrai "I dati richiesti non sono stati trovati." oppure "Risposta del servizio non valida.", a seconda di come il server gestisce i percorsi inesistenti. Ripristina il percorso.

---

## 🏦 LipariBank in action
Che cosa è cambiato per il resto dell'app:

- `getTransactions({ signal })` ha la **stessa firma** del Day 5: chi la chiamava non se n'è accorto.
- C'è un solo punto per l'indirizzo dei dati (`apiClient`) e un solo punto per i messaggi (`getErrorMessage`).
- Il messaggio d'errore fa questo percorso: service (`ApiError`) → thunk (`rejectWithValue`) → store (`error`) → `useBankStatus` → `ErrorMessage` con "Riprova".
- I conti passano da `mockData.js` a `accounts.json`. In `mockData.js` restano utili solo `customer` e `beneficiaries`: sono dati fissi che non ha senso "caricare". Faremo pulizia nell'[esercizio](./05_Esercizio_Refactoring_LipariBank.md).
- Nessuna pagina è stata modificata.

---

## 🧪 Your Turn
**Obiettivo:** verificare il service layer e i casi di errore.

**Requisiti:**
1. `apiClient.js`, `transactionService.js`, `accountService.js`, `errorMessages.js` e `public/data/accounts.json` esistono come mostrato.
2. Nessun `fetch(` in `src/` fuori da `src/services/apiClient.js`.
3. L'`ErrorBoundary` è collegato in `AppLayout`: dimostra con `BrokenWidget` che il menu resta utilizzabile.
4. Esegui le prove A, B e C del punto 8 e annota i messaggi che vedi.
5. Durante la prova B apri i Redux DevTools e individua quale action contiene il messaggio mostrato all'utente.

Per il requisito 2, in PowerShell:

```powershell
Get-ChildItem src -Recurse -Include *.js, *.jsx | Select-String -Pattern "fetch\("
```

Con un terminale bash (Git Bash, macOS, Linux):

```bash
grep -rn "fetch(" src
```

**Passi suggeriti:**
1. Per la prova B ricorda di riavviare il server di sviluppo, sia dopo aver creato `.env.local` sia dopo averlo eliminato.
2. Per il requisito 5 guarda il `payload` delle action che terminano con `/rejected`.

**Risultato atteso:** nessuna pagina bianca in nessuno dei tre scenari; l'utente vede sempre un messaggio comprensibile. La ricerca del requisito 2 trova una sola riga, in `apiClient.js`.

**Criteri di completamento:** i 5 requisiti sono verificati, i file temporanei sono rimossi, `npm run lint` e `npm run build` terminano senza errori.

---

## ⚠️ Common Mistakes
- **Dimenticare di controllare `response.ok`**: un 404 sembra un successo e la lettura dei dati fallisce più avanti.
- **Trattare `AbortError` come un errore**: mostrare un messaggio per una richiesta annullata di proposito sarebbe sbagliato.
- **`catch` che ingoia l'errore** (`catch {}`) senza log né messaggio: i problemi diventano invisibili.
- **Mostrare `error.message` o lo stack all'utente**: informazioni tecniche inutili, e a volte riservate. Usa `getErrorMessage`.
- **Mettere un oggetto `Error` nello store**: lo state di Redux deve contenere solo dati semplici. Nello store va il messaggio, cioè una stringa.
- **Aspettarsi che l'Error Boundary intercetti gli errori di `fetch` o di `onClick`**: non lo fa.
- **Mettere segreti in `VITE_*`**: finiscono nel codice pubblico.
- **Modificare `.env` e non riavviare** `npm run dev`.

---

## ✅ Checklist
- ☐ Esiste un solo punto in cui si chiama `fetch` (`apiClient.js`).
- ☐ `ApiError` espone `status` e `cause`.
- ☐ `AbortError` non viene trasformato né mostrato.
- ☐ `getErrorMessage` restituisce testi in italiano senza dettagli tecnici.
- ☐ I thunk usano `rejectWithValue` e lo store contiene il messaggio.
- ☐ `useBankStatus` tiene conto di conti e movimenti, e le pagine non sono cambiate.
- ☐ `ErrorBoundary` è una class component e avvolge l'`<Outlet />`.
- ☐ So elencare tre tipi di errore che l'Error Boundary non intercetta.

---

## 🚀 Challenge
Aggiungi `apiPost(path, body, { signal })` ad `apiClient.js` (metodo `POST`, header `Content-Type: application/json`, `JSON.stringify(body)`) riusando il più possibile la logica di `apiGet`: estrai una funzione interna `request`. Nel corso non esiste un indirizzo reale da chiamare: serve a capire come il service layer permetterebbe di passare da un bonifico simulato a uno vero cambiando un solo file. È un'estensione facoltativa.

---

## 📌 Recap
- Il service layer isola indirizzi, `fetch`, controllo degli status e lettura dei dati.
- `ApiError` porta `status` e `cause`; `AbortError` passa invariato.
- Il thunk traduce l'errore in un messaggio con `rejectWithValue`; lo store lo conserva; la pagina lo mostra.
- Grazie a `useBankStatus` il secondo caricamento non ha richiesto modifiche alle pagine.
- L'Error Boundary (class component) copre solo gli errori di rendering; `fetch` ed event handler richiedono `try`/`catch`.

---

### ➡️ Next
Prossimo capitolo: [04 · Architettura del progetto](./04_Architettura_del_Progetto.md). Abbiamo store, Context, hook, service e componenti: organizziamoli con un criterio.
