# 🏦 LipariBank — React Zero to Hero

> **Day 7 · Capitolo 07**
> **Argomento:** Esercizio — Refactoring di LipariBank
> **Durata stimata:** 90 minuti
> **Parte di LipariBank:** migrazione dello state da `App.jsx` a `BankContext`, hook e service layer, senza cambiare il comportamento

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- eseguire un refactoring progressivo mantenendo l'app funzionante a ogni passo;
- collegare `BankProvider`, `useBank`, `useTransactions`, `useTransferForm` e i service alle pagine esistenti;
- ridurre `App.jsx` a sole route, eliminando il prop drilling;
- verificare con una checklist che il comportamento osservabile sia identico a prima.

---

## 📋 Prerequisiti
- Capitoli [01](./01_Context_e_useContext.md), [02](./02_useReducer.md), [03](./03_Custom_Hooks.md), [04](./04_Memoization.md), [05](./05_Architettura_del_Progetto.md) e [06](./06_Service_Layer_e_API.md) completati. Devono esistere:
  - `src/context/SettingsContext.jsx`, `src/context/bankReducer.js`, `src/context/BankContext.jsx` (versione del cap. 06 con `getAccounts`, `getTransactions`, `getErrorMessage`);
  - `src/hooks/useLocalStorage.js`, `useTransactions.js` (versione finale del cap. 04), `useTransferForm.js`;
  - `src/services/apiClient.js`, `transactionService.js`, `accountService.js`, `public/data/accounts.json`;
  - `src/components/ErrorBoundary.jsx` collegato in `AppLayout.jsx`, `src/components/TransferForm.jsx` aggiornato (cap. 03).
- Stato di partenza dell'app: quello di fine Day 6 (`App.jsx` con `transactions`, `isLoading`, `error`, `handleRetry`, `handleToggleFavorite`, `addTransfer` e il saldo derivato `getDisplayedBalance`, passati via props alle pagine). Il modulo React Legacy è facoltativo e **non è coinvolto**: se lo hai seguito, rimuovi la route `/legacy` temporanea da `App.jsx`.
- Assunzioni sul tuo codice (adatta se diverso): `ErrorMessage` accetta `message` e `onRetry`; `LoadingMessage` accetta un `message` facoltativo; dopo un bonifico si naviga a `/transactions` passando `state: { transferCompleted: true }` (mostra il messaggio "Bonifico simulato registrato.").
- Comandi sempre dentro `liparibank/`.

---

## 🧭 In questo capitolo
- Come si fa un refactoring senza rompere l'app.
- Baseline: cosa deve restare identico.
- Passi guidati (provider, prima pagina) e passi da fare da solo.
- Soluzioni di riferimento e checklist finale.

---

## 🧠 Theory

### Refactoring = stessa funzione, struttura migliore
Un **refactoring** cambia *come* è scritto il codice, non *cosa fa* l'app. Per questo:
1. **Fotografa il comportamento** prima di iniziare (baseline).
2. Lavora a **passi piccoli**, con l'app sempre funzionante.
3. **Fai un commit** dopo ogni passo che funziona: se rompi qualcosa, torni indietro di poco.
4. Controlla la baseline **alla fine** (e ogni tanto durante).

### Strategia: una pagina alla volta
Non riscriviamo tutto insieme. Montiamo il `BankProvider` accanto allo state di `App.jsx` e spostiamo **una pagina alla volta** a leggere da `useBank`/`useTransactions`. Finché `App.jsx` passa ancora le props, le pagine migrate le ignorano. Alla fine togliamo lo state da `App.jsx`.

> ⚠️ Durante la migrazione le due sorgenti dati (state di `App.jsx` e `BankProvider`) **non sono sincronizzate**: un bonifico o un "preferito" fatto da una pagina ancora collegata ad `App.jsx` non compare nelle pagine già migrate, e viceversa. È normale e temporaneo: verifica bonifici e preferiti solo dopo il passo 6.

```text
Passo 1-2:  main.jsx ─ BankProvider ─ App (state + props)  ─ pagine (props)   <- due sorgenti dati, temporaneo
Passo 3-6:  pagine una a una → useBank / useTransactions
Passo 7:    App.jsx = solo <Routes>; nessuna prop
```

