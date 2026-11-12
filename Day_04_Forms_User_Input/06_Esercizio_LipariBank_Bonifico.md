# 🏦 LipariBank — React Zero to Hero

> **Day 4 · Capitolo 06**
> **Argomento:** Esercizio — bonifico simulato e saldi ricalcolati (CHECKPOINT 4)
> **Durata stimata:** 60 minuti
> **Parte di LipariBank:** `TransferForm` + `validators.js` + `Dashboard` (`handleAddTransfer`, saldo mostrato ricalcolato, focus sul campo da correggere)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- completare e verificare il flusso "form → validazione → submit → state → UI";
- ricalcolare i saldi mostrati come **dati derivati** dallo state dei movimenti;
- verificare l'app con scenari di test manuali precisi;
- spiegare perché il bonifico è una **simulazione** e cosa servirebbe per renderlo reale.

---

## 📋 Prerequisiti
- Capitoli 01-05 di questo Day: [Form e Controlled Components](./01_Form_e_Controlled_Components.md), [Input e Select](./02_Input_e_Select.md), [Validazione](./03_Validazione.md), [Submit e Feedback](./04_Submit_e_Feedback.md), [`useRef`](./05_useRef.md).
- Stato del progetto: `TransferForm` (con la gestione del focus), `validators.js`, `handleAddTransfer` funzionanti; i saldi nelle card sono ancora quelli iniziali di `mockData.js`.

---

## 🧭 In questo capitolo
- Requisiti dell'esercizio.
- Scenari di verifica.
- Soluzione di riferimento (dopo averci provato).
- CHECKPOINT 4.

---

## 🧠 Theory

> 🔒 **Simulazione.** LipariBank non esegue operazioni bancarie. Il "bonifico" modifica solo lo state in memoria. Un'applicazione reale invierebbe la richiesta a un server, che rivaliderebbe tutto, autenticherebbe l'utente ed eseguirebbe l'operazione.

### Saldo come dato derivato
I conti di `mockData.js` hanno un `balance` iniziale. Dopo un bonifico simulato il saldo **mostrato** deve cambiare. Non modifichiamo `accounts` (dati importati, costanti) e non creiamo uno state `balances` da tenere sincronizzato: **calcoliamo** il saldo a ogni render come

```text
saldo mostrato = balance iniziale + somma degli importi dei movimenti aggiunti nella sessione
```

I movimenti "aggiunti" sono quelli il cui `id` non è nei dati iniziali. (I saldi dei dati fittizi non sono ricavati dai movimenti elencati: per questo non sommiamo *tutti* i movimenti.)

### Arrotondamento
In JavaScript `0.1 + 0.2` non vale `0.3`. Per una simulazione basta arrotondare a due decimali con `Math.round(x * 100) / 100`. Nei sistemi reali gli importi si gestiscono in **centesimi interi** o con tipi decimali dedicati.

> 💡 **Remember**
>
> Se un valore si può calcolare da altri dati (saldo, totale, conteggi), **non** metterlo in state: derivalo. Così `TransferForm`, `AccountList` e `BalanceCard` mostrano sempre lo stesso numero.

---

## 💻 Let's Code

Non c'è codice guidato: parti dal tuo progetto del capitolo 04 e segui i requisiti. Avvia l'app (dentro `liparibank/`):

```bash
npm run dev
```

---

## 🏦 LipariBank in action

L'utente "Mario Rossi" deve poter inserire un bonifico, ricevere una conferma chiara, vedere il nuovo movimento nell'elenco e il saldo diminuito, e non poter spendere più di quanto ha sul conto.

---

## 🧪 Your Turn

### Obiettivo
Completare il bonifico simulato con saldi coerenti in tutta la dashboard.

### Requisiti
1. **Campi**: conto di addebito (select), beneficiario (select da `beneficiaries`), importo (input number), causale (textarea); tutti controllati con **un solo** state a oggetto.
2. **Validazione** (`src/utils/validators.js`, funzione `validateTransfer(values, availableBalance)`):
   - conto, beneficiario, importo e causale obbligatori;
   - importo > 0 e con al massimo 2 decimali;
   - importo ≤ saldo **mostrato** del conto scelto;
   - causale al massimo 140 caratteri.
