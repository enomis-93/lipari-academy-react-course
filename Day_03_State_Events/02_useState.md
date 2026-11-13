# 🏦 LipariBank — React Zero to Hero

> **Day 3 · Capitolo 02**
> **Argomento:** `useState`
> **Durata stimata:** 30 minuti
> **Parte di LipariBank:** pulsante "Nascondi/Mostra saldi" nella `Dashboard` (state `hideBalance`)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- dichiarare uno state con `useState` (valore iniziale, valore corrente, setter);
- aggiornare lo state da un handler, anche con la forma funzionale `setX(prev => ...)`;
- scegliere il tipo di valore da tenere in state (boolean, string, number);
- implementare il toggle "mostra/nascondi saldo" in LipariBank.

---

## 📋 Prerequisiti
- [Capitolo 01 — Event Handling](./01_Event_Handling.md): `AccountCard` chiama `onSelect`, `Dashboard` ha `handleSelectAccount`.
- Destructuring di array: [Destructuring, Spread, Rest](../Extra_JavaScript_Essentials/05_Destructuring_Spread_Rest.md).

---

## 🧭 In questo capitolo
- Cos'è lo state e a cosa serve.
- Sintassi di `useState` e regole degli Hook.
- Aggiornamento funzionale.
- Toggle del saldo in `Dashboard`, `BalanceCard` e `AccountCard`.

---

## 🧠 Theory

Un componente è una funzione che viene **rieseguita** a ogni render: le sue variabili locali ripartono da zero. Per ricordare un valore tra un render e l'altro, e far ridisegnare la UI quando cambia, serve lo **state**.

```jsx
const [hidden, setHidden] = useState(false);
```

- `hidden`: il valore corrente (qui `false` al primo render);
- `setHidden`: la funzione che **aggiorna** il valore e chiede a React un nuovo render;
- `false`: il valore iniziale, usato **solo al primo render**.

I nomi seguono la convenzione `[cosa, setCosa]`.

### Regole degli Hook
- Si chiamano solo **al livello principale** del componente: mai dentro `if`, cicli o funzioni annidate.
- Si chiamano solo in Function Components (o in custom hooks, Day 8).
- Si importano da React: `import { useState } from "react";`.

### Aggiornamento funzionale
Quando il nuovo valore dipende dal precedente, usa la forma funzionale: React ti passa il valore più recente.

```jsx
setHidden((prev) => !prev);
setCount((prev) => prev + 1);
```

### Più state, un solo componente
Puoi usare `useState` più volte. Tieni valori **semplici e indipendenti** in state separati (`hideBalance`, `searchText`); quando più valori cambiano insieme (come i campi di un form, Day 4) conviene un oggetto.

### Inizializzazione "lazy"
Se il valore iniziale è costoso da calcolare, passa una funzione: `useState(() => calcolaIniziale())`. Verrà eseguita una sola volta. Per i valori di LipariBank non serve.

> 💡 **Remember**
>
> Lo state è la **memoria** del componente. Non è una variabile normale: si legge dalla variabile e si modifica **solo** con il setter.

---

## 💻 Let's Code

Componente di prova, da eliminare a fine capitolo.

File `src/components/BalanceToggleDemo.jsx`:

```jsx title="src/components/BalanceToggleDemo.jsx"
import { useState } from "react";
import { formatCurrency } from "../utils/formatters.js";

function BalanceToggleDemo() {
  const [hidden, setHidden] = useState(false);

  function handleToggle() {
    setHidden((prev) => !prev);
  }

  return (
    <section>
      <p>Saldo: {hidden ? "••••••" : formatCurrency(4250.75)}</p>
      <button type="button" onClick={handleToggle}>
        {hidden ? "Mostra saldo" : "Nascondi saldo"}
      </button>
    </section>
  );
}

export default BalanceToggleDemo;
```

Aggiungilo temporaneamente a `App.jsx` (`import BalanceToggleDemo from "./components/BalanceToggleDemo.jsx";` e `<BalanceToggleDemo />` nel JSX).

**Che cosa fa:** a ogni click il saldo passa da visibile a nascosto e viceversa.
**Perché funziona:** `setHidden` cambia lo state; React riesegue `BalanceToggleDemo`, che ora legge il nuovo `hidden` e restituisce un JSX diverso.
**Come modificarlo:** aggiungi un secondo state `count` e un pulsante "+1" che usa `setCount((prev) => prev + 1)`.
**Cosa evitare:** `hidden = !hidden`. Non cambia nulla sullo schermo: la UI si aggiorna solo tramite il setter.

### Tipi di valore
```jsx
const [hideBalance, setHideBalance] = useState(false);
const [searchText, setSearchText] = useState("");
const [filter, setFilter] = useState("all");
const [selectedAccountId, setSelectedAccountId] = useState("acc-001");
```

Valori scelti con cura: `""` per un testo vuoto (non `null`), un id (stringa) per una selezione, una stringa-enum per un filtro.

---

## 🏦 LipariBank in action

Aggiungiamo a `Dashboard` lo state `hideBalance` e lo usiamo per mascherare i saldi. Lo state vive in `Dashboard` perché dovrà influenzare più figli (`BalanceCard` e `AccountCard`): ne parleremo nel capitolo [Lifting State Up](./06_Lifting_State_Up.md).

> Gli snippet partono dai file di fine Day 2 / ch. 01 e aggiungono **solo** la novità: la prop booleana (`hidden` / `hideBalance`). Le props già esistenti restano.

