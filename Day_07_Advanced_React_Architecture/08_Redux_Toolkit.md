# 🏦 LipariBank — React Zero to Hero

> **Day 7 · Capitolo 08**
> **Argomento:** Redux Toolkit e React Redux
> **Durata stimata:** 60 minuti
> **Parte di LipariBank:** modalità compatta condivisa tra le pagine

---

## 🎯 Obiettivo

- Spiegare store, slice, action, reducer e selector.
- Collegare Redux a React con Provider, `useSelector` e `useDispatch`.
- Applicare una preferenza condivisa senza duplicare i dati bancari.

---

## 📋 Prerequisiti

- [Refactoring LipariBank](./07_Esercizio_Refactoring_LipariBank.md) completato.
- Conoscere `useReducer` e Context. Tutti i comandi sono eseguiti in `liparibank/`.

---

## 🧭 In questo capitolo

- Flusso dei dati Redux.
- Installazione, slice e store.
- Provider, selector e dispatch.
- Verifica della preferenza tra le route.

---

## 🧠 Theory

Redux gestisce stato condiviso in uno **store**. Un componente legge una parte dello stato tramite un **selector** e invia un'**action** con `dispatch`. Il **reducer** calcola lo stato successivo; React Redux aggiorna i componenti interessati. Redux Toolkit è il modo consigliato di scrivere Redux: `createSlice` genera reducer e action, `configureStore` configura store e DevTools.

Il reducer di una slice può usare una sintassi apparentemente mutabile: Redux Toolkit usa Immer per produrre uno stato immutabile. Non eseguire fetch, generare date o modificare il DOM nel reducer. Per chiamate asincrone esistono thunk e RTK Query: questa preferenza non ne ha bisogno.

> 💡 **Remember**
>
> Redux non sostituisce automaticamente Context o ogni `useState`: manteniamo i dati bancari nel `BankContext`, il form nello state locale e solo la densità della UI nello store. Evitiamo due fonti di verità per lo stesso dato.

---

## 💻 Let's Code

Installa i pacchetti in `liparibank/`:

```bash
npm install @reduxjs/toolkit@2 react-redux@9
```

Crea `src/store/displaySlice.js`:

```javascript
import { createSlice } from "@reduxjs/toolkit";

const displaySlice = createSlice({
  name: "display",
  initialState: { compact: false },
  reducers: {
    toggleCompact(state) {
      state.compact = !state.compact;
    },
  },
});

export const { toggleCompact } = displaySlice.actions;
export const selectCompact = (state) => state.display.compact;
export default displaySlice.reducer;
```

Crea `src/store/store.js`:

```javascript
import { configureStore } from "@reduxjs/toolkit";
import displayReducer from "./displaySlice.js";

export const store = configureStore({
  reducer: { display: displayReducer },
});
```

Le versioni principali 2 e 9 corrispondono ai checkpoint del corso. In `src/main.jsx` aggiungi questi import, conservando i Provider e il router esistenti:

```jsx
import { Provider } from "react-redux";
import { store } from "./store/store.js";
```

All'interno di `StrictMode`, avvolgi l'albero esistente con `<Provider store={store}>...</Provider>`. Non creare lo store dentro un componente: perderebbe lo stato a ogni ricreazione.

Crea `src/components/DisplayDensity.jsx`:

```jsx
import { useDispatch, useSelector } from "react-redux";
import { selectCompact, toggleCompact } from "../store/displaySlice.js";

export default function DisplayDensity() {
  const compact = useSelector(selectCompact);
  const dispatch = useDispatch();

  return (
    <button type="button" aria-pressed={compact} onClick={() => dispatch(toggleCompact())}>
      Modalità compatta
    </button>
  );
}
```

In `src/layouts/AppLayout.jsx` aggiungi gli import e la lettura del selector nel componente:

```jsx
import { useSelector } from "react-redux";
import DisplayDensity from "../components/DisplayDensity.jsx";
import { selectCompact } from "../store/displaySlice.js";
```

```jsx
const compact = useSelector(selectCompact);
```

Mantieni il layout e la navigazione esistenti. Aggiungi `<DisplayDensity />` dopo il menu e applica `className={compact ? "compact-view" : undefined}` a un contenitore che avvolge anche `<Outlet />` (nel layout del corso, aggiungi la classe `compact-view` condizionalmente al `div` con classe `app`). Così il pulsante invia l'action, il reducer aggiorna lo store e il selector aggiorna il layout.

In fondo a `src/index.css` aggiungi:

```css
.compact-view .transaction-item,
.compact-view .transaction {
  padding-block: 0.4rem;
}
```

Le righe diventano più compatte senza alterare dati o filtri. La preferenza resta durante la navigazione perché il Provider è sopra il router; un ricaricamento la ripristina a `false` (nessuna persistenza implicita).

---

## 🏦 LipariBank in action

Attiva la modalità nella dashboard, passa a Movimenti e osserva che resta attiva. Conti, bonifici e preferiti continuano a usare il loro flusso esistente.

---

## 🧪 Your Turn

**Obiettivo:** usare Redux in modo osservabile e verificabile.

**Requisiti:**

- Il pulsante espone `aria-pressed` e modifica la spaziatura dei movimenti.
- La preferenza sopravvive al cambio di pagina ma non al reload.
- I dati bancari non sono duplicati nello store.

**Passi suggeriti:**

1. Installa, crea slice e store e monta il Provider.
2. Collega pulsante e layout; prova dashboard e movimenti.
3. Controlla bonifico simulato, filtri, `npm run lint` e `npm run build`.

**Risultato atteso:** il pulsante cambia densità in entrambe le pagine senza modificare i movimenti.

**Criteri di completamento:** stato e `aria-pressed` coerenti; nessuna regressione nel bonifico.

---

## ⚠️ Common Mistakes

- **Provider assente:** monta il Provider sopra tutti i componenti che usano gli hook Redux.
- **Chiamare `dispatch(toggleCompact)` senza parentesi:** invia l'action generata con `toggleCompact()`.
- **Copiare conti nello store senza migrazione:** genera due fonti di verità; qui lasciamoli nel Context.
- **Aspettarsi persistenza:** lo store in memoria si resetta al reload.

---

## ✅ Checklist

- ☐ So seguire action → reducer → store → selector.
- ☐ Ho verificato navigazione, reload e `aria-pressed`.
- ☐ Ho verificato bonifico, lint e build.

---

## 🚀 Challenge

Aggiungi una seconda preferenza non bancaria alla stessa slice e un selector dedicato; verifica che sia indipendente dalla densità.

---

## 📌 Recap

- Redux Toolkit semplifica store, action e reducer.
- React Redux collega componenti e store con Provider e hook.
- Scegli la collocazione dello stato in base a chi lo usa.

---

### ➡️ Next

[Day 8 · Final Project Brief](../Day_08_Final_Project/01_Final_Project_Brief.md): completa e verifica LipariBank.