3. **Errori** per campo con `role="alert"`, `aria-invalid` e `aria-describedby`; nessun messaggio del browser (`noValidate`).
4. **Submit**: `preventDefault()`, validazione, poi `onAddTransfer`. Con errori non viene creato nulla.
5. **Dashboard**: `handleAddTransfer` aggiunge il movimento `{ id, accountId, date, description: "Bonifico a <nome>", amount: -importo, category: "Bonifici" }` immutabilmente.
6. **Saldi ricalcolati**: le card dei conti, il saldo totale e il "Saldo disponibile" del form mostrano il saldo aggiornato (dato derivato, **nessun** state `balances`).
7. **Feedback**: conferma con `role="status"` che dichiara che il bonifico è simulato; form azzerato.
8. **Dati**: solo i beneficiari fittizi di `mockData.js`.
9. **Focus**: dopo un invio non valido il focus va sul primo campo con errore; dopo un invio riuscito torna sul conto di addebito.

### Passi suggeriti
1. Verifica che i requisiti 1-5, 7 e 9 siano già soddisfatti dai capitoli 04 e 05.
2. In `Dashboard.jsx` scrivi `getDisplayedBalance(account, transactions)` (fuori dal componente) e costruisci `accountsWithBalance` con `map`.
3. Usa `accountsWithBalance` ovunque prima usavi `accounts` (card, totale, form).
4. Prova gli scenari della tabella sotto.
5. Esegui `npm run lint` e `npm run build`.

### Risultato atteso (scenari di verifica)
Partendo dai dati iniziali (Conto Corrente `4.250,75 €`, Conto Risparmio `12.800,00 €`, totale `17.050,75 €`):

| # | Azione | Risultato atteso |
|---|---|---|
| 1 | Invio con form vuoto | 4 errori (conto, beneficiario, importo, causale); nessun movimento; il focus è su "Conto di addebito" |
| 2 | Importo `0` o `-5` | "L'importo deve essere maggiore di zero." |
| 3 | Importo `12.345` | errore sui decimali |
| 4 | Importo `5000` dal Conto Corrente | "Saldo insufficiente sul conto selezionato." |
| 5 | Causale di 141 caratteri | errore di lunghezza |
| 6 | `100` dal Conto Corrente a Giulia Bianchi, causale "Rimborso cena" | conferma simulata; movimento `Bonifico a Giulia Bianchi` di `-100,00 €`; Conto Corrente `4.150,75 €`; totale `16.950,75 €`; form vuoto |
| 7 | Dopo il #6, importo `4150.76` dal Conto Corrente | saldo insufficiente (il saldo disponibile ora è `4.150,75 €`) |
| 8 | Dopo il #6, importo `4150.75` dal Conto Corrente | accettato; Conto Corrente `0,00 €` |
| 9 | `500` dal Conto Risparmio a Luca Verdi | Conto Risparmio `12.300,00 €`; il Conto Corrente non cambia |
| 10 | "Nascondi saldi" dopo un bonifico | tutti i saldi `••••••`; i movimenti restano visibili |
| 11 | Ricarica pagina (F5) | tutto torna ai dati iniziali (simulazione in memoria) |
| 12 | Conto e beneficiario scelti, importo vuoto, invio | errore sull'importo; il focus è su "Importo (EUR)" |

### Criteri di completamento
- Tutti i 12 scenari producono il risultato atteso.
- `accounts` (import) e `transactions` non sono mai mutati.
- Nessun state `balances` o `totalBalance`: sono derivati.
- Nessun warning in Console; `npm run lint` e `npm run build` senza errori (dentro `liparibank/`).

```bash
npm run lint
```

```bash
npm run build
```

---

> ⚠️ **Prova prima da solo.** Prova a ricavare `getDisplayedBalance` partendo dalla formula nella sezione Theory. Poi confronta con la soluzione.

### Soluzione di riferimento — parti chiave

Il file `src/utils/validators.js` è quello del capitolo 03 e `src/components/TransferForm.jsx` quello del capitolo 05: **non cambiano**. Funzionano perché ricevono `accounts` già con il saldo aggiornato: ecco il valore del dato derivato calcolato in un solo punto.

File `src/components/Dashboard.jsx` (versione finale di Day 4):

