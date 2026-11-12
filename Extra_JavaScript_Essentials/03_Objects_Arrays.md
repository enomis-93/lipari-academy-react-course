# 🏦 LipariBank — React Zero to Hero

> **Extra JavaScript · Capitolo 03**
> **Argomento:** Oggetti e array: proprietà, accesso e modifica dei dati
> **Durata stimata:** 30 minuti
> **Parte di LipariBank:** i dati canonici `customer`, `accounts`, `transactions`, `beneficiaries` (il futuro `src/data/mockData.js`)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- leggere proprietà di oggetti con notazione a punto e a parentesi;
- usare `find`, `findIndex`, `includes`, `some`, `every` sugli array di LipariBank;
- distinguere i metodi che **modificano** l'array (`push`, `sort`) da quelli che non lo fanno;
- spiegare perché due oggetti con lo stesso contenuto non sono `===`.

---

## 📋 Prerequisiti
- [Capitolo 02 — Funzioni](./02_Functions_Arrow_Functions.md).
- La cartella `js-lab/` con `package.json` (`"type": "module"`), vedi [capitolo 01](./01_Variables_Types.md).

---

## 🧭 In questo capitolo
- Creare i dati fittizi di LipariBank in `js-lab/mockData.js`.
- Oggetti: accesso, aggiunta, modifica, rimozione, `Object.keys/values/entries`.
- Array: indici, `length`, `find`, `includes`, `some`, `every`, `sort`.
- Mutazione e riferimenti.
- Esercizio guidato sui dati.

---

## 🧠 Theory

### Oggetti
Un oggetto raggruppa proprietà `chiave: valore`. È il formato di un cliente, di un conto, di un movimento. Si legge con la **notazione a punto** (`account.name`) o a **parentesi** (`account["name"]`); le parentesi servono quando il nome della proprietà è in una variabile o contiene caratteri speciali.

### Array
Un array è una lista ordinata: si accede per indice a partire da `0` (`accounts[0]`), `length` dà la lunghezza, `at(-1)` l'ultimo elemento. Gli array di oggetti sono la forma tipica dei dati che React mostra a schermo.

### Metodi di ricerca e test
- `find(callback)` → il primo elemento che soddisfa la condizione, oppure `undefined`.
- `findIndex(callback)` → la posizione, oppure `-1`.
- `includes(valore)` → `true` se il valore è presente (confronto per valore, adatto a primitivi).
- `some(callback)` / `every(callback)` → almeno uno / tutti soddisfano la condizione.

### Mutazione e riferimenti
Gli oggetti e gli array sono **riferimenti**: due variabili possono puntare allo stesso oggetto. Metodi come `push`, `pop`, `splice` e `sort` **modificano** l'array originale; `slice`, `concat`, `map`, `filter` ne restituiscono uno nuovo.

> 💡 **Remember**
>
> `const` impedisce di riassegnare la variabile, **non** di modificare il contenuto. In React non modificherai mai direttamente i dati dello state: lavorerai su copie (capitolo 05 e [Day 3](../Day_03_State_Events/05_Immutabilita_dello_State.md)).

---

## 💻 Let's Code

### Dati di LipariBank
Crea `js-lab/mockData.js` con i dati canonici del corso:

```javascript
export const customer = { id: "cust-001", firstName: "Mario", lastName: "Rossi" };

export const accounts = [
  { id: "acc-001", name: "Conto Corrente", iban: "IT00 0000 0000 0000 0000 0000 000", balance: 4250.75, currency: "EUR" },
  { id: "acc-002", name: "Conto Risparmio", iban: "IT00 0000 0000 0000 0000 0000 001", balance: 12800.0, currency: "EUR" },
];

export const transactions = [
  { id: "trx-001", accountId: "acc-001", date: "2026-10-27", description: "Spesa supermercato", amount: -62.4, category: "Alimentari" },
  { id: "trx-002", accountId: "acc-001", date: "2026-10-25", description: "Pagamento utenza luce", amount: -88.9, category: "Utenze" },
  { id: "trx-003", accountId: "acc-001", date: "2026-10-23", description: "Stipendio", amount: 2100.0, category: "Stipendio" },
  { id: "trx-004", accountId: "acc-001", date: "2026-10-20", description: "Abbonamento palestra", amount: -39.9, category: "Svago" },
  { id: "trx-005", accountId: "acc-001", date: "2026-10-18", description: "Rimborso spese", amount: 45.0, category: "Rimborsi" },
  { id: "trx-006", accountId: "acc-001", date: "2026-10-15", description: "Pagamento utenza gas", amount: -54.2, category: "Utenze" },
  { id: "trx-007", accountId: "acc-002", date: "2026-10-10", description: "Accantonamento mensile", amount: 300.0, category: "Risparmio" },
  { id: "trx-008", accountId: "acc-002", date: "2026-10-01", description: "Interessi maturati", amount: 12.5, category: "Interessi" },
];

export const beneficiaries = [
  { id: "ben-001", name: "Giulia Bianchi", iban: "IT00 0000 0000 0000 0000 0000 111" },
  { id: "ben-002", name: "Luca Verdi", iban: "IT00 0000 0000 0000 0000 0000 222" },
  { id: "ben-003", name: "Condominio Lipari (fittizio)", iban: "IT00 0000 0000 0000 0000 0000 333" },
];
```

