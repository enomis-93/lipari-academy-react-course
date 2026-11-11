# 🏦 LipariBank — React Zero to Hero

> **Day 7 · Capitolo 04**
> **Argomento:** Memoization (`useMemo`, `useCallback`, `React.memo`) e quando NON usarla
> **Durata stimata:** 60 minuti
> **Parte di LipariBank:** riepilogo uscite per categoria (`CategorySummary.jsx`) e versione finale di `useTransactions`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- spiegare cosa fanno `useMemo`, `useCallback` e `React.memo` e quanto costano;
- usare React DevTools Profiler per **misurare** prima di ottimizzare;
- riconoscere i casi in cui la memoization è inutile (props che cambiano a ogni render, componenti leggeri);
- applicare le tre tecniche a un caso realistico di LipariBank e poi decidere cosa tenere.

---

## 📋 Prerequisiti
- [Cap. 03 · Custom Hooks](./03_Custom_Hooks.md) (`useTransactions`).
- [Day 3 · State e Rerender](../Day_03_State_Events/03_State_e_Rerender.md): un componente si ri-renderizza quando cambia il suo state o quando si ri-renderizza il genitore.
- Estensione browser **React Developer Tools** installata (Chrome, Edge o Firefox).
- Progetto `liparibank/` funzionante; `TransactionsPage` riceve ancora `transactions` via props da `App.jsx`.

---

## 🧭 In questo capitolo
- Come React decide cosa ri-renderizzare.
- `React.memo`, `useMemo`, `useCallback` con un esempio completo.
- Misurare con il Profiler e con uno stress test.
- Regole pratiche: quando sì, quando no. Cenno al React Compiler.

---

## 🧠 Theory

### Render non significa "lento"
Quando un componente si ri-renderizza, React richiama la funzione e confronta il risultato con quello precedente: di solito costa microsecondi. **Un re-render in più non è un bug.** Per default, quando un genitore si ri-renderizza lo fanno anche tutti i suoi figli, anche se le props non sono cambiate.

### I tre strumenti

| Strumento | Cosa fa | Costo |
|---|---|---|
| `React.memo(Component)` | Salta il re-render se **tutte le props** sono uguali (confronto superficiale, `Object.is`) | confronto props a ogni render + memoria |
| `useMemo(() => calcolo, [dep])` | Riusa il **risultato** di un calcolo finché le dipendenze non cambiano | memoria + confronto dipendenze |
| `useCallback(fn, [dep])` | Riusa la **stessa funzione** (stessa identità) finché le dipendenze non cambiano | idem; equivale a `useMemo(() => fn, [dep])` |

Per React `{}` !== `{}`, `[]` !== `[]` e `() => {}` !== `() => {}`: un oggetto, un array o una funzione creati dentro il componente sono **nuovi a ogni render**. Per questo `React.memo` serve quasi sempre insieme a `useMemo`/`useCallback` sulle props non primitive.

### Quando NON usarli
- **Per default / "per sicurezza" su ogni componente**: aggiungono codice, dipendenze da mantenere e costi propri. Ottimizzazione prematura.
- **Senza aver misurato**: prima dimostra, con il Profiler, che c'è un problema.
- **Su componenti leggeri** (una riga di JSX): il confronto delle props può costare quanto il render.
- **Se una prop cambia a ogni render** (oggetto o funzione inline, `new Date()`): `React.memo` non salta mai il render.
- **`useCallback` senza un consumer che lo sfrutta**: se la funzione non va a un componente `memo` né a un array di dipendenze di un effetto, non serve a nulla.
- **`useMemo` su calcoli economici** (filtrare 8 movimenti): costa più del calcolo.
- **Per "correggere" un bug di logica**: la memoization è un'ottimizzazione, non deve cambiare il comportamento corretto. Se rimuoverla rompe l'app, il problema è altrove.

### Quando può servire
1. Un calcolo **davvero costoso** (migliaia di elementi, ordinamenti pesanti) ripetuto a ogni render.
2. Un figlio **pesante** che riceve props stabili e viene ri-renderizzato spesso da state non correlato del genitore (esempio: il genitore ha un input che si aggiorna a ogni tasto).
3. Serve un'**identità stabile**: funzione o oggetto nell'array di dipendenze di un `useEffect`, oppure valore del Context.

