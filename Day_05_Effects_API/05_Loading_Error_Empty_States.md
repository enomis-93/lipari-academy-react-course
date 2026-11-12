# 🏦 LipariBank — React Zero to Hero

> **Day 5 · Capitolo 05**
> **Argomento:** Loading, Error ed Empty States
> **Durata stimata:** 40 minuti
> **Parte di LipariBank:** `Dashboard` con messaggio di caricamento, messaggio di errore con "Riprova" e gestione dell'assenza di dati

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- modellare lo stato di una richiesta con `isLoading` ed `error`;
- mostrare in modo ordinato loading, errore, assenza di dati e lista;
- simulare ritardo ed errore per testare l'interfaccia;
- distinguere **stato UI** (filtri, conto selezionato) da **dati remoti** (movimenti).

---

## 📋 Prerequisiti
- [Capitolo 04 — Fetch API](./04_Fetch_API.md): `transactionService.js` e l'effect di caricamento già in `Dashboard.jsx`.

---

## 🧭 In questo capitolo
- I quattro casi: loading, errore, vuoto, dati.
- `LoadingMessage.jsx` e `ErrorMessage.jsx`.
- `finally`, `AbortError` e l'ordine di rendering.
- Simulazione di ritardo (`wait(ms)`) ed errore.
- Pulsante "Riprova".
- Stato UI vs dati remoti.

---

## 🧠 Theory

### Una richiesta ha più "facce"
Mentre i dati arrivano da una fonte asincrona l'interfaccia non può mostrare solo la lista. Servono almeno:

| Caso | Quando | Cosa mostrare |
| --- | --- | --- |
| **Loading** | richiesta in corso | messaggio/indicatore di attesa |
| **Error** | richiesta fallita | messaggio comprensibile + possibilità di riprovare |
| **Empty** | richiesta riuscita ma lista vuota | stato vuoto (`EmptyState`) |
| **Success** | dati presenti | la lista |

L'ordine di valutazione è sempre: **loading → error → empty → lista**.

### Due tipi di "vuoto"
- **Nessun dato esistente:** i movimenti remoti sono 0.
- **Nessun risultato per i filtri:** i dati ci sono, ma filtro/ricerca non ne lasciano visibili.

Hanno messaggi diversi: "Non ci sono ancora movimenti" vs "Nessun movimento corrisponde ai filtri".

### Stato UI vs dati remoti
| | Stato UI | Dati remoti |
| --- | --- | --- |
| Esempi LipariBank | `filter`, `searchText`, `selectedAccountId`, `hideBalance` | `transactions` |
| Origine | l'utente | una fonte esterna (file/API) |
| Vive solo qui? | sì, nel browser | no, la fonte è fuori |
| Ha loading/errore? | no | sì (`isLoading`, `error`) |

Regole pratiche: un ricaricamento dei dati **non** deve azzerare i filtri; la lista filtrata **non** si memorizza in uno state, si calcola; `isLoading` ed `error` descrivono lo stato della richiesta, non i dati.

> 💡 **Remember**
>
> Per ogni dato remoto progetta sempre tre stati: sta arrivando, è fallito, è arrivato (anche se vuoto).

---

## 💻 Let's Code

### 1. Componenti di feedback
Crea `src/components/LoadingMessage.jsx`:

```jsx
export default function LoadingMessage({ message = "Caricamento in corso..." }) {
  return (
    <div className="loading-message" role="status">
      <span className="loading-spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
```

Crea `src/components/ErrorMessage.jsx`:

```jsx
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Riprova
        </button>
      )}
    </div>
  );
}
```

`role="status"` e `role="alert"` permettono agli screen reader di annunciare il messaggio. Aggiungi in fondo a `src/index.css`:

```css
.loading-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: #475569;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #cbd5e1;
  border-top-color: #1d4ed8;
  border-radius: 50%;
  animation: loading-spin 0.8s linear infinite;
}

@keyframes loading-spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  padding: 1rem;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  background: #fef2f2;
  color: #991b1b;
}
```

### 2. Stati e effect in `Dashboard.jsx`
Snippet **parziale**: sostituisce lo state e l'effect del capitolo 04.

