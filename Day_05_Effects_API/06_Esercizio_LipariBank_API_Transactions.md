# 🏦 LipariBank — React Zero to Hero

> **Day 5 · Capitolo 06**
> **Argomento:** Esercizio LipariBank — API Transactions
> **Durata stimata:** 60 minuti
> **Parte di LipariBank:** `Dashboard.jsx` completa con movimenti caricati da `public/data/transactions.json` tramite service, con loading, errore, empty state e bonifici locali preservati

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- completare l'integrazione dei movimenti "remoti" in LipariBank con `useEffect`, `AbortController`, `isLoading` ed `error`;
- verificare ogni stato (loading, errore, vuoto, successo) con test manuali;
- garantire che i bonifici simulati non vadano persi dopo il caricamento;
- chiudere il **CHECKPOINT 5 — Integrazione API**.

---

## 📋 Prerequisiti
- Capitoli 01–05 di questo Day.
- Stato del progetto: fine Day 4 ([Esercizio Bonifico](../Day_04_Forms_User_Input/06_Esercizio_LipariBank_Bonifico.md)), con `Dashboard.jsx`, `TransferForm.jsx`, `validators.js`.

---

## 🧭 In questo capitolo
- Requisiti dell'esercizio.
- Passi suggeriti.
- Soluzione di riferimento per le parti chiave.
- Checkpoint 5: contenuto, verifica, repository.

---

## 🧠 Theory
Riepilogo operativo di quello che hai imparato nel Day:

| Concetto | In LipariBank |
| --- | --- |
| Side effect | caricare i movimenti, impostare il titolo |
| `useEffect` + dipendenze | `[]` per il caricamento iniziale, `[reloadKey]` per "Riprova" |
| Cleanup | `controller.abort()` |
| `StrictMode` | in sviluppo: richiesta 1 annullata, richiesta 2 completata |
| Fetch | `getTransactions({ signal })`, `response.ok`, `AbortError` ignorato |
| Stati async | `isLoading`, `error`, empty |
| Stato UI vs dati remoti | filtri e conto selezionato vs `transactions` |

> 💡 **Remember**
>
> Il file `public/data/transactions.json` è uno **stand-in locale**, non una API LipariBank reale. Passare a un endpoint vero significa modificare **solo** `src/services/transactionService.js`.

---

## 💻 Let's Code
Questo capitolo è un esercizio guidato: il codice di riferimento è nella sezione "Your Turn", dopo i requisiti.

---

## 🏦 LipariBank in action
Al termine la dashboard presenta: nome cliente (`Header`), saldo totale con pulsante nascondi/mostra, lista dei conti selezionabili, form del bonifico simulato e sezione movimenti filtrabile per entrate/uscite e testo, con i quattro stati asincroni. I conti restano in `mockData.js`.

---

## 🧪 Your Turn

**Obiettivo:** completare la dashboard "asincrona" di LipariBank.

