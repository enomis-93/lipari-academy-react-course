# 🏦 LipariBank — React Zero to Hero

> **Extra React Legacy · Capitolo 02**
> **Argomento:** Class Components: `extends Component`, `constructor`, `this.props`, `this.state`, `render()`
> **Durata stimata:** 45 minuti
> **Parte di LipariBank:** creiamo `src/legacy/LegacyBalanceWidget.jsx` e un banco di prova temporaneo `src/legacy/LegacyLab.jsx`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- leggere la struttura di un Class Component (constructor, state, metodi, `render()`);
- spiegare cosa fanno `super(props)`, `this.props` e `this.state`;
- riconoscere e correggere il bug classico della `this` persa negli handler;
- montare temporaneamente un componente classe nell'app e rimuoverlo poi.

---

## 📋 Prerequisiti
- [Capitolo 01 — React moderno vs legacy](./01_React_Moderno_vs_Legacy.md).
- Progetto `liparibank/` con `src/data/mockData.js`, `src/utils/formatters.js` e routing (Day 6, CHECKPOINT 6).
- Concetti di props, state e eventi dei Day 2–3.

---

## 🧭 In questo capitolo
- anatomia di una classe componente;
- `render()` e purezza;
- `this.props` e `this.state`;
- handler e il problema di `this`;
- `LegacyBalanceWidget` + `LegacyLab`, montati su una route temporanea `/legacy`.

---

## 🧠 Theory

### Anatomia di un Class Component
Un Class Component è una classe JavaScript che estende `Component` e **deve** avere un metodo `render()` che restituisce JSX.

```jsx
import { Component } from "react";

class Greeting extends Component {
  render() {
    return <h1>Ciao, {this.props.name}</h1>;
  }
}
```

Nel codice legacy troverai `class Greeting extends React.Component` con `import React from "react"`: è la stessa cosa.

### I quattro pezzi da riconoscere
1. **`constructor(props)`** con `super(props)` come prima istruzione: senza `super(props)`, `this.props` non è disponibile nel costruttore. Qui si inizializza `this.state`.
2. **`this.props`**: le props ricevute dal genitore. Sono **in sola lettura**.
3. **`this.state`**: un **oggetto** con lo stato locale. Si legge con `this.state.x`; si cambia **solo** con `this.setState(...)` (vedi [capitolo 04](./04_State_Props_setState.md)). Assegnare direttamente `this.state` è permesso solo nel constructor.
4. **`render()`**: descrive la UI in funzione di props e state. Deve essere **pura**: niente `setState`, niente fetch, niente timer, niente modifiche al DOM. Gli effetti vanno nei lifecycle ([capitolo 03](./03_Lifecycle_Methods.md)).

### Il problema di `this` negli handler
I metodi di una classe **non** sono legati automaticamente all'istanza. Se passi `this.toggleHidden` a `onClick`, React lo chiama senza `this`, e dentro il metodo `this` è `undefined`. Due soluzioni diffuse:

```jsx
constructor(props) {
  super(props);
  this.toggleHidden = this.toggleHidden.bind(this);
}
```

```jsx
toggleHidden = () => {
  this.setState((prevState) => ({ hidden: !prevState.hidden }));
};
```

La prima (`bind` nel constructor) è lo stile più vecchio; la seconda usa una **class field con arrow function** (sintassi moderna, che Vite supporta). Una terza forma, `onClick={() => this.toggleHidden()}`, funziona ma crea una nuova funzione a ogni render.

> 💡 **Remember**
>
> Nel codice legacy vedrai tutte e tre le forme. Sono equivalenti nel risultato: l'obiettivo è sempre che `this` punti all'istanza del componente.

---

## 💻 Let's Code

### 1. Il widget saldo in stile class
Crea la cartella `src/legacy/` e il file `src/legacy/LegacyBalanceWidget.jsx`:

```jsx
import { Component } from "react";
import { formatCurrency } from "../utils/formatters";

class LegacyBalanceWidget extends Component {
  static defaultProps = {
    title: "Saldo (legacy)",
  };

  constructor(props) {
    super(props);
    this.state = { hidden: false };
    this.toggleHidden = this.toggleHidden.bind(this);
  }

  toggleHidden() {
    this.setState((prevState) => ({ hidden: !prevState.hidden }));
  }

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
        <button type="button" onClick={this.toggleHidden}>
          {this.state.hidden ? "Mostra saldo" : "Nascondi saldo"}
        </button>
      </section>
    );
  }
}

export default LegacyBalanceWidget;
```

Cosa fa: mostra il saldo del conto scelto tramite `accountId` e permette di nasconderlo. `static defaultProps` è il modo legacy di definire i valori di default delle props (su classi funziona ancora in React 19). Il `title` arriva dai default se il genitore non lo passa.

### 2. Il banco di prova `LegacyLab`
Il widget è una classe, ma può convivere con Function Components. Crea `src/legacy/LegacyLab.jsx` (file temporaneo, cartella `src/legacy/`):

