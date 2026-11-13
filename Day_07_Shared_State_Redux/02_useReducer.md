# 🏦 LipariBank — React Zero to Hero

> **Day 7 · Capitolo 02**
> **Argomento:** `useReducer` e lo state condiviso di LipariBank
> **Durata stimata:** 80 minuti
> **Parte di LipariBank:** `bankReducer.js` e `BankContext.jsx` (conti, movimenti, caricamento, errore, bonifici simulati); le pagine leggono lo state da `useBank()` e `App.jsx` resta con le sole route

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- scrivere un reducer come funzione pura che non muta lo state;
- usare `useReducer` con `dispatch` e azioni (`LOAD_START`, `LOAD_SUCCESS`, `LOAD_ERROR`, `ADD_TRANSFER` e `TOGGLE_FAVORITE`, già presente in `App.jsx` dal Day 3);
- combinare `useReducer` e Context in un `BankProvider` con l'hook `useBank`;
- collegare le pagine al Provider ed eliminare state e props da `App.jsx`;
- scegliere tra `useState` e `useReducer` con criteri concreti.

---

## 📋 Prerequisiti
- [Cap. 01 · Context e useContext](./01_Context_e_useContext.md) (Provider + hook dedicato).
- [Day 5 · Loading, Error, Empty States](../Day_05_Effects_API/05_Loading_Error_Empty_States.md) e [Day 5 · Dipendenze e Cleanup](../Day_05_Effects_API/03_Dipendenze_e_Cleanup.md) (`AbortController`).
- Stato del progetto: `App.jsx` possiede ancora `transactions`, `isLoading`, `error`, `handleRetry`, `handleToggleFavorite`, `addTransfer` e li passa via props. Alla fine del capitolo conterrà solo le route.

---

## 🧭 In questo capitolo
- Quando `useState` non basta più.
- Reducer, action, `dispatch`.
- Il reducer di LipariBank e una verifica senza React.
- `BankProvider` e `useBank`.
- Montare il Provider e migrare le pagine, una alla volta.

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

```javascript title="src/context/bankReducer.js"
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

> Nel Day 6 `App.jsx` calcola il saldo mostrato con la funzione `getDisplayedBalance` (conti di `mockData.js` + bonifici simulati). Più avanti in questo capitolo la elimini: ora il saldo vive nello state e lo aggiorna il reducer, altrimenti conteresti i bonifici due volte.

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

```jsx title="src/context/BankContext.jsx"
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
- i conti arrivano per ora da `mockData.js`; nel [Day 8](../Day_08_Advanced_Hooks_Architecture/03_Service_Layer_e_Error_Boundary.md) li leggeremo da un service.

Da evitare: mettere il `fetch` dentro il reducer (non sarebbe più pura) e dimenticare il `return () => controller.abort()`.

Verifica che i nuovi file compilino senza errori di lint, dentro `liparibank/` (un **avviso** `only-export-components` su `BankContext.jsx`, come per `SettingsContext.jsx`, è atteso e non è un errore):

```bash
npm run lint
```

### 4. Montare il Provider
Finora hai solo creato dei file: l'app usa ancora lo state di `App.jsx`. Ora colleghiamo il Provider. `src/main.jsx`:

```jsx title="src/main.jsx"
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { BankProvider } from "./context/BankContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SettingsProvider>
      <BankProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </BankProvider>
    </SettingsProvider>
  </StrictMode>,
);
```

`BankProvider` sta dentro `SettingsProvider` e sopra il router: i dati bancari servono a tutte le pagine.

Verifica: l'app funziona **come prima**. Nel tab *Network* degli strumenti di sviluppo vedi due richieste per `transactions.json`: una parte da `App.jsx`, l'altra da `BankProvider`. È atteso e temporaneo.

> ⚠️ Fino alla fine del capitolo convivono due sorgenti dei dati, lo state di `App.jsx` e il `BankProvider`, e **non sono sincronizzate**: un bonifico fatto da una pagina ancora collegata ad `App.jsx` non compare nelle pagine già migrate, e viceversa. Verifica bonifici e preferiti solo a migrazione conclusa.