> 💡 **Remember**
>
> Misura → ottimizza → misura di nuovo. Se non puoi mostrare un numero o un grafico "prima/dopo", probabilmente non ti serve.

### React Compiler (solo un cenno)
Esiste un **React Compiler**, uno strumento di build che può aggiungere automaticamente la memoization dove sicura. Non è attivo nel progetto del corso e non ci facciamo affidamento: conoscere `memo`, `useMemo` e `useCallback` serve comunque per leggere il codice esistente e per capire cosa significa "identità stabile".

---

## 💻 Let's Code

### 1. Un componente candidato: `CategorySummary`
Crea `src/components/CategorySummary.jsx` (nuovo file nella cartella dei componenti):

```jsx
import { memo, useMemo } from "react";
import { formatCurrency } from "../utils/formatters";

function CategorySummary({ transactions, selectedCategory, onSelectCategory }) {
  const totals = useMemo(() => {
    const byCategory = {};
    for (const transaction of transactions) {
      if (transaction.amount < 0) {
        byCategory[transaction.category] =
          (byCategory[transaction.category] ?? 0) + Math.abs(transaction.amount);
      }
    }
    return Object.entries(byCategory)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }, [transactions]);

  if (totals.length === 0) {
    return <p>Nessuna uscita da riepilogare.</p>;
  }

  return (
    <section className="category-summary">
      <h2>Uscite per categoria</h2>
      <ul>
        {totals.map(({ category, total }) => (
          <li key={category}>
            <button
              type="button"
              aria-pressed={selectedCategory === category}
              onClick={() => onSelectCategory(category)}
            >
              {category}: {formatCurrency(total)}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default memo(CategorySummary);
```

Ci sono tutti e tre gli strumenti: `memo` sul componente, `useMemo` sul raggruppamento, e (nella pagina) `useCallback` sul handler.

### 2. Usarlo in `TransactionsPage`
Snippet parziale: aggiungi solo ciò che manca al tuo `TransactionsPage.jsx` (la pagina continua a ricevere `transactions`, `isLoading`, `error`, `onRetry`, `onToggleFavorite` via props e ha già `filter`, `searchText` e `visibleTransactions`).

```jsx
import { useCallback, useState } from "react";
import CategorySummary from "../components/CategorySummary";

// dentro TransactionsPage({ transactions, isLoading, error, onRetry, onToggleFavorite })
const [selectedCategory, setSelectedCategory] = useState(null);
const [note, setNote] = useState(""); // solo per l'esperimento: provoca re-render non correlati

const handleSelectCategory = useCallback((category) => {
  setSelectedCategory((current) => (current === category ? null : category));
}, []);

// dopo il tuo `visibleTransactions` (filtro tipo, ricerca, ordinamento)
const categoryTransactions =
  selectedCategory === null
    ? visibleTransactions
    : visibleTransactions.filter((transaction) => transaction.category === selectedCategory);

// nel JSX, nel ramo che mostra la lista (al posto del solo <TransactionList />)
<label htmlFor="note">Nota veloce (esperimento)</label>
<input id="note" value={note} onChange={(event) => setNote(event.target.value)} />
<CategorySummary
  transactions={transactions}
  selectedCategory={selectedCategory}
  onSelectCategory={handleSelectCategory}
/>
<TransactionList transactions={categoryTransactions} onToggleFavorite={onToggleFavorite} />
```

Perché funziona: quando scrivi nella nota, `TransactionsPage` si ri-renderizza, ma `CategorySummary` riceve **le stesse props** (`transactions` è lo state di `App`, `selectedCategory` è una stringa o `null`, `handleSelectCategory` è memoizzata): `memo` salta il render. Il filtro per categoria (`categoryTransactions`) è un semplice `filter` su pochi elementi: qui **non** serve `useMemo`.

Se passi il setter direttamente (`onSelectCategory={setSelectedCategory}`) non serve nemmeno `useCallback`: i setter di `useState` hanno già identità stabile. Qui usiamo `useCallback` perché il handler contiene logica (il toggle).

Rendi memoizzato anche `TransactionList`: apri `src/components/TransactionList.jsx` e cambia solo l'import e l'export (il resto del file resta uguale, compreso `onToggleFavorite`):

```jsx
import { memo } from "react";

function TransactionList({ transactions, onToggleFavorite }) {
  // ...il tuo codice di Day 2-6, invariato
}

export default memo(TransactionList);
```