```jsx
import { useState } from "react";
import {
  accounts,
  beneficiaries,
  transactions as initialTransactions,
} from "../data/mockData.js";
import AccountList from "./AccountList.jsx";
import BalanceCard from "./BalanceCard.jsx";
import Card from "./Card.jsx";
import TransactionFilters from "./TransactionFilters.jsx";
import TransactionList from "./TransactionList.jsx";
import TransferForm from "./TransferForm.jsx";

const initialTransactionIds = new Set(initialTransactions.map((transaction) => transaction.id));

function getDisplayedBalance(account, transactions) {
  const simulatedDelta = transactions
    .filter(
      (transaction) =>
        transaction.accountId === account.id && !initialTransactionIds.has(transaction.id),
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return Math.round((account.balance + simulatedDelta) * 100) / 100;
}

function Dashboard() {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0].id);
  const [hideBalance, setHideBalance] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [transactions, setTransactions] = useState(initialTransactions);

  const accountsWithBalance = accounts.map((account) => ({
    ...account,
    balance: getDisplayedBalance(account, transactions),
  }));
  const totalBalance = accountsWithBalance.reduce((sum, account) => sum + account.balance, 0);
  const selectedAccount = accountsWithBalance.find((account) => account.id === selectedAccountId);
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

  function handleAddTransfer(transfer) {
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
    setSelectedAccountId(transfer.accountId);
    setFilter("all");
    setSearchText("");
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
          accounts={accountsWithBalance}
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

      <Card title="Nuovo bonifico (simulato)">
        <TransferForm
          accounts={accountsWithBalance}
          beneficiaries={beneficiaries}
          onAddTransfer={handleAddTransfer}
        />
      </Card>
    </main>
  );
}

export default Dashboard;
```

Perché è corretto:

- `accountsWithBalance` è calcolato a ogni render: l'unico state che cambia è `transactions`.
- `getDisplayedBalance` somma solo i movimenti non presenti nei dati iniziali e arrotonda a 2 decimali.
- `TransferForm` valida con il saldo **mostrato**, quindi gli scenari 7 e 8 funzionano senza altro codice.
- Se un bonifico fosse stato aggiunto con `push`, nessun saldo si ridisegnerebbe: l'immutabilità del Day 3 è la base di tutto.

---

## 🔗 Repository / Checkpoint

### CHECKPOINT 4 — Form bonifico

| Voce | Contenuto |
|---|---|
| **Contenuto iniziale** | Progetto di fine Day 3 (CHECKPOINT 3) più `TransferForm` con campi controllati e `validators.js` (capitoli 01-03) |
| **Da completare** | Submit con `handleAddTransfer`, conferma, reset, gestione del focus e saldi ricalcolati (capitoli 04-06) |
| **Già funzionante** | Selezione conto, filtri, ricerca, preferiti, nascondi saldi, campi del form controllati, validazione per campo |
| **Come verificare** | I 12 scenari della tabella, `npm run lint`, `npm run build` |
| **Checkpoint del corso** | `liparibank-day-04.zip`, allegato al Day 4 sulla piattaforma |

Per scaricare e avviare il checkpoint, o per ripartire da lì, vedi [Come usare i checkpoint](../Day_00_Setup/06_Come_usare_i_checkpoint.md).

---

## ⚠️ Common Mistakes

| Errore | Correzione |
|---|---|
| Sommare **tutti** i movimenti al saldo | solo quelli aggiunti in sessione (id non iniziali) |
| Salvare i saldi in uno state separato | derivarli dai movimenti a ogni render |
| Modificare `accounts[i].balance` | i dati importati restano costanti |
| `TransferForm` valida con `account.balance` iniziale | passare `accountsWithBalance` |
| Importo `0.1 + 0.2` con decimali infiniti | arrotondare a 2 decimali |
| Scambiare il bonifico per un'operazione reale | dichiararlo **simulato** in UI e documentazione |
| Il nuovo movimento non si vede | il conto selezionato o i filtri lo nascondono: selezionare il conto e azzerare i filtri |

---

## ✅ Checklist
- ☐ Tutti i 12 scenari della tabella sono verificati.
- ☐ Il saldo di card, totale e form è calcolato da `getDisplayedBalance`.
- ☐ `validateTransfer` usa il saldo mostrato del conto scelto.
- ☐ La conferma dichiara che il bonifico è simulato.
- ☐ `npm run lint` e `npm run build` passano.
- ☐ Ho salvato il lavoro con un commit (CHECKPOINT 4).

---

## 🚀 Challenge
Aggiungi un riepilogo prima dell'invio: sotto il form, quando conto, beneficiario e importo valido sono compilati, mostra "Stai per inviare `X` a `Nome` dal conto `Y`. Saldo dopo l'operazione: `Z`". Tutto derivato, senza nuovi state.

---

## 📌 Recap
- Il flusso completo è **input controllati → validazione → callback → state del padre → UI derivata**.
- Il saldo mostrato è un **dato derivato** dai movimenti aggiunti: un solo punto di calcolo, zero sincronizzazioni.
- `validateTransfer` riceve il saldo disponibile come argomento: resta pura e testabile.
- Il bonifico è una **simulazione**: nessuna operazione reale, tutto in memoria.

---

### ➡️ Next
[Day 5 · Side Effects](../Day_05_Effects_API/01_Side_Effects.md): finora i dati arrivavano da un file importato. Impariamo dove mettere il codice che parla con il mondo esterno, per caricare i movimenti in modo asincrono.