> 💡 **Remember**
>
> Un refactoring finito non ha codice morto: props non più usate, import inutilizzati e funzioni vecchie vanno eliminati prima del commit finale.

---

## 💻 Let's Code

### Passo 0 — Baseline
Prima di toccare il codice, esegui la **checklist di verifica** (sezione "LipariBank in action") sull'app attuale e annota ciò che vedi. Poi, se usi la tua repository, salva il punto di partenza. Dentro `liparibank/`:

```bash
git add -A
git commit -m "Day 7: stato prima del refactoring"
git tag day7-before-refactoring
```

### Passo 1 — Montare i Provider
`src/main.jsx` (il `SettingsProvider` c'è già dal cap. 01):

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { BankProvider } from "./context/BankContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SettingsProvider>
      <BankProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </BankProvider>
    </SettingsProvider>
  </StrictMode>,
);
```

Verifica: l'app funziona **come prima**. Nel tab Network di DevTools vedrai ora richieste doppie per `transactions.json` (una da `App.jsx`, una da `BankProvider`) e una per `accounts.json`: è atteso e temporaneo. In sviluppo, per via di `StrictMode`, vedrai anche richieste annullate (`canceled`): normale.

Commit: `git commit -am "Day 7: montato BankProvider"`.

### Passo 2 — Prima pagina migrata: `TransactionsPage`
Esempio guidato. **Prima** (Day 6, snippet parziale):

```jsx
export default function TransactionsPage({ transactions, isLoading, error, onRetry, onToggleFavorite }) {
  // filtro e ricerca applicati a mano sull'array ricevuto
}
```

**Dopo**: la pagina non riceve più props; usa `useTransactions` per i movimenti filtrati e `useBank` per le azioni (snippet parziale: mantieni il tuo JSX):

```jsx
import { useState } from "react";
import { useBank } from "../context/BankContext";
import { useTransactions } from "../hooks/useTransactions";

export default function TransactionsPage() {
  const { reload, toggleFavorite } = useBank();
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const { transactions, isLoading, error } = useTransactions({ filter, searchText });

  // ...stesso JSX di prima: loading, errore (onRetry={reload}), EmptyState, TransactionFilters,
  // TransactionList (onToggleFavorite={toggleFavorite})
}
```

Cosa cambia: il filtro per entrate/uscite, la ricerca e l'ordinamento per data ora stanno in `useTransactions`; **elimina** dalla pagina il vecchio codice che li faceva (altrimenti filtri due volte). `filter` e `searchText` restano `useState` della pagina: sono UI locale, non vanno nel Context. Il messaggio `transferCompleted` (da `useLocation`) resta com'è. Nella pagina l'empty state ("Non ci sono ancora movimenti") si basa su `transactions.length === 0` di **tutti** i movimenti: prendili da `useBank()` (`transactions: allTransactions`), non dall'array filtrato.

Se nei cap. 03-04 hai già aggiunto `useLocalStorage` per il filtro o `CategorySummary`, tienili: basta che i movimenti arrivino da `useTransactions`; `CategorySummary` riceve `allTransactions` (identità stabile, così `memo` funziona) e filtra la lista con `selectedCategory` (qui `useMemo` è sensato, perché `transactions` di `useTransactions` è stabile).

Verifica: `/transactions` mostra 8 movimenti, il filtro e la ricerca funzionano come prima. Commit.

---

## 🏦 LipariBank in action

### Il flusso dei dati
```text
PRIMA                                    DOPO
App.jsx (state + fetch + addTransfer)    main.jsx: SettingsProvider > BankProvider
  ├─ props → DashboardPage                 App.jsx: solo <Routes>
  ├─ props → TransactionsPage              pagine → useBank() / useTransactions()
  └─ props → TransferPage                  TransferForm → useTransferForm()
                                           BankProvider → services → apiClient → JSON
