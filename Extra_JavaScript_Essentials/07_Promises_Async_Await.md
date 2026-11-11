# 🏦 LipariBank — React Zero to Hero

> **Extra JavaScript · Capitolo 07**
> **Argomento:** Promise, `async`/`await`, `try`/`catch`/`finally` e asincronia
> **Durata stimata:** 35 minuti
> **Parte di LipariBank:** il caricamento asincrono di conti e movimenti (Day 5) e il bonifico simulato (Day 4)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- spiegare perché `setTimeout` e le richieste di rete non bloccano il programma;
- creare e consumare una **Promise** con `.then`, `.catch`, `.finally`;
- scrivere funzioni `async` con `await` e gestire gli errori con `try`/`catch`/`finally`;
- eseguire più operazioni in parallelo con `Promise.all`.

---

## 📋 Prerequisiti
- [Capitolo 06 — ES Modules](./06_ES_Modules.md): `js-lab/data/mockData.js` e `"type": "module"`.
- [Capitolo 02 — Funzioni](./02_Functions_Arrow_Functions.md) (callback).
- Node.js 22 LTS.

---

## 🧭 In questo capitolo
- Codice sincrono e asincrono; `setTimeout`.
- Promise: stati e concatenazione.
- `async`/`await` e gestione degli errori.
- `Promise.all` e parallelismo.
- Anteprima: `AbortController` e `fetch` (Day 5).
- Esercizio: un bonifico simulato con ritardo e rifiuto.

---

## 🧠 Theory

### Sincrono e asincrono
JavaScript esegue il codice **una riga alla volta** (un solo thread). Le operazioni lente (timer, rete) non devono bloccarlo: vengono avviate, e il risultato arriva **dopo** tramite un callback o una Promise. Nel nostro laboratorio simuliamo la rete con `setTimeout`: nessuna API reale.

### Promise
Una **Promise** rappresenta un risultato futuro. Ha tre stati:

| Stato | Significato |
|---|---|
| `pending` | operazione in corso |
| `fulfilled` | completata con un valore |
| `rejected` | fallita con un errore |

Si consuma con:

- `.then(valore => ...)`: quando è `fulfilled`;
- `.catch(errore => ...)`: quando è `rejected`;
- `.finally(() => ...)`: in ogni caso, alla fine.