Il campo `amount` è **con segno**: positivo = entrata, negativo = uscita. Tutti i dati sono fittizi (nomi e IBAN inventati).

La parola `export` davanti a `const` rende l'oggetto importabile da altri file. Per ora usala come "formula": è spiegata nel [capitolo 06](./06_ES_Modules.md).

### Leggere oggetti
Crea `js-lab/03-objects-arrays.js`:

```javascript
import { customer, accounts, transactions, beneficiaries } from "./mockData.js";

console.log(customer.firstName, customer["lastName"]);

const field = "balance";
console.log(accounts[0][field]);
console.log(Object.keys(accounts[0]));
console.log(Object.entries(customer));
```

Dentro `js-lab/` esegui:

```bash
node 03-objects-arrays.js
```

Risultato atteso:

```text
Mario Rossi
4250.75
[ 'id', 'name', 'iban', 'balance', 'currency' ]
[
  [ 'id', 'cust-001' ],
  [ 'firstName', 'Mario' ],
  [ 'lastName', 'Rossi' ]
]
```

`accounts[0][field]` mostra la notazione a parentesi con una variabile. `Object.keys`, `Object.values` e `Object.entries` restituiscono chiavi, valori e coppie `[chiave, valore]`.

### Aggiungere, modificare, rimuovere proprietà
Aggiungi in fondo, lavorando su un oggetto **locale** (mai sui dati importati):

```javascript
const draftAccount = { id: "acc-003", name: "Conto Prova", balance: 100, currency: "EUR" };

draftAccount.balance = 150;
draftAccount.iban = "IT00 0000 0000 0000 0000 0000 999";
delete draftAccount.currency;

console.log(draftAccount);
```

```text
{
  id: 'acc-003',
  name: 'Conto Prova',
  balance: 150,
  iban: 'IT00 0000 0000 0000 0000 0000 999'
}
```

Nonostante `const`, l'oggetto è stato modificato: `const` blocca la variabile, non il contenuto.

### Cercare negli array
```javascript
const salary = transactions.find((transaction) => transaction.id === "trx-003");
const missing = transactions.find((transaction) => transaction.id === "trx-999");
const savingsIndex = accounts.findIndex((account) => account.id === "acc-002");

console.log(salary.description, missing, savingsIndex);
console.log(transactions.length, transactions.at(-1).description);
console.log(transactions.some((transaction) => transaction.amount > 2000));
console.log(transactions.every((transaction) => transaction.amount !== 0));
console.log(["Utenze", "Svago"].includes(transactions[1].category));
```

```text
Stipendio undefined 1
8 Interessi maturati
true
true
true
```

`find` restituisce `undefined` quando non trova nulla: se poi leggi `missing.description` ottieni un errore. Il [capitolo 08](./08_Optional_Chaining_Ternary.md) mostra come gestirlo.

### Metodi che modificano e metodi che non modificano
```javascript
const copy = transactions.slice();

copy.push({ id: "trx-009", accountId: "acc-001", date: "2026-10-28", description: "Caffè", amount: -1.2, category: "Alimentari" });
console.log(transactions.length, copy.length);

const ascending = transactions.slice().sort((a, b) => a.date.localeCompare(b.date));
console.log(ascending[0].id, transactions[0].id);
```

```text
8 9
trx-008 trx-001
```

- `slice()` senza argomenti crea una **copia superficiale** dell'array: `push` modifica solo la copia.
- `sort` modifica l'array su cui è chiamato: per questo si ordina una **copia**. La funzione di confronto restituisce un numero negativo, zero o positivo; per le date ISO (`YYYY-MM-DD`) `localeCompare` funziona perché l'ordine alfabetico coincide con quello cronologico. Per l'ordine **decrescente** scambia gli argomenti: `b.date.localeCompare(a.date)`.

