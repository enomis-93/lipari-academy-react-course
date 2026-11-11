# 🏦 LipariBank — React Zero to Hero

> **Extra React Legacy · Capitolo 03**
> **Argomento:** Lifecycle Methods: mounting, updating, unmounting, cleanup e rapporto con `useEffect`
> **Durata stimata:** 50 minuti
> **Parte di LipariBank:** estendiamo `src/legacy/LegacyBalanceWidget.jsx` con timer, lifecycle e cleanup; aggiorniamo `src/legacy/LegacyLab.jsx`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- elencare l'ordine dei lifecycle in fase di mounting, updating e unmounting;
- scrivere `componentDidUpdate(prevProps)` con il confronto che evita loop infiniti;
- fare cleanup (timer, listener, `AbortController`) in `componentWillUnmount`;
- spiegare perché lifecycle e `useEffect` **non** sono sempre in corrispondenza uno-a-uno.

---

## 📋 Prerequisiti
- [Capitolo 02 — Class Components](./02_Class_Components.md): `LegacyBalanceWidget` e `LegacyLab` già creati e montati su `/legacy`.
- `useEffect`, dipendenze e cleanup: [Day 5 cap. 03](../Day_05_Effects_API/03_Dipendenze_e_Cleanup.md).

---

## 🧭 In questo capitolo
- fasi del ciclo di vita e metodi principali;
- `shouldComponentUpdate`, `PureComponent`;
- Error Boundary (`getDerivedStateFromError`, `componentDidCatch`);
- lifecycle deprecati (`UNSAFE_`);
- tabella lifecycle ↔ `useEffect` con i suoi limiti;
- timer con cleanup nel widget.

---

## 🧠 Theory

### Le tre fasi
| Fase | Ordine delle chiamate |
|---|---|
| **Mounting** (il componente nasce) | `constructor` → `render` → `componentDidMount` |
| **Updating** (cambiano props o state) | `render` → `componentDidUpdate(prevProps, prevState)` |
| **Unmounting** (viene rimosso) | `componentWillUnmount` |

- **`componentDidMount`**: eseguito una volta dopo il primo render, quando il DOM esiste. Qui partono fetch, timer, listener, sottoscrizioni.
- **`componentDidUpdate(prevProps, prevState)`**: eseguito dopo ogni aggiornamento (non al primo render). Confronta **sempre** i valori nuovi con `prevProps`/`prevState` prima di agire.
- **`componentWillUnmount`**: ultima chiamata. Qui si fa **cleanup**: `clearInterval`, `removeEventListener`, `controller.abort()`.

> 💡 **Remember**
>
> In `componentDidUpdate`, chiamare `setState` senza una condizione provoca un ciclo infinito (setState → update → `componentDidUpdate` → setState...). Usa sempre il guard `if (prevProps.x !== this.props.x)`.

### Altri metodi che incontrerai
- **`shouldComponentUpdate(nextProps, nextState)`**: restituisce `false` per saltare un render. Ottimizzazione manuale.
- **`PureComponent`**: come `Component` ma con confronto **superficiale** di props e state fatto da React; è l'antenato di `React.memo`.
- **`getDerivedStateFromProps`** e **`getSnapshotBeforeUpdate`**: rari; se li vedi, leggili con attenzione ma non copiarli come modello.
- **`getDerivedStateFromError`** e **`componentDidCatch`**: gli **Error Boundaries**.

### Error Boundary (ancora solo classe)
Snippet di riferimento (lo riprenderemo nel Day 7, non serve crearlo ora):

```jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Errore catturato:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <p>Qualcosa è andato storto.</p>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

Un Error Boundary cattura errori di **rendering** dei figli; non quelli degli event handler o del codice asincrono. Per ora non esiste un Hook equivalente.

### Lifecycle deprecati
`componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate` sono stati rinominati in `UNSAFE_componentWillMount`, ecc. (React 16.3) perché sono problematici con il rendering moderno. In React 16.9+ i vecchi nomi producono warning in console; `StrictMode` segnala anche gli `UNSAFE_`. Verificato con React 19: i vecchi nomi **vengono ancora eseguiti** (con warning), ma sono deprecati e non vanno usati. Non usarli in codice nuovo. Sostituzioni tipiche:

| Vecchio | Oggi |
|---|---|
| `componentWillMount` (setup, fetch) | `constructor` (solo stato iniziale) o `componentDidMount` |
| `componentWillReceiveProps(nextProps)` | `componentDidUpdate(prevProps)` con confronto |
| `componentWillUpdate` | `getSnapshotBeforeUpdate` o `componentDidUpdate` |

### Lifecycle ↔ `useEffect`: il rapporto reale
| Class Component | Function Component |
|---|---|
| `componentDidMount` | `useEffect(() => {...}, [])` |
| `componentDidUpdate` con guard su `prevProps.x` | `useEffect(() => {...}, [x])` |
| `componentWillUnmount` | funzione di cleanup restituita dall'effect |

Questa tabella è un **punto di partenza**, non un'equivalenza perfetta. Differenze importanti:

1. **`useEffect` descrive una sincronizzazione**, non un momento della vita. Dice: "questo effetto deve restare coerente con queste dipendenze".
2. L'effect con dipendenze `[x]` **gira anche al mount**; `componentDidUpdate` no.
3. Il **cleanup gira prima di ogni nuova esecuzione** dell'effect, non solo all'unmount.
4. `componentDidMount` e `componentDidUpdate` spesso contenevano **la stessa logica duplicata** (es. fetch): un solo effect con le dipendenze giuste la unifica.
5. Un'unica classe mescola logiche non correlate nello stesso lifecycle; con gli Hooks puoi avere **più effect**, uno per scopo.
6. Alcuni lifecycle (`getSnapshotBeforeUpdate`, `componentDidCatch`, `getDerivedStateFromError`) **non hanno Hook equivalente**.

In sviluppo con `StrictMode`, React può montare, smontare e rimontare un componente per verificare il cleanup: vedrai quindi `componentDidMount` → `componentWillUnmount` → `componentDidMount`. È voluto e vale anche per le classi.

---

## 💻 Let's Code

### 1. Widget con timer e lifecycle
Sostituisci il contenuto di `src/legacy/LegacyBalanceWidget.jsx`:

```jsx
import { Component } from "react";
import { formatCurrency } from "../utils/formatters";

class LegacyBalanceWidget extends Component {
  static defaultProps = {
    title: "Saldo (legacy)",
  };

  constructor(props) {
    super(props);
    this.state = { hidden: false, secondsSinceRefresh: 0 };
    this.timerId = null;
    this.toggleHidden = this.toggleHidden.bind(this);
  }

  componentDidMount() {
    console.log("[LegacyBalanceWidget] componentDidMount");
    this.timerId = setInterval(() => {
      this.setState((prevState) => ({
        secondsSinceRefresh: prevState.secondsSinceRefresh + 1,
      }));
    }, 1000);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.accountId !== this.props.accountId) {
      console.log("[LegacyBalanceWidget] accountId cambiato");
      this.setState({ secondsSinceRefresh: 0 });
    }
  }

  componentWillUnmount() {
    console.log("[LegacyBalanceWidget] componentWillUnmount");
    clearInterval(this.timerId);
  }

  toggleHidden() {
    this.setState((prevState) => ({ hidden: !prevState.hidden }));
  }

  handleRefresh = () => {
    this.setState({ secondsSinceRefresh: 0 });
  };

  render() {
    const { accounts, accountId, title } = this.props;
    const account = accounts.find((item) => item.id === accountId);

    if (!account) {
      return <p>Conto non trovato.</p>;
    }

    return (
      <section>
        <h2>{title}</h2>
        <p>{account.name}</p>
        <p>{this.state.hidden ? "••••••" : formatCurrency(account.balance)}</p>
        <p>Aggiornato {this.state.secondsSinceRefresh} secondi fa</p>
        <button type="button" onClick={this.toggleHidden}>
          {this.state.hidden ? "Mostra saldo" : "Nascondi saldo"}
        </button>
        <button type="button" onClick={this.handleRefresh}>
          Aggiorna
        </button>
      </section>
    );
  }
}

export default LegacyBalanceWidget;
```

Cosa fa: un contatore "Aggiornato N secondi fa" avanza ogni secondo. L'intervallo nasce in `componentDidMount`, viene azzerato in `componentDidUpdate` solo se cambia `accountId` (guard!), e viene fermato in `componentWillUnmount`. Nota i due stili di handler: `toggleHidden` con `bind`, `handleRefresh` con arrow function class field. `npm run lint` (oxlint) segnala un **avviso** (`no-did-update-set-state`) sul `setState` in `componentDidUpdate`: è un avviso, non un errore, e qui il guard lo rende sicuro.

### 2. `LegacyLab` con mount/unmount
Sostituisci `src/legacy/LegacyLab.jsx`:

```jsx
import { useState } from "react";
import { accounts } from "../data/mockData";
import LegacyBalanceWidget from "./LegacyBalanceWidget";

