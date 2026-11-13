# 🏦 LipariBank — React Zero to Hero

> **Day 3 · Capitolo 01**
> **Argomento:** Event Handling (`onClick`, `onChange`, event object)
> **Durata stimata:** 25 minuti
> **Parte di LipariBank:** le card dei conti diventano cliccabili (`AccountCard` riceve la callback `onSelect`)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- collegare un handler a `onClick` e `onChange` passando la funzione (senza chiamarla);
- passare argomenti a un handler con una arrow function;
- leggere i dati dell'evento (`event.target.value`, `event.type`);
- far arrivare un click da `AccountCard` fino a `Dashboard` tramite una callback prop.

---

## 📋 Prerequisiti
- Day 2 completato (CHECKPOINT 2): `Card`, `AccountCard`, `AccountList`, `TransactionList`, `EmptyState`, `Dashboard`, `mockData.js`. Vedi [Props](../Day_02_Components_Props/02_Props.md) e [Esercizio LipariBank Accounts](../Day_02_Components_Props/06_Esercizio_LipariBank_Accounts.md).
- Progetto `liparibank/` avviabile con `npm run dev` (dentro `liparibank/`).
- Conoscenza di funzioni e arrow function: vedi [Functions e Arrow Functions](../Extra_JavaScript_Essentials/02_Functions_Arrow_Functions.md).

---

## 🧭 In questo capitolo
- Come React gestisce gli eventi.
- La differenza tra *passare* e *chiamare* una funzione.
- L'event object.
- Callback prop: il figlio avvisa il padre.
- Esercizio sulle card dei conti.

---

## 🧠 Theory

### Eventi in React
In React gli eventi si collegano agli elementi JSX con prop in **camelCase**: `onClick`, `onChange`, `onSubmit`, `onFocus`, `onBlur`... Il valore della prop è **una funzione** (l'*handler*): React la chiama quando l'evento accade.

Convenzioni di nome:
- dentro il componente che gestisce l'evento: `handleClick`, `handleSelectAccount`;
- come prop che il padre passa al figlio: `onSelect`, `onFilterChange`.

### Passare, non chiamare
`onClick={handleClick}` passa la funzione: React la eseguirà al click.
`onClick={handleClick()}` la **esegue durante il render** e passa a React il suo risultato (di solito `undefined`). È l'errore più frequente dei principianti.

Se serve un argomento, avvolgi la chiamata in una arrow function: `onClick={() => handleSelect(account.id)}`.

### L'event object
React passa all'handler un *event object* (compatibile con quello del DOM). I campi più usati:

| Campo | Significato |
|---|---|
| `event.type` | tipo di evento (`"click"`, `"change"`) |
| `event.target` | elemento che ha generato l'evento (per un input: l'input stesso) |
| `event.target.value` | testo corrente di un input |
| `event.currentTarget` | elemento a cui è collegato l'handler |
| `event.preventDefault()` | blocca il comportamento predefinito del browser (es. invio di un form) |

> 💡 **Remember**
>
> Nel JSX passi una **funzione**: `onClick={handleClick}` oppure `onClick={() => handleClick(id)}`. Mai `onClick={handleClick()}`.

---

## 💻 Let's Code

Crea un componente di prova, che cancellerai a fine capitolo.

File `src/components/ClickDemo.jsx`:

```jsx title="src/components/ClickDemo.jsx"
function ClickDemo() {
  function handleClick(event) {
    console.log("Evento:", event.type);
  }

  function handleChange(event) {
    console.log("Valore digitato:", event.target.value);
  }

  return (
    <section>
      <button type="button" onClick={handleClick}>
        Premi
      </button>
      <input type="text" onChange={handleChange} aria-label="Prova digitazione" />
    </section>
  );
}

export default ClickDemo;
```

