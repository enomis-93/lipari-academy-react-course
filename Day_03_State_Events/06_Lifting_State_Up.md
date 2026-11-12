# 🏦 LipariBank — React Zero to Hero

> **Day 3 · Capitolo 06**
> **Argomento:** Lifting State Up e dati derivati
> **Durata stimata:** 30 minuti
> **Parte di LipariBank:** `Dashboard` possiede `selectedAccountId`; `AccountList` e `TransactionList` si coordinano tramite props e callback

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- decidere in quale componente deve vivere uno state condiviso;
- far comunicare due componenti "fratelli" con props verso il basso e callback verso l'alto;
- calcolare i dati derivati durante il render invece di duplicarli in state;
- collegare la selezione del conto alla lista dei movimenti.

---

## 📋 Prerequisiti
- [Capitolo 01 — Event Handling](./01_Event_Handling.md) (callback prop) e [Capitolo 05 — Immutabilità](./05_Immutabilita_dello_State.md) (`transactions` in state).
- Container/presentational: [Componenti e Composizione](../Day_02_Components_Props/01_Componenti_e_Composizione.md).

---

## 🧭 In questo capitolo
- Il problema dei fratelli che condividono un dato.
- "Lifting state up": regola e flusso dei dati.
- Dati derivati: calcolare, non copiare.
- `Dashboard` aggiornata con conto selezionato.

---

## 🧠 Theory

### Il problema
`AccountList` deve mostrare quale conto è selezionato; `TransactionList` deve mostrare i movimenti di *quel* conto. Sono componenti separati e nessuno dei due è figlio dell'altro. Se ciascuno tenesse una propria copia della selezione, le due copie si disallineerebbero.

### La soluzione: sollevare lo state
Si porta lo state nel **più vicino antenato comune** (qui `Dashboard`):

```text
Dashboard  ── state: selectedAccountId
 ├─ AccountList      ← riceve selectedAccountId, onSelectAccount
 │   └─ AccountCard  ← chiama onSelect(account.id)
 └─ TransactionList  ← riceve i movimenti già filtrati
```

- i dati scendono con le **props**;
- le richieste di cambiamento salgono con le **callback** (`onSelectAccount`);
- chi possiede lo state è l'unico che lo modifica: **single source of truth**.

I figli diventano **presentazionali** (mostrano ciò che ricevono); `Dashboard` resta il **container** che coordina.

### Dati derivati: non duplicarli
Se un valore si può calcolare da props e state, **non metterlo in state**: calcolalo nel render.

```jsx
const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
const accountTransactions = transactions.filter((t) => t.accountId === selectedAccountId);
```

Esempio di errore: tenere in state anche `visibleTransactions` e aggiornarlo a mano a ogni cambio. Basta dimenticare un `setVisibleTransactions` e la lista mostra dati vecchi. Con il calcolo nel render la lista è **sempre coerente** con le sue fonti.

### Quanto in alto?
Solleva lo state solo quanto serve: se solo un componente usa un valore, tienilo lì. Salire troppo causa *prop drilling* (props passate attraverso molti livelli), limite che affronteremo con Context (Day 7).

> 💡 **Remember**
>
> Lo state minimo vive nel padre comune; gli altri valori si **derivano**. Props giù, callback su.

---

## 💻 Let's Code

Piccolo esempio isolato (snippet): due fratelli sincronizzati dal padre.

File `src/components/SyncDemo.jsx` (componente di prova: montalo temporaneamente in `App.jsx` ed eliminalo a fine capitolo):

```jsx
import { useState } from "react";

function ChoiceList({ options, selected, onSelect }) {
  return (
    <ul>
      {options.map((option) => (
        <li key={option}>
          <button type="button" onClick={() => onSelect(option)}>
            {option === selected ? `[x] ${option}` : option}
          </button>
        </li>
      ))}
    </ul>
  );
}

function ChoiceDetail({ selected }) {
  return <p>Hai scelto: {selected}</p>;
}

function SyncDemo() {
  const [selected, setSelected] = useState("Conto Corrente");

  return (
    <section>
      <ChoiceList
        options={["Conto Corrente", "Conto Risparmio"]}
        selected={selected}
        onSelect={setSelected}
      />
      <ChoiceDetail selected={selected} />
    </section>
  );
}

export default SyncDemo;
```

