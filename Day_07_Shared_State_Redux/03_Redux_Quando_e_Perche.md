# 🏦 LipariBank — React Zero to Hero

> **Day 7 · Capitolo 03**
> **Argomento:** Redux: quando e perché
> **Durata stimata:** 45 minuti
> **Parte di LipariBank:** misuriamo il costo del Context sulla pagina Conti e montiamo uno store Redux accanto ai Provider esistenti

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- misurare i re-render provocati da un Context e spiegare da che cosa dipendono;
- descrivere store, action, reducer e selector e il flusso dei dati a senso unico;
- confrontare Context e Redux e scegliere lo strumento adatto a ciascun dato;
- installare Redux Toolkit e React Redux, creare uno store e ispezionarlo con i Redux DevTools.

---

## 📋 Prerequisiti
- [Capitolo 02 — useReducer](./02_useReducer.md) completato: tutte le pagine leggono i dati da `useBank()` e `App.jsx` contiene solo le route.
- Un browser tra Chrome, Edge e Firefox, su cui installare un'estensione.
- Tutti i comandi si lanciano dentro `liparibank/`.

---

## 🧭 In questo capitolo
- Che cosa abbiamo ottenuto con Context e `useReducer`, e a quale prezzo.
- I concetti di Redux, confrontati con ciò che conosci già.
- Una tabella per decidere: state locale, Context o Redux.
- Installazione, primo slice, store, `Provider` e Redux DevTools.

---

## 🧠 Theory

### Che cosa abbiamo ottenuto, e a quale prezzo
Con `BankContext` e `bankReducer` il prop drilling è sparito e le regole di aggiornamento stanno in un posto solo. È una buona soluzione. Ha però quattro costi, che in un'app piccola si notano poco e in una grande pesano.

1. **Tutti i consumatori si ridisegnano.** Quando il `value` del Provider cambia, ogni componente che chiama `useBank()` viene rieseguito, anche se usa una parte dello state che non è cambiata. Lo misureremo tra poco.
2. **La stabilità va costruita a mano.** `useMemo` per il `value`, `useCallback` per ogni funzione, Provider annidati nell'ordine giusto: è codice che non descrive la banca, serve solo a far funzionare il meccanismo.
3. **Nessuno strumento.** Per sapere quale azione ha cambiato un saldo devi aggiungere `console.log`.
4. **La logica asincrona vive in un componente.** Il caricamento dei movimenti è un effect dentro `BankProvider`: per riusarlo o provarlo serve React.

### Redux in cinque parole
**Redux** è una libreria per gestire lo stato condiviso **fuori dai componenti**, in un oggetto unico chiamato store.

| Termine | Che cos'è |
|---|---|
| **Store** | L'oggetto che contiene tutto lo stato condiviso dell'app. Ce n'è uno solo. |
| **Action** | Un oggetto che descrive *che cosa è successo*: `{ type: "transactions/favoriteToggled", payload: "trx-003" }`. |
| **Reducer** | Una funzione pura che, dato lo state e un'action, calcola il nuovo state. |
| **Dispatch** | La funzione dello store a cui consegni un'action. È l'unico modo per cambiare lo state. |
| **Selector** | Una funzione che estrae dallo store il pezzo di state che serve a un componente. |

Il flusso va sempre nella stessa direzione:

```text
evento nella UI → dispatch(action) → reducer → nuovo state nello store → selector → componenti interessati
```

Se ti sembra familiare, è perché lo è. Nel capitolo precedente hai già costruito lo stesso schema a mano:

| Con `useReducer` + Context | Con Redux |
|---|---|
| `bankReducer` | i reducer dello store |
| `dispatch({ type: "ADD_TRANSFER", ... })` | `dispatch(transferAdded(...))` |
| `<BankProvider>` | `<Provider store={store}>` |
| `useBank()` | `useSelector(...)` e `useDispatch()` |

### Che cosa cambia davvero

