# 🏦 LipariBank — React Zero to Hero

> **Day 6 · Capitolo 03**
> **Argomento:** Dynamic Routes e useParams
> **Durata stimata:** 50 minuti
> **Parte di LipariBank:** lista conti (`/accounts`), dettaglio conto (`/accounts/:accountId`) e spostamento dello state condiviso in `App.jsx`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- definire una route con parametro (`:accountId`) e leggerlo con `useParams`;
- cercare un elemento a partire da un parametro, ricordando che è sempre una **stringa**;
- gestire il caso "elemento non trovato";
- spostare lo state condiviso in `App.jsx` e passarlo alle pagine via props.

---

## 📋 Prerequisiti
- [Capitolo 02 — React Router](./02_React_Router.md): `BrowserRouter`, `AppLayout`, 4 pagine segnaposto.
- Day 5 completato: `Dashboard.jsx` carica ancora i movimenti con `useEffect` ([Esercizio API](../Day_05_Effects_API/06_Esercizio_LipariBank_API_Transactions.md)).

---

## 🧭 In questo capitolo
- Route dinamiche e `useParams`.
- Perché lo state dei movimenti deve salire in `App.jsx`.
- `DashboardPage`, `AccountsPage`, `AccountDetailPage`.
- Prop drilling: un primo assaggio del problema.

---

## 🧠 Theory

### Route con parametro
Un segmento che inizia con `:` è un **parametro dinamico**:

```jsx
<Route path="accounts/:accountId" element={<AccountDetailPage />} />
```

Gli URL `/accounts/acc-001` e `/accounts/acc-002` mostrano lo stesso componente; cambia il valore di `accountId`.

### `useParams`
`useParams()` restituisce un oggetto con i parametri della route corrente:

```jsx
const { accountId } = useParams();
```

> 💡 **Remember**
>
> I parametri sono **sempre stringhe**. Con id come `"acc-001"` il confronto con `account.id` funziona direttamente; con id numerici dovresti convertire (`Number(accountId)`) prima di confrontare con `===`.

### L'URL è un input non fidato
L'utente può scrivere qualsiasi cosa nella barra degli indirizzi (`/accounts/xyz`). Dopo `find` il risultato può essere `undefined`: la pagina deve mostrare un messaggio "Conto non trovato", non andare in errore.

### Dove deve stare lo state?
Finora i movimenti stavano dentro `Dashboard`. Con più pagine (Dashboard, Dettaglio conto, Movimenti, Bonifico) lo state `transactions` serve a **più** pagine e deve sopravvivere alla navigazione. Quando navighi, il componente della pagina precedente viene **smontato** e il suo state perso. Soluzione di questo capitolo (lifting state up, come nel Day 3): lo state condiviso sale in `App.jsx`, che lo passa alle pagine via props.

| Stato | Dove vive |
| --- | --- |
| `transactions`, `isLoading`, `error`, `addTransfer` (dati condivisi) | `App.jsx` |
| `selectedAccountId`, `hideBalance`, `filter`, `searchText` (stato UI della singola pagina) | dentro la pagina che li usa |

---

## 💻 Let's Code

### 1. `App.jsx` possiede lo state condiviso
Sostituisci `src/App.jsx`. L'effect è lo stesso del Day 5, spostato qui:

```jsx title="src/App.jsx"
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import { accounts, beneficiaries } from "./data/mockData.js";
import { getTransactions } from "./services/transactionService.js";
import AppLayout from "./layouts/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AccountsPage from "./pages/AccountsPage.jsx";
import AccountDetailPage from "./pages/AccountDetailPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import TransferPage from "./pages/TransferPage.jsx";

function getDisplayedBalance(account, transactions) {
  const simulatedDelta = transactions
    .filter(
      (transaction) =>
        transaction.accountId === account.id && transaction.category === "Bonifici",
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return Math.round((account.balance + simulatedDelta) * 100) / 100;
}

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

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
        setError("Non è stato possibile caricare i movimenti.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadTransactions();

    return () => controller.abort();
  }, [reloadKey]);

  function handleRetry() {
    setError(null);
    setIsLoading(true);
    setReloadKey((current) => current + 1);
  }

  function handleToggleFavorite(transactionId) {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, isFavorite: !transaction.isFavorite }
          : transaction,
      ),
    );
  }

  function addTransfer(transfer) {
    const beneficiary = beneficiaries.find((item) => item.id === transfer.beneficiaryId);
    if (!beneficiary) {
      return;
    }

    const newTransaction = {
      id: `trx-${Date.now()}`,
      accountId: transfer.accountId,
      date: new Date().toISOString().slice(0, 10),
      description: `Bonifico a ${beneficiary.name}`,
      amount: -transfer.amount,
      category: "Bonifici",
    };

    setTransactions((prev) => [newTransaction, ...prev]);
  }

  const accountsWithBalance = accounts.map((account) => ({
    ...account,
    balance: getDisplayedBalance(account, transactions),
  }));

  const dataProps = {
    transactions,
    isLoading,
    error,
    onRetry: handleRetry,
    onToggleFavorite: handleToggleFavorite,
  };

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          index
          element={
            <DashboardPage
              accounts={accountsWithBalance}
              {...dataProps}
              onAddTransfer={addTransfer}
            />
          }
        />
        <Route
          path="accounts"
          element={<AccountsPage accounts={accountsWithBalance} />}
        />
        <Route
          path="accounts/:accountId"
          element={
            <AccountDetailPage accounts={accountsWithBalance} {...dataProps} />
          }
        />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="transfer" element={<TransferPage />} />
      </Route>
    </Routes>
  );
}
```

Perché funziona: `App` non viene smontato navigando, quindi `transactions` (e i bonifici locali) sopravvivono; l'effect di caricamento gira **una volta**, non a ogni cambio pagina. `dataProps` evita di ripetere le stesse props su più route. `getDisplayedBalance` e la creazione del movimento in `addTransfer` sono la logica del Day 4/5, spostata qui: `addTransfer` riceve il `transfer` (`{ accountId, beneficiaryId, amount, reason }`) emesso da `TransferForm`.

### 2. `DashboardPage` sostituisce `Dashboard`
Sostituisci il contenuto di `src/pages/DashboardPage.jsx`. Lo state UI (`selectedAccountId`, `hideBalance`, `filter`, `searchText`) resta qui; i dati arrivano via props. È il vecchio `Dashboard.jsx` del Day 5 senza lo state dei dati remoti (ora in `App`) e senza l'effect di caricamento. Le props dei componenti figli sono quelle già in uso nel tuo progetto (tabella nel [Day 5, capitolo 06](../Day_05_Effects_API/06_Esercizio_LipariBank_API_Transactions.md)); il form bonifico resta per ora qui.

```jsx title="src/pages/DashboardPage.jsx"
import { useEffect, useState } from "react";
import { beneficiaries } from "../data/mockData.js";
import AccountList from "../components/AccountList.jsx";
import BalanceCard from "../components/BalanceCard.jsx";
import Card from "../components/Card.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransactionFilters from "../components/TransactionFilters.jsx";
import TransactionList from "../components/TransactionList.jsx";
import TransferForm from "../components/TransferForm.jsx";

export default function DashboardPage({
  accounts,
  transactions,
  isLoading,
  error,
  onRetry,
  onToggleFavorite,
  onAddTransfer,
}) {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0].id);
  const [hideBalance, setHideBalance] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);
  const normalizedSearch = searchText.trim().toLowerCase();

  useEffect(() => {
    document.title = `LipariBank — ${selectedAccount.name}`;

    return () => {
      document.title = "LipariBank";
    };
  }, [selectedAccount.name]);

  const visibleTransactions = transactions
    .filter((transaction) => transaction.accountId === selectedAccountId)
    .filter((transaction) => {
      if (filter === "income") return transaction.amount > 0;
      if (filter === "expense") return transaction.amount < 0;
      return true;
    })
    .filter((transaction) => transaction.description.toLowerCase().includes(normalizedSearch))
    .sort((a, b) => b.date.localeCompare(a.date));

  function handleAddTransfer(transfer) {
    onAddTransfer(transfer);
    setSelectedAccountId(transfer.accountId);
    setFilter("all");
    setSearchText("");
  }

  let transactionsContent;

  if (isLoading) {
    transactionsContent = <LoadingMessage message="Caricamento dei movimenti..." />;
  } else if (error) {
    transactionsContent = <ErrorMessage message={error} onRetry={onRetry} />;
  } else if (transactions.length === 0) {
    transactionsContent = (
      <EmptyState message="Non ci sono ancora movimenti per i tuoi conti." />
    );
  } else {
    transactionsContent = (
      <TransactionList
        transactions={visibleTransactions}
        onToggleFavorite={onToggleFavorite}
      />
    );
  }

  return (
    <div className="dashboard">
      <button type="button" onClick={() => setHideBalance((prev) => !prev)}>
        {hideBalance ? "Mostra saldi" : "Nascondi saldi"}
      </button>

      <BalanceCard
        total={totalBalance}
        note="Somma di tutti i tuoi conti"
        hidden={hideBalance}
      />

      <Card title="I tuoi conti">
        <AccountList
          accounts={accounts}
          transactions={transactions}
          selectedAccountId={selectedAccountId}
          hideBalance={hideBalance}
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
        {transactionsContent}
      </Card>

      <Card title="Nuovo bonifico (simulato)">
        <TransferForm
          accounts={accounts}
          beneficiaries={beneficiaries}
          onAddTransfer={handleAddTransfer}
        />
      </Card>
    </div>
  );
}
```

