# 🏦 LipariBank — React Zero to Hero

> **Day 2 · Capitolo 02**
> **Argomento:** Props
> **Durata stimata:** 30 minuti
> **Parte di LipariBank:** `Header`, `BalanceCard`, `TransactionItem` e `TransactionList` diventano presentazionali; `Dashboard` calcola e passa i dati; nasce `AccountCard`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- passare dati a un componente con le **props**;
- leggerle con il **destructuring** e definire valori di default;
- spiegare perché le props sono di **sola lettura**;
- trasformare i componenti di LipariBank in componenti presentazionali.

---

## 📋 Prerequisiti
- [Day 2 · Componenti e composizione](./01_Componenti_e_Composizione.md): `Dashboard.jsx` esiste e `App.jsx` renderizza `<Header />` e `<Dashboard />`.
- Utile: [Extra · Destructuring, Spread, Rest](../Extra_JavaScript_Essentials/05_Destructuring_Spread_Rest.md).

---

## 🧭 In questo capitolo
- Che cosa sono le props e come si passano.
- Destructuring nei parametri e valori di default.
- Props di sola lettura.
- Refactoring dei componenti esistenti e creazione di `AccountCard`.

---

## 🧠 Theory

### Props
Le **props** (*properties*) sono i dati che un componente padre passa a un figlio, con la sintassi degli attributi. React le raccoglie in un **oggetto** passato come primo (e unico) argomento della funzione.

```jsx
<Greeting name="Mario" />
```

```jsx
function Greeting(props) {
  return <p>Ciao, {props.name}</p>;
}
```

### Destructuring
Per evitare di scrivere `props.` ovunque si usa il destructuring direttamente nei parametri:

```jsx
function Greeting({ name }) {
  return <p>Ciao, {name}</p>;
}
```

### Passare valori non testuali
Le **stringhe** possono usare le virgolette (`name="Mario"`). Tutto il resto (numeri, oggetti, array, booleani, funzioni) va tra graffe:

```jsx
<AccountCard account={account} transactionCount={6} isHighlighted={true} />
```

Per una prop booleana `true` si può scrivere solo il nome: `<AccountCard isHighlighted />`.

### Valori di default
```jsx
function BalanceCard({ total, label = "Saldo totale" }) {
  // label vale "Saldo totale" se il padre non la passa (o passa undefined)
}
```

### Le props sono di sola lettura
Un componente **non deve mai modificare le proprie props**. Se hai bisogno di un valore diverso, calcolane uno nuovo (`const net = total - fees`). I dati scorrono in una sola direzione: dal padre ai figli.

> 💡 **Remember**
>
> Il padre decide, il figlio mostra. Il figlio riceve oggetti da leggere, non da modificare.

---

## 💻 Let's Code

Procedi file per file. Ricorda che gli stessi dati continuano a venire da `src/data/mockData.js`, ma ora **solo `App` e `Dashboard`** li importeranno.

### 1. `Header` riceve il cliente
`src/components/Header.jsx`:

```jsx
function Header({ customer }) {
  return (
    <header className="header">
      <h1 className="header__brand">LipariBank</h1>
      <p className="header__name">
        Cliente: {customer.firstName} {customer.lastName}
      </p>
    </header>
  );
}

export default Header;
```

`src/App.jsx`:

```jsx
import Header from "./components/Header.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { customer } from "./data/mockData.js";

function App() {
  return (
    <div className="app">
      <Header customer={customer} />
      <Dashboard />
    </div>
  );
}

export default App;
```

### 2. `BalanceCard` riceve il totale
`src/components/BalanceCard.jsx` (sostituisce la versione precedente):

```jsx
import { formatCurrency } from "../utils/formatters.js";

function BalanceCard({ total, label = "Saldo totale" }) {
  return (
    <section className="balance-card">
      <p className="balance-card__label">{label}</p>
      <p className="balance-card__value">{formatCurrency(total)}</p>
    </section>
  );
}

export default BalanceCard;
```

Non conosce più i conti: riceve soltanto un numero. Può mostrare il totale generale, il saldo di un conto o altro.

### 3. `TransactionItem` con destructuring
`src/components/TransactionItem.jsx`:

```jsx
import { formatCurrency, formatDate } from "../utils/formatters.js";

function TransactionItem({ transaction }) {
  const amountClass =
    transaction.amount < 0 ? "amount amount--expense" : "amount amount--income";

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
      <span className={amountClass}>{formatCurrency(transaction.amount)}</span>
    </li>
  );
}

export default TransactionItem;
```

### 4. `RecentTransactions` diventa `TransactionList`
Un componente che riceve una lista non deve sapere se è "recente" o meno: il nome riflette il **ruolo**, non i dati. Crea `src/components/TransactionList.jsx`:

```jsx
import TransactionItem from "./TransactionItem.jsx";

function TransactionList({ transactions }) {
  return (
    <ul className="transaction-list">
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </ul>
  );
}

export default TransactionList;
```

Poi **elimina** `src/components/RecentTransactions.jsx`: non serve più. Il significato di `key` verrà approfondito nel [capitolo 05](./05_Liste_e_Keys.md).

### 5. `Dashboard` calcola e passa i dati
`src/components/Dashboard.jsx`:

```jsx
import { accounts, transactions } from "../data/mockData.js";
import BalanceCard from "./BalanceCard.jsx";
import TransactionList from "./TransactionList.jsx";

function Dashboard() {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <main className="dashboard">
      <BalanceCard total={totalBalance} />
      <section className="section">
        <h2 className="section__title">Ultimi movimenti</h2>
        <TransactionList transactions={recentTransactions} />
      </section>
    </main>
  );
}

export default Dashboard;
```

