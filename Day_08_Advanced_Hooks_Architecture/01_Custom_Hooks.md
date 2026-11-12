# 🏦 LipariBank — React Zero to Hero

> **Day 7 · Capitolo 03**
> **Argomento:** Custom Hooks
> **Durata stimata:** 60 minuti
> **Parte di LipariBank:** `useLocalStorage`, `useTransactions`, `useTransferForm` in `src/hooks/`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- riconoscere quando estrarre la logica di un componente in un custom hook;
- scrivere un custom hook rispettando le regole degli Hooks;
- spiegare cosa condivide un custom hook (la logica) e cosa no (lo state);
- creare `useLocalStorage`, `useTransactions` e `useTransferForm` per LipariBank.

---

## 📋 Prerequisiti
- [Cap. 01 · Context e useContext](./01_Context_e_useContext.md) e [cap. 02 · useReducer](./02_useReducer.md): `SettingsContext.jsx`, `bankReducer.js` e `BankContext.jsx` esistono.
- [Day 4 · Validazione](../Day_04_Forms_User_Input/03_Validazione.md): `validateTransfer(values, availableBalance)` e `parseAmount` in `src/utils/validators.js`.
- Campi del form bonifico (quelli del Day 4): `accountId`, `beneficiaryId`, `amount`, `reason`; `validateTransfer` restituisce un oggetto `errors` con le stesse chiavi. Il `TransferForm.jsx` di Day 4-6 riceve `accounts`, `beneficiaries`, `onAddTransfer` e al submit chiama `onAddTransfer({ accountId, beneficiaryId, amount, reason })`.

---

## 🧭 In questo capitolo
- Cos'è un custom hook e quando serve.
- `useLocalStorage`: persistenza di una preferenza.
- `useTransactions`: filtri e ordinamento dei movimenti.
- `useTransferForm`: state, validazione e submit del bonifico.

---

## 🧠 Theory

### Cos'è un custom hook
Un custom hook è una **normale funzione JavaScript** il cui nome inizia per `use` e che chiama altri Hooks (`useState`, `useEffect`, `useContext`, altri custom hook). Serve a:
- **riusare logica** con state/effetti tra componenti diversi;
- **dare un nome** a logica complessa e togliere rumore dal componente.

Le regole degli Hooks valgono anche qui: si chiamano solo al livello principale della funzione (mai in `if`, cicli, funzioni annidate) e solo da componenti o da altri hook. Il prefisso `use` permette agli strumenti di lint di controllarle.

### Condivide la logica, non lo state
Ogni volta che chiami un custom hook ottieni **una nuova istanza dello state**. Due componenti che chiamano `useLocalStorage("chiave", false)` hanno due state separati. Per condividere lo *stesso* state tra componenti serve il Context (cap. 01-02).

### Quando estrarre e quando no
| Estrai quando | Lascia nel componente quando |
|---|---|
| La stessa logica compare in 2+ componenti | Un solo `useState` banale |
| Il componente mescola UI e logica complessa | La logica è due righe leggibili |
| Vuoi dare un nome a un comportamento (`useTransferForm`) | Estrarla ti obbligherebbe a passare dieci parametri |

> 💡 **Remember**
>
> Un custom hook non è un componente: non restituisce JSX. Restituisce valori e funzioni (un array o un oggetto) che il componente usa nel proprio JSX.

---

## 💻 Let's Code

### 1. `useLocalStorage`
Crea `src/hooks/useLocalStorage.js` (nuova cartella `src/hooks/`):

```javascript
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

Cosa fa: legge il valore salvato **una sola volta** (initializer function di `useState`), lo riscrive a ogni cambiamento e tollera `localStorage` non disponibile o JSON non valido. Restituisce `[value, setValue]` come `useState`, quindi è un sostituto diretto.

Usalo in `src/context/SettingsContext.jsx`: sostituisci `useState(false)` con il nuovo hook, aggiungi l'import e aggiungi `setHideBalance` all'array delle dipendenze di `useCallback` (il lint lo segnala, anche se il setter è stabile):

```jsx
import { useLocalStorage } from "../hooks/useLocalStorage";

// dentro SettingsProvider
const [hideBalance, setHideBalance] = useLocalStorage("liparibank.hideBalance", false);

const toggleHideBalance = useCallback(() => {
  setHideBalance((current) => !current);
}, [setHideBalance]);
```

Ora `SettingsContext.jsx` non usa più `useState`: toglilo dall'import di `react`.

Nascondi il saldo e ricarica la pagina (F5): la preferenza resta.

> ⚠️ **Sicurezza:** `localStorage` è leggibile da qualunque script della pagina e non è cifrato. Ci metti solo **preferenze non sensibili** (come `hideBalance`), mai dati bancari reali, token o credenziali.

### 2. `useTransactions`
Il componente che mostra i movimenti non dovrebbe sapere come si filtra e si ordina. Crea `src/hooks/useTransactions.js`:

```javascript
import { useBank } from "../context/BankContext";

