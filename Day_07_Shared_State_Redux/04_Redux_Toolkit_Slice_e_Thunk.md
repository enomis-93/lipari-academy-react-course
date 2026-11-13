# 🏦 LipariBank — React Zero to Hero

> **Day 7 · Capitolo 04**
> **Argomento:** Redux Toolkit: slice e thunk
> **Durata stimata:** 60 minuti
> **Parte di LipariBank:** le regole di `bankReducer` e il caricamento dei movimenti entrano nello store (`transactionsSlice`, `accountsSlice`, `fetchTransactions`)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- scrivere uno slice con `createSlice`, ottenendo insieme reducer e action;
- spiegare perché dentro uno slice si può "mutare" lo state e fuori no;
- preparare il contenuto di un'action con `prepare`, lasciando puro il reducer;
- far reagire due slice alla stessa action con `extraReducers`;
- caricare dati in modo asincrono con `createAsyncThunk` e uno `status`;
- provare la logica dello store senza React.

---

## 📋 Prerequisiti
- [Capitolo 03 — Redux: quando e perché](./03_Redux_Quando_e_Perche.md): store creato con `accountsSlice`, `Provider` montato, Redux DevTools installati.
- [Capitolo 02 — useReducer](./02_useReducer.md): conosci `bankReducer` e le sue cinque azioni.
- [Day 3 · Immutabilità dello State](../Day_03_State_Events/05_Immutabilita_dello_State.md).

---

## 🧭 In questo capitolo
- Slice: reducer e action generati insieme.
- Immer: scrivere aggiornamenti "mutabili" in sicurezza.
- `prepare` per i valori che cambiano a ogni chiamata.
- `extraReducers`: un'action, due slice.
- Thunk, `createAsyncThunk` e `status`.
- Verifica con Node e con i Redux DevTools.

---

## 🧠 Theory

### Uno slice: reducer e action insieme
Nel capitolo 02 hai scritto a mano tre cose separate: le stringhe dei tipi (`"ADD_TRANSFER"`), lo `switch` del reducer e gli oggetti action nei punti in cui chiamavi `dispatch`. Un refuso in una stringa e l'azione non veniva riconosciuta.

`createSlice` genera tutto da un'unica definizione. Per ogni funzione che scrivi in `reducers` ottieni:

- il **reducer** per quel caso;
- un **action creator**, cioè una funzione che costruisce l'action: `favoriteToggled("trx-003")` restituisce `{ type: "transactions/favoriteToggled", payload: "trx-003" }`.

Il tipo è composto dal `name` dello slice e dal nome della funzione. Non scrivi più stringhe a mano.

### Nomi al passato
Le action di Redux descrivono **un fatto avvenuto**, non un ordine: `transferAdded` ("è stato aggiunto un bonifico") invece di `ADD_TRANSFER` ("aggiungi un bonifico"). La differenza sembra di stile, ma aiuta: lo stesso fatto può interessare più parti dello state, e leggere l'elenco delle action nei DevTools equivale a leggere la cronaca di ciò che l'utente ha fatto.

### "Mutare" lo state senza mutarlo: Immer
Confronta lo stesso aggiornamento nelle due versioni.

Con `useReducer` (capitolo 02):

```javascript
case "TOGGLE_FAVORITE":
  return {
    ...state,
    transactions: state.transactions.map((transaction) =>
      transaction.id === action.payload
        ? { ...transaction, isFavorite: !transaction.isFavorite }
        : transaction,
    ),
  };
```

Con `createSlice`:

```javascript
favoriteToggled(state, action) {
  const transaction = state.items.find((item) => item.id === action.payload);
  if (transaction) {
    transaction.isFavorite = !transaction.isFavorite;
  }
},
```

La seconda versione sembra violare la regola del Day 3. Non la viola: Redux Toolkit usa una libreria, **Immer**, che ti consegna una *bozza* dello state. Tu modifichi la bozza; Immer registra le modifiche e produce un nuovo state immutabile, copiando solo le parti toccate.

Due avvertenze:

- Vale **solo** dentro `createSlice`. Nei componenti, in `useState` e in `useReducer` le regole del Day 3 restano identiche.
- In un reducer o modifichi la bozza, o restituisci un nuovo valore: mai le due cose insieme.

### Valori non deterministici: `prepare`
Un reducer deve essere puro: niente `Date`, niente identificativi casuali. Nel capitolo 02 il movimento di un bonifico veniva costruito nell'handler della pagina, prima del `dispatch`.

