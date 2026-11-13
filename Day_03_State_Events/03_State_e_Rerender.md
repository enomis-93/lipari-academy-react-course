# 🏦 LipariBank — React Zero to Hero

> **Day 3 · Capitolo 03**
> **Argomento:** State e Re-render (snapshot, batching, perché lo state non è una variabile)
> **Durata stimata:** 30 minuti
> **Parte di LipariBank:** osservare quali componenti di `Dashboard` si ridisegnano quando cambia `hideBalance`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- descrivere il ciclo *trigger → render → commit*;
- spiegare perché una variabile `let` non può sostituire lo state;
- prevedere il valore letto da un handler (snapshot) e usare gli aggiornamenti funzionali;
- riconoscere e correggere l'errore "Too many re-renders".

---

## 📋 Prerequisiti
- [Capitolo 02 — useState](./02_useState.md): `Dashboard` ha `hideBalance` e il pulsante di toggle.
- Console del browser aperta (F12) mentre lavori.

---

## 🧭 In questo capitolo
- Come React decide di ridisegnare.
- Perché `let count = 0` non funziona.
- Snapshot dello state e batching.
- Render puro e `StrictMode`.
- Osservare i re-render di LipariBank.

---

## 🧠 Theory

### Il ciclo di un aggiornamento
1. **Trigger**: un setter (`setHideBalance`) viene chiamato. React segna il componente da ridisegnare.
2. **Render**: React riesegue la **funzione** del componente (e quella dei figli, se serve) per ottenere il nuovo JSX. Qui nessuna modifica al DOM.
3. **Commit**: React confronta il nuovo JSX con il precedente e aggiorna nel DOM solo ciò che è cambiato. Come avviene questo confronto è l'argomento del [capitolo 04](./04_Virtual_DOM_e_Riconciliazione.md).

### Perché non basta una variabile
Una variabile locale:
- **non** scatena un render quando la cambi;
- **si azzera** a ogni render, perché la funzione riparte da capo.

Lo state è invece conservato **da React, fuori dalla funzione**, e restituito a ogni render.

### State come snapshot
Durante un render lo state ha un valore **fisso**: è una fotografia. Il setter non modifica la variabile che stai già usando: prepara il valore per il **prossimo** render.

```jsx
function handleClick() {
  setCount(count + 1);
  console.log(count); // stampa ancora il valore del render corrente
}
```

Conseguenza: `setCount(count + 1)` chiamato tre volte nello stesso handler scrive tre volte lo stesso valore (`count` è sempre quello della snapshot). Con la forma funzionale invece ogni chiamata parte dal risultato della precedente.

### Batching
React raggruppa più aggiornamenti dello stesso evento in **un solo render**: dopo `setFilter("income")` e `setSearchText("")` nello stesso handler ottieni un render, non due.

### Quando React non ridisegna
Se imposti lo stesso valore (confronto con `Object.is`), React può evitare di ridisegnare. Per oggetti e array "stesso valore" significa **stesso riferimento**: è il motivo per cui nel [capitolo 05](./05_Immutabilita_dello_State.md) non si modificano mai gli oggetti in place.

### Il render deve essere puro
La funzione del componente deve solo calcolare JSX dai suoi input (props e state). Dentro il render **non** si chiama un setter e non si modificano oggetti esterni. In sviluppo `StrictMode` esegue il render due volte di proposito per far emergere questi errori: due `console.log` identici non sono un bug.

> 💡 **Remember**
>
> Un re-render **non** è un "ricarica pagina": è React che riesegue le funzioni dei componenti. Lo state sopravvive tra un render e l'altro; le variabili locali no.

---

## 💻 Let's Code

Crea `src/components/RerenderLab.jsx` (da eliminare a fine capitolo).

```jsx title="src/components/RerenderLab.jsx"
import { useState } from "react";

function RerenderLab() {
  let plainCounter = 0;
  const [count, setCount] = useState(0);

  console.log("render RerenderLab, count =", count);

  function handlePlain() {
    plainCounter = plainCounter + 1;
    console.log("variabile normale:", plainCounter);
  }

  function addThreeWrong() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  function addThreeRight() {
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
  }

  function showSnapshot() {
    setCount(count + 1);
    console.log("subito dopo il setter:", count);
  }

  return (
    <section>
      <p>Variabile normale (non visibile a schermo): {plainCounter}</p>
      <p>State count: {count}</p>
      <button type="button" onClick={handlePlain}>Incrementa variabile normale</button>
      <button type="button" onClick={addThreeWrong}>+3 (sbagliato)</button>
      <button type="button" onClick={addThreeRight}>+3 (corretto)</button>
      <button type="button" onClick={showSnapshot}>+1 e log</button>
    </section>
  );
}

export default RerenderLab;
```

Aggiungilo temporaneamente a `App.jsx` e prova in quest'ordine:

1. "Incrementa variabile normale": in Console il valore sale a 1, ma la pagina mostra sempre `0` e nessun nuovo `render` compare.
2. "+3 (sbagliato)": `count` sale di **1**.
3. "+3 (corretto)": `count` sale di **3**.
4. "+1 e log": il log mostra il valore *vecchio*, la pagina il nuovo.

