# 🏦 LipariBank — React Zero to Hero

> **Day 8 · Capitolo 03**
> **Argomento:** Architettura
> **Durata stimata:** 35 minuti
> **Parte di LipariBank:** struttura target del progetto, flusso dei dati e regole di dipendenza

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- riconoscere la struttura di cartelle target di LipariBank e il ruolo di ciascuna;
- dire **dove vive** ogni dato (state locale, context, URL, servizio);
- applicare le regole di dipendenza tra livelli (pagine, componenti, hooks, servizi, utils);
- confrontare la tua app con la struttura target e annotare gli scostamenti.

---

## 📋 Prerequisiti
- [Requirements Funzionali](./02_Requirements_Funzionali.md).
- Day 7: [Architettura del Progetto](../Day_07_Advanced_React_Architecture/05_Architettura_del_Progetto.md) e [Service Layer e API](../Day_07_Advanced_React_Architecture/06_Service_Layer_e_API.md).

---

## 🧭 In questo capitolo
- L'albero di cartelle target.
- I livelli e le regole di dipendenza.
- Rotte, responsabilità dei componenti, proprietà dello state.
- Composizione finale di `main.jsx` e `App.jsx`.

---

## 🧠 Theory

### Struttura per tipo, ragionata
Per un'app di questa dimensione basta una struttura **per tipo di file**: ognuno trova subito cosa cerca. Non servono cartelle per feature, che diventano utili quando un'app cresce di molto.

### I livelli
```text
pages      → una per rotta; compongono componenti e leggono hooks/context
components → UI riutilizzabile; ricevono props, non sanno da dove vengono i dati
store      → preferenza di densità condivisa con Redux Toolkit
hooks      → logica con state riusabile (useTransactions, useTransferForm...)
services   → accesso ai dati (fetch); nessun React dentro
utils      → funzioni pure (formattazione, validazione, filtri)
```

### Regole di dipendenza
1. Un **componente presentazionale** (`TransactionItem`, `AccountCard`) non importa servizi né context: riceve props.
2. Un **servizio** (`transactionService.js`) non importa React né componenti: restituisce Promise.
3. Le **utils** sono funzioni pure: stesso input, stesso output, nessun effetto.
4. Le **pagine** compongono hooks e componenti; il layout e `DisplayDensity` leggono la preferenza Redux condivisa.
5. Il **context** si usa per ciò che serve a molte pagine (dati bancari, impostazioni), non per ogni piccolo state.

> 💡 **Remember**
>
> Le dipendenze vanno in una direzione: `pages → components/hooks → services/utils`. Se un servizio importa un componente, qualcosa è nel posto sbagliato.

---

## 💻 Let's Code

### Albero di cartelle target
Tutti i percorsi sono relativi a `liparibank/`.

```text
liparibank/
├── .env.example
├── .gitignore
├── .oxlintrc.json
├── README.md                 (da scrivere nel Day 9 cap. 05)
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── docs/                     (nuova, facoltativa: report di test, vedi Day 9)
├── public/
│   └── data/
│       ├── accounts.json
│       └── transactions.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── AccountCard.jsx
    │   ├── AccountList.jsx
    │   ├── BalanceCard.jsx
    │   ├── Card.jsx
    │   ├── CategorySummary.jsx
    │   ├── EmptyState.jsx
    │   ├── ErrorBoundary.jsx
    │   ├── ErrorMessage.jsx
    │   ├── Header.jsx
    │   ├── LoadingMessage.jsx
    │   ├── TransactionFilters.jsx
    │   ├── TransactionItem.jsx
    │   ├── TransactionList.jsx
    │   └── TransferForm.jsx
    ├── context/
    │   ├── BankContext.jsx
    │   ├── SettingsContext.jsx
    │   └── bankReducer.js
    ├── data/
    │   └── mockData.js
    ├── hooks/
    │   ├── useDocumentTitle.js  (nuovo, opzionale: vedi Day 9 cap. 03)
    │   ├── useLocalStorage.js
    │   ├── useTransactions.js
    │   └── useTransferForm.js
    ├── layouts/
    │   └── AppLayout.jsx
    ├── legacy/            (opzionale: esempi dell'extra React Legacy, non importati dall'app)
    ├── store/
    │   ├── displaySlice.js
    │   └── store.js
    ├── pages/
    │   ├── AccountDetailPage.jsx
    │   ├── AccountsPage.jsx
    │   ├── DashboardPage.jsx
    │   ├── NotFoundPage.jsx
    │   ├── TransactionsPage.jsx
    │   └── TransferPage.jsx
    ├── services/
    │   ├── accountService.js
    │   ├── apiClient.js
    │   └── transactionService.js
    └── utils/
        ├── balance.js           (nuovo, opzionale: vedi Day 9 cap. 01)
        ├── errorMessages.js
        ├── formatters.js
        ├── transactionFilters.js (nuovo, opzionale: vedi Day 9 cap. 01)
        └── validators.js
```

