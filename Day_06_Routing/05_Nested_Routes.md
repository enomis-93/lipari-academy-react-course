# 🏦 LipariBank — React Zero to Hero

> **Day 6 · Capitolo 05**
> **Argomento:** Nested Routes
> **Durata stimata:** 35 minuti
> **Parte di LipariBank:** `AccountsPage` come pagina "master" con il dettaglio conto come route figlia (`/accounts` e `/accounts/:accountId`)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- spiegare le **nested routes** e il ruolo di `<Outlet />`;
- trasformare `/accounts/:accountId` in una route figlia di `/accounts`;
- usare una route `index` come contenuto predefinito del genitore;
- leggere l'albero delle route di LipariBank e capire quale layout avvolge cosa.

---

## 📋 Prerequisiti
- [Capitolo 04 — Navigation e 404](./04_Navigation_e_404.md): `App.jsx` con `AppLayout`, route piatte, route `*`.

---

## 🧭 In questo capitolo
- Route annidate: URL gerarchico → componenti gerarchici.
- `Outlet` nel componente genitore.
- Route `index` figlia.
- `NavLink` nella lista dei conti con evidenza della selezione.
- Riepilogo dell'albero di routing.

---

## 🧠 Theory

### Nested routes
Una **route annidata** è una `Route` dichiarata dentro un'altra `Route`. L'URL è gerarchico (`/accounts` → `/accounts/acc-001`) e lo sono anche i componenti:

- il componente del **genitore** resta visibile;
- il componente del **figlio** compare dove il genitore mette `<Outlet />`.

È già quello che fa `AppLayout` (genitore senza `path`, un *layout route*). Qui lo applichiamo a una pagina vera: la lista dei conti resta a sinistra, il dettaglio appare accanto.

### Regole
- Il `path` del figlio è **relativo** a quello del genitore: `path=":accountId"` dentro `path="accounts"` significa `/accounts/:accountId`.
- La route `index` figlia si mostra quando l'URL coincide **esattamente** con quello del genitore (`/accounts`).
- Un genitore senza `<Outlet />` non mostra mai i figli.
- `useParams()` nel figlio legge anche i parametri definiti nei path genitori e nel proprio.

> 💡 **Remember**
>
> Route annidate = layout condiviso + contenuto che cambia. Se due pagine non condividono nulla visivamente, non c'è bisogno di annidarle.

### Layout route con o senza `path`
| Forma | Uso |
| --- | --- |
| `<Route element={<AppLayout />}>` (senza `path`) | layout comune: non aggiunge segmenti all'URL |
| `<Route path="accounts" element={<AccountsPage />}>` | pagina genitore che aggiunge il segmento `accounts` e ospita figli via `Outlet` |
| `<Route path="accounts">` (senza `element`) | raggruppa route con prefisso comune senza layout proprio |

---

## 💻 Let's Code

### 1. Albero delle route in `App.jsx`
Snippet parziale: sostituisci le due route `accounts` e `accounts/:accountId` del `<Routes>` con una sola route annidata.

```jsx
<Route
  path="accounts"
  element={<AccountsPage accounts={accountsWithBalance} />}
>
  <Route
    index
    element={<p className="hint">Seleziona un conto per vederne i dettagli.</p>}
  />
  <Route
    path=":accountId"
    element={
      <AccountDetailPage accounts={accountsWithBalance} {...dataProps} />
    }
  />
</Route>
```

Il resto di `App.jsx` (stato, effect, altre route, route `*`) resta uguale.

### 2. `AccountsPage` con `Outlet`
Sostituisci `src/pages/AccountsPage.jsx`:

```jsx title="src/pages/AccountsPage.jsx"
import { NavLink, Outlet } from "react-router";
import { formatCurrency } from "../utils/formatters.js";

function getLinkClassName({ isActive }) {
  return isActive ? "account-link account-link-active" : "account-link";
}

export default function AccountsPage({ accounts }) {
  return (
    <section>
      <h1>I tuoi conti</h1>

      <div className="accounts-layout">
        <ul className="account-links">
          {accounts.map((account) => (
            <li key={account.id}>
              <NavLink
                to={`/accounts/${account.id}`}
                className={getLinkClassName}
              >
                <strong>{account.name}</strong>
                <span>{formatCurrency(account.balance)}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="account-detail">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
```

Cosa fa: mostra la lista dei conti con il conto selezionato evidenziato (`NavLink`) e, nell'`Outlet`, la route figlia: l'indicazione "Seleziona un conto" su `/accounts`, `AccountDetailPage` su `/accounts/acc-001`. Alternativa: dentro un genitore i link possono essere **relativi** (`to={account.id}`), ma l'URL assoluto è più leggibile per un principiante.

Aggiungi in fondo a `src/index.css`:

```css title="src/index.css"
.accounts-layout {
  display: grid;
  grid-template-columns: minmax(200px, 280px) 1fr;
  gap: 1.5rem;
}

.account-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}

.account-link {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #1e293b;
  text-decoration: none;
}

.account-link-active {
  border-color: #1d4ed8;
  background: #eff6ff;
}

.hint {
  color: #64748b;
}

@media (max-width: 640px) {
  .accounts-layout {
    grid-template-columns: 1fr;
  }
}
```