Redux Toolkit offre un posto migliore. Un caso di `reducers` può essere un oggetto con due funzioni:

- `prepare(...)` riceve gli argomenti dell'action creator e costruisce il `payload`. Qui **si possono** generare id e date.
- `reducer(state, action)` riceve il payload già pronto e resta puro.

Così la conoscenza di "com'è fatto un movimento di bonifico" sta accanto allo slice dei movimenti, non sparsa nelle pagine.

### Un'action, due slice: `extraReducers`
Un bonifico cambia due cose: l'elenco dei movimenti e il saldo di un conto. In `bankReducer` era un solo `case` che aggiornava entrambe. Con gli slice i conti e i movimenti stanno in file diversi, e **ogni reducer vede solo il proprio pezzo di state**.

La soluzione è che entrambi reagiscano alla stessa action. Lo slice dei movimenti definisce `transferAdded`; lo slice dei conti la ascolta in `extraReducers`, la sezione dedicata alle action nate altrove. Un solo `dispatch`, due reducer, un unico aggiornamento dello store.

### Logica asincrona: i thunk
I reducer sono sincroni: ricevono un'action e restituiscono subito il nuovo state. Per le operazioni che richiedono tempo serve un **thunk**: una funzione che puoi passare a `dispatch` al posto di un oggetto, e che può fare lavoro asincrono e inviare altre action.

`createAsyncThunk` ne costruisce uno a partire da un nome e da una funzione `async`, e genera tre action:

| Action | Quando | Nel capitolo 02 era |
|---|---|---|
| `fetchTransactions.pending` | Il caricamento parte | `LOAD_START` |
| `fetchTransactions.fulfilled` | La `Promise` va a buon fine; il risultato è in `action.payload` | `LOAD_SUCCESS` |
| `fetchTransactions.rejected` | La `Promise` fallisce | `LOAD_ERROR` |

Anche queste si gestiscono in `extraReducers`.

### `status` al posto di `isLoading`
Invece di un booleano usiamo un campo con quattro valori: `"idle"` (mai caricato), `"loading"`, `"succeeded"`, `"failed"`. Un solo campo non può contraddirsi, e `"idle"` distingue "non ho ancora provato" da "ho provato e non c'era niente".

### Evitare i caricamenti doppi: `condition`
In sviluppo `StrictMode` esegue gli effect due volte. Nel Day 5 annullavamo la prima richiesta con `AbortController`. Ora c'è un'alternativa più semplice: lo store **sa** se un caricamento è già in corso. L'opzione `condition` di `createAsyncThunk` riceve una funzione che legge lo state: se restituisce `false`, il thunk non parte nemmeno.

> 💡 **Remember**
>
> Dentro `createSlice` scrivi come se mutassi lo state: Immer ne produce comunque uno nuovo. Fuori da lì, le regole di immutabilità del Day 3 non cambiano.

---

## 💻 Let's Code

### 1. Lo slice dei movimenti
Crea `src/store/transactionsSlice.js`, per ora con la sola parte sincrona:

```javascript title="src/store/transactionsSlice.js"
import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    transferAdded: {
      reducer(state, action) {
        state.items.unshift(action.payload);
      },
      prepare({ accountId, beneficiaryName, amount }) {
        return {
          payload: {
            id: `trx-${nanoid(8)}`,
            accountId,
            date: new Date().toISOString().slice(0, 10),
            description: `Bonifico a ${beneficiaryName}`,
            amount: -amount,
            category: "Bonifici",
          },
        };
      },
    },
    favoriteToggled(state, action) {
      const transaction = state.items.find((item) => item.id === action.payload);
      if (transaction) {
        transaction.isFavorite = !transaction.isFavorite;
      }
    },
  },
});

export const { transferAdded, favoriteToggled } = transactionsSlice.actions;

export const selectTransactions = (state) => state.transactions.items;
export const selectTransactionsStatus = (state) => state.transactions.status;
export const selectTransactionsError = (state) => state.transactions.error;

export default transactionsSlice.reducer;
```

- `transferAdded` è un oggetto con `prepare` e `reducer`. La pagina passerà solo ciò che sa (`accountId`, `beneficiaryName`, `amount`); `prepare` aggiunge id, data, descrizione e categoria. `nanoid` è un generatore di identificativi incluso in Redux Toolkit.
- `state.items.unshift(...)` inserisce il movimento in testa: nel Day 3 sarebbe stata una mutazione vietata, qui è sulla bozza di Immer.
- `favoriteToggled` cerca il movimento e ne inverte il campo.
- I tre selector in fondo sono il modo in cui i componenti leggeranno questo slice.

