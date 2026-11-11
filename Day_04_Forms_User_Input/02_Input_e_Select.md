# 🏦 LipariBank — React Zero to Hero

> **Day 4 · Capitolo 02**
> **Argomento:** `input`, `select`, `textarea` e state a oggetto
> **Durata stimata:** 35 minuti
> **Parte di LipariBank:** `TransferForm` completo nei campi: conto di addebito, beneficiario, importo, causale

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- controllare `<input>`, `<select>` e `<textarea>` con `value` + `onChange`;
- gestire più campi con **un solo state a oggetto** e un unico `handleChange` (`[name]: value`);
- spiegare perché il valore di un `type="number"` è una stringa;
- popolare un `<select>` da un array con `map` e `key`.

---

## 📋 Prerequisiti
- [Capitolo 01 — Form e Controlled Components](./01_Form_e_Controlled_Components.md): `TransferForm` con il campo `amount` in `Dashboard`.
- Aggiornamenti immutabili di oggetti: [Immutabilità](../Day_03_State_Events/04_Immutabilita_dello_State.md).
- Computed property names: [Objects e Arrays](../Extra_JavaScript_Essentials/03_Objects_Arrays.md) e [Destructuring, Spread, Rest](../Extra_JavaScript_Essentials/05_Destructuring_Spread_Rest.md).

---

## 🧭 In questo capitolo
- Particolarità di `select` e `textarea` in React.
- Number input: valore stringa.
- Un solo state, un solo `handleChange`.
- `TransferForm` completo (senza ancora validazione).

---

## 🧠 Theory

### `<input>`
Come nel capitolo precedente: `value` + `onChange`. Per `type="number"`, `event.target.value` è **sempre una stringa** (`"12.5"`, oppure `""` se vuoto). Non è un `Number`: la conversione avviene solo quando serve (validazione e invio, capitoli 03-04). Convertire a ogni tasto causerebbe problemi, ad esempio con `""` o `"12."`.

### `<select>`
In React il valore selezionato si imposta con `value` **sul `<select>`**, non con `selected` sulle `<option>`:

```jsx
<select value={values.accountId} onChange={handleChange}>
  <option value="">Seleziona un conto</option>
  <option value="acc-001">Conto Corrente</option>
</select>
```

La prima `<option value="">` fa da segnaposto e rende "non selezionato" un valore rappresentabile.

### `<textarea>`
Anche qui `value` + `onChange`; il testo **non** va tra i tag (`<textarea>testo</textarea>`), ma in `value`. Si usa `rows` per l'altezza iniziale.

### Un solo state, un solo handler
Con più campi, un `useState` ciascuno diventa ripetitivo. Si usa un **oggetto**, e i campi hanno l'attributo `name` uguale alla chiave:

```jsx
const [values, setValues] = useState({ accountId: "", beneficiaryId: "", amount: "", reason: "" });

function handleChange(event) {
  const { name, value } = event.target;
  setValues((prev) => ({ ...prev, [name]: value }));
}
```

`[name]: value` è una *computed property name*: la chiave è il contenuto della variabile `name`. Lo spread copia gli altri campi: l'aggiornamento è **immutabile**.

> 💡 **Remember**
>
> Un solo `handleChange` funziona per tutti i campi se ogni campo ha `name` uguale alla chiave dello state. Leggi `name` e `value` da `event.target` **prima** di usarli nella funzione di aggiornamento.

---

## 💻 Let's Code

Mini-esempio isolato (snippet parziale, da provare in un componente temporaneo): un select popolato da un array.

```jsx
const beneficiaryOptions = [
  { id: "ben-001", name: "Giulia Bianchi" },
  { id: "ben-002", name: "Luca Verdi" },
];

<select name="beneficiaryId" value={values.beneficiaryId} onChange={handleChange}>
  <option value="">Seleziona un beneficiario</option>
  {beneficiaryOptions.map((b) => (
    <option key={b.id} value={b.id}>
      {b.name}
    </option>
  ))}
</select>
```

