# 🏦 LipariBank — React Zero to Hero

> **Day 2 · Capitolo 04**
> **Argomento:** Conditional Rendering
> **Durata stimata:** 30 minuti
> **Parte di LipariBank:** stato vuoto (`EmptyState`), badge entrata/uscita nei movimenti, informazioni condizionali nelle card dei conti

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- mostrare o nascondere parti di UI con `if`/early return, operatore ternario e `&&`;
- evitare il classico errore del `0 &&`;
- creare uno stato vuoto (`EmptyState`) per le liste;
- distinguere visivamente entrate e uscite con classi e badge condizionali.

---

## 📋 Prerequisiti
- [Day 2 · Children](./03_Children.md): `Card` esiste e `Dashboard` la usa.
- Utile: [Extra · Optional Chaining e Ternary](../Extra_JavaScript_Essentials/08_Optional_Chaining_Ternary.md).

---

## 🧭 In questo capitolo
- Tre tecniche: early return, ternario, `&&`.
- Il pitfall di `0 &&`.
- `EmptyState`, badge e informazioni condizionali.

---

## 🧠 Theory

Il JSX non ha `if`, ma JavaScript sì: scegli il valore **prima** del `return` oppure usa un'espressione dentro le graffe. Ricorda dal [capitolo JSX](../Day_01_React_Fundamentals/03_JSX.md): `false`, `null` e `undefined` non producono nulla a schermo.

### 1. Early return (`if` + `return`)
Quando una condizione cambia completamente cosa mostrare, esci subito:

```jsx
function TransactionList({ transactions }) {
  if (transactions.length === 0) {
    return <p>Nessun movimento</p>;
  }

  return <ul>...</ul>;
}
```

È la forma più leggibile per "caso speciale" (lista vuota, dati assenti). Restituire `null` significa "non mostrare niente".

### 2. Operatore ternario `? :`
Per scegliere **tra due alternative** dentro il JSX:

```jsx
<span className={isIncome ? "badge badge--income" : "badge badge--expense"}>
  {isIncome ? "Entrata" : "Uscita"}
</span>
```

### 3. Operatore `&&`
Per mostrare qualcosa **solo se** una condizione è vera:

```jsx
{account.balance > 10000 && <span className="badge badge--info">Saldo elevato</span>}
```

Se la condizione è `false`, il risultato è `false` e React non mostra nulla.

### ⚠️ Il pitfall di `0 &&`
Se a sinistra di `&&` metti un **numero**, il valore `0` **viene mostrato**:

```jsx
{transactions.length && <TransactionList transactions={transactions} />}
```

Con lista vuota la pagina mostra uno **`0`** invece di nulla. Correzioni:

```jsx
{transactions.length > 0 && <TransactionList transactions={transactions} />}
```

oppure un ternario: `{transactions.length > 0 ? <TransactionList ... /> : null}`.

> 💡 **Remember**
>
> A sinistra di `&&` metti sempre un **booleano** (`count > 0`), non un numero. Le stringhe vuote `""` non mostrano nulla, ma `0` sì.

### Quale usare?
| Situazione | Tecnica |
| --- | --- |
| Caso speciale che sostituisce tutto il componente | early return |
| Due alternative | ternario |
| Mostrare/nascondere un pezzo | `&&` con condizione booleana |
| Classe CSS diversa | ternario dentro `className` |

---

## 💻 Let's Code

### 1. `EmptyState`
Crea `src/components/EmptyState.jsx`:

```jsx title="src/components/EmptyState.jsx"
function EmptyState({ message = "Nessun dato disponibile.", hint }) {
  return (
    <div className="empty-state">
      <p className="empty-state__message">{message}</p>
      {hint && <p className="empty-state__hint">{hint}</p>}
    </div>
  );
}

export default EmptyState;
```

In `src/index.css` **aggiungi in fondo**:

```css title="src/index.css"
.empty-state {
  padding: 1rem;
  text-align: center;
  color: #6b7280;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
}

.empty-state__message {
  margin: 0;
  font-weight: 600;
}

.empty-state__hint {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
}
```

### 2. Early return in `TransactionList`
`src/components/TransactionList.jsx`:

```jsx title="src/components/TransactionList.jsx"
import EmptyState from "./EmptyState.jsx";
import TransactionItem from "./TransactionItem.jsx";

function TransactionList({ transactions }) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        message="Nessun movimento da mostrare."
        hint="Quando ci saranno operazioni, le vedrai qui."
      />
    );
  }

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

**Perché funziona.** Con un array vuoto la funzione restituisce subito `EmptyState` e il `ul` non viene creato.

**Provalo.** In `Dashboard.jsx` passa temporaneamente `transactions={[]}` a `TransactionList`: compare lo stato vuoto. Poi ripristina `recentTransactions`.

### 3. Badge e classi condizionali in `TransactionItem`
`src/components/TransactionItem.jsx`:

```jsx title="src/components/TransactionItem.jsx"
import { formatCurrency, formatDate } from "../utils/formatters.js";

function TransactionItem({ transaction }) {
  const isExpense = transaction.amount < 0;

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
      </div>
    </li>
  );
}

