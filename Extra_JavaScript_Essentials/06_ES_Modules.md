# 🏦 LipariBank — React Zero to Hero

> **Extra JavaScript · Capitolo 06**
> **Argomento:** ES Modules — `import`, `export default`, named exports e organizzazione dei file
> **Durata stimata:** 25 minuti
> **Parte di LipariBank:** la struttura `src/data`, `src/utils`, `src/components` che userai dal Day 1

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- esportare e importare funzioni e dati con **named exports** e **default export**;
- scegliere quando usare l'uno o l'altro;
- eseguire moduli con Node.js (`"type": "module"` oppure `.mjs`) e riconoscere gli errori più comuni;
- spiegare come i moduli funzionano in un progetto Vite/React.

---

## 📋 Prerequisiti
- [Capitolo 03](./03_Objects_Arrays.md): `js-lab/mockData.js` usa già `export`.
- [Capitolo 02](./02_Functions_Arrow_Functions.md): `formatCurrency` e `formatDate`.
- `js-lab/package.json` con `"type": "module"` (creato nel [capitolo 01](./01_Variables_Types.md)).

---

## 🧭 In questo capitolo
- Perché dividere il codice in moduli.
- Named exports e default export.
- Sintassi di `import` (rinomina, namespace).
- Moduli in Node.js e in Vite.
- Convenzioni di organizzazione per LipariBank.
- Esercizio: riorganizzare `js-lab/` in cartelle.

---

## 🧠 Theory

### Che cos'è un modulo
Un modulo è un file JavaScript con un proprio ambito: ciò che dichiari dentro non è visibile fuori, a meno che tu lo **esporti**. Gli altri file lo **importano**. Un progetto React è fatto di decine di piccoli moduli: un componente per file, le utility in file separati, i dati in un file a parte.

### Named export
Un file può esportare **molti** valori con nome. Chi importa usa gli **stessi nomi** tra graffe (snippet parziali, il corpo della funzione è omesso):

```javascript
export const customer = { id: "cust-001", firstName: "Mario", lastName: "Rossi" };
export function formatCurrency(amount) { /* ... */ }
```

```javascript
import { customer, formatCurrency } from "./mockData.js";
```

### Default export
Un file può avere **un solo** `export default`. Chi importa sceglie liberamente il nome e **non** usa le graffe:

```javascript
export default function Header() { /* ... */ }
```

```javascript
import Header from "./Header.jsx";
```

### Quale usare nel corso
| Tipo di file | Export | Esempio |
|---|---|---|
| Componente React | `export default` | `export default function Header() {}` |
| Dati e utility | named export | `export const accounts`, `export function formatCurrency` |

La regola serve a tenere uniforme il progetto: un componente per file, con il nome del file uguale al nome del componente.

### Altre forme di `import`
- Rinomina: `import { formatDate as formatItalianDate } from "./formatters.js";`
- Tutto in un oggetto: `import * as formatters from "./formatters.js";` → `formatters.formatCurrency(...)`.
- Solo effetti collaterali: `import "./index.css";` (funziona in Vite, non in Node).

### Percorsi
- **Relativi** (`./`, `../`): file del tuo progetto. `./` = stessa cartella, `../` = cartella superiore.
- **Nome semplice** (`"react"`): pacchetto installato in `node_modules`.

> 💡 **Remember**
>
> In Node.js il percorso relativo deve includere l'**estensione** (`./formatters.js`). Nel progetto Vite del corso scrivi l'estensione dei file che importi (`./App.jsx`, `./utils/formatters.js`): il template stesso lo fa in `src/main.jsx`.

### Moduli in Node e in Vite
- **Node.js** tratta i file `.js` come ES Module solo se il `package.json` più vicino contiene `"type": "module"`; in alternativa si può rinominare il file in **`.mjs`**. Senza queste condizioni vedrai `SyntaxError: Cannot use import statement outside a module`.
- **Vite** (il tool del progetto React) usa gli ES Module nativamente: il `package.json` generato da `create-vite` contiene già `"type": "module"`. Tu scrivi `import`/`export` e Vite pensa al resto (server di sviluppo e build).
- Un modulo viene **eseguito una sola volta**: tutti i file che importano gli stessi dati condividono la stessa istanza.

