# 🏦 LipariBank — React Zero to Hero

> **Day 5 · Capitolo 04**
> **Argomento:** Fetch API
> **Durata stimata:** 40 minuti
> **Parte di LipariBank:** i movimenti non arrivano più da `mockData.js` ma da `public/data/transactions.json`, tramite `src/services/transactionService.js`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- usare `fetch` con `async/await` e `try/catch`, verificando `response.ok`;
- spiegare perché `fetch` **non** rifiuta la Promise su errori HTTP come 404 o 500;
- creare un service che isola l'accesso ai dati;
- caricare i movimenti in `Dashboard` con `useEffect` e `AbortController`.

---

## 📋 Prerequisiti
- [Capitolo 03 — Dipendenze e Cleanup](./03_Dipendenze_e_Cleanup.md).
- [Extra · Promises, async/await](../Extra_JavaScript_Essentials/07_Promises_Async_Await.md) (ripasso consigliato).
- Il progetto gira con `npm run dev` (eseguito dentro `liparibank/`).

---

## 🧭 In questo capitolo
- `fetch`, `Response`, `response.ok`, `response.json()`.
- Il file statico `public/data/transactions.json`.
- Il service `getTransactions({ signal })`.
- L'effect di caricamento in `Dashboard.jsx`.
- Strategia per i bonifici aggiunti localmente.

---

## 🧠 Theory

### Cosa restituisce `fetch`
`fetch(url, options)` restituisce una **Promise** di un oggetto `Response`. Per leggere il corpo JSON serve una seconda chiamata asincrona: `response.json()`.

```text
fetch(url) → Promise<Response> → response.json() → Promise<dati>
```

### Quando la Promise viene rifiutata
La Promise di `fetch` viene **rifiutata** solo per errori di rete (nessuna connessione, server irraggiungibile) o per l'annullamento via `AbortController`. Se il server risponde con `404` o `500`, la Promise è **risolta**: la risposta esiste, anche se è un errore. Per questo devi controllare:

- `response.ok` → `true` per status `200–299`;
- `response.status` → il codice numerico.

### Un'API reale o un file statico?
Il corso non ha un backend LipariBank e **non inventiamo endpoint**. Usiamo come **stand-in** un file statico servito da Vite: `public/data/transactions.json`, raggiungibile all'URL `/data/transactions.json`. Dal punto di vista del componente funziona come una API: richiesta asincrona, risposta JSON, possibili errori. Quando avrai un endpoint reale, basterà **cambiare solo il service** (URL ed eventuale trasformazione dei dati): i componenti non cambiano.

> 💡 **Remember**
>
> I componenti non conoscono URL né `fetch`: chiamano `getTransactions()`. Tutto ciò che riguarda "da dove arrivano i dati" vive in `src/services/`.

---

## 💻 Let's Code

### 1. Il file dei dati
Crea `public/data/transactions.json` (crea prima la cartella `public/data/` dentro `liparibank/`). Sono gli stessi movimenti di `mockData.js`:

```json
[
  { "id": "trx-001", "accountId": "acc-001", "date": "2026-10-27", "description": "Spesa supermercato", "amount": -62.4, "category": "Alimentari" },
  { "id": "trx-002", "accountId": "acc-001", "date": "2026-10-25", "description": "Pagamento utenza luce", "amount": -88.9, "category": "Utenze" },
  { "id": "trx-003", "accountId": "acc-001", "date": "2026-10-23", "description": "Stipendio", "amount": 2100.0, "category": "Stipendio" },
  { "id": "trx-004", "accountId": "acc-001", "date": "2026-10-20", "description": "Abbonamento palestra", "amount": -39.9, "category": "Svago" },
  { "id": "trx-005", "accountId": "acc-001", "date": "2026-10-18", "description": "Rimborso spese", "amount": 45.0, "category": "Rimborsi" },
  { "id": "trx-006", "accountId": "acc-001", "date": "2026-10-15", "description": "Pagamento utenza gas", "amount": -54.2, "category": "Utenze" },
  { "id": "trx-007", "accountId": "acc-002", "date": "2026-10-10", "description": "Accantonamento mensile", "amount": 300.0, "category": "Risparmio" },
  { "id": "trx-008", "accountId": "acc-002", "date": "2026-10-01", "description": "Interessi maturati", "amount": 12.5, "category": "Interessi" }
]
```

Verifica: con `npm run dev` in esecuzione apri `http://localhost:5173/data/transactions.json` nel browser; devi vedere il JSON. Il JSON non ammette commenti né virgole finali.

### 2. Il service
Crea `src/services/transactionService.js`:

```javascript
const TRANSACTIONS_URL = "/data/transactions.json";

export async function getTransactions({ signal } = {}) {
  const response = await fetch(TRANSACTIONS_URL, { signal });

  if (!response.ok) {
    throw new Error(
      `Impossibile caricare i movimenti (HTTP ${response.status})`
    );
  }

  return response.json();
}
```

Cosa fa: richiede il file, trasforma uno status non-OK in un errore vero (`throw`) e restituisce i dati. Perché funziona: essendo `async`, la funzione restituisce sempre una Promise; un `throw` la rifiuta. Come modificarlo: per una API reale cambia `TRANSACTIONS_URL` e, se serve, adatta il formato dei dati prima di restituirli. Errore da evitare: dimenticare `response.ok`.

Lo stesso codice con `.then()`, per riconoscerlo quando lo incontri:

```javascript
export function getTransactions({ signal } = {}) {
  return fetch(TRANSACTIONS_URL, { signal }).then((response) => {
    if (!response.ok) {
      throw new Error(`Impossibile caricare i movimenti (HTTP ${response.status})`);
    }
    return response.json();
  });
}
```

### 3. L'effect in `Dashboard.jsx`
Snippet **parziale** (il resto del componente è quello del Day 4). Cambia due cose: lo state `transactions` parte da `[]` e non importi più `transactions` da `mockData.js`.

```jsx
import { useEffect, useState } from "react";
import { accounts, beneficiaries } from "../data/mockData.js";
import { getTransactions } from "../services/transactionService.js";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  // ...gli altri state del Day 4 (selectedAccountId, hideBalance, filter, searchText)

  useEffect(() => {
    const controller = new AbortController();

    async function loadTransactions() {
      try {
        const remoteTransactions = await getTransactions({
          signal: controller.signal,
        });

        setTransactions((current) => {
          const remoteIds = new Set(remoteTransactions.map((item) => item.id));
          const localOnly = current.filter((item) => !remoteIds.has(item.id));
          return [...localOnly, ...remoteTransactions];
        });
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
      }
    }

    loadTransactions();

    return () => controller.abort();
  }, []);

  // ...handleAddTransfer e JSX del Day 4
}
```

