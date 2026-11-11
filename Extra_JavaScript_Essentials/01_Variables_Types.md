# 🏦 LipariBank — React Zero to Hero

> **Extra JavaScript · Capitolo 01**
> **Argomento:** Variabili, tipi, conversioni e truthy/falsy
> **Durata stimata:** 25 minuti
> **Parte di LipariBank:** i dati di base (cliente, saldo, importi) che le prime schermate della dashboard mostreranno

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- dichiarare valori con `const` e `let` scegliendo quello giusto;
- riconoscere i tipi primitivi e convertire in modo sicuro una stringa (es. l'importo di un form) in numero;
- prevedere se un valore è *truthy* o *falsy* e confrontare valori con `===`;
- eseguire file JavaScript con Node.js nella cartella di lavoro `js-lab/`.

---

## 📋 Prerequisiti
- Node.js 22 LTS installato e verificato: vedi [Day 0 · Node e npm](../Day_00_Setup/02_Node_NPM.md).
- Un editor (Visual Studio Code) e un terminale.
- Nessuna conoscenza di React: questo capitolo si può fare **prima** del Day 1.

---

## 🧭 In questo capitolo
- Come eseguire JavaScript (Node.js o console del browser).
- `const`, `let` e perché non si usa `var`.
- Tipi primitivi, `typeof`, template literal.
- Conversioni: `Number()`, `String()`, e le trappole dei decimali.
- Truthy/falsy e `===` contro `==`.
- Esercizio: simulare la lettura dell'importo di un bonifico.

---

## 🧠 Theory

### Dove eseguire gli esempi
Per gli esempi di questa sezione Extra non serve un progetto React. Hai due opzioni.

1. **Node.js (consigliata):** crei una cartella `js-lab/`, scrivi file `.js` e li lanci con `node nomefile.js`.
2. **Console del browser:** apri gli strumenti sviluppatore (tasto `F12`), scheda *Console*, incolla il codice. Va bene per snippet brevi, ma non per i capitoli sui moduli.

### `const` e `let`
- `const` crea un binding che **non può essere riassegnato**. È la scelta predefinita.
- `let` si usa solo quando il valore deve cambiare nel tempo.
- `var` è la sintassi storica: ha regole di visibilità sorprendenti e nel corso **non si usa**. La incontrerai nel codice legacy (Extra React Legacy).

`const` non rende immutabile il contenuto: se il valore è un oggetto o un array, le sue proprietà si possono ancora modificare. Ne parliamo nel [capitolo 03](./03_Objects_Arrays.md).

### Tipi primitivi
| Tipo | Esempio | Note |
|---|---|---|
| `string` | `"Mario"` | testo |
| `number` | `4250.75` | interi e decimali (un solo tipo) |
| `boolean` | `true` | vero/falso |
| `undefined` | `undefined` | variabile dichiarata ma senza valore |
| `null` | `null` | assenza di valore *voluta* |
| `bigint`, `symbol` | `10n` | non servono in questo corso |

Tutto il resto (array, oggetti, funzioni) è di tipo *object* e si confronta per riferimento.

### Conversioni
I valori che arrivano da un campo di un form sono **sempre stringhe**, anche se l'utente scrive `125.50`. Prima di fare calcoli devi convertirli.

### Truthy e falsy
In una condizione (`if`, `&&`, `? :`) JavaScript converte il valore in booleano. Sono **falsy** solo: `false`, `0`, `""`, `null`, `undefined`, `NaN` (e `0n`). Tutto il resto è **truthy**, compresi `"0"`, `[]` e `{}`.

> 💡 **Remember**
>
> Usa sempre `===` e `!==` (confronto senza conversione). `==` converte i tipi e produce risultati controintuitivi, ad esempio `0 == ""` è `true`.

---

## 💻 Let's Code

### Preparare `js-lab/`
Dalla cartella di lavoro del corso (la stessa che conterrà `liparibank/`) crea la cartella di laboratorio ed entraci:

```bash
mkdir js-lab
cd js-lab
```

Dentro `js-lab/` crea il file `package.json` con questo contenuto:

```json
{
  "type": "module"
}
```

Questa riga abilita gli ES Modules in Node: non ti serve ancora, ma dal capitolo 03 gli esempi useranno `import`. Il motivo è spiegato nel [capitolo 06](./06_ES_Modules.md).

### Primo esempio: `const` e `let`
Crea `js-lab/01-variables.js`:

```javascript
const bankName = "LipariBank";
const currency = "EUR";
let balance = 4250.75;

balance = balance + 2100;

console.log(bankName, balance, currency);
```

Eseguilo dentro `js-lab/`:

```bash
node 01-variables.js
```

Risultato atteso:

```text
LipariBank 6350.75 EUR
```

Riassegnare una `const` provoca un errore: aggiungi `currency = "USD";` in fondo e rilancia. Vedrai `TypeError: Assignment to constant variable.` Poi rimuovi la riga.

### Tipi e template literal
Crea `js-lab/01-types.js`:

```javascript
const customerName = "Mario Rossi";
const balance = 4250.75;
const isBlocked = false;
const nickname = undefined;
const closedAt = null;

console.log(typeof customerName, typeof balance, typeof isBlocked);
console.log(typeof nickname, typeof closedAt);
console.log(`Cliente: ${customerName} — saldo: ${balance} EUR`);
```

Risultato atteso:

```text
string number boolean
undefined object
Cliente: Mario Rossi — saldo: 4250.75 EUR
```

`typeof null` restituisce `"object"`: è un errore storico del linguaggio. Per controllare `null` si usa `closedAt === null`.

I **template literal** (testo tra apici inversi `` ` ``) inseriscono qualsiasi espressione con `${...}`: li userai molto nel JSX.

### Conversioni di stringhe in numeri
Aggiungi a `js-lab/01-types.js`:

```javascript
const rawAmount = "125.50";

console.log(rawAmount + 10);
console.log(Number(rawAmount) + 10);
console.log(Number("12,5"), Number(""), Number("abc"));
console.log(Number.isNaN(Number("abc")));
```

Risultato atteso:

```text
125.5010
135.5
NaN 0 NaN
true
```

- `"125.50" + 10` **concatena** i testi: il `+` con una stringa non somma.
- `Number("12,5")` fallisce: JavaScript conosce solo il punto decimale. Per l'importo scritto all'italiana usa `Number(raw.replace(",", "."))`.
- `Number("")` vale `0`: una stringa vuota non è un errore! Controlla sempre `raw.trim() === ""` prima di convertire.
- `NaN` (*Not a Number*) non è uguale a se stesso: per verificarlo si usa `Number.isNaN(valore)`.

### Truthy, falsy e uguaglianza
```javascript
console.log(Boolean(0), Boolean(""), Boolean(null), Boolean(undefined), Boolean(NaN));
console.log(Boolean("0"), Boolean([]), Boolean({}), Boolean("Mario"));
console.log(0 == "", 0 === "");
```

Risultato atteso:

```text
false false false false false
true true true true
true false
```

### I decimali e il denaro
JavaScript usa numeri in virgola mobile binaria:

```javascript
console.log(0.1 + 0.2);
```

```text
0.30000000000000004
```

Non è un bug di JavaScript, ma della rappresentazione dei decimali. Per LipariBank adottiamo due regole pratiche:

- **non confrontare** con `===` somme di decimali: arrotonda prima (vedi [capitolo 04](./04_Map_Filter_Reduce.md));
- **formatta** sempre con `formatCurrency` ([capitolo 02](./02_Functions_Arrow_Functions.md)) quando mostri un importo: arrotonda a due decimali in visualizzazione.

In un'app reale gli importi si gestirebbero in centesimi (interi) lato server; qui, per scopi didattici, usiamo numeri decimali come nei dati del corso.

---

## 🏦 LipariBank in action
I dati canonici di LipariBank usano proprio questi tipi: `customer.firstName` è una `string`, `balance` un `number`, `amount` è un `number` **con segno** (positivo = entrata, negativo = uscita). Quando nel Day 4 costruirai il form del bonifico, l'importo arriverà come stringa: la conversione e il controllo `NaN` che hai appena visto saranno la base della validazione.

---

## 🧪 Your Turn
**Obiettivo:** simulare la lettura dell'importo di un bonifico scritto dall'utente.

**Requisiti** (file `js-lab/01-exercise.js`):

1. Dichiara con `const` `customerName` (`"Mario Rossi"`) e `currency` (`"EUR"`); dichiara con `let` `balance` con valore `4250.75`.
2. Dichiara `const rawTransferAmount = "250,50"` (testo come arriverebbe da un form).
3. Converti l'importo in numero gestendo la virgola decimale.
4. Se il risultato è `NaN` stampa `Importo non valido` e basta; altrimenti sottrai l'importo dal saldo.
5. Stampa con un template literal: `Mario Rossi — nuovo saldo: 4000.25 EUR`.
6. Dichiara `const note = ""` e, con un `if (!note)`, stampa `Nessuna causale`.

**Passi suggeriti:** parti dal punto 3 e stampa il numero con `console.log`; solo dopo aggiungi il ramo `NaN`; per provare il ramo di errore cambia temporaneamente il testo in `"abc"`.

**Risultato atteso** con `"250,50"`:

```text
Mario Rossi — nuovo saldo: 4000.25 EUR
Nessuna causale
```

Con `"abc"` il programma stampa `Importo non valido` (e la riga sulla causale, che è indipendente).

**Criteri di completamento:** nessun `var`; hai usato `===`/`Number.isNaN` e non `==`; le due prove (`"250,50"` e `"abc"`) danno l'output previsto.

---

## ⚠️ Common Mistakes
- **Sommare stringhe credendo di sommare numeri** (`"125.50" + 10`): converti prima con `Number()`.
- **Usare `Number("")` senza controllo**: restituisce `0`, non un errore.
- **Confrontare con `==`**: usa `===`.
- **Usare `let` ovunque**: parti da `const` e passa a `let` solo quando devi davvero riassegnare.
- **Aspettarsi `0.1 + 0.2 === 0.3`**: è `false`. Arrotonda o formatta.
- **Dimenticare `"type": "module"`** in `js-lab/package.json`: dal capitolo 03 gli `import` darebbero errore.

---

## ✅ Checklist
- ☐ Ho creato `js-lab/` con `package.json` (`"type": "module"`).
- ☐ So scegliere tra `const` e `let` e non uso `var`.
- ☐ So convertire `"250,50"` in `250.5` e riconoscere `NaN`.
- ☐ Conosco i sei valori falsy.
- ☐ Ho completato `01-exercise.js` con entrambe le prove.

---

## 🚀 Challenge
Aggiungi al file dell'esercizio un controllo che stampi `Saldo insufficiente` se l'importo è maggiore del saldo, e un altro che segnali importi minori o uguali a zero. Prova con `"5000"` e con `"-10"`.

---

## 📌 Recap
- `const` di default, `let` solo se il valore cambia, `var` mai.
- I tipi primitivi sono `string`, `number`, `boolean`, `undefined`, `null` (più `bigint` e `symbol`).
- I valori dei form sono stringhe: converti con `Number()` e controlla `NaN` e stringa vuota.
- Falsy: `false`, `0`, `""`, `null`, `undefined`, `NaN`. Confronta con `===`.
- I decimali binari sono imprecisi: arrotonda o formatta quando mostri denaro.

*Dove lo userai:* le espressioni JavaScript dentro il JSX ([Day 1 · JSX](../Day_01_React_Fundamentals/03_JSX.md)), il rendering condizionale ([Day 2](../Day_02_Components_Props/04_Conditional_Rendering.md)) e la validazione del form ([Day 4](../Day_04_Forms_User_Input/03_Validazione.md)).

---

### ➡️ Next
[Capitolo 02 — Funzioni e arrow functions](./02_Functions_Arrow_Functions.md): trasformi questi calcoli in funzioni riutilizzabili come `formatCurrency`, che userai in tutti i componenti.