| | Context + `useReducer` | Redux Toolkit |
|---|---|---|
| Dove vive lo state | Dentro un componente (il Provider) | Fuori da React, nello store |
| Chi si ridisegna | Tutti i consumatori del Context | Solo i componenti il cui valore selezionato è cambiato |
| Strumenti | `console.log` | Redux DevTools: elenco delle action, differenze di state, ritorno a uno stato precedente |
| Logica asincrona | Un effect dentro il Provider | Funzioni dedicate (*thunk*), fuori dai componenti |
| Più parti dello state per la stessa azione | Un unico reducer che cresce | Più *slice* indipendenti che reagiscono alla stessa action |
| Costo | Niente da installare, pochi concetti | Due pacchetti, più concetti, più file |

**Redux Toolkit** è il modo ufficiale e consigliato di scrivere Redux: riduce il codice ripetitivo e configura da solo gli strumenti di sviluppo. **React Redux** è il pacchetto che collega lo store ai componenti. In questo corso usiamo sempre entrambi.

### Quando usare che cosa

| Il dato... | Strumento |
|---|---|
| serve a un solo componente | `useState` |
| serve a un componente e ai suoi figli diretti | State nel padre e props |
| è trasversale e cambia di rado (tema, lingua, preferenze, utente collegato) | Context |
| è condiviso da molte pagine, cambia spesso, ha molte azioni diverse, va tracciato | Redux |
| è una copia di dati del server da tenere in cache | Una libreria dedicata, come RTK Query (parte di Redux Toolkit) o TanStack Query. Qui non le usiamo |

### Quando Redux non serve
- L'app è piccola e lo stato condiviso si conta sulle dita di una mano.
- Il dato serve a un solo componente o a una sola pagina.
- Stai facendo un prototipo che forse butterai.
- L'unico motivo è "lo usano tutti".

Detto con onestà: LipariBank, con due conti e otto movimenti, starebbe benissimo con il solo Context. Lo migriamo a Redux perché è il modo migliore di impararlo: su un'app che conosci riga per riga, potendo confrontare il prima e il dopo.

> 💡 **Remember**
>
> Context **trasporta** un valore; Redux **gestisce** uno stato. Non sono alternativi: in un'app reale convivono, ciascuno per i dati a cui è adatto.

---

## 💻 Let's Code

### 1. Misurare il problema
In `src/pages/AccountsPage.jsx` aggiungi temporaneamente un log, subito dopo le chiamate agli hook:

```jsx
console.log("render AccountsPage");
```

Apri `http://localhost:5173/accounts/acc-001` con la Console aperta. A sinistra c'è l'elenco dei conti (`AccountsPage`), a destra il dettaglio con i movimenti (`AccountDetailPage`). Svuota la Console e premi "☆ Preferito" su un movimento.

Compare `render AccountsPage` (due volte, per via di `StrictMode`).

`AccountsPage` mostra solo nome e saldo dei conti: il "preferito" di un movimento non la riguarda. Eppure viene rieseguita, perché chiama `useBank()` e il `value` del Provider è un oggetto nuovo a ogni cambiamento dello state. Con due conti non si nota; con una pagina ricca di componenti, ognuno collegato al Context, ogni click ridisegna tutto.

Lascia il log dov'è: ripeteremo la misura nel [capitolo 05](./05_React_Redux_Selector_e_Dispatch.md).

### 2. Installare i pacchetti
Dentro `liparibank/`:

```bash
npm install @reduxjs/toolkit@2 react-redux@9
```

### 3. Il primo slice
In Redux Toolkit lo stato si divide in **slice**, "fette": ognuna si occupa di un argomento. Cominciamo dai conti, per ora in sola lettura. Crea la cartella `src/store/` e il file `src/store/accountsSlice.js`:

```javascript title="src/store/accountsSlice.js"
import { createSlice } from "@reduxjs/toolkit";
import { accounts as mockAccounts } from "../data/mockData.js";

const accountsSlice = createSlice({
  name: "accounts",
  initialState: { items: mockAccounts },
  reducers: {},
});

export const selectAccounts = (state) => state.accounts.items;

export default accountsSlice.reducer;
```