Attenzione: finché la pagina riceve da `App.jsx` un `onToggleFavorite` ricreato a ogni render e calcola `categoryTransactions` a ogni render, `memo(TransactionList)` **non salta mai** il render (le props cambiano sempre). Diventerà utile nel [cap. 07](./07_Esercizio_Refactoring_LipariBank.md): `useTransactions` (§5) restituisce un array stabile e `useBank` espone `toggleFavorite` con `useCallback`.

### 3. Misurare con il Profiler
1. Apri `http://localhost:5173/transactions` con `npm run dev` attivo.
2. DevTools → tab **Profiler** → ingranaggio → abilita **Record why each component rendered while profiling**.
3. Premi Record, scrivi qualche lettera nella nota, premi Stop.
4. Nel flamegraph i componenti **grigi** non sono stati ri-renderizzati; per quelli colorati leggi il motivo ("Props changed", "Hooks changed", "The parent component rendered").

Alternativa semplice: aggiungi temporaneamente `console.log("render CategorySummary")` all'inizio del componente. In sviluppo `StrictMode` esegue due volte il corpo del componente, quindi senza `memo` vedresti due log per tasto (con l'estensione React DevTools il secondo è mostrato attenuato); con `memo` nessuno.

### 4. Lo stress test: con 8 movimenti non vedi nulla
Con i dati di LipariBank il calcolo costa pochi microsecondi. Per vedere un effetto reale, **temporaneamente** nella pagina crea molti dati:

```jsx
const stressTransactions = useMemo(
  () =>
    Array.from({ length: 5000 }, (_, index) => ({
      id: `stress-${index}`,
      accountId: "acc-001",
      date: "2026-10-01",
      description: `Movimento ${index}`,
      amount: -((index % 50) + 1),
      category: `Categoria ${index % 40}`,
    })),
  [],
);
```

Passa `stressTransactions` a `CategorySummary` al posto di `transactions` e registra la digitazione nella nota con il Profiler in tre configurazioni: (a) tutto memoizzato, (b) senza `memo` su `CategorySummary`, (c) senza `useCallback` su `handleSelectCategory` (il handler cambia a ogni render e **annulla** `memo`). Annota i millisecondi: sono i *tuoi* numeri a decidere cosa tenere. Poi elimina lo stress test.

### 5. Sistemare `useTransactions`
Il hook del cap. 03 restituisce un array **nuovo** a ogni render. Se lo passi a un componente `memo`, `memo` non salta mai nulla. Versione finale di `src/hooks/useTransactions.js`:

```javascript
import { useMemo } from "react";
import { useBank } from "../context/BankContext";

export function useTransactions({ accountId = null, filter = "all", searchText = "" } = {}) {
  const { transactions, isLoading, error } = useBank();

  const visibleTransactions = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return transactions
      .filter((transaction) => accountId === null || transaction.accountId === accountId)
      .filter((transaction) => {
        if (filter === "income") return transaction.amount > 0;
        if (filter === "expense") return transaction.amount < 0;
        return true;
      })
      .filter(
        (transaction) =>
          normalizedSearch === "" ||
          transaction.description.toLowerCase().includes(normalizedSearch),
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, accountId, filter, searchText]);

  return { transactions: visibleTransactions, isLoading, error };
}
```

Qui il motivo di `useMemo` **non è la velocità** (8 movimenti): è l'**identità stabile** del risultato. È una scelta di design e va dichiarata come tale.

### 5 bis. Il valore del Context
Nei Provider del cap. 01-02 abbiamo usato `useMemo` sul `value`. È una regola comoda: se il Provider si ri-renderizza per un motivo che non cambia i dati, il `value` resta lo stesso e i consumer non si ri-renderizzano. Nel nostro caso i Provider stanno in cima all'albero (`main.jsx`) e si ri-renderizzano solo quando cambia il loro state, quindi il guadagno concreto oggi è minimo: è un'abitudine a basso costo, non una necessità.

---

## 🏦 LipariBank in action
Valutazione onesta di ciò che abbiamo scritto, con i dati del corso:

