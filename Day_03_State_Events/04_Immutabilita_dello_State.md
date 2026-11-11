# 🏦 LipariBank — React Zero to Hero

> **Day 3 · Capitolo 04**
> **Argomento:** Immutabilità dello State (oggetti e array)
> **Durata stimata:** 30 minuti
> **Parte di LipariBank:** i movimenti entrano nello state di `Dashboard`; un movimento può essere segnato come "preferito"

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- spiegare perché lo state di oggetti e array non si modifica "in place";
- aggiornare oggetti e array con spread, `map` e `filter`;
- riconoscere i metodi che mutano (`push`, `splice`, `sort`, `reverse`) ed evitarli sullo state;
- implementare `handleToggleFavorite` su `transactions`.

---

## 📋 Prerequisiti
- [Capitolo 03 — State e Re-render](./03_State_e_Rerender.md).
- Spread e `map`/`filter`: [Destructuring, Spread, Rest](../Extra_JavaScript_Essentials/05_Destructuring_Spread_Rest.md), [Map, Filter, Reduce](../Extra_JavaScript_Essentials/04_Map_Filter_Reduce.md).
- `Dashboard` con `hideBalance` funzionante.

---

## 🧭 In questo capitolo
- Perché React vuole nuovi oggetti, non oggetti modificati.
- Ricette: aggiungere, rimuovere, aggiornare.
- Il bug della mutazione, riprodotto.
- Preferito sui movimenti.

---

## 🧠 Theory

### Il problema
React decide se ridisegnare confrontando il **riferimento** del nuovo valore con quello vecchio. Se modifichi un array o un oggetto esistente e passi al setter *lo stesso* riferimento, per React non è cambiato nulla.

Trattiamo quindi lo state come **di sola lettura**: per cambiarlo si crea una **copia** con la modifica e si passa quella al setter.

### Ricette

| Operazione | Da evitare (muta) | Da usare (nuova copia) |
|---|---|---|
| Aggiungere a un array | `push`, `unshift` | `[...prev, item]` o `[item, ...prev]` |
| Rimuovere | `splice`, `pop`, `shift` | `prev.filter((t) => t.id !== id)` |
| Aggiornare un elemento | `prev[i].campo = x` | `prev.map((t) => t.id === id ? { ...t, campo: x } : t)` |
| Ordinare | `prev.sort(...)`, `prev.reverse()` | `[...prev].sort(...)` |
| Aggiornare un oggetto | `obj.campo = x` | `{ ...obj, campo: x }` |
| Oggetto annidato | `obj.a.b = x` | `{ ...obj, a: { ...obj.a, b: x } }` |

Lo spread (`...`) fa una copia **superficiale**: i livelli annidati restano condivisi, per questo vanno copiati esplicitamente quando li cambi.

### Con la forma funzionale
Quando il nuovo state dipende dal precedente, combina le due cose:

```jsx
setTransactions((prev) =>
  prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t)),
);
```

`map` crea un nuovo array; solo l'elemento cambiato è un nuovo oggetto, gli altri restano gli stessi riferimenti.

> 💡 **Remember**
>
> Mai `push`, `splice`, `sort`, `reverse` o assegnazioni (`obj.x = ...`) su valori che vivono nello state. Crea sempre una copia e passala al setter.

---

## 💻 Let's Code

### Il bug della mutazione
Crea `src/components/MutationLab.jsx` (componente di prova):

```jsx
import { useState } from "react";

const initialItems = [
  { id: "trx-001", description: "Spesa supermercato", isFavorite: false },
  { id: "trx-002", description: "Stipendio", isFavorite: false },
];

function MutationLab() {
  const [items, setItems] = useState(initialItems);

  function toggleWrong(id) {
    const item = items.find((t) => t.id === id);
    item.isFavorite = !item.isFavorite;
    setItems(items);
  }

  function toggleRight(id) {
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t)),
    );
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.description} {item.isFavorite ? "★" : "☆"}
          <button type="button" onClick={() => toggleWrong(item.id)}>Sbagliato</button>
          <button type="button" onClick={() => toggleRight(item.id)}>Corretto</button>
        </li>
      ))}
    </ul>
  );
}

export default MutationLab;
```

Aggiungilo temporaneamente a `App.jsx` e prova:

- "Sbagliato": la stella **non** cambia (stesso riferimento dell'array, nessun render). Se poi clicchi "Corretto" su *un'altra* riga, la prima appare improvvisamente aggiornata: il dato era già stato mutato.
- "Corretto": la stella cambia subito.

**Perché:** `setItems(items)` passa lo stesso array; React non vede differenze. `map` + spread producono un nuovo array.

### Le altre ricette, in JavaScript puro
Salva questo codice in un file `ricette.mjs` dentro `liparibank/` (fuori da `src/`) ed eseguilo con `node ricette.mjs`. Ognuna di queste operazioni lascia intatto l'originale.

```javascript
const accountsList = [
  { id: "acc-001", name: "Conto Corrente", balance: 4250.75 },
  { id: "acc-002", name: "Conto Risparmio", balance: 12800.0 },
];

const added = [...accountsList, { id: "acc-003", name: "Conto Giovani", balance: 0 }];
const removed = accountsList.filter((a) => a.id !== "acc-002");
const renamed = accountsList.map((a) =>
  a.id === "acc-001" ? { ...a, name: "Conto Principale" } : a,
);

console.log(accountsList.length, added.length, removed.length, renamed[0].name);
```

Il comando da lanciare, dentro `liparibank/`:

```bash
node ricette.mjs
```

Stampa `2 3 1 Conto Principale`; `accountsList` è rimasta identica. Elimina `ricette.mjs` quando hai finito.

---

## 🏦 LipariBank in action

I movimenti devono diventare state, perché l'utente potrà modificarli (preferito oggi, bonifici simulati nel Day 4). Il dato iniziale arriva da `mockData.js`.

In `src/components/Dashboard.jsx` (snippet parziale: import e resto del componente restano come nel capitolo 02):

```jsx
import { accounts, transactions as initialTransactions } from "../data/mockData.js";

// dentro Dashboard(), accanto a hideBalance
const [transactions, setTransactions] = useState(initialTransactions);

function handleToggleFavorite(transactionId) {
  setTransactions((prev) =>
    prev.map((transaction) =>
      transaction.id === transactionId
        ? { ...transaction, isFavorite: !transaction.isFavorite }
        : transaction,
    ),
  );
}
```

Il campo `isFavorite` non esiste nei dati iniziali: per i movimenti mai toccati vale `undefined` (falsy), dopo il primo toggle diventa `true`/`false`.

Nota: l'array importato `initialTransactions` non viene mai modificato; lo state ne parte come copia logica e ogni aggiornamento produce un nuovo array.

Per vedere il risultato senza ancora costruire il pulsante definitivo (lo farai nell'[esercizio del capitolo 06](./06_Esercizio_LipariBank_Transactions.md)), in `src/components/TransactionItem.jsx` mostra una stella accanto alla descrizione (snippet parziale: sostituisce lo `<span className="transaction-item__description">` esistente):

```jsx
<span className="transaction-item__description">
  {transaction.description} {transaction.isFavorite ? "★" : ""}
</span>
```

e in `Dashboard` aggiungi un pulsante di prova (da rimuovere dopo):

```jsx
<button type="button" onClick={() => handleToggleFavorite("trx-001")}>
  Prova preferito trx-001
</button>
```

Rinominando l'import in `initialTransactions`, il nome `transactions` dentro `Dashboard` indica ora lo **state**: tutti gli usi già presenti dal Day 2 (`AccountList`, `recentTransactions`, le card per conto) leggono quindi lo state senza altre modifiche. Cliccando il pulsante di prova, "Spesa supermercato" riceve la stella; un secondo click la toglie.

---

## 🧪 Your Turn

**Obiettivo:** applicare le ricette immutabili sui movimenti.

**Requisiti**
1. `transactions` è uno state di `Dashboard`, inizializzato da `mockData.js`.
2. `handleToggleFavorite(transactionId)` usa `setTransactions` con forma funzionale, `map` e spread.
3. Scrivi anche `handleSetNote(transactionId, note)` che aggiunge/sostituisce il campo `note` con lo stesso schema (`map` + spread).
4. Scrivi `handleRemoveTransaction(transactionId)` con `filter` (serve solo per esercizio: non lo colleghi alla UI definitiva).
5. Testa con pulsanti di prova temporanei in `Dashboard` e con la stella in `TransactionItem`.

**Passi suggeriti**
- Parti da `handleToggleFavorite`, poi copia lo schema per le altre due funzioni.
- Dopo ogni funzione, prova nel browser prima di passare alla successiva.

**Risultato atteso:** ogni funzione aggiorna la lista a schermo al primo click; `trx-001` mostra la stella o il testo della nota; la rimozione fa sparire la riga.

**Criteri di completamento**
- Nessun `push`, `splice`, `sort` o assegnazione di campo sullo state.
- Gli altri movimenti non cambiano.
- Hai rimosso componenti e pulsanti di prova (`MutationLab`, pulsanti "Prova ...").

**Suggerimento per `handleSetNote`** (solo traccia, completala tu): `prev.map((t) => t.id === id ? { ...t, note } : t)`.

---

## ⚠️ Common Mistakes

| Errore | Correzione |
|---|---|
| `transactions.push(newItem); setTransactions(transactions)` | `setTransactions((prev) => [...prev, newItem])` |
| `transactions[0].isFavorite = true` | `map` + `{ ...t, isFavorite: true }` |
| `setTransactions(transactions.sort(...))` | `setTransactions([...transactions].sort(...))` oppure ordinare **durante il render** su una copia |
| Spread superficiale su oggetto annidato | copiare anche il livello annidato: `{ ...obj, a: { ...obj.a, b } }` |
| Leggere `transactions` dentro un handler asincrono e aggiornare con quel valore | usare la forma funzionale `setTransactions((prev) => ...)` |
| Modificare l'array importato da `mockData.js` | trattare i dati importati come costanti |

---

## ✅ Checklist
- ☐ So spiegare perché `setItems(items)` dopo una mutazione non ridisegna.
- ☐ So aggiungere, rimuovere e aggiornare elementi di un array senza mutarlo.
- ☐ So aggiornare un campo di un oggetto con lo spread.
- ☐ `handleToggleFavorite` funziona e usa `map`.
- ☐ Ho eliminato i componenti e i pulsanti di prova.

---

## 🚀 Challenge
Aggiungi `handleMarkAllAsFavorite(accountId)`: segna come preferiti tutti i movimenti di un conto con un solo `map`. Poi scrivi la variante che li *deseleziona* e verifica che i movimenti degli altri conti restino gli stessi oggetti (stessi riferimenti).

---

## 📌 Recap
- React confronta i riferimenti: serve una **nuova copia**, non una modifica.
- Array: `[...prev, x]`, `filter`, `map`. Oggetti: `{ ...obj, campo }`.
- `push`, `splice`, `sort`, `reverse` e assegnazioni **mutano**: vietati sullo state.
- Con la forma funzionale + `map` si aggiorna un singolo elemento: è il pattern di `handleToggleFavorite`.

---

### ➡️ Next
[Capitolo 05 — Lifting State Up](./05_Lifting_State_Up.md): ora che sappiamo aggiornare lo state, decidiamo *dove* deve stare quando più componenti ne hanno bisogno.