### 5. La prima pagina: `TransactionsPage`
Migriamo una pagina alla volta, così l'app resta sempre funzionante. La pagina dei movimenti oggi riceve tutto via props:

```jsx
export default function TransactionsPage({ transactions, isLoading, error, onRetry, onToggleFavorite }) {
```

Dopo la migrazione non riceve più nulla: chiede i dati e le azioni a `useBank()`. Sostituisci `src/pages/TransactionsPage.jsx`:

```jsx title="src/pages/TransactionsPage.jsx"
import { useState } from "react";
import { useLocation } from "react-router";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransactionFilters from "../components/TransactionFilters.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { useBank } from "../context/BankContext.jsx";

export default function TransactionsPage() {
  const { transactions, isLoading, error, reload, toggleFavorite } = useBank();
  const location = useLocation();
  const transferCompleted = location.state?.transferCompleted === true;

  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const normalizedSearch = searchText.trim().toLowerCase();

  const visibleTransactions = transactions
    .filter((transaction) => {
      if (filter === "income") return transaction.amount > 0;
      if (filter === "expense") return transaction.amount < 0;
      return true;
    })
    .filter((transaction) => transaction.description.toLowerCase().includes(normalizedSearch))
    .sort((a, b) => b.date.localeCompare(a.date));

  let content;

  if (isLoading) {
    content = <LoadingMessage message="Caricamento dei movimenti..." />;
  } else if (error) {
    content = <ErrorMessage message={error} onRetry={reload} />;
  } else if (transactions.length === 0) {
    content = <EmptyState message="Non ci sono ancora movimenti." />;
  } else {
    content = (
      <TransactionList
        transactions={visibleTransactions}
        onToggleFavorite={toggleFavorite}
      />
    );
  }

  return (
    <section>
      <h1>Movimenti</h1>

      {transferCompleted && (
        <p className="success-message" role="status">
          Bonifico simulato registrato.
        </p>
      )}

      <TransactionFilters
        filter={filter}
        searchText={searchText}
        onFilterChange={setFilter}
        onSearchChange={setSearchText}
      />

      {content}
    </section>
  );
}
```

**Cosa cambia.** Spariscono le cinque props. `reload` prende il posto di `onRetry`, `toggleFavorite` quello di `onToggleFavorite`. Tutto il resto, compresi `filter` e `searchText`, è identico: sono state locale della pagina e non vanno nel Context.

**Perché funziona anche se `App.jsx` passa ancora le props.** Una funzione ignora gli argomenti che non dichiara: le props in più non danno errore. Le toglieremo quando tutte le pagine saranno migrate.

Verifica: `/transactions` mostra gli 8 movimenti, filtri e ricerca funzionano come prima.

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

A migrazione finita il flusso dei dati sarà questo:

```text
PRIMA                                    DOPO
App.jsx (state + fetch + addTransfer)    main.jsx: SettingsProvider > BankProvider
  ├─ props → DashboardPage                 App.jsx: solo <Routes>
  ├─ props → TransactionsPage              pagine → useBank()
  └─ props → TransferPage                  BankProvider → transactionService → JSON
```

---

## 🧪 Your Turn

### Parte A — Completa la migrazione
**Obiettivo:** portare tutte le pagine su `useBank()` e svuotare `App.jsx`, senza cambiare il comportamento dell'app.

**Requisiti:**
1. **`TransferPage`:** legge `accounts`, `isLoading`, `error`, `addTransfer` e `reload` da `useBank()`. Al submit costruisce il movimento (`id`, `accountId`, `date`, `description`, `amount` negativo, `category: "Bonifici"`), chiama `addTransfer(movimento)` e naviga a `/transactions` con `state: { transferCompleted: true }`.
2. **`AccountsPage`:** l'elenco dei conti viene da `useBank()`; mostra `LoadingMessage` durante il caricamento ed `ErrorMessage` (con "Riprova") in caso di errore.
3. **`AccountDetailPage`:** trova il conto con `useParams` e `accounts.find(...)`; filtra e ordina i movimenti del conto; se il conto non esiste mostra "Conto non trovato".
4. **`DashboardPage`:** conti, movimenti e azioni da `useBank()`. Attenzione: all'avvio `accounts` è un array vuoto, quindi `selectedAccountId` non può partire da `accounts[0].id`.
5. **`App.jsx`:** contiene solo `<Routes>`. Niente `useState`, `useEffect`, `getDisplayedBalance`, `addTransfer`, né import di `transactionService`; nessuna prop passata alle pagine.
6. **Pulizia:** nessuna prop, import o funzione rimasti inutilizzati; `npm run lint` e `npm run build` senza errori.

