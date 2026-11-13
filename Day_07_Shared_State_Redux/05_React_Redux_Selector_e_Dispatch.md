# 🏦 LipariBank — React Zero to Hero

> **Day 7 · Capitolo 05**
> **Argomento:** React Redux: selector e dispatch
> **Durata stimata:** 50 minuti
> **Parte di LipariBank:** le pagine Movimenti e Conti leggono dallo store; ripetiamo la misura dei re-render

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- leggere lo state dello store in un componente con `useSelector`;
- inviare action e thunk con `useDispatch`;
- spiegare perché un componente collegato allo store si ridisegna meno di un consumatore di Context;
- riconoscere ed evitare i selector che restituiscono ogni volta un valore nuovo;
- usare i Redux DevTools per ripercorrere le azioni dell'utente.

---

## 📋 Prerequisiti
- [Capitolo 04 — Redux Toolkit: slice e thunk](./04_Redux_Toolkit_Slice_e_Thunk.md): lo store contiene conti e movimenti e `App` invia `fetchTransactions()` all'avvio.
- Le pagine leggono ancora da `useBank()`.
- Il log `render AccountsPage` aggiunto nel [capitolo 03](./03_Redux_Quando_e_Perche.md).

---

## 🧭 In questo capitolo
- `useSelector`: leggere e iscriversi allo store.
- Perché i re-render diminuiscono.
- I selector da evitare.
- `useDispatch` e gli action creator.
- Migrazione guidata di Movimenti e Conti, con misura.
- I DevTools come macchina del tempo.

---

## 🧠 Theory

### `useSelector`: leggere e iscriversi
```jsx
const accounts = useSelector(selectAccounts);
```

`useSelector` fa due cose. Esegue il selector sullo state dello store e ti restituisce il risultato. E **iscrive** il componente allo store: dopo ogni action riesegue il selector e ridisegna il componente **solo se il risultato è cambiato**, confrontandolo con il precedente tramite `===`.

### Perché i re-render diminuiscono
Con il Context ogni consumatore riceveva l'intero `value` e si ridisegnava a ogni cambiamento. Con `useSelector` ogni componente dichiara **quale pezzo** gli interessa.

Quando un movimento diventa "preferito", Immer crea un nuovo array `state.transactions.items`, ma lascia `state.accounts.items` esattamente com'era: lo stesso array, lo stesso riferimento. Un componente che seleziona i conti ottiene un valore identico al precedente e non viene rieseguito.

È qui che l'immutabilità del Day 3 ripaga: siccome ogni modifica produce un oggetto nuovo e ciò che non cambia resta lo stesso oggetto, per sapere se qualcosa è cambiato basta confrontare due riferimenti.

### I selector da evitare
Il confronto è per riferimento, quindi un selector che **costruisce** un array o un oggetto restituisce ogni volta qualcosa di "diverso", anche se il contenuto è uguale:

```jsx
// Da evitare: filter crea un nuovo array a ogni esecuzione
const accountTransactions = useSelector((state) =>
  state.transactions.items.filter((item) => item.accountId === accountId),
);
```

Il componente si ridisegnerebbe dopo **qualsiasi** action, e in sviluppo React Redux stampa in Console un avviso che inizia con `Selector unknown returned a different result when called with the same parameters`.

La regola: **il selector restituisce ciò che c'è nello store; filtri e ordinamenti si fanno nel componente**, durante il render.

```jsx
const transactions = useSelector(selectTransactions);
const accountTransactions = transactions.filter((item) => item.accountId === accountId);
```

Quando un calcolo derivato è costoso o serve in più componenti esistono i selector *memoizzati*: li vedremo nel [Day 8 · Memoization](../Day_08_Advanced_Hooks_Architecture/02_Memoization.md).

### `useDispatch`
```jsx
const dispatch = useDispatch();

dispatch(favoriteToggled(transaction.id));
dispatch(fetchTransactions());
```

