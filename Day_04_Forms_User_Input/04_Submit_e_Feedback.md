# 🏦 LipariBank — React Zero to Hero

> **Day 4 · Capitolo 04**
> **Argomento:** Submit, feedback e reset del form
> **Durata stimata:** 40 minuti
> **Parte di LipariBank:** `TransferForm` invia il bonifico simulato a `Dashboard`, che lo aggiunge a `transactions` (`handleAddTransfer`)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- gestire `onSubmit` con `event.preventDefault()` e validazione;
- mostrare un messaggio di conferma accessibile (`role="status"`);
- azzerare il form dopo l'invio;
- comunicare un'azione al componente padre con una callback (`onAddTransfer`) e aggiornare lo state del padre in modo immutabile.

---

## 📋 Prerequisiti
- [Capitolo 03 — Validazione](./03_Validazione.md): `validators.js` con `validateTransfer` e `parseAmount`, `TransferForm` con errori per campo.
- `Dashboard` con `transactions` in state: [Immutabilità](../Day_03_State_Events/05_Immutabilita_dello_State.md); callback e lifting: [Lifting State Up](../Day_03_State_Events/06_Lifting_State_Up.md).

---

## 🧭 In questo capitolo
- Il flusso del submit.
- Feedback all'utente: errore, conferma, reset.
- `handleAddTransfer` in `Dashboard`.
- `TransferForm` completo.

---

## 🧠 Theory

> 🔒 **Questo è un bonifico simulato.** Nessuna chiamata a servizi bancari, nessun denaro, nessun dato reale: il "bonifico" aggiunge solo un movimento fittizio allo state del browser. Ricaricando la pagina tutto torna ai dati iniziali.

### Il flusso del submit
1. l'utente preme "Invia" o `Invio` → scatta `onSubmit` del `<form>`;
2. `event.preventDefault()` impedisce il ricaricamento della pagina;
3. si chiama `validateTransfer(values, availableBalance)`;
4. se ci sono errori: si salvano in `errors` e ci si ferma;
5. se è valido: si chiama la callback del padre, si mostra la conferma e si azzera il form.

### Chi possiede cosa
- `TransferForm` possiede lo state **del form** (`values`, `errors`, messaggio di conferma): è il suo stato locale e non serve a nessun altro.
- `Dashboard` possiede `transactions`: è un dato condiviso (lista, saldo...). Il form non lo modifica direttamente: chiama `onAddTransfer(transfer)` e `Dashboard` aggiorna lo state.

Questo è il pattern del capitolo [Lifting State Up](../Day_03_State_Events/06_Lifting_State_Up.md): dati giù con le props, azioni su con le callback.

### Feedback accessibile
- **Errori**: già visti, con `role="alert"` per campo.
- **Conferma**: un paragrafo con `role="status"`, sempre presente nel DOM (anche vuoto) in modo che le variazioni di contenuto siano annunciate dagli screen reader.
- Il messaggio di conferma sparisce quando l'utente inizia a modificare il form: così non resta una conferma "vecchia".

### Reset
Con un form controllato il reset è un semplice `setValues(emptyValues)`: gli input si svuotano perché ricevono di nuovo `""`.

> 💡 **Remember**
>
> `onSubmit` sul `<form>`, `preventDefault()` come prima istruzione, validazione, poi azione. E sempre un feedback visibile: errore **oppure** conferma.

---

## 💻 Let's Code

### 1. `handleAddTransfer` in `Dashboard`
In `src/components/Dashboard.jsx` aggiungi la funzione (snippet parziale: il resto del file resta come alla fine del Day 3, con `beneficiaries` importato da `mockData.js`):

```jsx
function handleAddTransfer(transfer) {
  const beneficiary = beneficiaries.find((item) => item.id === transfer.beneficiaryId);
  if (!beneficiary) {
    return;
  }

  const newTransaction = {
    id: `trx-${Date.now()}`,
    accountId: transfer.accountId,
    date: new Date().toISOString().slice(0, 10),
    description: `Bonifico a ${beneficiary.name}`,
    amount: -transfer.amount,
    category: "Bonifici",
  };

  setTransactions((prev) => [newTransaction, ...prev]);
  setSelectedAccountId(transfer.accountId);
  setFilter("all");
  setSearchText("");
}
```

Commenti:

- il movimento è un **nuovo oggetto** e l'array è una **nuova copia** (`[newTransaction, ...prev]`): nessuna mutazione;
- l'importo è negativo perché il bonifico è un'uscita (convenzione di LipariBank: `amount < 0` uscita);
- `Date.now()` crea un id unico per la sessione; viene eseguito nell'handler, non nel render;
- `new Date().toISOString().slice(0, 10)` produce la data ISO `YYYY-MM-DD` (calcolata in UTC: va bene per una simulazione);
- selezionare il conto e azzerare filtri e ricerca serve a far **vedere** subito il nuovo movimento.

