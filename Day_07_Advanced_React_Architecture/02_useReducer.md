# 🏦 LipariBank — React Zero to Hero

> **Day 7 · Capitolo 02**
> **Argomento:** `useReducer` e lo state condiviso di LipariBank
> **Durata stimata:** 55 minuti
> **Parte di LipariBank:** `bankReducer.js` e `BankContext.jsx` (conti, movimenti, caricamento, errore, bonifici simulati)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- scrivere un reducer come funzione pura che non muta lo state;
- usare `useReducer` con `dispatch` e azioni (`LOAD_START`, `LOAD_SUCCESS`, `LOAD_ERROR`, `ADD_TRANSFER` e `TOGGLE_FAVORITE`, già presente in `App.jsx` dal Day 3);
- combinare `useReducer` e Context in un `BankProvider` con l'hook `useBank`;
- scegliere tra `useState` e `useReducer` con criteri concreti.

---

## 📋 Prerequisiti
- [Cap. 01 · Context e useContext](./01_Context_e_useContext.md) (Provider + hook dedicato).
- [Day 5 · Loading, Error, Empty States](../Day_05_Effects_API/05_Loading_Error_Empty_States.md) e [Day 5 · Dipendenze e Cleanup](../Day_05_Effects_API/03_Dipendenze_e_Cleanup.md) (`AbortController`).
- Stato del progetto: `App.jsx` possiede ancora `transactions`, `isLoading`, `error`, `handleRetry`, `handleToggleFavorite`, `addTransfer` e li passa via props. **In questo capitolo non lo tocchiamo**: creiamo i nuovi file senza collegarli; il collegamento avviene nel [cap. 07](./07_Esercizio_Refactoring_LipariBank.md).

---

## 🧭 In questo capitolo
- Quando `useState` non basta più.
- Reducer, action, `dispatch`.
- Il reducer di LipariBank e una verifica senza React.
- `BankProvider` e `useBank`.

---

## 🧠 Theory

### Il problema di `useState` multipli
Nel caricamento dati di Day 5 abbiamo tre state che cambiano **insieme**: `transactions`, `isLoading`, `error`. Ogni transizione ("inizia il caricamento", "è arrivato", "è fallito") richiede più `setXxx` coordinati e basta dimenticarne uno per ottenere uno stato incoerente (per esempio `isLoading` ancora `true` con un errore visibile).

### Reducer in una frase
Un **reducer** è una funzione `(state, action) => nuovoState`. Descrivi *cosa è successo* con un'**action** (`{ type: "LOAD_ERROR", payload: "..." }`) e il reducer decide *come cambia lo state*.

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: "LOAD_START" });
```

Regole del reducer:
- **pura**: stesso input → stesso output; niente `fetch`, niente `Date.now()`, niente `console.log` di effetti;
- **non muta** lo state: restituisce un nuovo oggetto (spread, `map`, `filter`);
- gestisce ogni `type` noto; per un `type` sconosciuto è meglio lanciare un errore che ignorarlo in silenzio (un refuso diventa subito visibile).

I side effect (la chiamata `fetch`) restano **fuori** dal reducer, in un `useEffect`: l'effect fa il lavoro asincrono e fa `dispatch` del risultato.

### `useState` o `useReducer`?

| Criterio | `useState` | `useReducer` |
|---|---|---|
| Un valore semplice (booleano, stringa) | ✅ | eccessivo |
| Più valori che cambiano insieme | scomodo | ✅ |
| Il prossimo state dipende da regole di business | sparse nei componenti | centralizzate e testabili |
| Molte azioni diverse sullo stesso state | confuso | ✅ |

> 💡 **Remember**
>
> `useReducer` non è "più avanzato" né "migliore": è utile quando la logica di aggiornamento diventa abbastanza articolata da meritare un posto dedicato. `hideBalance` resta un banale `useState`.

---

## 💻 Let's Code

### 1. Il reducer
Crea `src/context/bankReducer.js`:

```javascript
export const initialState = {
  accounts: [],
  transactions: [],
  isLoading: true,
  error: null,
};

function roundCents(value) {
  return Math.round(value * 100) / 100;
}

