# 🏦 LipariBank — React Zero to Hero

> **Day 5 · Capitolo 03**
> **Argomento:** Dipendenze e Cleanup
> **Durata stimata:** 35 minuti
> **Parte di LipariBank:** preparare il `Dashboard` a richieste asincrone sicure (cleanup, `StrictMode`, race condition, `AbortController`)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- individuare dipendenze mancanti, oggetti instabili e cicli infiniti in un effect;
- scrivere una funzione di **cleanup** per timer e sottoscrizioni;
- spiegare perché in sviluppo con `StrictMode` un effect sembra eseguito due volte;
- riconoscere e prevenire una **race condition**, anche con `AbortController`.

---

## 📋 Prerequisiti
- [Capitolo 02 — useEffect](./02_useEffect.md).
- `src/main.jsx` che monta `<App />` dentro `<StrictMode>` (è il default del template Vite).

---

## 🧭 In questo capitolo
- Errori tipici sulle dipendenze.
- Cleanup: cosa è e quando React lo chiama.
- `StrictMode`: mount → cleanup → mount, solo in sviluppo.
- Race condition e `AbortController`.

---

## 🧠 Theory

### Dipendenze: tre insidie
1. **Dipendenza mancante.** L'effect usa un valore reattivo ma non lo elenca: lavora con un valore *stale* (vecchio). Il linter del template (`npm run lint`) e l'editor possono segnalarlo, ma devi capire tu la regola.
2. **Oggetti e funzioni come dipendenza.** `{ filter, searchText }` creato nel corpo del componente è un oggetto **nuovo a ogni render**: React lo confronta con `Object.is`, lo trova "diverso" e rilancia l'effect ogni volta. Preferisci dipendenze **primitive** (`filter`, `searchText`).
3. **Loop infinito.** Effect senza array che chiama `setState` (con un valore sempre nuovo): render → effect → setState → render → …

### Cleanup
La funzione restituita dal `setup` è il **cleanup**. React la chiama:

- **prima di rieseguire l'effect** quando le dipendenze cambiano (ripulisce l'esecuzione precedente);
- **quando il componente viene smontato**.

Serve a chiudere ciò che l'effect ha aperto: timer, event listener, sottoscrizioni, richieste in corso.

### StrictMode in sviluppo
Quando l'app gira in `StrictMode` **in sviluppo** (`npm run dev`), React, dopo il primo mount di un componente, simula uno smontaggio e un rimontaggio immediato:

```text
setup → cleanup → setup
```

Non è un bug e **non accade in produzione**. Serve a farti scoprire effect privi di cleanup: se l'effect è scritto bene, eseguirlo "due volte" non cambia il risultato. Soluzione corretta: scrivere il cleanup, non togliere `StrictMode`.

### Race condition
Se l'effect dipende da un valore (es. `accountId`) e parte una richiesta a ogni cambio, le risposte possono arrivare **in ordine diverso** da quello di partenza. Se la risposta vecchia arriva per ultima, sovrascrive quella corretta. Due difese:

- un flag `ignore` nel cleanup, che scarta i risultati obsoleti;
- un `AbortController`, che **annulla la richiesta** `fetch` (il metodo preferito per `fetch`).

> 💡 **Remember**
>
> Un effect che apre qualcosa deve saperlo chiudere. Se il cleanup non esiste, chiediti: cosa succederebbe se l'effect partisse due volte di fila?

---

## 💻 Let's Code

### 1. Un timer con cleanup
Componente **didattico e temporaneo** (non fa parte della struttura finale di LipariBank), crealo in `src/components/LastUpdateClock.jsx`:

```jsx title="src/components/LastUpdateClock.jsx"
import { useEffect, useState } from "react";

export default function LastUpdateClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    console.log("Timer avviato");
    const intervalId = setInterval(() => setNow(new Date()), 1000);

    return () => {
      console.log("Timer fermato");
      clearInterval(intervalId);
    };
  }, []);

  return <p>Ora attuale: {now.toLocaleTimeString("it-IT")}</p>;
}
```

Montalo temporaneamente in `Dashboard.jsx` (`import LastUpdateClock from "./LastUpdateClock.jsx";` e `<LastUpdateClock />` nel JSX). Apri la console in `npm run dev`:

```text
Timer avviato
Timer fermato
Timer avviato
```

È il comportamento `StrictMode`: mount → cleanup → mount. Ora **rimuovi** `clearInterval(intervalId)` dal cleanup e ricarica: avrai due timer attivi contemporaneamente, quindi due aggiornamenti al secondo. Il cleanup è ciò che mantiene corretto l'effect.

### 2. Oggetto come dipendenza (snippet da evitare)
```jsx
const filters = { filter, searchText };

useEffect(() => {
  console.log("Effect rilanciato", filters);
}, [filters]);
```

L'effect parte a ogni render perché `filters` è un oggetto nuovo. Correzione:

```jsx
useEffect(() => {
  console.log("Effect rilanciato", filter, searchText);
}, [filter, searchText]);
```

### 3. Stale closure
Snippet **errato**: `filter` è letto ma non elencato.

```jsx
useEffect(() => {
  document.title = `LipariBank — filtro: ${filter}`;
}, []);
```

Il titolo resta fermo al valore del primo render. Correzione: dipendenze `[filter]`.

