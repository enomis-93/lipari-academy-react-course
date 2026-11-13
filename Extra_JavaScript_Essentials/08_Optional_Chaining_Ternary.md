# 🏦 LipariBank — React Zero to Hero

> **Extra JavaScript · Capitolo 08**
> **Argomento:** Optional chaining, nullish coalescing, operatore ternario e condizioni
> **Durata stimata:** 10 minuti
> **Parte di LipariBank:** gestione di dati mancanti e visualizzazione condizionale (conto sconosciuto, saldo nascosto, caricamento/errore)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- leggere proprietà di valori che potrebbero essere `undefined` o `null` con `?.`;
- fornire valori di riserva con `??` distinguendolo da `||`;
- scegliere tra `if`, ternario e `&&` per esprimere una condizione;
- riconoscere la trappola del `0` con `&&`, che nel JSX mostra un "0" a schermo.

---

## 📋 Prerequisiti
- [Capitolo 01 — Variabili e tipi](./01_Variables_Types.md) (truthy/falsy).
- [Capitolo 03 — Oggetti e array](./03_Objects_Arrays.md) (`find` può restituire `undefined`).
- `js-lab/mockData.js` e `"type": "module"`.

---

## 🧭 In questo capitolo
- Il problema: leggere una proprietà di `undefined`.
- `?.` per accesso sicuro; `??` per i valori di riserva.
- `??` contro `||`.
- Ternario, `&&` e quando preferire un `if`.
- Anteprima: le stesse espressioni dentro il JSX.
- Esercizio: descrivere un movimento anche con dati incompleti.

---

## 🧠 Theory

### Optional chaining `?.`
Se il valore a sinistra di `?.` è `undefined` o `null`, la catena si **ferma** e l'intera espressione vale `undefined` (nessun errore). Esistono tre forme:

- `oggetto?.proprieta`
- `array?.[0]`
- `funzione?.(argomento)` (chiama la funzione solo se esiste)

### Nullish coalescing `??`
`a ?? b` restituisce `b` **solo se `a` è `null` o `undefined`**. È diverso da `a || b`, che restituisce `b` per **qualunque valore falsy**: `0`, `""`, `false`, `NaN`. Per importi e testi che possono legittimamente valere `0` o `""` si usa `??`.

Esiste anche l'assegnazione `a ??= b`: assegna solo se `a` è `null` o `undefined`.

### Ternario
`condizione ? valoreSeVera : valoreSeFalsa` è un'**espressione**: produce un valore, quindi si può usare dentro un template literal o nel JSX (dove le istruzioni `if` non sono ammesse).

### `&&` come "mostra solo se"
`a && b` restituisce `a` se è falsy, altrimenti `b`. Nel JSX: `{error && <ErrorMessage />}` mostra il componente solo se `error` è truthy.

### Quale scegliere
| Situazione | Strumento |
|---|---|
| due alternative semplici, dentro un'espressione | ternario |
| mostra qualcosa **oppure niente** | `&&` |
| valore di riserva per `null`/`undefined` | `??` |
| più di due casi o logica articolata | `if`/`else`, `switch` o un oggetto di lookup |

> 💡 **Remember**
>
> Evita ternari annidati: se hai più di due casi, estrai una funzione con `if` e `return` anticipati. E con `&&` non usare numeri come condizione: `{transactions.length && ...}` con `0` mostra "0"; scrivi `{transactions.length > 0 && ...}`.

---

## 💻 Let's Code

Crea `js-lab/08-optional-chaining.js`. Gli snippet vanno aggiunti in ordine; esegui con (dentro `js-lab/`):

```bash
node 08-optional-chaining.js
```

### Il problema e `?.`
```javascript
import { accounts, transactions } from "./mockData.js";

const missingAccount = accounts.find((account) => account.id === "acc-999");

try {
  console.log(missingAccount.name);
} catch (error) {
  console.log(error.message);
}

console.log(missingAccount?.name);
console.log(missingAccount?.name ?? "Conto sconosciuto");
```

```text
Cannot read properties of undefined (reading 'name')
undefined
Conto sconosciuto
```

`find` ha restituito `undefined`: leggere `.name` provoca un errore, mentre `?.` si ferma e restituisce `undefined`; `??` fornisce poi il testo di riserva.

