# 🏦 LipariBank — React Zero to Hero

> **Day 5 · Capitolo 02**
> **Argomento:** useEffect
> **Durata stimata:** 25 minuti
> **Parte di LipariBank:** sincronizzazione del titolo della pagina con il conto selezionato nella dashboard

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- scrivere un `useEffect` con la sintassi corretta;
- spiegare **quando** React esegue l'effect rispetto al render;
- scegliere tra le tre forme del dependency array (assente, vuoto, con valori);
- evitare l'errore dell'`async` passato direttamente a `useEffect`.

---

## 📋 Prerequisiti
- [Capitolo 01 — Side Effects](./01_Side_Effects.md).
- `Dashboard.jsx` con `selectedAccountId` e l'array `accounts` importato da `src/data/mockData.js`.

---

## 🧭 In questo capitolo
- Sintassi di `useEffect`.
- Ordine di esecuzione: render → commit → effect.
- Dependency array: tre forme.
- Regole degli Hooks e funzioni `async`.
- Applicazione: `document.title` legato al conto selezionato.

---

## 🧠 Theory

### Sintassi
```text
useEffect(setup, dependencies?)
```

- `setup` è una funzione eseguita da React **dopo** che il componente è stato disegnato sullo schermo. Può restituire una funzione di **cleanup** (capitolo 03).
- `dependencies` è un array opzionale di valori reattivi (props, state, variabili derivate) usati dentro `setup`.

### Quando viene eseguito
1. React chiama il componente (**render**) e calcola il JSX.
2. React aggiorna il DOM (**commit**).
3. Il browser disegna.
4. React esegue gli effect.

Per questo dentro un effect puoi già leggere il DOM aggiornato, e per questo un effect non blocca il disegno della pagina.

### Le tre forme del dependency array
| Forma | Quando viene eseguito l'effect |
| --- | --- |
| `useEffect(fn)` (nessun array) | dopo **ogni** render |
| `useEffect(fn, [])` | dopo il primo render (mount); in sviluppo con `StrictMode` vedi capitolo 03 |
| `useEffect(fn, [a, b])` | dopo il primo render e ogni volta che `a` o `b` cambiano (confronto con `Object.is`) |

> 💡 **Remember**
>
> Il dependency array **non è un'opzione di performance**: dichiara da quali valori dipende la sincronizzazione. Ogni valore reattivo letto nell'effect va elencato.

### Regole
- Gli Hooks si chiamano solo al livello principale del componente: mai dentro `if`, cicli o funzioni annidate.
- La funzione passata a `useEffect` **non può essere `async`**, perché `async` restituisce una Promise mentre React si aspetta o `undefined` o una funzione di cleanup. Si definisce una funzione `async` interna e la si chiama.

---

## 💻 Let's Code

### Esempio 1 — titolo della pagina
Snippet parziale del tuo `src/components/Dashboard.jsx` (le parti già esistenti sono omesse):

```jsx
import { useEffect, useState } from "react";
import { accounts } from "../data/mockData.js";

export default function Dashboard() {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0].id);

  const selectedAccount = accounts.find(
    (account) => account.id === selectedAccountId
  );

  useEffect(() => {
    document.title = `LipariBank — ${selectedAccount.name}`;
  }, [selectedAccount.name]);

  // ...resto del componente invariato
}
```

Cosa fa: dopo ogni render in cui cambia `selectedAccount.name`, aggiorna il titolo della scheda del browser. Nel tuo `Dashboard.jsx` del Day 4 `selectedAccount` esiste già (calcolato da `accountsWithBalance`): usa quella e aggiungi solo l'effect, **dopo** la riga che definisce `selectedAccount` (e prima di qualunque `return`). Perché funziona: la dipendenza è esattamente il valore letto nell'effect. Come modificarlo: aggiungi altro testo al titolo, ma ricordati di elencare ogni nuovo valore reattivo nelle dipendenze.

### Esempio 2 — vedere i momenti di esecuzione
Aggiungi temporaneamente tre log per osservare le tre forme:

```jsx
console.log("render Dashboard");

useEffect(() => {
  console.log("effect senza array");
});

useEffect(() => {
  console.log("effect con array vuoto");
}, []);

useEffect(() => {
  console.log("effect con dipendenza:", selectedAccountId);
}, [selectedAccountId]);
```

