# 🏦 LipariBank — React Zero to Hero

> **Day 4 · Capitolo 03**
> **Argomento:** Validazione dei form e messaggi di errore accessibili
> **Durata stimata:** 40 minuti
> **Parte di LipariBank:** `src/utils/validators.js` (`validateTransfer`) e errori per campo in `TransferForm`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- scrivere una funzione di validazione pura che restituisce un oggetto `errors`;
- validare campi obbligatori, importo (> 0, massimo 2 decimali, ≤ saldo del conto) e lunghezza della causale;
- mostrare un messaggio per campo con `aria-invalid`, `aria-describedby` e `role="alert"`;
- distinguere la validazione lato client (esperienza utente) da quella lato server (sicurezza).

---

## 📋 Prerequisiti
- [Capitolo 02 — Input e Select](./02_Input_e_Select.md): `TransferForm` con `values` e `handleChange`, `Dashboard` che passa `accounts` e `beneficiaries`.
- Funzioni pure e moduli ES: [ES Modules](../Extra_JavaScript_Essentials/06_ES_Modules.md).

---

## 🧭 In questo capitolo
- Dove e quando validare.
- `validators.js` con `validateTransfer(values, availableBalance)`.
- Errori per campo, mostrati con attributi ARIA di base.
- Verifica della funzione con Node.

---

## 🧠 Theory

### Perché validare
La validazione lato client aiuta l'utente a correggere subito gli errori. **Non** è una misura di sicurezza: un'app reale deve rivalidare sempre sul server. In LipariBank non c'è server e il bonifico è simulato, ma impariamo il pattern corretto.

### Dove: una funzione pura
Metti le regole in una funzione separata, senza React: `validateTransfer(values, availableBalance)` riceve i valori e il saldo disponibile e restituisce un oggetto:

```javascript
{}                                   // valido
{ amount: "Saldo insufficiente." }   // errore su un campo
```

Oggetto **vuoto = form valido**. Ha tre vantaggi: è testabile senza UI, riutilizzabile, e la UI si limita a mostrare `errors.amount`, `errors.reason`...

### Quando validare
- **al submit** (scelta di questo corso): semplice e non invasivo;
- *al blur* o *ad ogni modifica*: più reattivo ma più rumoroso (vedi Challenge).

Dopo l'invio con errori, ripulisci l'errore di un campo quando l'utente lo modifica.

### Regole del bonifico LipariBank

| Campo | Regola |
|---|---|
| `accountId` | obbligatorio |
| `beneficiaryId` | obbligatorio |
| `amount` | obbligatorio; numero; > 0; massimo 2 decimali; ≤ saldo del conto scelto |
| `reason` | obbligatoria; massimo 140 caratteri |

L'importo arriva come **stringa** (ricorda il capitolo precedente): lo si controlla con una espressione regolare e solo dopo lo si converte.

### Accessibilità dei messaggi di errore
- `aria-invalid="true"` sul campo con errore: gli screen reader lo segnalano come non valido.
- `aria-describedby="<id-errore>"`: collega il campo al suo messaggio.
- `role="alert"` sul messaggio: viene annunciato quando compare.
- Non affidarti solo al colore rosso: il messaggio è testo.

> 💡 **Remember**
>
> La validazione è una **funzione pura** che restituisce `errors`. Il componente decide quando chiamarla e come mostrarla. Oggetto vuoto = nessun errore.

---

## 💻 Let's Code

### 1. `src/utils/validators.js`

```javascript
export const REASON_MAX_LENGTH = 140;

const AMOUNT_PATTERN = /^-?\d+([.,]\d{1,2})?$/;

export function parseAmount(value) {
  return Number(String(value).trim().replace(",", "."));
}

export function validateTransfer(values, availableBalance) {
  const errors = {};

  if (!values.accountId) {
    errors.accountId = "Seleziona il conto di addebito.";
  }

  if (!values.beneficiaryId) {
    errors.beneficiaryId = "Seleziona un beneficiario.";
  }

  const rawAmount = String(values.amount).trim();
  if (rawAmount === "") {
    errors.amount = "Inserisci l'importo.";
  } else if (!AMOUNT_PATTERN.test(rawAmount)) {
    errors.amount = "Importo non valido: usa solo cifre e al massimo 2 decimali.";
  } else {
    const amount = parseAmount(rawAmount);
    if (amount <= 0) {
      errors.amount = "L'importo deve essere maggiore di zero.";
    } else if (values.accountId && amount > availableBalance) {
      errors.amount = "Saldo insufficiente sul conto selezionato.";
    }
  }

  const reason = values.reason.trim();
  if (reason === "") {
    errors.reason = "Inserisci la causale.";
  } else if (reason.length > REASON_MAX_LENGTH) {
    errors.reason = `La causale può contenere al massimo ${REASON_MAX_LENGTH} caratteri.`;
  }

  return errors;
}
```

