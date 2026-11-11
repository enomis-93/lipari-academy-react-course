# 🏦 LipariBank — React Zero to Hero

> **Extra JavaScript · Capitolo 02**
> **Argomento:** Funzioni, parametri, return, arrow functions e callback
> **Durata stimata:** 25 minuti
> **Parte di LipariBank:** le funzioni di formattazione `formatCurrency` e `formatDate` (che nel Day 1 vivranno in `src/utils/formatters.js`)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- scrivere funzioni con parametri, valori di default e `return`;
- convertire una funzione tradizionale in arrow function (anche con `return` implicito);
- passare una funzione come argomento (callback) e restituire una funzione da un'altra;
- scrivere `formatCurrency` e `formatDate` per i dati di LipariBank.

---

## 📋 Prerequisiti
- [Capitolo 01 — Variabili e tipi](./01_Variables_Types.md) e la cartella `js-lab/` con `package.json`.
- Node.js 22 LTS ([Day 0 · Node e npm](../Day_00_Setup/02_Node_NPM.md)).

---

## 🧭 In questo capitolo
- Dichiarazione di funzione e funzione come valore.
- Parametri, default e `return`.
- Arrow functions e `return` implicito.
- Callback e funzioni che restituiscono funzioni.
- Funzioni pure.
- Esercizio: le utility di formattazione di LipariBank.

---

## 🧠 Theory

### Che cos'è una funzione
Una funzione è un blocco di codice con un nome che riceve **parametri**, esegue istruzioni e può restituire un valore con `return`. Se non c'è `return`, la funzione restituisce `undefined`.

In React un **componente è una funzione** che restituisce JSX: tutto ciò che impari qui vale anche lì.

### Tre modi di scriverla
```javascript
function double(value) {
  return value * 2;
}

const doubleExpression = function (value) {
  return value * 2;
};

const doubleArrow = (value) => value * 2;
```

Le tre versioni fanno lo stesso. Nel corso usiamo la dichiarazione `function` per i componenti e le utility principali, e le **arrow function** per i callback brevi.

### Arrow functions
- Con un solo parametro le parentesi sono facoltative, ma noi le scriviamo sempre: `(value) => ...`.
- Se il corpo è una sola espressione, senza graffe, il risultato è restituito **implicitamente**.
- Se il corpo ha le graffe `{ }`, serve `return` esplicito.
- Per restituire **un oggetto** con `return` implicito bisogna avvolgerlo in parentesi tonde: `() => ({ a: 1 })`. Senza parentesi le graffe sono lette come corpo della funzione.

### Parametri di default
```javascript
function greet(name = "cliente") {
  return `Buongiorno, ${name}`;
}
```
Il default vale solo se l'argomento è `undefined` (o omesso).

### Callback
Le funzioni sono **valori**: si possono salvare in una variabile, passare come argomento e restituire. Una funzione passata a un'altra perché venga chiamata più tardi si chiama *callback*. `setTimeout`, `forEach`, `map` e i gestori di eventi di React funzionano così.

### Funzioni pure
Una funzione è *pura* se, dati gli stessi argomenti, restituisce sempre lo stesso risultato e non modifica nulla all'esterno. I componenti React devono comportarsi così rispetto alle loro props.

> 💡 **Remember**
>
> Passare `handleClick` (la funzione) è diverso da passare `handleClick()` (il **risultato** della chiamata). Quando passi un callback, non aggiungere le parentesi di chiamata.

---

## 💻 Let's Code

### `formatCurrency` e `formatDate`
Crea `js-lab/02-functions.js`:

```javascript
const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  useGrouping: "always",
});

function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

const formatDate = (isoString) => new Date(isoString).toLocaleDateString("it-IT");

console.log(formatCurrency(4250.75));
console.log(formatCurrency(-62.4));
console.log(formatCurrency(12800));
console.log(formatDate("2026-10-27"));
```

Dentro `js-lab/` esegui:

```bash
node 02-functions.js
```

Risultato atteso:

```text
4.250,75 €
-62,40 €
12.800,00 €
27/10/2026
```

Cosa succede:

- `Intl.NumberFormat` è l'API del linguaggio per formattare numeri secondo una lingua: virgola decimale, simbolo euro, sempre due decimali. Il formatter si crea **una volta** fuori dalla funzione.
- `formatDate` è un'arrow function a espressione singola: il valore calcolato è restituito senza scrivere `return`.

Due dettagli da conoscere:

- Tra la cifra e il simbolo `€` il formattatore inserisce uno **spazio non separabile** (non uno spazio normale): se confronti il testo con `===` ricorda questa differenza.
- Con la lingua `it-IT`, per impostazione predefinita i numeri a **quattro cifre** non ricevono il separatore delle migliaia (`4250,75 €`), mentre da cinque cifre in su sì (`17.050,75 €`). L'opzione `useGrouping: "always"` forza il separatore anche con quattro cifre (`4.250,75 €`): nel corso la usiamo per avere sempre lo stesso formato.

Inoltre `new Date("2026-10-27")` interpreta la data come mezzanotte UTC: in Italia mostra il giorno corretto, in fusi orari a ovest di Greenwich potrebbe mostrare il giorno precedente.

### Parametri di default e `return` anticipato
Aggiungi a `js-lab/02-functions.js`:

```javascript
function getTransactionType(amount) {
  if (amount > 0) {
    return "income";
  }
  return "expense";
}

function calculateTransferFee(amount, isUrgent = false) {
  if (!isUrgent) {
    return 0;
  }
  return Math.max(1.5, amount * 0.001);
}

console.log(getTransactionType(2100), getTransactionType(-62.4));
console.log(calculateTransferFee(100), calculateTransferFee(100, true));
```

