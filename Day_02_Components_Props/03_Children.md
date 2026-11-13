# 🏦 LipariBank — React Zero to Hero

> **Day 2 · Capitolo 03**
> **Argomento:** Children
> **Durata stimata:** 20 minuti
> **Parte di LipariBank:** nuovo componente contenitore `Card`, usato per le sezioni "I tuoi conti" e "Ultimi movimenti"

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- spiegare che cos'è la prop speciale `children`;
- creare un componente contenitore riusabile (`Card`);
- combinare `children` con altre props (`title`);
- usare `Card` per strutturare la dashboard di LipariBank.

---

## 📋 Prerequisiti
- [Day 2 · Props](./02_Props.md): `Header`, `BalanceCard`, `TransactionList`, `TransactionItem` e `AccountCard` ricevono props; `Dashboard` calcola i dati.
- Nella dashboard sono presenti due `AccountCard` (esercizio del capitolo precedente).

---

## 🧭 In questo capitolo
- `children`: contenuto annidato tra i tag.
- Il componente `Card` con prop `title`.
- Composizione al posto dell'ereditarietà.
- Applicazione alla dashboard.

---

## 🧠 Theory

### `children`
Quando scrivi del contenuto **tra** il tag di apertura e di chiusura di un componente, React lo passa nella prop speciale **`children`**:

```jsx
<Card>
  <p>Contenuto qualsiasi</p>
</Card>
```

```jsx
function Card({ children }) {
  return <section className="card">{children}</section>;
}
```

`children` può essere testo, un elemento, più elementi, altri componenti, perfino niente.

### Perché è utile
Alcuni componenti sono "scatole" che definiscono **come appare il contenitore** (bordo, titolo, spaziatura) senza sapere **cosa** conterrà. `children` permette di riusare lo stesso contenitore con contenuti diversi.

### `children` e altre props insieme
Un contenitore può ricevere sia contenuto sia props di configurazione:

```jsx
<Card title="I tuoi conti">
  ...
</Card>
```

Qui `title` è una prop normale (una stringa), mentre il contenuto tra i tag è `children`.

> 💡 **Remember**
>
> In React si preferisce la **composizione** (contenitori + `children`) alle gerarchie di ereditarietà: il padre decide cosa mettere dentro, il contenitore decide come mostrarlo.

---

## 💻 Let's Code

### 1. Il componente `Card`
Crea `src/components/Card.jsx`:

```jsx title="src/components/Card.jsx"
function Card({ title, children }) {
  return (
    <section className="card">
      {title && <h2 className="card__title">{title}</h2>}
      <div className="card__body">{children}</div>
    </section>
  );
}

export default Card;
```

**Cosa fa.** Mostra un riquadro con un titolo opzionale e il contenuto passato.

**Perché funziona.** `{children}` viene sostituito con ciò che il padre scrive tra `<Card>` e `</Card>`. `{title && ...}` mostra l'`h2` solo se `title` ha un valore (lo vedremo nel [capitolo 04](./04_Conditional_Rendering.md)).

**Come modificarlo.** Aggiungi una seconda prop `footer` e mostrala sotto il body.

**Errori da evitare.** Dimenticare `{children}` nel JSX del contenitore: il contenuto passato non apparirebbe.

### 2. Stili della card
In `src/index.css` **aggiungi in fondo**:

```css title="src/index.css"
.card {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background-color: #ffffff;
}

.card__title {
  margin: 0 0 0.75rem;
  font-size: 1.125rem;
}

.card__body {
  display: grid;
  gap: 0.75rem;
}
```

Poi **sostituisci** la regola `.transaction-list` esistente con questa, perché bordo e sfondo ora sono forniti dalla `Card`:

```css
.transaction-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
```

### 3. Usare `Card` in `Dashboard`
`src/components/Dashboard.jsx`:

```jsx title="src/components/Dashboard.jsx"
import { accounts, transactions } from "../data/mockData.js";
import BalanceCard from "./BalanceCard.jsx";
import Card from "./Card.jsx";
import AccountCard from "./AccountCard.jsx";
import TransactionList from "./TransactionList.jsx";

function Dashboard() {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <main className="dashboard">
      <BalanceCard total={totalBalance} note="Somma di tutti i tuoi conti" />

      <Card title="I tuoi conti">
        <AccountCard account={accounts[0]} />
        <AccountCard account={accounts[1]} />
      </Card>

      <Card title="Ultimi movimenti">
        <TransactionList transactions={recentTransactions} />
      </Card>
    </main>
  );
}

export default Dashboard;
```

