# 🏦 LipariBank — React Zero to Hero

> **Extra JavaScript · Capitolo 05**
> **Argomento:** Destructuring, spread, rest e immutabilità dei dati
> **Durata stimata:** 30 minuti
> **Parte di LipariBank:** aggiornamento di movimenti e conti senza modificare i dati originali (state di Day 3 e Day 4)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- estrarre proprietà da oggetti e valori da array con il destructuring (anche nei parametri di funzione);
- copiare e combinare oggetti e array con lo **spread** (`...`);
- usare il **rest** per raccogliere il resto dei valori;
- aggiungere, rimuovere e aggiornare elementi **senza mutare** l'array originale.

---

## 📋 Prerequisiti
- [Capitolo 03 — Oggetti e array](./03_Objects_Arrays.md) e [Capitolo 04 — map, filter, reduce](./04_Map_Filter_Reduce.md).
- `js-lab/mockData.js` e `js-lab/package.json` con `"type": "module"`.

---

## 🧭 In questo capitolo
- Destructuring di oggetti (rinomina, default) e array.
- Destructuring nei parametri: la forma delle props.
- Spread di oggetti e array.
- Rest nei parametri e nel destructuring.
- Pattern immutabili: aggiungere, rimuovere, aggiornare.
- Copia superficiale e oggetti annidati.

---

## 🧠 Theory

### Destructuring
Permette di estrarre valori in variabili con una sola istruzione.

- **Oggetti:** `const { firstName, lastName } = customer;` — si usano i **nomi delle proprietà**. Per rinominare: `{ balance: currentBalance }`. Per un valore di default: `{ nickname = "Cliente" }`.
- **Array:** `const [first, second] = list;` — conta la **posizione**. Con il rest: `const [first, ...others] = list;`.

### Spread
`...` "apre" un array o un oggetto per inserirne gli elementi altrove:

- `[...a, ...b]` unisce array; `[nuovo, ...a]` aggiunge in testa.
- `{ ...oggetto, balance: 10 }` copia l'oggetto e **sovrascrive** una proprietà (l'ultima vince).

Lo spread crea una **copia superficiale** (*shallow*): gli oggetti annidati restano condivisi.

### Rest
Con la stessa sintassi `...` ma in **ricezione**: in una funzione raccoglie gli argomenti (`function sum(...amounts)`); nel destructuring raccoglie il "resto" (`const { id, ...others } = transaction`).

### Immutabilità
Un dato è trattato come **immutabile** quando, per cambiarlo, crei una **nuova copia** invece di modificare l'originale. React confronta i riferimenti: se l'array dello state è lo stesso riferimento, non si accorge del cambiamento. I tre pattern base:

| Operazione | Pattern |
|---|---|
| aggiungere | `[nuovo, ...lista]` |
| rimuovere | `lista.filter((item) => item.id !== id)` |
| aggiornare | `lista.map((item) => (item.id === id ? { ...item, campo: valore } : item))` |

> 💡 **Remember**
>
> `...` significa due cose in base alla posizione: **spread** quando espande (a destra di `=`, dentro `[]`/`{}` o negli argomenti di una chiamata), **rest** quando raccoglie (a sinistra di `=` o nei parametri di funzione).

---

## 💻 Let's Code

Crea `js-lab/05-destructuring.js`. Gli snippet vanno aggiunti in ordine nello stesso file; esegui con (dentro `js-lab/`):

```bash
node 05-destructuring.js
```

### Destructuring di oggetti
```javascript
import { customer, accounts, transactions, beneficiaries } from "./mockData.js";

const { firstName, lastName } = customer;
const { balance: currentBalance, currency = "EUR", nickname = "Cliente" } = accounts[0];

console.log(firstName, lastName);
console.log(currentBalance, currency, nickname);
```

```text
Mario Rossi
4250.75 EUR Cliente
```

`balance: currentBalance` crea la variabile `currentBalance` leggendo `balance`. `nickname` non esiste nell'oggetto, quindi prende il default.

### Destructuring di array
```javascript
const [checkingAccount, savingsAccount] = accounts;
const [latestTransaction, ...olderTransactions] = transactions;

console.log(checkingAccount.name, savingsAccount.name);
console.log(latestTransaction.id, olderTransactions.length);
```

```text
Conto Corrente Conto Risparmio
trx-001 7
```

Lo stesso schema è usato dagli hook di React: `const [count, setCount] = useState(0)` è un destructuring di array ([Day 3 · useState](../Day_03_State_Events/02_useState.md)).

