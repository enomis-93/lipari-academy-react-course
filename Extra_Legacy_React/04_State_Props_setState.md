# 🏦 LipariBank — React Zero to Hero

> **Extra React Legacy · Capitolo 04**
> **Argomento:** `this.props`, `this.state` e `this.setState`: forma oggetto, forma funzionale, asincronia, callback e merge
> **Durata stimata:** 45 minuti
> **Parte di LipariBank:** nuovo file di prova `src/legacy/SetStateLab.jsx`, montato temporaneamente in `LegacyLab`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- spiegare perché `this.state` non cambia subito dopo `this.setState`;
- scegliere tra `setState({...})` e `setState(prevState => ...)`;
- usare la callback di `setState` e sapere quando serve;
- spiegare la differenza tra il **merge superficiale** della classe e la **sostituzione** di `useState`.

---

## 📋 Prerequisiti
- [Capitolo 02](./02_Class_Components.md) e [Capitolo 03](./03_Lifecycle_Methods.md): `src/legacy/LegacyLab.jsx` funzionante su `/legacy`.
- Immutabilità dello state: [Day 3 cap. 05](../Day_03_State_Events/05_Immutabilita_dello_State.md).

---

## 🧭 In questo capitolo
- props in sola lettura, state come oggetto;
- `setState` forma oggetto vs forma funzionale;
- batching e asincronia (React ≤ 17 vs 18+);
- callback come secondo argomento;
- merge superficiale vs `useState`;
- laboratorio `SetStateLab`.

---

## 🧠 Theory

### Props e state
- **`this.props`**: mai modificarle (`this.props.title = "x"` è un errore concettuale).
- **`this.state`**: un unico oggetto. Si inizializza nel constructor (o come class field `state = {...}`, forma comune nel codice legacy recente) e si modifica **solo** con `setState`.
- Antipattern frequente nel legacy: copiare una prop nello state (`this.state = { balance: props.balance }`). Lo state non si aggiorna quando la prop cambia. Meglio usare direttamente la prop o calcolare il valore nel `render()`.

### `setState`: due forme
```jsx
this.setState({ hidden: true });
```

```jsx
this.setState((prevState, props) => ({ count: prevState.count + 1 }));
```

Usa la **forma funzionale** ogni volta che il nuovo valore dipende dal precedente. La forma oggetto legge `this.state` che può essere "vecchio".

### `setState` non è immediato
`setState` **richiede** un aggiornamento: React lo applica più tardi, raggruppando più chiamate (**batching**). Quindi subito dopo la chiamata `this.state` ha ancora il valore vecchio.

- **React 16/17:** il batching avviene dentro gli event handler di React; in `setTimeout`, Promise o listener nativi ogni `setState` rieseguiva subito il render (in quei contesti `this.state` risultava già aggiornato).
- **React 18+:** automatic batching ovunque. Non fare affidamento su `this.state` subito dopo `setState`, mai.

### Callback di `setState`
Il secondo argomento è una funzione eseguita **dopo** che lo state è stato applicato e il componente ri-renderizzato:

```jsx
this.setState({ message: "Aggiornato" }, () => {
  console.log("Stato aggiornato:", this.state.message);
});
```

Con `useState` **non esiste** una callback: si usa `useEffect` con la variabile tra le dipendenze.

### Merge superficiale (classe) vs sostituzione (`useState`)
`setState` fa un **merge di primo livello**: chiavi non citate restano intatte.

```jsx
this.state = { hidden: false, secondsSinceRefresh: 3 };
this.setState({ hidden: true });
// risultato: { hidden: true, secondsSinceRefresh: 3 }
```

`useState`, invece, **sostituisce** il valore: se tieni un oggetto devi fare lo spread.

```jsx
const [ui, setUi] = useState({ hidden: false, seconds: 3 });
setUi((prev) => ({ ...prev, hidden: true }));
```

Il merge è **superficiale**: per oggetti annidati (`this.state.settings.theme`) devi copiare tu il livello interno. Anche in classe vale l'immutabilità: niente `push` su array dello state.

> 💡 **Remember**
>
> Nelle classi lo state è un solo oggetto con merge automatico; con gli Hooks si usano più `useState` separati (uno per concetto), così non serve lo spread.

---

## 💻 Let's Code

### 1. Il laboratorio
Crea `src/legacy/SetStateLab.jsx`:

```jsx title="src/legacy/SetStateLab.jsx"
import { Component } from "react";

class SetStateLab extends Component {
  state = {
    objectCount: 0,
    functionalCount: 0,
    message: "nessuno",
    notes: [],
  };

  handleObjectForm = () => {
    this.setState({ objectCount: this.state.objectCount + 1 });
    this.setState({ objectCount: this.state.objectCount + 1 });
  };

  handleFunctionalForm = () => {
    this.setState((prevState) => ({ functionalCount: prevState.functionalCount + 1 }));
    this.setState((prevState) => ({ functionalCount: prevState.functionalCount + 1 }));
  };

  handleCallback = () => {
    this.setState({ message: "aggiornato" }, () => {
      console.log("Dentro la callback:", this.state.message);
    });
    console.log("Subito dopo setState:", this.state.message);
  };

  render() {
    const { objectCount, functionalCount, message, notes } = this.state;

    return (
      <section>
        <h2>SetState Lab</h2>
        <p>Forma oggetto (2 chiamate): {objectCount}</p>
        <button type="button" onClick={this.handleObjectForm}>
          +2 con forma oggetto
        </button>
        <p>Forma funzionale (2 chiamate): {functionalCount}</p>
        <button type="button" onClick={this.handleFunctionalForm}>
          +2 con forma funzionale
        </button>
        <p>Messaggio: {message}</p>
        <button type="button" onClick={this.handleCallback}>
          Prova callback
        </button>
        <p>Note: {notes.length}</p>
      </section>
    );
  }
}

export default SetStateLab;
```

