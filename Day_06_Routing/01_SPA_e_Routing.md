# 🏦 LipariBank — React Zero to Hero

> **Day 6 · Capitolo 01**
> **Argomento:** SPA e Routing
> **Durata stimata:** 25 minuti
> **Parte di LipariBank:** progettare la mappa delle pagine dell'app (Dashboard, Conti, Dettaglio conto, Movimenti, Bonifico)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- spiegare cosa significa **routing client-side** in una Single Page Application;
- elencare i limiti di una navigazione "finta" basata solo su `useState`;
- progettare la tabella delle route di LipariBank;
- dichiarare la versione e la modalità di React Router usate nel corso.

---

## 📋 Prerequisiti
- Progetto `liparibank/` a fine Day 5 ([Esercizio API Transactions](../Day_05_Effects_API/06_Esercizio_LipariBank_API_Transactions.md)).
- Conoscenza di `useState` e rendering condizionale.

---

## 🧭 In questo capitolo
- Sito multi-pagina vs SPA.
- Routing client-side e History API (a livello concettuale).
- Versione di React Router usata nel corso.
- Esperimento: navigazione con `useState` e suoi limiti.
- Mappa delle route di LipariBank.

---

## 🧠 Theory

### Multi-pagina vs Single Page Application
In un sito tradizionale ogni link chiede una **nuova pagina HTML al server**: il browser ricarica tutto. In una **SPA** il browser carica `index.html` e il JavaScript **una volta**; poi è l'app a decidere cosa mostrare, senza ricaricare la pagina.

### Routing client-side
Il **routing client-side** collega l'URL a ciò che l'app mostra:

```text
/                → Dashboard
/accounts        → Elenco conti
/accounts/acc-001 → Dettaglio del conto acc-001
/transactions    → Movimenti
/transfer        → Nuovo bonifico
```