### 2. Lo slice dei conti reagisce al bonifico
Sostituisci `src/store/accountsSlice.js`:

```javascript title="src/store/accountsSlice.js"
import { createSlice } from "@reduxjs/toolkit";
import { accounts as mockAccounts } from "../data/mockData.js";
import { transferAdded } from "./transactionsSlice.js";

function roundCents(value) {
  return Math.round(value * 100) / 100;
}

const accountsSlice = createSlice({
  name: "accounts",
  initialState: { items: mockAccounts },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(transferAdded, (state, action) => {
      const account = state.items.find((item) => item.id === action.payload.accountId);
      if (account) {
        account.balance = roundCents(account.balance + action.payload.amount);
      }
    });
  },
});

export const selectAccounts = (state) => state.accounts.items;

export default accountsSlice.reducer;
```

`addCase(transferAdded, ...)` significa: "quando arriva l'action `transferAdded`, anche questo slice ha qualcosa da fare". Il saldo viene aggiornato sommando `amount`, che per un bonifico è negativo, con lo stesso arrotondamento ai centesimi di `bankReducer`.

### 3. Aggiungere lo slice allo store
`src/store/store.js`:

```javascript title="src/store/store.js"
import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./accountsSlice.js";
import transactionsReducer from "./transactionsSlice.js";

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    transactions: transactionsReducer,
  },
});
```

### 4. Verifica senza React
Lo store è JavaScript puro: si prova con Node, come avevi fatto con il reducer. Dentro `liparibank/` crea il file temporaneo `try-store.js`:

```javascript title="try-store.js"
import { store } from "./src/store/store.js";
import { favoriteToggled, transferAdded } from "./src/store/transactionsSlice.js";

const before = store.getState();

store.dispatch(
  transferAdded({ accountId: "acc-001", beneficiaryName: "Giulia Bianchi", amount: 50 }),
);

const after = store.getState();
const transfer = after.transactions.items[0];

console.log(after.accounts.items[0].balance, after.transactions.items.length);
console.log(transfer.description, transfer.amount);
console.log(before.accounts.items[0].balance, before.transactions.items.length);

store.dispatch(favoriteToggled(transfer.id));
console.log(store.getState().transactions.items[0].isFavorite);
```

Esegui, dentro `liparibank/`:

```bash
node try-store.js
```

Output atteso:

```text
4200.75 1
Bonifico a Giulia Bianchi -50
4250.75 0
true
```

- Riga 1: dopo **un solo** `dispatch` il saldo è sceso e c'è un movimento. Hanno lavorato due reducer.
- Riga 2: descrizione e importo negativo li ha costruiti `prepare`.
- Riga 3: lo state letto *prima* del `dispatch` è rimasto com'era. Immer ha prodotto uno state nuovo senza toccare il vecchio.
- Riga 4: `favoriteToggled` ha trovato il movimento tramite l'id generato da `prepare`.

### 5. Il caricamento asincrono
Completa `src/store/transactionsSlice.js` con il thunk e con i tre casi che lo gestiscono. Versione finale del file:

```javascript title="src/store/transactionsSlice.js"
import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import { getTransactions } from "../services/transactionService.js";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { signal }) => getTransactions({ signal }),
  {
    condition: (_, { getState }) => getState().transactions.status !== "loading",
  },
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    transferAdded: {
      reducer(state, action) {
        state.items.unshift(action.payload);
      },
      prepare({ accountId, beneficiaryName, amount }) {
        return {
          payload: {
            id: `trx-${nanoid(8)}`,
            accountId,
            date: new Date().toISOString().slice(0, 10),
            description: `Bonifico a ${beneficiaryName}`,
            amount: -amount,
            category: "Bonifici",
          },
        };
      },
    },
    favoriteToggled(state, action) {
      const transaction = state.items.find((item) => item.id === action.payload);
      if (transaction) {
        transaction.isFavorite = !transaction.isFavorite;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.status = "failed";
        state.error = "Impossibile caricare i movimenti. Riprova più tardi.";
      });
  },
});

export const { transferAdded, favoriteToggled } = transactionsSlice.actions;

export const selectTransactions = (state) => state.transactions.items;
export const selectTransactionsStatus = (state) => state.transactions.status;
export const selectTransactionsError = (state) => state.transactions.error;

export default transactionsSlice.reducer;
```