Cosa fa: alla comparsa della dashboard richiede i movimenti e li mette nello state. Perché funziona: dipendenze `[]` (l'effect non legge valori reattivi: `getTransactions` e `setTransactions` sono stabili), il cleanup annulla la richiesta in corso. Errori da evitare: `useEffect(async ...)`, dimenticare l'`AbortError` nel `catch`.

Lo schema `if (err.name === "AbortError") return;` è necessario perché `abort()` fa rifiutare la Promise: senza questa riga il cleanup di `StrictMode` farebbe comparire un finto errore.

### 4. Aggiornare il calcolo del saldo
Nel Day 4 `getDisplayedBalance` riconosceva i bonifici simulati confrontando gli `id` con quelli di `mockData.js` (`initialTransactionIds`). Ora `Dashboard.jsx` non importa più `transactions` da `mockData.js`, quindi quel `Set` va eliminato (insieme all'alias `transactions as initialTransactions`). Un bonifico simulato si riconosce dalla categoria `"Bonifici"`, che nel JSON non esiste. Sostituisci la funzione, sempre fuori dal componente:

```javascript
function getDisplayedBalance(account, transactions) {
  const simulatedDelta = transactions
    .filter(
      (transaction) =>
        transaction.accountId === account.id && transaction.category === "Bonifici",
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return Math.round((account.balance + simulatedDelta) * 100) / 100;
}
```

Perché: i movimenti del JSON sono già compresi nel saldo del conto (`balance` di `mockData.js`); solo i bonifici aggiunti in questa sessione lo modificano. Il resto del Day 4 (`accountsWithBalance`, form, validazione) non cambia.

### 5. Cosa vedi in sviluppo
Nella scheda **Network** degli strumenti del browser, filtrando per `transactions.json`, in `npm run dev` compaiono tipicamente due richieste: la prima risulta annullata (cleanup di `StrictMode`), la seconda completa. In produzione ce n'è una sola.

### 6. `fetch` e gli errori HTTP
Per vedere perché `response.ok` conta, prova temporaneamente a cambiare l'URL nel service in `"/data/non-esiste.json"`. Il comportamento dipende dal server: il dev server di Vite può rispondere con `index.html` e status `200`, quindi `response.ok` è `true` ma `response.json()` fallisce con un `SyntaxError` (il contenuto inizia con `<`). In un server che risponde `404`, `response.ok` sarebbe `false` e partirebbe il nostro `throw`. In entrambi i casi il `catch` intercetta l'errore. Ripristina l'URL corretto al termine.

---

## 🏦 LipariBank in action

### Bonifici locali e dati remoti
I bonifici del Day 4 vivono solo nello state: nessun server li salva. La regola scelta:

1. il fetch iniziale **carica** i movimenti nello state;
2. i bonifici aggiunti dopo vengono **appesi** allo state (`handleAddTransfer` come nel Day 4);
3. l'effect parte solo al mount, quindi non sovrascrive mai ciò che l'utente ha aggiunto dopo;
4. per sicurezza il `setTransactions` usa la forma funzionale: tiene i movimenti locali con id non presenti nei dati remoti e li mette in testa.

Un ricaricamento della pagina (F5) azzera i bonifici locali: è il comportamento atteso senza backend.

### Cosa manca
Subito dopo il caricamento pagina c'è un attimo in cui `transactions` è `[]` e la lista mostra "nessun movimento", poi compaiono i dati. Questo sfarfallio è proprio ciò che risolveremo con gli stati di loading/error nel [capitolo 05](./05_Loading_Error_Empty_States.md).

---

## 🧪 Your Turn

**Obiettivo:** caricare i movimenti dal file JSON.

**Requisiti:**
1. Crea `public/data/transactions.json` con gli 8 movimenti e verificalo nel browser.
2. Crea `src/services/transactionService.js` con `getTransactions({ signal })` che controlla `response.ok`.
3. In `Dashboard.jsx` inizializza `transactions` con `[]` e carica i dati in un `useEffect` con `AbortController`, ignorando `AbortError`; aggiorna `getDisplayedBalance` come nel punto 4 della sezione Let's Code.
4. Verifica: lista dei movimenti identica a prima; in Network vedi la prima richiesta annullata e la seconda completata (in `npm run dev`).
5. Aggiungi un bonifico dal form: compare in lista e non sparisce.

**Passi suggeriti:** prima il JSON, poi il service (provalo con un `console.log(await getTransactions())` temporaneo in un effect), poi la dashboard.

**Risultato atteso:** dashboard funzionante con dati da `/data/transactions.json`.

**Criteri di completamento:** nessun errore in console, nessun import di `transactions` da `mockData.js` in `Dashboard.jsx`, bonifici locali conservati, saldi corretti dopo un bonifico (es. -50 € dal Conto Corrente → 4.200,75 €).

---

## ⚠️ Common Mistakes
- **Credere che `fetch` fallisca con 404/500.** Controlla `response.ok`.
- **Mettere il file JSON in `src/` e chiamarlo con `fetch`.** Il file deve stare in `public/` per essere servito all'URL `/data/...`.
- **Percorso senza `/` iniziale** (`data/transactions.json`): diventa relativo all'URL corrente e fallisce nelle pagine annidate (Day 6).
- **Dimenticare `await response.json()`** o `return`: avresti una Promise al posto dei dati.
- **`setTransactions(remoteTransactions)` diretto con form già in uso**: sovrascrive i bonifici locali.
- **Lasciare `initialTransactionIds` nel `Dashboard` dopo aver tolto l'import di `transactions`**: l'app non parte (`initialTransactions is not defined`) oppure i saldi sono sbagliati.
- **Stampare come "errore" l'`AbortError`.**

---

## ✅ Checklist
- ☐ `public/data/transactions.json` valido e raggiungibile.
- ☐ `getTransactions({ signal })` controlla `response.ok`.
- ☐ L'effect usa `AbortController` e ignora `AbortError`.
- ☐ Ho letto la scheda Network e capito le due richieste in sviluppo.
- ☐ I bonifici locali non vengono persi.

---

## 🚀 Challenge
Aggiungi `await wait(1000)` nel service (con una funzione `wait(ms)` definita nel file temporaneo `src/utils/wait.js`, come nel capitolo successivo) e osserva cosa succede nell'intervallo prima dell'arrivo dei dati.

---

## 📌 Recap
- `fetch` restituisce una Promise di `Response`; `response.json()` ne restituisce un'altra.
- Gli errori HTTP non rifiutano la Promise: si controlla `response.ok`.
- Il service nasconde la fonte dei dati; il file JSON locale è uno stand-in sostituibile da un'API reale.
- L'effect di caricamento usa `AbortController` e ignora `AbortError`.

---

### ➡️ Next
[Capitolo 05 — Loading, Error ed Empty States](./05_Loading_Error_Empty_States.md): mostrare all'utente cosa sta succedendo mentre i dati arrivano.