Apri la console del browser, poi clicca più volte tra i due conti e sul pulsante "Nascondi saldi":

- "effect senza array" compare a ogni render, anche cambiando `hideBalance`;
- "effect con array vuoto" compare all'avvio (due volte in sviluppo: vedi capitolo 03);
- "effect con dipendenza" compare solo quando cambia `selectedAccountId`.

Rimuovi i log al termine.

### Esempio 3 — `async` dentro un effect
Forma **errata**:

```jsx
useEffect(async () => {
  const data = await getTransactions();
}, []);
```

Forma corretta (snippet parziale: `getTransactions` arriva nel capitolo 04):

```jsx
useEffect(() => {
  async function loadTransactions() {
    const data = await getTransactions();
    console.log(data);
  }

  loadTransactions();
}, []);
```

---

## 🏦 LipariBank in action
Il titolo della scheda diventa un piccolo indicatore di contesto: selezionando "Conto Risparmio" il browser mostra "LipariBank — Conto Risparmio". È un effect perfetto perché:

- nasce dal fatto che la dashboard è visibile (non è la risposta a un singolo click);
- ha una dipendenza chiara (`selectedAccount.name`);
- non serve nessuno state aggiuntivo.

Nel prossimo capitolo useremo la stessa meccanica per cose più delicate: timer e richieste che devono essere ripulite.

---

## 🧪 Your Turn

**Obiettivo:** applicare i tre tipi di dependency array a un caso reale.

**Requisiti:**
1. In `Dashboard.jsx` imposta `document.title` come nell'esempio 1.
2. Aggiungi un effect con array di dipendenze **assente** che mostra in console il numero di render del componente (usa un `let renderCount` fuori dal componente incrementato nell'effect); osserva come cresce quando premi "Nascondi saldi".
3. Aggiungi un effect con dipendenze `[filter, searchText]` che scrive in console `Filtri cambiati: <filter> / <searchText>`.
4. Rimuovi i log di debug quando hai finito, lasciando solo l'effect del titolo.

**Passi suggeriti:** parti dall'esempio 2, poi sostituisci i log con quelli richiesti.

**Risultato atteso:** titolo che cambia col conto; console che mostra il comportamento descritto.

**Criteri di completamento:** hai verificato con la console quali effect scattano con quale azione e nel codice finale rimane solo l'effect del titolo.

> Suggerimento per il punto 2: `renderCount` è una variabile di modulo. Non è una tecnica da usare in produzione, serve solo per osservare.

---

## ⚠️ Common Mistakes
- **`useEffect(async () => ...)`.** Definisci una funzione `async` interna.
- **Dependency array dimenticato.** L'effect gira dopo ogni render; se imposta state genera un ciclo infinito di render.
- **Dipendenze mancanti.** L'effect usa un valore "vecchio" (*stale*). Elenca tutti i valori reattivi usati.
- **Hook dentro un `if`.** Metti la condizione **dentro** l'effect, non attorno all'hook.
- **Impostare state nell'effect senza motivo** quando il valore si può derivare nel render.

---

## ✅ Checklist
- ☐ Conosco l'ordine render → commit → effect.
- ☐ So spiegare le tre forme del dependency array.
- ☐ Non passo mai una funzione `async` direttamente a `useEffect`.
- ☐ Il titolo della pagina cambia col conto selezionato.
- ☐ Ho rimosso i log di debug.

---

## 🚀 Challenge
Fai in modo che il titolo mostri anche "(saldo nascosto)" quando `hideBalance` è `true`. Quale nuova dipendenza devi aggiungere?

---

## 📌 Recap
- `useEffect(setup, deps)` esegue `setup` dopo il render e il commit.
- Nessun array = ogni render; `[]` = al mount; `[a, b]` = quando cambiano.
- Le dipendenze descrivono i valori reattivi letti nell'effect.
- Per usare `await` si definisce una funzione `async` interna.

---

### ➡️ Next
[Capitolo 03 — Dipendenze e Cleanup](./03_Dipendenze_e_Cleanup.md): errori con le dipendenze, cleanup, `StrictMode` e race condition.
