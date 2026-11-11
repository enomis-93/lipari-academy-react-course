# 🏦 LipariBank — React Zero to Hero

> **Day 2 · Capitolo 06**
> **Argomento:** Esercizio LipariBank — Accounts
> **Durata stimata:** 45 minuti
> **Parte di LipariBank:** dashboard con card dei conti, lista movimenti per conto e stato vuoto, con componenti riutilizzabili (**CHECKPOINT 2 — Conti e componenti riutilizzabili**)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- consolidare l'architettura "container + componenti presentazionali" di LipariBank;
- generare sezioni ripetute con `map`, `key`, `children` e props;
- gestire lo stato vuoto di conti e movimenti;
- verificare che solo il container importi i dati.

---

## 📋 Prerequisiti
Capitoli 01-05 del Day 2 completati ([Componenti e composizione](./01_Componenti_e_Composizione.md), [Props](./02_Props.md), [Children](./03_Children.md), [Conditional Rendering](./04_Conditional_Rendering.md), [Liste e Keys](./05_Liste_e_Keys.md)). Stato del progetto:

```text
src/
├── main.jsx
├── App.jsx                 → Header + Dashboard
├── index.css
├── data/mockData.js
├── utils/formatters.js
└── components/
    ├── Header.jsx          ├── Card.jsx
    ├── BalanceCard.jsx     ├── EmptyState.jsx
    ├── AccountCard.jsx     ├── TransactionList.jsx
    ├── AccountList.jsx     └── TransactionItem.jsx
    └── Dashboard.jsx
```

---

## 🧭 In questo capitolo
- Requisiti dell'esercizio.
- Soluzione di riferimento delle parti chiave.
- Verifica dell'architettura presentazionale/container.
- Checkpoint 2.

---

## 🧠 Theory

Ripasso in tre righe, da applicare nell'esercizio:

- **Presentazionali** (`Header`, `BalanceCard`, `AccountCard`, `AccountList`, `Card`, `EmptyState`, `TransactionList`, `TransactionItem`): ricevono props, mostrano UI, non importano `mockData.js`.
- **Container** (`Dashboard`): importa i dati, calcola valori derivati (totale, ultimi movimenti, movimenti per conto) e li passa come props.
- **Liste**: `map` con `key={id}`; **vuoto**: `EmptyState`; **dati originali**: mai modificati (`sort` su copie).

> 💡 **Remember**
>
> Se un componente presentazionale ha bisogno di un dato in più, **non importarlo**: fallo passare dal container come prop.

---

## 🏦 LipariBank in action
Questo esercizio aggiunge alla dashboard la sezione **"Movimenti per conto"** e verifica che l'intera pagina sia costruita con componenti riutilizzabili. Il risultato è la base su cui nel Day 3 aggiungeremo interazione (selezione di un conto, filtri).

---

## 🧪 Your Turn

**Obiettivo:** completare la dashboard "Conti" di LipariBank rispettando la separazione tra componenti presentazionali e container (`Dashboard.jsx`).

**Requisiti (concreti e verificabili)**
1. **Saldo totale**: `BalanceCard` mostra `17.050,75 €` con nota `Somma di tutti i tuoi conti`.
2. **Card dei conti**: in una `Card` con titolo `I tuoi conti`, `AccountList` mostra una `AccountCard` per conto con nome, IBAN, saldo formattato e conteggio movimenti (`6 movimenti` e `2 movimenti`). Il conto risparmio mostra il badge `Saldo elevato`.
3. **Ultimi movimenti**: in una `Card` con titolo `Ultimi movimenti`, `TransactionList` mostra i 5 movimenti più recenti di tutti i conti (dal più recente), con badge Entrata/Uscita e importo verde/rosso.
4. **Movimenti per conto**: per **ogni conto** compare una `Card` con titolo `Movimenti · <nome conto>` che mostra al massimo i **3 movimenti più recenti di quel conto** tramite `TransactionList`.
5. **Stato vuoto**: se un conto non ha movimenti la sua card mostra `EmptyState` (verificalo con un conto di prova, vedi sotto). Se `accounts` fosse vuoto, `AccountList` mostra lo stato vuoto.
6. **Architettura**: nei componenti in `src/components/` **solo** `Dashboard.jsx` importa `mockData.js`; `App.jsx` importa solo `customer` per l'`Header`.
7. **Liste**: ogni `map` usa `key` basata su `id`; nessun warning in console.