**Che cosa fa:** i due figli non si conoscono; si aggiornano insieme perché leggono lo stesso valore dal padre.
**Perché funziona:** `SyncDemo` possiede lo state e passa `setSelected` come callback `onSelect`.
**Come modificarlo:** aggiungi un terzo figlio che mostra la lunghezza del nome scelto: nessuna modifica agli altri due.
**Cosa evitare:** uno state `selected` dentro `ChoiceList` *e* uno dentro `ChoiceDetail`.

---

## 🏦 LipariBank in action

### 1. `AccountCard` mostra se è selezionata
File `src/components/AccountCard.jsx` (aggiornato: nuova prop `isSelected`; le altre props e le classi CSS di Day 2 restano):

```jsx
import { formatCurrency } from "../utils/formatters.js";

function AccountCard({
  account,
  transactionCount,
  isSelected,
  hideBalance,
  onSelect,
}) {
  return (
    <article
      className={isSelected ? "account-card account-card--selected" : "account-card"}
    >
      <h3 className="account-card__name">{account.name}</h3>
      <p className="account-card__iban">{account.iban}</p>
      <p className="account-card__balance">
        {hideBalance ? "••••••" : formatCurrency(account.balance)}
      </p>

      {account.balance > 10000 && (
        <span className="badge badge--info">Saldo elevato</span>
      )}

      {transactionCount > 0 ? (
        <p className="account-card__meta">{transactionCount} movimenti</p>
      ) : (
        <p className="account-card__meta">Nessun movimento</p>
      )}

      <button type="button" onClick={() => onSelect(account.id)}>
        {isSelected ? "Conto selezionato" : "Seleziona conto"}
      </button>
    </article>
  );
}

export default AccountCard;
```

### 2. `AccountList` riceve `selectedAccountId`
File `src/components/AccountList.jsx`:

```jsx
import AccountCard from "./AccountCard.jsx";
import EmptyState from "./EmptyState.jsx";

function AccountList({
  accounts,
  transactions,
  selectedAccountId,
  hideBalance,
  onSelectAccount,
}) {
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
            isSelected={account.id === selectedAccountId}
            hideBalance={hideBalance}
            onSelect={onSelectAccount}
          />
        );
      })}
    </div>
  );
}

export default AccountList;
```

### 3. `Dashboard` possiede lo state e deriva i dati
File `src/components/Dashboard.jsx` (stato a fine capitolo). Rispetto a Day 2 la dashboard mostra i movimenti del **solo conto selezionato**: la card "Ultimi movimenti" e le card per-conto vengono sostituite da un'unica card; `handleSelectAccount` del capitolo 01 non serve più, perché si passa direttamente il setter:

```jsx
import { useState } from "react";
import { accounts, transactions as initialTransactions } from "../data/mockData.js";
import AccountList from "./AccountList.jsx";
import BalanceCard from "./BalanceCard.jsx";
import Card from "./Card.jsx";
import TransactionList from "./TransactionList.jsx";

function Dashboard() {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0].id);
  const [hideBalance, setHideBalance] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);
  const accountTransactions = transactions
    .filter((transaction) => transaction.accountId === selectedAccountId)
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
        <TransactionList
          transactions={accountTransactions}
          onToggleFavorite={handleToggleFavorite}
        />
      </Card>
    </main>
  );
}

export default Dashboard;
```

Punti da notare:

- `selectedAccount` e `accountTransactions` **non** sono state: sono calcolati a ogni render.
- `.filter(...)` restituisce già un nuovo array, quindi `.sort(...)` ordina la copia e non muta `transactions`.
- `onSelectAccount={setSelectedAccountId}`: il setter è una funzione e `AccountCard` la chiama con `account.id`, quindi si può passare direttamente. Se servisse un'azione in più, useresti un `handleSelectAccount`.
- `onToggleFavorite` viene collegato ai pulsanti nel capitolo 07; finché `TransactionList` non lo usa, ignorerà la prop senza errori.

Aggiungi in `src/index.css` lo stile della selezione:

```css
.account-card--selected {
  outline: 2px solid #0b5fff;
  border-radius: 8px;
  padding: 0.5rem;
}
```

Verifica: all'avvio i movimenti sono quelli di "Conto Corrente"; cliccando "Seleziona conto" su "Conto Risparmio" il titolo diventa `Movimenti — Conto Risparmio` e compaiono `Accantonamento mensile` e `Interessi maturati`.

---

## 🧪 Your Turn

**Obiettivo:** aggiungere informazioni **derivate** sul conto selezionato, senza nuovi state.

**Requisiti**
1. Sopra la lista movimenti mostra "Conto selezionato: *nome*".
2. Mostra il numero di movimenti del conto: `N movimenti`.
3. Mostra il totale delle entrate del conto selezionato (somma degli `amount` > 0) con `formatCurrency`.
4. Tutti e tre i valori sono calcolati nel render da `selectedAccount` / `accountTransactions`: **nessun** `useState` aggiuntivo.

**Passi suggeriti**
- Per il totale usa `filter` + `reduce` su `accountTransactions`.
- Nascondi il totale quando `hideBalance` è attivo? Decidi tu, ma documenta la scelta in un commento.

**Risultato atteso:** per "Conto Corrente" vedi 6 movimenti e entrate pari a `2.145,00 €` (2100 + 45); per "Conto Risparmio" 2 movimenti e entrate `312,50 €` (300 + 12,5).

**Criteri di completamento**
- I valori cambiano appena selezioni un altro conto.
- Nessuno dei tre valori è in uno state.
- Nessun warning in Console.

---

## ⚠️ Common Mistakes

| Errore | Correzione |
|---|---|
| Stesso dato in state in due componenti | un solo proprietario, gli altri ricevono props |
| `useState` per un valore calcolabile (`visibleTransactions`) | calcolarlo nel render |
| Copiare una prop in state (`useState(props.x)`) | usare la prop direttamente; il valore iniziale non si risincronizza |
| `selectedAccount` è `undefined` perché `selectedAccountId` non corrisponde | inizializzare con un id esistente (`accounts[0].id`) |
| Ordinare con `transactions.sort(...)` direttamente | ordinare su una copia (`filter(...)` o `[...transactions]`) |
| Passare tante props attraverso livelli inutili | sollevare lo state solo fin dove serve |

---

## ✅ Checklist
- ☐ `selectedAccountId` vive solo in `Dashboard`.
- ☐ Cliccando un conto cambia sia la card evidenziata sia la lista movimenti.
- ☐ `selectedAccount` e `accountTransactions` sono dati derivati, non state.
- ☐ Ho spiegato a voce "props giù, callback su".

---

## 🚀 Challenge
Al primo render viene selezionato `accounts[0]`. Cosa accadrebbe con `accounts` vuoto? Aggiungi un controllo in `Dashboard` che mostri `EmptyState` se non ci sono conti, rispettando la regola che gli Hook vanno chiamati **prima** di qualunque `return` anticipato.

---

## 📌 Recap
- Lo state condiviso va nel **padre comune più vicino**.
- Flusso: dati con props verso il basso, eventi con callback verso l'alto.
- I figli presentazionali non duplicano lo state del container.
- **Dati derivati**: si calcolano nel render, non si copiano in state.

---

### ➡️ Next
[Capitolo 07 — Esercizio LipariBank Transactions](./07_Esercizio_LipariBank_Transactions.md): aggiungerai filtri entrate/uscite, ricerca testuale e il pulsante "preferito", chiudendo il CHECKPOINT 3.