`useDispatch` restituisce la funzione `dispatch` dello store. Le si passa ciò che un action creator restituisce: un oggetto action oppure un thunk. Il componente non sa come lo state cambierà: dichiara soltanto che cosa è successo.

### Lo state locale resta locale
`filter`, `searchText` e il conto selezionato restano `useState` nelle pagine: servono a una sola pagina e non c'è motivo di tracciarli. Collegare un componente allo store non significa togliergli lo state.

### I DevTools come macchina del tempo
Ogni action produce uno state nuovo e lascia intatto il precedente. I Redux DevTools li conservano tutti: selezionando un'action e premendo **Jump**, l'applicazione torna a mostrare lo state di quel momento. Per cercare un bug puoi ripercorrere, un passo alla volta, ciò che l'utente ha fatto.

> 💡 **Remember**
>
> Un componente collegato con `useSelector` si ridisegna solo quando cambia il valore che ha selezionato. Seleziona il minimo indispensabile e non costruire array o oggetti dentro il selector.

---

## 💻 Let's Code

### 1. La pagina Movimenti
Sostituisci `src/pages/TransactionsPage.jsx`:

```jsx title="src/pages/TransactionsPage.jsx"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransactionFilters from "../components/TransactionFilters.jsx";
import TransactionList from "../components/TransactionList.jsx";
import {
  favoriteToggled,
  fetchTransactions,
  selectTransactions,
  selectTransactionsError,
  selectTransactionsStatus,
} from "../store/transactionsSlice.js";

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const status = useSelector(selectTransactionsStatus);
  const error = useSelector(selectTransactionsError);

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

  if (status === "idle" || status === "loading") {
    content = <LoadingMessage message="Caricamento dei movimenti..." />;
  } else if (status === "failed") {
    content = <ErrorMessage message={error} onRetry={() => dispatch(fetchTransactions())} />;
  } else if (transactions.length === 0) {
    content = <EmptyState message="Non ci sono ancora movimenti." />;
  } else {
    content = (
      <TransactionList
        transactions={visibleTransactions}
        onToggleFavorite={(transactionId) => dispatch(favoriteToggled(transactionId))}
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

Rispetto alla versione con `useBank()`:

- tre `useSelector` prendono il posto della destrutturazione di `useBank()`: movimenti, stato del caricamento, errore;
- `isLoading` non esiste più: la pagina controlla `status`. Finché vale `"idle"` o `"loading"` mostra il caricamento;
- "Riprova" invia di nuovo il thunk: `dispatch(fetchTransactions())`;
- il pulsante "Preferito" invia `favoriteToggled`;
- `filter`, `searchText` e il calcolo di `visibleTransactions` sono identici.

> ⚠️ `visibleTransactions` nasce da `transactions.filter(...)`, cioè da un array nuovo: per questo `.sort(...)` è sicuro. Chiamare `sort` direttamente sull'array dello store darebbe errore, perché Redux Toolkit in sviluppo lo rende non modificabile. È la regola del Day 1, ora fatta rispettare dallo strumento.

### 2. Osservare un'action
Apri `/transactions` con il tab Redux aperto e premi "☆ Preferito" su un movimento. Nell'elenco compare `transactions/favoriteToggled`. Selezionala:

- la scheda *Action* mostra il `payload`, cioè l'id del movimento;
- la scheda *Diff* mostra l'unica cosa cambiata: `isFavorite` di quel movimento.

Nel capitolo 02, per ottenere la stessa informazione, avresti dovuto aggiungere un `console.log` nel reducer.

### 3. La pagina Conti
Sostituisci `src/pages/AccountsPage.jsx`:

```jsx title="src/pages/AccountsPage.jsx"
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import { useSettings } from "../context/SettingsContext.jsx";
import { selectAccounts } from "../store/accountsSlice.js";
import {
  fetchTransactions,
  selectTransactionsError,
  selectTransactionsStatus,
} from "../store/transactionsSlice.js";
import { formatCurrency } from "../utils/formatters.js";