File `src/components/BalanceCard.jsx` (aggiornato: nuova prop `hidden`):

```jsx title="src/components/BalanceCard.jsx"
import { formatCurrency } from "../utils/formatters.js";

function BalanceCard({ total, label = "Saldo totale", note, hidden = false }) {
  return (
    <section className="balance-card">
      <p className="balance-card__label">{label}</p>
      <p className="balance-card__value">
        {hidden ? "••••••" : formatCurrency(total)}
      </p>
      {note && <p className="balance-card__meta">{note}</p>}
    </section>
  );
}

export default BalanceCard;
```

File `src/components/AccountCard.jsx` (aggiornato: nuova prop `hideBalance`):

```jsx title="src/components/AccountCard.jsx"
import { formatCurrency } from "../utils/formatters.js";

function AccountCard({ account, transactionCount, hideBalance, onSelect }) {
  return (
    <article className="account-card">
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
        Seleziona conto
      </button>
    </article>
  );
}

export default AccountCard;
```

File `src/components/AccountList.jsx` (aggiornato: inoltra `hideBalance`):

```jsx title="src/components/AccountList.jsx"
import AccountCard from "./AccountCard.jsx";
import EmptyState from "./EmptyState.jsx";

function AccountList({ accounts, transactions, hideBalance, onSelectAccount }) {
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

In `src/components/Dashboard.jsx` aggiungi (snippet parziale: gli import esistenti restano, aggiungi `useState`; `totalBalance` è già calcolato dal Day 2):

```jsx
import { useState } from "react";

// dentro Dashboard(), prima del return
const [hideBalance, setHideBalance] = useState(false);

// nel JSX
<button type="button" onClick={() => setHideBalance((prev) => !prev)}>
  {hideBalance ? "Mostra saldi" : "Nascondi saldi"}
</button>
<BalanceCard
  total={totalBalance}
  note="Somma di tutti i tuoi conti"
  hidden={hideBalance}
/>
<AccountList
  accounts={accounts}
  transactions={transactions}
  hideBalance={hideBalance}
  onSelectAccount={handleSelectAccount}
/>
```

Salva e prova: un click maschera il saldo totale e quello di entrambi i conti, un altro click li mostra.

---

## 🧪 Your Turn

**Obiettivo:** completare il toggle dei saldi e aggiungere un secondo state indipendente.

**Requisiti**
1. `Dashboard` ha `hideBalance` (valore iniziale `false`) e un pulsante che lo inverte con la forma funzionale.
2. Con `hideBalance` attivo, `BalanceCard` e ogni `AccountCard` mostrano `••••••` al posto dell'importo.
3. Il testo del pulsante cambia: "Nascondi saldi" / "Mostra saldi".
4. I movimenti (`TransactionList`) restano visibili: nascondere il saldo non nasconde la lista.

**Passi suggeriti**
- Dichiara lo state in `Dashboard`, poi passa la prop ai figli, uno alla volta.
- Se un importo non si maschera, controlla di aver passato la prop in **tutti** i livelli (`Dashboard` → `AccountList` → `AccountCard`).

**Risultato atteso:** all'avvio vedi `4.250,75 €` (formattato in italiano dal tuo `formatCurrency`) e `12.800,00 €`; dopo il click vedi solo `••••••`.

**Criteri di completamento**
- Il toggle funziona avanti e indietro, più volte.
- Nessun warning in Console.
- Lo state è dichiarato una sola volta, in `Dashboard`.

Poi elimina `BalanceToggleDemo.jsx` e il suo uso in `App.jsx`.

---

## ⚠️ Common Mistakes

| Errore | Correzione |
|---|---|
| Modificare la variabile (`hideBalance = true`) | usare il setter: `setHideBalance(true)` |
| `useState` dentro un `if` o un ciclo | sempre al livello principale del componente |
| Dimenticare `import { useState } from "react"` | aggiungere l'import |
| `useState(null)` per un testo di input | partire da `""` (utile nel Day 4) |
| `onClick={setHideBalance(true)}` | `onClick={() => setHideBalance(true)}` (vedi capitolo 03) |
| Usare un state per un valore calcolabile dagli altri | calcolarlo durante il render (capitolo 06) |

---

## ✅ Checklist
- ☐ So leggere `const [x, setX] = useState(initial)`.
- ☐ So usare `setX((prev) => ...)` quando il nuovo valore dipende dal precedente.
- ☐ `hideBalance` funziona in `Dashboard`, `BalanceCard` e `AccountCard`.
- ☐ Ho eliminato il componente di prova.

---

## 🚀 Challenge
Aggiungi un secondo pulsante "Reset" che riporta `hideBalance` a `false`. Poi chiediti: perché `setHideBalance(false)` va bene qui, mentre per l'inversione è meglio la forma funzionale?

---

## 📌 Recap
- `useState` restituisce `[valore, setter]`; il valore iniziale conta solo al primo render.
- Si modifica lo state **solo** con il setter, che provoca un nuovo render.
- `setX((prev) => ...)` quando il nuovo valore dipende dal precedente.
- Gli Hook vanno chiamati sempre al livello principale del componente.

---

### ➡️ Next
[Capitolo 03 — State e Re-render](./03_State_e_Rerender.md): capiremo *perché* lo state non è una variabile normale e cosa succede esattamente a ogni aggiornamento.
