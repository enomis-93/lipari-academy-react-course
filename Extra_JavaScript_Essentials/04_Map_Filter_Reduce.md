# 🏦 LipariBank — React Zero to Hero

> **Extra JavaScript · Capitolo 04**
> **Argomento:** `map`, `filter`, `reduce` applicati a conti e movimenti
> **Durata stimata:** 30 minuti
> **Parte di LipariBank:** saldo totale, ultimi movimenti, filtri entrate/uscite e ricerca (Day 1–3)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- trasformare un array con `map` e selezionare elementi con `filter`;
- calcolare totali con `reduce`, indicando sempre il valore iniziale;
- concatenare più metodi per ottenere gli "ultimi cinque movimenti";
- arrotondare correttamente le somme di importi decimali.

---

## 📋 Prerequisiti
- [Capitolo 02 — Funzioni](./02_Functions_Arrow_Functions.md) (arrow function e callback).
- [Capitolo 03 — Oggetti e array](./03_Objects_Arrays.md) e `js-lab/mockData.js`.

---

## 🧭 In questo capitolo
- `map`: da un array a un altro array della stessa lunghezza.
- `filter`: un sottoinsieme dell'array.
- `reduce`: un singolo valore (numero, oggetto, ...) da un array.
- Concatenare i metodi.
- Il problema dei decimali nelle somme.
- Esercizio: il riepilogo della dashboard.

---

## 🧠 Theory

### I tre metodi in una riga ciascuno
| Metodo | Callback riceve | Restituisce |
|---|---|---|
| `map` | `(elemento, indice)` | nuovo array **della stessa lunghezza** con i valori trasformati |
| `filter` | `(elemento, indice)` | nuovo array con **solo** gli elementi per cui il callback è truthy |
| `reduce` | `(accumulatore, elemento)` | **un valore** costruito elemento per elemento, a partire da un valore iniziale |

Nessuno dei tre modifica l'array originale. Per questo sono i metodi preferiti in React: producono nuovi array senza mutare lo state.

### `reduce` in dettaglio
`array.reduce((accumulatore, elemento) => nuovoAccumulatore, valoreIniziale)`

1. L'accumulatore parte dal **valore iniziale** (secondo argomento).
2. Per ogni elemento il callback restituisce il nuovo accumulatore.
3. Il risultato finale è l'ultimo accumulatore.

Il valore iniziale non è facoltativo "nella pratica": senza di esso, su un array **vuoto** `reduce` lancia un errore, e su array di oggetti il primo accumulatore sarebbe il primo oggetto, non un numero.

### `forEach` non è `map`
`forEach` esegue un callback per ogni elemento ma restituisce `undefined`. Se vuoi un nuovo array usa `map`.

> 💡 **Remember**
>
> `map` trasforma, `filter` seleziona, `reduce` riassume. Nel JSX userai `map` per trasformare dati in elementi (con `key`): `transactions.map((t) => <TransactionItem key={t.id} ... />)`.

---

## 💻 Let's Code

### Preparazione
Crea `js-lab/04-map-filter-reduce.js` con gli import, il formatter e un helper per arrotondare:

```javascript
import { accounts, transactions } from "./mockData.js";

const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  useGrouping: "always",
});
const formatCurrency = (amount) => currencyFormatter.format(amount);
const formatDate = (isoString) => new Date(isoString).toLocaleDateString("it-IT");
const roundMoney = (value) => Math.round(value * 100) / 100;
```

Gli snippet seguenti vanno aggiunti, in ordine, nello stesso file. Per eseguirlo, dentro `js-lab/`:

```bash
node 04-map-filter-reduce.js
```

### `map`
```javascript
const accountNames = accounts.map((account) => account.name);
const accountLabels = accounts.map((account) => ({
  id: account.id,
  label: `${account.name} — ${formatCurrency(account.balance)}`,
}));

console.log(accountNames);
console.log(accountLabels[1].label);
```

```text
[ 'Conto Corrente', 'Conto Risparmio' ]
Conto Risparmio — 12.800,00 €
```

La seconda `map` restituisce un oggetto per ogni conto: serve la parentesi tonda attorno alle graffe (capitolo 02). Un `map` con graffe e senza `return` produce un array di `undefined`.

