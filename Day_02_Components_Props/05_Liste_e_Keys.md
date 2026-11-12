# 🏦 LipariBank — React Zero to Hero

> **Day 2 · Capitolo 05**
> **Argomento:** Liste e Keys
> **Durata stimata:** 30 minuti
> **Parte di LipariBank:** nuovo componente `AccountList` che genera le card dei conti con `map` e `key`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- trasformare un array di dati in un elenco di componenti con `map`;
- assegnare una `key` stabile e unica (`id`);
- spiegare perché non si usa l'indice dell'array come `key` quando la lista può cambiare;
- usare `<Fragment key>` quando ogni voce della lista produce più elementi;
- combinare `filter`, `sort` e `map` senza modificare i dati originali.

---

## 📋 Prerequisiti
- [Day 2 · Conditional Rendering](./04_Conditional_Rendering.md): `EmptyState`, `TransactionList` con early return, `AccountCard` con `transactionCount`.
- Utile: [Extra · Map, Filter, Reduce](../Extra_JavaScript_Essentials/04_Map_Filter_Reduce.md).

---

## 🧭 In questo capitolo
- `map` per generare elenchi in JSX.
- Il ruolo della `key` e perché `key={index}` è rischioso.
- `<Fragment key>` per le voci con più elementi.
- `AccountList` al posto delle card scritte a mano.
- Pipeline `filter` → `sort` → `map`.

---

## 🧠 Theory

### `map` nel JSX
Un array di JSX è renderizzabile. Trasforma i dati con `map` direttamente tra le graffe:

```jsx
<ul>
  {transactions.map((transaction) => (
    <li key={transaction.id}>{transaction.description}</li>
  ))}
</ul>
```

### La `key`
React usa la `key` per **identificare** ogni elemento di una lista tra un render e l'altro: capire quale elemento è nuovo, rimosso, spostato.

Regole:

1. **Unica tra i fratelli**: nello stesso array nessun duplicato (non serve che sia unica in tutta l'app).
2. **Stabile**: lo stesso dato deve avere sempre la stessa `key`.
3. **Sul primo elemento restituito dal `map`**: `<TransactionItem key={...} />`, non dentro il componente.
4. **Non è una prop**: il componente figlio non la riceve (`props.key` non esiste).

La scelta migliore è l'`id` del dato: `key={transaction.id}`.

Come React usa questa identità per decidere che cosa aggiornare nella pagina lo vedremo nel [Day 3 · Virtual DOM e riconciliazione](../Day_03_State_Events/04_Virtual_DOM_e_Riconciliazione.md).

### Perché non `key={index}`
L'indice identifica una **posizione**, non un **dato**. Se la lista viene riordinata, filtrata, o si inserisce un elemento in cima, la posizione cambia: React crede che sia lo stesso elemento con dati diversi, e può riusare male il DOM e lo stato interno dei figli (testo scritto in un campo, elementi aperti/chiusi, focus).

```jsx
// Da evitare quando la lista può cambiare
{transactions.map((transaction, index) => (
  <TransactionItem key={index} transaction={transaction} />
))}
```

Con liste statiche e mai riordinate non causa problemi visibili: ma in LipariBank le liste cambieranno (filtri, ordinamento, nuovi bonifici dal Day 3-4), quindi **si usa sempre l'`id`**. Anche `key={Math.random()}` è sbagliato: la chiave cambia a ogni render e distrugge/ricrea tutti gli elementi.

> 💡 **Remember**
>
> `key` = identità del dato. Usa l'`id` del dato: mai l'indice (se la lista può cambiare) e mai valori casuali.

### Più elementi per voce: `<Fragment key>`
A volte ogni voce della lista produce **due elementi fratelli** e non esiste un contenitore naturale. L'esempio classico è un elenco di definizioni, dove a ogni conto corrispondono un `<dt>` e un `<dd>`.

La `key` va sull'elemento più esterno restituito dal `map`, ma il Fragment breve `<>...</>` non accetta attributi. Serve la forma estesa, vista nel [Day 1 · JSX](../Day_01_React_Fundamentals/03_JSX.md):

```jsx
import { Fragment } from "react";

<dl>
  {accounts.map((account) => (
    <Fragment key={account.id}>
      <dt>{account.name}</dt>
      <dd>{account.iban}</dd>
    </Fragment>
  ))}
</dl>
```

Nel DOM compaiono solo `<dt>` e `<dd>`, direttamente dentro `<dl>`: nessun nodo in più, e React sa comunque a quale conto appartiene ogni coppia.

### Preparare i dati: `filter`, `sort`, `map`
`filter` e `map` restituiscono **nuovi array**. `sort` invece modifica l'array su cui lavora: ordina sempre una copia (`[...list].sort(...)`) o il risultato di un `filter`/`map` (che è già un nuovo array).

---

## 💻 Let's Code

### 1. `AccountList`
Crea `src/components/AccountList.jsx`:

```jsx
import AccountCard from "./AccountCard.jsx";
import EmptyState from "./EmptyState.jsx";

function AccountList({ accounts, transactions }) {
  if (accounts.length === 0) {
    return <EmptyState message="Nessun conto disponibile." />;
  }

  return (
    <div className="account-list">
      {accounts.map((account) => {
        const transactionCount = transactions.filter(
          (transaction) => transaction.accountId === account.id
        ).length;

        return (
          <AccountCard
            key={account.id}
            account={account}
            transactionCount={transactionCount}
          />
        );
      })}
    </div>
  );
}

export default AccountList;
```

**Cosa fa.** Per ogni conto crea un `AccountCard` e calcola quanti movimenti gli appartengono.

**Perché funziona.** `map` restituisce un array di elementi; la `key` è sul componente restituito. Il `filter` crea un array nuovo e non modifica `transactions`.

**Come modificarlo.** Aggiungi un terzo conto a `mockData.js` (poi rimuovilo): comparirà una nuova card senza toccare `AccountList`. Se svuoti `accounts`, vedi lo stato vuoto.

**Errori da evitare.** Dimenticare `return` dentro la funzione del `map` quando usi le graffe `{ }` (con le parentesi tonde `( )` il return è implicito).

### 2. Stili della lista
In `src/index.css` **aggiungi in fondo**:

```css
.account-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}
```

### 3. Usare `AccountList` in `Dashboard`
`src/components/Dashboard.jsx` (ora le card dei conti sono generate da `map`, e `countTransactions` non serve più):

```jsx
import { accounts, transactions } from "../data/mockData.js";
import BalanceCard from "./BalanceCard.jsx";
import Card from "./Card.jsx";
import AccountList from "./AccountList.jsx";
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
      <BalanceCard total={totalBalance} note="Somma di tutti i tuoi conti" />

      <Card title="I tuoi conti">
        <AccountList accounts={accounts} transactions={transactions} />
      </Card>

      <Card title="Ultimi movimenti" footer="Mostrati gli ultimi 5 movimenti">
        <TransactionList transactions={recentTransactions} />
      </Card>
    </main>
  );
}

export default Dashboard;
```

Se nel capitolo 03 non hai aggiunto la prop `footer` a `Card`, rimuovi l'attributo `footer`.

### 4. Vedere il warning delle `key`
Togli **temporaneamente** `key={transaction.id}` da `TransactionList.jsx`, salva e apri la console del browser (`F12`): React segnala che ogni elemento della lista deve avere una `key` univoca. Rimettila subito.

---

## 🏦 LipariBank in action
`AccountList` e `TransactionList` sono ora i due "contenitori di liste" di LipariBank. Entrambi:

- ricevono i dati dal container (`Dashboard`);
- gestiscono il caso vuoto con `EmptyState`;
- delegano la singola riga/card a un componente dedicato (`AccountCard`, `TransactionItem`);
- usano come `key` l'`id` del dato.

Nel Day 3 i filtri cambieranno il contenuto della lista: grazie alle `key` basate sugli `id`, React saprà quali righe sono rimaste e quali no.

---

## 🧪 Your Turn

**Obiettivo:** esercitarti con `map`, `key` e il passaggio di dati, usando i beneficiari fittizi.

**Requisiti**
1. In `Dashboard`, importa anche `beneficiaries` da `mockData.js` e aggiungi una `Card` con titolo `Beneficiari` che mostra l'elenco con un `<ul className="transaction-list">`.
2. Ogni riga è un `<li className="transaction-item">` con due elementi: il nome del beneficiario e il suo IBAN (fittizio) in un `span` di classe `transaction-item__meta`.
3. Ogni `<li>` ha `key={beneficiary.id}`.
4. Con le dimostrazioni seguenti spiega per iscritto cosa osservi: (a) rimuovi la `key` e leggi il warning; (b) metti due beneficiari con lo stesso `id` in un array di prova e leggi il warning per `key` duplicate. Ripristina tutto.
5. Al termine **rimuovi** la card `Beneficiari` (è un esercizio di sola pratica: la lista beneficiari tornerà utile nel Day 4 dentro il form).

**Passi suggeriti**
- Copia la struttura di `TransactionList`.
- Usa le parentesi tonde nel `map` per il return implicito.

**Risultato atteso:** una card con tre beneficiari (Giulia Bianchi, Luca Verdi, Condominio Lipari (fittizio)), nessun warning in console.

**Criteri di completamento:** nessun warning sulle `key`; dopo l'esercizio la dashboard torna allo stato precedente.

---

## ⚠️ Common Mistakes
- **`key` mancante**: warning in console e possibile comportamento anomalo.
- **`key={index}`** in liste che cambiano (filtri, ordinamento, inserimenti): usa l'`id`.
- **`key` duplicate**: due elementi con la stessa `key` nello stesso array creano comportamenti imprevedibili.
- **`key` sull'elemento sbagliato**: va sull'elemento restituito dal `map`, non su un figlio interno.
- **`sort` su un array importato**: lo modifica. Usa `[...list].sort(...)`.
- **Dimenticare `return`** quando il callback usa le graffe.
- **`key` sul Fragment breve**: `<>` non accetta attributi; quando la voce ha più elementi usa `<Fragment key={...}>`.
- **Aspettarsi `props.key`**: non esiste; se serve l'id al figlio, passa anche `id={account.id}`.

---

## ✅ Checklist
- ☐ So scrivere un `map` che restituisce componenti con `key`.
- ☐ So spiegare perché si usa l'`id` e non l'indice.
- ☐ Ho creato `AccountList` e la uso in `Dashboard`.
- ☐ Non modifico mai gli array originali.
- ☐ Ho svolto l'esercizio dei beneficiari e l'ho rimosso.

---

## 🚀 Challenge
Aggiungi a `TransactionList` una piccola intestazione che mostra `N movimenti` usando `transactions.length` e mostra il conteggio al singolare quando `N` vale 1 (`1 movimento`). Gestisci anche il caso 0 senza stampare "0 movimenti" ma restituendo lo stato vuoto.

---

## 📌 Recap
- `map` trasforma un array di dati in un array di elementi JSX.
- La `key` identifica un dato: deve essere unica tra fratelli e stabile.
- Usa `key={item.id}`; non l'indice e non valori casuali.
- Se una voce produce più elementi, raggruppali con `<Fragment key={item.id}>`.
- `filter` e `map` creano nuovi array; `sort` va applicato a una copia.
- `AccountList` e `TransactionList` mostrano liste e gestiscono il caso vuoto.

---

### ➡️ Next
Prossimo capitolo: [Esercizio LipariBank — Accounts](./06_Esercizio_LipariBank_Accounts.md). Metterai insieme componenti riutilizzabili, props, children, rendering condizionale e liste in una dashboard completa, con anche i movimenti per ogni conto.