```jsx
import { useEffect, useState } from "react";
import { getTransactions } from "../services/transactionService.js";

// dentro il componente Dashboard
const [transactions, setTransactions] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
const [reloadKey, setReloadKey] = useState(0);

useEffect(() => {
  const controller = new AbortController();

  async function loadTransactions() {
    try {
      const remoteTransactions = await getTransactions({
        signal: controller.signal,
      });

      setTransactions((current) => {
        const remoteIds = new Set(remoteTransactions.map((item) => item.id));
        const localOnly = current.filter((item) => !remoteIds.has(item.id));
        return [...localOnly, ...remoteTransactions];
      });
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error(err);
      setError("Non è stato possibile caricare i movimenti.");
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }

  loadTransactions();

  return () => controller.abort();
}, [reloadKey]);

function handleRetry() {
  setError(null);
  setIsLoading(true);
  setReloadKey((current) => current + 1);
}
```

Punti chiave:

- `isLoading` parte da `true`: al primo render la richiesta è già "in arrivo", niente sfarfallio.
- Il `return` dentro il `catch` non salta il `finally`: per questo il `finally` controlla `controller.signal.aborted` ed evita di spegnere il loading per una richiesta annullata (cleanup di `StrictMode`): se la prima richiesta annullata impostasse `isLoading` a `false`, per un attimo vedresti la lista vuota.
- `handleRetry` non chiama l'effect direttamente: cambia `reloadKey`, che è una dipendenza, e l'effect riparte. Prima di cambiare chiave azzera l'errore e riaccende il loading in un event handler, dove è il posto giusto per farlo.
- L'errore mostrato all'utente è un testo semplice; il dettaglio tecnico finisce in console.

### 3. Rendering condizionale
Nello stesso `Dashboard.jsx`, dopo il calcolo di `visibleTransactions` e prima del `return`, calcola il contenuto della sezione movimenti (il resto della pagina — saldo, conti, form — resta visibile perché i conti vengono da `mockData.js`):

```jsx
let transactionsContent;

if (isLoading) {
  transactionsContent = <LoadingMessage message="Caricamento dei movimenti..." />;
} else if (error) {
  transactionsContent = <ErrorMessage message={error} onRetry={handleRetry} />;
} else if (transactions.length === 0) {
  transactionsContent = (
    <EmptyState message="Non ci sono ancora movimenti per i tuoi conti." />
  );
} else {
  transactionsContent = (
    <TransactionList
      transactions={visibleTransactions}
      onToggleFavorite={handleToggleFavorite}
    />
  );
}
```

E nel JSX: `{transactionsContent}` al posto di `<TransactionList ... />` (dentro la `Card` dei movimenti, sotto `TransactionFilters`). `handleToggleFavorite` è quello del Day 3. Servono gli import:

```jsx
import LoadingMessage from "./LoadingMessage.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import EmptyState from "./EmptyState.jsx";
import TransactionList from "./TransactionList.jsx";
```

Il tuo `EmptyState` è quello del Day 2 (props `message` e, opzionale, `hint`). Il caso "nessun risultato per i filtri" resta gestito dal tuo `TransactionList` (stato vuoto interno): quando `visibleTransactions` è vuoto mostra il suo messaggio.

Due limiti noti, accettati per ora: durante il caricamento le `AccountCard` mostrano "Nessun movimento" (il conteggio viene da `transactions`, ancora `[]`); e un "Riprova" sostituisce i movimenti remoti con quelli del file, quindi un eventuale "preferito" impostato nel frattempo su un movimento del JSON si perde (i bonifici locali no). Sono ottimi spunti per le sfide di fine capitolo e per i Day 7 e 8.

### 4. Simulare ritardo ed errore
Per vedere gli stati devi poterli provocare. Crea `src/utils/wait.js`:

```javascript
export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

In `src/services/transactionService.js` aggiungi **temporaneamente** ritardo ed errore:

```javascript
import { wait } from "../utils/wait.js";

const TRANSACTIONS_URL = "/data/transactions.json";