```

### Checklist di verifica: cosa deve comportarsi in modo identico
Esegui questi controlli prima (baseline) e dopo il refactoring. Con i dati fittizi del corso:

| # | Cosa controllare | Risultato atteso (identico a prima) |
|---|---|---|
| 1 | Apri `/` | Brevemente il messaggio "Caricamento dei movimenti...", poi la dashboard |
| 2 | Saldo totale in dashboard | `17.050,75 €` (somma dei due conti) |
| 3 | Card "Movimenti — Conto Corrente" in dashboard | 6 movimenti in ordine di data decrescente: dal 27/10 (`Spesa supermercato`) al 15/10 (`Pagamento utenza gas`); "Seleziona conto" sul Conto Risparmio → 2 movimenti e titolo del tab `LipariBank — Conto Risparmio` |
| 4 | `/accounts` | Due conti: Conto Corrente e Conto Risparmio |
| 5 | `/accounts/acc-001` e `/accounts/acc-002` | 6 movimenti per il corrente, 2 per il risparmio |
| 6 | `/transactions` | 8 movimenti; filtro "entrate" → 4, "uscite" → 4; la ricerca "utenza" → 2; "☆ Preferito" diventa "★" |
| 7 | Bonifico valido: 50 € dal Conto Corrente a Giulia Bianchi | Navigazione a `/transactions` con il messaggio "Bonifico simulato registrato."; in cima `Bonifico a Giulia Bianchi` di `-50,00 €`; saldo del Conto Corrente `4.200,75 €` (in `/accounts`) e totale `17.000,75 €` |
| 8 | Bonifico non valido (importo vuoto, oppure maggiore del saldo) | Errori per campo, nessun movimento aggiunto |
| 9 | Percorso inesistente (es. `/xyz`) | Pagina 404 |
| 10 | Ricarica (F5) dopo un bonifico | I bonifici simulati spariscono (vivono solo in memoria, come prima) |
| 11 | Console del browser durante la navigazione | Nessun errore (le richieste annullate di `StrictMode` non sono errori) |
| 12 | Errore di rete (`VITE_API_BASE_URL` sbagliata, cap. 06) | Messaggio comprensibile e pulsante "Riprova" |

**Differenze volute rispetto a Day 6** (tutto il resto deve essere identico):
- "Nascondi saldi" ora vale in tutte le pagine e sopravvive al ricaricamento (cap. 01 e 03);
- il filtro di `/transactions` sopravvive al ricaricamento (esercizio del cap. 03);
- in `/transactions` compare il riepilogo "Uscite per categoria" (cap. 04);
- i conti arrivano da `accounts.json`: le pagine mostrano il caricamento a pagina intera finché conti e movimenti non sono pronti (cap. 06);
- i messaggi d'errore sono quelli di `getErrorMessage` (cap. 06).

---

## 🧪 Your Turn
**Obiettivo:** completare la migrazione di tutte le pagine e svuotare `App.jsx`, senza cambiare il comportamento.

**Requisiti:**
1. **Passo 3 — `DashboardPage`:** conti, movimenti e azioni da `useBank()`, movimenti del conto selezionato (con filtro e ricerca) da `useTransactions({ accountId, filter, searchText })`; nessuna prop; `hideBalance` da `useSettings`. Attenzione: `selectedAccountId` non può partire da `accounts[0].id` (all'avvio `accounts` è vuoto): inizializzalo a `null` e ricava il conto con `accounts.find(...) ?? accounts[0]`.
2. **Passo 4 — `AccountsPage`:** l'elenco dei conti viene da `useBank().accounts` (non più via props); gestisce `isLoading` ed `error`; usa `hideBalance` da `useSettings`.
3. **Passo 5 — `AccountDetailPage`:** il conto si trova con `useParams` + `accounts.find(...)`; i movimenti con `useTransactions({ accountId })`; se il conto non esiste mostra "Conto non trovato". Non serve ripetere le guardie `isLoading`/`error`: la route è figlia di `AccountsPage`, che le gestisce già.
4. **Passo 6 — `TransferPage`:** passa a `TransferForm` `accounts`, `beneficiaries` (da `mockData.js`) e `onSubmitTransfer`; al submit chiama `addTransfer(transaction)` e naviga a `/transactions` con `state: { transferCompleted: true }`. Nessun `addTransfer` ricevuto via props.
5. **Passo 7 — `App.jsx`:** contiene solo `<Routes>`; niente `useState`, `useEffect`, `getDisplayedBalance`, import di `transactionService`; nessuna prop passata alle pagine.
6. **Pulizia:** rimuovi dai componenti le props ormai inutilizzate, gli import non usati e le vecchie funzioni; `npm run lint` e `npm run build` senza errori.
7. Esegui l'intera **checklist di verifica** e fai un commit per ogni passo.

**Passi suggeriti:** una pagina alla volta; dopo ciascuna verifica nel browser e committa. Gli hook (`useBank`, `useTransactions`, `useSettings`) vanno chiamati **prima** di qualunque `return` anticipato (loading/errore). Mostra `LoadingMessage` o `ErrorMessage` quando `isLoading` o `error` sono attivi, e solo dopo disegna la pagina.

**Risultato atteso:** `App.jsx` di poche righe, tutte le righe della checklist verificate, un solo caricamento per risorsa (oltre alle richieste annullate di `StrictMode` in sviluppo).

**Criteri di completamento:** nessuna pagina riceve props di dati da `App.jsx`; i 12 punti della checklist sono OK; nessun codice morto; `git tag day7-after-refactoring` creato (se usi la tua repo).

> ⚠️ **Prova prima da solo.** Le soluzioni di riferimento qui sotto sono per confrontare, non per copiare. Il tuo markup (`Header`, `EmptyState`, classi CSS) è diverso dal mio: confronta la **forma** (hook in cima, guardie loading/errore, nessuna prop di dati), non ogni riga.

### Soluzione di riferimento (parti chiave)

**`src/App.jsx` — dopo il refactoring** (stessa struttura di Day 6, con la route annidata per `/accounts/:accountId`):

```jsx
import { Route, Routes } from "react-router";
import AppLayout from "./layouts/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AccountsPage from "./pages/AccountsPage.jsx";
import AccountDetailPage from "./pages/AccountDetailPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import TransferPage from "./pages/TransferPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />

        <Route path="accounts" element={<AccountsPage />}>
          <Route
            index
            element={<p className="hint">Seleziona un conto per vederne i dettagli.</p>}
          />
          <Route path=":accountId" element={<AccountDetailPage />} />
        </Route>

        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="transfer" element={<TransferPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
```

**`src/context/BankContext.jsx` — versione finale:**

```jsx
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { bankReducer, initialState } from "./bankReducer";
import { getAccounts } from "../services/accountService";
import { getTransactions } from "../services/transactionService";
import { getErrorMessage } from "../utils/errorMessages";

const BankContext = createContext(null);

export function BankProvider({ children }) {
  const [state, dispatch] = useReducer(bankReducer, initialState);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      dispatch({ type: "LOAD_START" });
      try {
        const [accounts, transactions] = await Promise.all([
          getAccounts({ signal: controller.signal }),
          getTransactions({ signal: controller.signal }),
        ]);
        dispatch({ type: "LOAD_SUCCESS", payload: { accounts, transactions } });
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error(error);
        dispatch({ type: "LOAD_ERROR", payload: getErrorMessage(error) });
      }
    }

    load();
    return () => controller.abort();
  }, [reloadKey]);

  const addTransfer = useCallback((transaction) => {
    dispatch({ type: "ADD_TRANSFER", payload: transaction });
  }, []);

  const toggleFavorite = useCallback((transactionId) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: transactionId });
  }, []);

  const reload = useCallback(() => {
    setReloadKey((current) => current + 1);
  }, []);

  const value = useMemo(
    () => ({ ...state, addTransfer, toggleFavorite, reload }),
    [state, addTransfer, toggleFavorite, reload],
  );

  return <BankContext value={value}>{children}</BankContext>;
}