### `filter`
```javascript
const incomes = transactions.filter((transaction) => transaction.amount > 0);
const checkingExpenses = transactions.filter(
  (transaction) => transaction.accountId === "acc-001" && transaction.amount < 0,
);

const searchText = "utenza";
const matches = transactions.filter((transaction) =>
  transaction.description.toLowerCase().includes(searchText.toLowerCase()),
);

console.log(incomes.length, checkingExpenses.length);
console.log(matches.map((transaction) => transaction.id));
```

```text
4 4
[ 'trx-002', 'trx-006' ]
```

La ricerca normalizza in minuscolo sia il testo cercato sia la descrizione: è il filtro di ricerca che aggiungerai nel Day 3.

### `reduce`: totali
```javascript
const totalBalance = accounts.reduce((total, account) => total + account.balance, 0);
const totalIncome = incomes.reduce((total, transaction) => total + transaction.amount, 0);

console.log(totalBalance, formatCurrency(totalBalance));
console.log(totalIncome);
```

```text
17050.75 17.050,75 €
2457.5
```

Il valore iniziale `0` fa partire la somma da un numero. Senza di esso, il primo accumulatore sarebbe il primo **oggetto** conto e il risultato sarebbe un testo senza senso.

### Il problema dei decimali
```javascript
const expenses = transactions.filter((transaction) => transaction.amount < 0);
const rawExpenses = expenses.reduce((total, transaction) => total + transaction.amount, 0);

console.log(rawExpenses);
console.log(roundMoney(rawExpenses), formatCurrency(rawExpenses));
```

```text
-245.40000000000003
-245.4 -245,40 €
```

La somma di numeri come `-88.9` o `-62.4` accumula piccoli errori binari. Due difese:

- **mostrare** l'importo con `formatCurrency`, che arrotonda a due decimali;
- **arrotondare** con `roundMoney` quando devi confrontare, salvare o riusare il valore.

### `reduce` che costruisce un oggetto: spese per categoria
```javascript
const expensesByCategory = expenses.reduce((totals, transaction) => {
  const previous = totals[transaction.category] ?? 0;
  totals[transaction.category] = roundMoney(previous + transaction.amount);
  return totals;
}, {});

console.log(expensesByCategory);
```

```text
{ Alimentari: -62.4, Utenze: -143.1, Svago: -39.9 }
```

Qui l'accumulatore è un oggetto `{}` creato dentro il `reduce`, quindi modificarlo è sicuro (non è un dato dello state). `?? 0` significa "se la categoria non esiste ancora, usa `0`": il [capitolo 08](./08_Optional_Chaining_Ternary.md) lo spiega.

### Concatenare: ultimi cinque movimenti
```javascript
const recentTransactions = transactions
  .slice()
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 5)
  .map((transaction) => `${formatDate(transaction.date)} ${transaction.description} ${formatCurrency(transaction.amount)}`);

recentTransactions.forEach((line) => console.log(line));
```

```text
27/10/2026 Spesa supermercato -62,40 €
25/10/2026 Pagamento utenza luce -88,90 €
23/10/2026 Stipendio 2.100,00 €
20/10/2026 Abbonamento palestra -39,90 €
18/10/2026 Rimborso spese 45,00 €
```

Ogni passaggio riceve il risultato del precedente: copia, ordina per data decrescente, taglia i primi cinque, trasforma in testo. Questo è lo stesso ragionamento del componente `RecentTransactions` del Day 1.

### `reduce` senza valore iniziale
```javascript
try {
  [].reduce((total, value) => total + value);
} catch (error) {
  console.log(error.message);
}
```

```text
Reduce of empty array with no initial value
```

---

## 🏦 LipariBank in action
- **Saldo totale** (`BalanceCard`, Day 1): `accounts.reduce(..., 0)`.
- **Ultimi cinque movimenti** (`RecentTransactions`, Day 1): `slice` + `sort` + `slice(0, 5)`, poi `map` verso JSX.
- **Filtri entrate/uscite e ricerca** (`TransactionFilters`, Day 3): `filter` con `amount > 0`, `amount < 0` e `includes` sulla descrizione.
- **Liste con `key`** ([Day 2 · Liste e Keys](../Day_02_Components_Props/05_Liste_e_Keys.md)): `map` è il cuore del rendering delle liste.