**Requisiti:**
1. `public/data/transactions.json` contiene i 8 movimenti del progetto (capitolo 04).
2. `src/services/transactionService.js` espone `getTransactions({ signal })`, controlla `response.ok` e non contiene ritardi/errori di test.
3. `Dashboard.jsx` non importa più `transactions` da `mockData.js` (di conseguenza `getDisplayedBalance` riconosce i bonifici dalla categoria `"Bonifici"`); carica i movimenti in un `useEffect` con `AbortController` e ignora `AbortError`; l'effect del titolo (`document.title`) resta.
4. Esistono `LoadingMessage.jsx` ed `ErrorMessage.jsx` in `src/components/`; durante il caricamento si vede "Caricamento dei movimenti...", dopo un errore compare il messaggio con pulsante "Riprova".
5. Con lista remota vuota (`[]`) compare l'empty state; con filtri che non lasciano risultati compare il messaggio vuoto di `TransactionList`.
6. Un bonifico aggiunto (anche mentre è visibile l'errore) compare in testa ai movimenti del conto di addebito, aggiorna il saldo e non sparisce quando premi "Riprova".
7. I filtri (`filter`, `searchText`) e il conto selezionato non vengono azzerati da un nuovo caricamento.
8. `npm run lint` e `npm run build` (da eseguire dentro `liparibank/`) terminano senza errori.

**Passi suggeriti:**
1. Crea JSON e service e verificali isolatamente.
2. Sposta il caricamento dei movimenti in `useEffect`.
3. Aggiungi `isLoading`, `error`, `reloadKey`, `handleRetry`.
4. Crea i due componenti di feedback e il blocco `transactionsContent`.
5. Testa ogni stato secondo la tabella di verifica.

**Risultato atteso:** dashboard identica a quella del Day 4 per l'utente, ma alimentata da un service asincrono e con gli stati di attesa e di errore.

**Criteri di completamento:** tutti gli 8 requisiti e la tabella di verifica sono soddisfatti.

> ✋ **Prova prima da solo.** Prova a scrivere l'effect e il `transactionsContent` senza guardare. Poi confronta con la soluzione.

### Componenti di partenza (stato di fine Day 4)
Il codice di riferimento usa i componenti già costruiti nei giorni precedenti, **senza modificarli**. Props effettive:

| Componente | Props |
| --- | --- |
| `BalanceCard` | `total`, `label?`, `note?`, `hidden?` |
| `Card` | `title?`, `footer?`, `children` |
| `AccountList` | `accounts`, `transactions`, `selectedAccountId`, `hideBalance`, `onSelectAccount` |
| `TransactionFilters` | `filter`, `searchText`, `onFilterChange`, `onSearchChange` |
| `TransactionList` | `transactions`, `onToggleFavorite` (gestisce internamente il proprio stato vuoto) |
| `TransferForm` | `accounts`, `beneficiaries`, `onAddTransfer(transfer)` con `transfer = { accountId, beneficiaryId, amount, reason }` |
| `EmptyState` | `message?`, `hint?` |

Se nel tuo progetto i nomi sono diversi, **adatta i nomi nel JSX**: la logica di questo capitolo non cambia.

### Soluzione di riferimento: `src/components/Dashboard.jsx`
È il `Dashboard.jsx` del Day 4 con le modifiche del Day 5. Il calcolo del saldo (`getDisplayedBalance`: saldo del conto + bonifici simulati) sta in **un solo punto**, come nel Day 4; cambia solo il modo di riconoscere i bonifici simulati (categoria `"Bonifici"`, vedi capitolo 04).

```jsx
import { useEffect, useState } from "react";
import { accounts, beneficiaries } from "../data/mockData.js";
import { getTransactions } from "../services/transactionService.js";
import AccountList from "./AccountList.jsx";
import BalanceCard from "./BalanceCard.jsx";
import Card from "./Card.jsx";
import EmptyState from "./EmptyState.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import LoadingMessage from "./LoadingMessage.jsx";
import TransactionFilters from "./TransactionFilters.jsx";
import TransactionList from "./TransactionList.jsx";
import TransferForm from "./TransferForm.jsx";

function getDisplayedBalance(account, transactions) {
  const simulatedDelta = transactions
    .filter(
      (transaction) =>
        transaction.accountId === account.id && transaction.category === "Bonifici",
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return Math.round((account.balance + simulatedDelta) * 100) / 100;
}

function Dashboard() {
  // dati remoti + stato della richiesta
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // stato UI
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0].id);
  const [hideBalance, setHideBalance] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadTransactions() {
      try {
        const remoteTransactions = await getTransactions({
          signal: controller.signal,
        });

        setTransactions((current) => {
          const remoteIds = new Set(remoteTransactions.map((item) => item.id));
          const localOnly = current.filter((item) => !remoteIds.has(item.id));
          return [...localOnly, ...remoteTransactions];
        });
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
        setError("Non è stato possibile caricare i movimenti.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadTransactions();

    return () => controller.abort();
  }, [reloadKey]);

  function handleRetry() {
    setError(null);
    setIsLoading(true);
    setReloadKey((current) => current + 1);
  }

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

  const accountsWithBalance = accounts.map((account) => ({
    ...account,
    balance: getDisplayedBalance(account, transactions),
  }));
  const totalBalance = accountsWithBalance.reduce((sum, account) => sum + account.balance, 0);
  const selectedAccount = accountsWithBalance.find((account) => account.id === selectedAccountId);
  const normalizedSearch = searchText.trim().toLowerCase();

  useEffect(() => {
    document.title = `LipariBank — ${selectedAccount.name}`;
  }, [selectedAccount.name]);

  const visibleTransactions = transactions
    .filter((transaction) => transaction.accountId === selectedAccountId)
    .filter((transaction) => {
      if (filter === "income") return transaction.amount > 0;
      if (filter === "expense") return transaction.amount < 0;
      return true;
    })
    .filter((transaction) => transaction.description.toLowerCase().includes(normalizedSearch))
    .sort((a, b) => b.date.localeCompare(a.date));

  let transactionsContent;

  if (isLoading) {
    transactionsContent = <LoadingMessage message="Caricamento dei movimenti..." />;
  } else if (error) {
    transactionsContent = <ErrorMessage message={error} onRetry={handleRetry} />;
  } else if (transactions.length === 0) {
    transactionsContent = (
      <EmptyState message="Non ci sono ancora movimenti per i tuoi conti." />
    );
  } else {
    transactionsContent = (
      <TransactionList
        transactions={visibleTransactions}
        onToggleFavorite={handleToggleFavorite}
      />
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
        {transactionsContent}
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

Cosa notare:

- `visibleTransactions` non è uno state: si calcola a ogni render. Il `.sort` agisce sull'array nuovo prodotto dai `filter`, non modifica lo state.
- `handleAddTransfer` è quello del Day 4: il movimento ha `category: "Bonifici"` e per questo `getDisplayedBalance` ne tiene conto nei saldi.
- Il merge nell'effect tiene i movimenti locali (id non presenti nel JSON) anche se l'effect riparte con "Riprova".
- L'effect del titolo (`document.title`, capitolo 02) resta: è l'unico altro effect del componente.
- Il saldo mostrato cambia con i bonifici ma il file JSON resta invariato: un ricaricamento della pagina (F5) azzera i bonifici simulati, comportamento corretto senza backend.

### Tabella di verifica manuale
| # | Prova | Esito atteso |
| --- | --- | --- |
| 1 | Apri la dashboard con `wait(1500)` nel service | prima "Caricamento dei movimenti...", poi la lista |
| 2 | Attiva `throw new Error("Errore simulato")` | messaggio di errore + "Riprova" |
| 3 | Commenta il `throw` e premi "Riprova" | compare la lista |
| 4 | `transactions.json` = `[]` | empty state "Non ci sono ancora movimenti..." |
| 5 | Filtro "entrate" sul Conto Risparmio + ricerca "xyz" | stato vuoto di `TransactionList` |
| 6 | Bonifico di 50 € a Giulia Bianchi dal Conto Corrente | nuovo movimento in testa; il saldo del Conto Corrente passa da 4.250,75 € a 4.200,75 € |
| 7 | Con il `throw` simulato attivo (errore visibile) invia un bonifico e imposta filtro "Uscite"; poi commenta il `throw` e premi "Riprova" | il bonifico è ancora presente, filtro e conto invariati |
| 8 | Network tab in `npm run dev` | due richieste (la prima annullata) |

Ripristina service e JSON dopo le prove.

---

## 🔗 Repository / Checkpoint

### CHECKPOINT 5 — Integrazione API
- **Checkpoint del corso:** `liparibank-day-05.zip`, allegato al Day 5 sulla piattaforma. Per usarlo vedi [Come usare i checkpoint](../Day_00_Setup/06_Come_usare_i_checkpoint.md).

**Contenuto iniziale (stato di partenza):** progetto a fine Day 4: dashboard con state `transactions` da `mockData.js`, `TransferForm`, `validators.js`.

**Cosa completare:** `public/data/transactions.json`, `src/services/transactionService.js`, `LoadingMessage.jsx`, `ErrorMessage.jsx`, effect di caricamento con `AbortController` in `Dashboard.jsx`, stati `isLoading`/`error`/empty, "Riprova", `getDisplayedBalance` basato sulla categoria `"Bonifici"`.

**Cosa deve già funzionare:** conti, saldo, nascondi saldi, filtri, ricerca, form bonifico con validazione e conferma.

**Come verificare:** tabella di verifica manuale sopra; `npm run lint`; `npm run build` (dentro `liparibank/`).

**Se usi la tua repository** (creata nel [Day 0 · Git e GitHub](../Day_00_Setup/04_Git_GitHub.md)), un'idea di workflow: commit e tag locale a fine capitolo.

```bash
git add .
git commit -m "Day 5: integrazione transazioni da JSON"
git tag checkpoint-5-api
```

Esegui i comandi dentro `liparibank/` se il repository Git è lì (o nella cartella radice del tuo repository). Il nome del tag è una proposta, non un tag esistente.

---

## ⚠️ Common Mistakes
- **Ritardo/errore di test dimenticati nel service.** Prima del commit ripulisci.
- **`isLoading` mai riportato a `false`** dopo un errore (manca `finally`).
- **JSON rimasto `[]`** dopo la prova dell'empty state.
- **Perdita dei bonifici dopo "Riprova"**: `setTransactions(remoteTransactions)` senza merge.
- **Stato duplicato:** `visibleTransactions` salvata con `useState`.

---

## ✅ Checklist
- ☐ Tutti gli 8 requisiti soddisfatti.
- ☐ Tabella di verifica completata.
- ☐ Nessun ritardo o errore simulato rimasto nel codice.
- ☐ `npm run lint` e `npm run build` senza errori.
- ☐ Ho fatto commit (e, se voglio, tag) del checkpoint.
- ☐ So spiegare perché il service rende sostituibile il file JSON con un'API reale.

---

## 🚀 Challenge
Aggiungi un pulsante "Aggiorna" accanto al titolo "Movimenti" che ricarica i dati (stessa tecnica di `handleRetry`). Verifica che i bonifici locali non spariscano.

---

## 📌 Recap
- I dati remoti si caricano con un effect dotato di cleanup (`AbortController`).
- `isLoading`, `error` e lista vuota sono stati da progettare sempre.
- Stato UI e dati remoti restano separati; la lista visibile è derivata.
- I bonifici simulati vivono solo nello state locale e sono preservati dal merge.
- Il service è l'unico punto da cambiare per passare a un'API reale.

---

### ➡️ Next
[Day 6 · Capitolo 01 — SPA e Routing](../Day_06_Routing/01_SPA_e_Routing.md): trasformiamo l'app in più pagine con React Router.