**Passi suggeriti**
1. Controlla che i capitoli precedenti producano già i requisiti 1-3 e 5 (parte `AccountList`).
2. In `Dashboard.jsx` crea fuori dal componente una funzione `sortByDateDesc(list)` che restituisce una **copia** ordinata per data decrescente. Riusala per `recentTransactions`.
3. Per il requisito 4 mappa `accounts` direttamente nel JSX di `Dashboard`: per ogni conto filtra `transactions` per `accountId`, ordina, prendi i primi 3 e passa il risultato a `TransactionList`. `key` sulla `Card`.
4. Aggiungi **temporaneamente** un terzo conto in fondo a `accounts` in `src/data/mockData.js`:

```javascript
{ id: "acc-999", name: "Conto Prova", iban: "IT00 0000 0000 0000 0000 0000 999", balance: 0, currency: "EUR" },
```

   Verifica che la card mostri `Nessun movimento` e che la sezione `Movimenti · Conto Prova` mostri lo `EmptyState`. **Poi rimuovi il conto di prova.**
5. Esegui la verifica dell'architettura descritta più sotto.

**Risultato atteso:** una dashboard con saldo totale, due card conto, ultimi 5 movimenti e due sezioni "Movimenti · ..." (la prima con 3 righe, la seconda con 2).

**Criteri di completamento:** tutti i 7 requisiti verificati; console senza warning; `npm run lint` senza errori; dopo la prova, `mockData.js` è tornato ai dati canonici (due conti).

> ⚠️ **Prova prima da solo**
>
> Dedica almeno 25 minuti al tentativo autonomo. Sotto trovi la soluzione di riferimento delle parti chiave: usala per confrontare, non per copiare.

### Soluzione di riferimento — parti chiave

`src/components/Dashboard.jsx`:

```jsx
import { accounts, transactions } from "../data/mockData.js";
import BalanceCard from "./BalanceCard.jsx";
import Card from "./Card.jsx";
import AccountList from "./AccountList.jsx";
import TransactionList from "./TransactionList.jsx";

function sortByDateDesc(list) {
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

function Dashboard() {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  const recentTransactions = sortByDateDesc(transactions).slice(0, 5);

  return (
    <main className="dashboard">
      <BalanceCard total={totalBalance} note="Somma di tutti i tuoi conti" />

      <Card title="I tuoi conti">
        <AccountList accounts={accounts} transactions={transactions} />
      </Card>

      <Card title="Ultimi movimenti" footer="Mostrati gli ultimi 5 movimenti">
        <TransactionList transactions={recentTransactions} />
      </Card>

      {accounts.map((account) => {
        const accountTransactions = sortByDateDesc(
          transactions.filter(
            (transaction) => transaction.accountId === account.id
          )
        ).slice(0, 3);

        return (
          <Card key={account.id} title={`Movimenti · ${account.name}`}>
            <TransactionList transactions={accountTransactions} />
          </Card>
        );
      })}
    </main>
  );
}

export default Dashboard;
```

`src/components/BalanceCard.jsx`:

```jsx
import { formatCurrency } from "../utils/formatters.js";

function BalanceCard({ total, label = "Saldo totale", note }) {
  return (
    <section className="balance-card">
      <p className="balance-card__label">{label}</p>
      <p className="balance-card__value">{formatCurrency(total)}</p>
      {note && <p className="balance-card__meta">{note}</p>}
    </section>
  );
}

export default BalanceCard;
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

Gli altri componenti (`AccountCard`, `AccountList`, `Card`, `EmptyState`, `TransactionList`, `TransactionItem`) sono quelli dei capitoli 02-05 senza ulteriori modifiche.

**Perché funziona.**
- `sortByDateDesc` crea una copia: né `transactions` né il risultato di `filter` vengono alterati.
- Il `map` nel container genera una `Card` per conto: la `key` è `account.id`; l'etichetta del titolo è una template string.
- `TransactionList` non sa nulla di conti: riceve una lista (anche vuota) e decide se mostrare righe o `EmptyState`.
- Il container è l'unico a importare i dati; i figli sono riusabili con qualunque input.

### Verifica dell'architettura
Dentro `liparibank/`, in PowerShell, cerca quali componenti importano i dati:

```powershell
Select-String -Path src\components\*.jsx -Pattern "mockData"
```

Deve comparire **solo** `Dashboard.jsx`. Con un terminale bash (Git Bash, macOS, Linux) il comando equivalente è:

```bash
grep -l "mockData" src/components/*.jsx
```

---

## 🔗 Repository / Checkpoint

### CHECKPOINT 2 — Conti e componenti riutilizzabili

- **Repository del corso:** `[DA CONFIGURARE: inserire URL reale della repository]`
- **Branch/tag:** `[DA CONFIGURARE: inserire nome reale del branch]`
- **Alternativa:** la tua repository del [Day 0](../Day_00_Setup/04_Git_GitHub.md); tag suggerito `checkpoint-2-conti-componenti`.

| Domanda | Risposta |
| --- | --- |
| **Contenuto iniziale** | Stato a fine Day 1 (Checkpoint 1): dashboard statica con `Header`, `BalanceCard`, `RecentTransactions`, `TransactionItem`. |
| **Cosa completare** | `Dashboard` (container), `Card` (`children` + `title`), `AccountCard`, `AccountList`, `TransactionList`, `EmptyState`, badge entrata/uscita, sezioni "Movimenti · ..." per conto. |
| **Cosa deve già funzionare** | `npm run dev` senza errori; saldo totale `17.050,75 €`; elenco dei 5 movimenti più recenti con colori e badge. |
| **Come verificare** | Due card conto (`6 movimenti`, `2 movimenti`, badge `Saldo elevato` sul risparmio); sezioni per conto con 3 e 2 righe; `EmptyState` con conto di prova; solo `Dashboard.jsx` importa `mockData`; console senza warning; `npm run lint` senza errori. |

Per salvare il progresso (dentro `liparibank/`):

```bash
git add .
git commit -m "Day 2: conti e componenti riutilizzabili"
```

---

## ⚠️ Common Mistakes
- **Dimenticare di rimuovere il conto di prova** da `mockData.js`: il totale e le card cambiano.
- **`sort` direttamente sul risultato di `transactions`** senza copia: modifica l'array importato. Usa `sortByDateDesc`.
- **`key` mancante sulla `Card` del `map`** in `Dashboard`: warning in console.
- **Importare `mockData.js` in un componente presentazionale** per "fare prima": rompe la separazione; passa i dati come props.
- **`slice(0, 3)` prima di `sort`**: prenderesti i primi tre in ordine di array, non i più recenti. L'ordine è: filtra → ordina → taglia.
- **Titolo con `+` fra stringhe e valori**: usa le template string (`` `Movimenti · ${account.name}` ``).

---

## ✅ Checklist
- ☐ Saldo totale `17.050,75 €` con nota.
- ☐ `AccountList` mostra due card con conteggio movimenti e badge corretto.
- ☐ Ultimi 5 movimenti con badge e colori.
- ☐ Una sezione "Movimenti · ..." per conto, massimo 3 righe, ordinate per data.
- ☐ `EmptyState` verificato con il conto di prova (poi rimosso).
- ☐ Solo `Dashboard.jsx` importa `mockData.js` tra i componenti.
- ☐ Console senza warning e `npm run lint` senza errori.
- ☐ Ho salvato un commit/tag del Checkpoint 2.

---

## 🚀 Challenge
Estrai la sezione "Movimenti · <conto>" in un componente presentazionale `AccountTransactions`, con props `account` e `transactions`, definito in `src/components/AccountTransactions.jsx`. Dichiaralo nel tuo file di appunti come estensione facoltativa: i capitoli successivi **non** dipendono da questo file.

---

## 📌 Recap
- `Dashboard` è il container: importa, calcola e passa i dati.
- Gli altri componenti sono presentazionali e riusabili grazie a props e `children`.
- Liste con `map` + `key={id}`; casi vuoti con `EmptyState`.
- Ordina sempre copie dei dati: filtra → ordina → taglia.
- Hai ora una dashboard completa ma **statica**: manca l'interazione.

---

### ➡️ Next
Prossimo capitolo: [Day 3 · Event Handling](../Day_03_State_Events/01_Event_Handling.md). La dashboard è completa ma non reagisce all'utente: nel Day 3 aggiungeremo eventi e `useState`.