Tre file sono **nuovi e opzionali** (`balance.js`, `transactionFilters.js`, `useDocumentTitle.js`): sono il risultato naturale del Day 9 (refactoring e accessibilità), quando eliminerai logica duplicata e imposterai il titolo di ogni pagina. `README.md` e `docs/` nascono anch'essi nel Day 9. Se nel Day 7 hai già una struttura leggermente diversa (nomi dei provider, posizione dell'`ErrorBoundary`), non rinominare tutto: annota lo scostamento e mantieni coerenza interna.

### Rotte

| Percorso | Componente | Note |
|---|---|---|
| `/` | `DashboardPage` | dentro `AppLayout` (index route) |
| `/accounts` | `AccountsPage` | lista conti; rende `<Outlet />` per il figlio |
| `/accounts/:accountId` | `AccountDetailPage` | `useParams` per leggere `accountId` |
| `/transactions` | `TransactionsPage` | filtri in state locale |
| `/transfer` | `TransferPage` | dopo il successo: feedback; `useNavigate` se previsto dal tuo flusso |
| `*` | `NotFoundPage` | 404 |

### Composizione finale
`src/main.jsx` — ordine dei provider: l'Error Boundary all'esterno, poi Router, poi context. Snippet basato sui nomi del Day 7 (`SettingsProvider`, `BankProvider`, `ErrorBoundary`): adatta gli import ai nomi reali del tuo progetto.

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { BankProvider } from "./context/BankContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <SettingsProvider>
          <BankProvider>
            <App />
          </BankProvider>
        </SettingsProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