**Che cosa fa:** controlla i campi in ordine e riempie `errors`, un solo messaggio per campo.
**Perché funziona:** la regex accetta cifre con al massimo due decimali (separatore `.` o `,`); solo se il formato è valido si converte con `parseAmount` e si confronta con 0 e con il saldo.
**Come modificarlo:** cambia `REASON_MAX_LENGTH` o aggiungi un importo massimo per operazione.
**Cosa evitare:** controllare `amount > availableBalance` prima di verificare il formato (`NaN` darebbe risultati ingannevoli) e usare `Number(values.amount)` per "validare" (`Number("")` vale `0`, `Number("abc")` vale `NaN`).

### 2. Verifica la funzione senza React
Dentro `liparibank/` esegui (il template Vite imposta `"type": "module"` in `package.json`, quindi gli `import` funzionano):

```bash
node --input-type=module -e "import { validateTransfer } from './src/utils/validators.js'; console.log(validateTransfer({ accountId: 'acc-001', beneficiaryId: '', amount: '-5', reason: '' }, 4250.75))"
```

Output atteso (la formattazione può variare leggermente):

```text
{
  beneficiaryId: 'Seleziona un beneficiario.',
  amount: "L'importo deve essere maggiore di zero.",
  reason: 'Inserisci la causale.'
}
```

Prova altri valori: `amount: '12.345'` produce l'errore sui decimali; `amount: '5000'` con saldo `4250.75` produce "Saldo insufficiente".

### 3. Mostrare gli errori in `TransferForm`
Snippet parziale (non eseguibile da solo): aggiungi questi pezzi a `src/components/TransferForm.jsx`, mantenendo il resto del capitolo 02.

In cima al file:

```jsx
import { parseAmount, validateTransfer, REASON_MAX_LENGTH } from "../utils/validators.js";

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error" role="alert">
      {message}
    </p>
  );
}
```

Dentro `TransferForm`, accanto a `values`:

```jsx
const [errors, setErrors] = useState({});

function fieldA11y(name) {
  return {
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  };
}
```

`handleChange` ripulisce l'errore del campo modificato (e quello dell'importo se cambia il conto, perché il saldo cambia):

```jsx
function handleChange(event) {
  const { name, value } = event.target;
  setValues((prev) => ({ ...prev, [name]: value }));
  setErrors((prev) => ({
    ...prev,
    [name]: undefined,
    ...(name === "accountId" ? { amount: undefined } : {}),
  }));
}
```

`handleSubmit` valida e si ferma se ci sono errori (la parte di invio arriva nel capitolo 04):

```jsx
function handleSubmit(event) {
  event.preventDefault();
  const availableBalance = selectedAccount ? selectedAccount.balance : 0;
  const validationErrors = validateTransfer(values, availableBalance);
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length > 0) {
    return;
  }

  console.log("Bonifico valido (simulato):", values, parseAmount(values.amount));
}
```

Ogni campo usa lo stesso schema. Esempio per l'importo:

```jsx
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
```

Ripeti `{...fieldA11y("accountId")}` / `<FieldError id="accountId-error" ... />` per il select del conto, e lo stesso per `beneficiaryId` e `reason`. Per la textarea aggiungi anche il contatore:

```jsx
<p>{values.reason.length}/{REASON_MAX_LENGTH} caratteri</p>
```

Infine, sul tag `<form>` aggiungi `noValidate`: disattiva la validazione nativa del browser (che mostrerebbe i propri messaggi, ad esempio per `min` e `step`), così le regole sono tutte le tue.

```jsx
<form className="transfer-form" onSubmit={handleSubmit} noValidate>
```

Stile (in `src/index.css`):

```css
.field-error {
  color: #b00020;
  margin: 0;
}

.transfer-form [aria-invalid="true"] {
  border: 2px solid #b00020;
}
```

