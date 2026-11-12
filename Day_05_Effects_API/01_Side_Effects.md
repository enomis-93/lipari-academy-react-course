# 🏦 LipariBank — React Zero to Hero

> **Day 5 · Capitolo 01**
> **Argomento:** Side Effects
> **Durata stimata:** 20 minuti
> **Parte di LipariBank:** capire *dove* mettere il codice che parla con il mondo esterno (rete, titolo della pagina, timer) prima di caricare i movimenti da un file JSON

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- spiegare cos'è un **side effect** e perché non va eseguito durante il render;
- distinguere tra codice da mettere nel render, in un event handler o in un effect;
- riconoscere i casi in cui **non** serve un effect (dati derivati);
- classificare le azioni della dashboard LipariBank in queste categorie.

---

## 📋 Prerequisiti
- Progetto `liparibank/` allo stato di fine Day 4 (`Dashboard.jsx` con state `transactions`, `selectedAccountId`, `hideBalance`, `filter`, `searchText` e `handleAddTransfer`). Vedi [Day 4 · Esercizio Bonifico](../Day_04_Forms_User_Input/06_Esercizio_LipariBank_Bonifico.md).
- `useState` e re-render ([Day 3 · State e Rerender](../Day_03_State_Events/03_State_e_Rerender.md)).

---

## 🧭 In questo capitolo
- Render puro e side effects.
- Tre posti dove può vivere la logica: render, event handler, effect.
- L'errore classico: usare un effect per calcolare dati derivati.
- Classificazione delle azioni di LipariBank.

---

## 🧠 Theory

### Render puro
Un Function Component deve comportarsi come una funzione pura: **a parità di props e state restituisce lo stesso JSX** e non modifica nulla fuori da sé. React può chiamare il componente più volte (per esempio in `StrictMode`, in sviluppo, lo fa di proposito) e deve poter scartare un render senza conseguenze.

### Cos'è un side effect
Un **side effect** è qualsiasi azione che influenza qualcosa al di fuori del calcolo del JSX:

- richieste di rete (`fetch`);
- modifica del DOM fuori da React, come `document.title`;
- timer (`setTimeout`, `setInterval`);
- sottoscrizioni a eventi del browser (`window.addEventListener`);
- scrittura su `localStorage`;
- `console.log` usato come traccia di debug (innocuo, ma tecnicamente è un effetto).

### Dove mettere un side effect
| Situazione | Dove va il codice |
| --- | --- |
| L'utente fa qualcosa (click, submit, digitazione) | **Event handler** |
| Il componente deve sincronizzarsi col mondo esterno *perché è visibile* (caricare dati al mount, impostare il titolo, aprire una sottoscrizione) | **`useEffect`** |
| Un valore si calcola da props/state esistenti | **Direttamente nel render** (variabile `const`) |

> 💡 **Remember**
>
> Se il codice è la risposta a un'azione dell'utente, va in un event handler. Se serve perché il componente è sullo schermo, va in `useEffect`. Se è solo un calcolo, non serve né l'uno né l'altro.

---

## 💻 Let's Code

### Errore 1: side effect nel render
Snippet **non corretto**, solo per capire il problema:

```jsx
function Dashboard() {
  document.title = "LipariBank — Dashboard";

  return <h1>Dashboard</h1>;
}
```

Funziona "per caso", ma modifica il DOM durante il render. Se React ripete o scarta il render, l'effetto viene eseguito comunque, fuori controllo. Con una `fetch` nel render il problema diventa grave: ogni render lancerebbe una richiesta, la risposta cambierebbe lo state, quindi un nuovo render, quindi una nuova richiesta… un ciclo infinito.

### Soluzione: spostarlo in un effect
Anteprima (il funzionamento completo è nel [capitolo 02](./02_useEffect.md)):

```jsx
import { useEffect } from "react";

function Dashboard() {
  useEffect(() => {
    document.title = "LipariBank — Dashboard";
  }, []);

  return <h1>Dashboard</h1>;
}
```

React esegue l'effect **dopo** aver aggiornato lo schermo, fuori dalla fase di calcolo del JSX.

### Errore 2: effect per dati derivati
Snippet **da evitare**: la lista filtrata dei movimenti viene copiata in un secondo state.

```jsx
const [visibleTransactions, setVisibleTransactions] = useState([]);

useEffect(() => {
  setVisibleTransactions(
    transactions.filter((transaction) => transaction.amount > 0)
  );
}, [transactions]);
```