- `name` è il prefisso che avranno le action di questo slice.
- `initialState` è lo state di partenza: un oggetto con l'elenco dei conti.
- `reducers` per ora è vuoto: lo riempiremo nel prossimo capitolo.
- `selectAccounts` è un **selector**: riceve l'intero state dello store e restituisce l'elenco dei conti. Lo teniamo accanto allo slice, così chi lo usa non deve sapere com'è fatto lo state.

### 4. Lo store
Crea `src/store/store.js`:

```javascript title="src/store/store.js"
import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./accountsSlice.js";

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
  },
});
```

`configureStore` crea lo store. La chiave `accounts` decide dove finisce lo state dello slice: in `state.accounts`. Lo store è creato **una volta sola, fuori dai componenti**: se lo creassi dentro un componente rinascerebbe vuoto a ogni render.

### 5. Il `Provider`
Come un Context, lo store va reso disponibile all'albero dei componenti. `src/main.jsx`:

```jsx title="src/main.jsx"
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { BankProvider } from "./context/BankContext.jsx";
import { store } from "./store/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SettingsProvider>
        <BankProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </BankProvider>
      </SettingsProvider>
    </Provider>
  </StrictMode>,
);
```

`BankProvider` resta al suo posto: le pagine lo usano ancora. Lo toglieremo a migrazione conclusa.

### 6. Redux DevTools
Installa l'estensione **Redux DevTools** dallo store delle estensioni del tuo browser (esiste per Chrome, Edge e Firefox). Ricarica LipariBank, apri gli strumenti di sviluppo (`F12`) e cerca il tab **Redux**.

- A sinistra c'è l'elenco delle action. Per ora ne vedi una sola, `@@INIT`: la creazione dello store.
- A destra, nella scheda *State*, apri `accounts` → `items`: ci sono i due conti.

Non hai scritto nulla per ottenerlo: `configureStore` collega da solo lo store ai DevTools.

**Cosa abbiamo fatto.** Lo store esiste, contiene i conti ed è visibile negli strumenti. Nessun componente lo legge ancora: la pagina continua a funzionare con `BankContext`.

**Errori da evitare.** Dimenticare il `<Provider>`: al primo `useSelector` React Redux segnalerebbe che non trova lo store.

---

## 🏦 LipariBank in action

Prima di migrare decidiamo **che cosa** migrare. Non tutto lo state va nello store.

| Dato | Dove sta oggi | Dove andrà | Perché |
|---|---|---|---|
| `hideBalance` | `SettingsContext` | Resta in Context | È trasversale, cambia di rado, è un solo valore |
| Conti, movimenti, caricamento ed errore | `BankContext` | Store Redux | Li leggono tutte le pagine, hanno più azioni, vogliamo tracciarle |
| `filter`, `searchText`, conto selezionato | State locale delle pagine | Restano locali | Servono a una sola pagina |
| Valori del form bonifico | State locale di `TransferForm` | Restano locali | Cambiano a ogni tasto e servono solo al form |

A fine giornata LipariBank userà **tutti e tre** gli strumenti, ciascuno per il suo caso. È ciò che accade nelle applicazioni reali.

---

## 🧪 Your Turn

### Parte A — Misura
**Obiettivo:** capire da che cosa dipende il re-render di un componente.

**Requisiti:**
1. Con il log in `AccountsPage`, apri `/accounts/acc-001`, svuota la Console e annota se compare `render AccountsPage` dopo ciascuna azione: (a) click su "☆ Preferito"; (b) click sul link dell'altro conto.
2. Per ognuna prova a spiegare il risultato **prima** di leggere quello atteso.

**Risultato atteso:**
- (a) Il log **compare**, anche se la pagina non mostra i preferiti: è un re-render evitabile, provocato dal Context.
- (b) Il log **non compare**, anche se il link evidenziato cambia. A cambiare aspetto sono i `NavLink`, che leggono l'indirizzo per conto proprio e si ridisegnano da soli; la funzione `AccountsPage` non legge nulla che sia cambiato.