export function useBank() {
  const context = useContext(BankContext);
  if (context === null) {
    throw new Error("useBank deve essere usato dentro <BankProvider>.");
  }
  return context;
}
```

**`src/pages/TransferPage.jsx`:**

```jsx
import { useNavigate } from "react-router";
import TransferForm from "../components/TransferForm.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { useBank } from "../context/BankContext.jsx";
import { beneficiaries } from "../data/mockData.js";

export default function TransferPage() {
  const { accounts, isLoading, error, addTransfer, reload } = useBank();
  const navigate = useNavigate();

  if (isLoading) return <LoadingMessage message="Caricamento dei conti..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  function handleSubmitTransfer(transaction) {
    addTransfer(transaction);
    navigate("/transactions", { state: { transferCompleted: true } });
  }

  return (
    <section>
      <h1>Nuovo bonifico</h1>
      <p>Operazione simulata: nessun denaro viene trasferito.</p>
      <TransferForm
        accounts={accounts}
        beneficiaries={beneficiaries}
        onSubmitTransfer={handleSubmitTransfer}
      />
    </section>
  );
}
```

Il form viene mostrato solo a conti caricati: così la select dei conti non è mai vuota. `initialAccountId` non viene passato: il form parte con "Seleziona un conto", come nel Day 4. Gli hook (`useBank`, `useNavigate`) sono chiamati prima dei `return` anticipati.

**`src/pages/AccountDetailPage.jsx`:**

```jsx
import { Link, useParams } from "react-router";
import Card from "../components/Card.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { useBank } from "../context/BankContext.jsx";
import { useSettings } from "../context/SettingsContext.jsx";
import { useTransactions } from "../hooks/useTransactions.js";
import { formatCurrency } from "../utils/formatters.js";