**Cosa fa.** Il container prepara `totalBalance` e `recentTransactions` e li passa ai figli.

**Perché funziona.** Ogni attributo JSX diventa una proprietà dell'oggetto `props` del figlio. La pagina è identica a prima, ma `BalanceCard` e `TransactionList` sono ora riusabili.

**Come modificarlo.** Passa a `BalanceCard` anche `label="Saldo conto corrente"` e il saldo del solo `accounts[0]` per verificare il riuso.

**Errori da evitare.** Scrivere `<BalanceCard total="17050.75" />` (diventa una stringa); scrivere `total=totalBalance` senza graffe.

### 6. Nuovo: `AccountCard`
`src/components/AccountCard.jsx`:

```jsx
import { formatCurrency } from "../utils/formatters.js";

function AccountCard({ account }) {
  return (
    <article className="account-card">
      <h3 className="account-card__name">{account.name}</h3>
      <p className="account-card__iban">{account.iban}</p>
      <p className="account-card__balance">{formatCurrency(account.balance)}</p>
    </article>
  );
}

export default AccountCard;
```

Aggiungi in fondo a `src/index.css`:

```css
.account-card {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background-color: #ffffff;
}

.account-card__name {
  margin: 0;
  font-size: 1rem;
}

.account-card__iban {
  margin: 0.25rem 0;
  font-size: 0.8rem;
  color: #6b7280;
  font-family: ui-monospace, monospace;
}

.account-card__balance {
  margin: 0.5rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.account-card__meta {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: #6b7280;
}
```

---

## 🏦 LipariBank in action
Mappa di chi importa i dati dopo il refactoring:

| Componente | Tipo | Importa `mockData.js`? |
| --- | --- | --- |
| `App` | radice | Sì (`customer`, solo per passarlo a `Header`) |
| `Dashboard` | container | Sì (`accounts`, `transactions`) |
| `Header`, `BalanceCard`, `AccountCard`, `TransactionList`, `TransactionItem` | presentazionali | **No** |

Questa regola sarà la base della dashboard: **i dati entrano da un solo punto**, poi scendono come props.

---

## 🧪 Your Turn

**Obiettivo:** usare `AccountCard` con dati reali dell'array `accounts`.

**Requisiti**
1. In `Dashboard`, sotto `BalanceCard`, mostra **due** `AccountCard` (una per conto), passando `account={accounts[0]}` e `account={accounts[1]}`.
2. `AccountCard` mostra nome, IBAN e saldo formattato (`4.250,75 €` e `12.800,00 €`).
3. `AccountCard` **non** importa `mockData.js`.
4. Aggiungi a `BalanceCard` una nuova prop opzionale `note` (stringa): se passata, appare sotto il saldo in un `<p className="balance-card__meta">`. Passa `note="Somma di tutti i tuoi conti"` da `Dashboard`.

**Passi suggeriti**
- Importa `AccountCard` in `Dashboard.jsx` e inseriscila prima della sezione movimenti (avvolgi le due card in un `<section className="section">` con un `h2`).
- Per la prop opzionale usa il valore di default `note = ""` oppure lascia `undefined`: nel [capitolo 04](./04_Conditional_Rendering.md) imparerai a mostrarla solo se presente. Per ora puoi mostrare sempre il paragrafo.

**Risultato atteso:** pagina con saldo totale (e nota), due card conto e cinque movimenti.

**Criteri di completamento:** nessun errore, nessun import di `mockData.js` nei componenti presentazionali; i valori sono quelli corretti.

---

## ⚠️ Common Mistakes
- **Dimenticare le graffe** per numeri e oggetti: `transactionCount="6"` passa la stringa `"6"`.
- **Modificare una prop** (`account.balance = 0`): è vietato; calcola un nuovo valore.
- **Destructuring con nome sbagliato**: `function Header({ user })` ma il padre passa `customer`: `user` sarà `undefined`.
- **Passare `props` e destrutturare insieme** inutilmente: scegli una forma (nel corso: destructuring).
- **Props con nomi poco chiari** (`data`, `info`): preferisci `transactions`, `account`, `total`.
- **Più oggetti nel parametro** (`function Header(customer)`) senza graffe: `customer` conterrebbe l'intero oggetto `props`.

---

## ✅ Checklist
- ☐ Ho passato props a `Header`, `BalanceCard` e `TransactionList`.
- ☐ So usare destructuring e valori di default.
- ☐ So perché le props sono di sola lettura.
- ☐ Ho eliminato `RecentTransactions.jsx` e la dashboard funziona con `TransactionList`.
- ☐ Ho creato `AccountCard` e la mostro per entrambi i conti.

---

## 🚀 Challenge
Aggiungi a `BalanceCard` una prop `variant` con default `"primary"` e usala per aggiungere una classe `balance-card--primary` o `balance-card--secondary` (definisci tu i colori nel CSS). Usa la variante `secondary` per mostrare il saldo del solo conto risparmio.

---

## 📌 Recap
- Le props sono attributi JSX raccolti in un oggetto e destrutturabili nei parametri.
- Stringhe tra virgolette, tutto il resto tra graffe.
- Si possono definire valori di default.
- Le props sono **read-only**: i dati scendono dal padre ai figli.
- `Dashboard` coordina i dati, i figli sono presentazionali.

---

### ➡️ Next
Prossimo capitolo: [Children](./03_Children.md). Le props possono passare anche contenuto JSX: vedremo come costruire il contenitore riusabile `Card`.