### 4. Race condition su cambio conto
Componente **didattico e temporaneo** in `src/components/AccountTransactionsDemo.jsx`. La funzione `fakeGetAccountTransactions` simula una rete lenta con tempi casuali: non è un'API reale.

```jsx title="src/components/AccountTransactionsDemo.jsx"
import { useEffect, useState } from "react";
import { transactions } from "../data/mockData.js";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fakeGetAccountTransactions(accountId) {
  await wait(Math.random() * 2000);
  return transactions.filter((item) => item.accountId === accountId);
}

export default function AccountTransactionsDemo({ accountId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const result = await fakeGetAccountTransactions(accountId);
      if (!ignore) {
        setItems(result);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [accountId]);

  return (
    <p>
      Movimenti di {accountId}: {items.length}
    </p>
  );
}
```

Nel `Dashboard` aggiungi `<AccountTransactionsDemo accountId={selectedAccountId} />` e clicca velocemente tra i due conti. Con il flag, il numero mostrato corrisponde sempre all'ultimo conto selezionato (6 per `acc-001`, 2 per `acc-002`). Prova poi a togliere `if (!ignore)`: a volte vedrai il numero del conto sbagliato.

### 5. AbortController (anteprima)
`AbortController` crea un `signal` che puoi passare a `fetch`; chiamando `abort()` la richiesta viene annullata e la Promise di `fetch` viene **rifiutata** con un errore di nome `AbortError`:

```javascript
const controller = new AbortController();

fetch("/data/transactions.json", { signal: controller.signal });

controller.abort();
```

Dentro un effect lo schema è sempre lo stesso: creare il controller, passare `signal`, chiamare `controller.abort()` nel cleanup, ignorare `AbortError` nel `catch`. Lo applichiamo a LipariBank nel [capitolo 04](./04_Fetch_API.md).

---

## 🏦 LipariBank in action
La dashboard ha due punti dove i temi del capitolo contano subito:

- **Caricamento dei movimenti** (capitolo 04): in sviluppo `StrictMode` lancia la richiesta due volte; la prima viene annullata dal cleanup, la seconda completa. Senza cleanup avresti due risposte che scrivono nello stesso state.
- **Cambio rapido di conto o filtro**: se in futuro i movimenti dipendessero dal conto selezionato, servirebbe proteggersi dalle race condition.

Per ora non c'è nulla da consegnare nel progetto: i componenti didattici di questo capitolo vanno cancellati al termine.

---

## 🧪 Your Turn

**Obiettivo:** vedere con i tuoi occhi cleanup, `StrictMode` e race condition.

**Requisiti:**
1. Crea `LastUpdateClock.jsx` e montalo nella dashboard. Con cleanup, controlla in console la sequenza "avviato / fermato / avviato".
2. Rimuovi il cleanup e annota cosa cambia (due timer attivi).
3. Crea `AccountTransactionsDemo.jsx` e cambia conto 10 volte velocemente: con il flag `ignore` il conteggio resta coerente.
4. Rimuovi `if (!ignore)` e riprova: riesci a vedere il valore sbagliato?
5. Al termine elimina entrambi i file e gli import dal `Dashboard`.

**Passi suggeriti:** lavora con la console aperta; per il punto 4 prova più volte, la race è casuale.

**Risultato atteso:** capisci il motivo di ogni riga del cleanup.

**Criteri di completamento:** hai osservato il doppio avvio in `StrictMode`, il caso "senza cleanup" e il caso "senza ignore"; i file temporanei sono eliminati.

---

## ⚠️ Common Mistakes
- **"L'effect gira due volte, c'è un bug".** No: è `StrictMode` in sviluppo. In produzione gira una volta.
- **Togliere `StrictMode` per far sparire il doppio log.** Nascondi il problema invece di risolverlo.
- **Dimenticare `clearInterval` / `removeEventListener`.** Perdite di risorse e comportamenti duplicati.
- **Mettere un oggetto o una funzione creati nel render tra le dipendenze.** Usa i primitivi o sposta la definizione dentro l'effect.
- **Ignorare solo il risultato ma non annullare la richiesta.** Il flag evita la race; `AbortController` risparmia anche il lavoro di rete.

---

## ✅ Checklist
- ☐ So riconoscere dipendenze mancanti e oggetti instabili.
- ☐ Scrivo il cleanup per ogni timer o sottoscrizione.
- ☐ So spiegare "setup → cleanup → setup" in sviluppo.
- ☐ So descrivere una race condition e due modi per evitarla.
- ☐ Ho eliminato i componenti didattici temporanei.

---

## 🚀 Challenge
Scrivi un effect che aggiunge un listener `keydown` su `window` per nascondere/mostrare il saldo premendo il tasto `h`, con il relativo `removeEventListener` nel cleanup. Verifica in console, con `StrictMode`, che non restino listener duplicati.

---

## 📌 Recap
- Il cleanup ripulisce l'esecuzione precedente e lo smontaggio.
- `StrictMode` in sviluppo esegue mount → cleanup → mount per rivelare cleanup mancanti.
- Preferisci dipendenze primitive e complete.
- Le race condition si evitano con un flag `ignore` o, per `fetch`, con `AbortController`.

---

### ➡️ Next
[Capitolo 04 — Fetch API](./04_Fetch_API.md): useremo tutto questo per caricare i movimenti da un file JSON locale.