---

## 💻 Let's Code

### Struttura della cartella di laboratorio
Dentro `js-lab/` crea le cartelle `data/`, `utils/` e copia `mockData.js` in `data/mockData.js` (lascia l'originale: i capitoli precedenti lo usano):

```bash
mkdir data
mkdir utils
copy mockData.js data\mockData.js
```

Il comando `copy` è quello di Windows (PowerShell/cmd); su macOS/Linux usa `cp mockData.js data/mockData.js`.

Struttura risultante:

```text
js-lab/
├── package.json
├── data/
│   └── mockData.js
├── utils/
│   ├── formatters.js
│   └── dashboardSummary.js
└── main.js
```

### Named exports: `utils/formatters.js`
Crea `js-lab/utils/formatters.js`:

```javascript
const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  useGrouping: "always",
});

export function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("it-IT");
}
```

`currencyFormatter` non è esportato: resta un dettaglio **privato** del modulo.

### Default export: `utils/dashboardSummary.js`
Crea `js-lab/utils/dashboardSummary.js`:

```javascript
import { formatCurrency, formatDate } from "./formatters.js";

export default function buildDashboardSummary(accounts, transactions) {
  const totalBalance = accounts.reduce((total, account) => total + account.balance, 0);
  const [lastTransaction] = transactions;

  return {
    totalBalance: formatCurrency(totalBalance),
    lastTransaction: `${formatDate(lastTransaction.date)} — ${lastTransaction.description} (${formatCurrency(lastTransaction.amount)})`,
  };
}
```

Qui il file ne **importa** un altro (percorso `./`, stessa cartella) e **esporta** una sola funzione come default.

### Il file principale: `main.js`
Crea `js-lab/main.js`:

```javascript
import buildDashboardSummary from "./utils/dashboardSummary.js";
import { formatCurrency, formatDate as formatItalianDate } from "./utils/formatters.js";
import { customer, accounts, transactions } from "./data/mockData.js";

const summary = buildDashboardSummary(accounts, transactions);

console.log(`Cliente: ${customer.firstName} ${customer.lastName}`);
console.log(`Saldo totale: ${summary.totalBalance}`);
console.log(`Ultimo movimento: ${summary.lastTransaction}`);
console.log(`Conto risparmio: ${formatCurrency(accounts[1].balance)} al ${formatItalianDate("2026-10-28")}`);
```

Dentro `js-lab/` esegui:

```bash
node main.js
```

Risultato atteso:

```text
Cliente: Mario Rossi
Saldo totale: 17.050,75 €
Ultimo movimento: 27/10/2026 — Spesa supermercato (-62,40 €)
Conto risparmio: 12.800,00 € al 28/10/2026
```

Cosa notare:

- `buildDashboardSummary` è importato **senza graffe** e con il nome che abbiamo scelto noi;
- `formatCurrency` e `formatDate` sono importati **con graffe** e con il loro nome esatto; `formatDate` è rinominato con `as`;
- tutti i percorsi iniziano con `./` e finiscono con `.js`.

### Importare tutto come namespace
```javascript
import * as formatters from "./utils/formatters.js";

console.log(formatters.formatCurrency(4250.75));
```

```text
4.250,75 €
```

Utile quando un modulo esporta molte funzioni con nomi generici.

### Alternativa: l'estensione `.mjs`
Senza `"type": "module"` puoi comunque usare i moduli rinominando i file in `.mjs` (`main.mjs`, `formatters.mjs`) e importandoli con l'estensione `.mjs`. In questo corso usiamo `package.json` perché è lo stesso meccanismo di Vite.

### Errori tipici e cosa significano
```text
SyntaxError: Cannot use import statement outside a module
```
Manca `"type": "module"` (o l'estensione `.mjs`).

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module ... imported from ...
```
Percorso sbagliato oppure estensione `.js` mancante.

```text
SyntaxError: The requested module './formatters.js' does not provide an export named 'formatCurency'
```
Nome dell'import diverso da quello dell'export (qui un errore di battitura).

---

## 🏦 LipariBank in action
Questa è la struttura che costruirai nel progetto `liparibank/`:

```text
src/
├── data/
│   └── mockData.js
├── utils/
│   └── formatters.js
└── components/
    ├── Header.jsx
    └── BalanceCard.jsx
```

- `src/data/mockData.js` e `src/utils/formatters.js` usano **named exports** (come i file di questo capitolo);
- i componenti in `src/components/` usano **`export default`** ([Day 1 · Function Components](../Day_01_React_Fundamentals/04_Function_Components.md)) e vengono importati con `import Header from "./components/Header.jsx";`.

---

## 🧪 Your Turn
**Obiettivo:** organizzare in moduli le funzioni di calcolo dei conti.

**Requisiti**

1. Crea `js-lab/utils/accountUtils.js` con **tre named export**:
   - `getTotalBalance(accounts)` (somma dei saldi, `reduce` con valore iniziale);
   - `getAccountById(accounts, accountId)` (usa `find`);
   - `getTransactionsByAccount(transactions, accountId)` (usa `filter`).
2. Crea `js-lab/main-exercise.js` che:
   - importa i tre helper con **import con rinomina** (`getTotalBalance as sumBalances`) per almeno uno;
   - importa `formatCurrency` da `./utils/formatters.js`;
   - importa i dati da `./data/mockData.js`;
   - importa `* as accountUtils` da `./utils/accountUtils.js` e usa `accountUtils.getAccountById` per un controllo.
3. Stampa saldo totale formattato, nome del conto `acc-002` e numero di movimenti di `acc-001`.

**Passi suggeriti:** scrivi prima `accountUtils.js` e prova una funzione con un `console.log` temporaneo; poi aggiungi gli import uno alla volta e rilancia `node main-exercise.js` per leggere subito gli errori.

**Risultato atteso:**

```text
17.050,75 €
Conto Risparmio
6
```

**Criteri di completamento:** nessun `export default` negli helper; tutti i percorsi sono relativi con estensione; l'output coincide.

---

## ⚠️ Common Mistakes
- **Graffe sull'import di un default** (`import { Header } from ...`) o **senza graffe su un named export**.
- **Dimenticare l'estensione** nei percorsi relativi in Node.
- **Dimenticare `./`**: `"utils/formatters.js"` è letto come nome di pacchetto.
- **Due `export default` nello stesso file**: ne è ammesso solo uno.
- **Mutare dati importati** (`accounts.push(...)`): tutti i moduli condividono la stessa istanza.
- **`import` dentro a un `if` o a una funzione**: va scritto al livello più alto del file.
- **Usare `require`** in un progetto ES Module: è la sintassi CommonJS (non la usiamo).

---

## ✅ Checklist
- ☐ So distinguere named export e default export (e le graffe).
- ☐ Ho eseguito `main.js` con `node` senza errori.
- ☐ So perché serve `"type": "module"` o `.mjs` in Node.
- ☐ So che nel progetto Vite l'estensione si scrive (`./App.jsx`).
- ☐ Ho completato `accountUtils.js` e `main-exercise.js`.

---

## 🚀 Challenge
Aggiungi `js-lab/utils/index.js` che riesporta le funzioni con `export { formatCurrency, formatDate } from "./formatters.js";` e importale da `./utils/index.js` in `main.js`. Annota in due righe un vantaggio e uno svantaggio di questo "barrel file".

---

## 📌 Recap
- Un modulo mantiene privato ciò che non esporta.
- Named export: più per file, import con graffe e nome esatto; default export: uno per file, import senza graffe.
- Nel corso: componenti → default export; dati e utility → named export.
- Node richiede `"type": "module"` (o `.mjs`) e percorsi con estensione; Vite gestisce i moduli nel progetto React.

*Dove lo userai:* [Day 1 · Struttura del progetto](../Day_01_React_Fundamentals/02_Struttura_del_progetto.md) e [Day 1 · Function Components](../Day_01_React_Fundamentals/04_Function_Components.md), poi l'organizzazione di Day 7.

---

### ➡️ Next
[Capitolo 07 — Promise e async/await](./07_Promises_Async_Await.md): gestisci operazioni che richiedono tempo, come il recupero dei movimenti.