---

## 🧪 Your Turn
**Obiettivo:** costruire il riepilogo numerico del conto corrente.

**Requisiti** (file `js-lab/04-exercise.js`; copia le funzioni `formatCurrency`, `formatDate`, `roundMoney` dal file dell'esempio):

1. Calcola e stampa il saldo totale di tutti i conti.
2. Seleziona i movimenti del conto `acc-001` e calcola **entrate** e **uscite** con `filter` + `reduce` (valore iniziale sempre indicato), arrotondando con `roundMoney`.
3. Calcola il **netto** (entrate + uscite) arrotondato.
4. Stampa il movimento con l'**uscita maggiore** (importo più negativo) di tutti i movimenti, usando `reduce` con valore iniziale `transactions[0]`.
5. Stampa la **ricerca** per testo `"utenza"` come elenco di descrizioni.
6. Crea con `map` un array di stringhe `"<categoria>: <importo formattato>"` solo per le **entrate** di `acc-001`.

**Passi suggeriti:** per il punto 4 il callback confronta `transaction.amount < current.amount` e restituisce il più piccolo; per il punto 6 concatena `filter` e `map`.

**Risultato atteso** (il formato delle stampe è libero, i valori devono coincidere):

```text
17.050,75 €
Entrate: 2.145,00 € — Uscite: -245,40 € — Netto: 1.899,60 €
Pagamento utenza luce -88.9
[ 'Pagamento utenza luce', 'Pagamento utenza gas' ]
[ 'Stipendio: 2.100,00 €', 'Rimborsi: 45,00 €' ]
```

**Criteri di completamento:** ogni `reduce` ha il valore iniziale; nessun array originale è stato modificato; i valori coincidono con quelli attesi.

---

## ⚠️ Common Mistakes
- **`reduce` senza valore iniziale**: errore su array vuoti e risultati sbagliati su array di oggetti.
- **Dimenticare `return`** nel callback con graffe: `map` produce `undefined`, `reduce` perde l'accumulatore.
- **Usare `map` solo per gli effetti collaterali**: usa `forEach`.
- **Confrontare somme di decimali con `===`**: arrotonda prima con `roundMoney`.
- **Modificare l'array nel callback** (`push`, `sort` sull'originale): i metodi funzionali devono restare puri.
- **`sort` senza copia**: usa sempre `slice()` prima.

---

## ✅ Checklist
- ☐ So spiegare con una frase la differenza tra `map`, `filter` e `reduce`.
- ☐ Indico sempre il valore iniziale di `reduce`.
- ☐ Ho riprodotto il saldo totale `17.050,75 €`.
- ☐ So perché `-245.40000000000003` compare e come evitarlo.
- ☐ Ho completato `04-exercise.js`.

---

## 🚀 Challenge
Calcola per ogni conto la somma dei suoi movimenti con un solo `reduce` che costruisce un oggetto `{ "acc-001": ..., "acc-002": ... }`. Poi stampa per ciascun conto il nome (cercato in `accounts`) e il totale formattato.

---

## 📌 Recap
- `map` trasforma (stessa lunghezza), `filter` seleziona, `reduce` riassume in un solo valore.
- Passa sempre il valore iniziale a `reduce`.
- I metodi si concatenano; non modificano l'array originale (ma `sort` sì: usalo su una copia).
- Le somme di decimali vanno arrotondate (`roundMoney`) o formattate (`formatCurrency`).

*Dove lo userai:* liste con `key` ([Day 2](../Day_02_Components_Props/05_Liste_e_Keys.md)), filtri sui movimenti ([Day 3](../Day_03_State_Events/06_Esercizio_LipariBank_Transactions.md)) e aggiornamenti immutabili dello state.

---

### ➡️ Next
[Capitolo 05 — Destructuring, spread e rest](./05_Destructuring_Spread_Rest.md): scrivi in modo più compatto e impari a "modificare" i dati creando copie.