export default function AccountDetailPage() {
  const { accountId } = useParams();
  const { accounts, toggleFavorite } = useBank();
  const { hideBalance } = useSettings();
  const { transactions } = useTransactions({ accountId });

  const account = accounts.find((item) => item.id === accountId);

  if (!account) {
    return (
      <section>
        <h2>Conto non trovato</h2>
        <p>Non esiste nessun conto con id "{accountId}".</p>
        <Link to="/accounts">Torna ai conti</Link>
      </section>
    );
  }

  return (
    <section>
      <Card title={account.name}>
        <p>{account.iban}</p>
        <p>Saldo: {hideBalance ? "••••••" : formatCurrency(account.balance)}</p>
      </Card>

      <h2>Movimenti del conto</h2>
      <TransactionList transactions={transactions} onToggleFavorite={toggleFavorite} />
    </section>
  );
}
```

Qui non ci sono guardie `isLoading`/`error`: la pagina è figlia di `AccountsPage`, che mostra già caricamento ed errore prima di renderizzare l'`<Outlet />`.

**`src/pages/DashboardPage.jsx` — solo la parte dati** (snippet parziale; il JSX resta quello di Day 6, con `hideBalance`/`toggleHideBalance` dal Context e senza le prop sui componenti):

```jsx
const { accounts, transactions, isLoading, error, reload, toggleFavorite } = useBank();
const { hideBalance, toggleHideBalance } = useSettings();

const [selectedAccountId, setSelectedAccountId] = useState(null);
const [filter, setFilter] = useState("all");
const [searchText, setSearchText] = useState("");

const selectedAccount =
  accounts.find((account) => account.id === selectedAccountId) ?? accounts[0];
const selectedAccountName = selectedAccount?.name;

const { transactions: visibleTransactions } = useTransactions({
  accountId: selectedAccount?.id ?? null,
  filter,
  searchText,
});

// useEffect per document.title: parte solo se selectedAccountName esiste, dipendenza [selectedAccountName]

if (isLoading) return <LoadingMessage message="Caricamento dei movimenti..." />;
if (error) return <ErrorMessage message={error} onRetry={reload} />;