Ogni `<option>` ha `key` (come per ogni lista) e `value` (ciò che finirà nello state: l'`id`, non il nome).

Per capire i valori in gioco, aggiungi temporaneamente al form un debug dello state:

```jsx
<pre>{JSON.stringify(values, null, 2)}</pre>
```

Mentre compili il form vedrai `amount` come stringa (`"120.5"`) e gli id selezionati.

---

## 🏦 LipariBank in action

> 🔒 **Simulazione.** Il form prepara un bonifico fittizio: nessun dato lascia il browser.

File `src/components/TransferForm.jsx` (sostituisce la versione del capitolo 01):

```jsx
import { useState } from "react";
import { formatCurrency } from "../utils/formatters.js";

const emptyValues = { accountId: "", beneficiaryId: "", amount: "", reason: "" };

function TransferForm({ accounts, beneficiaries }) {
  const [values, setValues] = useState(emptyValues);

  const selectedAccount = accounts.find((account) => account.id === values.accountId);
  const selectedBeneficiary = beneficiaries.find(
    (beneficiary) => beneficiary.id === values.beneficiaryId,
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Bonifico (simulato):", values);
  }

  return (
    <form className="transfer-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="accountId">Conto di addebito</label>
        <select id="accountId" name="accountId" value={values.accountId} onChange={handleChange}>
          <option value="">Seleziona un conto</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
        {selectedAccount && <p>Saldo disponibile: {formatCurrency(selectedAccount.balance)}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="beneficiaryId">Beneficiario</label>
        <select
          id="beneficiaryId"
          name="beneficiaryId"
          value={values.beneficiaryId}
          onChange={handleChange}
        >
          <option value="">Seleziona un beneficiario</option>
          {beneficiaries.map((beneficiary) => (
            <option key={beneficiary.id} value={beneficiary.id}>
              {beneficiary.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="amount">Importo (EUR)</label>
        <input
          id="amount"
          name="amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={values.amount}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="reason">Causale</label>
        <textarea
          id="reason"
          name="reason"
          rows={3}
          value={values.reason}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Invia bonifico simulato</button>
    </form>
  );
}

export default TransferForm;
```

In `src/components/Dashboard.jsx` importa i beneficiari e passa le props (snippet parziale):

```jsx
import { accounts, beneficiaries, transactions as initialTransactions } from "../data/mockData.js";

// nel JSX
<Card title="Nuovo bonifico (simulato)">
  <TransferForm accounts={accounts} beneficiaries={beneficiaries} />
</Card>
```

Aggiungi a `src/index.css` un minimo di stile per i campi:

```css
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.transfer-form textarea,
.transfer-form select,
.transfer-form input {
  font: inherit;
  padding: 0.5rem;
}
```

**Che cosa fa:** quattro campi controllati da un unico oggetto `values`; il `console.log` al submit mostra l'oggetto completo.
**Perché funziona:** ogni campo ha `name` uguale alla chiave, quindi `[name]: value` aggiorna il campo giusto.
**Come modificarlo:** aggiungi un campo `executionDate` (`type="date"`) e osserva che basta una chiave in `emptyValues` e un nuovo input con `name="executionDate"`.
**Cosa evitare:** `name` diverso dalla chiave (es. `name="importo"`): lo state riceverebbe una chiave nuova e il campo `amount` non cambierebbe.

La select dei conti mostra qui `account.balance` dei dati iniziali: nel capitolo [Esercizio Bonifico](./05_Esercizio_LipariBank_Bonifico.md) il saldo mostrato si aggiornerà dopo ogni bonifico simulato.

---

## 🧪 Your Turn

**Obiettivo:** completare i campi di `TransferForm` e sfruttare i dati derivati.

**Requisiti**
1. Il form ha quattro campi controllati: conto (select), beneficiario (select), importo (input number), causale (textarea), tutti gestiti da **un solo** `useState` e **un solo** `handleChange`.
2. Le opzioni dei select vengono da `accounts` e `beneficiaries` (props) con `map` e `key`.
3. Sotto il select del beneficiario mostra l'IBAN del beneficiario scelto (`selectedBeneficiary.iban`), **senza** salvarlo in un secondo state: è un dato derivato.
4. Sotto la textarea mostra un contatore `N caratteri` basato su `values.reason.length`.
5. Al submit, `console.log` stampa l'oggetto `values`; la pagina non si ricarica.

**Passi suggeriti**
- Parti da `emptyValues` e dagli `name` dei campi.
- Usa il blocco `<pre>{JSON.stringify(values, null, 2)}</pre>` per controllare lo state, e toglilo alla fine.

**Risultato atteso:** selezionando "Giulia Bianchi" compare `IT00 0000 0000 0000 0000 0000 111`; digitando `120.5` in importo il `<pre>` mostra `"amount": "120.5"` (stringa); la causale "Affitto" mostra `7 caratteri`.

**Criteri di completamento**
- Un solo `useState` per i valori del form.
- L'IBAN e il contatore non sono in state.
- Nessun warning in Console.

---

## ⚠️ Common Mistakes

| Errore | Correzione |
|---|---|
| `<option selected>` per preselezionare | `value` sul `<select>` |
| `<textarea>{values.reason}</textarea>` | `<textarea value={values.reason} onChange={...} />` |
| `name` dell'input diverso dalla chiave dello state | allineare `name` e chiave |
| `setValues({ [name]: value })` | si perdono gli altri campi: `setValues((prev) => ({ ...prev, [name]: value }))` |
| Trattare `values.amount` come numero (`values.amount + 1`) | è una stringa: converti con `Number(...)` al momento giusto |
| `useState` iniziale con `undefined` nei campi | usare `""` |
| Option senza `key` | `key={account.id}` |

---

## ✅ Checklist
- ☐ Ho un solo state a oggetto e un solo `handleChange`.
- ☐ So perché `value` di `type="number"` è una stringa.
- ☐ Select e textarea sono controllati correttamente.
- ☐ L'IBAN del beneficiario e il contatore sono dati derivati.
- ☐ Ho rimosso l'eventuale `<pre>` di debug.

---

## 🚀 Challenge
Aggiungi un `<input type="checkbox">` "Salva beneficiario tra i preferiti". Per le checkbox si controlla `checked` (non `value`) e si legge `event.target.checked`: come adatti `handleChange` per gestire anche questo caso?

---

## 📌 Recap
- `input`, `select`, `textarea` si controllano con `value` + `onChange` (su `select` il `value` è sul `<select>`).
- `type="number"` restituisce una **stringa**.
- Un oggetto di state + `[name]: value` gestisce tutti i campi con un solo handler.
- Ciò che si può calcolare (IBAN scelto, numero di caratteri) non va in state.

---

### ➡️ Next
[Capitolo 03 — Validazione](./03_Validazione.md): aggiungiamo `src/utils/validators.js` e i messaggi di errore per campo.