Cosa non va: due render invece di uno, uno state ridondante che può andare fuori sincrono, più codice. La versione corretta è un semplice calcolo nel render:

```jsx
const visibleTransactions = transactions.filter(
  (transaction) => transaction.amount > 0
);
```

Come modificarlo: cambia il predicato (`< 0`, ricerca testuale…) senza toccare altro. Errore da evitare: pensare che "ogni volta che un valore cambia serve un effect".

---

## 🏦 LipariBank in action
Classifichiamo ciò che fa già la dashboard e ciò che aggiungeremo in questo Day:

| Azione in LipariBank | Categoria |
| --- | --- |
| Mostrare i movimenti filtrati per "entrate" o "uscite" | Dato derivato: calcolo nel render |
| Click su "Nascondi saldi" | Event handler → `setHideBalance` |
| Submit del form bonifico (aggiunge un movimento allo state) | Event handler → `handleAddTransfer` |
| Caricare i movimenti da `public/data/transactions.json` | **Effect** (serve perché la dashboard è visibile) |
| Mostrare il nome del conto selezionato nel titolo della scheda del browser | **Effect** (modifica `document.title`) |
| Calcolare il saldo totale sommando i conti | Dato derivato: calcolo nel render |

Il resto del Day 5 si concentra sulla quarta riga: portare i movimenti da una fonte esterna allo state.

---

## 🧪 Your Turn

**Obiettivo:** classificare correttamente sei situazioni e applicare un primo effect.

**Requisiti:**
1. Per ognuna delle situazioni sotto scrivi "render", "event handler" o "effect":
   1. calcolare il numero di movimenti in uscita;
   2. far sparire il messaggio di conferma del bonifico dopo 4 secondi da quando compare;
   3. mostrare un messaggio di conferma dopo un bonifico;
   4. leggere un file JSON dei movimenti quando la dashboard compare;
   5. impostare `document.title` con il nome del cliente;
   6. azzerare i filtri quando l'utente preme "Reset".
2. Nel tuo `Dashboard.jsx` aggiungi un effect con dependency array vuoto che imposta `document.title` a `"LipariBank — Dashboard"` (importa `useEffect` da `"react"`).

**Passi suggeriti:** ragiona su "chi scatena l'azione": l'utente (handler) o la sola presenza del componente (effect)?

**Risultato atteso:** il titolo della scheda del browser mostra "LipariBank — Dashboard".

**Criteri di completamento:** hai classificato tutte le situazioni e il titolo cambia senza errori in console.

> ✋ **Prova prima da solo.** Soluzione di riferimento: 1 → render; 2 → effect (un timer legato alla comparsa del messaggio, vedi capitolo 03); 3 → render condizionale basato su uno state impostato dall'event handler; 4 → effect; 5 → effect; 6 → event handler.

---

## ⚠️ Common Mistakes
- **Chiamare `fetch` direttamente nel corpo del componente.** Provoca richieste a ogni render. Correzione: `useEffect`.
- **Usare un effect per copiare props/state in altro state.** Calcola il valore nel render.
- **Mettere in un effect la logica del submit.** Il submit è un'azione dell'utente: usa l'event handler.
- **Pensare che l'effect sia "come `componentDidMount`".** È una sincronizzazione con dipendenze, non un evento del ciclo di vita (vedi Extra React Legacy).

---

## ✅ Checklist
- ☐ So definire un side effect con un esempio.
- ☐ So dire quando usare event handler, effect o calcolo nel render.
- ☐ Ho classificato le sei situazioni dell'esercizio.
- ☐ Il titolo della pagina viene impostato tramite `useEffect`.

---

## 🚀 Challenge
Cerca nel tuo progetto un punto in cui hai calcolato un valore con `useState` + aggiornamento manuale ma che potrebbe essere un semplice calcolo nel render. Se esiste, semplificalo.

---

## 📌 Recap
- Il render deve essere puro: niente `fetch`, timer o modifiche al DOM esterno.
- Le azioni dell'utente vivono negli event handler.
- Le sincronizzazioni con il mondo esterno vivono in `useEffect`.
- I dati derivati si calcolano nel render, senza effect.

---

### ➡️ Next
[Capitolo 02 — useEffect](./02_useEffect.md): la sintassi dell'hook e il momento in cui React esegue l'effect.