**Perché:** (1) niente setter, niente render; inoltre a ogni render `plainCounter` torna a 0. (2) le tre chiamate usano lo stesso `count` della snapshot. (3) la forma funzionale concatena gli aggiornamenti. (4) il setter non cambia la `count` del render in corso.

In Console noterai ogni riga `render ...` **due volte** per ogni render: è `StrictMode` in sviluppo, non un errore (in produzione, dopo `npm run build`, succede una volta sola).

> ℹ️ Se esegui `npm run lint`, `oxlint` segnala sul `plainCounter` un *warning* (`Cannot reassign variable after render completes`): è proprio il problema che stiamo mostrando e il warning sparisce quando elimini `RerenderLab.jsx`.

### L'errore "Too many re-renders"
Snippet da provare in `RerenderLab` e poi annullare:

```jsx
<button type="button" onClick={setCount(0)}>Azzera</button>
```

`setCount(0)` viene **eseguito durante il render**, cambia lo state, provoca un render, che lo riesegue... all'infinito. React si ferma con l'errore *Too many re-renders*. Correzione: `onClick={() => setCount(0)}`.

---

## 🏦 LipariBank in action

Vediamo chi si ridisegna. In `src/components/Dashboard.jsx` e `src/components/AccountCard.jsx` aggiungi, prima del `return`, una riga di log (la toglierai alla fine):

```jsx
console.log("render Dashboard");
```

```jsx
console.log("render AccountCard", account.id);
```

Premi "Nascondi saldi" e leggi la Console:

- `Dashboard` si ridisegna (è lui che possiede lo state);
- anche i figli (`BalanceCard`, `AccountList`, ogni `AccountCard`, `TransactionList`) vengono rieseguiti, anche se alcuni non mostrano nulla di diverso.

È normale e, per un'app di questa dimensione, economico: React poi aggiorna il DOM solo dove serve. Ottimizzare con `React.memo` è un tema del Day 8 e, di solito, non serve all'inizio.

Regola pratica: **lo state sta nel componente più basso che ne ha bisogno** (che sia comune a tutti i consumatori). Ci torniamo nel capitolo [Lifting State Up](./06_Lifting_State_Up.md).

---

## 🧪 Your Turn

**Obiettivo:** prevedere i re-render e verificarli.

**Requisiti**
1. Aggiungi i due `console.log` sopra e, **prima** di cliccare, scrivi su carta quante righe `render AccountCard` ti aspetti dopo un click su "Nascondi saldi" (senza contare il doppio render di `StrictMode`).
2. Clicca e confronta con la Console.
3. Aggiungi un `console.log` in `BalanceCard` e verifica se si ridisegna anche quando clicchi "Seleziona conto" (`handleSelectAccount` per ora non cambia state).
4. Riproduci l'errore "Too many re-renders" su `RerenderLab` e correggilo.

**Risultato atteso:** dopo il toggle vedi un `render Dashboard` e due `render AccountCard` (`acc-001`, `acc-002`), ciascuno ripetuto per `StrictMode`. Cliccando "Seleziona conto" non compare alcun render, perché non cambia nessuno state.

**Criteri di completamento**
- Hai spiegato a parole perché "Seleziona conto" non produce re-render.
- Hai rimosso i `console.log` e `RerenderLab.jsx`.

---

## ⚠️ Common Mistakes

| Errore | Sintomo | Correzione |
|---|---|---|
| Variabile normale al posto dello state | la UI non cambia | `useState` |
| `setX(x + 1)` ripetuto | l'incremento vale 1 | `setX((prev) => prev + 1)` |
| Leggere `x` subito dopo `setX(...)` | valore vecchio | usare il valore calcolato in una variabile locale |
| `onClick={setX(0)}` | "Too many re-renders" | `onClick={() => setX(0)}` |
| Chiamare un setter nel corpo del componente | loop infinito di render | spostarlo in un handler |
| Spaventarsi del doppio log | nessun bug | è `StrictMode` in sviluppo |

---

## ✅ Checklist
- ☐ So descrivere trigger, render e commit.
- ☐ So perché una variabile locale non è uno state.
- ☐ Capisco la snapshot: il setter non cambia il valore del render corrente.
- ☐ So riprodurre e correggere "Too many re-renders".
- ☐ Ho ripulito `console.log` e componenti di prova.

---

## 🚀 Challenge
Nel `RerenderLab` aggiungi `setTimeout(() => console.log(count), 2000)` dentro un handler che fa anche `setCount(count + 1)`. Quale valore stampa? Riscrivi il codice in modo da loggare il valore *aggiornato* calcolandolo prima in una `const next = count + 1`.

---

## 📌 Recap
- Un setter innesca un nuovo **render**; il DOM è aggiornato nella fase di **commit**.
- Le variabili locali non persistono e non innescano render: per questo serve lo state.
- Lo state è una **snapshot** per render; per aggiornamenti concatenati usa la forma funzionale.
- Più setter nello stesso evento sono raggruppati (**batching**).
- Il render è puro: niente setter né modifiche esterne nel corpo del componente.

---

### ➡️ Next
[Capitolo 04 — Virtual DOM e riconciliazione](./04_Virtual_DOM_e_Riconciliazione.md): hai visto che React riesegue i componenti; ora vediamo come decide che cosa cambiare davvero nella pagina.