export function useTransactions({ accountId = null, filter = "all", searchText = "" } = {}) {
  const { transactions, isLoading, error } = useBank();
  const normalizedSearch = searchText.trim().toLowerCase();

  const visibleTransactions = transactions
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

  return { transactions: visibleTransactions, isLoading, error };
}
```

Le date sono stringhe ISO `YYYY-MM-DD`, quindi `localeCompare` le ordina correttamente. `filter` crea già un nuovo array, perciò `sort` non modifica lo state originale.

Uso (snippet parziale, funzionerà dopo il collegamento del cap. 07):

```jsx
const { transactions, isLoading, error } = useTransactions({ accountId, filter, searchText });
```

### 3. `useTransferForm`
Il `TransferForm.jsx` di Day 4 contiene state dei valori, errori, messaggio di conferma, validazione e submit. Spostiamo tutta questa logica in `src/hooks/useTransferForm.js`:

```javascript
import { useState } from "react";
import { formatCurrency } from "../utils/formatters";
import { parseAmount, validateTransfer } from "../utils/validators";

const EMPTY_VALUES = { accountId: "", beneficiaryId: "", amount: "", reason: "" };

function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function createTransferTransaction(values, beneficiary) {
  return {
    id: `trx-${Date.now()}`,
    accountId: values.accountId,
    date: todayIso(),
    description: `Bonifico a ${beneficiary.name}`,
    amount: -parseAmount(values.amount),
    category: "Bonifici",
  };
}