Per vederlo, modifica temporaneamente `src/App.jsx` (snippet parziale, non eseguibile da solo: aggiungi l'import in cima e `<ClickDemo />` nel JSX che già hai):

```jsx
import ClickDemo from "./components/ClickDemo.jsx";
```

Apri la pagina su `http://localhost:5173/`, poi gli strumenti di sviluppo del browser (tasto F12, scheda *Console*). Premi il pulsante e scrivi nel campo: vedrai i messaggi.

**Che cosa fa:** React chiama `handleClick` a ogni click e `handleChange` a ogni modifica del testo.
**Perché funziona:** abbiamo passato i riferimenti alle funzioni, non il loro risultato.
**Come modificarlo:** stampa anche `event.currentTarget.tagName` e confronta con `event.target.tagName`.
**Cosa evitare:** `onClick={handleClick()}`: il messaggio comparirebbe una volta al caricamento (due in sviluppo, per via di `StrictMode`) e non al click.

### Passare un argomento
Snippet parziale (dentro `ClickDemo`, sostituisce il `return`):

```jsx
const ids = ["acc-001", "acc-002"];

function handleSelect(accountId) {
  console.log("Conto scelto:", accountId);
}

return (
  <section>
    {ids.map((id) => (
      <button key={id} type="button" onClick={() => handleSelect(id)}>
        Scegli {id}
      </button>
    ))}
  </section>
);
```

La arrow function `() => handleSelect(id)` è la funzione passata a React; `handleSelect(id)` viene eseguita solo al click.

> ℹ️ In questo capitolo l'handler scrive solo in console: la pagina non cambia ancora. Per far cambiare la UI serve lo **state** (capitolo [useState](./02_useState.md)).

---

## 🏦 LipariBank in action

L'utente deve poter scegliere un conto. L'evento nasce in `AccountCard`, ma chi dovrà ricordare la scelta è `Dashboard`: il figlio riceve una **callback prop** e la chiama.

> Gli snippet qui sotto partono dai file di fine Day 2 e aggiungono **solo** la parte nuova (`onSelect` / `onSelectAccount` e il pulsante). Le props già esistenti (`account`, `transactionCount`, `accounts`, `transactions`) restano.

File `src/components/AccountCard.jsx`:

```jsx title="src/components/AccountCard.jsx"
import { formatCurrency } from "../utils/formatters.js";

function AccountCard({ account, transactionCount, onSelect }) {
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

      <button type="button" onClick={() => onSelect(account.id)}>
        Seleziona conto
      </button>
    </article>
  );
}

export default AccountCard;
```

File `src/components/AccountList.jsx`:

```jsx title="src/components/AccountList.jsx"
import AccountCard from "./AccountCard.jsx";
import EmptyState from "./EmptyState.jsx";

function AccountList({ accounts, transactions, onSelectAccount }) {
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
            onSelect={onSelectAccount}
          />
        );
      })}
    </div>
  );
}

export default AccountList;
```

In `src/components/Dashboard.jsx` aggiungi l'handler dentro `Dashboard` (prima del `return`) e passalo ad `AccountList` (snippet parziale: il resto del file resta com'è):

```jsx
function handleSelectAccount(accountId) {
  console.log("Conto selezionato:", accountId);
}

// nel JSX
<AccountList
  accounts={accounts}
  transactions={transactions}
  onSelectAccount={handleSelectAccount}
/>
```

Usiamo un `<button>` dentro la card (e non un `onClick` su un `div`) perché il pulsante è raggiungibile da tastiera e annunciato correttamente dagli screen reader.

---

## 🧪 Your Turn

**Obiettivo:** far arrivare l'id del conto cliccato fino a `Dashboard`.

**Requisiti**
1. `AccountCard` riceve la prop `onSelect` e la chiama con `account.id` al click sul pulsante "Seleziona conto".
2. `AccountList` inoltra `onSelectAccount` a ogni `AccountCard`.
3. `Dashboard` definisce `handleSelectAccount(accountId)` che scrive in console l'id.
4. In `ClickDemo`, prova volontariamente `onClick={handleClick()}` e annota cosa succede; poi correggilo.

**Passi suggeriti**
- Parti da `AccountCard`, poi `AccountList`, infine `Dashboard`.
- Apri la Console del browser prima di cliccare.

**Risultato atteso:** cliccando "Seleziona conto" sul Conto Corrente compare `Conto selezionato: acc-001`; sul Conto Risparmio `acc-002`.

**Criteri di completamento**
- Nessun errore in Console.
- Ogni card stampa il proprio id.
- Nessun handler è stato chiamato "per sbaglio" al caricamento della pagina.

Quando hai finito, elimina `ClickDemo.jsx` e il suo uso in `App.jsx`.

---

## ⚠️ Common Mistakes

| Errore | Sintomo | Correzione |
|---|---|---|
| `onClick={handleClick()}` | l'handler parte al render, non al click | `onClick={handleClick}` |
| `onClick={handleSelect(account.id)}` | idem, con argomento | `onClick={() => handleSelect(account.id)}` |
| `onclick` o `onClick="..."` (stringa) | l'handler non funziona | prop in camelCase e funzione tra graffe |
| Dimenticare `type="button"` dentro un form | il pulsante invia il form | `type="button"` per i pulsanti che non inviano |
| Aspettarsi che la UI cambi dopo `console.log` | non cambia nulla | serve lo state (prossimo capitolo) |

---

## ✅ Checklist
- ☐ So spiegare la differenza tra `onClick={f}` e `onClick={f()}`.
- ☐ So passare un argomento a un handler con una arrow function.
- ☐ Ho letto `event.target.value` da un input.
- ☐ `AccountCard` chiama `onSelect(account.id)` e `Dashboard` riceve l'id.
- ☐ Ho rimosso il componente di prova `ClickDemo`.

---

## 🚀 Challenge
Nell'`handleChange` di un input di prova, stampa la lunghezza del testo con `event.target.value.length`. Poi aggiungi un `onKeyDown` che stampa `event.key` e scopri cosa vale premendo `Enter`.

---

## 📌 Recap
- Gli eventi React si scrivono in camelCase e ricevono **una funzione**.
- Si *passa* l'handler, non lo si *chiama*; per gli argomenti serve una arrow function.
- L'event object dà accesso a `target`, `value`, `preventDefault()`.
- Il figlio comunica al padre chiamando una **callback prop** (`onSelect`).

---

### ➡️ Next
[Capitolo 02 — useState](./02_useState.md): gli handler ora scrivono in console; con `useState` faremo cambiare davvero la schermata (mostra/nascondi saldo).
