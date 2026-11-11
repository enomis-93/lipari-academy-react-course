# 🏦 LipariBank — React Zero to Hero

> **Day 1 · Capitolo 04**
> **Argomento:** Function Components
> **Durata stimata:** 25 minuti
> **Parte di LipariBank:** creazione dei dati fittizi (`mockData.js`) e del primo componente, `Header`

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- scrivere un Function Component e usarlo come tag JSX;
- esportare e importare componenti (`export default`) e dati (named export);
- spiegare perché un componente deve avere il nome in PascalCase;
- creare il componente `Header` di LipariBank.

---

## 📋 Prerequisiti
- [Day 1 · JSX](./03_JSX.md).
- Cartelle `src/components/`, `src/data/`, `src/utils/` create nel [capitolo 02](./02_Struttura_del_progetto.md).
- Utile: [Extra · ES Modules](../Extra_JavaScript_Essentials/06_ES_Modules.md).

---

## 🧭 In questo capitolo
- Che cos'è un Function Component.
- `export default` e named export, `import`.
- File `src/data/mockData.js` con i dati canonici del corso.
- Componente `Header` e prima composizione in `App`.

---

## 🧠 Theory

### Function Component
Un **Function Component** è una funzione JavaScript che:

1. ha un nome che inizia con la **maiuscola** (PascalCase);
2. restituisce JSX (oppure `null` se non deve mostrare nulla);
3. si usa come tag: `<Header />`.

```jsx
function Greeting() {
  return <p>Benvenuto in LipariBank</p>;
}
```

Si **usa** come `<Greeting />`, non come `Greeting()`. React si occupa di invocare la funzione al momento giusto.

### Un componente per file
Per convenzione ogni componente vive in un file con lo stesso nome (`Header.jsx` contiene `Header`) ed è esportato con `export default`. Chi lo usa lo importa:

```jsx
import Header from "./components/Header.jsx";
```

### Export default vs named export
- **default**: un solo valore per file, importato con un nome a scelta: `import Header from "./Header.jsx"`.
- **named**: più valori per file, importati con le graffe e con il nome esatto: `import { customer } from "../data/mockData.js"`.

Nel corso: **componenti → default**, **dati e funzioni di utilità → named**.

### Componenti puri
Un componente dovrebbe, a parità di input, restituire sempre lo stesso JSX e non modificare variabili esterne mentre viene eseguito. Questo è il motivo per cui `StrictMode` lo richiama due volte in sviluppo: se il risultato cambia, c'è un problema.

> 💡 **Remember**
>
> Maiuscola = componente, minuscola = tag HTML. `<header>` è HTML, `<Header />` è il nostro componente.

---

## 💻 Let's Code

### 1. I dati fittizi
Crea `src/data/mockData.js`. Sono dati inventati: nessun dato reale.

```javascript
export const customer = { id: "cust-001", firstName: "Mario", lastName: "Rossi" };

export const accounts = [
  { id: "acc-001", name: "Conto Corrente", iban: "IT00 0000 0000 0000 0000 0000 000", balance: 4250.75, currency: "EUR" },
  { id: "acc-002", name: "Conto Risparmio", iban: "IT00 0000 0000 0000 0000 0000 001", balance: 12800.0, currency: "EUR" },
];

// amount con segno: > 0 entrata, < 0 uscita
export const transactions = [
  { id: "trx-001", accountId: "acc-001", date: "2026-10-27", description: "Spesa supermercato", amount: -62.4, category: "Alimentari" },
  { id: "trx-002", accountId: "acc-001", date: "2026-10-25", description: "Pagamento utenza luce", amount: -88.9, category: "Utenze" },
  { id: "trx-003", accountId: "acc-001", date: "2026-10-23", description: "Stipendio", amount: 2100.0, category: "Stipendio" },
  { id: "trx-004", accountId: "acc-001", date: "2026-10-20", description: "Abbonamento palestra", amount: -39.9, category: "Svago" },
  { id: "trx-005", accountId: "acc-001", date: "2026-10-18", description: "Rimborso spese", amount: 45.0, category: "Rimborsi" },
  { id: "trx-006", accountId: "acc-001", date: "2026-10-15", description: "Pagamento utenza gas", amount: -54.2, category: "Utenze" },
  { id: "trx-007", accountId: "acc-002", date: "2026-10-10", description: "Accantonamento mensile", amount: 300.0, category: "Risparmio" },
  { id: "trx-008", accountId: "acc-002", date: "2026-10-01", description: "Interessi maturati", amount: 12.5, category: "Interessi" },
];

export const beneficiaries = [
  { id: "ben-001", name: "Giulia Bianchi", iban: "IT00 0000 0000 0000 0000 0000 111" },
  { id: "ben-002", name: "Luca Verdi", iban: "IT00 0000 0000 0000 0000 0000 222" },
  { id: "ben-003", name: "Condominio Lipari (fittizio)", iban: "IT00 0000 0000 0000 0000 0000 333" },
];
```