### Le altre forme di `?.`
```javascript
const emptyList = undefined;
const props = { onSelect: (accountId) => console.log(`Selezionato ${accountId}`) };
const settings = { theme: "light" };

console.log(emptyList?.[0]);
props.onSelect?.("acc-001");
props.onDelete?.("acc-001");
console.log(settings.preferences?.hideBalance);
```

```text
undefined
Selezionato acc-001
undefined
```

`props.onDelete?.(...)` non fa nulla perché la funzione non esiste. È il modo sicuro di chiamare una callback **opzionale** ricevuta come prop. L'ultima riga stampa `undefined`: `preferences` non esiste e la catena si ferma senza errori.

### `??` contro `||`
```javascript
const emptyBalance = 0;
const preferences = {};

console.log(emptyBalance || "n/d");
console.log(emptyBalance ?? "n/d");

preferences.currency ??= "EUR";
console.log(preferences);
```

```text
n/d
0
{ currency: 'EUR' }
```

Un saldo di `0` è un valore **valido**: `||` lo scambierebbe per "mancante", `??` no. Lo stesso vale per una causale vuota `""` se vuoi distinguerla da `undefined`. Nel progetto lo ritroverai in `import.meta.env.VITE_API_BASE_URL ?? ""` ([Day 7](../Day_08_Advanced_Hooks_Architecture/03_Service_Layer_e_Error_Boundary.md)).

### Ternario e lookup
```javascript
const transaction = transactions[0];
const typeLabel = transaction.amount > 0 ? "Entrata" : "Uscita";
console.log(`${typeLabel}: ${transaction.description}`);

const categoryLabels = { Utenze: "Bollette", Alimentari: "Spesa" };

console.log(categoryLabels[transactions[1].category] ?? transactions[1].category);
console.log(categoryLabels[transactions[2].category] ?? transactions[2].category);
```

```text
Uscita: Spesa supermercato
Bollette
Stipendio
```

Un oggetto di lookup sostituisce una catena di ternari: la chiave è il valore da riconoscere; `??` copre i casi non previsti.

### Più di due casi: `if` con return anticipato
```javascript
function getAmountTone(amount) {
  if (amount > 0) {
    return "positive";
  }
  if (amount < 0) {
    return "negative";
  }
  return "neutral";
}

console.log(getAmountTone(2100), getAmountTone(-62.4), getAmountTone(0));
```

```text
positive negative neutral
```

La versione con ternari annidati (`a > 0 ? ... : a < 0 ? ... : ...`) sarebbe più corta ma molto meno leggibile.

### `&&` e la trappola del `0`
```javascript
const count = 0;

console.log(count && "Ci sono movimenti");
console.log(count > 0 && "Ci sono movimenti");
console.log(1 > 0 && "Ci sono movimenti");
```

```text
0
false
Ci sono movimenti
```

Nel JSX `false`, `null` e `undefined` non producono nulla a schermo, ma il numero `0` sì: per questo la condizione deve essere un **booleano** (`count > 0`).

### Anteprima: le stesse espressioni nel JSX
Snippet parziale, **non eseguibile da solo** (lo scriverai nei capitoli dei Day 2 e 5):

```jsx
{isLoading ? <LoadingMessage /> : <TransactionList transactions={transactions} />}
{error && <ErrorMessage message={error} />}
{transactions.length > 0 && <p>{transactions.length} movimenti</p>}
<span>{account?.name ?? "Conto sconosciuto"}</span>
```

Nel JSX puoi scrivere **espressioni** tra graffe, non istruzioni: per questo servono ternario e `&&` invece di `if`.

---

## 🏦 LipariBank in action
- **Day 2 — rendering condizionale:** `EmptyState` se non ci sono movimenti, importo verde o rosso in base al segno ([Day 2 · Conditional Rendering](../Day_02_Components_Props/04_Conditional_Rendering.md)).
- **Day 3:** pulsante "mostra/nascondi saldo" (`hideBalance`): il testo del pulsante e il saldo cambiano con un ternario.
- **Day 5:** loading, errore, vuoto e lista con la stessa logica ([Day 5 · Loading, Error, Empty](../Day_05_Effects_API/05_Loading_Error_Empty_States.md)).
- **Qualunque `find`:** `accounts.find(...)` può restituire `undefined`, quindi `?.` e `??`.

---

## 🧪 Your Turn
**Obiettivo:** scrivere due funzioni robuste che descrivono dati incompleti.

