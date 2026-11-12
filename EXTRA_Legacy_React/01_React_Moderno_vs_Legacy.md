# 🏦 LipariBank — React Zero to Hero

> **Extra React Legacy · Capitolo 01**
> **Argomento:** React moderno vs React legacy: versioni, API rimosse e compatibilità
> **Durata stimata:** 40 minuti
> **Parte di LipariBank:** nessuna modifica all'app; prepariamo il terreno per leggere e manutenere codice legacy (cartella `src/legacy/` dai prossimi capitoli)

---

Questo modulo offre un'infarinatura sulla manutenzione del codice legacy. Puoi saltarlo e passare direttamente dal Day 6 al [Day 7](../Day_07_Shared_State_Redux/01_Context_e_useContext.md).

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- collocare nel tempo le versioni di React (15 → 19) e dire cosa ha introdotto ciascuna;
- sapere quali API sono state rimosse in React 19 e quali (Class Components, Error Boundaries) esistono ancora;
- controllare la versione di React di un progetto e capire se supporta gli Hooks;
- distinguere il punto di ingresso legacy (`ReactDOM.render`) da quello moderno (`createRoot`).

---

## 📋 Prerequisiti
- Day 6 completato: [Esercizio LipariBank MultiPage](../Day_06_Routing/06_Esercizio_LipariBank_MultiPage.md) (progetto `liparibank/` con routing funzionante, CHECKPOINT 6).
- Hooks `useState` e `useEffect` già visti: [useState](../Day_03_State_Events/02_useState.md), [useEffect](../Day_05_Effects_API/02_useEffect.md).
- Terminale aperto dentro `liparibank/`.

---

## 🧭 In questo capitolo
- perché il codice legacy esiste ancora e perché devi saperlo leggere;
- linea del tempo delle versioni di React;
- cosa è stato rimosso in React 19 (e cosa no);
- Hooks e React 16.8: cosa succede in un progetto più vecchio;
- come controllare la versione installata.

---

## 🧠 Theory

### Perché studiare il legacy
Un'azienda raramente parte da zero: spesso trovi applicazioni scritte tra il 2015 e il 2020 con **Class Components**, `ReactDOM.render` e lifecycle come `componentDidMount`. Funzionano, fanno guadagnare soldi e vanno **mantenute**. Il corso ti insegna a scrivere codice moderno (Function Components + Hooks), ma un bravo sviluppatore sa anche **leggere** codice più vecchio senza spaventarsi.

