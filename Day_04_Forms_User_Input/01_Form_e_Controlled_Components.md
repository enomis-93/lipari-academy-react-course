# 🏦 LipariBank — React Zero to Hero

> **Day 4 · Capitolo 01**
> **Argomento:** Form e Controlled Components
> **Durata stimata:** 30 minuti
> **Parte di LipariBank:** nasce `TransferForm.jsx` (per ora con il solo campo "importo") nella `Dashboard`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- spiegare la differenza tra componente controllato e non controllato;
- costruire un `<input>` controllato con `value` e `onChange`;
- usare `<form>`, `<label htmlFor>` e un pulsante `type="submit"`;
- riconoscere i warning più comuni sui form in React.

---

## 📋 Prerequisiti
- Day 3 completato (CHECKPOINT 3): `Dashboard` con `selectedAccountId`, `hideBalance`, `filter`, `searchText`, `transactions`; vedi [Esercizio LipariBank Transactions](../Day_03_State_Events/07_Esercizio_LipariBank_Transactions.md).
- `useState` e immutabilità: [useState](../Day_03_State_Events/02_useState.md), [Immutabilità](../Day_03_State_Events/05_Immutabilita_dello_State.md).

---

## 🧭 In questo capitolo
- Controlled vs uncontrolled.
- Il ciclo "digito → onChange → state → re-render → value".
- `<form>`, `<label>`, submit.
- Primo `TransferForm` in LipariBank.

---

## 🧠 Theory

### Controlled component
Un input HTML normalmente tiene il proprio valore nel DOM. In React il form è **controllato** quando il valore vive nello **state** e l'input lo riceve con `value`:

```jsx
<input value={amount} onChange={(event) => setAmount(event.target.value)} />
```

Il ciclo è sempre lo stesso:

1. l'utente digita un carattere;
2. scatta `onChange` e l'handler chiama il setter con `event.target.value`;
3. React riesegue il componente;
4. l'input mostra il valore dello state.

Lo state è la **single source of truth**: puoi leggere, validare, trasformare o azzerare il valore in qualsiasi momento.

### Uncontrolled (cenno)
Con `defaultValue` o un `ref`, il valore resta nel DOM e lo leggi solo quando serve. È più semplice per form minimi, ma rende più difficili validazione live, reset e campi dipendenti. In questo corso useremo componenti controllati.

### Il form e il submit
- `<form onSubmit={handleSubmit}>`: l'evento arriva anche quando l'utente preme `Invio` in un campo.
- Il pulsante di invio è `<button type="submit">`.
- Nell'handler si chiama `event.preventDefault()`, altrimenti il browser ricarica la pagina (lo approfondiamo nel [capitolo 04](./04_Submit_e_Feedback.md)).

### Label
Ogni campo ha una `<label>` collegata: in JSX l'attributo è `htmlFor` (non `for`) e deve coincidere con l'`id` dell'input. Migliora l'accessibilità e allarga l'area cliccabile.

> 💡 **Remember**
>
> `value` senza `onChange` blocca il campo (React avvisa che è *read-only*). Il valore iniziale di un campo di testo è **`""`**, mai `undefined` o `null`: altrimenti React passa da "non controllato" a "controllato" e mostra un warning.

---

## 💻 Let's Code

Componente di prova `src/components/AmountDemo.jsx` (da eliminare a fine capitolo):

```jsx title="src/components/AmountDemo.jsx"
import { useState } from "react";

function AmountDemo() {
  const [amount, setAmount] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Importo inviato:", amount);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="demo-amount">Importo (EUR)</label>
      <input
        id="demo-amount"
        type="text"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />
      <p>Stai digitando: {amount}</p>
      <button type="submit">Invia</button>
    </form>
  );
}

export default AmountDemo;
```

Aggiungilo temporaneamente a `src/App.jsx` (`import AmountDemo from "./components/AmountDemo.jsx";` e `<AmountDemo />` nel JSX), poi prova:

- digita: il paragrafo si aggiorna a ogni tasto, perché è lo state a guidare la UI;
- premi `Invio` o "Invia": in Console compare `Importo inviato: ...` e la pagina **non** si ricarica;
- togli `event.preventDefault()`: la pagina si ricarica e lo state si perde. Rimettilo.

**Che cosa fa:** mantiene il testo dell'importo nello state e lo mostra.
**Perché funziona:** ogni modifica passa da `setAmount`, quindi React riesegue il componente con il nuovo `value`.
**Come modificarlo:** aggiungi un pulsante "Azzera" con `onClick={() => setAmount("")}`: l'input si svuota perché è controllato.
**Cosa evitare:** `value={amount}` senza `onChange`, o `useState()` senza valore iniziale.

---

## 🏦 LipariBank in action