export default TransactionItem;
```

In `src/index.css` **aggiungi in fondo**:

```css title="src/index.css"
.transaction-item__side {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.badge {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge--income {
  color: #166534;
  background-color: #dcfce7;
}

.badge--expense {
  color: #991b1b;
  background-color: #fee2e2;
}

.badge--info {
  color: #1e40af;
  background-color: #dbeafe;
}
```

### 4. Informazioni condizionali in `AccountCard`
`AccountCard` riceve una nuova prop `transactionCount` e mostra un badge solo per saldi elevati. `src/components/AccountCard.jsx`:

```jsx title="src/components/AccountCard.jsx"
import { formatCurrency } from "../utils/formatters.js";

function AccountCard({ account, transactionCount }) {
  return (
    <article className="account-card">
      <h3 className="account-card__name">{account.name}</h3>
      <p className="account-card__iban">{account.iban}</p>
      <p className="account-card__balance">{formatCurrency(account.balance)}</p>

      {account.balance > 10000 && (
        <span className="badge badge--info">Saldo elevato</span>
      )}

      {transactionCount > 0 ? (
        <p className="account-card__meta">{transactionCount} movimenti</p>
      ) : (
        <p className="account-card__meta">Nessun movimento</p>
      )}
    </article>
  );
}

export default AccountCard;
```

Aggiorna le due card in `Dashboard.jsx` passando il conteggio. Versione **provvisoria** (nel capitolo 05 la sostituiremo con un `map`):

```jsx
const countTransactions = (accountId) =>
  transactions.filter((transaction) => transaction.accountId === accountId).length;
```

```jsx
<AccountCard
  account={accounts[0]}
  transactionCount={countTransactions(accounts[0].id)}
/>
<AccountCard
  account={accounts[1]}
  transactionCount={countTransactions(accounts[1].id)}
/>
```

La funzione `countTransactions` va dichiarata dentro `Dashboard`, prima del `return`. Risultato: `6 movimenti` per il conto corrente, `2 movimenti` per il risparmio con il badge "Saldo elevato" (12.800 > 10.000).

### 5. Il bug di `0 &&` dal vivo
In `AccountCard` sostituisci **temporaneamente** il blocco ternario con:

```jsx
{transactionCount && <p className="account-card__meta">{transactionCount} movimenti</p>}
```

Poi passa `transactionCount={0}` a una card: vedrai uno `0` a schermo. Ripristina il ternario (o usa `transactionCount > 0 &&`).

---

## 🏦 LipariBank in action
La dashboard ora "reagisce" ai dati: nessun movimento → `EmptyState`; importo negativo → badge **Uscita** e testo rosso; importo positivo → badge **Entrata** e testo verde; conto con saldo alto → badge informativo. Tutta questa logica è dentro componenti presentazionali che guardano **solo le props**.

---

## 🧪 Your Turn

**Obiettivo:** completare i casi condizionali della dashboard.

**Requisiti**
1. `EmptyState` esiste e `TransactionList` lo mostra con array vuoto (verificalo passando `[]` e poi ripristina).
2. Ogni movimento mostra il badge **Entrata** (verde) o **Uscita** (rosso) coerente con il segno di `amount`.
3. `AccountCard` mostra `N movimenti` oppure `Nessun movimento` e il badge `Saldo elevato` solo se `balance > 10000`.
4. In `BalanceCard` mostra la prop `note` **solo se presente**: usa `{note && <p className="balance-card__meta">{note}</p>}`.
5. Spiega per iscritto (in una riga) perché `{count && <X />}` può stampare `0`.

**Passi suggeriti**
- Applica le tre tecniche una per volta, controllando il browser dopo ogni modifica.
- Per verificare `BalanceCard` togli temporaneamente `note` da `Dashboard`: il paragrafo non deve comparire nemmeno vuoto.

**Risultato atteso:** nessun elemento vuoto superfluo, nessun `0` indesiderato, badge corretti.

**Criteri di completamento:** tutti i 5 requisiti verificati; `npm run lint` senza errori.

---

## ⚠️ Common Mistakes
- **`{count && <X />}` con `count` numerico**: può stampare `0`. Usa `count > 0 &&`.
- **Ternari annidati illeggibili**: se servono più di due rami, usa un `if` prima del `return` o una variabile.
- **`if` dentro il JSX**: non è valido; usa ternario o `&&`.
- **Early return prima dei Hooks**: dal Day 3 gli Hooks vanno sempre chiamati prima di qualsiasi `return` anticipato. Qui non ne usiamo ancora.
- **Condizione con stringa vuota**: `{title && ...}` con `title=""` non mostra nulla, ma attenzione a non confonderla con `0`.
- **Duplicare la classe CSS a mano** in più punti: calcola prima una variabile (`const amountClass = ...`).

---

## ✅ Checklist
- ☐ So scegliere tra early return, ternario e `&&`.
- ☐ So spiegare il problema di `0 &&`.
- ☐ `EmptyState` compare con lista vuota.
- ☐ Badge e colori riflettono entrate e uscite.
- ☐ `BalanceCard` mostra `note` solo quando c'è.

---

## 🚀 Challenge
Aggiungi in `TransactionItem` un badge `Grande importo` che compare solo per movimenti con valore assoluto maggiore di 1.000 (usa `Math.abs(transaction.amount) > 1000`). Quale movimento lo mostrerà con i dati canonici?

---

## 📌 Recap
- Tre strumenti: early return, ternario, `&&`.
- `false`, `null`, `undefined` non vengono renderizzati; `0` sì.
- Metti sempre un booleano a sinistra di `&&`.
- `EmptyState` gestisce il caso "nessun dato".
- Le classi CSS condizionali si calcolano prima del `return`.

---

### ➡️ Next
Prossimo capitolo: [Liste e Keys](./05_Liste_e_Keys.md). Abbiamo già usato `map` e `key`; ora li studiamo bene e sostituiamo le card duplicate con `AccountList`.
