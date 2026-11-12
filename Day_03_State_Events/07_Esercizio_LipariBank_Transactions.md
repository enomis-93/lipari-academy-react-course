# 🏦 LipariBank — React Zero to Hero

> **Day 3 · Capitolo 07**
> **Argomento:** Esercizio — filtri, ricerca e preferiti sui movimenti
> **Durata stimata:** 60 minuti
> **Parte di LipariBank:** `TransactionFilters`, filtri/ricerca in `Dashboard`, pulsante "preferito" su ogni movimento (CHECKPOINT 3)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- gestire in `Dashboard` quattro state (`selectedAccountId`, `hideBalance`, `filter`, `searchText`) più `transactions`;
- filtrare i movimenti per tipo e testo calcolando la lista **durante il render**;
- aggiornare un singolo movimento (preferito) con `map` e spread;
- verificare il lavoro con una lista di scenari concreti.

---

## 📋 Prerequisiti
- Capitoli 01-05 di questo Day: [Event Handling](./01_Event_Handling.md), [useState](./02_useState.md), [State e Re-render](./03_State_e_Rerender.md), [Immutabilità](./05_Immutabilita_dello_State.md), [Lifting State Up](./06_Lifting_State_Up.md).
- Stato del progetto: `Dashboard` con `selectedAccountId`, `hideBalance`, `transactions` (come alla fine del capitolo 06) e componenti di Day 2 funzionanti.

---

## 🧭 In questo capitolo
- Requisiti dell'esercizio.
- Passi suggeriti.
- Soluzione di riferimento (dopo averci provato).
- CHECKPOINT 3.

---

## 🧠 Theory

Ripasso mirato prima di partire:

- **Lo state minimo** è `filter` (`"all" | "income" | "expense"`) e `searchText` (stringa). La lista visibile è **derivata**.
- **Controlled input**: un campo di testo il cui valore arriva dallo state: `value={searchText}` e `onChange={(e) => onSearchChange(e.target.value)}`. Nel [Day 4](../Day_04_Forms_User_Input/01_Form_e_Controlled_Components.md) lo vedremo a fondo.
- **Entrata/uscita**: `amount > 0` entrata, `amount < 0` uscita (convenzione dei dati di LipariBank).
- **Ricerca**: confronta in minuscolo (`toLowerCase()`) e usa `includes` sulla `description`.

> 💡 **Remember**
>
> Filtri e ricerca **non** modificano `transactions`: producono una nuova lista visibile ad ogni render. Il solo state che cambia con il "preferito" è `transactions`, e solo in modo immutabile.

---

## 💻 Let's Code

Non c'è codice guidato: l'esercizio è il codice. Prima di cominciare avvia l'app (dentro `liparibank/`):

```bash
npm run dev
```

Poi apri `http://localhost:5173/`.

---

## 🏦 LipariBank in action

Stai trasformando la dashboard in un piccolo strumento di consultazione: l'utente sceglie un conto, restringe i movimenti per tipo o parola chiave, nasconde i saldi quando è in pubblico e segna i movimenti da ricordare.

---

## 🧪 Your Turn

### Obiettivo
Completare la gestione dei movimenti di `Dashboard`.

### Requisiti
1. **Selezione conto**: click su "Seleziona conto" mostra solo i movimenti di quel conto; la card selezionata è evidenziata e il titolo del box è `Movimenti — <nome conto>`.
2. **Nascondi/mostra saldi**: un pulsante in `Dashboard` maschera con `••••••` il saldo totale e quelli delle card.
3. **Filtro tipo**: nuovo componente `src/components/TransactionFilters.jsx` con tre pulsanti "Tutti", "Entrate", "Uscite". Il pulsante attivo ha `aria-pressed="true"`.
4. **Ricerca testuale**: un campo di testo (con `<label>`) che filtra per `description`, senza distinzione tra maiuscole e minuscole.
5. **Preferito**: ogni movimento ha un pulsante "Preferito" (☆/★) che inverte `isFavorite` con `map` + spread. Non si modifica mai l'oggetto esistente.
6. **Empty state**: se nessun movimento corrisponde, `TransactionList` mostra `EmptyState`.
7. **Stato**: `Dashboard` possiede tutto lo state; `TransactionFilters`, `AccountList`, `TransactionList` non hanno `useState`.
8. **Ordine**: i movimenti visibili sono ordinati per data decrescente.

### Passi suggeriti
1. Parti dallo state di `Dashboard`: aggiungi `filter` e `searchText`.
2. Crea `TransactionFilters` con le sole props `filter`, `searchText`, `onFilterChange`, `onSearchChange`.
3. In `Dashboard` calcola `visibleTransactions` concatenando tre `filter`: per conto, per tipo, per testo.
4. Aggiungi il pulsante "Preferito" in `TransactionItem` che chiama `onToggleFavorite(transaction.id)`.
5. Passa `onToggleFavorite` da `Dashboard` → `TransactionList` → `TransactionItem`.
6. Rimuovi i pulsanti di prova dei capitoli precedenti.

