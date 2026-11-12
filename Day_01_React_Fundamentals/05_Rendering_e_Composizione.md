# 🏦 LipariBank — React Zero to Hero

> **Day 1 · Capitolo 05**
> **Argomento:** Rendering e composizione
> **Durata stimata:** 30 minuti
> **Parte di LipariBank:** formattazione di importi e date, componente `BalanceCard` (saldo totale) e composizione in `App`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- descrivere come React trasforma i componenti in elementi sullo schermo;
- comporre più componenti dentro un componente padre;
- creare funzioni di utilità per formattare importi e date;
- calcolare e mostrare il saldo totale della dashboard.

---

## 📋 Prerequisiti
- [Day 1 · Function Components](./04_Function_Components.md): esistono `src/data/mockData.js`, `src/components/Header.jsx` e `App.jsx` con `<Header />`.
- Utile: [Extra · Map, Filter, Reduce](../Extra_JavaScript_Essentials/04_Map_Filter_Reduce.md) per `reduce`.

---

## 🧭 In questo capitolo
- Come funziona il rendering.
- DOM e Virtual DOM: un primo sguardo.
- Composizione e albero dei componenti.
- Funzioni `formatCurrency` e `formatDate`.
- `BalanceCard` con il saldo totale.
- Anteprima: rendere elenchi con `map`.

---

## 🧠 Theory

### Come funziona il rendering
1. `main.jsx` chiede a React di renderizzare `<App />`.
2. React **esegue la funzione** `App`, che restituisce JSX.
3. Nel JSX trova `<Header />`: esegue anche `Header`, e così via fino ai tag HTML.
4. Il risultato è un albero che React traduce in elementi del DOM.

Quando in futuro i dati cambieranno (Day 3), React rieseguirà i componenti interessati e aggiornerà **solo le differenze** nel DOM. Per ora ogni componente viene eseguito una volta all'avvio (in sviluppo, `StrictMode` lo esegue due volte per controllo: non preoccuparti).

### DOM e Virtual DOM: un primo sguardo
Il **DOM** è l'albero di oggetti con cui il browser rappresenta la pagina: ogni tag è un nodo. Modificarlo ha un costo, perché a ogni cambiamento il browser deve ricalcolare stili e posizioni.

Il JSX che un componente restituisce **non è DOM**. È una descrizione leggera, fatta di normali oggetti JavaScript chiamati *elementi React*. Semplificando, questa riga:

```jsx
<p className="balance">Saldo</p>
```

diventa un oggetto di questo tipo:

```javascript
{ type: "p", props: { className: "balance", children: "Saldo" } }
```

L'albero di questi oggetti è ciò che comunemente si chiama **Virtual DOM**: una copia "di carta" dell'interfaccia, economica da creare e da confrontare. React DOM la legge e crea i nodi veri nella pagina.

Il vantaggio si vedrà quando i dati cambieranno: React produrrà una nuova descrizione, la confronterà con la precedente e modificherà nel DOM solo ciò che è diverso. Questo confronto si chiama **riconciliazione** e lo studieremo nel [Day 3](../Day_03_State_Events/04_Virtual_DOM_e_Riconciliazione.md).

### Composizione
**Comporre** significa usare un componente dentro un altro. `App` contiene `Header` e `BalanceCard`; più avanti `BalanceCard` potrà contenere altri componenti. Questa relazione genera l'**albero dei componenti**:

```text
App
├── Header
└── BalanceCard
```

Preferisci tanti componenti piccoli, ciascuno con un compito chiaro, a un componente gigante.

### Calcolare prima, mostrare poi
Dentro un componente puoi scrivere qualsiasi JavaScript **prima del `return`**: calcoli, filtri, trasformazioni. Il JSX poi si limita a mostrare i valori già pronti. È la struttura che useremo sempre.

### Anteprima: elenchi con `map`
Per mostrare molti elementi si trasforma un array in un array di JSX con `map`. Ogni elemento ha bisogno di una `key` stabile (qui il suo `id`). Nel Day 2 approfondiremo le `key`.

```jsx
const names = ["Giulia Bianchi", "Luca Verdi"];

<ul>
  {names.map((name) => (
    <li key={name}>{name}</li>
  ))}
</ul>
```

> 💡 **Remember**
>
> Il componente è una funzione: calcola ciò che serve, poi restituisce JSX. Non modificare dati esterni mentre il componente viene eseguito.

---

## 💻 Let's Code

### 1. Funzioni di formattazione
Crea `src/utils/formatters.js`:

```javascript
const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  useGrouping: "always",
});

export function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("it-IT");
}
```

**Cosa fa.** `formatCurrency(4250.75)` restituisce una stringa con il formato italiano, ad esempio `4.250,75 €`; `formatDate("2026-10-27")` restituisce `27/10/2026`.

**Perché funziona.** `Intl.NumberFormat` e `toLocaleDateString` sono API standard del browser: nessuna libreria da installare. Le funzioni sono **named export**.

**Come modificarlo.** Cambia `"it-IT"` in `"en-GB"` per vedere la differenza (poi ripristinalo).