Nel JSX passa la callback:

```jsx
<Card title="Nuovo bonifico (simulato)">
  <TransferForm
    accounts={accounts}
    beneficiaries={beneficiaries}
    onAddTransfer={handleAddTransfer}
  />
</Card>
```

### 2. `TransferForm` completo
File `src/components/TransferForm.jsx`:

```jsx
import { useState } from "react";
import { formatCurrency } from "../utils/formatters.js";
import { REASON_MAX_LENGTH, parseAmount, validateTransfer } from "../utils/validators.js";

const emptyValues = { accountId: "", beneficiaryId: "", amount: "", reason: "" };

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error" role="alert">
      {message}
    </p>
  );
}

function TransferForm({ accounts, beneficiaries, onAddTransfer }) {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState("");

  const selectedAccount = accounts.find((account) => account.id === values.accountId);
  const selectedBeneficiary = beneficiaries.find(
    (beneficiary) => beneficiary.id === values.beneficiaryId,
  );

  function fieldA11y(name) {
    return {
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `${name}-error` : undefined,
    };
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      ...(name === "accountId" ? { amount: undefined } : {}),
    }));
    setConfirmation("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const availableBalance = selectedAccount ? selectedAccount.balance : 0;
    const validationErrors = validateTransfer(values, availableBalance);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setConfirmation("");
      return;
    }

    const amount = parseAmount(values.amount);
    onAddTransfer({
      accountId: values.accountId,
      beneficiaryId: values.beneficiaryId,
      amount,
      reason: values.reason.trim(),
    });

    setConfirmation(
      `Bonifico SIMULATO di ${formatCurrency(amount)} a ${selectedBeneficiary.name} registrato. Nessuna operazione bancaria reale è stata eseguita.`,
    );
    setValues(emptyValues);
    setErrors({});
  }

  return (
    <form className="transfer-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="accountId">Conto di addebito</label>
        <select
          id="accountId"
          name="accountId"
          value={values.accountId}
          onChange={handleChange}
          {...fieldA11y("accountId")}
        >
          <option value="">Seleziona un conto</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
        {selectedAccount && <p>Saldo disponibile: {formatCurrency(selectedAccount.balance)}</p>}
        <FieldError id="accountId-error" message={errors.accountId} />
      </div>

      <div className="form-field">
        <label htmlFor="beneficiaryId">Beneficiario</label>
        <select
          id="beneficiaryId"
          name="beneficiaryId"
          value={values.beneficiaryId}
          onChange={handleChange}
          {...fieldA11y("beneficiaryId")}
        >
          <option value="">Seleziona un beneficiario</option>
          {beneficiaries.map((beneficiary) => (
            <option key={beneficiary.id} value={beneficiary.id}>
              {beneficiary.name}
            </option>
          ))}
        </select>
        {selectedBeneficiary && <p>IBAN: {selectedBeneficiary.iban}</p>}
        <FieldError id="beneficiaryId-error" message={errors.beneficiaryId} />
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
          {...fieldA11y("amount")}
        />
        <FieldError id="amount-error" message={errors.amount} />
      </div>

      <div className="form-field">
        <label htmlFor="reason">Causale</label>
        <textarea
          id="reason"
          name="reason"
          rows={3}
          value={values.reason}
          onChange={handleChange}
          {...fieldA11y("reason")}
        />
        <p>
          {values.reason.length}/{REASON_MAX_LENGTH} caratteri
        </p>
        <FieldError id="reason-error" message={errors.reason} />
      </div>

      <button type="submit">Invia bonifico simulato</button>
      <p role="status" className="form-success">
        {confirmation}
      </p>
    </form>
  );
}

export default TransferForm;
```

Stile (in `src/index.css`):

```css
.form-success {
  color: #0a6b2d;
}

.form-success:empty {
  display: none;
}
```

**Che cosa fa:** valida; se è tutto corretto chiama `onAddTransfer`, mostra la conferma e svuota il form.
**Perché funziona:** la callback porta i dati in `Dashboard`, che aggiorna `transactions` in modo immutabile; il nuovo state fa ridisegnare `TransactionList`.
**Come modificarlo:** cambia il testo di conferma o aggiungi il riepilogo del conto addebitato.
**Cosa evitare:** chiamare `onAddTransfer` prima della validazione e dimenticare `preventDefault()`. Attenzione anche alla snapshot (capitolo 03 del Day 3): dopo `setValues(emptyValues)` la variabile `values` dentro lo stesso handler contiene ancora i **vecchi** valori, e li vedrai azzerati solo al render successivo; per chiarezza `amount` è calcolato **prima** del reset e il messaggio usa `selectedBeneficiary` del render corrente.