Il browser offre la **History API** (`history.pushState` e l'evento `popstate`) per cambiare l'URL senza ricaricare la pagina. Una libreria di routing la usa per te: legge l'URL, sceglie il componente da mostrare e aggiorna l'URL quando l'utente naviga.

Cosa ottieni rispetto a un semplice `useState("dashboard")`:

| Funzione | Con `useState` | Con un router |
| --- | --- | --- |
| URL che cambia | no | sì |
| Pulsanti avanti/indietro del browser | non funzionano come atteso | sì |
| Link condivisibile / preferito (deep link) | no | sì |
| Parametri nell'URL (`/accounts/acc-001`) | no | sì |
| Pagina non trovata | da gestire a mano | route `*` |

### Versione e modalità usate nel corso
- **React Router v7**, in **declarative mode**: `BrowserRouter`, `Routes`, `Route`.
- Pacchetto: `react-router` (versione 7). Gli import vengono **sempre** da `"react-router"`, **non** da `react-router-dom` (che nelle guide più vecchie era il pacchetto per il web).
- Non usiamo il *data router* (`createBrowserRouter`, loader, action): sono fuori scopo; i dati restano gestiti con `useEffect` come nel Day 5.

> 💡 **Remember**
>
> In questo corso un'unica fonte di verità per la navigazione: l'**URL**. Cosa vedi dipende dall'indirizzo, non da uno state `page`.

---

## 💻 Let's Code

### Esperimento: navigazione "finta" con `useState`
Per capire cosa risolve un router, prova **temporaneamente** una navigazione fatta a mano. Modifica `src/App.jsx` (salva prima il tuo file attuale; tornerai indietro tra poco):

```jsx
import { useState } from "react";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div>
      <nav>
        <button type="button" onClick={() => setPage("dashboard")}>
          Dashboard
        </button>
        <button type="button" onClick={() => setPage("transactions")}>
          Movimenti
        </button>
      </nav>

      {page === "dashboard" && <Dashboard />}
      {page === "transactions" && <p>Pagina movimenti (da costruire)</p>}
    </div>
  );
}
```

Avvia `npm run dev` (dentro `liparibank/`) e prova:

1. Clicca su "Movimenti": l'URL nella barra resta `http://localhost:5173/`.
2. Premi il pulsante **Indietro** del browser: esci dall'app invece di tornare alla dashboard.
3. Aggiungi un bonifico nella Dashboard, vai su "Movimenti" e torna: il bonifico è sparito (il componente `Dashboard` è stato smontato e il suo state perso; lo vedremo nel capitolo 03).
4. Ricarica la pagina sulla pagina "Movimenti": torni alla dashboard.

Cosa dimostra: senza router non hai URL, cronologia né deep link. Errore da evitare: costruire un "router fatto in casa" con `useState`: perde le funzionalità base di navigazione.

Ripristina il tuo `App.jsx` precedente (o lascialo così: nel capitolo 02 lo riscriviamo).

### Cosa succede con un ricaricamento sulla pagina `/accounts`
Con un router, l'URL `/accounts` sarà valido. Nel server di sviluppo di Vite (`npm run dev`) aprire direttamente `http://localhost:5173/accounts` o ricaricare funziona: il dev server restituisce `index.html` e il router mostra la pagina giusta. Con un **sito statico in produzione** il server deve essere configurato per restituire `index.html` per tutti i percorsi dell'app (*SPA fallback*): lo vediamo in [Day 9 · Environment e Deploy](../Day_09_Final_Project_Delivery/06_Environment_e_Deploy.md). Per ora lavori in sviluppo e non devi fare nulla.

---

## 🏦 LipariBank in action
Mappa delle pagine che costruiremo in questo Day:

| URL | Pagina (`src/pages/`) | Contenuto |
| --- | --- | --- |
| `/` | `DashboardPage.jsx` | saldo, conti, movimenti con filtri |
| `/accounts` | `AccountsPage.jsx` | elenco dei conti con link al dettaglio |
| `/accounts/:accountId` | `AccountDetailPage.jsx` | dettaglio di un conto e i suoi movimenti |
| `/transactions` | `TransactionsPage.jsx` | tutti i movimenti con filtri |
| `/transfer` | `TransferPage.jsx` | form bonifico simulato |
| `*` | `NotFoundPage.jsx` | pagina non trovata |

Tutte le pagine condividono lo stesso involucro (`src/layouts/AppLayout.jsx`: `Header` + menu di navigazione + contenuto): è il **layout route**.

Struttura finale prevista dei nuovi file:

```text
src/
├── layouts/
│   └── AppLayout.jsx
└── pages/
    ├── DashboardPage.jsx
    ├── AccountsPage.jsx
    ├── AccountDetailPage.jsx
    ├── TransactionsPage.jsx
    ├── TransferPage.jsx
    └── NotFoundPage.jsx
```

---

## 🧪 Your Turn

**Obiettivo:** progettare la navigazione prima di scrivere codice.

**Requisiti:**
1. Esegui l'esperimento con `useState` e annota i quattro limiti osservati.
2. Disegna (su carta o in un file di appunti) la tabella delle route di LipariBank: URL, nome della pagina, quali dati servono (es. `accounts`, `transactions`).
3. Per ogni pagina scrivi se ha bisogno di dati remoti (e quindi di `isLoading`/`error`) o solo di dati locali.
4. Individua quale tra queste pagine usa un **parametro** nell'URL.

**Passi suggeriti:** parti dalla tabella "LipariBank in action" e aggiungi la colonna "Dati necessari".

**Risultato atteso:** una tabella con 6 righe e le dipendenze dai dati.

**Criteri di completamento:** sai dire quale pagina usa un parametro (`/accounts/:accountId`) e quali pagine hanno bisogno di `transactions` (Dashboard, Dettaglio conto, Movimenti; Conti e Bonifico li usano indirettamente, perché i saldi dei conti dipendono dai bonifici simulati).

> Suggerimento: i dati `transactions` servono a più pagine. Dove dovrebbe vivere lo state che li contiene? Ne parliamo nel capitolo 03.

---

## ⚠️ Common Mistakes
- **Usare `<a href>` per navigare in una SPA:** ricarica la pagina e perde lo state (lo vedremo con `Link`).
- **Importare da `react-router-dom`** seguendo guide vecchie: in questo corso si usa `react-router`.
- **Mescolare le modalità** (declarative con `BrowserRouter` e data router con `createBrowserRouter`): scegli una sola modalità.
- **Pensare che il refresh funzioni ovunque:** in produzione serve il fallback a `index.html`.

---

## ✅ Checklist
- ☐ So spiegare cos'è il routing client-side.
- ☐ So elencare almeno tre vantaggi di un router rispetto a `useState`.
- ☐ So che il corso usa React Router v7, declarative mode, import da `"react-router"`.
- ☐ Ho disegnato la tabella delle route di LipariBank.

---

## 🚀 Challenge
Pensa a una pagina che, nell'app definitiva, potrebbe avere due parametri nell'URL (ad esempio un conto e un mese) e scrivi come sarebbe fatto il suo percorso.

---

## 📌 Recap
- Una SPA carica la pagina una volta e cambia contenuto senza ricaricare.
- Il router collega URL e componenti, e porta cronologia e deep link.
- Il corso usa React Router v7 in declarative mode con import da `"react-router"`.
- La navigazione fatta con `useState` perde URL, back/forward e deep link.

---

### ➡️ Next
[Capitolo 02 — React Router](./02_React_Router.md): installazione, `BrowserRouter`, `Routes`, `Route`, `Link` e `NavLink`.