export async function getTransactions({ signal } = {}) {
  await wait(1500);
  // throw new Error("Errore simulato");

  const response = await fetch(TRANSACTIONS_URL, { signal });

  if (!response.ok) {
    throw new Error(
      `Impossibile caricare i movimenti (HTTP ${response.status})`
    );
  }

  return response.json();
}
```

- Con `await wait(1500)` vedi "Caricamento dei movimenti..." per un secondo e mezzo.
- Togli il commento a `throw new Error("Errore simulato")` per vedere `ErrorMessage` e il pulsante "Riprova" (ricommentandolo prima di premere, il retry dovrebbe riuscire). In sviluppo, per via di `StrictMode`, l'errore compare **due volte** in console: l'effect parte due volte e, con il `throw` prima del `fetch`, entrambe le esecuzioni falliscono. È normale.
- Per provare l'**empty state** sostituisci temporaneamente il contenuto di `public/data/transactions.json` con `[]`.
- Per un vero errore di rete: scheda Network degli strumenti del browser → throttling "Offline", poi ricarica.

Ricorda di **rimuovere** `wait` e il `throw` dal service al termine delle prove (puoi eliminare anche `src/utils/wait.js`, se non ti serve altrove): sono solo strumenti di test.

---

## 🏦 LipariBank in action
Dopo questo capitolo la dashboard ha un comportamento "da app vera":

- saldo e conti sono visibili subito (dati locali `mockData.js`);
- la sezione movimenti mostra loading, errore con "Riprova", stato vuoto o lista;
- i filtri (`filter`, `searchText`) e il conto selezionato sono stato UI: ricaricare i movimenti con "Riprova" non li azzera;
- un bonifico aggiunto resta in `transactions` anche se, per qualunque motivo, l'effect riparte (merge basato sugli `id`).

---

## 🧪 Your Turn

**Obiettivo:** aggiungere gli stati di caricamento, errore e vuoto alla dashboard.

**Requisiti:**
1. Crea `LoadingMessage.jsx` ed `ErrorMessage.jsx` come sopra, con le classi CSS.
2. Aggiungi `isLoading`, `error`, `reloadKey` in `Dashboard.jsx` e il blocco `transactionsContent`.
3. Con `wait(1500)` verifica che compaia "Caricamento dei movimenti..." e poi la lista.
4. Con `throw new Error("Errore simulato")` verifica `ErrorMessage` + "Riprova"; poi commenta il `throw`, premi "Riprova" e verifica che compaia la lista.
5. Con `public/data/transactions.json` uguale a `[]` verifica l'empty state; poi ripristina il file.
6. Con il `throw` simulato attivo e `ErrorMessage` visibile (filtri e form restano usabili), imposta il filtro "Uscite" e il Conto Risparmio, poi invia un bonifico simulato; commenta il `throw` e premi "Riprova": filtro, conto selezionato e bonifico devono restare.
7. Rimuovi `wait` e `throw` dal service.

**Passi suggeriti:** procedi un caso alla volta, ripristinando i file di test dopo ognuno.

**Risultato atteso:** quattro stati distinti e visibili, nessun errore in console (a parte l'errore simulato registrato con `console.error`).

**Criteri di completamento:** tutti i casi verificati, filtri preservati dopo "Riprova", service pulito.

---

## ⚠️ Common Mistakes
- **`isLoading` iniziale a `false`.** Si vede un'istantanea di "nessun movimento" prima del caricamento.
- **Dimenticare il `finally`.** Il messaggio di caricamento resta per sempre dopo un errore.
- **Spegnere il loading anche per richieste annullate.** Controlla `controller.signal.aborted`.
- **Mostrare l'errore tecnico grezzo all'utente.** Messaggio comprensibile all'utente, dettaglio in console.
- **Salvare la lista filtrata in uno state.** Si calcola dal `transactions` e dai filtri.
- **Confondere "vuoto" e "nessun risultato per il filtro".** Messaggi e azioni diversi.

---

## ✅ Checklist
- ☐ `LoadingMessage` ed `ErrorMessage` creati e stilati.
- ☐ L'ordine di rendering è loading → error → empty → lista.
- ☐ Ho provato ritardo, errore ed empty state.
- ☐ "Riprova" funziona e non azzera i filtri.
- ☐ Ho rimosso `wait` e `throw` dal service.

---

## 🚀 Challenge
Nel messaggio di caricamento mostra anche quanti secondi sono trascorsi, usando un timer con cleanup (come `LastUpdateClock` del capitolo 03) attivo solo mentre `isLoading` è `true`.

---

## 📌 Recap
- Ogni dato remoto ha stati: loading, errore, vuoto, successo.
- `finally` + controllo `signal.aborted` evita stati incoerenti con `StrictMode`.
- Ritardi ed errori si simulano temporaneamente nel service.
- Stato UI e dati remoti sono cose diverse: i filtri non si perdono quando ricarichi.

---

### ➡️ Next
[Capitolo 06 — Esercizio LipariBank: API Transactions](./06_Esercizio_LipariBank_API_Transactions.md): consolidiamo tutto e chiudiamo il CHECKPOINT 5.