---

## 🏦 LipariBank in action

Prova un bonifico completo:

1. Conto: "Conto Corrente"; beneficiario: "Giulia Bianchi"; importo: `100`; causale: "Rimborso cena".
2. Premi "Invia bonifico simulato".

Risultato:

- compare la conferma *Bonifico SIMULATO di 100,00 € a Giulia Bianchi registrato. Nessuna operazione bancaria reale è stata eseguita.*;
- il form si svuota;
- in cima ai movimenti del Conto Corrente compare `Bonifico a Giulia Bianchi` di `-100,00 €`, categoria "Bonifici".

Nota: a questo punto il **saldo mostrato** nelle card non cambia ancora e il controllo "saldo insufficiente" usa sempre il saldo iniziale. Lo correggiamo nell'[esercizio del capitolo 05](./05_Esercizio_LipariBank_Bonifico.md), ricalcolando i saldi come dato derivato.

---

## 🧪 Your Turn

**Obiettivo:** completare il flusso di submit.

**Requisiti**
1. `TransferForm` chiama `event.preventDefault()`, valida e, se ci sono errori, **non** chiama `onAddTransfer`.
2. Con dati validi chiama `onAddTransfer({ accountId, beneficiaryId, amount, reason })` con `amount` **numero**.
3. `Dashboard` implementa `handleAddTransfer` creando un movimento nel formato `{ id, accountId, date, description: "Bonifico a <nome>", amount: -importo, category: "Bonifici" }` senza mutare `transactions`.
4. Dopo l'invio: conferma con `role="status"` che dichiara esplicitamente che il bonifico è **simulato**, form svuotato, errori azzerati.
5. La conferma sparisce appena l'utente modifica un campo.

**Passi suggeriti**
- Aggiungi prima `onAddTransfer` come prop, poi implementa `handleAddTransfer`.
- Prova con `console.log(newTransaction)` per controllare la forma dell'oggetto, poi rimuovilo.

**Risultato atteso:** un bonifico valido aggiunge una riga in cima ai movimenti del conto scelto; un secondo bonifico ne aggiunge un'altra; ricaricando la pagina le righe aggiunte spariscono (state in memoria).

**Criteri di completamento**
- Nessun `push` su `transactions`.
- Il messaggio di conferma non resta dopo aver modificato un campo.
- Nessun warning in Console.

---

## ⚠️ Common Mistakes

| Errore | Correzione |
|---|---|
| Niente `preventDefault()` | la pagina si ricarica: chiamarlo per primo |
| Chiamare `onAddTransfer(values)` con `amount` stringa | convertire con `parseAmount` |
| `transactions.push(newTransaction)` in `Dashboard` | `setTransactions((prev) => [newTransaction, ...prev])` |
| `amount: transfer.amount` (positivo) | uscita: `-transfer.amount` |
| Aspettarsi che `values` sia già vuoto subito dopo `setValues(emptyValues)` | nell'handler `values` resta la snapshot del render corrente: calcolare ciò che serve prima del reset |
| Conferma che resta a schermo dopo nuove modifiche | `setConfirmation("")` in `handleChange` |
| `Date.now()` nel corpo del componente | solo dentro gli handler |
| Presentare la conferma come reale | testo esplicito: bonifico **simulato** |

---

## ✅ Checklist
- ☐ Con form invalido compaiono gli errori e non viene creato alcun movimento.
- ☐ Con form valido il movimento compare in cima alla lista del conto scelto.
- ☐ Il messaggio di conferma dichiara che il bonifico è simulato.
- ☐ Il form si svuota dopo l'invio.
- ☐ `transactions` non viene mai mutato.

---

## 🚀 Challenge
Salva anche la causale: aggiungi al movimento il campo `note: transfer.reason` (come per le note del Day 3) e mostrala sotto la descrizione in `TransactionItem` quando presente. Perché è giusto aggiungerla con lo spread/oggetto nuovo e non modificando il movimento dopo averlo creato?

---

## 📌 Recap
- `onSubmit` + `preventDefault()` + validazione, poi azione e feedback.
- Il form tiene lo state locale; il dato condiviso (`transactions`) resta in `Dashboard` e si cambia via callback.
- Il nuovo movimento è un oggetto nuovo inserito in un array nuovo (`[newTransaction, ...prev]`).
- Conferma con `role="status"` e reset con `setValues(emptyValues)`.
- Il bonifico è **simulato**: nessuna operazione reale.

---

### ➡️ Next
[Capitolo 05 — Esercizio LipariBank Bonifico](./05_Esercizio_LipariBank_Bonifico.md): ricalcoliamo i saldi come dati derivati e verifichiamo l'intero flusso con scenari concreti.
