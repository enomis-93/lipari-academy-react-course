# 🏦 LipariBank — React Zero to Hero

> **Extra React Legacy · Capitolo 05**
> **Argomento:** Class Components vs Function Components: confronto e mappa di migrazione
> **Durata stimata:** 45 minuti
> **Parte di LipariBank:** nuovo file `src/legacy/BalanceWidgetModern.jsx` (versione Hooks di `LegacyBalanceWidget`), affiancato al legacy in `LegacyLab`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- confrontare una classe e la sua versione Function Component punto per punto;
- tradurre `this.state`, `this.props`, handler e lifecycle in `useState`, props e `useEffect`;
- riconoscere le differenze di comportamento (non solo di sintassi);
- sapere cosa **non** ha un equivalente diretto negli Hooks.

---

## 📋 Prerequisiti
- [Capitolo 03](./03_Lifecycle_Methods.md) e [Capitolo 04](./04_State_Props_setState.md).
- `src/legacy/LegacyBalanceWidget.jsx` (versione con timer) e `src/legacy/LegacyLab.jsx` funzionanti su `/legacy`.

---

## 🧭 In questo capitolo
- tabella di traduzione classe → funzione;
- differenze reali (closure vs `this`, merge, timing degli effect);
- pattern legacy di riuso (HOC, render props) vs custom hooks;
- migrazione della parte stato del widget;
- esercizio: migrare anche timer e lifecycle.

---

## 🧠 Theory

### Tabella di traduzione
| Class Component | Function Component |
|---|---|
| `class X extends Component` | `function X(props)` |
| `this.props.title` | `props.title` o destructuring `{ title }` |
| `static defaultProps = {...}` | parametri di default `{ title = "..." }` |
| `this.state = {...}` + `this.setState` | uno o più `useState` |
| `setState(prev => ...)` | `setX(prev => ...)` |
| `bind` / arrow field per gli handler | funzioni dichiarate nel componente, nessun `bind` |
| `componentDidMount` | `useEffect(..., [])` |
| `componentDidUpdate` con guard su `prevProps` | `useEffect(..., [dipendenze])` |
| `componentWillUnmount` | cleanup restituito dall'effect |
| `this.timerId`, `this.controller` (campi istanza) | `useRef` oppure variabili locali dell'effect |
| `PureComponent` / `shouldComponentUpdate` | `React.memo` (Day 8) |
| `createRef()` + `this.inputRef` | `useRef()` |
| `static contextType` | `useContext` (Day 7) |
| HOC e render props | custom hooks (Day 8) |

### Differenze di comportamento
1. **`this` vs closure.** In una classe `this.props` punta sempre alle props **più recenti**; in una funzione ogni render "cattura" le proprie props e state. Un callback asincrono scritto in una classe legge il valore attuale al momento dell'esecuzione, in una funzione il valore del render in cui è stato creato. Di solito è un vantaggio (più prevedibile), ma va saputo quando migri codice.
2. **Merge vs sostituzione** dello state ([capitolo 04](./04_State_Props_setState.md)).
3. **Timing degli effect.** `componentDidMount` / `componentDidUpdate` e `useEffect` non hanno lo stesso momento di esecuzione in ogni dettaglio; `useEffect` gira dopo che il browser ha fatto il paint (per default) e il suo cleanup precede **ogni** nuova esecuzione.
4. **Effect con dipendenze gira anche al mount**, `componentDidUpdate` no.
5. **Logica separata per scopo:** gli Hooks permettono più `useEffect` (timer, listener, fetch), mentre la classe distribuisce ogni logica tra tre lifecycle.

### Cosa non ha equivalente
- **Error Boundaries** (`getDerivedStateFromError`, `componentDidCatch`): ancora solo classi.
- **`getSnapshotBeforeUpdate`**: nessun Hook equivalente diretto.
- In migrazioni vere puoi usare una libreria che offre un Error Boundary già pronto, ma il corso usa una classe (Day 8).

### Riuso della logica: HOC / render props → custom hooks
Nel legacy la logica condivisa passa da **HOC** (`withX(Component)`) o **render props** (`<Fetcher render={data => ...} />`). Con gli Hooks la stessa logica diventa una funzione `useX()` che chiami nel componente: meno annidamenti. Dettagli nel [capitolo 06](./06_Leggere_e_Manutenere_Codice_Legacy.md) e nel Day 7.

> 💡 **Remember**
>
> Migrare non è tradurre riga per riga: è capire **che cosa** il componente sincronizza (con quali dati) e riscrivere quella intenzione con gli Hooks.

---

## 💻 Let's Code

### 1. Il widget (versione base) in stile moderno
Crea `src/legacy/BalanceWidgetModern.jsx` (dentro `liparibank/`):

```jsx title="src/legacy/BalanceWidgetModern.jsx"
import { useState } from "react";
import { formatCurrency } from "../utils/formatters.js";

function BalanceWidgetModern({ accounts, accountId, title = "Saldo (moderno)" }) {
  const [hidden, setHidden] = useState(false);

  const account = accounts.find((item) => item.id === accountId);

  if (!account) {
    return <p>Conto non trovato.</p>;
  }

  return (
    <section>
      <h2>{title}</h2>
      <p>{account.name}</p>
      <p>{hidden ? "••••••" : formatCurrency(account.balance)}</p>
      <button type="button" onClick={() => setHidden((prevHidden) => !prevHidden)}>
        {hidden ? "Mostra saldo" : "Nascondi saldo"}
      </button>
    </section>
  );
}

export default BalanceWidgetModern;
```