Risultato atteso:

```text
income expense
0 1.5
```

`getTransactionType` esce appena trova la risposta (*early return*): non serve `else`. In `calculateTransferFee` il parametro `isUrgent` vale `false` se non viene passato. (La commissione è inventata a scopo didattico.)

### Callback
Aggiungi in fondo:

```javascript
function applyToAll(items, callback) {
  for (const item of items) {
    callback(item);
  }
}

const amounts = [-62.4, -88.9, 2100];

applyToAll(amounts, (amount) => console.log(formatCurrency(amount)));
```

Risultato atteso:

```text
-62,40 €
-88,90 €
2.100,00 €
```

`applyToAll` non sa cosa farà il callback: lo decide chi la chiama. È lo stesso schema di `forEach` e `map` (capitolo 04).

### Funzioni che restituiscono funzioni
```javascript
const createSelectHandler = (accountId) => () => {
  console.log(`Conto selezionato: ${accountId}`);
};

const selectChecking = createSelectHandler("acc-001");
selectChecking();
```

```text
Conto selezionato: acc-001
```

`selectChecking` "ricorda" `accountId`: è una *closure*. In React vedrai `onClick={() => onSelectAccount(account.id)}`: stesso meccanismo.

---

## 🏦 LipariBank in action
Nel [Day 1](../Day_01_React_Fundamentals/06_Esercizio_LipariBank_Dashboard.md) creerai `src/utils/formatters.js` con esattamente `formatCurrency(amount)` e `formatDate(isoString)`, e li userai nei componenti `BalanceCard` e `TransactionItem`. Nel Day 2 una funzione come `getTransactionType` deciderà se applicare la classe CSS verde o rossa all'importo. I componenti stessi sono funzioni: `function Header() { return ...; }`.

---

## 🧪 Your Turn
**Obiettivo:** scrivere le utility di formattazione e classificazione dei movimenti.

**Requisiti** (file `js-lab/02-exercise.js`, nessun `import` necessario):

1. `formatCurrency(amount)`: dichiarazione `function` che usa `Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", useGrouping: "always" })`.
2. `formatDate(isoString)`: arrow function con `return` implicito che usa `toLocaleDateString("it-IT")`.
3. `getAmountClassName(amount)`: arrow function che restituisce `"amount-positive"` se `amount > 0`, altrimenti `"amount-negative"`.
4. `describeTransaction(transaction, formatter)`: riceve un movimento e una **funzione formattatrice** (callback) e restituisce una stringa `"<descrizione>: <importo formattato>"`.
5. `createFeeCalculator(percentage)`: restituisce una funzione `(amount) => amount * percentage / 100`.
6. Verifica con questi movimenti:

```javascript
const transaction = { id: "trx-003", date: "2026-10-23", description: "Stipendio", amount: 2100.0 };
```

**Passi suggeriti:** implementa e prova una funzione per volta con `console.log`; per il punto 4 chiama `describeTransaction(transaction, formatCurrency)` passando la funzione **senza** parentesi.

**Risultato atteso:**

```text
Stipendio: 2.100,00 €
23/10/2026
amount-positive amount-negative
2.5
```

L'ultima riga si ottiene con `createFeeCalculator(2.5)(100)`; le righe 2 e 3 con `formatDate(transaction.date)` e `getAmountClassName(2100)`, `getAmountClassName(-62.4)`.

**Criteri di completamento:** tutte le funzioni sono `function` o arrow come richiesto; nessuna funzione modifica l'oggetto `transaction`; l'output coincide.

---

## ⚠️ Common Mistakes
- **Dimenticare `return`** in una funzione con graffe: restituisce `undefined`.
- **`() => { id: 1 }`**: le graffe sono un blocco, non un oggetto. Scrivi `() => ({ id: 1 })`.
- **Chiamare il callback al posto di passarlo**: `setTimeout(fn(), 500)` esegue subito `fn`; correttamente `setTimeout(fn, 500)` o `setTimeout(() => fn(), 500)`.
- **Ricreare il formatter a ogni chiamata** in cicli grandi: costruiscilo una volta fuori dalla funzione.
- **Confrontare l'output di `formatCurrency` con uno spazio normale**: contiene uno spazio non separabile.

---

## ✅ Checklist
- ☐ So scrivere la stessa funzione in tre forme.
- ☐ So quando serve `return` esplicito e quando no.
- ☐ So restituire un oggetto da un'arrow function.
- ☐ Ho passato un callback senza chiamarlo per errore.
- ☐ Ho completato `02-exercise.js` con l'output atteso.

---

## 🚀 Challenge
Scrivi `formatTransactionRow(transaction)` che restituisce `27/10/2026 · Spesa supermercato · -62,40 €` riutilizzando `formatDate` e `formatCurrency`. Poi rendi la valuta un parametro con default `"EUR"`.

---

## 📌 Recap
- Le funzioni sono valori: si assegnano, si passano e si restituiscono.
- Le arrow function hanno `return` implicito solo senza graffe; gli oggetti vanno tra parentesi.
- I parametri di default coprono `undefined`.
- Un callback è una funzione passata ad altre funzioni: la passi senza parentesi di chiamata.
- Preferisci funzioni pure: come i componenti React rispetto alle props.

*Dove lo userai:* [Day 1 · Function Components](../Day_01_React_Fundamentals/04_Function_Components.md), gestori di eventi ([Day 3](../Day_03_State_Events/01_Event_Handling.md)) e callback ricevuti via props.

---

### ➡️ Next
[Capitolo 03 — Oggetti e array](./03_Objects_Arrays.md): impari a leggere e modificare i dati strutturati di LipariBank (conti, movimenti, beneficiari).