Che cosa è cambiato:

- `fetchTransactions` chiama lo stesso service del Day 5, `getTransactions`. Il secondo argomento della funzione `async` è un oggetto fornito da Redux Toolkit: ne usiamo il `signal`, lo stesso tipo di segnale di `AbortController`.
- `condition` blocca il thunk se un caricamento è già in corso.
- `extraReducers` aggiorna `status`, `items` ed `error` nei tre momenti del caricamento. Nel caso `fulfilled`, `action.payload` è ciò che la funzione `async` ha restituito: l'elenco dei movimenti.

### 6. Far partire il caricamento
Qualcuno deve inviare il thunk all'avvio. Lo fa `App`, che è sempre a schermo. `src/App.jsx`:

```jsx title="src/App.jsx"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router";
import AppLayout from "./layouts/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AccountsPage from "./pages/AccountsPage.jsx";
import AccountDetailPage from "./pages/AccountDetailPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import TransferPage from "./pages/TransferPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { fetchTransactions } from "./store/transactionsSlice.js";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />

        <Route path="accounts" element={<AccountsPage />}>
          <Route
            index
            element={<p className="hint">Seleziona un conto per vederne i dettagli.</p>}
          />
          <Route path=":accountId" element={<AccountDetailPage />} />
        </Route>

        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="transfer" element={<TransferPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
```

`useDispatch()` restituisce la funzione `dispatch` dello store. L'effect parte al primo render; `StrictMode` lo esegue due volte, ma la seconda chiamata viene fermata da `condition`.

### 7. Guardare le action nei DevTools
Ricarica la pagina e apri il tab Redux. Nell'elenco trovi:

1. `@@INIT`
2. `transactions/fetchTransactions/pending`
3. `transactions/fetchTransactions/fulfilled`

Seleziona la terza e apri la scheda *Diff*: mostra esattamente che cosa quell'action ha cambiato, cioè `status` passato a `"succeeded"` e `items` riempito con otto movimenti. Nella scheda *State* trovi lo state completo dopo quell'action.

C'è **una sola** coppia `pending`/`fulfilled`, anche se l'effect è partito due volte: è il lavoro di `condition`.

> ⚠️ In questo momento i movimenti vengono caricati due volte, da `BankProvider` e dallo store, e le due copie sono indipendenti. È la situazione provvisoria della migrazione: le pagine leggono ancora da `BankContext`. Le collegheremo allo store nel prossimo capitolo.

**Errori da evitare.** Dimenticare di aggiungere il reducer in `store.js`: lo slice esisterebbe, ma `state.transactions` sarebbe `undefined` e i selector darebbero errore.

---

## 🏦 LipariBank in action

Ecco dove è finita ogni parte del lavoro fatto nel capitolo 02:

```text
PRIMA (src/context)                      DOPO (src/store)
bankReducer: ADD_TRANSFER        ==>     transferAdded     (transactionsSlice + accountsSlice)
bankReducer: TOGGLE_FAVORITE     ==>     favoriteToggled   (transactionsSlice)
bankReducer: LOAD_START/SUCCESS/ERROR => fetchTransactions pending / fulfilled / rejected
BankProvider: useEffect + fetch  ==>     thunk fetchTransactions, inviato da App
isLoading + error                ==>     status + error
```

Il comportamento è lo stesso; è cambiato **dove** vive e **come** si osserva. La logica dei bonifici, per esempio, non è più dentro un componente: l'hai appena eseguita da terminale.

---

## 🧪 Your Turn

**Obiettivo:** provare la logica dello store, compreso il caso di errore, senza aprire il browser.

**Requisiti:**
1. In `try-store.js` aggiungi un secondo bonifico di `100` dal Conto Risparmio (`acc-002`) e stampa i due saldi: devono valere `4200.75` e `12700`.
2. Aggiungi in fondo al file il caricamento dei movimenti e stampa `status` prima, durante e dopo:

```javascript
import { fetchTransactions } from "./src/store/transactionsSlice.js";

console.log(store.getState().transactions.status);
const loading = store.dispatch(fetchTransactions());
console.log(store.getState().transactions.status);
await loading;
console.log(store.getState().transactions.status, store.getState().transactions.error);
```