const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
```

All'avvio `accounts` è vuoto, perciò `selectedAccountId` parte da `null` e il conto selezionato si ricava a ogni render (`?? accounts[0]`): con `useState(accounts[0].id)` l'app andrebbe in errore al primo render. `useTransactions` restituisce già i movimenti del conto, filtrati e ordinati per data decrescente. Nel JSX `transactions` (tutti i movimenti, da `useBank`) serve ad `AccountList` per contare i movimenti per conto e all'empty state; `visibleTransactions` va a `TransactionList`.

---

## 🔗 Repository / Checkpoint
**Checkpoint Day 7 — "Refactoring LipariBank"** (checkpoint opzionale per ripartire da una repository di riferimento).

- **Repository del corso:** `[DA CONFIGURARE: inserire URL reale della repository]`
- **Branch:** `[DA CONFIGURARE: inserire nome reale del branch]`
- **Contenuto iniziale (prima del refactoring):** progetto a fine Day 6: `App.jsx` con state e props, `transactionService.js` con `getTransactions`, pagine in `src/pages/`; `src/legacy/` è presente solo se hai seguito l'extra; **più** i moduli dei cap. 01-06 già creati ma non collegati (context, hooks, service layer, `ErrorBoundary`).
- **Da completare:** i passi 1-7 di questo capitolo (montaggio provider, migrazione di tutte le pagine, `App.jsx` ridotto a `<Routes>`).
- **Già funzionante:** tutte le pagine del Day 6, il bonifico simulato e il caricamento dei movimenti.
- **Come verificare:** i 12 punti della checklist; `npm run lint`; `npm run build`.

Se lavori sulla **tua repository** (Day 0): `git tag day7-before-refactoring` prima di iniziare e `git tag day7-after-refactoring` alla fine (nomi suggeriti, scegli liberamente). Per non inventare nulla nelle repository del corso, i segnaposto sopra vanno compilati dal docente.

---

## ⚠️ Common Mistakes
- **`useBank deve essere usato dentro <BankProvider>`**: manca il Provider in `main.jsx` o è montato *sotto* il componente che lo usa.
- **Saldo contato due volte**: il vecchio `getDisplayedBalance` di `App.jsx` (Day 6) è ancora attivo mentre ora il saldo lo aggiorna anche `ADD_TRANSFER`. Tieni una sola fonte.
- **Filtri applicati due volte**: la pagina filtra ancora a mano oltre a usare `useTransactions`.
- **Hook dopo un `return` anticipato**: errore "Rendered more hooks than during the previous render". Chiama gli hook in cima.
- **`accounts[0].id` al primo render** (o `useState(accounts[0].id)`): all'avvio `accounts` è vuoto e la pagina va in errore. Inizializza a `null` e ricava il conto a ogni render, oppure mostra prima `LoadingMessage`.
- **Props lasciate "per sicurezza"**: `App.jsx` passa ancora dati che nessuno legge; è codice morto.
- **Cambiare comportamento "già che ci siamo"**: se aggiungi una feature, fallo in un commit separato dal refactoring.

---

## ✅ Checklist
- ☐ `main.jsx` monta `SettingsProvider` e `BankProvider`.
- ☐ Tutte le pagine leggono dati da `useBank`/`useTransactions`; nessuna riceve dati via props.
- ☐ `App.jsx` contiene solo `<Routes>`.
- ☐ `TransferForm` usa `useTransferForm`; il bonifico aggiunge un movimento e aggiorna il saldo.
- ☐ Nessun `fetch(` fuori da `src/services/apiClient.js`.
- ☐ I 12 punti della checklist di verifica sono OK.
- ☐ Nessun import o prop inutilizzati; `npm run lint` e `npm run build` senza errori.
- ☐ Ho fatto almeno un commit per passo.

---

## 🚀 Challenge
Aggiungi un pulsante "Annulla ultimo bonifico" in `TransactionsPage`: esponi da `useBank` la funzione `removeTransfer(id)` che fa `dispatch({ type: "REMOVE_TRANSFER", payload: id })` (azione dell'esercizio del cap. 02) e mostralo solo per i movimenti con categoria `"Bonifici"`. Verifica che il saldo torni al valore precedente.

---

## 📌 Recap
- Un refactoring cambia la struttura, non il comportamento: baseline, passi piccoli, commit frequenti.
- Context + reducer centralizzano state condiviso e regole; gli hook estraggono logica riusabile; i service isolano l'accesso ai dati.
- `App.jsx` torna a essere solo routing: il prop drilling di Day 6 è sparito.
- UI locale (`filter`, `searchText`, valori del form) resta locale.
- La checklist di verifica è la prova che il refactoring è riuscito.

---

### ➡️ Next
Prossimo capitolo: [08 — Redux Toolkit](./08_Redux_Toolkit.md). Aggiungiamo uno store condiviso per una preferenza dell'interfaccia.