Differenze rispetto al Day 5: la radice è un `<div className="dashboard">` (il `<main>` ora è nel layout), `handleAddTransfer` delega la creazione del movimento ad `App` (`onAddTransfer`) e si occupa solo dello state UI (seleziona il conto di addebito, azzera filtro e ricerca), e l'effect del titolo ha un cleanup che ripristina "LipariBank" quando lasci la dashboard (altrimenti il titolo del conto resterebbe sulle altre pagine).

Ora **elimina** `src/components/Dashboard.jsx`: è sostituito da `DashboardPage`. Nel capitolo 04 il form uscirà dalla dashboard e andrà in `TransferPage`.

### 3. `AccountsPage`: link al dettaglio
`src/pages/AccountsPage.jsx`:

```jsx title="src/pages/AccountsPage.jsx"
import { Link } from "react-router";
import { formatCurrency } from "../utils/formatters.js";

export default function AccountsPage({ accounts }) {
  return (
    <section>
      <h1>I tuoi conti</h1>
      <ul className="account-links">
        {accounts.map((account) => (
          <li key={account.id}>
            <Link to={`/accounts/${account.id}`}>
              <strong>{account.name}</strong>
            </Link>
            <span> — {account.iban} — </span>
            <span>{formatCurrency(account.balance)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

Il valore di `to` è una template literal: `/accounts/acc-001`, `/accounts/acc-002`.

### 4. `AccountDetailPage` con `useParams`
`src/pages/AccountDetailPage.jsx`:

```jsx title="src/pages/AccountDetailPage.jsx"
import { Link, useParams } from "react-router";
import Card from "../components/Card.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { formatCurrency } from "../utils/formatters.js";

