# 🏦 LipariBank — React Zero to Hero

> **Day 6 · Capitolo 06**
> **Argomento:** Esercizio LipariBank — MultiPage
> **Durata stimata:** 60 minuti
> **Parte di LipariBank:** app multi-pagina completa: Dashboard, Conti (master/detail), Movimenti, Bonifico, pagina 404, con state condiviso in `App.jsx`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- completare `TransactionsPage` e collegarla alle altre pagine;
- verificare l'intera app multi-pagina con una tabella di test su URL e flussi;
- leggere un messaggio di conferma trasportato via `navigate(..., { state })`;
- chiudere il **CHECKPOINT 6 — Routing**.

---

## 📋 Prerequisiti
- Capitoli 01–05 di questo Day.
- React Router v7 installato con `npm install react-router@7` (dentro `liparibank/`), import da `"react-router"`.

---

## 🧭 In questo capitolo
- Requisiti dell'esercizio e struttura finale.
- Soluzione di riferimento per `TransactionsPage` e per le route.
- Tabella di verifica.
- Checkpoint 6.

---

## 🧠 Theory
Riepilogo del Day 6:

| Elemento | In LipariBank |
| --- | --- |
| `BrowserRouter` | `main.jsx` |
| `Routes` / `Route` | `App.jsx` |
| Layout route + `Outlet` | `AppLayout` (Header, menu, contenuto) |
| `NavLink` | menu principale e lista conti |
| Parametri + `useParams` | `/accounts/:accountId` |
| `useNavigate` | dopo un bonifico → `/transactions` |
| Route `*` | `NotFoundPage` |
| Nested routes | `AccountsPage` + `AccountDetailPage` |

> 💡 **Remember**
>
> Lo state condiviso vive in `App.jsx` perché le pagine vengono smontate quando navighi. Lo state UI di una pagina (filtri, conto selezionato) vive nella pagina e si perde uscendo: è un compromesso accettabile qui. Passare tante props tra `App` e le pagine è il limite che affronteremo con Context e `useReducer` nel Day 7.

---

## 💻 Let's Code
Il codice è nella sezione seguente, perché questo capitolo è un esercizio: prima i requisiti, poi la soluzione di riferimento per le parti chiave.

---

## 🏦 LipariBank in action
Struttura finale di `src/` a fine Day 6:

```text
src/
├── App.jsx
├── main.jsx
├── index.css
├── components/
│   ├── AccountCard.jsx
│   ├── AccountList.jsx
│   ├── BalanceCard.jsx
│   ├── Card.jsx
│   ├── EmptyState.jsx
│   ├── ErrorMessage.jsx
│   ├── Header.jsx
│   ├── LoadingMessage.jsx
│   ├── TransactionFilters.jsx
│   ├── TransactionItem.jsx
│   ├── TransactionList.jsx
│   └── TransferForm.jsx
├── data/
│   └── mockData.js
├── layouts/
│   └── AppLayout.jsx
├── pages/
│   ├── AccountDetailPage.jsx
│   ├── AccountsPage.jsx
│   ├── DashboardPage.jsx
│   ├── NotFoundPage.jsx
│   ├── TransactionsPage.jsx
│   └── TransferPage.jsx
├── services/
│   └── transactionService.js
└── utils/
    ├── formatters.js
    └── validators.js
```

`RecentTransactions.jsx` (Day 1) è stato sostituito da `TransactionList.jsx` nel Day 2; `Dashboard.jsx` non c'è più.

---

## 🧪 Your Turn

**Obiettivo:** ottenere un LipariBank multi-pagina completo e verificato.

**Requisiti:**
1. `main.jsx` avvolge `<App />` in `<BrowserRouter>`; tutti gli import del router vengono da `"react-router"`.
2. `AppLayout` mostra `Header`, un menu con 4 `NavLink` (Dashboard, Conti, Movimenti, Bonifico) e `<Outlet />`; il link attivo è evidenziato e "Dashboard" non risulta attivo su altre pagine.
3. `/` (Dashboard): saldo totale con pulsante nascondi/mostra, conti selezionabili, movimenti del conto selezionato con filtri entrate/uscite e ricerca, link a `/transfer`.
4. `/accounts` e `/accounts/:accountId`: master/detail con route annidate (capitolo 05) e "Conto non trovato" per id sconosciuti.
5. `/transactions`: **tutti** i movimenti (di entrambi i conti) ordinati per data decrescente, con filtri entrate/uscite e ricerca, e gli stati loading/errore/vuoto.
6. `/transfer`: form bonifico; a submit valido il movimento viene aggiunto allo state di `App` e l'app naviga a `/transactions`, dove compare il messaggio "Bonifico simulato registrato." e il nuovo movimento è in testa.
7. Qualsiasi altro URL mostra `NotFoundPage` dentro il layout.
8. Dopo la navigazione tra le pagine i bonifici simulati non spariscono; dopo un F5 sì (nessun backend: comportamento atteso).
9. `npm run lint` e `npm run build` (dentro `liparibank/`) terminano senza errori.