Cosa cambia rispetto alla classe: niente `constructor`, `super`, `bind`, `this`; `defaultProps` diventa un parametro di default; lo stato è `useState`. Lo `useState` è chiamato **prima** del return anticipato: gli Hooks non possono essere condizionali.

### 2. Affiancali in `LegacyLab`
In `src/legacy/LegacyLab.jsx` aggiungi l'import:

```jsx title="src/legacy/LegacyLab.jsx"
import BalanceWidgetModern from "./BalanceWidgetModern.jsx";
```

e, subito dopo il widget legacy, la riga (snippet parziale; `accounts` e `accountId` sono già disponibili in `LegacyLab`):

```jsx
<BalanceWidgetModern accounts={accounts} accountId={accountId} />
```

Apri `/legacy` (con `npm run dev` attivo): cambiando conto, entrambi i widget mostrano lo stesso saldo; i pulsanti "Nascondi saldo" sono indipendenti perché ciascuno ha il proprio state.

### 3. Da non dimenticare: `defaultProps` e function components
`Component.defaultProps = {...}` su una **funzione** non è più supportato in React 19: usa i parametri di default, come fatto sopra. Sulle classi `static defaultProps` continua a funzionare.

### 4. Esempio di differenza closure vs `this`
Snippet di confronto (parziali, non eseguibili da soli):

```jsx
showLater() {
  setTimeout(() => {
    console.log("Conto:", this.props.accountId);
  }, 3000);
}
```

```jsx
function showLater() {
  setTimeout(() => {
    console.log("Conto:", accountId);
  }, 3000);
}
```

Se dopo il click cambi conto entro 3 secondi, la classe stampa il **nuovo** `accountId` (legge `this.props` al momento dell'esecuzione); la funzione stampa quello del render in cui è nato il callback.

---

## 🏦 LipariBank in action
`BalanceWidgetModern` è la stessa feature del Day 3 (`hideBalance`) ma con la forma che userai nel resto del corso. Nella migrazione di un modulo reale, il primo passo è proprio questo: copiare **cosa mostra** e **quali eventi gestisce** prima di toccare i lifecycle, che richiedono più attenzione.

---

## 🧪 Your Turn
**Obiettivo:** migrare anche timer e lifecycle di `LegacyBalanceWidget` in `BalanceWidgetModern`.

**Requisiti:**
1. Aggiungi lo state `secondsSinceRefresh` e mostra "Aggiornato N secondi fa".
2. Un contatore ogni secondo, con **cleanup** all'unmount.
3. Il contatore riparte da 0 quando cambia `accountId`.
4. Un pulsante "Aggiorna" azzera il contatore.
5. In `/legacy`, confronta i due widget: stesso comportamento. Per provare lo smontaggio avvolgi anche `BalanceWidgetModern` nella condizione `showWidget` di `LegacyLab`.

**Passi suggeriti:**
- Importa `useEffect` insieme a `useState` da `"react"`.
- Interval con `useEffect(..., [])`:

```jsx
useEffect(() => {
  const timerId = setInterval(() => {
    setSecondsSinceRefresh((prev) => prev + 1);
  }, 1000);

  return () => clearInterval(timerId);
}, []);
```

- Per il reset al cambio di `accountId` ti serve un **secondo effect** con `accountId` tra le dipendenze (ricorda che gira anche al primo render: è innocuo qui; `npm run lint` può segnalare un avviso `set-state-in-effect`, che qui puoi ignorare). Alternativa preferibile: passare `key={accountId}` al componente dal genitore, che lo rimonta con state nuovo.

**Risultato atteso:** comportamento identico al widget classe.

**Criteri di completamento:** nessun `this`, nessun warning in console, interval fermo dopo lo smontaggio.

---

## ⚠️ Common Mistakes
- **Tradurre `componentDidMount` in `useEffect` senza cleanup** quando c'era `componentWillUnmount`.
- **Hook dopo un `return` anticipato o dentro un `if`:** regola dei Hooks violata.
- **Usare `defaultProps` su una funzione:** ignorato in React 19.
- **Copiare lo state come oggetto unico** in un solo `useState` e dimenticare lo spread.
- **Aspettarsi che `setX(valore)` aggiorni subito la variabile:** vale come per `setState`.

---

## ✅ Checklist
- ☐ So tradurre `this.state`/`setState` in `useState`.
- ☐ So tradurre lifecycle in `useEffect` con dipendenze e cleanup.
- ☐ So spiegare almeno due differenze di comportamento tra classe e funzione.
- ☐ So cosa non ha equivalente negli Hooks (Error Boundary).
- ☐ Ho completato la migrazione del widget con timer.

---

## 🚀 Challenge
Se vedi un HOC come `withBalanceVisibility(Component)` che inietta `hidden` e `toggleHidden`, scrivi un custom hook `useToggle(initialValue)` che restituisce `[value, toggle]` e usalo in `BalanceWidgetModern`.

---

## 📌 Recap
- Classe e funzione descrivono la stessa UI, ma con modelli diversi: istanza con `this` vs funzione con closure.
- `defaultProps` → parametri di default; `setState` → `useState`; lifecycle → `useEffect` con dipendenze e cleanup.
- La traduzione di lifecycle non è 1:1: ragiona per sincronizzazione.
- Error Boundary: solo classi.

---

### ➡️ Next
Prossimo capitolo: [06 — Leggere e manutenere codice legacy](./06_Leggere_e_Manutenere_Codice_Legacy.md). Metodo per orientarsi in una codebase sconosciuta.