| Codice | Serve davvero con 8 movimenti? | Decisione |
|---|---|---|
| `useMemo` nel raggruppamento di `CategorySummary` | No: calcolo trascurabile | Tienilo solo se il Profiler/stress test lo giustifica; in caso contrario rimuovilo |
| `memo(CategorySummary)` + `useCallback` | Dipende: utile se il genitore si ri-renderizza spesso per state non correlato | Misura, poi decidi |
| `useMemo` in `useTransactions` | Per l'identità del risultato | Tienilo (motivo esplicito) |
| `memo(TransactionList)` | Liste lunghe sì, 8 righe no | Tienilo solo con lista lunga e profiler alla mano |

Un buon risultato dell'esercizio può essere **togliere** parte della memoization. Una versione senza `memo`/`useMemo`/`useCallback` che il Profiler mostra già veloce è migliore di una piena di ottimizzazioni non dimostrate.

---

## 🧪 Your Turn
**Obiettivo:** decidere con dati misurati se la memoization di `CategorySummary` è giustificata.

**Requisiti:**
1. `CategorySummary` è usato in `TransactionsPage` come mostrato; cliccare una categoria filtra la lista, cliccarla di nuovo toglie il filtro.
2. Esegui lo stress test a 5.000 movimenti e compila una tabella con i ms di render di `CategorySummary` nelle tre configurazioni (a), (b), (c) del paragrafo 4.
3. Con gli 8 movimenti reali ripeti la misura e confronta.
4. Scrivi 3 righe di commento nel README personale (o su carta): cosa tieni, cosa togli, perché.
5. Rimuovi `note` e lo stress test.

**Suggerimenti:** nel Profiler seleziona il commit della digitazione e guarda "Rendered at / duration" del componente; ripeti 3 volte e prendi un valore tipico.

**Risultato atteso:** capisci perché (c) è la configurazione peggiore: `memo` presente ma inutile.

**Criteri di completamento:** hai una tabella con numeri tuoi, hai rimosso il codice sperimentale e `npm run lint` non segnala errori.

---

## ⚠️ Common Mistakes
- **`memo` + prop oggetto/funzione inline**: `<CategorySummary onSelectCategory={(c) => ...} />` crea una funzione nuova a ogni render e vanifica `memo`.
- **Dipendenze sbagliate** in `useMemo`/`useCallback`: dati vecchi (stale). Non sopprimere gli avvisi del lint: correggi le dipendenze.
- **Memoizzare "a tappeto"**: codice più lungo, stesso comportamento.
- **Credere che `memo` blocchi il Context**: un componente `memo` che usa `useContext` si ri-renderizza comunque quando il valore del Context cambia.
- **Mutare i dati** (`transactions.sort(...)`): oltre al bug, la dipendenza resta "uguale" e la memoization non ricalcola.
- **Ottimizzare in dev senza ricordare `StrictMode`**: in sviluppo i render raddoppiano di proposito; non è un problema di performance.

---

## ✅ Checklist
- ☐ So spiegare cosa confronta `React.memo` (props, superficiale).
- ☐ So perché un handler inline annulla `memo`.
- ☐ Ho usato il Profiler per misurare almeno una volta.
- ☐ So elencare tre casi in cui NON usare `useMemo`/`useCallback`/`memo`.
- ☐ So dire perché `useTransactions` usa `useMemo` (identità) anche con pochi dati.
- ☐ Ho rimosso il codice sperimentale (`note`, stress test).

---

## 🚀 Challenge
`useCallback` e `useMemo` sono la stessa cosa? Riscrivi `handleSelectCategory` con `useMemo` restituendo una funzione e verifica che il comportamento sia identico. Poi spiega con parole tue perché `useCallback` esiste.

---

## 📌 Recap
- Un re-render è normale e di solito economico: ottimizza solo problemi misurati.
- `memo` salta il render se le props sono uguali; `useMemo` riusa un risultato; `useCallback` riusa una funzione.
- Oggetti, array e funzioni inline sono "nuovi" a ogni render e annullano `memo`.
- `useCallback`/`useMemo` hanno senso solo se qualcuno sfrutta l'identità stabile (componente `memo`, dipendenze di effetti, Context).
- Il React Compiler esiste, ma non è nel nostro percorso: i concetti servono comunque.

---

### ➡️ Next
Prossimo capitolo: [05 · Architettura del progetto](./05_Architettura_del_Progetto.md). Ora che abbiamo Context, hook e componenti, organizziamo le cartelle con un criterio.