### Risultato atteso (scenari di verifica)

| Scenario | Risultato atteso |
|---|---|
| Avvio | Conto Corrente selezionato, 6 movimenti, filtro "Tutti" |
| Filtro "Entrate" su Conto Corrente | 2 movimenti: Stipendio, Rimborso spese |
| Filtro "Uscite" su Conto Corrente | 4 movimenti |
| Ricerca `utenza` | Pagamento utenza luce, Pagamento utenza gas |
| Ricerca `STIPENDIO` | 1 movimento (maiuscole ininfluenti) |
| Ricerca `xyz` | EmptyState ("Nessun movimento da mostrare.") |
| Conto Risparmio + "Uscite" | EmptyState |
| Click "Preferito" su Stipendio | ★ visibile; secondo click ☆ |
| "Nascondi saldi" | tutti i saldi `••••••`, movimenti visibili |

### Criteri di completamento
- Tutti gli scenari della tabella sono verificati nel browser.
- Nessun `push`, `splice`, `sort` o assegnazione su `transactions`.
- Nessun `useState` per `visibleTransactions` o per il tipo di movimento.
- Nessun errore o warning in Console; `npm run lint` (dentro `liparibank/`) senza errori.

```bash
npm run lint
```

---

> ⚠️ **Prova prima da solo.** Dedica almeno 30 minuti ai requisiti. Poi confronta con la soluzione di riferimento: copiarla subito non ti fa allenare sullo state.

### Soluzione di riferimento — parti chiave

File `src/components/TransactionFilters.jsx`:

```jsx
const FILTER_OPTIONS = [
  { value: "all", label: "Tutti" },
  { value: "income", label: "Entrate" },
  { value: "expense", label: "Uscite" },
];

function TransactionFilters({ filter, searchText, onFilterChange, onSearchChange }) {
  return (
    <div className="transaction-filters">
      <div role="group" aria-label="Filtra per tipo di movimento">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={filter === option.value}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <label htmlFor="transaction-search">Cerca nei movimenti</label>
      <input
        id="transaction-search"
        type="search"
        value={searchText}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="es. stipendio"
      />
    </div>
  );
}

export default TransactionFilters;
```

File `src/components/TransactionItem.jsx` (aggiornato: nuova prop `onToggleFavorite` e pulsante; il resto è il codice di Day 2):

```jsx
import { formatCurrency, formatDate } from "../utils/formatters.js";

function TransactionItem({ transaction, onToggleFavorite }) {
  const isExpense = transaction.amount < 0;
  const isFavorite = Boolean(transaction.isFavorite);

  return (
    <li className="transaction-item">
      <div className="transaction-item__main">
        <span className="transaction-item__description">
          {transaction.description}
        </span>
        <span className="transaction-item__meta">
          {formatDate(transaction.date)} · {transaction.category}
        </span>
      </div>
      <div className="transaction-item__side">
        <span className={isExpense ? "badge badge--expense" : "badge badge--income"}>
          {isExpense ? "Uscita" : "Entrata"}
        </span>
        <span className={isExpense ? "amount amount--expense" : "amount amount--income"}>
          {formatCurrency(transaction.amount)}
        </span>
        <button
          type="button"
          className="favorite-button"
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(transaction.id)}
        >
          <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span> Preferito
        </button>
      </div>
    </li>
  );
}

export default TransactionItem;
```