### Destructuring nei parametri
```javascript
function describeAccount({ name, balance, currency = "EUR" }) {
  return `${name}: ${balance} ${currency}`;
}

console.log(describeAccount(accounts[1]));
```

```text
Conto Risparmio: 12800 EUR
```

Un componente React riceve un solo argomento (le *props*) e lo destruttura così: `function AccountCard({ name, balance })` ([Day 2 · Props](../Day_02_Components_Props/02_Props.md)).

### Spread di oggetti: copiare e aggiornare
```javascript
const updatedAccount = { ...accounts[0], balance: 4000.25 };

console.log(updatedAccount.balance, accounts[0].balance);
console.log(updatedAccount === accounts[0]);
```

```text
4000.25 4250.75
false
```

L'oggetto originale non cambia; `updatedAccount` è un nuovo oggetto con tutte le proprietà copiate e `balance` sovrascritto.

### Rest
```javascript
function sumAmounts(...amounts) {
  return amounts.reduce((total, amount) => total + amount, 0);
}

const { id, ...transactionWithoutId } = transactions[0];

console.log(sumAmounts(100, 20.5, -10));
console.log(id, Object.keys(transactionWithoutId));
```

```text
110.5
trx-001 [ 'accountId', 'date', 'description', 'amount', 'category' ]
```

### Pattern immutabili sui movimenti
```javascript
const newTransaction = {
  id: "trx-009",
  accountId: "acc-001",
  date: "2026-10-28",
  description: "Caffè",
  amount: -1.2,
  category: "Alimentari",
};

const withNew = [newTransaction, ...transactions];
const withoutGym = transactions.filter((transaction) => transaction.id !== "trx-004");
const withFavorite = transactions.map((transaction) =>
  transaction.id === "trx-001" ? { ...transaction, favorite: true } : transaction,
);

console.log(transactions.length, withNew.length, withoutGym.length);
console.log(withFavorite[0].favorite, transactions[0].favorite);
console.log(withFavorite[1] === transactions[1]);
```

```text
8 9 7
true undefined
true
```

- Nessuna operazione ha toccato `transactions`.
- Nell'aggiornamento, gli elementi **non** modificati sono riusati così come sono (`withFavorite[1] === transactions[1]` è `true`): solo l'elemento cambiato è un nuovo oggetto. L'operatore `? :` è spiegato nel [capitolo 08](./08_Optional_Chaining_Ternary.md): qui leggilo come "se... allora... altrimenti".

### Verificare che non muti: `Object.freeze`
```javascript
const frozenAccount = Object.freeze({ ...accounts[0] });

try {
  frozenAccount.balance = 0;
} catch (error) {
  console.log(error.message);
}
```

```text
Cannot assign to read only property 'balance' of object '#<Object>'
```

`Object.freeze` impedisce ogni modifica (negli ES Modules, che sono in *strict mode*, il tentativo lancia un errore; in codice non strict viene ignorato in silenzio). È un modo per scoprire se una funzione muta i dati.

### Copia superficiale
```javascript
const settings = { theme: "light", preferences: { hideBalance: false } };

const shallowCopy = { ...settings };
const updatedSettings = {
  ...settings,
  preferences: { ...settings.preferences, hideBalance: true },
};

console.log(shallowCopy.preferences === settings.preferences);
console.log(settings.preferences.hideBalance, updatedSettings.preferences.hideBalance);
```

```text
true
false true
```

Lo spread copia solo il primo livello: `shallowCopy.preferences` è lo stesso oggetto di `settings.preferences`. Per aggiornare un valore annidato devi copiare **ogni livello** lungo il percorso.

### Creare un bonifico simulato
```javascript
function createTransfer({ accountId, beneficiary, amount }) {
  return {
    id: `trx-${Date.now()}`,
    accountId,
    date: "2026-10-28",
    description: `Bonifico a ${beneficiary.name}`,
    amount: -amount,
    category: "Bonifici",
  };
}

const transfer = createTransfer({ accountId: "acc-001", beneficiary: beneficiaries[0], amount: 250.5 });
console.log(transfer.description, transfer.amount, transfer.category);
```

```text
Bonifico a Giulia Bianchi -250.5 Bonifici
```

Nota `accountId,` senza valore: è la scorciatoia per `accountId: accountId`. La data è fissa per semplicità didattica; l'`id` usa un timestamp, come nel Day 4.

---