### `async` e `await`
- Una funzione `async` restituisce **sempre una Promise**: il valore di `return` la risolve, un `throw` la rifiuta.
- `await promessa` mette in pausa la funzione `async` finché la Promise non è risolta e restituisce il valore (oppure lancia l'errore, catturabile con `try`/`catch`).
- `await` si può usare solo dentro una funzione `async` (o al livello più alto di un ES Module, come negli esempi di questo capitolo).

### Gli stati dell'interfaccia
Ogni caricamento ha tre momenti: **in corso** (loading), **riuscito** (dati), **fallito** (errore). Nel Day 5 avrai tre variabili di state (`isLoading`, `transactions`, `error`) che rispecchiano esattamente questo ciclo.

> 💡 **Remember**
>
> Dimenticare `await` è l'errore più comune: ottieni la Promise (`Promise { <pending> }`) invece dei dati. E una Promise rifiutata senza `catch` fa terminare Node con un errore.

---

## 💻 Let's Code

### Un'API finta con ritardo
Crea la cartella `services/` dentro `js-lab/` e il file `js-lab/services/fakeApi.js`:

```javascript
import { accounts, transactions } from "../data/mockData.js";

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAccounts() {
  await wait(400);
  return accounts;
}

export async function getTransactions() {
  await wait(600);
  return transactions;
}

export async function getTransactionsByAccount(accountId) {
  await wait(300);

  if (!accounts.some((account) => account.id === accountId)) {
    throw new Error(`Conto ${accountId} non trovato`);
  }

  return transactions.filter((transaction) => transaction.accountId === accountId);
}
```

`wait(ms)` crea una Promise che si risolve dopo `ms` millisecondi: `resolve` è la funzione che "completa" la Promise (qui, senza valore). Questo file è solo per il laboratorio: nel progetto React il file equivalente sarà `src/services/transactionService.js` ([Day 5](../Day_05_Effects_API/04_Fetch_API.md)), che leggerà un file JSON statico locale.

### L'ordine di esecuzione
Crea `js-lab/07-event-loop.js`:

```javascript
console.log("1. inizio");

setTimeout(() => console.log("3. dopo 500 ms"), 500);

console.log("2. fine del codice sincrono");
```

Dentro `js-lab/` esegui:

```bash
node 07-event-loop.js
```

```text
1. inizio
2. fine del codice sincrono
3. dopo 500 ms
```

Il callback del timer non blocca il programma: la riga 2 viene stampata prima della 3.

### Promise con `.then`, `.catch`, `.finally`
Crea `js-lab/07-promises.js`:

```javascript
import { getAccounts, getTransactionsByAccount } from "./services/fakeApi.js";

console.log(getAccounts());

await getAccounts()
  .then((accounts) => {
    console.log(`Conti: ${accounts.length}`);
    return getTransactionsByAccount(accounts[0].id);
  })
  .then((list) => console.log(`Movimenti del primo conto: ${list.length}`))
  .catch((error) => console.log(`Errore: ${error.message}`))
  .finally(() => console.log("Fine"));
```

Esegui `node 07-promises.js`:

```text
Promise { <pending> }
Conti: 2
Movimenti del primo conto: 6
Fine
```

- La prima riga mostra una Promise ancora `pending`: i dati non ci sono ancora.
- Restituire una Promise dentro un `.then` permette di **concatenare** operazioni dipendenti.
- Un errore in qualsiasi punto salta direttamente al `.catch`.

### `async`/`await` con `try`/`catch`/`finally`
Crea `js-lab/07-async-await.js`:

```javascript
import { getTransactionsByAccount } from "./services/fakeApi.js";

async function loadTransactions(accountId) {
  console.log("Caricamento...");

  try {
    const result = await getTransactionsByAccount(accountId);
    console.log(`Trovati ${result.length} movimenti`);
  } catch (error) {
    console.log(`Errore: ${error.message}`);
  } finally {
    console.log("Fine caricamento");
  }
}

await loadTransactions("acc-001");
await loadTransactions("acc-999");
```

Esegui `node 07-async-await.js`:

```text
Caricamento...
Trovati 6 movimenti
Fine caricamento
Caricamento...
Errore: Conto acc-999 non trovato
Fine caricamento
```

Il codice si legge dall'alto al basso come se fosse sincrono. `finally` viene eseguito sia in caso di successo sia di errore: è il posto giusto per "spegnere" lo stato di caricamento.

Nel Day 5 questa struttura diventa:

```text
setIsLoading(true)  →  try { await ... setTransactions(...) }  →  catch { setError(...) }  →  finally { setIsLoading(false) }
```

### `Promise.all`: operazioni in parallelo
Aggiungi in fondo a `js-lab/07-async-await.js` (e aggiorna la prima riga di import):

```javascript
import { getAccounts, getTransactions, getTransactionsByAccount } from "./services/fakeApi.js";
```

```javascript
console.time("sequenziale");
await getAccounts();
await getTransactions();
console.timeEnd("sequenziale");

console.time("parallelo");
const [accounts, transactions] = await Promise.all([getAccounts(), getTransactions()]);
console.timeEnd("parallelo");

console.log(accounts.length, transactions.length);
```

Output indicativo (i tempi esatti variano ad ogni esecuzione):

```text
sequenziale: 1.022s
parallelo: 607.466ms
2 8
```

Nella versione sequenziale la seconda richiesta parte solo quando la prima è finita (≈ 400 + 600 ms); con `Promise.all` partono insieme e il tempo totale è quello della più lenta (≈ 600 ms). `Promise.all` restituisce un array di risultati **nello stesso ordine** delle Promise e, se **una** viene rifiutata, si rifiuta subito anch'essa (usa `Promise.allSettled` se vuoi conoscere l'esito di tutte). Usalo solo per richieste **indipendenti**.

### Anteprima Day 5: `fetch` e `AbortController`
Nel Day 5 recupererai i movimenti con `fetch`, che restituisce una Promise. Due fatti da ricordare già ora:

- `fetch` si rifiuta solo per errori di rete: una risposta `404` o `500` è una Promise **risolta**, quindi dovrai controllare `response.ok`;
- per annullare una richiesta si usa un `AbortController`, il cui `signal` si passa a `fetch`.

```javascript
const controller = new AbortController();

controller.abort();

console.log(controller.signal.aborted);
```

```text
true
```

Non serve altro adesso: lo useremo con `useEffect` e il suo cleanup nel [Day 5](../Day_05_Effects_API/03_Dipendenze_e_Cleanup.md). Un'altra regola di React che anticipiamo: la funzione passata a `useEffect` **non** si dichiara `async`; si definisce una funzione `async` all'interno e la si chiama.

---

## 🏦 LipariBank in action
- **Day 4:** il bonifico simulato non fa transazioni reali e aggiunge subito il movimento allo state; qui lo rendi asincrono (con attesa e rifiuto) solo per esercitarti sulle Promise.
- **Day 5:** `getTransactions({ signal })` in `src/services/transactionService.js` restituisce una Promise; `Dashboard.jsx` mostra loading, errore o lista in base all'esito ([Day 5 · Loading, Error, Empty](../Day_05_Effects_API/05_Loading_Error_Empty_States.md)).
- **Day 7:** il service layer incapsula `fetch` e gli errori in un solo punto.