### 2. Il componente `BalanceCard`
Crea `src/components/BalanceCard.jsx`:

```jsx
import { accounts } from "../data/mockData.js";
import { formatCurrency } from "../utils/formatters.js";

function BalanceCard() {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  return (
    <section className="balance-card">
      <p className="balance-card__label">Saldo totale</p>
      <p className="balance-card__value">{formatCurrency(totalBalance)}</p>
    </section>
  );
}

export default BalanceCard;
```

**Cosa fa.** Somma i saldi di tutti i conti con `reduce` e mostra il totale formattato. Con i dati canonici il totale è `4.250,75 + 12.800,00 = 17.050,75 €`.

**Perché funziona.** Il calcolo avviene prima del `return`; il JSX mostra solo `totalBalance` già formattato.

**Come modificarlo.** Aggiungi `<p>{accounts.length} conti</p>`. Nel Day 2 sposteremo il calcolo fuori dal componente per renderlo riusabile.

**Errori da evitare.** Dimenticare il valore iniziale `0` di `reduce`; scrivere `accounts.balance` (l'array non ha `balance`: ce l'ha ogni elemento).

### 3. Comporre in `App`
Aggiorna `src/App.jsx`:

```jsx
import Header from "./components/Header.jsx";
import BalanceCard from "./components/BalanceCard.jsx";

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <BalanceCard />
      </main>
    </div>
  );
}

export default App;
```

Nel browser vedi header e saldo totale `17.050,75 €`. Se hai ancora `Footer` dal capitolo precedente puoi lasciarlo sotto `<main>`: è opzionale.

---

## 🏦 LipariBank in action
La dashboard ha ora due componenti con responsabilità distinte:

| Componente | Responsabilità |
| --- | --- |
| `Header` | Mostrare chi è il cliente. |
| `BalanceCard` | Calcolare e mostrare il saldo totale. |

Manca la parte più interessante: l'elenco degli **ultimi movimenti**. Lo costruirai nel prossimo capitolo come esercizio guidato.

---

## 🧪 Your Turn

**Obiettivo:** estendere `BalanceCard` con un secondo dato calcolato.

**Requisiti**
1. Sotto il saldo totale mostra la scritta `N conti` dove `N` è il numero di conti dell'array (con i dati canonici: `2 conti`).
2. Mostra anche "Ultimo aggiornamento" con la data `2026-10-28` formattata con `formatDate` (risultato: `28/10/2026`).
3. Tutti i valori devono essere calcolati/importati, non scritti a mano nel JSX.

**Passi suggeriti**
- Importa `formatDate` insieme a `formatCurrency` con `import { formatCurrency, formatDate } from ...`.
- Dichiara una costante `lastUpdate = "2026-10-28"` prima del `return`.
- Aggiungi due `<p className="balance-card__meta">` nel JSX.

**Risultato atteso:** la card mostra `17.050,75 €`, `2 conti` e `Ultimo aggiornamento: 28/10/2026`.

**Criteri di completamento:** nessun errore a video; se aggiungi un terzo conto in `mockData.js` il totale e il conteggio cambiano da soli (poi rimuovilo).

---

## ⚠️ Common Mistakes
- **`reduce` senza valore iniziale**: con array vuoto produce un errore; passa sempre `0`.
- **Formattare con calcoli a mano** (`balance.toFixed(2)` e sostituire il punto): usa `Intl.NumberFormat`.
- **Import di funzione con default** (`import formatCurrency from ...`): sono named export, servono le graffe.
- **Mutare dati importati** (es. `accounts.push(...)` dentro il componente): i componenti non devono modificare dati esterni.

---

## ✅ Checklist
- ☐ Ho creato `src/utils/formatters.js` con `formatCurrency` e `formatDate`.
- ☐ Ho creato `BalanceCard.jsx` e vedo `17.050,75 €`.
- ☐ `App.jsx` compone `Header` e `BalanceCard`.
- ☐ So descrivere come React esegue i componenti.
- ☐ So dire in una frase che differenza c'è tra DOM e Virtual DOM.
- ☐ Ho completato l'esercizio su conteggio conti e data.

---

## 🚀 Challenge
Aggiungi nella `BalanceCard` il saldo del solo "Conto Corrente" cercandolo con `accounts.find((a) => a.id === "acc-001")`. Cosa succede se l'id non esiste? Prova a cambiare l'id e leggi l'errore: ti servirà per il Day 2.

---

## 📌 Recap
- React esegue le funzioni dei componenti e traduce il JSX in DOM.
- Il JSX produce oggetti che descrivono la UI (il Virtual DOM); i nodi veri li crea React DOM.
- Comporre = usare componenti dentro altri componenti (albero).
- Calcola prima del `return`, mostra nel JSX.
- `formatCurrency` e `formatDate` sono funzioni di utilità riusabili.
- Gli elenchi si costruiscono con `map` e `key`.

---

### ➡️ Next
Prossimo capitolo: [Esercizio LipariBank — Dashboard](./06_Esercizio_LipariBank_Dashboard.md). Metterai insieme tutto ciò che hai imparato per completare la prima dashboard, con gli ultimi cinque movimenti.