> 🔒 **Simulazione.** Tutto il bonifico di LipariBank è **simulato**: nessuna operazione bancaria reale, nessun servizio esterno, solo dati fittizi nello state del browser.

Creiamo lo scheletro del form di bonifico. Per ora ha un solo campo (`amount`) e non fa nulla di concreto al submit.

File `src/components/TransferForm.jsx`:

```jsx title="src/components/TransferForm.jsx"
import { useState } from "react";

function TransferForm() {
  const [amount, setAmount] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Bonifico (simulato) di importo:", amount);
  }

  return (
    <form className="transfer-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="amount">Importo (EUR)</label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </div>
      <button type="submit">Invia bonifico simulato</button>
    </form>
  );
}

export default TransferForm;
```

In `src/components/Dashboard.jsx` importa e mostra il form dentro una `Card` (snippet parziale: aggiungi gli import in cima e il blocco in fondo al JSX, dopo la card dei movimenti):

```jsx
import TransferForm from "./TransferForm.jsx";

// nel JSX
<Card title="Nuovo bonifico (simulato)">
  <TransferForm />
</Card>
```

Il campo `type="number"` fornisce una tastiera numerica sui dispositivi mobili, ma **il suo `value` resta una stringa** (es. `"12.5"`): lo gestiremo nel [capitolo 02](./02_Input_e_Select.md).

---

## 🧪 Your Turn

**Obiettivo:** familiarizzare con il ciclo dei controlled component.

**Requisiti**
1. `TransferForm` esiste, ha un campo "Importo" controllato e un pulsante `type="submit"`.
2. `TransferForm` è visibile in `Dashboard` dentro una `Card` titolata "Nuovo bonifico (simulato)".
3. Al submit la pagina non si ricarica e in Console compare `Bonifico (simulato) di importo: <valore>`.
4. Sotto l'input mostra una riga "Hai digitato: <valore>" aggiornata a ogni tasto.
5. Aggiungi un pulsante `type="button"` "Azzera" che svuota il campo.

**Passi suggeriti**
- Parti dal codice di `AmountDemo`, poi spostalo in `TransferForm`.
- Prova a rimuovere `onChange` per vedere il warning in Console; poi ripristinalo.

**Risultato atteso:** digitando `120.5` vedi "Hai digitato: 120.5"; `Invio` stampa il valore in Console senza ricaricare la pagina; "Azzera" svuota l'input.

**Criteri di completamento**
- Nessun warning in Console (né "read-only", né "uncontrolled to controlled").
- Il valore iniziale dello state è `""`.
- Hai eliminato `AmountDemo.jsx` e il suo uso in `App.jsx`.

---

## ⚠️ Common Mistakes

| Errore | Sintomo | Correzione |
|---|---|---|
| `value` senza `onChange` | campo bloccato + warning | aggiungere `onChange` (o `readOnly` se voluto) |
| `useState()` / `useState(null)` per un testo | warning "uncontrolled to controlled" | `useState("")` |
| `for="amount"` nella label | warning su `for` | `htmlFor="amount"` |
| Dimenticare `preventDefault()` | la pagina si ricarica al submit | chiamarlo nell'handler di `onSubmit` |
| Pulsante senza `type` dentro il form | invia il form anche se non vuoi | `type="button"` per i pulsanti che non inviano |
| Mettere `onClick` sul pulsante di submit invece di `onSubmit` sul form | `Invio` nei campi non funziona | gestire `onSubmit` sul `<form>` |

---

## ✅ Checklist
- ☐ So descrivere il ciclo digito → `onChange` → state → render → `value`.
- ☐ So perché lo state iniziale di un input di testo è `""`.
- ☐ `TransferForm` compare in `Dashboard` e il submit non ricarica la pagina.
- ☐ Ho collegato `label` e `input` con `htmlFor`/`id`.
- ☐ Ho eliminato il componente di prova.

---

## 🚀 Challenge
Aggiungi un secondo campo di testo "Causale" con un proprio state e mostra sotto il form un riepilogo live: `Importo: <amount> — Causale: <reason>`. Riflessione: quanti `useState` hai usato? Nel prossimo capitolo li raggruppiamo in uno solo.

---

## 📌 Recap
- Un componente è **controllato** quando `value` viene dallo state e `onChange` lo aggiorna.
- Il valore iniziale di un campo testo è `""`.
- `<form onSubmit>` + `preventDefault()` evitano il ricaricamento della pagina.
- `label` + `htmlFor` + `id` rendono il campo accessibile.
- In LipariBank il bonifico è una **simulazione**: nessuna operazione reale.

---

### ➡️ Next
[Capitolo 02 — Input e Select](./02_Input_e_Select.md): completiamo `TransferForm` con select, textarea e uno state a oggetto con `[name]: value`.