export function bankReducer(state, action) {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };

    case "LOAD_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: null,
        accounts: action.payload.accounts,
        transactions: action.payload.transactions,
      };

    case "LOAD_ERROR":
      return { ...state, isLoading: false, error: action.payload };

    case "ADD_TRANSFER":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        accounts: state.accounts.map((account) =>
          account.id === action.payload.accountId
            ? { ...account, balance: roundCents(account.balance + action.payload.amount) }
            : account,
        ),
      };

    case "TOGGLE_FAVORITE":
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload
            ? { ...transaction, isFavorite: !transaction.isFavorite }
            : transaction,
        ),
      };

    default:
      throw new Error(`Azione non gestita: ${action.type}`);
  }
}
```

Cosa fa: `initialState` parte con `isLoading: true` (all'avvio stiamo per caricare). `ADD_TRANSFER` aggiorna **due** parti dello stato in un colpo solo: aggiunge il movimento (`amount` è negativo per un'uscita) e scala il saldo del conto addebitato, arrotondando ai centesimi come faceva `getDisplayedBalance` in `App.jsx`. `TOGGLE_FAVORITE` sostituisce `handleToggleFavorite` di Day 3: il "preferito" è un campo `isFavorite` aggiunto al movimento. Nessuna mutazione: `[nuovo, ...vecchi]`, `map` e spread.

`LOAD_SUCCESS` sostituisce i dati: va bene perché nell'app il ricaricamento parte solo dal pulsante "Riprova" dopo un errore, cioè quando non ci sono ancora dati (né bonifici) da conservare.

> Nel Day 6 `App.jsx` calcola il saldo mostrato con la funzione `getDisplayedBalance` (conti di `mockData.js` + bonifici simulati). Nel [cap. 07](./07_Esercizio_Refactoring_LipariBank.md) la elimini: ora il saldo vive nello state e lo aggiorna il reducer, altrimenti conteresti i bonifici due volte.

Nota: in un'app reale gli importi in virgola mobile si gestiscono in centesimi interi; per il corso usiamo numeri con due decimali come nei dati fittizi.

### 2. Verifica senza React
Un reducer pura si prova con Node. Dentro `liparibank/` crea il file temporaneo `try-reducer.js`:

```javascript
import { bankReducer, initialState } from "./src/context/bankReducer.js";

const accounts = [
  { id: "acc-001", name: "Conto Corrente", iban: "IT00 0000 0000 0000 0000 0000 000", balance: 4250.75, currency: "EUR" },
];

const transfer = {
  id: "trx-test",
  accountId: "acc-001",
  date: "2026-10-28",
  description: "Bonifico a Giulia Bianchi",
  amount: -50,
  category: "Bonifici",
};

let state = bankReducer(initialState, { type: "LOAD_SUCCESS", payload: { accounts, transactions: [] } });
state = bankReducer(state, { type: "ADD_TRANSFER", payload: transfer });

console.log(state.accounts[0].balance, state.transactions.length, initialState.transactions.length);
```

Esegui, dentro `liparibank/`:

```bash
node try-reducer.js
```

Output atteso:

```text
4200.75 1 0
```

L'ultimo `0` prova che `initialState` non è stato mutato. Quando hai finito, elimina `try-reducer.js`.

### 3. Reducer + Context: `BankProvider`
Crea `src/context/BankContext.jsx`:

```jsx
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { bankReducer, initialState } from "./bankReducer";
import { getTransactions } from "../services/transactionService";
import { accounts as mockAccounts } from "../data/mockData";

const BankContext = createContext(null);

export function BankProvider({ children }) {
  const [state, dispatch] = useReducer(bankReducer, initialState);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      dispatch({ type: "LOAD_START" });
      try {
        const transactions = await getTransactions({ signal: controller.signal });
        dispatch({ type: "LOAD_SUCCESS", payload: { accounts: mockAccounts, transactions } });
      } catch (error) {
        if (error.name === "AbortError") return;
        dispatch({ type: "LOAD_ERROR", payload: "Impossibile caricare i movimenti. Riprova più tardi." });
      }
    }

    load();
    return () => controller.abort();
  }, [reloadKey]);

  const addTransfer = useCallback((transaction) => {
    dispatch({ type: "ADD_TRANSFER", payload: transaction });
  }, []);

  const toggleFavorite = useCallback((transactionId) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: transactionId });
  }, []);

  const reload = useCallback(() => {
    setReloadKey((current) => current + 1);
  }, []);

  const value = useMemo(
    () => ({ ...state, addTransfer, toggleFavorite, reload }),
    [state, addTransfer, toggleFavorite, reload],
  );

  return <BankContext value={value}>{children}</BankContext>;
}