### Riferimenti
```javascript
const sameAccount = accounts[0];
sameAccount.balance = 1;
console.log(accounts[0].balance);
console.log({ a: 1 } === { a: 1 });
```

```text
1
false
```

`sameAccount` non è una copia: punta allo stesso oggetto, quindi hai appena rovinato il dato originale (solo in memoria, il file non cambia). Due oggetti uguali nel contenuto ma creati separatamente non sono `===`. Questo spiega perché React confronta i riferimenti per decidere se ridisegnare.

---

## 🏦 LipariBank in action
La dashboard del Day 1 parte da questi stessi array: `customer.firstName` per l'intestazione, `accounts` per i saldi, `transactions` per i movimenti. Per mostrare "gli ultimi movimenti" userai proprio `slice` e `sort` su una copia; per trovare il conto selezionato nel Day 3 userai `accounts.find(...)` con `selectedAccountId`.

---

## 🧪 Your Turn
**Obiettivo:** esplorare i dati di LipariBank senza mai modificare gli originali.

**Requisiti** (file `js-lab/03-exercise.js`, con `import { accounts, transactions, beneficiaries } from "./mockData.js";`):

1. Stampa il nome di ogni beneficiario con un ciclo `for...of`.
2. Trova il conto `acc-002` con `find` e stampa nome e saldo.
3. Con un ciclo `for...of` e un contatore conta i movimenti del conto `acc-001`.
4. Ordina i movimenti per data **crescente** lavorando su una copia e stampa l'`id` del primo elemento ordinato e quello del primo elemento dell'array originale.
5. Crea una copia di `transactions`, aggiungi un nuovo movimento con `push` e stampa le lunghezze dei due array.
6. Stampa se esiste almeno un movimento con categoria `"Stipendio"` (`some`).

**Passi suggeriti:** esegui il file dopo ogni punto; per il punto 3 parti da `let count = 0;` e incrementa dentro `if`.

**Risultato atteso:**

```text
Giulia Bianchi
Luca Verdi
Condominio Lipari (fittizio)
Conto Risparmio 12800
6
trx-008 trx-001
8 9
true
```

**Criteri di completamento:** nessun metodo mutante è applicato a `transactions` o `accounts` importati (solo a copie); l'output coincide.

---

## ⚠️ Common Mistakes
- **Ordinare l'array originale** (`transactions.sort(...)`): modifica i dati condivisi. Usa `transactions.slice().sort(...)`.
- **Leggere una proprietà di `undefined`** dopo un `find` fallito: `TypeError: Cannot read properties of undefined`.
- **Pensare che `const` renda i dati immutabili.**
- **Usare `includes` su oggetti**: confronta i riferimenti, non il contenuto; usa `some`.
- **Confondere `accounts[1]` con l'`id`**: l'indice è la posizione, l'`id` è una proprietà.
- **Dimenticare la funzione di confronto in `sort`**: senza di essa ordina come testo.

---

## ✅ Checklist
- ☐ Ho creato `js-lab/mockData.js` con i dati canonici.
- ☐ So leggere proprietà con punto e parentesi.
- ☐ So scegliere tra `find`, `findIndex`, `some`, `every`, `includes`.
- ☐ Ordino sempre una copia, mai l'originale.
- ☐ Ho completato `03-exercise.js` con l'output atteso.

---

## 🚀 Challenge
Scrivi una funzione `getAccountName(accountId)` che restituisce il nome del conto o `"Conto sconosciuto"` se non esiste (per ora usa un `if`). Provala con `"acc-001"` e `"acc-999"`.

---

## 📌 Recap
- Gli oggetti si leggono con `.` o `[]`; `Object.keys/values/entries` li esplorano.
- `find` restituisce l'elemento o `undefined`; `findIndex` la posizione o `-1`.
- `push`, `pop`, `splice`, `sort` modificano l'array; `slice`, `concat`, `map`, `filter` no.
- Oggetti e array sono riferimenti: `const` non li rende immutabili.

*Dove lo userai:* props e dati nei componenti ([Day 2](../Day_02_Components_Props/02_Props.md)) e state ([Day 3](../Day_03_State_Events/02_useState.md)).

---

### ➡️ Next
[Capitolo 04 — `map`, `filter`, `reduce`](./04_Map_Filter_Reduce.md): trasformi e riassumi i movimenti per costruire saldi, totali e liste.