```

`src/App.jsx` — solo la mappa delle rotte:

```jsx
import { Routes, Route } from "react-router";
import AppLayout from "./layouts/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AccountsPage from "./pages/AccountsPage.jsx";
import AccountDetailPage from "./pages/AccountDetailPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import TransferPage from "./pages/TransferPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="accounts" element={<AccountsPage />}>
          <Route path=":accountId" element={<AccountDetailPage />} />
        </Route>
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="transfer" element={<TransferPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
```

Cosa fa: `App` non contiene logica né state, solo la mappa URL → pagina. Perché funziona: il layout route (`AppLayout`) rende Header, menu e `<Outlet />`; le pagine figlie si inseriscono nell'`Outlet`. Come modificarlo: una nuova pagina = un file in `src/pages/` + una `<Route>`. Da evitare: importare `react-router-dom` (nel corso si importa sempre da `"react-router"`).

---

## 🏦 LipariBank in action

### Dove vive ogni dato

| Dato | Natura | Dove vive |
|---|---|---|
| `transactions`, `isLoading`, `error` | dati remoti + bonifici simulati | `BankContext` (`useReducer`: `LOAD_START`, `LOAD_SUCCESS`, `LOAD_ERROR`, `ADD_TRANSFER`) |
| `accounts` | dati remoti | caricati con `accountService` (nel `BankContext` o in un hook, come scelto nel Day 7) |
| `hideBalance` | preferenza UI globale | `SettingsContext` + `useLocalStorage` |
| Filtri (`filter`, `searchText`, conto) | UI locale di una pagina | `useState` in `TransactionsPage` |
| Valori e errori del form | UI locale | `useTransferForm` |
| Conto selezionato nel dettaglio | navigazione | **URL** (`:accountId`), non state |
| Saldo mostrato di un conto | **dato derivato** | calcolato, non salvato: saldo iniziale + bonifici simulati del conto |

Regola: **non duplicare**. Se un valore si può calcolare da altri, calcolalo (non metterlo in un secondo `useState`).

### Flusso di un bonifico
```text
TransferForm (input) → useTransferForm (valori, errori, validateTransfer)
  → submit valido → dispatch({ type: "ADD_TRANSFER", payload: nuovoMovimento })
  → bankReducer aggiunge la transaction allo state
  → Dashboard, Conti, Movimenti si aggiornano perché leggono dallo stesso context
```

---

## 🧪 Your Turn

**Obiettivo:** confrontare la tua app con la struttura target e documentare gli scostamenti.

**Requisiti**
1. Genera l'albero reale dei tuoi file e confrontalo con quello sopra. Da `liparibank/`, in PowerShell:
   ```powershell
   Get-ChildItem src -Recurse -File | Select-Object -ExpandProperty FullName
   ```
   (Su macOS/Linux usa `find src -type f`.)
2. Compila una tabella di scostamenti: *file target* | *esiste?* | *azione* (nessuna / creare / rinominare / eliminare).
3. Verifica le regole di dipendenza: cerca nei componenti presentazionali eventuali import da `services/` o da `context/`. Per ognuno decidi se spostare la logica in una pagina/hook.
4. Verifica che il saldo mostrato non sia salvato in due posti diversi.

**Passi suggeriti**
- Ricerca di `import` da servizi: in VS Code, `Ctrl+Shift+F` con il testo `services/` limitato a `src/components`.
- Il tuo `ErrorBoundary` può stare in `components/`: è l'unica class component "vivente" dell'app.

**Risultato atteso:** tabella scostamenti con azioni; elenco di eventuali violazioni delle regole di dipendenza.

**Criteri di completamento:** ogni file del target ha una riga; ogni violazione ha una decisione scritta.

---

## ⚠️ Common Mistakes
- **Context per tutto**: filtri e valori del form non devono stare nel context; causano re-render inutili e accoppiamento.
- **Fetch dentro i componenti presentazionali**: sposta la chiamata nel servizio e lo state in hook/context.
- **`legacy/` importata dall'app**: gli esempi class sono materiale di lettura, non fanno parte delle rotte.
- **Due fonti di verità** per il saldo (state + valore calcolato): divergeranno.
- **Import da `react-router-dom`**: nel corso si usa `react-router`.

---

## ✅ Checklist
- ☐ So descrivere il ruolo di ogni cartella di `src/`.
- ☐ So dire dove vive ciascun dato della tabella.
- ☐ Ho confrontato il mio albero con quello target.
- ☐ Nessun componente presentazionale importa servizi o context.
- ☐ `App.jsx` contiene solo la mappa delle rotte.

---

## 🚀 Challenge
Disegna (anche a mano) il diagramma delle dipendenze tra `pages`, `components`, `hooks`, `context`, `services`, `utils`, e verifica che non ci siano frecce "all'indietro".

---

## 📌 Recap
- Struttura per tipo: `components`, `pages`, `layouts`, `context`, `hooks`, `services`, `utils`, `data`.
- Dipendenze in una sola direzione; i servizi non conoscono React.
- Lo state locale resta locale; il context è per i dati condivisi.
- Il saldo mostrato è un dato derivato, non uno state.

---

### ➡️ Next
Prossimo capitolo: [Piano di Implementazione](./04_Piano_di_Implementazione.md) — in che ordine completare i requisiti, con tempi e definizione di "fatto" per ogni fase.