Un componente si ridisegna quando cambia qualcosa che **lui** legge. Il caso (b) è il comportamento che vorremmo anche per i preferiti: lo otterremo con i selector.

### Parte B — Esplora lo store
**Obiettivo:** leggere lo state con i DevTools e riconoscere le due sorgenti dei dati.

**Requisiti:**
1. Nel tab Redux trova il saldo del Conto Corrente (`4250.75`).
2. Esegui un bonifico simulato di 50 € dal Conto Corrente.
3. Controlla il saldo in `/accounts` e nel tab Redux.

**Risultato atteso:** la pagina mostra `4.200,75 €`, lo store ancora `4250.75`, e nell'elenco delle action non è comparso nulla. Il bonifico è passato da `BankContext`; lo store non ne sa niente. È la situazione provvisoria che risolveremo nei prossimi capitoli.

### Parte C — Decidi
Per ogni dato scegli: *state locale*, *Context* o *Redux*.

1. La lingua dell'interfaccia.
2. Il carrello di un e-commerce, mostrato nell'intestazione, nella pagina del prodotto e nel checkout.
3. Il testo digitato in un campo di ricerca.
4. Le notifiche non lette, mostrate nell'intestazione e in una pagina dedicata, che cambiano di continuo.
5. L'apertura e la chiusura di un menu a tendina.

**Criteri di completamento:** sai motivare ogni scelta con la tabella "Quando usare che cosa".

### Soluzione di riferimento — Parte C
1 → Context: trasversale, cambia di rado. 2 → Redux: molte pagine, molte azioni (aggiungi, togli, cambia quantità, svuota). 3 → state locale. 4 → Redux, oppure una libreria per i dati del server se arrivano da un'API. 5 → state locale.

---

## ⚠️ Common Mistakes
- **Mettere tutto nello store "per uniformità".** I campi di un form e i filtri di una pagina restano state locale: nello store aggiungono solo rumore.
- **Creare lo store dentro un componente.** Verrebbe ricreato a ogni render, perdendo lo state. Lo store si crea in un modulo a parte.
- **Dimenticare `<Provider store={store}>`.** Gli hook di React Redux non troverebbero lo store.
- **Pensare che Redux sostituisca Context.** Risolvono problemi diversi e convivono.
- **Tenere lo stesso dato in due posti a lungo.** Durante una migrazione è accettabile per poche ore; a lavoro finito ogni dato ha una sola sorgente.

---

## ✅ Checklist
- ☐ Ho misurato il re-render di `AccountsPage` al click su "Preferito" e so spiegarlo.
- ☐ So descrivere store, action, reducer, dispatch e selector.
- ☐ So dire, per un dato, se va in state locale, in Context o in Redux.
- ☐ Ho installato `@reduxjs/toolkit` e `react-redux`.
- ☐ Lo store esiste, il `Provider` è montato e vedo i conti nei Redux DevTools.

---

## 🚀 Challenge
Quanto pesa Redux? Annulla temporaneamente le modifiche a `main.jsx` ed esegui `npm run build`: annota la dimensione del file JavaScript generato. Ripristina `main.jsx`, riesegui `npm run build` e confronta. La differenza è il costo, in kilobyte, dei due pacchetti: decidere se vale la spesa fa parte del mestiere.

---

## 📌 Recap
- Context + `useReducer` elimina il prop drilling, ma ridisegna tutti i consumatori, richiede codice per la stabilità e non offre strumenti.
- Redux tiene lo stato condiviso in uno **store** fuori dai componenti: `dispatch(action)` → reducer → nuovo state → selector.
- Redux Toolkit è il modo ufficiale di scriverlo; React Redux lo collega ai componenti.
- State locale, Context e Redux convivono: ogni dato va nello strumento adatto.
- `configureStore` crea lo store e lo collega ai Redux DevTools.

---

### ➡️ Next
Prossimo capitolo: [04 · Redux Toolkit: slice e thunk](./04_Redux_Toolkit_Slice_e_Thunk.md). Portiamo nello store le regole di `bankReducer` e il caricamento dei movimenti.
