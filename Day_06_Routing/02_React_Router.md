# 🏦 LipariBank — React Zero to Hero

> **Day 6 · Capitolo 02**
> **Argomento:** React Router
> **Durata stimata:** 40 minuti
> **Parte di LipariBank:** installazione del router, layout comune con menu (`AppLayout`) e prime route (`/`, `/accounts`, `/transactions`, `/transfer`)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- installare React Router v7 e collegarlo con `BrowserRouter` in `main.jsx`;
- definire `Routes` e `Route` e una route indice;
- creare un layout con `NavLink` e `<Outlet />`;
- spiegare la differenza tra `<a>`, `Link` e `NavLink`.

---

## 📋 Prerequisiti
- [Capitolo 01 — SPA e Routing](./01_SPA_e_Routing.md) e la mappa delle route.
- `src/main.jsx` generato da Vite, `src/App.jsx` con `<Header />` e `<Dashboard />`.
- Terminale aperto dentro `liparibank/`.

---

## 🧭 In questo capitolo
- Installazione `react-router@7`.
- `BrowserRouter` in `main.jsx`.
- `Routes`, `Route`, `index`, layout route con `Outlet`.
- `Link` vs `NavLink` (`className` come funzione, `isActive`, `end`).
- Pagine segnaposto in `src/pages/`.

---

## 🧠 Theory

### Versione
Il corso usa **React Router v7 in declarative mode**. Si installa un solo pacchetto, `react-router`, e si importa da lì:

```javascript
import { BrowserRouter, Routes, Route, Link, NavLink, Outlet } from "react-router";
```

### I pezzi fondamentali
| Elemento | Ruolo |
| --- | --- |
| `BrowserRouter` | abilita il routing basato sull'URL del browser; va **una volta**, attorno all'app |
| `Routes` | contenitore delle route: sceglie quella che corrisponde all'URL |
| `Route` | associa un `path` a un `element` (il componente da mostrare) |
| `Link` | link di navigazione interno, **senza** ricaricare la pagina |
| `NavLink` | come `Link`, ma sa se la route è attiva (`isActive`) |
| `Outlet` | segnaposto in un layout dove appare la route figlia corrente |

### Layout route e route indice
Una `Route` **senza `path`** ma con `element` è una **layout route**: avvolge le route figlie, che appaiono dove metti `<Outlet />`. Una route con la prop `index` è quella mostrata quando l'URL coincide con quello del genitore (qui `/`).

### `Link` vs `<a>`
`<a href>` chiede al browser una nuova pagina: ricarica tutto e **perde lo state** React. `Link` intercetta il click e cambia solo l'URL: il router mostra il nuovo componente senza ricaricare.

> 💡 **Remember**
>
> Per navigare dentro l'app usa `Link`/`NavLink`. `<a>` è per link esterni (altri siti).

---

## 💻 Let's Code

### 1. Installazione
Dentro `liparibank/`:

```bash
npm install react-router@7
```

Controlla in `package.json` che sotto `dependencies` compaia `react-router` con una versione `7.x`. Non installare `react-router-dom`.

### 2. `BrowserRouter` in `src/main.jsx`

```jsx title="src/main.jsx"
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

### 3. Layout con menu: `src/layouts/AppLayout.jsx`
Crea la cartella `src/layouts/` e il file. Il layout contiene l'intestazione, il menu e l'`Outlet`:

```jsx
import { NavLink, Outlet } from "react-router";
import Header from "../components/Header.jsx";
import { customer } from "../data/mockData.js";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/accounts", label: "Conti" },
  { to: "/transactions", label: "Movimenti" },
  { to: "/transfer", label: "Bonifico" },
];

function getLinkClassName({ isActive }) {
  return isActive ? "nav-link nav-link-active" : "nav-link";
}

export default function AppLayout() {
  return (
    <div className="app">
      <Header customer={customer} />

      <nav className="main-nav" aria-label="Navigazione principale">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={getLinkClassName}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
```

Punti chiave:

- `className` di `NavLink` può essere una **funzione** che riceve `{ isActive }` e restituisce la stringa di classi.
- `end` sul link `/` evita che "Dashboard" risulti attivo anche su `/accounts` (`/` è prefisso di tutti i percorsi).
- Il tuo `Header` del Day 1 riceve il cliente nella prop `customer`, come qui.
- `className="app"` è la stessa classe che il tuo vecchio `App.jsx` dava al contenitore (larghezza massima e padding): il layout prende il suo posto.
- `NavLink` aggiunge automaticamente `aria-current="page"` al link attivo.

Aggiungi in fondo a `src/index.css`:

```css title="src/index.css"
nav,
.main-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
  padding: 0.4rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.85rem;
  background: #e8eff7;
}

nav a,
.nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 1rem;
  border-radius: 0.6rem;
  color: #123b60;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid transparent;
}

nav a:hover,
.nav-link:hover {
  background: #d3e2f1;
}

nav a.active,
nav a.nav-link-active {
  background: #0f4c81;
  color: #fff;
  box-shadow: 0 2px 6px #0f4c8133;
}
```

### 4. Pagine in `src/pages/`
Crea la cartella `src/pages/`. Per ora la pagina Dashboard **riusa** il componente esistente (soluzione transitoria, la sistemiamo nel capitolo 03):

`src/pages/DashboardPage.jsx`:

```jsx title="src/pages/DashboardPage.jsx"
import Dashboard from "../components/Dashboard.jsx";