export function useTransferForm({ initialAccountId = "", beneficiaries, getAvailableBalance, onSubmit }) {
  const [values, setValues] = useState({ ...EMPTY_VALUES, accountId: initialAccountId });
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState("");

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

    const nextErrors = validateTransfer(values, getAvailableBalance(values.accountId));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setConfirmation("");
      return;
    }

    const transaction = createTransferTransaction(values, selectedBeneficiary);
    onSubmit(transaction);

    setConfirmation(
      `Bonifico SIMULATO di ${formatCurrency(-transaction.amount)} a ${selectedBeneficiary.name} registrato. Nessuna operazione bancaria reale è stata eseguita.`,
    );
    setValues({ ...EMPTY_VALUES, accountId: initialAccountId });
    setErrors({});
  }

  return { values, errors, confirmation, selectedBeneficiary, handleChange, handleSubmit };
}
```

Cosa fa: il form non sa più nulla di come si costruisce un movimento. Il hook gestisce i valori (controlled components, Day 4), cancella l'errore del campo appena lo modifichi, valida, e solo se `errors` è vuoto chiama `onSubmit` con **una transaction nel formato canonico** (`amount` negativo, `category: "Bonifici"`). Chi riceve la transaction (il Context, cap. 07) non deve conoscere il form. `initialAccountId` è facoltativo: se non lo passi il form parte con "Seleziona un conto", come nel Day 4.

### 4. Usare il hook nel form
`src/components/TransferForm.jsx` tiene **tutto il JSX di Day 4 invariato** (select, input, textarea, `FieldError`, contatore caratteri, riga "Saldo disponibile", messaggio di conferma): cambia solo la parte iniziale del componente. Sostituisci imports e inizio con (snippet parziale: dal `return (` in poi il file resta com'era):

```jsx
import { useRef } from "react";
import { useTransferForm } from "../hooks/useTransferForm.js";
import { formatCurrency } from "../utils/formatters.js";
import { REASON_MAX_LENGTH } from "../utils/validators.js";

// FieldError resta com'era

function TransferForm({ accounts, beneficiaries, initialAccountId = "", onSubmitTransfer }) {
  const amountRef = useRef(null);
  function getAvailableBalance(accountId) {
    return accounts.find((account) => account.id === accountId)?.balance ?? 0;
  }

  const { values, errors, confirmation, selectedBeneficiary, handleChange, handleSubmit } =
    useTransferForm({
      initialAccountId,
      beneficiaries,
      getAvailableBalance,
      onSubmit: onSubmitTransfer,
    });

  const selectedAccount = accounts.find((account) => account.id === values.accountId);

  function fieldA11y(name) {
    return {
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `${name}-error` : undefined,
    };
  }

  // return ( <form ...> ...stesso JSX di Day 4... </form> );
}
```

Elimina da `TransferForm.jsx` i vecchi `useState`, `handleChange`, `handleSubmit` e la costante `emptyValues`, e rimuovi gli import che non usi più (`useState`, `parseAmount`, `validateTransfer`). Mantieni `amountRef`, il pulsante e `ref={amountRef}` sull'input introdotti nel [Day 4](../Day_04_Forms_User_Input/07_useRef.md): il focus resta una responsabilità del componente, non del hook di validazione.

> ⚠️ Questo cambia le props di `TransferForm`: `onAddTransfer` (che riceveva i valori del form) diventa `onSubmitTransfer` (che riceve una transaction). Finché `TransferPage`/`App.jsx` non sono aggiornati (cap. 07) il bonifico non aggiunge movimenti. Fai un commit prima di sperimentare, oppure limitati a leggere questo punto e collegalo nel cap. 07.

Per provarlo subito, in `TransferPage.jsx` passa temporaneamente `onSubmitTransfer={(transaction) => console.log(transaction)}` al posto di `onAddTransfer={handleAddTransfer}`: dopo un invio valido la console mostra un oggetto con `id` `trx-...`, `amount` negativo e `category: "Bonifici"`.

---

## 🏦 LipariBank in action
Prima e dopo, sul bonifico:

```text
PRIMA: TransferForm = JSX + state + validazione + costruzione transaction
DOPO:  TransferForm = JSX
       useTransferForm = state + validazione + costruzione transaction
```

Gli hook di LipariBank hanno ruoli diversi:
- `useLocalStorage` è **generico** (non conosce LipariBank) e si riusa ovunque;
- `useTransactions` è un **selettore** sullo state di `useBank`: legge dal Context e deriva i dati da mostrare;
- `useTransferForm` incapsula **un flusso** (il form bonifico).

Non tutto diventa un hook: `searchText` in una pagina resta un `useState` accanto al suo `<input>`.

---

## 🧪 Your Turn
**Obiettivo:** creare un hook generico e riusarlo in due punti.

**Requisiti:**
1. Scrivi `src/hooks/useLocalStorage.js` e usalo in `SettingsContext` per `hideBalance` con chiave `liparibank.hideBalance`.
2. Nella pagina movimenti (`src/pages/TransactionsPage.jsx`) sostituisci `useState("all")` del filtro con lo stesso hook (`useLocalStorage("liparibank.transactionsFilter", "all")`): il filtro scelto (`"all"` | `"income"` | `"expense"`) sopravvive a F5.
3. Se il valore in `localStorage` è corrotto (prova a scrivere `{` nel valore dalle DevTools → Application → Local Storage) l'app deve partire con il valore di default senza errori.
4. Crea `useTransactions.js` e `useTransferForm.js` come mostrato e verifica che `npm run lint` non segnali errori (gli avvisi `only-export-components` dei Context sono attesi).

**Suggerimenti:** il secondo uso dimostra che l'hook non conosce il dominio: stessa funzione, chiavi e tipi di valore diversi.

**Risultato atteso:** dopo F5 restano sia "Nascondi saldi" sia il filtro selezionato.

**Criteri di completamento:** requisiti 1-4 verificati; nessun avviso sulle regole degli Hooks.

---

## ⚠️ Common Mistakes
- **Nome senza `use`** (`transferForm()`): perdi i controlli di lint e rischi violare le regole degli Hooks senza accorgertene.
- **Chiamare un custom hook in un `if`** o dopo un `return` anticipato: stesso errore degli Hooks normali.
- **Aspettarsi state condiviso**: due chiamate a `useLocalStorage` con la stessa chiave non si sincronizzano tra loro nello stesso render tree; per condividere usa il Context.
- **Salvare dati sensibili in `localStorage`**: solo preferenze.
- **Hook con troppi parametri** (otto o più): spesso il confine scelto è sbagliato.
- **Leggere `localStorage` a ogni render**: usa l'initializer function di `useState`, come nel codice sopra.

---

## ✅ Checklist
- ☐ So definire un custom hook e le regole che deve rispettare.
- ☐ So dire cosa condividono due componenti che usano lo stesso custom hook (la logica, non lo state).
- ☐ `hideBalance` sopravvive a F5.
- ☐ `useTransferForm` restituisce una transaction nel formato canonico.
- ☐ So spiegare perché `searchText` non è diventato un custom hook.

---

## 🚀 Challenge
Scrivi `useDebouncedValue(value, delayMs)` che restituisce il valore aggiornato solo dopo `delayMs` millisecondi senza cambiamenti (`useEffect` con `setTimeout` e cleanup con `clearTimeout`). Usalo sul campo di ricerca movimenti. Con soli 8 movimenti serve davvero? Rifletti su cosa cambierebbe con 5.000 righe.

---

## 📌 Recap
- Un custom hook è una funzione `useXxx` che usa altri Hooks per riusare **logica**.
- Ogni chiamata ha il proprio state: per condividerlo serve il Context.
- `useLocalStorage` è generico; `useTransactions` e `useTransferForm` sono specifici di LipariBank.
- Estrai quando la logica si ripete o oscura la UI, non per ogni `useState`.
- In `localStorage` solo preferenze non sensibili.

---

### ➡️ Next
Prossimo capitolo: [04 · Memoization](./04_Memoization.md). Vedremo `useMemo`, `useCallback` e `React.memo` e, soprattutto, quando **non** servono.
