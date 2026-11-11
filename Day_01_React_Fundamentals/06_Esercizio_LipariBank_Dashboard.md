# 🏦 LipariBank — React Zero to Hero

> **Day 1 · Capitolo 06**
> **Argomento:** Esercizio LipariBank — Dashboard
> **Durata stimata:** 45 minuti
> **Parte di LipariBank:** prima dashboard statica: header, saldo totale e ultimi cinque movimenti (**CHECKPOINT 1 — Prima dashboard**)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- comporre una dashboard con più Function Components;
- trasformare un array di movimenti in elementi JSX con `map` e `key`;
- ordinare e limitare i dati **senza modificare l'array originale**;
- applicare uno stile diverso a entrate e uscite in base al segno dell'importo.

---

## 📋 Prerequisiti
- [Day 1 · Rendering e composizione](./05_Rendering_e_Composizione.md): esistono `mockData.js`, `formatters.js`, `Header.jsx`, `BalanceCard.jsx` e `App.jsx` che li compone.
- Dev server acceso (`npm run dev` dentro `liparibank/`).

---

## 🧭 In questo capitolo
- Stili globali della dashboard.
- Componente `TransactionItem` (una riga) e `RecentTransactions` (elenco).
- Anteprima delle **props**: come un componente riceve un dato dal padre.
- Verifica finale e Checkpoint 1.

---

## 🧠 Theory

### Anteprima: come passare un dato a un componente
`TransactionItem` deve mostrare movimenti diversi, quindi deve **ricevere** il movimento da qualcuno. In React si usano gli **attributi JSX**, che arrivano al componente come oggetto, per convenzione chiamato `props`:

```jsx
<TransactionItem transaction={t} />
```

```jsx
function TransactionItem(props) {
  const { transaction } = props;
  return <li>{transaction.description}</li>;
}
```

In questo capitolo lo usiamo come "strumento"; nel Day 2 ([Props](../Day_02_Components_Props/02_Props.md)) lo studieremo in dettaglio, compreso il destructuring direttamente nei parametri.

### Non mutare i dati originali
`Array.prototype.sort` **modifica l'array su cui viene chiamato**. Per ordinare i movimenti senza toccare `transactions` si lavora su una **copia**: `[...transactions].sort(...)`. Le date ISO (`YYYY-MM-DD`) si ordinano correttamente come stringhe con `localeCompare`.

> 💡 **Remember**
>
> Un componente non deve modificare i dati che importa. Copia (`[...array]`), poi ordina o filtra la copia.

---

## 💻 Let's Code

### Passo 0 — Stili globali
Il CSS non è l'obiettivo del corso: **sostituisci l'intero contenuto** di `src/index.css` con questo.

```css
:root {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  line-height: 1.5;
  color: #1f2937;
  background-color: #f3f4f6;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
}

button {
  font: inherit;
  cursor: pointer;
  padding: 0.6rem 1rem;
  border: 1px solid #0f4c81;
  border-radius: 0.65rem;
  background: #0f4c81;
  color: #fff;
  font-weight: 600;
  transition: background-color 150ms, box-shadow 150ms;
}

button:hover { background: #07365d; }
button[aria-pressed="true"] { background: #07365d; box-shadow: inset 0 0 0 2px #93c5fd; }
button:disabled { cursor: not-allowed; opacity: 0.55; }
button:focus-visible, nav a:focus-visible {
  outline: 3px solid #f59e0b;
  outline-offset: 3px;
}

.app {
  max-width: 720px;
  margin: 0 auto;
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  padding: 1rem 0;
  margin-bottom: 1rem;
  border-bottom: 2px solid #0f4c81;
}

.header__brand {
  margin: 0;
  font-size: 1.5rem;
  color: #0f4c81;
}

.header__name {
  margin: 0;
  color: #4b5563;
}

.balance-card {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  border-radius: 12px;
  color: #ffffff;
  background-color: #0f4c81;
}

.balance-card__label,
.balance-card__meta {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.85;
}

.balance-card__value {
  margin: 0.25rem 0;
  font-size: 2rem;
  font-weight: 700;
}

.section__title {
  margin: 0 0 0.75rem;
  font-size: 1.125rem;
}

.transaction-list {
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background-color: #ffffff;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-item__main {
  display: flex;
  flex-direction: column;
}

.transaction-item__description {
  font-weight: 600;
}

.transaction-item__meta {
  font-size: 0.8rem;
  color: #6b7280;
}

.amount {
  font-weight: 700;
  white-space: nowrap;
}

.amount--income {
  color: #15803d;
}

.amount--expense {
  color: #b91c1c;
}

.footer {
  margin-top: 2rem;
  font-size: 0.8rem;
  text-align: center;
  color: #6b7280;
}
```