**Passi suggeriti:**
1. Migra una pagina alla volta e controlla il browser dopo ognuna.
2. Chiama gli hook (`useBank`, `useSettings`, `useNavigate`, `useParams`) **prima** di qualunque `return` anticipato.
3. In `DashboardPage` inizializza `selectedAccountId` a `null` e ricava il conto a ogni render con `accounts.find(...) ?? accounts[0]`.
4. Quando tutte le pagine sono migrate, svuota `App.jsx`.

**Risultato atteso (da verificare a migrazione conclusa):**

| # | Cosa controllare | Risultato atteso |
|---|---|---|
| 1 | Apri `/` | Per un attimo "Caricamento dei movimenti...", poi la dashboard |
| 2 | Saldo totale | `17.050,75 €` |
| 3 | `/accounts/acc-001` e `/accounts/acc-002` | 6 movimenti per il conto corrente, 2 per il risparmio |
| 4 | `/transactions` | 8 movimenti; "Entrate" → 4, "Uscite" → 4; ricerca `utenza` → 2 |
| 5 | Bonifico di 50 € dal Conto Corrente a Giulia Bianchi | Navigazione a `/transactions` con "Bonifico simulato registrato."; in testa `Bonifico a Giulia Bianchi` di `-50,00 €`; in `/accounts` il Conto Corrente vale `4.200,75 €`; totale `17.000,75 €` |
| 6 | "Nascondi saldi" e poi "Conti" | Gli importi restano nascosti |
| 7 | Tab *Network* dopo un ricaricamento | Una sola richiesta completata per `transactions.json` (più quella annullata da `StrictMode` in sviluppo) |
| 8 | Console del browser | Nessun errore |

**Criteri di completamento:** nessuna pagina riceve props di dati da `App.jsx`; gli 8 controlli sono verificati; nessun codice morto.

> ⚠️ **Prova prima da solo.** Le soluzioni di riferimento servono a confrontare, non a copiare.

### Soluzione di riferimento — parti chiave

`src/App.jsx`:

```jsx title="src/App.jsx"
import { Route, Routes } from "react-router";
import AppLayout from "./layouts/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AccountsPage from "./pages/AccountsPage.jsx";
import AccountDetailPage from "./pages/AccountDetailPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import TransferPage from "./pages/TransferPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
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

`src/pages/TransferPage.jsx`:

```jsx title="src/pages/TransferPage.jsx"
import { useNavigate } from "react-router";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransferForm from "../components/TransferForm.jsx";
import { useBank } from "../context/BankContext.jsx";
import { beneficiaries } from "../data/mockData.js";

export default function TransferPage() {
  const { accounts, isLoading, error, addTransfer, reload } = useBank();
  const navigate = useNavigate();

  if (isLoading) return <LoadingMessage message="Caricamento dei conti..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  function handleAddTransfer(transfer) {
    const beneficiary = beneficiaries.find((item) => item.id === transfer.beneficiaryId);
    if (!beneficiary) return;

    addTransfer({
      id: `trx-${Date.now()}`,
      accountId: transfer.accountId,
      date: new Date().toISOString().slice(0, 10),
      description: `Bonifico a ${beneficiary.name}`,
      amount: -transfer.amount,
      category: "Bonifici",
    });
    navigate("/transactions", { state: { transferCompleted: true } });
  }

  return (
    <section>
      <h1>Nuovo bonifico</h1>
      <p>Operazione simulata: nessun denaro viene trasferito.</p>
      <TransferForm
        accounts={accounts}
        beneficiaries={beneficiaries}
        onAddTransfer={handleAddTransfer}
      />
    </section>
  );
}
```

Il movimento viene costruito **qui**, nell'handler, e non nel reducer: `Date.now()` e `new Date()` danno un risultato diverso a ogni chiamata, e un reducer deve restare puro.

`src/pages/AccountsPage.jsx`:

```jsx title="src/pages/AccountsPage.jsx"
import { NavLink, Outlet } from "react-router";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import { useBank } from "../context/BankContext.jsx";
import { useSettings } from "../context/SettingsContext.jsx";
import { formatCurrency } from "../utils/formatters.js";