function LegacyLab() {
  const [accountId, setAccountId] = useState("acc-001");
  const [showWidget, setShowWidget] = useState(true);

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
      <button type="button" onClick={() => setShowWidget((prev) => !prev)}>
        {showWidget ? "Smonta widget" : "Monta widget"}
      </button>
      {showWidget && (
        <LegacyBalanceWidget accounts={accounts} accountId={accountId} />
      )}
    </main>
  );
}

export default LegacyLab;
```

### 3. Osserva i lifecycle
Con `npm run dev` (dentro `liparibank/`) apri `http://localhost:5173/legacy` e la console del browser:
1. Al caricamento: `componentDidMount`; in dev con `StrictMode` puoi vedere `didMount → willUnmount → didMount`.
2. Cambia conto: compare "accountId cambiato" e il contatore riparte da 0.
3. Clicca "Smonta widget": compare `componentWillUnmount` e il timer si ferma.

### 4. L'equivalente moderno (solo la parte timer)
```jsx
useEffect(() => {
  const timerId = setInterval(() => {
    setSecondsSinceRefresh((prev) => prev + 1);
  }, 1000);

  return () => clearInterval(timerId);
}, []);
```

Qui il `return` è il cleanup. Il reset al cambio di `accountId` diventerebbe un secondo effect con `[accountId]` (lo fai nel [capitolo 05](./05_Class_vs_Function_Components.md)).

---

## 🏦 LipariBank in action
Un widget che mostra "aggiornato N secondi fa" o fa auto-refresh dei movimenti è un classico dei vecchi dashboard bancari. Il rischio tipico in manutenzione: un timer senza cleanup continua a girare dopo che l'utente cambia pagina (con React Router, ogni cambio di route smonta i componenti). Nel Day 5 hai già gestito lo stesso problema con `AbortController`; in una classe lo stesso lavoro si fa in `componentWillUnmount`.

---

## 🧪 Your Turn
**Obiettivo:** prevedere e verificare l'ordine dei lifecycle.

**Requisiti:**
1. Prima di eseguire, scrivi su carta l'ordine dei log atteso per: caricamento pagina, cambio conto, "Smonta widget", "Monta widget".
2. Verifica in console e correggi le tue previsioni.
3. Prova a **commentare temporaneamente** `clearInterval(this.timerId)`, aggiungi un `console.log("tick")` dentro il callback dell'interval, smonta il widget e osserva che i "tick" continuano. Poi ripristina il cleanup.

**Risultato atteso:** capisci che senza cleanup il timer sopravvive al componente.

**Criteri di completamento:** il codice finale ha di nuovo `clearInterval` e nessun `console.log("tick")`.

---

## ⚠️ Common Mistakes
- **`setState` in `componentDidUpdate` senza guard:** loop infinito.
- **Dimenticare il cleanup:** timer e listener restano attivi.
- **Fare `setState` nel `constructor`:** nel constructor si assegna `this.state = ...`.
- **Pensare che `useEffect` con `[]` sia "uguale" a `componentDidMount`:** è una sincronizzazione senza dipendenze; la differenza emerge con StrictMode e quando si aggiungono dipendenze.
- **Usare `componentWillMount` / `componentWillReceiveProps`:** deprecati.

---

## ✅ Checklist
- ☐ So l'ordine dei lifecycle in mounting, updating, unmounting.
- ☐ So scrivere `componentDidUpdate(prevProps)` con guard.
- ☐ So fare cleanup in `componentWillUnmount`.
- ☐ So elencare le differenze tra lifecycle e `useEffect`.
- ☐ So perché gli Error Boundary sono ancora classi.

---

## 🚀 Challenge
Nel widget aggiungi un listener `window.addEventListener("keydown", ...)` in `componentDidMount` che nasconde il saldo premendo `Escape`, e rimuovilo correttamente in `componentWillUnmount` (serve un riferimento stabile alla funzione: usa una arrow function class field).

---

## 📌 Recap
- Mount: `constructor → render → componentDidMount`; update: `render → componentDidUpdate`; unmount: `componentWillUnmount`.
- In `componentDidUpdate` si confronta sempre con `prevProps`/`prevState`.
- Cleanup di timer, listener e fetch in `componentWillUnmount`.
- `useEffect` sincronizza con le dipendenze; non è un clone dei lifecycle.

---

### ➡️ Next
Prossimo capitolo: [04 — State, Props e setState](./04_State_Props_setState.md). Approfondiamo la natura asincrona e il merge di `setState`.