function getLinkClassName({ isActive }) {
  return isActive ? "account-link account-link-active" : "account-link";
}

export default function AccountsPage() {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const status = useSelector(selectTransactionsStatus);
  const error = useSelector(selectTransactionsError);
  const { hideBalance } = useSettings();

  if (status === "idle" || status === "loading") {
    return <LoadingMessage message="Caricamento dei conti..." />;
  }
  if (status === "failed") {
    return <ErrorMessage message={error} onRetry={() => dispatch(fetchTransactions())} />;
  }

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

La pagina seleziona tre valori: l'elenco dei conti, lo `status` e l'errore. **Non** seleziona i movimenti: non li mostra.

Sostituisci `src/pages/AccountDetailPage.jsx`:

```jsx title="src/pages/AccountDetailPage.jsx"
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import Card from "../components/Card.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { useSettings } from "../context/SettingsContext.jsx";
import { selectAccounts } from "../store/accountsSlice.js";
import { favoriteToggled, selectTransactions } from "../store/transactionsSlice.js";
import { formatCurrency } from "../utils/formatters.js";

export default function AccountDetailPage() {
  const { accountId } = useParams();
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const transactions = useSelector(selectTransactions);
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
        onToggleFavorite={(transactionId) => dispatch(favoriteToggled(transactionId))}
      />
    </section>
  );
}
```

Il dettaglio seleziona conti e movimenti, e filtra i movimenti del conto **dopo** averli letti, nel corpo del componente.

### 4. Ripetere la misura
In `AccountsPage`, subito dopo le chiamate agli hook, rimetti il log (sostituendo il file lo hai cancellato):

```jsx
console.log("render AccountsPage");
```

Apri `/accounts/acc-001`, svuota la Console e premi "☆ Preferito" su un movimento.

Questa volta **non compare nulla**. Il movimento è cambiato, il dettaglio a destra si è aggiornato, ma `AccountsPage` non è stata rieseguita: dei tre valori che seleziona, nessuno è cambiato.

| | Click su "Preferito" in `/accounts/acc-001` |
|---|---|
| Con `useBank()` (capitolo 03) | `render AccountsPage` compare |
| Con `useSelector` | Nessun log |

Rimuovi il `console.log`.

**Perché funziona.** `favoriteToggled` è gestita solo dallo slice dei movimenti. `state.accounts.items`, `status` ed `error` sono gli stessi di prima, quindi i tre selector di `AccountsPage` restituiscono valori identici.

---

## 🏦 LipariBank in action

Lo stato della migrazione a questo punto:

| Pagina | Legge da | Scrive su |
|---|---|---|
| Movimenti (`/transactions`) | Store | Store |
| Conti e dettaglio (`/accounts`) | Store | Store |
| Dashboard (`/`) | `BankContext` | `BankContext` |
| Bonifico (`/transfer`) | `BankContext` | `BankContext` |

> ⚠️ Finché le sorgenti sono due, un bonifico fatto ora finisce in `BankContext` e **non** compare nelle pagine già migrate; un preferito messo in `/transactions` non si vede in dashboard. È l'ultima volta che succede: nel prossimo capitolo migrerai le due pagine rimaste ed eliminerai `BankContext`.

---

## 🧪 Your Turn

**Obiettivo:** verificare in prima persona le tre idee del capitolo.

**Requisiti:**
1. **Selector instabile.** In `AccountDetailPage` sostituisci temporaneamente le due righe che leggono e filtrano i movimenti con l'unico selector "da evitare" mostrato nella Theory. Apri `/accounts/acc-001`, leggi l'avviso in Console, poi ripristina il codice corretto.
2. **Action e differenze.** In `/transactions` metti due preferiti e toglierne uno. Nel tab Redux individua le tre action e, per ognuna, leggi nella scheda *Diff* che cosa ha cambiato.
3. **Macchina del tempo.** Seleziona la prima delle tre action e premi **Jump**: osserva la pagina. Poi torna all'ultima action.
4. **Riprova.** Rinomina temporaneamente `public/data/transactions.json` in `transactions.off.json`, ricarica `/transactions`, leggi le action nei DevTools, rimetti il nome corretto e premi "Riprova".

**Passi suggeriti:**
1. Per il punto 1 ricorda di togliere anche la riga che filtrava `transactions`, altrimenti filtri due volte.
2. Per il punto 4 guarda l'ordine delle action: `pending`, `rejected`, poi di nuovo `pending` e `fulfilled`.

**Risultato atteso:**
- Punto 1: la pagina funziona, ma in Console compare l'avviso sul selector.
- Punto 3: dopo **Jump** la pagina mostra un solo preferito, come in quel momento.
- Punto 4: prima il messaggio d'errore con "Riprova", poi i movimenti; nei DevTools quattro action di `fetchTransactions`.

**Criteri di completamento:** il codice è tornato quello del capitolo, il file JSON ha di nuovo il suo nome, non restano `console.log`, `npm run lint` e `npm run build` terminano senza errori.

---

## ⚠️ Common Mistakes

| Errore | Sintomo | Correzione |
|---|---|---|
| `filter`, `map` o `{ ... }` dentro il selector | Avviso in Console, re-render a ogni action | Seleziona il dato grezzo, deriva nel componente |
| Selezionare tutto lo state: `useSelector((state) => state)` | Il componente si ridisegna a ogni action | Seleziona solo ciò che usi |
| `sort` sull'array letto dallo store | `TypeError`: l'array non è modificabile | Ordina una copia o il risultato di `filter` |
| `dispatch(favoriteToggled)` senza parentesi | Non succede nulla | `dispatch(favoriteToggled(id))` |
| Chiamare `useSelector` dopo un `return` anticipato | Errore sugli hook | Tutti gli hook in cima al componente |
| Portare nello store `filter` e `searchText` | Action a ogni tasto, state globale inutile | Restano `useState` della pagina |

---

## ✅ Checklist
- ☐ So che cosa fa `useSelector` e quando ridisegna il componente.
- ☐ So spiegare perché `AccountsPage` non si ridisegna più al click su "Preferito".
- ☐ So riconoscere un selector che crea un valore nuovo a ogni chiamata.
- ☐ `TransactionsPage`, `AccountsPage` e `AccountDetailPage` leggono dallo store.
- ☐ Ho letto payload e differenze di un'action nei DevTools e ho usato **Jump**.
- ☐ Ho rimosso i log e ripristinato i file modificati per le prove.

---

## 🚀 Challenge
Aggiungi a `transactionsSlice.js` il selector `selectFavoriteCount`, che restituisce **quanti** movimenti sono preferiti, e mostralo nel titolo della pagina Movimenti (`Movimenti · 2 preferiti`). Questo selector fa un calcolo, eppure non provoca l'avviso visto nell'esercizio: perché? Suggerimento: che tipo di valore restituisce, e come lo confronta `===`?

---

## 📌 Recap
- `useSelector` legge un valore dallo store e ridisegna il componente solo quando quel valore cambia.
- Il confronto è per riferimento: funziona perché lo state è immutabile e ciò che non cambia resta lo stesso oggetto.
- I selector restituiscono dati dello store; filtri e ordinamenti stanno nel componente.
- `useDispatch` invia action e thunk; il componente dice che cosa è successo, non come cambia lo state.
- I Redux DevTools mostrano payload e differenze di ogni action e permettono di tornare a uno state precedente.

---

### ➡️ Next
Prossimo capitolo: [06 · Esercizio — Migrazione a Redux](./06_Esercizio_Migrazione_a_Redux.md). Migrerai le due pagine rimaste, eliminerai `BankContext` e confronterai le due soluzioni.
