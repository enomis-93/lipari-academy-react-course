# 🏦 LipariBank — React Zero to Hero

> **Day 8 · Capitolo 01**
> **Argomento:** Custom Hooks
> **Durata stimata:** 70 minuti
> **Parte di LipariBank:** `useLocalStorage`, `useBankStatus`, `useTransactions` e `useTransferForm` in `src/hooks/`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- riconoscere quando estrarre la logica di un componente in un custom hook;
- scrivere un custom hook rispettando le regole degli Hooks;
- spiegare che cosa condivide un custom hook (la logica) e che cosa no (lo state);
- creare quattro hook per LipariBank ed eliminare codice ripetuto tra le pagine.

---

## 📋 Prerequisiti
- [Day 7 · Esercizio — Migrazione a Redux](../Day_07_Shared_State_Redux/06_Esercizio_Migrazione_a_Redux.md): i dati bancari sono nello store, la preferenza "nascondi saldi" in `SettingsContext`.
- [Day 4 · `useRef`](../Day_04_Forms_User_Input/05_useRef.md): `TransferForm` gestisce il focus con `formRef`.
- [Day 4 · Validazione](../Day_04_Forms_User_Input/03_Validazione.md): `validateTransfer(values, availableBalance)` e `parseAmount` in `src/utils/validators.js`.

---

## 🧭 In questo capitolo
- Che cos'è un custom hook e quando serve.
- `useLocalStorage`: una preferenza che sopravvive al ricaricamento.
- `useBankStatus`: caricamento, errore e "Riprova" in un punto solo.
- `useTransactions`: filtri e ordinamento dei movimenti.
- `useTransferForm`: state, validazione, focus e invio del bonifico.

---

## 🧠 Theory

### Che cos'è un custom hook
Un custom hook è una **normale funzione JavaScript** il cui nome inizia per `use` e che chiama altri Hooks (`useState`, `useEffect`, `useRef`, `useSelector`, altri custom hook). Serve a:

- **riusare logica** con state ed effetti tra componenti diversi;
- **dare un nome** a una logica complessa e togliere rumore dal componente.

Le regole degli Hooks valgono anche qui: si chiamano solo al livello principale della funzione (mai in `if`, cicli, funzioni annidate) e solo da componenti o da altri hook. Il prefisso `use` permette al linter di controllarle.

### Condivide la logica, non lo state
Ogni volta che chiami un custom hook ottieni **una nuova istanza dello state** che contiene. Due componenti che chiamano `useLocalStorage("chiave", false)` hanno due state separati.

Per condividere lo *stesso* state servono gli strumenti del Day 7: un Context o lo store. Un custom hook può però **leggere** da quegli strumenti: se dentro chiama `useSelector`, tutti i componenti che lo usano vedono gli stessi dati dello store, perché la sorgente è una sola.

### Quando estrarre e quando no

| Estrai quando | Lascia nel componente quando |
|---|---|
| La stessa logica compare in due o più componenti | È un solo `useState` banale |
| Il componente mescola interfaccia e logica complessa | La logica sono due righe leggibili |
| Vuoi dare un nome a un comportamento (`useTransferForm`) | Estrarla ti obbligherebbe a passare dieci parametri |

> 💡 **Remember**
>
> Un custom hook non è un componente: non restituisce JSX. Restituisce valori e funzioni che il componente usa nel proprio JSX.

---

## 💻 Let's Code

### 1. `useLocalStorage`
Oggi "Nascondi saldi" si azzera a ogni ricaricamento. Crea `src/hooks/useLocalStorage.js` (nuova cartella `src/hooks/`):

```javascript title="src/hooks/useLocalStorage.js"
import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage non disponibile (es. modalità privata): l'app continua a funzionare
    }
  }, [key, value]);

  return [value, setValue];
}
```

Legge il valore salvato **una sola volta** (la funzione passata a `useState` viene eseguita solo al primo render), lo riscrive a ogni cambiamento e tollera sia un `localStorage` non disponibile sia un contenuto non valido. Restituisce `[value, setValue]` come `useState`: è un sostituto diretto.

Usalo in `src/context/SettingsContext.jsx`:

```jsx title="src/context/SettingsContext.jsx"
import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [hideBalance, setHideBalance] = useLocalStorage("liparibank.hideBalance", false);

  const toggleHideBalance = useCallback(() => {
    setHideBalance((current) => !current);
  }, [setHideBalance]);

  const value = useMemo(
    () => ({ hideBalance, toggleHideBalance }),
    [hideBalance, toggleHideBalance],
  );

  return <SettingsContext value={value}>{children}</SettingsContext>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === null) {
    throw new Error("useSettings deve essere usato dentro <SettingsProvider>.");
  }
  return context;
}
```