### 3. Adattare `AccountDetailPage`
La lista dei conti è sempre visibile, quindi il link "← Tutti i conti" non serve più: rimuovilo dal ramo "conto trovato". Nel ramo "non trovato" (`/accounts/xyz`) il link `Torna ai conti` può restare: porta a `/accounts`.

Riga da eliminare dal `return` finale di `src/pages/AccountDetailPage.jsx`:

```jsx title="src/pages/AccountDetailPage.jsx"
<Link to="/accounts">← Tutti i conti</Link>
```

Verifica che `Link` sia ancora importato (serve nel ramo "non trovato"). Poiché `AccountsPage` ha già un `<h1>`, nel ramo "non trovato" cambia anche `<h1>Conto non trovato</h1>` in `<h2>Conto non trovato</h2>`: il titolo principale della pagina ora è quello di `AccountsPage`.

### 4. Prova
Con `npm run dev`:

- `/accounts` → lista + "Seleziona un conto per vederne i dettagli.";
- `/accounts/acc-001` → lista (con "Conto Corrente" evidenziato) + dettaglio;
- `/accounts/acc-002` → dettaglio del Conto Risparmio, lista sempre ferma;
- `/accounts/xyz` → "Conto non trovato" nell'area di dettaglio.

---

## 🏦 LipariBank in action
Albero di routing finale del Day 6:

```text
BrowserRouter
└── App (state condiviso)
    └── Routes
        └── AppLayout (Header + NavLink + Outlet)
            ├── index              → DashboardPage      (/)
            ├── accounts           → AccountsPage       (/accounts)
            │   ├── index          → "Seleziona un conto"
            │   └── :accountId     → AccountDetailPage  (/accounts/:accountId)
            ├── transactions       → TransactionsPage   (/transactions)
            ├── transfer           → TransferPage       (/transfer)
            └── *                  → NotFoundPage
```

Due livelli di `Outlet`: quello di `AppLayout` (pagina corrente) e quello di `AccountsPage` (dettaglio). Lo state resta in `App`, quindi passare tra `/accounts/acc-001` e `/accounts/acc-002` non fa perdere nulla né ricaricare i movimenti.

---

## 🧪 Your Turn

**Obiettivo:** trasformare l'elenco conti in master/detail con nested routes.

**Requisiti:**
1. In `App.jsx` c'è una sola route `accounts` con due figli: `index` e `:accountId`.
2. `AccountsPage` mostra lista (con `NavLink`) e `<Outlet />`.
3. Su `/accounts` appare il messaggio "Seleziona un conto per vederne i dettagli.".
4. Il conto aperto è evidenziato nella lista.
5. Passando da un conto all'altro la lista non si ricarica né sfarfalla.
6. `/accounts/xyz` mostra "Conto non trovato" **dentro** l'area di dettaglio, con la lista ancora visibile.
7. Nel menu principale, "Conti" è attivo sia su `/accounts` sia su `/accounts/acc-001`.

**Passi suggeriti:** modifica prima `App.jsx`, poi `AccountsPage`, infine ripulisci `AccountDetailPage`. Per il punto 7 ragiona su come funziona `end` in `NavLink`: il link "Conti" **non** ha `end`.

**Risultato atteso:** navigazione master/detail funzionante.

**Criteri di completamento:** i 7 punti sono verificati e non ci sono errori in console.

---

## ⚠️ Common Mistakes
- **`<Outlet />` dimenticato nel genitore.** I figli non compaiono.
- **Path figlio assoluto sbagliato** (`path="/:accountId"`): non è più figlio di `/accounts`.
- **Mettere `end` sul NavLink "Conti" del menu.** Non sarebbe più attivo su `/accounts/acc-001`.
- **Duplicare le route** (piatte + annidate) per lo stesso percorso.
- **Annidare tutto "per ordine".** Annida solo quando c'è un layout condiviso.

---

## ✅ Checklist
- ☐ Ho capito cosa fa `<Outlet />`.
- ☐ `accounts` ha figli `index` e `:accountId`.
- ☐ La lista conti evidenzia il conto selezionato.
- ☐ "Conto non trovato" compare nel pannello di dettaglio.
- ☐ So leggere l'albero delle route di LipariBank.

---

## 🚀 Challenge
Aggiungi una route figlia `:accountId/transfer` che mostri un messaggio "Nuovo bonifico dal conto <id>" nello stesso pannello. Dove ti serve un `Outlet` aggiuntivo?

---

## 📌 Recap
- Route annidate: il genitore ospita i figli con `<Outlet />`.
- I path figli sono relativi; la route `index` è il contenuto predefinito del genitore.
- Un layout route senza `path` condivide il layout senza cambiare l'URL.
- Annida solo quando esiste un'interfaccia condivisa.

---

### ➡️ Next
[Capitolo 06 — Esercizio LipariBank: MultiPage](./06_Esercizio_LipariBank_MultiPage.md): completiamo `TransactionsPage`, consolidiamo l'app e chiudiamo il CHECKPOINT 6.