## 🏦 LipariBank in action
Nel [Day 3](../Day_03_State_Events/05_Immutabilita_dello_State.md) lo state `transactions` si aggiorna esattamente con questi pattern (`[nuovo, ...lista]`, `filter`, `map` + spread). Nel [Day 4](../Day_04_Forms_User_Input/04_Submit_e_Feedback.md) `handleAddTransfer` aggiunge un bonifico simulato con la stessa forma di `createTransfer`. Nei componenti userai il destructuring delle props in ogni file.

---

## 🧪 Your Turn
**Obiettivo:** scrivere le quattro funzioni di aggiornamento che userai sullo state.

**Requisiti** (file `js-lab/05-exercise.js`, con import da `./mockData.js`):

1. `addTransaction(list, transaction)`: restituisce un **nuovo** array con il movimento **in testa**.
2. `removeTransaction(list, id)`: restituisce un nuovo array senza il movimento con quell'`id`.
3. `toggleFavorite(list, id)`: restituisce un nuovo array in cui il movimento indicato ha `favorite` invertito (`undefined` diventa `true`, `true` diventa `false`); gli altri elementi non cambiano.
4. `applyDebit(accounts, accountId, amount)`: restituisce un nuovo array di conti in cui il saldo di `accountId` è diminuito di `amount`, arrotondato a due decimali con `Math.round(value * 100) / 100`.
5. Prima di chiamarle, rendi immutabili i dati: `const frozenTransactions = Object.freeze(transactions.map((transaction) => Object.freeze({ ...transaction })));` e analogamente per i conti. Se una funzione muta qualcosa, Node lancia un errore.
6. Stampa le lunghezze degli array risultanti, il valore di `favorite` e i nuovi saldi.

**Passi suggeriti:** scrivi e prova una funzione per volta; in `toggleFavorite` usa `{ ...transaction, favorite: !transaction.favorite }` solo per l'elemento giusto.

**Risultato atteso** (aggiungendo un movimento qualsiasi, rimuovendo `trx-004`, alternando `trx-001` due volte e addebitando `250.5` da `acc-001`):

```text
9 7
true false
4000.25 12800
```

(righe: lunghezze dopo aggiunta e rimozione; `favorite` dopo il primo e dopo il secondo toggle; saldi dei due conti.)

**Criteri di completamento:** nessun errore di scrittura su dati congelati; le liste originali hanno ancora 8 movimenti e `acc-001` ha ancora saldo `4250.75`.

---

## ⚠️ Common Mistakes
- **Pensare che lo spread sia una copia profonda**: gli oggetti annidati restano condivisi.
- **Mutare dopo la copia** (`const copy = list; copy.push(x)`): `copy` è lo stesso riferimento. Usa `[...list, x]`.
- **Ordine dello spread**: `{ balance: 1, ...account }` lascia vincere `account.balance`; per sovrascrivere metti la proprietà **dopo** lo spread.
- **Destructuring di `undefined`**: `const { name } = undefined` lancia un errore.
- **Confondere rest e spread**: stessa sintassi, ruolo opposto (raccoglie / espande).
- **Dimenticare le parentesi** nei parametri destrutturati di un'arrow function: `({ name }) => ...`.

---

## ✅ Checklist
- ☐ So destrutturare oggetti (con rinomina e default) e array.
- ☐ So scrivere `function Card({ title, children })` capendo cosa fa.
- ☐ Distinguo spread e rest dalla posizione.
- ☐ So aggiungere, rimuovere e aggiornare un elemento senza mutare l'array.
- ☐ Ho completato `05-exercise.js` con dati congelati.

---

## 🚀 Challenge
Scrivi `updateSettings(settings, changes)` che applica un cambiamento nel secondo livello (`preferences.hideBalance`) senza mutare l'oggetto originale, e verifica con `Object.freeze` annidato (congela anche `settings.preferences`).

---

## 📌 Recap
- Il destructuring estrae valori da oggetti (per nome) e array (per posizione); funziona anche nei parametri.
- Lo spread copia/combina (copia superficiale); il rest raccoglie il resto.
- Per aggiornare dati: `[nuovo, ...lista]`, `filter`, `map` + `{ ...item, campo }`.
- Per aggiornare dati annidati si copia ogni livello.

*Dove lo userai:* props e destructuring ([Day 2](../Day_02_Components_Props/02_Props.md)) e state immutabile ([Day 3](../Day_03_State_Events/05_Immutabilita_dello_State.md)).

---

### ➡️ Next
[Capitolo 06 — ES Modules](./06_ES_Modules.md): dividi il codice in file, con `export` e `import`, come in un progetto React.