> 💡 **Remember**
>
> **Regola del corso:** tutti gli esercizi di sviluppo usano Function Components e Hooks. Le Class Components compaiono solo in questo giorno (e nel cenno all'Error Boundary del Day 7) per **leggere, comprendere e manutenere** codice esistente.

### Linea del tempo essenziale

| Versione | Anno (circa) | Cosa porta di rilevante per te |
|---|---|---|
| 15.5 | 2017 | `PropTypes` esce dal pacchetto `react` e va nel pacchetto separato `prop-types` |
| 16.0 | 2017 | Error Boundaries (`componentDidCatch`); `render` può restituire array e stringhe (`<Fragment>` arriva con la 16.2); `React.createClass` sparisce (serve `create-react-class`) |
| 16.3 | 2018 | Nuova Context API, `createRef`, nuovi lifecycle; i vecchi `componentWillMount/ReceiveProps/Update` vengono rinominati con prefisso `UNSAFE_` |
| **16.8** | 2019 | **Hooks** (`useState`, `useEffect`, ...) |
| 17 | 2020 | Release "di transizione" senza nuove API; **nuovo JSX transform** (non serve più `import React`) |
| 18 | 2022 | `createRoot` al posto di `ReactDOM.render`; **automatic batching**; transitions |
| **19** | 2024 | Rimozione di API deprecate da anni (vedi sotto); le Class Components restano supportate |

Le date sono indicative: per i dettagli esatti consulta sempre il changelog ufficiale di React.

### Hooks e React 16.8
Gli Hooks esistono **solo da React 16.8 in poi** (sia `react` sia `react-dom` devono essere ≥ 16.8). In un progetto con React 16.0–16.7 o 15, `useState` semplicemente non esiste. Hai due strade: scrivere nel modo supportato da quella versione (Class Components) oppure **aggiornare React**, valutando l'impatto su librerie e test. Non dare mai per scontato che un vecchio progetto abbia tutti gli Hooks.

### Cosa è cambiato in React 18 e 17 (quello che vedrai nel codice)
- **Punto di ingresso.** Prima: `ReactDOM.render(<App />, container)`. Da React 18: `createRoot(container).render(<App />)`. È ciò che fa il tuo `src/main.jsx`.
- **Automatic batching (18).** Più `setState` consecutivi vengono raggruppati in un solo render **ovunque** (timer, Promise, eventi nativi). In React 16/17 il raggruppamento avveniva solo dentro gli event handler di React: fuori, ogni `setState` rieseguiva subito il render. Ne parliamo nel [capitolo 04](./04_State_Props_setState.md).
- **JSX transform (17).** Nei file legacy trovi `import React from "react";` in ogni file con JSX: oggi non è più necessario.

### Cosa è stato rimosso in React 19
React 19 ha eliminato API già deprecate da tempo. Nel codice legacy possono comparire e **non funzionano più**:

| API rimossa in React 19 | Sostituzione moderna |
|---|---|
| `ReactDOM.render`, `ReactDOM.hydrate` | `createRoot(...).render(...)`, `hydrateRoot(...)` |
| `ReactDOM.unmountComponentAtNode` | `root.unmount()` |
| `ReactDOM.findDOMNode` | `ref` sull'elemento |
| String refs (`ref="input"`, `this.refs.input`) | `createRef()` / `useRef()` / callback ref |
| Legacy Context (`contextTypes`, `childContextTypes`, `getChildContext`) | `createContext` (Day 7) / `static contextType` |
| `propTypes` e `defaultProps` su **function components** | controlli propTypes ignorati; parametri di default JS |
| `React.createFactory` | JSX |
| Function component "module pattern" (funzione che restituisce un oggetto con `render`) | normale function component |
| `react-test-renderer/shallow` | librerie di test aggiornate |

Come si manifestano (verificato su React 19 in sviluppo): `ReactDOM.render` → `ReactDOM.render is not a function`; string ref → errore di rendering `Expected ref to be a function, an object returned by React.createRef(), or undefined/null`; `findDOMNode` → `ReactDOM.findDOMNode is not a function`; legacy context → `console.error` e `this.context` vuoto (`{}`); module pattern → errore `Objects are not valid as a React child`; `defaultProps` su function component → ignorato (la prop resta `undefined`); `propTypes` → nessun controllo e nessun warning.

### Cosa NON è stato rimosso
- **Le Class Components funzionano ancora in React 19.** Non c'è nessuna "scadenza" annunciata per i tuoi componenti classe esistenti.
- `static defaultProps` su una **classe** è ancora supportato.
- Gli **Error Boundaries** si scrivono ancora solo con una classe (`getDerivedStateFromError` / `componentDidCatch`): non esiste un Hook equivalente.

> ⚠️ I vecchi lifecycle `componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate` sono **deprecati**: la documentazione prevede che in futuro funzioni solo il nome con prefisso `UNSAFE_`. Non scriverli mai in codice nuovo (dettagli nel [capitolo 03](./03_Lifecycle_Methods.md)).

---

## 💻 Let's Code

### 1. Controllare la versione di React del progetto
Dentro `liparibank/`:

```bash
npm ls react react-dom
```

L'output elenca la versione installata di `react` e `react-dom`: nel corso è la **19.x** (la versione esatta è nel tuo `package.json`).

Per vedere cosa dichiara il progetto:

```bash
npm pkg get dependencies.react dependencies.react-dom
```

### 2. Punto di ingresso: legacy vs moderno

**Snippet NON eseguibile su React 19** (stile React 16/17, solo da leggere):

```jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
```

Su React 19 produce un errore del tipo `ReactDOM.render is not a function`, perché la funzione non esiste più.

**Equivalente moderno** (è il tuo `src/main.jsx`, qui semplificato):

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Differenze da notare: `createRoot` si importa da `react-dom/client`, crea un "root" riutilizzabile, e non serve `import React`.

### 3. Leggere un `package.json` legacy
Snippet di esempio (progetto fittizio):

```json
{
  "dependencies": {
    "react": "^16.4.2",
    "react-dom": "^16.4.2",
    "prop-types": "^15.6.2"
  }
}
```

Lettura: React 16.4 → **niente Hooks** (arrivano in 16.8), `ReactDOM.render` valido, `prop-types` per i controlli sulle props, componenti quasi certamente classe.

---

## 🏦 LipariBank in action
`liparibank/` usa React 19 con `createRoot` e `StrictMode`: è un progetto moderno. Nei prossimi capitoli aggiungeremo la cartella `src/legacy/` con componenti scritti **come se fossero stati ereditati** da un progetto React 16/17 (un widget saldo e un pannello movimenti), adattati per girare su React 19. Li leggerai, li modificherai in stile class e infine li migrerai a Function Components + Hooks. Il resto dell'app **non cambia**.

---

## 🧪 Your Turn
**Obiettivo:** classificare tre progetti in base alla versione di React.

**Requisiti:** per ciascuno scrivi (1) se gli Hooks sono disponibili, (2) quale API di avvio ti aspetti, (3) un rischio nell'aggiornare a React 19.

| Progetto | `react` / `react-dom` | Entry point osservato |
|---|---|---|
| A | 15.6.2 | `ReactDOM.render` |
| B | 16.13.1 | `ReactDOM.render` + `import React` ovunque |
| C | 18.3.x | `createRoot` ma `ReactDOM.findDOMNode` in un componente |

**Passi suggeriti:**
1. Ricorda la soglia: Hooks da 16.8.
2. Elenca per ciascun progetto le API del paragrafo "rimosse in React 19" che potrebbero rompersi.
3. Esegui `npm ls react react-dom` nel tuo `liparibank/` e annota la versione nella tabella.

**Risultato atteso:** A senza Hooks, B con Hooks, C con Hooks; per C `findDOMNode` va sostituito prima dell'aggiornamento; A e B richiedono di passare a `createRoot`.

**Criteri di completamento:** hai motivato ogni riga con la versione, non "a sensazione".

---

## ⚠️ Common Mistakes
- **Importare Hooks in un progetto < 16.8:** errore tipo `useState is not a function`. Controlla `npm ls react react-dom` prima di scrivere codice.
- **Aggiornare solo `react` e non `react-dom`:** le due versioni devono essere allineate.
- **Copiare codice legacy in un progetto React 19 senza controllare le API rimosse:** `ReactDOM.render`, string refs e legacy context non funzionano.
- **Credere che "classe = vietata":** le Class Components sono supportate; semplicemente non si scrivono più per il codice nuovo.

---

## ✅ Checklist
- ☐ So dire in che versione sono arrivati gli Hooks.
- ☐ So elencare almeno quattro API rimosse in React 19.
- ☐ So che Class Components ed Error Boundaries (classe) funzionano ancora.
- ☐ So riconoscere `ReactDOM.render` (legacy) e `createRoot` (moderno).
- ☐ So controllare la versione con `npm ls react react-dom`.

---

## 🚀 Challenge
Apri il changelog ufficiale di React e trova la voce della versione 19 che elenca le rimozioni. Confronta l'elenco con la tabella di questo capitolo e annota una API che non avevamo citato.

---

## 📌 Recap
- Hooks = React **16.8**; prima di quella versione esistono solo le classi.
- React 18 introduce `createRoot` e l'automatic batching; React 19 rimuove `ReactDOM.render` e altre API storiche.
- Le Class Components e gli Error Boundaries (classe) restano supportati in React 19.
- Nel corso: sviluppo con Function Components + Hooks, classi solo per leggere/mantenere.

---

### ➡️ Next
Prossimo capitolo: [02 — Class Components](./02_Class_Components.md). Costruiremo il primo componente legacy, `LegacyBalanceWidget`, e lo monteremo temporaneamente nell'app.