export default function AccountDetailPage({
  accounts,
  transactions,
  isLoading,
  error,
  onRetry,
  onToggleFavorite,
}) {
  const { accountId } = useParams();
  const account = accounts.find((item) => item.id === accountId);

  if (!account) {
    return (
      <section>
        <h1>Conto non trovato</h1>
        <p>Non esiste nessun conto con id "{accountId}".</p>
        <Link to="/accounts">Torna ai conti</Link>
      </section>
    );
  }

  const accountTransactions = transactions
    .filter((item) => item.accountId === account.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  let content;

  if (isLoading) {
    content = <LoadingMessage message="Caricamento dei movimenti..." />;
  } else if (error) {
    content = <ErrorMessage message={error} onRetry={onRetry} />;
  } else {
    content = (
      <TransactionList
        transactions={accountTransactions}
        onToggleFavorite={onToggleFavorite}
      />
    );
  }

  return (
    <section>
      <Link to="/accounts">← Tutti i conti</Link>

      <Card title={account.name}>
        <p>{account.iban}</p>
        <p>Saldo: {formatCurrency(account.balance)}</p>
      </Card>

      <h2>Movimenti del conto</h2>
      {content}
    </section>
  );
}
```

Cosa fa: legge `accountId` dall'URL, trova il conto, gestisce il "non trovato" e mostra i movimenti di quel conto. Nota: `useParams()` è chiamato **prima** del `return` condizionale, quindi l'ordine degli Hooks non cambia. Prova `http://localhost:5173/accounts/acc-001`, `/accounts/acc-002` e `/accounts/xyz`.

---

## 🏦 LipariBank in action
Cosa è cambiato nell'architettura:

```text
App.jsx            → transactions, isLoading, error, reloadKey, addTransfer, handleToggleFavorite
 └─ AppLayout      → Header + NavLink + Outlet
     ├─ DashboardPage      (state UI proprio, dati via props)
     ├─ AccountsPage       (accounts via props)
     └─ AccountDetailPage  (accounts + transactions + isLoading + error + onRetry + onToggleFavorite)
```

Navigando tra le pagine i bonifici aggiunti restano: lo state vive in `App`, che non viene smontato. Ma guarda quante props abbiamo dovuto passare (`transactions`, `isLoading`, `error`, `onRetry`, `onToggleFavorite`, ...): è il **prop drilling**, e crescerà con le pagine. Nel Day 7 lo risolveremo con Context e `useReducer`; per ora è il prezzo di un'architettura semplice.

---

## 🧪 Your Turn

**Obiettivo:** aggiungere il dettaglio conto e spostare lo state in `App.jsx`.

**Requisiti:**
1. `App.jsx` possiede `transactions`, `isLoading`, `error`, `handleRetry`, `handleToggleFavorite` e `addTransfer`; `Dashboard.jsx` non esiste più.
2. `/accounts` mostra due link ai conti con IBAN e saldo formattato.
3. `/accounts/acc-001` mostra nome, IBAN, saldo e i 6 movimenti del Conto Corrente (ordinati per data decrescente).
4. `/accounts/acc-002` mostra i 2 movimenti del Conto Risparmio.
5. `/accounts/xyz` mostra "Conto non trovato" con link di ritorno.
6. Aggiungi un bonifico nella Dashboard, vai su "Conti" → "Conto Corrente": il bonifico è presente nel dettaglio; torna alla Dashboard: non è sparito.
7. Ricarica la pagina direttamente su `/accounts/acc-001`: la pagina si apre correttamente.

**Passi suggeriti:** prima sposta l'effect in `App`, poi crea `DashboardPage` con le props, poi le due nuove pagine, infine le route.

**Risultato atteso:** navigazione fluida tra Dashboard, Conti e Dettaglio con dati coerenti.

**Criteri di completamento:** tutti e 7 i punti verificati; nessun import di `Dashboard.jsx` rimasto.

---

## ⚠️ Common Mistakes
- **Confrontare un parametro numerico con `===` senza convertirlo.** I parametri sono stringhe.
- **Non gestire l'elemento non trovato.** `account.name` su `undefined` manda in errore la pagina.
- **Chiamare `useParams` dentro un `if`.** Chiamalo sempre al livello principale.
- **Lasciare lo state dei movimenti nella pagina.** Perdi i dati navigando.
- **`<a href={...}>` per il dettaglio.** Ricarica la pagina e azzera lo state: usa `Link`.
- **Dimenticare la `key`** nella lista dei conti.

---

## ✅ Checklist
- ☐ Route `accounts/:accountId` definita.
- ☐ So che `useParams` restituisce stringhe.
- ☐ Il caso "conto non trovato" è gestito.
- ☐ Lo state condiviso sta in `App.jsx`.
- ☐ I bonifici locali sopravvivono alla navigazione.
- ☐ Ho notato il prop drilling.

---

## 🚀 Challenge
Nella pagina di dettaglio, mostra anche il numero di movimenti in entrata e in uscita del conto, calcolati con `filter` direttamente nel render.

---

## 📌 Recap
- `:accountId` nel `path` + `useParams()` per leggere il valore.
- I parametri sono stringhe e possono non corrispondere a nulla: gestisci il "non trovato".
- Lo state condiviso sale in `App.jsx`; lo state UI resta nella pagina.
- Passare molte props di pagina in pagina (prop drilling) è un limite che motiva il Day 7.

---

### ➡️ Next
[Capitolo 04 — Navigation e 404](./04_Navigation_e_404.md): `useNavigate`, la pagina del bonifico e la route `*`.