**Passi suggeriti:**
1. Controlla che le route del capitolo 05 siano a posto.
2. Scrivi `TransactionsPage` (stato UI proprio, dati via props).
3. Passa le props necessarie da `App.jsx`.
4. Leggi il messaggio di conferma con `useLocation`.
5. Esegui la tabella di verifica.

**Risultato atteso:** app navigabile da menu e da URL, con dati coerenti tra le pagine.

**Criteri di completamento:** i 9 requisiti e la tabella di verifica sono soddisfatti.

> ✋ **Prova prima da solo.** Prova a costruire `TransactionsPage` partendo da `DashboardPage`. Poi confronta con la soluzione.

### Soluzione di riferimento: `src/pages/TransactionsPage.jsx`
Le props dei componenti figli sono quelle dei tuoi componenti (tabella nel [Day 5, capitolo 06](../Day_05_Effects_API/06_Esercizio_LipariBank_API_Transactions.md)); `onToggleFavorite` arriva da `App` tramite `dataProps`.

```jsx
import { useState } from "react";
import { useLocation } from "react-router";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransactionFilters from "../components/TransactionFilters.jsx";
import TransactionList from "../components/TransactionList.jsx";

export default function TransactionsPage({
  transactions,
  isLoading,
  error,
  onRetry,
  onToggleFavorite,
}) {
  const location = useLocation();
  const transferCompleted = location.state?.transferCompleted === true;

  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const normalizedSearch = searchText.trim().toLowerCase();

  const visibleTransactions = transactions
    .filter((transaction) => {
      if (filter === "income") return transaction.amount > 0;
      if (filter === "expense") return transaction.amount < 0;
      return true;
    })
    .filter((transaction) => transaction.description.toLowerCase().includes(normalizedSearch))
    .sort((a, b) => b.date.localeCompare(a.date));

  let content;

  if (isLoading) {
    content = <LoadingMessage message="Caricamento dei movimenti..." />;
  } else if (error) {
    content = <ErrorMessage message={error} onRetry={onRetry} />;
  } else if (transactions.length === 0) {
    content = <EmptyState message="Non ci sono ancora movimenti." />;
  } else {
    content = (
      <TransactionList
        transactions={visibleTransactions}
        onToggleFavorite={onToggleFavorite}
      />
    );
  }

  return (
    <section>
      <h1>Movimenti</h1>

      {transferCompleted && (
        <p className="success-message" role="status">
          Bonifico simulato registrato.
        </p>
      )}

      <TransactionFilters
        filter={filter}
        searchText={searchText}
        onFilterChange={setFilter}
        onSearchChange={setSearchText}
      />

      {content}
    </section>
  );
}
```

Cose da notare:

- `location.state` è `null` se arrivi alla pagina senza `navigate(..., { state })`: l'optional chaining `?.` evita l'errore.
- Lo state di una voce di cronologia viene conservato dal browser: un F5 sulla stessa voce può mostrare ancora il messaggio. Per un messaggio che deve sparire sarebbe necessario uno state apposito (vedi challenge).
- La logica dei filtri è **duplicata** tra `DashboardPage` e `TransactionsPage`. Lo segnaliamo: nel Day 8 la sposteremo in un custom hook (`useTransactions`).

Aggiungi in `src/index.css`:

```css title="src/index.css"
.success-message {
  padding: 0.75rem 1rem;
  border: 1px solid #86efac;
  border-radius: 8px;
  background: #f0fdf4;
  color: #166534;
}
```

### Route finali in `App.jsx`
La parte di state/effect è quella del [capitolo 03](./03_Dynamic_Routes_e_useParams.md). Il `return` finale:

```jsx
return (
  <Routes>
    <Route element={<AppLayout />}>
      <Route
        index
        element={<DashboardPage accounts={accountsWithBalance} {...dataProps} />}
      />

      <Route
        path="accounts"
        element={<AccountsPage accounts={accountsWithBalance} />}
      >
        <Route
          index
          element={<p className="hint">Seleziona un conto per vederne i dettagli.</p>}
        />
        <Route
          path=":accountId"
          element={
            <AccountDetailPage accounts={accountsWithBalance} {...dataProps} />
          }
        />
      </Route>

      <Route path="transactions" element={<TransactionsPage {...dataProps} />} />

      <Route
        path="transfer"
        element={
          <TransferPage
            accounts={accountsWithBalance}
            onAddTransfer={addTransfer}
          />
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);
```

### Tabella di verifica manuale
Esegui `npm run dev` dentro `liparibank/` e controlla:

| # | Prova | Esito atteso |
| --- | --- | --- |
| 1 | Apri `/` | Dashboard con saldo, conti, movimenti del Conto Corrente |
| 2 | Clicca "Conti" nel menu | URL `/accounts`, voce di menu attiva, messaggio "Seleziona un conto" |
| 3 | Clicca "Conto Risparmio" | URL `/accounts/acc-002`, 2 movimenti, conto evidenziato |
| 4 | Digita `/accounts/xyz` | "Conto non trovato" nel pannello di dettaglio |
| 5 | Apri `/transactions` | 8 movimenti, ordinati dal più recente (27/10/2026) |
| 6 | Filtro "uscite" + ricerca "utenza" | "Pagamento utenza luce" e "Pagamento utenza gas" |
| 7 | `/transfer`: 50 € da Conto Corrente a Giulia Bianchi, causale "Test" | redirect a `/transactions`, messaggio di conferma, nuovo movimento in testa |
| 8 | Torna a `/` | il bonifico è tra i movimenti del Conto Corrente, saldo ridotto di 50 € |
| 9 | Digita `/boh` | `NotFoundPage` con menu visibile |
| 10 | Pulsanti Indietro/Avanti del browser | navigano tra le pagine visitate |
| 11 | Ricarica su `/accounts/acc-001` | la pagina si apre (con `npm run dev`) |
| 12 | `npm run lint` e `npm run build` | nessun errore |

Nota su produzione: la riga 11 funziona nel server di sviluppo di Vite. Su un hosting statico serve un *SPA fallback*, descritto nel [Day 9 · Environment e Deploy](../Day_09_Final_Project_Delivery/06_Environment_e_Deploy.md).

---

## 🔗 Repository / Checkpoint

### CHECKPOINT 6 — Routing
- **Checkpoint del corso:** `liparibank-day-06.zip`, allegato al Day 6 sulla piattaforma. Per usarlo vedi [Come usare i checkpoint](../Day_00_Setup/06_Come_usare_i_checkpoint.md).

**Contenuto iniziale (stato di partenza):** progetto a fine Day 5 (CHECKPOINT 5): `Dashboard.jsx` con effect di caricamento, service `transactionService.js`, componenti `LoadingMessage`/`ErrorMessage`, nessun router.

**Cosa completare:** `npm install react-router@7`, `BrowserRouter` in `main.jsx`, `AppLayout`, cartella `src/pages/` con 6 pagine, route e nested route in `App.jsx`, state condiviso in `App.jsx`, `useNavigate` dopo il bonifico, route `*`.

**Cosa deve già funzionare (dal Day 5):** caricamento movimenti da `public/data/transactions.json` con loading/errore/vuoto, filtri, ricerca, form bonifico con validazione, nascondi/mostra saldo.

**Come verificare:** tabella di verifica manuale sopra; `npm run lint`; `npm run build`.

**Se usi la tua repository**, proposta di workflow (il tag è un nome che scegli tu, non esiste già):

```bash
git add .
git commit -m "Day 6: routing multi-pagina con React Router v7"
git tag checkpoint-6-routing
```

Esegui i comandi dentro la cartella del tuo repository Git (di norma `liparibank/`).

---

## ⚠️ Common Mistakes
- **`react-router-dom` nell'import.** Usa `"react-router"`.
- **Dashboard e Movimenti con state diverso per gli stessi dati.** I dati condivisi stanno in `App`.
- **Dimenticare `?.` su `location.state`.** Errore se arrivi da un link normale.
- **Passare solo alcune props alla pagina.** `undefined.filter` → pagina bianca: controlla che `dataProps` sia propagato.
- **Route `*` fuori dal layout** o prima di route specifiche con path ambigui.
- **Aspettarsi che F5 conservi i bonifici.** Nessun backend: i dati locali sono volatili.

---

## ✅ Checklist
- ☐ Tutti i 9 requisiti soddisfatti.
- ☐ Tabella di verifica completata.
- ☐ Import del router solo da `"react-router"`.
- ☐ `App.jsx` contiene lo state condiviso e le route; le pagine sono in `src/pages/`.
- ☐ `npm run lint` e `npm run build` senza errori.
- ☐ Commit (ed eventuale tag) del checkpoint.
- ☐ Ho individuato il prop drilling e la duplicazione dei filtri.

---

## 🚀 Challenge
Fai sparire il messaggio "Bonifico simulato registrato." dopo 4 secondi usando uno state locale e un `useEffect` con cleanup (`setTimeout` + `clearTimeout`, come nel Day 5).

---

## 📌 Recap
- LipariBank è ora multi-pagina: layout condiviso, menu con `NavLink`, route dinamiche e annidate, 404.
- Lo state condiviso (`transactions`, `isLoading`, `error`, `addTransfer`) vive in `App.jsx`; lo state UI nelle pagine.
- `useNavigate` + `state` collega un'azione (bonifico) a una pagina e a un messaggio.
- Il prop drilling è il limite che risolveremo nel Day 7; la logica duplicata dei filtri nel Day 8.

---

### ➡️ Next
[Day 7 · Capitolo 01 — Context e useContext](../Day_07_Shared_State_Redux/01_Context_e_useContext.md): eliminiamo il passaggio di props tra `App` e le pagine condividendo lo stato, prima con Context e poi con Redux. L'[extra React Legacy](../EXTRA_Legacy_React/01_React_Moderno_vs_Legacy.md) è facoltativo.