Rispetto a prima: `useState(false)` è diventato `useLocalStorage("liparibank.hideBalance", false)`, e `setHideBalance` compare tra le dipendenze di `useCallback` (il linter lo richiede).

Nascondi i saldi e ricarica la pagina (`F5`): la preferenza resta.

> ⚠️ **Sicurezza.** `localStorage` è leggibile da qualunque script della pagina e non è cifrato. Ci vanno solo **preferenze non sensibili**, mai dati bancari reali, token o credenziali.

### 2. `useBankStatus`
Apri le pagine una dopo l'altra: quattro di esse ripetono le stesse righe per sapere se i dati sono in caricamento, se c'è un errore e come riprovare.

```jsx
const status = useSelector(selectTransactionsStatus);
const error = useSelector(selectTransactionsError);
// ...
if (status === "idle" || status === "loading") { /* caricamento */ }
if (status === "failed") { /* errore, con dispatch(fetchTransactions()) per riprovare */ }
```

È logica identica in più componenti: il primo criterio della tabella. Crea `src/hooks/useBankStatus.js`:

```javascript title="src/hooks/useBankStatus.js"
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactions,
  selectTransactionsError,
  selectTransactionsStatus,
} from "../store/transactionsSlice.js";

export function useBankStatus() {
  const dispatch = useDispatch();
  const status = useSelector(selectTransactionsStatus);
  const error = useSelector(selectTransactionsError);

  function reload() {
    dispatch(fetchTransactions());
  }

  return {
    isLoading: status === "idle" || status === "loading",
    error: status === "failed" ? error : null,
    reload,
  };
}
```

Il hook traduce lo `status` dello store in tre cose che una pagina capisce al volo: `isLoading`, `error` e `reload`. Le pagine non devono più sapere quali valori può assumere `status`, né quale thunk serve per riprovare.

### 3. `useTransactions`
Anche i filtri sui movimenti sono duplicati: `DashboardPage` e `TransactionsPage` contengono la stessa catena di `filter` e `sort`. Crea `src/hooks/useTransactions.js`:

```javascript title="src/hooks/useTransactions.js"
import { useSelector } from "react-redux";
import { selectTransactions } from "../store/transactionsSlice.js";

export function useTransactions({ accountId = null, filter = "all", searchText = "" } = {}) {
  const transactions = useSelector(selectTransactions);
  const normalizedSearch = searchText.trim().toLowerCase();

  return transactions
    .filter((transaction) => accountId === null || transaction.accountId === accountId)
    .filter((transaction) => {
      if (filter === "income") return transaction.amount > 0;
      if (filter === "expense") return transaction.amount < 0;
      return true;
    })
    .filter(
      (transaction) =>
        normalizedSearch === "" ||
        transaction.description.toLowerCase().includes(normalizedSearch),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}
```

Il hook legge i movimenti dallo store e restituisce quelli da mostrare, già filtrati e ordinati. I tre parametri sono facoltativi: senza `accountId` considera tutti i conti.

Le date sono stringhe `AAAA-MM-GG`, quindi `localeCompare` le ordina correttamente. `filter` crea un array nuovo, perciò `sort` non tocca lo state dello store.

Ora usa i due hook nella pagina dei movimenti. Sostituisci `src/pages/TransactionsPage.jsx`:

```jsx title="src/pages/TransactionsPage.jsx"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransactionFilters from "../components/TransactionFilters.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { useBankStatus } from "../hooks/useBankStatus.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { useTransactions } from "../hooks/useTransactions.js";
import { favoriteToggled, selectTransactions } from "../store/transactionsSlice.js";

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const allTransactions = useSelector(selectTransactions);
  const { isLoading, error, reload } = useBankStatus();

  const location = useLocation();
  const transferCompleted = location.state?.transferCompleted === true;

  const [filter, setFilter] = useLocalStorage("liparibank.transactionsFilter", "all");
  const [searchText, setSearchText] = useState("");

  const visibleTransactions = useTransactions({ filter, searchText });

  let content;

  if (isLoading) {
    content = <LoadingMessage message="Caricamento dei movimenti..." />;
  } else if (error) {
    content = <ErrorMessage message={error} onRetry={reload} />;
  } else if (allTransactions.length === 0) {
    content = <EmptyState message="Non ci sono ancora movimenti." />;
  } else {
    content = (
      <TransactionList
        transactions={visibleTransactions}
        onToggleFavorite={(transactionId) => dispatch(favoriteToggled(transactionId))}
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

Che cosa è cambiato:

- `useBankStatus()` sostituisce i due selector su `status` ed errore e le condizioni che li interpretavano;
- `useTransactions({ filter, searchText })` sostituisce l'intera catena di `filter` e `sort`;
- il filtro usa `useLocalStorage` al posto di `useState`: la scelta tra "Tutti", "Entrate" e "Uscite" sopravvive al ricaricamento. È lo stesso hook del punto 1, con un'altra chiave e un valore di tipo diverso;
- `allTransactions` serve ancora per distinguere "non c'è nessun movimento" da "nessun movimento corrisponde ai filtri".

### 4. `useTransferForm`
`TransferForm.jsx` contiene i valori dei campi, gli errori, il messaggio di conferma, la validazione, la gestione del focus e l'invio: tutto mescolato al JSX. Spostiamo la logica in `src/hooks/useTransferForm.js`:

```javascript title="src/hooks/useTransferForm.js"
import { useRef, useState } from "react";
import { formatCurrency } from "../utils/formatters.js";
import { parseAmount, validateTransfer } from "../utils/validators.js";

const EMPTY_VALUES = { accountId: "", beneficiaryId: "", amount: "", reason: "" };
const FIELD_ORDER = ["accountId", "beneficiaryId", "amount", "reason"];

export function useTransferForm({ beneficiaries, getAvailableBalance, onSubmit }) {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState("");
  const formRef = useRef(null);

  const selectedBeneficiary = beneficiaries.find((item) => item.id === values.beneficiaryId);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({
      ...current,
      [name]: undefined,
      ...(name === "accountId" ? { amount: undefined } : {}),
    }));
    setConfirmation("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateTransfer(values, getAvailableBalance(values.accountId));
    setErrors(validationErrors);

    const firstInvalidField = FIELD_ORDER.find((name) => validationErrors[name]);
    if (firstInvalidField) {
      setConfirmation("");
      formRef.current.elements[firstInvalidField].focus();
      return;
    }

    const amount = parseAmount(values.amount);
    onSubmit({
      accountId: values.accountId,
      beneficiaryId: values.beneficiaryId,
      amount,
      reason: values.reason.trim(),
    });

    setConfirmation(
      `Bonifico SIMULATO di ${formatCurrency(amount)} a ${selectedBeneficiary.name} registrato. Nessuna operazione bancaria reale è stata eseguita.`,
    );
    setValues(EMPTY_VALUES);
    setErrors({});
    formRef.current.elements.accountId.focus();
  }

  return {
    formRef,
    values,
    errors,
    confirmation,
    selectedBeneficiary,
    handleChange,
    handleSubmit,
  };
}
```

È il codice che avevi in `TransferForm`, quasi riga per riga. Due cose da notare:

- il hook **possiede la ref** del form e la restituisce: sarà il componente a collegarla al `<form>`. Un hook può contenere qualunque altro hook, anche `useRef`;
- il hook non sa che cosa succede dopo l'invio: chiama `onSubmit` con i dati del bonifico e lascia decidere a chi lo usa.

Ora `src/components/TransferForm.jsx` conserva **tutto il JSX invariato** e perde la logica. Sostituisci la parte del file che precede `return (`:

```jsx title="src/components/TransferForm.jsx"
import { useTransferForm } from "../hooks/useTransferForm.js";
import { formatCurrency } from "../utils/formatters.js";
import { REASON_MAX_LENGTH } from "../utils/validators.js";

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error" role="alert">
      {message}
    </p>
  );
}

