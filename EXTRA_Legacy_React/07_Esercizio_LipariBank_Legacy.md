# 🏦 LipariBank — React Zero to Hero

> **Extra React Legacy · Capitolo 07**
> **Argomento:** Esercizio LipariBank Legacy: leggere, modificare in stile class e migrare `LegacyTransactionsPanel`
> **Durata stimata:** 90 minuti
> **Parte di LipariBank:** `src/legacy/LegacyTransactionsPanel.jsx`, `src/legacy/TransactionsPanelModern.jsx`, banco di prova `src/legacy/LegacyLab.jsx` (montato temporaneamente)

---

## 🎯 Obiettivo
Alla fine dell'esercizio sarai in grado di:
- leggere e annotare il flusso dei lifecycle di un Class Component con fetch e cleanup;
- aggiungere una feature (filtro entrate/uscite) in stile class con `setState`;
- elencare le API deprecate/rimosse e la loro sostituzione;
- migrare il modulo a Function Component + Hooks e verificare l'equivalenza del comportamento.

---

## 📋 Prerequisiti
- Capitoli [01](./01_React_Moderno_vs_Legacy.md)–[06](./06_Leggere_e_Manutenere_Codice_Legacy.md) di questo giorno.
- Day 5 completato: `public/data/transactions.json` e `src/services/transactionService.js` con `getTransactions({ signal })` (restituisce una Promise con l'array dei movimenti; se la tua versione è diversa, adatta la chiamata).
- Progetto `liparibank/` funzionante, `src/utils/formatters.js` e `src/data/mockData.js` presenti, routing Day 6.
- Dal capitolo 02 hai `src/legacy/LegacyLab.jsx` (se non c'è più, ricrealo dal passo 2).

> 💡 **Remember**
>
> **Regola del corso:** i nuovi sviluppi si scrivono con Function Components + Hooks. Qui la classe serve per capire e manutenere codice ereditato; la modifica in stile class (task 2) è un'eccezione didattica.

---

## 🧭 In questo capitolo
- il modulo legacy "come arrivava dal vecchio progetto" (solo lettura);
- la versione eseguibile su React 19 da creare in `src/legacy/`;
- montaggio temporaneo e rimozione;
- cinque task: annotare, estendere, elencare le API, migrare, verificare.

---

## 🧠 Theory

### Come arriva il modulo
Il modulo originale è stato scritto per React 16/17. Qui sotto lo vedi **così com'era**. È uno snippet di sola lettura: **NON eseguibile su React 19**, non va creato come file (usa `prop-types`, che il progetto non installa, e API rimosse).

```jsx
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { getTransactions } from "../services/transactionService";

class LegacyTransactionsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { transactions: [], isLoading: true, error: null };
    this.handleReload = this.handleReload.bind(this);
  }

  componentWillMount() {
    document.title = "LipariBank - Movimenti";
  }

  componentDidMount() {
    this.loadTransactions();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountId !== this.props.accountId) {
      this.loadTransactions();
    }
  }

  handleReload() {
    ReactDOM.findDOMNode(this).scrollIntoView();
    this.loadTransactions();
  }

  render() {
    return (
      <section ref="panel">
        <h2>{this.props.title}</h2>
        <button type="button" onClick={this.handleReload}>Ricarica</button>
        {/* ... elenco movimenti ... */}
      </section>
    );
  }
}

LegacyTransactionsPanel.propTypes = {
  accountId: PropTypes.string,
  title: PropTypes.string,
};

LegacyTransactionsPanel.defaultProps = {
  accountId: "acc-001",
  title: "Movimenti (legacy)",
};

ReactDOM.render(<LegacyTransactionsPanel />, document.getElementById("root"));
```

Il modulo che creerai sotto è lo stesso componente, già **adattato per girare su React 19** (rimosse le API non più supportate) ma con lo **stile legacy che resta**: constructor con `bind`, `static defaultProps`, lifecycle di classe e `setState` con merge.

---

## 💻 Let's Code

### 1. Il modulo eseguibile
Crea `src/legacy/LegacyTransactionsPanel.jsx`:

```jsx
import { Component } from "react";
import { getTransactions } from "../services/transactionService";
import { formatCurrency, formatDate } from "../utils/formatters";

class LegacyTransactionsPanel extends Component {
  static defaultProps = {
    accountId: "acc-001",
    title: "Movimenti (legacy)",
  };

  constructor(props) {
    super(props);
    this.state = { transactions: [], isLoading: true, error: null };
    this.controller = null;
    this.previousTitle = "";
    this.handleReload = this.handleReload.bind(this);
  }

  componentDidMount() {
    this.previousTitle = document.title;
    document.title = "LipariBank - Movimenti (legacy)";
    this.loadTransactions();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.accountId !== this.props.accountId) {
      this.loadTransactions();
    }
  }

  componentWillUnmount() {
    document.title = this.previousTitle;
    if (this.controller) {
      this.controller.abort();
    }
  }

  loadTransactions() {
    if (this.controller) {
      this.controller.abort();
    }
    this.controller = new AbortController();
    const { signal } = this.controller;

    this.setState({ isLoading: true, error: null });

    getTransactions({ signal })
      .then((transactions) => {
        if (signal.aborted) {
          return;
        }
        this.setState({ transactions, isLoading: false });
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }
        this.setState({ error: error.message, isLoading: false });
      });
  }

  handleReload() {
    this.loadTransactions();
  }

  render() {
    const { accountId, title } = this.props;
    const { transactions, isLoading, error } = this.state;

    const visible = transactions
      .filter((transaction) => transaction.accountId === accountId)
      .sort((a, b) => b.date.localeCompare(a.date));

    return (
      <section>
        <h2>{title}</h2>
        <p>Conto: {accountId}</p>
        <button type="button" onClick={this.handleReload}>
          Ricarica
        </button>
        {isLoading && <p>Caricamento in corso...</p>}
        {error && <p role="alert">Errore: {error}</p>}
        {!isLoading && !error && visible.length === 0 && <p>Nessun movimento.</p>}
        <ul>
          {visible.map((transaction) => (
            <li key={transaction.id}>
              {formatDate(transaction.date)} — {transaction.description}:{" "}
              {formatCurrency(transaction.amount)}
            </li>
          ))}
        </ul>
      </section>
    );
  }
}

export default LegacyTransactionsPanel;
```

Il ricaricamento al cambio di `accountId` simula un endpoint per conto; il file JSON contiene tutti i conti, perciò si filtra nel `render()`.

### 2. Il banco di prova e il montaggio temporaneo
Sostituisci `src/legacy/LegacyLab.jsx` con:

```jsx
import { useState } from "react";
import { accounts } from "../data/mockData";
import LegacyTransactionsPanel from "./LegacyTransactionsPanel";

function LegacyLab() {
  const [accountId, setAccountId] = useState("acc-001");
  const [visible, setVisible] = useState(true);

  return (
    <main>
      <h1>Legacy Lab</h1>
      <label htmlFor="lab-account">Conto: </label>
      <select
        id="lab-account"
        value={accountId}
        onChange={(event) => setAccountId(event.target.value)}
      >
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>
      <button type="button" onClick={() => setVisible((prev) => !prev)}>
        {visible ? "Smonta pannello" : "Monta pannello"}
      </button>
      {visible && <LegacyTransactionsPanel accountId={accountId} />}
    </main>
  );
}

export default LegacyLab;
```

Se in `src/App.jsx` non hai più l'import e la route del capitolo 02, riaggiungili (snippet parziali; la `<Route>` va dentro `<Routes>`, **fuori** dal layout route, come sorella di `<Route element={<AppLayout />}>`):

```jsx
import LegacyLab from "./legacy/LegacyLab";
```

```jsx
<Route path="/legacy" element={<LegacyLab />} />
```

Avvia dentro `liparibank/`:

```bash
npm run dev
```

Apri `http://localhost:5173/legacy`: vedi i movimenti di "Conto Corrente". Cambiando conto, la lista cambia.

**Alla fine dell'esercizio** togli l'`import` e la `<Route>` da `App.jsx`: l'app torna esattamente com'era. La cartella `src/legacy/` può restare (non è importata da nessuna parte) oppure essere eliminata.

---

## 🏦 LipariBank in action
Il pannello è una "lista movimenti" tipica di un vecchio home banking: fetch al mount, ricarica al cambio conto, cleanup all'unmount. Il resto di LipariBank (dashboard, conti, bonifico, routing) **non viene toccato**: il modulo legacy vive isolato in `src/legacy/`, come in una vera codebase dove una parte vecchia convive con il nuovo.

---

## 🧪 Your Turn

### Task 1 — Leggere e annotare il flusso
Compila, in un tuo file di appunti (fuori da `src/`), l'ordine di chiamata per questi scenari, indicando anche **cosa viene eseguito** in ogni metodo:
1. Caricamento della pagina `/legacy`.
2. Cambio conto da `acc-001` a `acc-002`.
3. Click su "Ricarica".
4. Click su "Smonta pannello".

Aggiungi temporaneamente un `console.log` in ogni lifecycle per verificare, poi rimuovili. In sviluppo con `StrictMode` puoi vedere un mount ripetuto (mount → unmount → mount): spiega perché il codice resta corretto (hint: `abort()` e ripristino del titolo).

### Task 2 — Aggiungere una feature in stile class
**Requisito:** tre pulsanti "Tutti", "Entrate", "Uscite" che filtrano l'elenco (entrata: `amount > 0`, uscita: `amount < 0`), con lo stato `filter` in `this.state` (valore iniziale `"all"`). Il pulsante attivo deve avere `aria-pressed="true"`. Se il filtro non produce risultati mostra "Nessun movimento.".

**Suggerimenti:** aggiungi `filter: "all"` allo state; un handler `handleFilterChange` (class field arrow function) che chiama `this.setState({ filter })`; nel `render()` applica un secondo `.filter(...)` prima del `sort`.

### Task 3 — Elencare le API deprecate/rimosse
Confronta lo snippet originale (sezione Theory) con il file eseguibile e compila una tabella: **API → stato in React 19 → sostituzione**. Trova almeno 7 voci.

### Task 4 — Migrare a Function Component + Hooks
Crea `src/legacy/TransactionsPanelModern.jsx` con lo stesso comportamento (inclusi il filtro del task 2, il cleanup con `AbortController` e il ripristino del `document.title`). Usa `useState` e `useEffect`; niente `this`, niente classi.

### Task 5 — Verificare l'equivalenza
In `LegacyLab` aggiungi la possibilità di scegliere `legacy` o `moderno` con lo stesso `accountId`, e verifica la tabella sotto con entrambe le varianti.

| Scenario | Risultato atteso (identico nelle due varianti) |
|---|---|
| Primo caricamento | "Caricamento in corso..." poi i movimenti del conto |
| Cambio conto | Nuova richiesta di rete e lista del nuovo conto |
| "Ricarica" | Nuova richiesta di rete (scheda Network degli strumenti del browser) |
| Filtri Entrate/Uscite | Solo importi positivi / negativi |
| Rete offline (DevTools → Network → Offline) + "Ricarica" | Messaggio di errore, nessun crash |
| "Smonta pannello" | Nessuna richiesta pendente, `document.title` ripristinato |

**Criteri di completamento:** il filtro funziona in entrambe le varianti; hai almeno 7 API nella tabella; la versione moderna passa tutti gli scenari; hai rimosso import e route da `App.jsx`.

---

> ⚠️ **Prova prima da solo.** Le soluzioni qui sotto sono di riferimento: leggile solo dopo aver tentato i task.

### Soluzione di riferimento

**Task 1 (flusso atteso)**
1. Caricamento: `constructor` → `render` → `componentDidMount` (salva e imposta il titolo, avvia `loadTransactions`: `setState` → nuovo `render` → al termine della richiesta `setState` → `render`).
2. Cambio conto: `render` (nuove props) → `componentDidUpdate` con guard `prevProps.accountId !== this.props.accountId` → `loadTransactions`.
3. "Ricarica": `handleReload` → `loadTransactions` → `setState` → `render`; `componentDidUpdate` parte ma il guard lo ignora.
4. Smonta: `componentWillUnmount` (ripristina titolo, `abort()` della richiesta).

**Task 2 (parti chiave in stile class)**

```jsx
const FILTERS = [
  { value: "all", label: "Tutti" },
  { value: "income", label: "Entrate" },
  { value: "expense", label: "Uscite" },
];
```

Posizione: fuori dalla classe, sotto gli `import`. Nel constructor: `this.state = { transactions: [], isLoading: true, error: null, filter: "all" };`. Nella classe:

```jsx
handleFilterChange = (filter) => {
  this.setState({ filter });
};
```

Nel `render()`:

```jsx
const { transactions, isLoading, error, filter } = this.state;

const visible = transactions
  .filter((transaction) => transaction.accountId === accountId)
  .filter((transaction) => {
    if (filter === "income") return transaction.amount > 0;
    if (filter === "expense") return transaction.amount < 0;
    return true;
  })
  .sort((a, b) => b.date.localeCompare(a.date));
```

e, prima della lista:

```jsx
<div>
  {FILTERS.map((item) => (
    <button
      key={item.value}
      type="button"
      aria-pressed={filter === item.value}
      onClick={() => this.handleFilterChange(item.value)}
    >
      {item.label}
    </button>
  ))}
</div>
```

`setState({ filter })` fa il merge: `transactions`, `isLoading` e `error` restano intatti.

**Task 3 (API deprecate/rimosse)**

| API nello snippet originale | Stato in React 19 | Sostituzione |
|---|---|---|
| `import React from "react"` | non necessario dal nuovo JSX transform (React 17) | rimuovere / import nominali |
| `ReactDOM.render` | rimosso | `createRoot(...).render(...)` |
| `componentWillMount` | deprecato (futuro: solo `UNSAFE_`) | `componentDidMount` (+ cleanup) |
| `componentWillReceiveProps` | deprecato | `componentDidUpdate(prevProps)` con guard |
| `ref="panel"` (string ref) | rimosso | `createRef` / `useRef` |
| `ReactDOM.findDOMNode` | rimosso | `ref` sull'elemento |
| `PropTypes` / `propTypes` | controlli ignorati; pacchetto `prop-types` non installato | rimuovere o documentare le props |
| `defaultProps` su classe | ancora supportato | `static defaultProps` (ok) o default in destructuring |
| `defaultProps` su funzione | rimosso | parametri di default |

Resta nel file eseguibile, come stile (non deprecato): `bind` nel constructor e `static defaultProps`.

**Task 4 (versione Hooks completa)**

```jsx
import { useEffect, useState } from "react";
import { getTransactions } from "../services/transactionService";
import { formatCurrency, formatDate } from "../utils/formatters";

const FILTERS = [
  { value: "all", label: "Tutti" },
  { value: "income", label: "Entrate" },
  { value: "expense", label: "Uscite" },
];

function TransactionsPanelModern({
  accountId = "acc-001",
  title = "Movimenti (moderno)",
}) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "LipariBank - Movimenti (moderno)";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    getTransactions({ signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) {
          return;
        }
        setTransactions(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          return;
        }
        setError(err.message);
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [accountId, reloadCount]);

  const visible = transactions
    .filter((transaction) => transaction.accountId === accountId)
    .filter((transaction) => {
      if (filter === "income") return transaction.amount > 0;
      if (filter === "expense") return transaction.amount < 0;
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section>
      <h2>{title}</h2>
      <p>Conto: {accountId}</p>
      <button type="button" onClick={() => setReloadCount((prev) => prev + 1)}>
        Ricarica
      </button>
      <div>
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {isLoading && <p>Caricamento in corso...</p>}
      {error && <p role="alert">Errore: {error}</p>}
      {!isLoading && !error && visible.length === 0 && <p>Nessun movimento.</p>}
      <ul>
        {visible.map((transaction) => (
          <li key={transaction.id}>
            {formatDate(transaction.date)} — {transaction.description}:{" "}
            {formatCurrency(transaction.amount)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TransactionsPanelModern;
```

Come si legge la traduzione:
- `componentDidMount` + `componentWillUnmount` per il titolo → un effect con `[]` e cleanup;
- fetch + `componentDidUpdate` sul guard `accountId` → **un solo** effect con `[accountId, reloadCount]`, il cui cleanup annulla la richiesta precedente prima di ogni nuova;
- `handleReload` incrementa `reloadCount`, un trucco comune per rilanciare un effect;
- `defaultProps` → parametri di default; il merge di `setState` → quattro `useState` separati.

`npm run lint` può mostrare un **avviso** `set-state-in-effect` per `setIsLoading(true)` / `setError(null)` all'inizio dell'effect: non è un errore (il lint passa) e in un file legacy didattico lo accettiamo; nel Day 7 vedrai come spostare questa logica in un hook/reducer.

**Task 5 (aggiunte a `LegacyLab`, snippet parziali)**
Importa `TransactionsPanelModern`, aggiungi lo state `variant` (`useState("legacy")`) con una `<select>` a due opzioni (`legacy`, `moderno`) e rendi il pannello con:

```jsx
{visible && variant === "legacy" && <LegacyTransactionsPanel accountId={accountId} />}
{visible && variant === "moderno" && <TransactionsPanelModern accountId={accountId} />}
```

Si mostra una variante per volta perché entrambe impostano `document.title`.

---

## ⚠️ Common Mistakes
- **`setState` in `componentDidUpdate` senza guard:** loop infinito.
- **Dimenticare `abort()` nel cleanup:** richieste che aggiornano un componente già smontato.
- **Dimenticare di rimuovere import e route di prova da `App.jsx`.**
- **Nell'effect, dimenticare dipendenze o cleanup:** la richiesta non riparte al cambio di conto o resta pendente.
- **Copiare lo snippet "originale" nel progetto:** usa `ReactDOM.render` e `prop-types`, non funziona su React 19.

---

## ✅ Checklist
- ☐ Ho annotato i lifecycle per i quattro scenari.
- ☐ Il filtro Tutti/Entrate/Uscite funziona nella versione class.
- ☐ Ho compilato la tabella delle API deprecate/rimosse (≥ 7 voci).
- ☐ `TransactionsPanelModern` non usa `this` né classi.
- ☐ Ho verificato l'equivalenza in tutti gli scenari della tabella.
- ☐ Ho rimosso import e route di `LegacyLab` da `App.jsx` e l'app funziona come prima.

---

## 🚀 Challenge
Aggiungi in **entrambe** le versioni un auto-refresh ogni 30 secondi che richiama il caricamento. Nella classe: `setInterval` in `componentDidMount` e `clearInterval` in `componentWillUnmount`; nella funzione: un effect con interval e cleanup che incrementa `reloadCount`. Per provare senza attendere, usa temporaneamente 5 secondi.

---

## 📌 Recap
- Hai letto un modulo legacy: lifecycle, side effect, cleanup, API deprecate.
- Hai esteso una classe con `setState` (merge) senza mutare lo state.
- Hai migrato a Function Component: più `useState`, effect con dipendenze e cleanup.
- Hai verificato l'equivalenza con una tabella di scenari invece di fidarti "a occhio".

---

### ➡️ Next
Prossimo capitolo (Day 7): [Context e useContext](../Day_07_Shared_State_Redux/01_Context_e_useContext.md). Il prop drilling emerso nel Day 6 trova una risposta; riincontrerai la classe nell'Error Boundary.