**Cosa fa.** Le due sezioni usano lo stesso contenitore, con contenuti diversi.

**Perché funziona.** Ciò che sta tra `<Card ...>` e `</Card>` diventa `children`. `Card` non conosce `AccountCard` né `TransactionList`: è completamente generica.

**Come modificarlo.** Prova `<Card>` senza `title` (nessun `h2` verrà mostrato) e una `Card` annidata dentro un'altra.

---

## 🏦 LipariBank in action
La dashboard ora è composta da sezioni coerenti e visivamente uniformi. Se in futuro vorrai cambiare l'aspetto di *tutte* le sezioni (padding, ombra, colore), modifichi **un solo file**: `Card.jsx` (e il suo CSS).

La separazione è chiara:

- `Card` = **layout** (come appare il riquadro);
- `AccountCard`, `TransactionList` = **contenuto** (cosa mostrare);
- `Dashboard` = **coordinamento** (quali dati e dove metterli).

---

## 🧪 Your Turn

**Obiettivo:** usare `Card` con contenuti diversi e verificare il comportamento di `children`.

**Requisiti**
1. La sezione "I tuoi conti" e la sezione "Ultimi movimenti" usano `Card` con `title`.
2. Aggiungi una terza `Card` **senza** `title` in fondo alla dashboard con un paragrafo: `Dati fittizi a scopo didattico. Nessuna operazione reale.`
3. Aggiungi una prop `footer` (opzionale) a `Card`: se presente, viene mostrata in un `<p className="card__footer">` sotto il body. Usala nella card dei movimenti con `footer="Mostrati gli ultimi 5 movimenti"`.
4. Aggiungi la regola CSS `.card__footer` (testo piccolo e grigio, margine superiore).

**Passi suggeriti**
- Modifica `Card.jsx` destrutturando anche `footer` e aggiungendo `{footer && <p className="card__footer">{footer}</p>}` dopo il body.
- Passa il `footer` come stringa da `Dashboard`.

**Risultato atteso:** tre riquadri uniformi; il secondo mostra il footer; il terzo non ha titolo.

**Criteri di completamento:** nessun `h2` vuoto nella terza card (controlla con `F12`), nessun errore in console.

> ⚠️ **Prova prima da solo**
>
> La soluzione parziale per `Card` è qui sotto: guardala dopo aver tentato.

### Soluzione di riferimento — `Card` con il footer

```jsx
function Card({ title, footer, children }) {
  return (
    <section className="card">
      {title && <h2 className="card__title">{title}</h2>}
      <div className="card__body">{children}</div>
      {footer && <p className="card__footer">{footer}</p>}
    </section>
  );
}

export default Card;
```

```css
.card__footer {
  margin: 0.75rem 0 0;
  font-size: 0.8rem;
  color: #6b7280;
}
```

---

## ⚠️ Common Mistakes
- **Dimenticare `{children}`** dentro il contenitore: il contenuto non appare.
- **Passare il contenuto come prop `children` esplicita** (`<Card children={...} />`): funziona ma è poco leggibile; scrivi il contenuto tra i tag.
- **Confondere `title` e `children`**: `title` è una prop semplice, `children` è il contenuto annidato.
- **Card troppo "intelligenti"**: se `Card` inizia a importare dati o a conoscere `AccountCard`, perde il suo scopo generico.
- **Bordi doppi**: se vedi un riquadro dentro un riquadro, controlla di aver aggiornato la regola `.transaction-list`.

---

## ✅ Checklist
- ☐ So che cos'è `children` e quando si usa.
- ☐ Ho creato `Card` con `title` e `children`.
- ☐ Ho usato `Card` per conti e movimenti.
- ☐ Ho aggiunto la prop `footer` e il relativo CSS.
- ☐ La terza card senza titolo non mostra un `h2` vuoto.

---

## 🚀 Challenge
Crea una variante: `Card` riceve anche una prop `highlighted` (booleana) che aggiunge la classe `card--highlighted` (bordo colorato). Usala sulla card dei conti senza scrivere `highlighted={true}` ma solo `highlighted`.

---

## 📌 Recap
- `children` è il contenuto scritto tra i tag di un componente.
- Un contenitore come `Card` definisce l'aspetto, il padre il contenuto.
- `children` si combina con altre props (`title`, `footer`).
- Composizione al posto dell'ereditarietà.
- `Card` resta generica: non conosce i dati bancari.

---

### ➡️ Next
Prossimo capitolo: [Conditional Rendering](./04_Conditional_Rendering.md). Abbiamo già usato `title &&` senza spiegarlo: ora impariamo a mostrare o nascondere parti di UI in base ai dati.