function TransferForm({ accounts, beneficiaries, onAddTransfer }) {
  function getAvailableBalance(accountId) {
    return accounts.find((account) => account.id === accountId)?.balance ?? 0;
  }

  const { formRef, values, errors, confirmation, selectedBeneficiary, handleChange, handleSubmit } =
    useTransferForm({ beneficiaries, getAvailableBalance, onSubmit: onAddTransfer });

  const selectedAccount = accounts.find((account) => account.id === values.accountId);

  function fieldA11y(name) {
    return {
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `${name}-error` : undefined,
    };
  }
```

Dal `return (` in poi il file resta com'era, compreso `ref={formRef}` sul tag `<form>`: la differenza è che ora `formRef` arriva dal hook. Non servono più `useRef`, `useState`, `emptyValues`, `FIELD_ORDER`, `handleChange`, `handleSubmit`, né gli import di `parseAmount` e `validateTransfer`.

Le props del componente non cambiano (`accounts`, `beneficiaries`, `onAddTransfer`): `TransferPage` non va toccata.

**Verifica.** Esegui un bonifico non valido e uno valido: gli errori, il focus sul primo campo da correggere, la navigazione ai movimenti e il saldo aggiornato devono comportarsi come prima.

---

## 🏦 LipariBank in action
Prima e dopo, sul bonifico:

```text
PRIMA: TransferForm = JSX + state + validazione + focus + invio
DOPO:  TransferForm = JSX
       useTransferForm = state + validazione + focus + invio
```

I quattro hook hanno ruoli diversi:

| Hook | Tipo | Che cosa fa |
|---|---|---|
| `useLocalStorage` | Generico: non conosce LipariBank | Uno state che viene salvato nel browser |
| `useBankStatus` | Lettura dallo store | Traduce gli `status` in `isLoading`, `error`, `reload` |
| `useTransactions` | Lettura dallo store | Restituisce i movimenti filtrati e ordinati |
| `useTransferForm` | Un flusso completo | Gestisce il form del bonifico |

Non tutto diventa un hook: `searchText` resta un `useState` accanto al suo `<input>`.

---

## 🧪 Your Turn

### Parte A — Un hook, tre pagine
**Obiettivo:** eliminare la logica di caricamento ripetuta nelle pagine rimaste.

**Requisiti:**
1. `DashboardPage`, `AccountsPage` e `TransferPage` usano `useBankStatus()` al posto dei selector su `status` ed errore.
2. In queste tre pagine non compaiono più `selectTransactionsStatus`, `selectTransactionsError` né `fetchTransactions`.
3. Il comportamento non cambia: caricamento iniziale, errore con "Riprova", pagina completa.
4. `npm run lint` e `npm run build` senza errori.

**Passi suggeriti:**
1. Sostituisci le righe dei selector con `const { isLoading, error, reload } = useBankStatus();`.
2. Riscrivi le due guardie: `if (isLoading) ...` e `if (error) ...`, con `onRetry={reload}`.
3. Togli gli import rimasti inutilizzati: il linter te li segnala.

**Risultato atteso:** per provare l'errore rinomina temporaneamente `public/data/transactions.json`, ricarica una delle tre pagine, rimetti il nome corretto e premi "Riprova".

### Parte B — Mettere alla prova `useLocalStorage`
**Requisiti:**
1. In `/transactions` scegli "Uscite" e ricarica: il filtro resta.
2. Negli strumenti di sviluppo (tab *Application* → *Local Storage*) modifica a mano il valore di `liparibank.transactionsFilter` scrivendo `{` e ricarica: l'app deve partire con il filtro "Tutti", senza errori.
3. Spiega quale riga di `useLocalStorage` rende possibile il punto 2.

**Criteri di completamento:** le due parti sono verificate; nessun avviso sulle regole degli Hooks.

> ⚠️ **Prova prima da solo.** La soluzione mostra la forma che devono avere le pagine.

### Soluzione di riferimento — Parte A

`src/pages/AccountsPage.jsx`:

```jsx title="src/pages/AccountsPage.jsx"
import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import { useSettings } from "../context/SettingsContext.jsx";
import { useBankStatus } from "../hooks/useBankStatus.js";
import { selectAccounts } from "../store/accountsSlice.js";
import { formatCurrency } from "../utils/formatters.js";

function getLinkClassName({ isActive }) {
  return isActive ? "account-link account-link-active" : "account-link";
}

export default function AccountsPage() {
  const accounts = useSelector(selectAccounts);
  const { isLoading, error, reload } = useBankStatus();
  const { hideBalance } = useSettings();

  if (isLoading) return <LoadingMessage message="Caricamento dei conti..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return (
    <section>
      <h1>I tuoi conti</h1>

      <div className="accounts-layout">
        <ul className="account-links">
          {accounts.map((account) => (
            <li key={account.id}>
              <NavLink
                to={`/accounts/${account.id}`}
                className={getLinkClassName}
              >
                <strong>{account.name}</strong>
                <span>{hideBalance ? "••••••" : formatCurrency(account.balance)}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="account-detail">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
```

`src/pages/TransferPage.jsx`:

```jsx title="src/pages/TransferPage.jsx"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransferForm from "../components/TransferForm.jsx";
import { beneficiaries } from "../data/mockData.js";
import { useBankStatus } from "../hooks/useBankStatus.js";
import { selectAccounts } from "../store/accountsSlice.js";
import { transferAdded } from "../store/transactionsSlice.js";

export default function TransferPage() {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const { isLoading, error, reload } = useBankStatus();
  const navigate = useNavigate();

  if (isLoading) return <LoadingMessage message="Caricamento dei conti..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  function handleAddTransfer(transfer) {
    const beneficiary = beneficiaries.find((item) => item.id === transfer.beneficiaryId);
    if (!beneficiary) return;

    dispatch(
      transferAdded({
        accountId: transfer.accountId,
        beneficiaryName: beneficiary.name,
        amount: transfer.amount,
      }),
    );
    navigate("/transactions", { state: { transferCompleted: true } });
  }

  return (
    <section>
      <h1>Nuovo bonifico</h1>
      <p>Operazione simulata: nessun denaro viene trasferito.</p>
      <TransferForm
        accounts={accounts}
        beneficiaries={beneficiaries}
        onAddTransfer={handleAddTransfer}
      />
    </section>
  );
}
```

In `src/pages/DashboardPage.jsx` cambiano l'inizio del componente e le due guardie; il resto è invariato:

```jsx title="src/pages/DashboardPage.jsx"
export default function DashboardPage() {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const transactions = useSelector(selectTransactions);
  const { isLoading, error, reload } = useBankStatus();
  const { hideBalance, toggleHideBalance } = useSettings();
```

```jsx
if (isLoading) return <LoadingMessage message="Caricamento dei movimenti..." />;
if (error) return <ErrorMessage message={error} onRetry={reload} />;
```

Per il punto 3 della Parte B: è il `try`/`catch` attorno a `JSON.parse`, che in caso di contenuto non valido restituisce `initialValue`.

---

## ⚠️ Common Mistakes
- **Nome senza `use`** (`transferForm()`): perdi i controlli del linter e rischi di violare le regole degli Hooks senza accorgertene.
- **Chiamare un custom hook in un `if`** o dopo un `return` anticipato: stesso errore degli Hooks normali.
- **Aspettarsi state condiviso da `useState`**: due chiamate a `useLocalStorage` con la stessa chiave non si sincronizzano tra loro; per condividere servono un Context o lo store.
- **Salvare dati sensibili in `localStorage`**: solo preferenze.
- **Hook con troppi parametri** (otto o più): spesso il confine scelto è sbagliato.
- **Leggere `localStorage` a ogni render**: usa la funzione di inizializzazione di `useState`, come nel codice sopra.
- **Un hook che restituisce JSX**: allora è un componente, e va scritto e usato come tale.

---

## ✅ Checklist
- ☐ So definire un custom hook e le regole che deve rispettare.
- ☐ So dire che cosa condividono due componenti che usano lo stesso custom hook.
- ☐ `hideBalance` e il filtro dei movimenti sopravvivono a `F5`.
- ☐ Le quattro pagine con dati usano `useBankStatus()`.
- ☐ `TransferForm` contiene solo JSX e la logica è in `useTransferForm`.
- ☐ So spiegare perché `searchText` non è diventato un custom hook.

---

## 🚀 Challenge
Scrivi `useDebouncedValue(value, delayMs)`, che restituisce il valore aggiornato solo dopo `delayMs` millisecondi senza cambiamenti (`useEffect` con `setTimeout` e cleanup con `clearTimeout`). Usalo sul campo di ricerca dei movimenti. Con 8 movimenti serve davvero? Rifletti su che cosa cambierebbe con 5.000 righe. È un'estensione facoltativa: i capitoli successivi non la usano.

---

## 📌 Recap
- Un custom hook è una funzione `useXxx` che usa altri Hooks per riusare **logica**.
- Ogni chiamata ha il proprio state; per condividere dati servono un Context o lo store, che un hook può leggere.
- `useLocalStorage` è generico; `useBankStatus`, `useTransactions` e `useTransferForm` sono specifici di LipariBank.
- Estrai quando la logica si ripete o nasconde l'interfaccia, non per ogni `useState`.
- In `localStorage` solo preferenze non sensibili.

---

### ➡️ Next
Prossimo capitolo: [02 · Memoization](./02_Memoization.md). Vedremo `useMemo`, `useCallback` e `React.memo` e, soprattutto, quando **non** servono.