```jsx
import { useState } from "react";
import { accounts } from "../data/mockData";
import LegacyBalanceWidget from "./LegacyBalanceWidget";

function LegacyLab() {
  const [accountId, setAccountId] = useState("acc-001");

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
      <LegacyBalanceWidget accounts={accounts} accountId={accountId} />
    </main>
  );
}

export default LegacyLab;
```

### 3. Montarlo temporaneamente
In `src/App.jsx` aggiungi l'import in cima:

```jsx
import LegacyLab from "./legacy/LegacyLab";
```

e, dentro `<Routes>`, una route **fuori dal layout** (sorella di `<Route element={<AppLayout />}>`, così `LegacyLab` non finisce dentro l'`<main>` del layout), prima di quella del layout (snippet parziale, non eseguibile da solo):

```jsx
<Route path="/legacy" element={<LegacyLab />} />
```

Avvia il progetto dentro `liparibank/`:

```bash
npm run dev
```

Apri `http://localhost:5173/legacy`. Prova: cambia conto (saldo diverso), clicca "Nascondi saldo".

**Per rimuoverlo:** togli l'`import` e la `<Route>` da `App.jsx`. Il resto dell'app non è mai stato toccato; la cartella `src/legacy/` può restare come materiale di studio.

### 4. Il bug di `this`
**Snippet di esempio con bug** (non copiarlo nel progetto): togli la riga `bind` dal constructor e clicca il pulsante. In console compare:

```text
TypeError: Cannot read properties of undefined (reading 'setState')
```

Rimetti `this.toggleHidden = this.toggleHidden.bind(this);` (oppure trasforma il metodo in arrow function class field).

### 5. L'equivalente moderno (solo la parte stato)
```jsx
const [hidden, setHidden] = useState(false);

function toggleHidden() {
  setHidden((prevHidden) => !prevHidden);
}
```

Niente `this`, niente `bind`, niente `constructor`: stato e handler sono semplici variabili del componente. Il confronto completo è nel [capitolo 05](./05_Class_vs_Function_Components.md).

---

## 🏦 LipariBank in action
Un widget "saldo con pulsante nascondi" è tipico di una dashboard bancaria legacy. Nel Day 3 lo avevi fatto con `useState` (`hideBalance`); qui vedi lo stesso comportamento scritto con `this.state`. Notare che dentro `LegacyLab` (Function Component) vive un Class Component: in una vera codebase le due convivono per anni.

---

## 🧪 Your Turn
**Obiettivo:** leggere e modificare un Class Component.

**Requisiti:**
1. Aggiungi a `LegacyBalanceWidget` un secondo pulsante "Mostra IBAN" che alterna la visibilità di `account.iban`, usando un nuovo campo di state `showIban`.
2. L'handler deve essere una **class field arrow function** (`handleToggleIban = () => {...}`), mentre `toggleHidden` resta con `bind`.
3. Verifica in `/legacy` che cambiando conto l'IBAN mostrato cambi e che i due pulsanti siano indipendenti.

**Passi suggeriti:**
- Estendi `this.state = { hidden: false, showIban: false }`.
- Usa `setState` con la forma funzionale `prevState => ...`.
- Nel `render`, mostra `{this.state.showIban && <p>{account.iban}</p>}`.

**Risultato atteso:** due pulsanti indipendenti; l'IBAN compare/scompare senza influenzare il saldo.

**Criteri di completamento:** nessun errore in console, nessuna mutazione diretta di `this.state`, `key` presenti nelle liste.

---

## ⚠️ Common Mistakes
- **Dimenticare `super(props)`:** `this.props` è `undefined` nel constructor.
- **Passare `this.metodo` senza bind:** `this` è `undefined` → errore al click.
- **Mutare lo state** (`this.state.hidden = true`): niente re-render. Usa `setState`.
- **Fare side effect nel `render()`** (fetch, `setState`): provoca loop o comportamenti imprevedibili.
- **Scrivere `class=` invece di `className=`:** vale anche nelle classi.

---

## ✅ Checklist
- ☐ Riconosco constructor, `super(props)`, `this.state`, `this.props`, `render()`.
- ☐ So spiegare perché `render()` deve essere pura.
- ☐ So correggere il problema di `this` in tre modi.
- ☐ Ho montato `LegacyLab` su `/legacy` e l'ho rimosso dopo (o so come farlo).
- ☐ So scrivere l'equivalente con `useState`.

---

## 🚀 Challenge
Rendi `LegacyBalanceWidget` capace di mostrare il **totale di tutti i conti** quando `accountId` non viene passato (usa `reduce` sull'array `accounts`), gestendo il caso nel `render()`.

---

## 📌 Recap
- Una classe componente ha `render()`, state in `this.state`, props in `this.props`.
- `setState` è l'unico modo per aggiornare lo state dopo il constructor.
- Gli handler vanno legati all'istanza (`bind` o arrow function class field).
- Classi e funzioni convivono nella stessa app.

---

### ➡️ Next
Prossimo capitolo: [03 — Lifecycle Methods](./03_Lifecycle_Methods.md). Aggiungeremo timer e cleanup al widget, e lo collegheremo a `useEffect`.
