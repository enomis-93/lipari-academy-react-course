# 🏦 LipariBank — React Zero to Hero

> **Day 4 · Capitolo 05**
> **Argomento:** `useRef`: riferimenti al DOM e valori che non provocano render
> **Durata stimata:** 40 minuti
> **Parte di LipariBank:** gestione del focus nel form del bonifico: dopo un invio non valido il cursore va sul primo campo con errore

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- spiegare la differenza tra una ref e lo state;
- usare una ref per conservare un valore che non deve provocare un render (per esempio l'identificativo di un timer);
- collegare una ref a un nodo del DOM e usarla per spostare il focus;
- passare una ref a un tuo componente come prop;
- riconoscere quando una ref è lo strumento sbagliato.

---

## 📋 Prerequisiti
- [Capitolo 04 — Submit e Feedback](./04_Submit_e_Feedback.md): `TransferForm` valida, invia il bonifico simulato e mostra la conferma.
- [Day 3 · State e Re-render](../Day_03_State_Events/03_State_e_Rerender.md): sai perché una variabile locale non sopravvive tra un render e l'altro.

---

## 🧭 In questo capitolo
- Che cos'è una ref e in che cosa differisce dallo state.
- Ref come "scatola": conservare l'identificativo di un timer.
- Ref verso il DOM: spostare il focus.
- Passare una ref a un componente.
- Il focus nel form del bonifico.

---

## 🧠 Theory

### Che cos'è una ref
`useRef(valoreIniziale)` restituisce un oggetto con una sola proprietà, `current`:

```jsx
const timerRef = useRef(null);
// timerRef è { current: null }
```

React ti restituisce **lo stesso oggetto a ogni render** del componente. Puoi leggere e modificare `current` quando vuoi, e la modifica **non provoca un render**.

### Ref, state o variabile?
Nel Day 3 hai visto che una variabile locale si azzera a ogni render e che lo state, invece, viene conservato da React. La ref sta nel mezzo.

| | Variabile locale | State | Ref |
|---|---|---|---|
| Sopravvive tra i render | No | Sì | Sì |
| Modificarla provoca un render | No | Sì | No |
| Si modifica | riassegnandola | con il setter | assegnando `current` |
| Serve per | calcoli del render in corso | ciò che la UI mostra | ciò che il codice deve ricordare ma la UI non mostra |

La domanda da farsi è una sola: **questo valore compare sullo schermo?** Se sì, è state. Se serve solo al tuo codice (l'identificativo di un timer, un nodo del DOM), è una ref.

### Ref verso un nodo del DOM
React aggiorna il DOM al posto tuo, ma alcune operazioni non si possono *descrivere* nel JSX: vanno *eseguite* su un nodo. Le più comuni sono spostare il focus, scorrere fino a un elemento, misurarne le dimensioni.

Per ottenere il nodo passi la ref all'attributo `ref` di un elemento:

```jsx
const inputRef = useRef(null);

<input ref={inputRef} />
```

Quando React crea l'elemento assegna il nodo a `inputRef.current`; quando lo rimuove lo riporta a `null`. Da quel momento `inputRef.current.focus()` funziona come con qualunque nodo ottenuto con `document.getElementById`, ma senza cercarlo nella pagina.

### Passare una ref a un tuo componente
`ref` funziona da solo sugli elementi HTML. Se il campo vive dentro un tuo componente, da React 19 `ref` è una **prop come le altre**: il componente la riceve e la gira all'elemento che deve esporre.

```jsx
function AmountField({ ref, ...props }) {
  return <input ref={ref} type="number" inputMode="decimal" {...props} />;
}

// Nel padre
<AmountField ref={amountRef} name="amount" />
```

> ℹ️ Nel codice scritto per React 18 o precedenti troverai `forwardRef(...)` attorno a componenti come questo: era l'unico modo per ricevere una ref. Con React 19 non serve più.

### Le regole
1. **Non leggere e non scrivere `current` durante il render.** Il render deve dipendere solo da props e state; una ref cambia senza che React lo sappia, quindi la schermata potrebbe mostrare un valore vecchio. Usa le ref negli handler (e negli effect, che vedrai nel Day 5).
2. **Non usare una ref per ciò che la UI mostra.** Se il valore va a schermo, è state.
3. **Non usare una ref per fare ciò che React sa già fare.** Mostrare, nascondere, cambiare testo o classi si fa con lo state, non con `ref.current.style` o `ref.current.textContent`.

> 💡 **Remember**
>
> Lo state è per ciò che si vede, la ref per ciò che il codice deve ricordare senza ridisegnare. Le ref si usano negli handler, mai nel corpo del componente.

---

## 💻 Let's Code

### Una ref come "scatola": l'identificativo di un timer
Le banche avvisano quando la sessione sta per scadere. Simuliamo l'idea con un timer che si può rinnovare o annullare. Crea `src/components/SessionTimerLab.jsx` (componente di prova, da eliminare a fine capitolo):

```jsx title="src/components/SessionTimerLab.jsx"
import { useRef, useState } from "react";

function SessionTimerLab() {
  const [status, setStatus] = useState("Nessun timer attivo");
  const timerRef = useRef(null);
  const clicksRef = useRef(0);

  function handleStart() {
    clearTimeout(timerRef.current);
    setStatus("Sessione attiva: scade tra 5 secondi");
    timerRef.current = setTimeout(() => {
      setStatus("Sessione scaduta");
    }, 5000);
  }

  function handleCancel() {
    clearTimeout(timerRef.current);
    setStatus("Timer annullato");
  }

  function handleCountClick() {
    clicksRef.current += 1;
    console.log("click contati nella ref:", clicksRef.current);
  }

  return (
    <section>
      <p>{status}</p>
      <button type="button" onClick={handleStart}>
        Avvia o rinnova la sessione
      </button>
      <button type="button" onClick={handleCancel}>
        Annulla
      </button>
      <button type="button" onClick={handleCountClick}>
        Conta click (ref)
      </button>
      <p>Click contati: {clicksRef.current}</p>
    </section>
  );
}

export default SessionTimerLab;
```

Aggiungilo temporaneamente a `src/App.jsx` (`import SessionTimerLab from "./components/SessionTimerLab.jsx";` e `<SessionTimerLab />` sopra `<Dashboard />`), apri la Console e prova in quest'ordine:

1. "Avvia o rinnova la sessione": dopo 5 secondi il testo diventa "Sessione scaduta".
2. Di nuovo "Avvia", e prima che scada ancora "Avvia": il conto alla rovescia riparte, perché `clearTimeout` annulla il timer precedente.
3. "Avvia" e subito "Annulla": la scadenza non arriva più.
4. "Conta click (ref)" tre volte: in Console leggi 1, 2, 3, ma la pagina mostra ancora `Click contati: 0`.
5. Ora premi "Avvia o rinnova la sessione": la pagina mostra di colpo `Click contati: 3`.

**Cosa fa.** `timerRef` conserva l'identificativo restituito da `setTimeout`, cioè il "numero di ricevuta" che serve a `clearTimeout` per annullarlo.

**Perché una ref.** Una variabile locale perderebbe l'identificativo al render successivo (quello provocato da `setStatus`). Uno state funzionerebbe, ma provocherebbe un render in più per un valore che nessuno vede.

**Perché i punti 4 e 5.** Modificare `clicksRef.current` non provoca un render: la pagina non ha motivo di aggiornarsi. Quando un altro pulsante cambia lo state (`status`), React ridisegna e legge il valore che nel frattempo era cambiato. È esattamente il problema della regola 1: **ciò che si vede non va tenuto in una ref**.

> ℹ️ Se esegui `npm run lint`, `oxlint` segnala sulla riga `Click contati: {clicksRef.current}` il *warning* `Cannot access refs during render`. È l'errore che stiamo mostrando di proposito, e sparisce quando elimini `SessionTimerLab.jsx`.

### Una ref verso il DOM: spostare il focus
Aggiungi al laboratorio un campo e un pulsante che lo mette a fuoco. Dentro `SessionTimerLab`, accanto alle altre ref:

```jsx
const noteRef = useRef(null);
```

E nel JSX, prima della chiusura di `</section>`:

```jsx
<p>
  <label htmlFor="session-note">Nota</label>{" "}
  <input id="session-note" ref={noteRef} />{" "}
  <button type="button" onClick={() => noteRef.current.focus()}>
    Vai alla nota
  </button>
</p>
```

Premi "Vai alla nota": il cursore compare nel campo. `noteRef.current` è il nodo `<input>` vero e proprio, e `focus()` è un suo metodo.

**Errori da evitare.** Chiamare `noteRef.current.focus()` nel corpo del componente, fuori da un handler: al primo render il nodo non esiste ancora e `current` vale `null`.

---

## 🏦 LipariBank in action

Oggi, se invii il bonifico con dei campi sbagliati, compaiono i messaggi di errore ma il cursore resta sul pulsante. Chi usa la tastiera o uno screen reader deve tornare indietro a cercare il campo da correggere. Il comportamento corretto è **portare il focus sul primo campo con errore**.

Ci serve il nodo di quel campo. Invece di una ref per ognuno dei quattro campi ne usiamo una sola sul `<form>`: ogni form espone i propri campi, per `name`, nella proprietà `elements`.

In `src/components/TransferForm.jsx` aggiungi `useRef` all'import:

```jsx title="src/components/TransferForm.jsx"
import { useRef, useState } from "react";
```

Sotto `emptyValues` dichiara l'ordine dei campi, lo stesso in cui compaiono a schermo:

```jsx
const FIELD_ORDER = ["accountId", "beneficiaryId", "amount", "reason"];
```

Dentro `TransferForm`, accanto agli state, crea la ref:

```jsx
const formRef = useRef(null);
```

Collegala al form:

```jsx
<form ref={formRef} className="transfer-form" onSubmit={handleSubmit} noValidate>
```

Infine aggiorna `handleSubmit`. Versione completa della funzione:

```jsx
function handleSubmit(event) {
  event.preventDefault();

  const availableBalance = selectedAccount ? selectedAccount.balance : 0;
  const validationErrors = validateTransfer(values, availableBalance);
  setErrors(validationErrors);

  const firstInvalidField = FIELD_ORDER.find((name) => validationErrors[name]);
  if (firstInvalidField) {
    setConfirmation("");
    formRef.current.elements[firstInvalidField].focus();
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
  formRef.current.elements.accountId.focus();
}
```

**Cosa cambia.**
- `FIELD_ORDER.find(...)` restituisce il nome del primo campo che ha un errore, oppure `undefined` se non ce ne sono. Sostituisce il vecchio controllo `Object.keys(validationErrors).length > 0`.
- `formRef.current.elements[firstInvalidField]` è il nodo del campo con quel `name`; `.focus()` ci porta il cursore.
- Dopo un invio riuscito il focus torna sul primo campo: il form è pronto per un altro bonifico.

**Perché funziona.** La ref viene usata dentro un handler, quando il form è sicuramente a schermo. I valori dei campi restano nello state: la ref non li legge e non li modifica, serve solo a spostare il focus.

> ℹ️ Dentro `handleSubmit` lo stesso nodo è disponibile anche come `event.currentTarget`. La ref è più generale: ti dà il nodo in qualunque punto del componente, anche dove non c'è un evento del form (un timer, un pulsante esterno, un effect).

---

## 🧪 Your Turn

**Obiettivo:** verificare la gestione del focus e distinguere, in pratica, ref e state.

**Requisiti:**
1. Nel form del bonifico, premi "Invia bonifico simulato" con tutti i campi vuoti: il focus va su "Conto di addebito".
2. Scegli conto e beneficiario, lascia vuoto l'importo e invia: il focus va su "Importo (EUR)".
3. Compila tutto correttamente e invia: compare la conferma e il focus torna su "Conto di addebito".
4. Ripeti i tre punti usando **solo la tastiera** (`Tab` per spostarti, `Invio` per inviare).
5. Nel laboratorio, trasforma il contatore dei click in uno state (`useState`) e verifica che ora la pagina si aggiorni a ogni click.
6. Elimina `SessionTimerLab.jsx` e il suo uso in `App.jsx`.

**Passi suggeriti:**
1. Per capire dov'è il focus guarda il bordo evidenziato del campo; con la tastiera, digita un carattere e osserva dove compare.
2. Per il punto 5 sostituisci `clicksRef` con `const [clicks, setClicks] = useState(0)` e aggiorna handler e JSX.

**Risultato atteso:** in ogni scenario il cursore si trova nel campo indicato, senza usare il mouse; il contatore con lo state si aggiorna a ogni click.

**Criteri di completamento:**
- I tre scenari del form funzionano anche da tastiera.
- `SessionTimerLab.jsx` non esiste più.
- `npm run lint` e `npm run build` terminano senza errori né warning.

---

## ⚠️ Common Mistakes

| Errore | Sintomo | Correzione |
|---|---|---|
| Tenere in una ref un valore che la UI mostra | La pagina resta indietro rispetto al valore | Usa `useState` |
| Leggere o scrivere `current` nel corpo del componente | Warning del linter, valori vecchi a schermo | Usa la ref negli handler |
| `ref.current.focus()` durante il primo render | `Cannot read properties of null` | Chiamalo in un handler, quando il nodo esiste |
| Tenere l'identificativo di un timer in una variabile locale | `clearTimeout` non annulla nulla | Conservalo in una ref |
| Cambiare testo o stile con `ref.current...` | UI e state non coincidono più | Descrivi la UI con state e JSX |
| Dimenticare l'attributo `name` su un campo | `form.elements[nome]` è `undefined` | Ogni campo del form ha `name` uguale alla chiave nello state |

---

## ✅ Checklist
- ☐ So spiegare quando usare una ref e quando lo state.
- ☐ Ho conservato l'identificativo di un timer in una ref e l'ho annullato.
- ☐ Ho collegato una ref a un elemento e ho spostato il focus.
- ☐ Il form del bonifico porta il focus sul primo campo con errore.
- ☐ So che `ref` si può passare come prop a un mio componente.
- ☐ Ho eliminato il laboratorio e verificato lint e build.

---

## 🚀 Challenge
Estrai il campo importo in un componente `AmountField` definito in `src/components/AmountField.jsx`, che riceve `ref` come prop e la passa al suo `<input>`. Nel form crea una `amountRef` dedicata e usala per aggiungere, accanto al saldo disponibile, un pulsante `type="button"` "Vai all'importo". È un'estensione facoltativa: i capitoli successivi non dipendono da questo file.

---

## 📌 Recap
- `useRef` restituisce un oggetto `{ current }` che resta lo stesso tra i render; modificarlo non provoca un render.
- Lo state è per ciò che la UI mostra, la ref per ciò che il codice deve ricordare: timer, nodi del DOM.
- Con l'attributo `ref` ottieni il nodo di un elemento e puoi chiamarne i metodi, come `focus()`.
- Da React 19 `ref` è una prop: un componente può riceverla e passarla a un suo elemento.
- Le ref si usano negli handler e negli effect, mai durante il render.

---

### ➡️ Next
[Capitolo 06 — Esercizio LipariBank Bonifico](./06_Esercizio_LipariBank_Bonifico.md): ricalcoliamo i saldi come dati derivati e verifichiamo l'intero flusso, focus compreso, con scenari concreti.