export function useBank() {
  const context = useContext(BankContext);
  if (context === null) {
    throw new Error("useBank deve essere usato dentro <BankProvider>.");
  }
  return context;
}
```

Come funziona:
- il caricamento è lo stesso di Day 5 (`useEffect` + `AbortController`), ma invece di tre `setXxx` fa `dispatch` di azioni;
- `AbortError` viene ignorato: in `StrictMode` l'effect parte, viene annullato e riparte, ed è normale;
- `reload` incrementa `reloadKey`, l'effect si riesegue: sarà il pulsante "Riprova" dei messaggi di errore;
- i conti arrivano per ora da `mockData.js`; nel [cap. 06](./06_Service_Layer_e_API.md) li leggeremo dal service.

Da evitare: mettere il `fetch` dentro il reducer (non sarebbe più pura) e dimenticare il `return () => controller.abort()`.

**Non montare ancora** `BankProvider` in `main.jsx`: `App.jsx` carica già i movimenti e avresti due caricamenti. Il collegamento è nel cap. 07.

Verifica che i nuovi file compilino senza errori di lint, dentro `liparibank/` (un **avviso** `only-export-components` su `BankContext.jsx`, come per `SettingsContext.jsx`, è atteso e non è un errore):

```bash
npm run lint
```

---

## 🏦 LipariBank in action
Confronta il vecchio `App.jsx` con ciò che hai appena creato:

```text
PRIMA (App.jsx)                     DOPO (src/context)
useState(transactions)              bankReducer.js   -> regole di aggiornamento
useState(isLoading)         ==>     BankContext.jsx  -> caricamento + Provider
useState(error)                     useBank()        -> lettura da qualsiasi pagina
function addTransfer(...)           dispatch ADD_TRANSFER
function handleToggleFavorite(...)  dispatch TOGGLE_FAVORITE
function handleRetry()              reload()
```

Tre azioni descrivono tutto il caricamento (`LOAD_START` → `LOAD_SUCCESS` oppure `LOAD_ERROR`): è impossibile avere `isLoading: true` e `error` valorizzato insieme, perché il reducer li aggiorna sempre insieme.

---

## 🧪 Your Turn
**Obiettivo:** estendere il reducer con una nuova azione e verificarla senza React.

**Requisiti:**
1. Aggiungi l'azione `REMOVE_TRANSFER` con `payload` = `id` del movimento: rimuove il movimento e ripristina il saldo del conto (`balance - amount`). Se l'id non esiste, lo state resta com'era.
2. Estendi `try-reducer.js` con un'aggiunta seguita da una rimozione: il saldo finale deve tornare `4250.75` e `transactions.length` `0`.
3. Nessuna mutazione di `state`.

**Suggerimenti:** usa `find` per recuperare il movimento da annullare, `filter` per rimuoverlo, `map` per il saldo. Se `find` non trova nulla, `return state`.

**Risultato atteso:** `node try-reducer.js` stampa `4250.75 0`.

**Criteri di completamento:** il reducer resta puro, `npm run lint` non segnala errori, il file temporaneo è eliminato.

---

## ⚠️ Common Mistakes
- **Mutare lo state** (`state.transactions.push(...)`): React non vede il cambiamento. Restituisci sempre un nuovo oggetto.
- **Side effect nel reducer** (`fetch`, `Date.now()`, `localStorage`): sposta tutto fuori, nell'effect o nel componente che fa `dispatch`.
- **Dimenticare `default`**: un `type` con refuso restituirebbe `undefined` e l'app si romperebbe lontano dalla causa.
- **Passare il reducer chiamato** (`useReducer(bankReducer(), ...)`): si passa la funzione, senza parentesi.
- **Usare `useReducer` per un booleano**: complica senza vantaggi.

---

## ✅ Checklist
- ☐ `bankReducer.js` gestisce le cinque azioni (`LOAD_START`, `LOAD_SUCCESS`, `LOAD_ERROR`, `ADD_TRANSFER`, `TOGGLE_FAVORITE`) e lancia un errore sulle azioni sconosciute.
- ☐ `node try-reducer.js` stampa `4200.75 1 0` (prima dell'esercizio).
- ☐ So spiegare perché il `fetch` sta nell'effect e non nel reducer.
- ☐ `BankContext.jsx` esporta `BankProvider` e `useBank`.
- ☐ `try-reducer.js` è stato eliminato.

---

## 🚀 Challenge
Aggiungi l'azione `RESET` che riporta lo state a `initialState`. Poi chiediti: ha senso esporla da `useBank`? Chi dovrebbe poterla usare?

---

## 📌 Recap
- Un reducer è una funzione pura `(state, action) => nuovoState`.
- `dispatch` descrive *cosa è successo*; il reducer decide *come cambia lo state*.
- I side effect restano in `useEffect`, non nel reducer.
- `useReducer` + Context = state condiviso con regole di aggiornamento centralizzate.
- Si sceglie `useReducer` quando più valori cambiano insieme o le regole crescono, non per default.

---

### ➡️ Next
Prossimo capitolo: [03 · Custom Hooks](./03_Custom_Hooks.md). Estrarremo la logica riusabile (filtri sui movimenti, form bonifico, persistenza su `localStorage`) in hook dedicati.