function getLinkClassName({ isActive }) {
  return isActive ? "account-link account-link-active" : "account-link";
}

export default function AccountsPage() {
  const { accounts, isLoading, error, reload } = useBank();
  const { hideBalance } = useSettings();

  if (isLoading) return <LoadingMessage message="Caricamento dei conti..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return (
    <section>
      <h1>I tuoi conti</h1>

      <div className="accounts-layout">
        <ul className="account-links">
          {accounts.map((account) => (
            <li key={account.id}>
              <NavLink
                to={`/accounts/${account.id}`}
                className={getLinkClassName}
              >
                <strong>{account.name}</strong>
                <span>{hideBalance ? "••••••" : formatCurrency(account.balance)}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="account-detail">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
```

`src/pages/AccountDetailPage.jsx`:

```jsx title="src/pages/AccountDetailPage.jsx"
import { Link, useParams } from "react-router";
import Card from "../components/Card.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { useBank } from "../context/BankContext.jsx";
import { useSettings } from "../context/SettingsContext.jsx";
import { formatCurrency } from "../utils/formatters.js";

export default function AccountDetailPage() {
  const { accountId } = useParams();
  const { accounts, transactions, toggleFavorite } = useBank();
  const { hideBalance } = useSettings();

  const account = accounts.find((item) => item.id === accountId);

  if (!account) {
    return (
      <section>
        <h2>Conto non trovato</h2>
        <p>Non esiste nessun conto con id "{accountId}".</p>
        <Link to="/accounts">Torna ai conti</Link>
      </section>
    );
  }

  const accountTransactions = transactions
    .filter((item) => item.accountId === account.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section>
      <Card title={account.name}>
        <p>{account.iban}</p>
        <p>Saldo: {hideBalance ? "••••••" : formatCurrency(account.balance)}</p>
      </Card>

      <h2>Movimenti del conto</h2>
      <TransactionList
        transactions={accountTransactions}
        onToggleFavorite={toggleFavorite}
      />
    </section>
  );
}
```

Qui non servono le guardie di caricamento ed errore: la pagina è una route figlia di `AccountsPage`, che le gestisce prima di disegnare l'`<Outlet />`.

`src/pages/DashboardPage.jsx`:

```jsx title="src/pages/DashboardPage.jsx"
import { useEffect, useState } from "react";
import { Link } from "react-router";
import AccountList from "../components/AccountList.jsx";
import BalanceCard from "../components/BalanceCard.jsx";
import Card from "../components/Card.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransactionFilters from "../components/TransactionFilters.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { useBank } from "../context/BankContext.jsx";
import { useSettings } from "../context/SettingsContext.jsx";

export default function DashboardPage() {
  const { accounts, transactions, isLoading, error, reload, toggleFavorite } = useBank();
  const { hideBalance, toggleHideBalance } = useSettings();

  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const selectedAccount =
    accounts.find((account) => account.id === selectedAccountId) ?? accounts[0];
  const selectedAccountName = selectedAccount?.name;

  useEffect(() => {
    if (!selectedAccountName) return undefined;

    document.title = `LipariBank — ${selectedAccountName}`;

    return () => {
      document.title = "LipariBank";
    };
  }, [selectedAccountName]);

  if (isLoading) return <LoadingMessage message="Caricamento dei movimenti..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const normalizedSearch = searchText.trim().toLowerCase();

  const visibleTransactions = transactions
    .filter((transaction) => transaction.accountId === selectedAccount.id)
    .filter((transaction) => {
      if (filter === "income") return transaction.amount > 0;
      if (filter === "expense") return transaction.amount < 0;
      return true;
    })
    .filter((transaction) => transaction.description.toLowerCase().includes(normalizedSearch))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="dashboard">
      <button type="button" onClick={toggleHideBalance}>
        {hideBalance ? "Mostra saldi" : "Nascondi saldi"}
      </button>

      <BalanceCard total={totalBalance} note="Somma di tutti i tuoi conti" />

      <Card title="I tuoi conti">
        <AccountList
          accounts={accounts}
          transactions={transactions}
          selectedAccountId={selectedAccount.id}
          onSelectAccount={setSelectedAccountId}
        />
      </Card>

      <Card title={`Movimenti — ${selectedAccount.name}`}>
        <TransactionFilters
          filter={filter}
          searchText={searchText}
          onFilterChange={setFilter}
          onSearchChange={setSearchText}
        />
        {transactions.length === 0 ? (
          <EmptyState message="Non ci sono ancora movimenti per i tuoi conti." />
        ) : (
          <TransactionList
            transactions={visibleTransactions}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </Card>

      <p>
        <Link to="/transfer">Nuovo bonifico</Link>
      </p>
    </div>
  );
}
```

All'avvio `accounts` è vuoto, perciò `selectedAccountId` parte da `null` e il conto selezionato si ricava a ogni render: con `useState(accounts[0].id)` l'app andrebbe in errore al primo render. Per lo stesso motivo l'effect sul titolo della scheda esce subito finché il nome del conto non è disponibile. `getDisplayedBalance` non esiste più: il saldo aggiornato è nello state e lo calcola il reducer.

### Parte B — Estendi il reducer
**Obiettivo:** aggiungere una nuova azione e verificarla senza React.

**Requisiti:**
1. Aggiungi l'azione `REMOVE_TRANSFER` con `payload` = `id` del movimento: rimuove il movimento e ripristina il saldo del conto (`balance - amount`). Se l'id non esiste, lo state resta com'era.
2. Ricrea il file temporaneo `try-reducer.js` con un'aggiunta seguita da una rimozione: il saldo finale deve tornare `4250.75` e `transactions.length` `0`.
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
- **Chiamare un hook dopo un `return` anticipato**: `useBank()` va in cima al componente, prima delle guardie di caricamento ed errore.
- **Dare per scontato che i conti ci siano al primo render**: finché il caricamento non finisce `accounts` è vuoto; `accounts[0].id` darebbe errore.
- **Lasciare lo state anche in `App.jsx`**: due sorgenti dei dati non sincronizzate. A migrazione finita `App.jsx` non deve avere state.

---

## ✅ Checklist
- ☐ `bankReducer.js` gestisce le cinque azioni (`LOAD_START`, `LOAD_SUCCESS`, `LOAD_ERROR`, `ADD_TRANSFER`, `TOGGLE_FAVORITE`) e lancia un errore sulle azioni sconosciute.
- ☐ `node try-reducer.js` stampa `4200.75 1 0` (prima dell'esercizio).
- ☐ So spiegare perché il `fetch` sta nell'effect e non nel reducer.
- ☐ `BankContext.jsx` esporta `BankProvider` e `useBank`, e il Provider è montato in `main.jsx`.
- ☐ Tutte le pagine leggono i dati da `useBank()` e `App.jsx` contiene solo le route.
- ☐ Ho verificato gli 8 controlli della tabella.
- ☐ `try-reducer.js` è stato eliminato.

---

## 🚀 Challenge
Aggiungi l'azione `RESET` che riporta lo state a `initialState`. Poi chiediti: ha senso esporla da `useBank`? Chi dovrebbe poterla usare?

---

## 📌 Recap
- Un reducer è una funzione pura `(state, action) => nuovoState`.
- `dispatch` descrive *cosa è successo*; il reducer decide *come cambia lo state*.
- I side effect restano in `useEffect` e negli handler, non nel reducer.
- `useReducer` + Context = state condiviso con regole di aggiornamento centralizzate.
- Le pagine chiedono i dati a `useBank()`: niente più props da `App.jsx`.
- Si sceglie `useReducer` quando più valori cambiano insieme o le regole crescono, non per default.

---

### ➡️ Next
Prossimo capitolo: [03 · Redux: quando e perché](./03_Redux_Quando_e_Perche.md). Il prop drilling è sparito, ma la soluzione ha un costo che ora possiamo misurare. Vediamo che cosa offre uno store dedicato.