export default function DashboardPage() {
  return <Dashboard />;
}
```

Le altre tre sono segnaposto. Finché `DashboardPage` riusa `Dashboard`, nella pagina ci saranno temporaneamente due elementi `<main>` annidati (quello del layout e quello di `Dashboard`): scompare nel capitolo 03, quando `Dashboard` viene sostituito da `DashboardPage`.

`src/pages/AccountsPage.jsx`:

```jsx title="src/pages/AccountsPage.jsx"
export default function AccountsPage() {
  return <h1>Conti</h1>;
}
```

`src/pages/TransactionsPage.jsx`:

```jsx title="src/pages/TransactionsPage.jsx"
export default function TransactionsPage() {
  return <h1>Movimenti</h1>;
}
```

`src/pages/TransferPage.jsx`:

```jsx title="src/pages/TransferPage.jsx"
export default function TransferPage() {
  return <h1>Nuovo bonifico</h1>;
}
```

### 5. Le route in `src/App.jsx`
`App.jsx` non renderizza più direttamente `Header` e `Dashboard`: li gestisce il layout.

```jsx
import { Routes, Route } from "react-router";
import AppLayout from "./layouts/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AccountsPage from "./pages/AccountsPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import TransferPage from "./pages/TransferPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="transfer" element={<TransferPage />} />
      </Route>
    </Routes>
  );
}
```

Cosa fa: per `/` mostra `AppLayout` con `DashboardPage` nell'`Outlet`; per `/accounts` mostra `AppLayout` con `AccountsPage`. Dentro un genitore i `path` figli sono relativi (`"accounts"`, senza `/` iniziale). Verifica con `npm run dev`: clicca sul menu, osserva URL, link attivo evidenziato, pulsante Indietro del browser funzionante.

### 6. `Link` vs `<a>`: prova pratica
Aggiungi in `AccountsPage.jsx`, **temporaneamente**:

```jsx
import { Link } from "react-router";

export default function AccountsPage() {
  return (
    <section>
      <h1>Conti</h1>
      <a href="/transactions">Vai ai movimenti (con a)</a>
      <br />
      <Link to="/transactions">Vai ai movimenti (con Link)</Link>
    </section>
  );
}
```

Apri la scheda Network del browser. Il click sul primo link carica un nuovo documento HTML (ricarica completa); il secondo no. Elimina poi il link `<a>`.

---

## 🏦 LipariBank in action
LipariBank ha ora un'**intelaiatura** multi-pagina: un solo `AppLayout` con intestazione e menu, e quattro URL navigabili. Il menu evidenzia la pagina corrente grazie a `NavLink`.

Limite noto, che risolveremo nel capitolo 03: ogni volta che esci dalla dashboard, `Dashboard` viene smontato; tornando, ricarica i movimenti dal JSON e **i bonifici aggiunti localmente vanno persi**. Succede perché lo state vive dentro il componente della pagina.

---

## 🧪 Your Turn

**Obiettivo:** montare il router e il layout di LipariBank.

**Requisiti:**
1. Esegui `npm install react-router@7` dentro `liparibank/` e verifica `package.json`.
2. Avvolgi `<App />` in `<BrowserRouter>` in `main.jsx` (import da `"react-router"`).
3. Crea `AppLayout.jsx` con `Header`, menu a 4 voci con `NavLink` e `<Outlet />`.
4. Crea le quattro pagine in `src/pages/` e le route in `App.jsx` (con route `index` per `/`).
5. Il link attivo del menu è evidenziato e "Dashboard" **non** è evidenziato su `/accounts`.
6. Verifica con la scheda Network la differenza tra `<a>` e `Link`.

**Passi suggeriti:** procedi nell'ordine dei punti; dopo ogni passo controlla il browser.

**Risultato atteso:** quattro pagine navigabili dal menu con Indietro/Avanti funzionanti.

**Criteri di completamento:** nessun import da `react-router-dom`, nessun errore in console, `<a>` temporaneo rimosso.

---

## ⚠️ Common Mistakes
- **`react-router-dom` nell'import.** Usa `"react-router"`.
- **`BrowserRouter` mancante.** Errore di `Link`/`Routes` usati fuori da un router.
- **Dimenticare `<Outlet />` nel layout.** Le pagine figlie non compaiono.
- **`end` mancante sul link `/`.** "Dashboard" risulta sempre attivo.
- **Path figli con `/` iniziale dentro un genitore** (`path="/accounts"`): funziona se coincide con il percorso assoluto, ma in genitori con `path` crea confusione; preferisci path relativi.
- **Una `Route` fuori da `Routes`.**

---

## ✅ Checklist
- ☐ `react-router@7` installato dentro `liparibank/`.
- ☐ `BrowserRouter` in `main.jsx`.
- ☐ `AppLayout` con `NavLink` e `Outlet`.
- ☐ 4 route funzionanti con route `index`.
- ☐ So la differenza tra `a`, `Link`, `NavLink`.

---

## 🚀 Challenge
Fai in modo che il testo del link attivo mostri anche una freccia "→" davanti. Suggerimento: `NavLink` accetta come `children` anche una funzione che riceve `{ isActive }`.

---

## 📌 Recap
- `react-router@7`, import da `"react-router"`, `BrowserRouter` una sola volta.
- `Routes` + `Route` mappano URL e componenti; `index` è la route predefinita.
- Un layout route usa `<Outlet />` per mostrare la pagina figlia.
- `Link` non ricarica la pagina; `NavLink` indica la route attiva.

---

### ➡️ Next
[Capitolo 03 — Dynamic Routes e useParams](./03_Dynamic_Routes_e_useParams.md): il dettaglio di un conto con `/accounts/:accountId`.