3. Spiega l'ultima riga stampata.
4. Nei DevTools, esegui un bonifico dalla pagina e verifica che **non** compaia `transactions/transferAdded`. Spiega perché.
5. Elimina `try-store.js`.

**Passi suggeriti:**
1. Sposta l'`import` di `fetchTransactions` in cima al file, insieme agli altri.
2. Per il punto 3 chiediti: da terminale, a quale server arriva la richiesta di `/data/transactions.json`?

**Risultato atteso:** per il punto 2 il terminale stampa `idle`, poi `loading`, poi `failed Impossibile caricare i movimenti. Riprova più tardi.`

**Criteri di completamento:** sai spiegare i punti 3 e 4; `try-store.js` non esiste più; `npm run lint` e `npm run build` senza errori.

### Soluzione di riferimento — punti 3 e 4
**Punto 3.** Fuori dal browser non c'è nessun server di sviluppo a cui chiedere `/data/transactions.json`: la richiesta fallisce, il thunk invia `rejected` e il reducer imposta `status: "failed"` con il messaggio d'errore. Hai appena provato il percorso d'errore senza simulare nulla.

**Punto 4.** La pagina del bonifico chiama ancora `addTransfer` di `BankContext`: nessuno ha inviato un'action allo store. La logica è pronta, ma i componenti non sono ancora collegati.

---

## ⚠️ Common Mistakes

| Errore | Sintomo | Correzione |
|---|---|---|
| Usare la sintassi "mutabile" fuori da `createSlice` | La UI non si aggiorna | Nei componenti e in `useState` valgono le regole del Day 3 |
| Modificare la bozza **e** restituire un valore nello stesso reducer | Errore di Immer in console | Fai una sola delle due cose |
| `Date.now()` o id casuali dentro il reducer | Il reducer non è più puro; stati non riproducibili | Generali in `prepare` |
| Aspettarsi che uno slice legga lo state di un altro | `state.accounts` è `undefined` dentro lo slice dei movimenti | Ogni reducer vede solo il proprio slice: metti nell'action ciò che serve |
| Dimenticare lo slice in `configureStore` | `Cannot read properties of undefined` nei selector | Aggiungi il reducer alla chiave giusta |
| `dispatch(fetchTransactions)` senza parentesi | Non parte alcun caricamento | `dispatch(fetchTransactions())` |
| `fetch` dentro un reducer | Il reducer non restituisce subito lo state | Usa un thunk |

---

## ✅ Checklist
- ☐ So spiegare che cosa genera `createSlice` a partire da `reducers`.
- ☐ So perché dentro uno slice posso scrivere `state.items.unshift(...)`.
- ☐ `transferAdded` usa `prepare` per id e data.
- ☐ `accountsSlice` aggiorna il saldo reagendo a `transferAdded`.
- ☐ `node try-store.js` stampa le quattro righe attese.
- ☐ `fetchTransactions` carica i movimenti e vedo `pending` e `fulfilled` nei DevTools, una volta sola.
- ☐ Ho eliminato `try-store.js`.

---

## 🚀 Challenge
Riscrivi in Redux l'esercizio del capitolo 02: un'action `transferRemoved` che toglie un bonifico e ripristina il saldo del conto. Attenzione: lo slice dei conti non può leggere l'elenco dei movimenti per sapere di quanto ripristinare. Che cosa deve contenere il `payload` perché entrambi gli slice abbiano ciò che serve? Verifica con `try-store.js`. È un'estensione facoltativa: i capitoli successivi non la usano.

---

## 📌 Recap
- `createSlice` genera reducer e action da un'unica definizione; i tipi hanno la forma `slice/azione`.
- Dentro uno slice Immer permette di scrivere aggiornamenti "mutabili" che producono comunque uno state nuovo.
- `prepare` costruisce il payload (id, date) e tiene puro il reducer.
- Con `extraReducers` più slice reagiscono alla stessa action: un `dispatch`, più aggiornamenti.
- `createAsyncThunk` genera `pending`, `fulfilled`, `rejected`; uno `status` sostituisce `isLoading`.
- Lo store è JavaScript puro: si prova con Node, senza React.

---

### ➡️ Next
Prossimo capitolo: [05 · React Redux: selector e dispatch](./05_React_Redux_Selector_e_Dispatch.md). La logica è nello store: ora colleghiamo le pagine e misuriamo di nuovo i re-render.