Salva: header e saldo cambiano aspetto.

---

## 🏦 LipariBank in action
Stato di partenza del progetto e obiettivo del capitolo:

| File | Stato |
| --- | --- |
| `src/data/mockData.js` | ✅ già presente |
| `src/utils/formatters.js` | ✅ già presente |
| `src/components/Header.jsx` | ✅ già presente |
| `src/components/BalanceCard.jsx` | ✅ già presente |
| `src/components/TransactionItem.jsx` | 🆕 da creare |
| `src/components/RecentTransactions.jsx` | 🆕 da creare |
| `src/App.jsx` | ✏️ da aggiornare |

---

## 🧪 Your Turn

**Obiettivo:** completare la prima dashboard statica di LipariBank con i dati da `src/data/mockData.js`.

**Requisiti (concreti e verificabili)**
1. La pagina mostra, nell'ordine: `Header`, `BalanceCard` (saldo totale `17.050,75 €`) e un elenco "Ultimi movimenti".
2. L'elenco contiene **esattamente 5 movimenti**, ordinati dal più recente al meno recente. Con i dati canonici devono comparire: *Spesa supermercato* (27/10/2026), *Pagamento utenza luce* (25/10/2026), *Stipendio* (23/10/2026), *Abbonamento palestra* (20/10/2026), *Rimborso spese* (18/10/2026).
3. Ogni riga è un componente `TransactionItem` che mostra: descrizione, data formattata e categoria, importo formattato con `formatCurrency`.
4. Le **uscite** (importo negativo) hanno il testo rosso (`amount--expense`), le **entrate** (importo positivo) verde (`amount--income`).
5. L'array `transactions` importato **non viene modificato** (ordina una copia).
6. Ogni elemento della lista ha `key={transaction.id}`.

**Passi suggeriti**
1. **Riga statica:** crea `TransactionItem.jsx` che riceve `props.transaction` e mostra descrizione, data e importo. Provalo in `App` passando `transactions[0]` (`import { transactions } from "./data/mockData.js"`).
2. **Classe condizionale:** scegli `amount amount--expense` oppure `amount amount--income` con un ternario sul segno di `transaction.amount` e usa il risultato in `className={...}`.
3. **Elenco:** crea `RecentTransactions.jsx`: copia, ordina (`localeCompare` sulla data, decrescente), `slice(0, 5)`, poi `map` verso `<TransactionItem />`.
4. **Composizione:** aggiungi `<RecentTransactions />` in `App.jsx` sotto `<BalanceCard />`.
5. **Verifica** con la checklist più sotto.

**Risultato atteso:** una dashboard statica con intestazione, saldo e cinque righe, con importi verdi/rossi.

**Criteri di completamento:** tutti i 6 requisiti verificati; `npm run lint` senza errori; nessun warning sulle `key` nella console del browser.

> ⚠️ **Prova prima da solo**
>
> Dedica almeno 20 minuti al tentativo autonomo. Sotto trovi la soluzione di riferimento delle parti chiave: usala per confrontare, non per copiare.

### Soluzione di riferimento — parti chiave

`src/components/TransactionItem.jsx`:

```jsx
import { formatCurrency, formatDate } from "../utils/formatters.js";

function TransactionItem(props) {
  const { transaction } = props;
  const amountClass =
    transaction.amount < 0 ? "amount amount--expense" : "amount amount--income";

  return (
    <li className="transaction-item">
      <div className="transaction-item__main">
        <span className="transaction-item__description">
          {transaction.description}
        </span>
        <span className="transaction-item__meta">
          {formatDate(transaction.date)} · {transaction.category}
        </span>
      </div>
      <span className={amountClass}>{formatCurrency(transaction.amount)}</span>
    </li>
  );
}

export default TransactionItem;
```

`src/components/RecentTransactions.jsx`:

```jsx
import { transactions } from "../data/mockData.js";
import TransactionItem from "./TransactionItem.jsx";

function RecentTransactions() {
  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <section className="section">
      <h2 className="section__title">Ultimi movimenti</h2>
      <ul className="transaction-list">
        {recentTransactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </ul>
    </section>
  );
}

export default RecentTransactions;
```

`src/App.jsx`:

```jsx
import Header from "./components/Header.jsx";
import BalanceCard from "./components/BalanceCard.jsx";
import RecentTransactions from "./components/RecentTransactions.jsx";

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <BalanceCard />
        <RecentTransactions />
      </main>
    </div>
  );
}

export default App;
```

**Perché funziona.**
- `[...transactions]` crea una copia: `sort` modifica solo la copia.
- `b.date.localeCompare(a.date)` ordina in modo **decrescente**; il formato ISO rende l'ordine alfabetico uguale a quello cronologico.
- `slice(0, 5)` prende i primi cinque elementi dopo l'ordinamento.
- `key={transaction.id}` identifica ogni riga in modo stabile.

---

## 🔗 Repository / Checkpoint

### CHECKPOINT 1 — Prima dashboard

Puoi proseguire dal tuo progetto o da una repository di riferimento, se disponibile.

- **Repository del corso:** `[DA CONFIGURARE: inserire URL reale della repository]`
- **Branch/tag:** `[DA CONFIGURARE: inserire nome reale del branch]`
- **Alternativa:** la **tua repository** creata nel [Day 0 · Git e GitHub](../Day_00_Setup/04_Git_GitHub.md). Suggerimento di nome per il tag: `checkpoint-1-prima-dashboard`.

| Domanda | Risposta |
| --- | --- |
| **Contenuto iniziale** | Progetto Vite con `App.jsx` minimo, `mockData.js`, `formatters.js`, `Header` e `BalanceCard` (stato a fine capitolo 05). |
| **Cosa completare** | `TransactionItem`, `RecentTransactions`, composizione in `App`, stili in `index.css`. |
| **Cosa deve già funzionare** | `npm run dev` parte senza errori; Header e saldo totale `17.050,75 €` sono visibili. |
| **Come verificare** | Cinque righe in ordine di data decrescente; uscite rosse, entrate verdi; console del browser senza warning; `npm run lint` senza errori. |

Per salvare il tuo avanzamento (dentro `liparibank/`):

```bash
git add .
git commit -m "Day 1: prima dashboard LipariBank"
```

Per creare il tag suggerito (facoltativo):

```bash
git tag checkpoint-1-prima-dashboard
```

---

## ⚠️ Common Mistakes
- **`sort` direttamente su `transactions`**: modifica i dati importati. Usa `[...transactions].sort(...)`.
- **Ordine invertito**: `a.date.localeCompare(b.date)` è crescente; per il più recente in alto serve `b.date.localeCompare(a.date)`.
- **`key` mancante o sul posto sbagliato**: la `key` va sul componente restituito dal `map` (`<TransactionItem key=... />`), non dentro il suo contenuto.
- **Importo sempre verde o sempre rosso**: controlla il confronto (`amount < 0`) e che `className` riceva la variabile con le graffe.
- **`class` invece di `className`** nei nuovi componenti.
- **Percorsi di import** sbagliati (`./data/...` vs `../data/...` dentro `components/`).

---

## ✅ Checklist
- ☐ La dashboard mostra header, saldo totale e ultimi movimenti.
- ☐ Ci sono esattamente 5 movimenti, dal più recente.
- ☐ Entrate verdi, uscite rosse.
- ☐ `transactions` non è stato modificato (uso la copia).
- ☐ Ogni `<TransactionItem />` ha `key={transaction.id}`.
- ☐ `npm run lint` senza errori e console pulita.
- ☐ Ho salvato il mio avanzamento con un commit.

---

## 🚀 Challenge
Aggiungi in `RecentTransactions` un sottotitolo che indica quanti movimenti totali esistono, ad esempio `Mostrati 5 di 8 movimenti`, usando `transactions.length` e `recentTransactions.length` (nessun numero scritto a mano).

---

## 📌 Recap
- Una dashboard è un albero di componenti: `App` → `Header`, `BalanceCard`, `RecentTransactions` → `TransactionItem`.
- Gli elenchi si costruiscono con `map` e `key` stabili (`id`).
- Ordina e filtra **copie** dei dati, mai gli array originali.
- Le classi CSS possono dipendere dai dati (importo positivo/negativo).
- Per ora i componenti leggono i dati direttamente da `mockData.js`: nel Day 2 impareremo a passarli con le props.

---

### ➡️ Next
Prossimo capitolo: [Day 2 · Componenti e composizione](../Day_02_Components_Props/01_Componenti_e_Composizione.md). Rendiamo i componenti riutilizzabili e separiamo chi *mostra* i dati da chi li *coordina*.