Il campo `amount` ha il segno: positivo = entrata, negativo = uscita. Useremo questa convenzione in tutto il corso. In questo giorno useremo `customer`, `accounts` e `transactions`; `beneficiaries` servirà dal Day 4.

### 2. Il componente `Header`
Crea `src/components/Header.jsx`:

```jsx
import { customer } from "../data/mockData.js";

function Header() {
  return (
    <header className="header">
      <h1 className="header__brand">LipariBank</h1>
      <p className="header__name">
        Cliente: {customer.firstName} {customer.lastName}
      </p>
    </header>
  );
}

export default Header;
```

**Cosa fa.** Importa l'oggetto `customer` (named export) e lo usa nel JSX con le graffe.

**Perché funziona.** `import { customer } from "../data/mockData.js"` risale di una cartella (`..`) da `components/` a `src/` e poi entra in `data/`. Il componente è una funzione che restituisce JSX ed è esportato come default.

**Come modificarlo.** Prova a stampare solo il nome o a mostrare il `customer.id` in un `<small>`.

**Errori da evitare.** Scrivere `import customer from ...` (senza graffe) per un named export; dimenticare l'estensione `.jsx`/`.js` nel percorso (in questo corso la scriviamo sempre).

### 3. Usare `Header` in `App`
Sostituisci il contenuto di `src/App.jsx`:

```jsx
import Header from "./components/Header.jsx";

function App() {
  return (
    <div className="app">
      <Header />
    </div>
  );
}

export default App;
```

Nel browser compaiono `LipariBank` e `Cliente: Mario Rossi`. Gli stili arriveranno nel [capitolo 06](./06_Esercizio_LipariBank_Dashboard.md); per ora la pagina è semplice.

---

## 🏦 LipariBank in action
Hai già fatto tre cose che si ripeteranno ogni volta:

1. **dati** in `src/data/mockData.js` (named export);
2. **componente** in `src/components/` (default export);
3. **composizione** in `App.jsx` (import + tag JSX).

Tutta l'app sarà costruita con questo schema.

---

## 🧪 Your Turn

**Obiettivo:** creare un secondo componente da solo, seguendo lo schema appena visto.

**Requisiti**
1. Crea `src/components/Footer.jsx` (file di esercizio: non è nella struttura finale, puoi rimuoverlo quando vuoi).
2. Il componente `Footer` restituisce un `<footer className="footer">` con il testo `LipariBank · dati fittizi a scopo didattico`.
3. È esportato con `export default` e importato in `App.jsx`.
4. Nel browser appare **sotto** l'header.

**Passi suggeriti**
- Copia la forma di `Header.jsx` e togli ciò che non serve: nessun import di dati.
- Importa `Footer` in `App.jsx` e aggiungi `<Footer />` dopo `<Header />`.

**Risultato atteso:** nella pagina compaiono header e footer.

**Criteri di completamento:** nessun errore in terminale/console, il file ha il nome `Footer.jsx` e il componente il nome `Footer`.

---

## ⚠️ Common Mistakes
- **Nome del componente minuscolo** (`function header()`): `<header />` viene letto come tag HTML. Usa PascalCase.
- **Dimenticare `export default`**: errore "does not provide an export named default".
- **Chiamare il componente come funzione** (`{Header()}`) invece di usare `<Header />`.
- **Definire un componente dentro un altro componente**: viene ricreato a ogni render e causa comportamenti strani. Definisci sempre i componenti a livello di file.
- **Percorso di import sbagliato**: controlla i `../` contando le cartelle.

---

## ✅ Checklist
- ☐ Ho creato `src/data/mockData.js` con i dati canonici.
- ☐ Ho creato `Header.jsx` ed è visibile in pagina.
- ☐ So distinguere `export default` e named export.
- ☐ Ho creato `Footer.jsx` come esercizio.
- ☐ So perché i componenti iniziano con la maiuscola.

---

## 🚀 Challenge
Aggiungi in `Header.jsx` una seconda riga che mostra l'IBAN del primo conto, importando anche `accounts` da `mockData.js` (`accounts[0].iban`). Quale altra scelta di design permetterebbe di non dipendere dalla posizione `0` nell'array? Ci torneremo nel Day 2.

---

## 📌 Recap
- Un Function Component è una funzione PascalCase che restituisce JSX.
- Si usa come tag (`<Header />`), non come chiamata di funzione.
- Componenti → `export default`; dati/utilità → named export.
- Un componente per file, definito a livello di modulo.
- I dati fittizi di LipariBank vivono in `src/data/mockData.js`.

---

### ➡️ Next
Prossimo capitolo: [Rendering e composizione](./05_Rendering_e_Composizione.md). Con `Header` hai fatto il primo mattone: ora capiamo come React renderizza e come si compongono più componenti, aggiungendo il saldo totale.