---

## 🧪 Your Turn
**Obiettivo:** simulare l'invio di un bonifico con attesa, controlli e rifiuto.

**Requisiti**

1. In `js-lab/services/fakeApi.js` aggiungi `export async function createTransfer({ accountId, beneficiaryId, amount })` (aggiungi `beneficiaries` all'import da mockData) che:
   - attende `wait(800)`;
   - cerca conto e beneficiario; se uno dei due non esiste lancia `new Error("Conto o beneficiario non valido")`;
   - se `amount` è maggiore del saldo del conto lancia `new Error("Saldo insufficiente")`;
   - altrimenti restituisce un nuovo movimento `{ id, accountId, date: "2026-10-28", description: "Bonifico a <nome beneficiario>", amount: -amount, category: "Bonifici" }` (come nel [capitolo 05](./05_Destructuring_Spread_Rest.md), `id` con `Date.now()`).
2. In `js-lab/07-exercise.js` scrivi `async function submitTransfer(values)` con una variabile `let isLoading = false`: imposta `true` prima della chiamata, usa `try`/`catch`/`finally` e rimetti `false` nel `finally`. Stampa `isLoading: ...` a ogni cambio e il risultato (descrizione e importo) oppure `Errore: <messaggio>`.
3. Chiama `submitTransfer` con `{ accountId: "acc-001", beneficiaryId: "ben-001", amount: 250.5 }` e poi con `{ accountId: "acc-001", beneficiaryId: "ben-001", amount: 5000 }` (una dopo l'altra con `await`).
4. Alla fine usa `Promise.all` per caricare conti e movimenti e stampa le due lunghezze.

**Passi suggeriti:** prima scrivi `createTransfer` e provalo con un `.then(console.log)`; poi costruisci `submitTransfer` partendo dalla struttura di `loadTransactions`.

**Risultato atteso:**

```text
isLoading: true
Bonifico a Giulia Bianchi -250.5
isLoading: false
isLoading: true
Errore: Saldo insufficiente
isLoading: false
Conti: 2 — Movimenti: 8
```

**Criteri di completamento:** nessuna Promise senza gestione dell'errore; `isLoading` torna a `false` in entrambi i casi; l'ultima riga è ottenuta con `Promise.all`.

---

## ⚠️ Common Mistakes
- **Dimenticare `await`**: ottieni una Promise invece dei dati.
- **`await` fuori da una funzione `async`** (in un file non modulo): `SyntaxError`.
- **Nessun `catch`**: la Promise rifiutata (`unhandled rejection`) fa terminare Node.
- **`forEach` con `await` dentro**: non aspetta. Usa `for...of` oppure `Promise.all` con `map`.
- **Eseguire in sequenza richieste indipendenti**: usa `Promise.all`.
- **Aspettarsi che `fetch` si rifiuti per un 404**: controlla `response.ok`.
- **Nel `setTimeout`, chiamare invece di passare la funzione**: `setTimeout(fn(), 500)` la esegue subito.

---

## ✅ Checklist
- ☐ So spiegare perché "2." viene stampato prima di "3." nell'esempio del timer.
- ☐ So indicare i tre stati di una Promise.
- ☐ So scrivere `try`/`catch`/`finally` con `await`.
- ☐ So quando usare `Promise.all`.
- ☐ Ho completato `createTransfer` e `07-exercise.js`.

---

## 🚀 Challenge
Aggiungi un timeout di sicurezza: scrivi `withTimeout(promise, ms)` che rifiuta con `Error("Timeout")` se la Promise non si risolve entro `ms`, usando `Promise.race([promise, <Promise che si rifiuta dopo ms>])`. Provala con `createTransfer` e `ms = 500`.

---

## 📌 Recap
- Le operazioni lente non bloccano JavaScript: il risultato arriva più tardi.
- Una Promise è `pending`, `fulfilled` o `rejected`; si consuma con `.then`/`.catch`/`.finally`.
- `async`/`await` + `try`/`catch`/`finally` rendono il codice leggibile e gestiscono gli errori.
- `Promise.all` esegue richieste indipendenti in parallelo.
- `fetch` restituisce una Promise (Day 5); si annulla con `AbortController`.

*Dove lo userai:* [Day 5 · Fetch API](../Day_05_Effects_API/04_Fetch_API.md) e [Day 4 · Submit e feedback](../Day_04_Forms_User_Input/04_Submit_e_Feedback.md).

---

### ➡️ Next
[Capitolo 08 — Optional chaining, nullish coalescing e ternario](./08_Optional_Chaining_Ternary.md): gestisci dati mancanti e scrivi condizioni compatte, come nel JSX.