---

## 🏦 LipariBank in action

Con il form completo puoi provare questi casi (Conto Corrente: `4.250,75 €`; Conto Risparmio: `12.800,00 €`):

| Input | Messaggio atteso |
|---|---|
| Submit con form vuoto | 4 errori: conto, beneficiario, importo, causale |
| Importo `0` | L'importo deve essere maggiore di zero. |
| Importo `-10` | L'importo deve essere maggiore di zero. |
| Importo `12.345` | Importo non valido: usa solo cifre e al massimo 2 decimali. |
| Importo `5000`, Conto Corrente | Saldo insufficiente sul conto selezionato. |
| Importo `5000`, Conto Risparmio | nessun errore sull'importo |
| Causale di 141 caratteri | La causale può contenere al massimo 140 caratteri. |

Modifica un campo con errore: il suo messaggio sparisce subito, gli altri restano finché non invii di nuovo.

---

## 🧪 Your Turn

**Obiettivo:** estendere le regole e verificare l'accessibilità.

**Requisiti**
1. `validators.js` esporta `validateTransfer`, `parseAmount` e `REASON_MAX_LENGTH`.
2. Ogni campo ha il messaggio nel proprio `FieldError` con `id` coerente (`<name>-error`).
3. Ogni campo con errore ha `aria-invalid="true"` e `aria-describedby`; senza errore `aria-invalid="false"` e nessun `aria-describedby`.
4. Nuova regola: importo massimo per singolo bonifico di `5000` (costante `MAX_TRANSFER_AMOUNT`) con messaggio dedicato. Controllala **prima** del saldo.
5. Verifica con il comando `node` almeno tre casi e annota gli output.

**Passi suggeriti**
- Aggiungi la regola nel `validators.js`, poi prova con `node`, poi con l'interfaccia.
- Apri gli strumenti di sviluppo (scheda *Elementi*) e controlla gli attributi ARIA sul campo con errore.

**Risultato atteso:** importo `6000` su Conto Risparmio (saldo `12.800,00 €`) → errore di importo massimo; `4000` su Conto Corrente → ok; `4300` su Conto Corrente → saldo insufficiente.

**Criteri di completamento**
- `validateTransfer` non importa React.
- Nessun messaggio resta visibile dopo aver corretto il campo.
- Nessun warning in Console.

---

## ⚠️ Common Mistakes

| Errore | Correzione |
|---|---|
| Validare con `Number(values.amount)` senza controllare il formato | regex sul testo, poi `parseAmount` |
| Confrontare stringhe (`"500" > "1000"`) | convertire in numero prima del confronto |
| Dimenticare `noValidate` | i messaggi del browser si sovrappongono ai tuoi |
| Mostrare l'errore solo in rosso | testo del messaggio sempre presente |
| `aria-describedby` che punta a un `id` inesistente | `id` del `FieldError` uguale a `${name}-error`, renderizzato solo con errore |
| Salvare `errors` come array | oggetto con chiave = nome campo |
| Fidarsi della sola validazione client | in un'app reale va ripetuta sul server |

---

## ✅ Checklist
- ☐ `validateTransfer` restituisce `{}` per un input valido.
- ☐ Tutte le regole della tabella sono implementate e provate.
- ☐ Ogni campo mostra il proprio errore con `role="alert"`.
- ☐ `aria-invalid` e `aria-describedby` sono impostati correttamente.
- ☐ So perché la validazione client non basta per la sicurezza.

---

## 🚀 Challenge
Aggiungi la validazione "al blur": un `onBlur={handleBlur}` che valida solo il campo appena abbandonato (usa `validateTransfer` e prendi la chiave di quel campo). Quali vantaggi e svantaggi ha rispetto alla sola validazione al submit?

---

## 📌 Recap
- Le regole vivono in una **funzione pura** (`validateTransfer`) che restituisce un oggetto `errors`; vuoto = valido.
- L'importo è una stringa: si valida il formato, poi si converte.
- Un messaggio per campo, collegato con `aria-invalid`, `aria-describedby`, `role="alert"`.
- La validazione client migliora l'esperienza utente, non sostituisce quella server.

---

### ➡️ Next
[Capitolo 04 — Submit e Feedback](./04_Submit_e_Feedback.md): dal form valido al bonifico simulato, con conferma, reset e aggiornamento dello state di `Dashboard`.