File `src/components/TransactionList.jsx` (aggiornato: inoltra `onToggleFavorite`; il testo dell'empty state ora parla di filtri):

```jsx
import TransactionItem from "./TransactionItem.jsx";
import EmptyState from "./EmptyState.jsx";

function TransactionList({ transactions, onToggleFavorite }) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        message="Nessun movimento da mostrare."
        hint="Prova a cambiare conto, filtro o testo di ricerca."
      />
    );
  }

  return (
    <ul className="transaction-list">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </ul>
  );
}

export default TransactionList;
```

File `src/components/Dashboard.jsx` (versione finale di Day 3; `AccountCard`, `AccountList` e `BalanceCard` sono quelli dei capitoli 02 e 05):

```jsx
import { useState } from "react";
import { accounts, transactions as initialTransactions } from "../data/mockData.js";
import AccountList from "./AccountList.jsx";
import BalanceCard from "./BalanceCard.jsx";
import Card from "./Card.jsx";
import TransactionFilters from "./TransactionFilters.jsx";
import TransactionList from "./TransactionList.jsx";

function Dashboard() {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0].id);
  const [hideBalance, setHideBalance] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [transactions, setTransactions] = useState(initialTransactions);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);
  const normalizedSearch = searchText.trim().toLowerCase();

  const visibleTransactions = transactions
    .filter((transaction) => transaction.accountId === selectedAccountId)
    .filter((transaction) => {
      if (filter === "income") return transaction.amount > 0;
      if (filter === "expense") return transaction.amount < 0;
      return true;
    })
    .filter((transaction) => transaction.description.toLowerCase().includes(normalizedSearch))
    .sort((a, b) => b.date.localeCompare(a.date));

  function handleToggleFavorite(transactionId) {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, isFavorite: !transaction.isFavorite }
          : transaction,
      ),
    );
  }

  return (
    <main className="dashboard">
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
        <TransactionList
          transactions={visibleTransactions}
          onToggleFavorite={handleToggleFavorite}
        />
      </Card>
    </main>
  );
}

export default Dashboard;
```

Stili da aggiungere in fondo a `src/index.css` (la regola `.account-card--selected` c'è già dal capitolo 06):

```css
.transaction-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
}

.transaction-filters button[aria-pressed="true"] {
  background: #0b5fff;
  color: #ffffff;
}

.favorite-button[aria-pressed="true"] {
  font-weight: 700;
}
```

Perché è corretto:

- `visibleTransactions` è derivato: nessuna copia in state, nessun rischio di disallineamento.
- `.sort` agisce sull'array restituito da `.filter`, che è una copia: `transactions` non viene mutato.
- Il preferito usa forma funzionale + `map` + spread: solo il movimento cliccato è un nuovo oggetto.
- Tutti i `useState` sono nel container; i figli ricevono props e callback.

---

## 🔗 Repository / Checkpoint

### CHECKPOINT 3 — Gestione dello state
Puoi proseguire dal tuo codice oppure da un punto di controllo condiviso.

| Voce | Contenuto |
|---|---|
| **Contenuto iniziale** | Progetto di fine Day 2 più `selectedAccountId`, `hideBalance` e `transactions` in state (fine capitolo 06) |
| **Da completare** | `TransactionFilters`, filtri e ricerca, pulsante "Preferito" (questo capitolo) |
| **Già funzionante** | Selezione conto, nascondi saldi, elenco movimenti per conto, componenti di Day 1-2 |
| **Come verificare** | Tabella degli scenari sopra, `npm run lint`, `npm run build` |
| **Checkpoint del corso** | `liparibank-day-03.zip`, allegato al Day 3 sulla piattaforma |

Se lavori sulla tua repository (creata nel [Day 0](../Day_00_Setup/04_Git_GitHub.md)), un'idea di nome per il tuo commit finale è `Day 3: filtri, ricerca e preferiti`, e per un tag `checkpoint-3`. Per scaricare e avviare il checkpoint, o per ripartire da lì, vedi [Come usare i checkpoint](../Day_00_Setup/06_Come_usare_i_checkpoint.md).

Il Day 4 parte dallo stato finale di questo capitolo.

---

## ⚠️ Common Mistakes

| Errore | Correzione |
|---|---|
| Un `useState` per `visibleTransactions` | calcolarlo nel render |
| `transactions.sort(...)` su state | ordinare l'array restituito da `filter` o una copia |
| `value={searchText}` senza `onChange` | aggiungere `onChange`: altrimenti il campo è bloccato |
| Filtro tipo confrontato con `"entrate"` mentre lo state vale `"income"` | usare gli stessi valori ovunque (`FILTER_OPTIONS`) |
| `item.isFavorite = !item.isFavorite` | `map` + `{ ...t, isFavorite: !t.isFavorite }` |
| Ricerca che non trova `Stipendio` con `stipendio` | `toLowerCase()` su entrambi i lati |
| `selectedAccount` `undefined` dopo aver cambiato i dati | l'id di partenza deve esistere in `accounts` |

---

## ✅ Checklist
- ☐ Selezione conto, nascondi saldi, filtri, ricerca e preferito funzionano.
- ☐ Tutti gli scenari della tabella sono stati verificati.
- ☐ Lo state è solo in `Dashboard`; i figli sono presentazionali.
- ☐ Nessuna mutazione dello state (`push`, `splice`, assegnazioni).
- ☐ `npm run lint` e `npm run build` passano senza errori.
- ☐ Ho salvato il lavoro con un commit (CHECKPOINT 3).

---

## 🚀 Challenge
Aggiungi accanto al titolo "Movimenti" un contatore "★ N preferiti" per il conto selezionato, calcolato come dato derivato (`filter` su `visibleTransactions` o su `transactions`). Poi aggiungi un pulsante "Azzera filtri" che riporta `filter` a `"all"` e `searchText` a `""` con un solo handler.

---

## 📌 Recap
- Lo state minimo è `filter`, `searchText`, `selectedAccountId`, `hideBalance`, `transactions`; il resto è derivato.
- La lista visibile si ottiene concatenando `filter` nel render, senza mutare lo state.
- Il preferito è un aggiornamento immutabile con `map` e spread.
- Container (`Dashboard`) con lo state, figli con props e callback.

---

### ➡️ Next
[Day 4 · Capitolo 01 — Form e Controlled Components](../Day_04_Forms_User_Input/01_Form_e_Controlled_Components.md): dalla ricerca testuale ai form completi, con il bonifico simulato.