**Requisiti** (file `js-lab/08-exercise.js`, con `import { accounts, transactions } from "./mockData.js";` e una copia locale di `formatCurrency` del [capitolo 02](./02_Functions_Arrow_Functions.md)):

1. `describeTransaction(transaction, accounts)` restituisce la stringa `"<Entrata|Uscita>: <descrizione> — <nome conto> — <importo assoluto formattato>"`:
   - il nome del conto si cerca con `find`; se il conto non esiste scrivi `Conto sconosciuto` (usa `?.` e `??`);
   - l'importo si mostra senza segno (`Math.abs`);
   - se `transaction` è `undefined` restituisci `"Movimento non disponibile"` usando un controllo con `?.`.
2. `getBalanceLabel(balance, hideBalance)`:
   - se `hideBalance` è `true` restituisce `"••••"`;
   - se `balance` è `null` o `undefined` restituisce `"Non disponibile"`;
   - altrimenti restituisce `formatCurrency(balance)`; il saldo `0` deve produrre `0,00 €`.
3. Prova le funzioni con i casi dell'output atteso.

**Passi suggeriti:** scrivi prima `getBalanceLabel` (più semplice); per il tipo di movimento usa un ternario su `transaction.amount > 0`.

**Risultato atteso:**

```text
Entrata: Stipendio — Conto Corrente — 2.100,00 €
Uscita: Spesa supermercato — Conto Corrente — 62,40 €
Uscita: Spesa supermercato — Conto sconosciuto — 62,40 €
Movimento non disponibile
0,00 €
••••
Non disponibile
```

Le prime quattro righe si ottengono con `transactions[2]`, `transactions[0]`, `{ ...transactions[0], accountId: "acc-999" }` e `undefined`; le ultime tre con `getBalanceLabel(0, false)`, `getBalanceLabel(4250.75, true)` e `getBalanceLabel(null, false)`.

**Criteri di completamento:** nessun errore con `undefined`; il saldo `0` non viene trattato come mancante; nessun ternario annidato.

---

## ⚠️ Common Mistakes
- **Usare `||` per valori che possono essere `0` o `""`**: usa `??`.
- **`{count && <List />}` con `count = 0`**: mostra `0`. Usa `count > 0 &&`.
- **Ternari annidati** illeggibili: estrai una funzione o un lookup.
- **Usare `?.` ovunque**: nasconde errori veri. Applicalo dove il dato può **legittimamente** mancare.
- **Usare `?.` a sinistra di un'assegnazione** (`account?.name = "x"`): non è permesso.
- **Aspettarsi che `?.` gestisca una variabile non dichiarata**: restano i `ReferenceError`.

---

## ✅ Checklist
- ☐ So leggere `account?.name` e `props.onSelect?.(id)`.
- ☐ Distinguo `??` da `||` con un esempio di saldo `0`.
- ☐ So scrivere un ternario e quando evitarlo.
- ☐ So perché `count && ...` può mostrare `0` nel JSX.
- ☐ Ho completato `08-exercise.js` con l'output atteso.

---

## 🚀 Challenge
Scrivi `getTransactionBadge(transaction)` che restituisce `"Entrata"`, `"Uscita"` oppure `"Nessun dato"` (se il movimento è mancante), senza ternari annidati; poi mostra come la useresti in un componente `TransactionItem` (anche solo a parole).

---

## 📌 Recap
- `?.` ferma la catena se un valore è `undefined`/`null`; funziona anche con `[]` e con le chiamate `?.()`.
- `??` fornisce un valore di riserva solo per `null`/`undefined`; `||` per qualunque falsy.
- Il ternario è un'espressione (utile nel JSX); `&&` serve per "mostra solo se"; con più casi preferisci `if` o un lookup.
- Nelle condizioni con `&&` usa un booleano, non un numero.

*Dove lo userai:* rendering condizionale nel JSX ([Day 1 · JSX](../Day_01_React_Fundamentals/03_JSX.md), [Day 2](../Day_02_Components_Props/04_Conditional_Rendering.md)), stati loading/error ([Day 5](../Day_05_Effects_API/05_Loading_Error_Empty_States.md)).

---

### ➡️ Next
Hai completato l'Extra JavaScript: ora sei pronto per React. Prosegui con [Day 1 — React e LipariBank](../Day_01_React_Fundamentals/01_React_e_LipariBank.md), dove userai tutto questo per costruire la prima dashboard.