### 2. Montalo nel banco di prova
In `src/legacy/LegacyLab.jsx` aggiungi l'import:

```jsx title="src/legacy/LegacyLab.jsx"
import SetStateLab from "./SetStateLab.jsx";
```

e, dopo il blocco `{showWidget && (...)}`, la riga (snippet parziale):

```jsx
<SetStateLab />
```

### 3. Cosa osservare
Dentro `liparibank/` lancia `npm run dev` e apri `/legacy`:
- "+2 con forma oggetto" aumenta di **1** (entrambe le chiamate leggono lo stesso `this.state.objectCount`, e la seconda sovrascrive la prima).
- "+2 con forma funzionale" aumenta di **2** (ogni funzione riceve lo state più recente).
- "Prova callback": nella console vedi prima `Subito dopo setState: nessuno` e poi `Dentro la callback: aggiornato`.
- L'aggiornamento di `message` non azzera i contatori: è il **merge**.

### 4. Equivalente moderno
```jsx
const [functionalCount, setFunctionalCount] = useState(0);

function handleFunctionalForm() {
  setFunctionalCount((prev) => prev + 1);
  setFunctionalCount((prev) => prev + 1);
}
```

Stesso risultato (+2): anche qui serve la forma funzionale quando il valore dipende dal precedente. Un `useState` per ciascun dato: niente merge, niente `this`.

---

## 🏦 LipariBank in action
Nel `LegacyTransactionsPanel` del [capitolo 07](./07_Esercizio_LipariBank_Legacy.md) lo state è `{ transactions, isLoading, error }` (e dopo la tua modifica anche `filter`). Quando la richiesta termina, la classe chiama `setState({ transactions, isLoading: false })` e il merge lascia intatto `error`. Con gli Hooks avrai tre `useState` separati e tre setter da chiamare.

---

## 🧪 Your Turn
**Obiettivo:** applicare `setState` funzionale e immutabilità.

**Requisiti:**
1. Prima di cliccare, scrivi i valori che ti aspetti dopo **un** click su ciascun pulsante; poi verifica.
2. In `SetStateLab` aggiungi un pulsante "Aggiungi nota" che aggiunge a `notes` una stringa `"Nota <n>"` (dove `<n>` è la nuova lunghezza), usando `setState` in **forma funzionale** e creando un **nuovo array** con lo spread.
3. Mostra l'elenco delle note con `<ul>` e `key`.

**Passi suggeriti:** scrivi l'handler come arrow function class field; dentro, chiama `this.setState` con una funzione che riceve `prevState` e restituisce `{ notes: [...prevState.notes, nuovaNota] }`, dove `nuovaNota` è costruita con la lunghezza di `prevState.notes` più uno.

**Risultato atteso:** ogni click aggiunge una nota; il conteggio e l'elenco restano coerenti.

**Criteri di completamento:** nessun `push`, nessuna modifica diretta di `this.state`.

---

## ⚠️ Common Mistakes
- **Leggere `this.state` subito dopo `setState`:** valore vecchio.
- **Due `setState` che dipendono dal valore precedente in forma oggetto:** il secondo sovrascrive il primo.
- **Mutare array/oggetti dello state** (`this.state.notes.push(...)`): l'UI non si aggiorna in modo affidabile.
- **Aspettarsi il merge profondo:** `setState` unisce solo il primo livello.
- **Cercare una callback in `useState`:** non esiste; usa `useEffect`.

---

## ✅ Checklist
- ☐ So perché `this.state` non cambia subito.
- ☐ So quando usare la forma funzionale.
- ☐ So usare la callback di `setState`.
- ☐ So spiegare merge (classe) vs sostituzione (`useState`).
- ☐ So che React 18 introduce l'automatic batching.

---

## 🚀 Challenge
Aggiungi a `SetStateLab` un oggetto annidato `settings: { theme: "chiaro", compact: false }` e un pulsante che cambia solo `compact` senza perdere `theme`: servirà copiare il livello interno con lo spread.

---

## 📌 Recap
- Props in sola lettura; state modificabile solo con `setState`.
- Forma funzionale quando il nuovo valore dipende dal precedente.
- `setState` è batched/asincrono: non leggere `this.state` subito dopo.
- Classe = merge superficiale; `useState` = sostituzione.

---

### ➡️ Next
Prossimo capitolo: [05 — Class vs Function Components](./05_Class_vs_Function_Components.md). Confronto sistematico e primo esercizio di migrazione.
