# 🏦 LipariBank — React Zero to Hero

> **Day 6 · Capitolo 04**
> **Argomento:** Navigation e 404
> **Durata stimata:** 40 minuti
> **Parte di LipariBank:** pagina `/transfer` con `useNavigate` dopo il bonifico, link tra pagine e pagina "non trovata" (`*`)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- scegliere tra `Link` e `useNavigate`;
- navigare da codice dopo un'azione (bonifico completato), con `replace` e `state`;
- definire una route `*` che mostra una pagina 404 dentro il layout;
- spostare il form bonifico dalla dashboard alla pagina `/transfer`.

---

## 📋 Prerequisiti
- [Capitolo 03 — Dynamic Routes e useParams](./03_Dynamic_Routes_e_useParams.md): `App.jsx` con state condiviso, `DashboardPage`, `AccountsPage`, `AccountDetailPage`.

---

## 🧭 In questo capitolo
- `Link` per i link, `useNavigate` per la navigazione dopo un'azione.
- `navigate(path)`, `navigate(-1)`, `{ replace: true }`, `{ state }`.
- La route `*` e `NotFoundPage`.
- `TransferPage` e pulizia della dashboard.

---

## 🧠 Theory

### Link o `useNavigate`?
| Caso | Strumento |
| --- | --- |
| L'utente clicca un collegamento ("Vai ai movimenti") | `Link` / `NavLink` |
| Devi cambiare pagina **dopo** un'azione o una condizione (submit riuscito, logout, redirect) | `useNavigate` |

`Link` produce un vero `<a>`: è accessibile da tastiera, mostra l'URL al passaggio del mouse e supporta "apri in nuova scheda". Un `<button onClick={() => navigate(...)}>` che finge di essere un link perde queste caratteristiche: usalo solo quando la navigazione è la **conseguenza** di un'azione.

### `useNavigate`
```jsx
const navigate = useNavigate();

navigate("/transactions");              // vai a un URL
navigate(-1);                           // indietro di una voce nella cronologia
navigate("/transactions", { replace: true }); // sostituisce la voce corrente
navigate("/transactions", { state: { transferCompleted: true } }); // dati extra
```

- `replace: true` non aggiunge una nuova voce alla cronologia: il pulsante Indietro non riporta alla pagina precedente. Utile dopo azioni "da non rifare" (es. un submit).
- `state` trasporta dati temporanei alla pagina successiva (si leggono con `useLocation().state`, vedi capitolo 06). Non sostituisce lo state dell'app: serve a messaggi usa-e-getta.
- `navigate(-1)` esce dall'app se l'utente è arrivato su quella pagina con un link diretto (era la prima voce della cronologia).

### Route `*` (not found)
Il path `*` corrisponde a **qualsiasi** URL non gestito dalle altre route. React Router sceglie la route più specifica, quindi `*` ha la priorità più bassa. Messa **dentro** il layout route, la pagina 404 mantiene intestazione e menu.

> 💡 **Remember**
>
> Un'app con router deve sempre avere una route `*`: ogni URL digitato a mano è un possibile "non trovato".

---

## 💻 Let's Code

### 1. `NotFoundPage`
`src/pages/NotFoundPage.jsx`:

```jsx title="src/pages/NotFoundPage.jsx"
import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <section>
      <h1>Pagina non trovata</h1>
      <p>L'indirizzo richiesto non esiste in LipariBank.</p>
      <Link to="/">Torna alla dashboard</Link>
    </section>
  );
}
```

### 2. `TransferPage` con `useNavigate`
`src/pages/TransferPage.jsx` (il form è quello del Day 4: props `accounts`, `beneficiaries`, `onAddTransfer(transfer)`, con `transfer = { accountId, beneficiaryId, amount, reason }`):

```jsx title="src/pages/TransferPage.jsx"
import { useNavigate } from "react-router";
import { beneficiaries } from "../data/mockData.js";
import TransferForm from "../components/TransferForm.jsx";

export default function TransferPage({ accounts, onAddTransfer }) {
  const navigate = useNavigate();

  function handleAddTransfer(transfer) {
    onAddTransfer(transfer);
    navigate("/transactions", { state: { transferCompleted: true } });
  }

  return (
    <section>
      <h1>Nuovo bonifico</h1>
      <p>Operazione simulata: nessun denaro viene trasferito.</p>
      <TransferForm
        accounts={accounts}
        beneficiaries={beneficiaries}
        onAddTransfer={handleAddTransfer}
      />
    </section>
  );
}
```

Cosa fa: quando il form segnala un bonifico valido, la pagina lo registra nello state condiviso di `App` (`onAddTransfer` è `addTransfer`) e porta l'utente su `/transactions`. Perché funziona: `navigate` viene chiamato in un event handler (il submit), non durante il render. Il messaggio di conferma interno del form non sarà visibile perché la pagina cambia: lo sostituiremo nel capitolo 06 con un messaggio nella pagina Movimenti, usando `state`. Il bonifico compare comunque tra i movimenti, in testa.

### 3. Dashboard senza form
In `src/pages/DashboardPage.jsx` rimuovi:

- gli import `import { beneficiaries } from "../data/mockData.js";` e `import TransferForm from "../components/TransferForm.jsx";`;
- la prop `onAddTransfer` dalla firma della funzione e la funzione `handleAddTransfer`;
- l'intero blocco `<Card title="Nuovo bonifico (simulato)"> ... </Card>` con il `<TransferForm ... />` dentro.

Al suo posto metti un collegamento (aggiungi `import { Link } from "react-router";` in cima):

```jsx
<p>
  <Link to="/transfer">Nuovo bonifico</Link>
</p>
```

La firma diventa:

```jsx
export default function DashboardPage({
  accounts,
  transactions,
  isLoading,
  error,
  onRetry,
  onToggleFavorite,
}) {
```

### 4. Route aggiornate in `App.jsx`
Snippet parziale: sostituisci il blocco `<Routes>...</Routes>` di `App.jsx` con questo (aggiungi l'import di `NotFoundPage`):

```jsx
import NotFoundPage from "./pages/NotFoundPage.jsx";

// dentro il return di App
<Routes>
  <Route element={<AppLayout />}>
    <Route
      index
      element={<DashboardPage accounts={accountsWithBalance} {...dataProps} />}
    />
    <Route
      path="accounts"
      element={<AccountsPage accounts={accountsWithBalance} />}
    />
    <Route
      path="accounts/:accountId"
      element={
        <AccountDetailPage accounts={accountsWithBalance} {...dataProps} />
      }
    />
    <Route path="transactions" element={<TransactionsPage />} />
    <Route
      path="transfer"
      element={
        <TransferPage accounts={accountsWithBalance} onAddTransfer={addTransfer} />
      }
    />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
</Routes>
```

Prova a digitare `http://localhost:5173/pagina-inesistente` e anche `/accounts/acc-001/extra`: in entrambi i casi compare "Pagina non trovata" con il menu ancora visibile.

### 5. Un pulsante "Indietro" (facoltativo)
Nel dettaglio conto, un pulsante che torna alla pagina precedente:

```jsx
// in cima ad AccountDetailPage.jsx: aggiungi useNavigate all'import esistente
import { Link, useNavigate, useParams } from "react-router";

// dentro AccountDetailPage, prima del return
const navigate = useNavigate();

// nel JSX
<button type="button" onClick={() => navigate(-1)}>
  Indietro
</button>
```

Attenzione: se apri direttamente `/accounts/acc-001` in una scheda nuova, `navigate(-1)` esce da LipariBank. Per un "torna ai conti" affidabile preferisci `<Link to="/accounts">`, come fa già la pagina.

Se aggiungi questo codice ad `AccountDetailPage`, ricorda che `useNavigate()` va chiamato **prima** del `return` condizionale del "conto non trovato".

---

## 🏦 LipariBank in action
Flusso utente completo:

1. Dalla Dashboard clicca "Nuovo bonifico" (un `Link`).
2. Compila il form: Conto Corrente, beneficiario "Giulia Bianchi", importo 50, causale "Test".
3. Al submit valido il bonifico entra nello state di `App` e l'app naviga a `/transactions`.
4. Se digiti un URL sbagliato compare la 404 dentro il layout.

Un indirizzo errato non rompe più l'app e il menu resta disponibile per ripartire.

---

## 🧪 Your Turn

**Obiettivo:** completare navigazione programmatica e pagina 404.

**Requisiti:**
1. Crea `NotFoundPage.jsx` e la route `*` **dentro** il layout route.
2. Crea la pagina `/transfer` con `TransferForm` e `useNavigate`: dopo un bonifico valido l'app va a `/transactions`.
3. Rimuovi il form dalla Dashboard e aggiungi un `Link` "Nuovo bonifico" verso `/transfer`.
4. Prova `/qualcosa` e `/accounts/acc-001/extra`: appare la 404 con menu visibile.
5. Dopo un bonifico, torna alla Dashboard: il bonifico è presente nei movimenti del conto di addebito e il saldo è aggiornato.
6. Dopo il submit, premi il pulsante Indietro del browser: osserva dove torni. Poi prova con `{ replace: true }` e confronta.

**Passi suggeriti:** prima la 404 (più semplice), poi `TransferPage`, infine la pulizia della dashboard.

**Risultato atteso:** URL sconosciuti gestiti e bonifico che porta ai movimenti.

**Criteri di completamento:** i 6 punti verificati, nessun errore in console.

---

## ⚠️ Common Mistakes
- **Chiamare `navigate(...)` nel corpo del componente.** Provoca un side effect nel render: usalo in handler o effect.
- **Usare un `button` con `navigate` al posto di `Link` per link normali.**
- **Mettere `path="*"` fuori dal layout.** La 404 perde menu e intestazione.
- **`navigate(-1)` come "torna ai conti".** Dipende dalla cronologia: usa un `Link` a un URL preciso.
- **Hook dopo un `return` anticipato.** Chiama sempre `useNavigate()` e `useParams()` all'inizio.

---

## ✅ Checklist
- ☐ So scegliere tra `Link` e `useNavigate`.
- ☐ `NotFoundPage` e route `*` dentro il layout.
- ☐ `TransferPage` naviga a `/transactions` dopo un bonifico valido.
- ☐ La Dashboard non contiene più il form.
- ☐ Ho provato `replace` e capito cosa cambia.

---

## 🚀 Challenge
Aggiungi nella 404 un suggerimento dinamico: mostra con `useLocation()` il percorso richiesto (`location.pathname`) nel messaggio "Non esiste la pagina: …".

---

## 📌 Recap
- `Link` per collegamenti cliccabili, `useNavigate` per la navigazione come conseguenza di un'azione.
- `navigate` supporta `-1`, `replace` e `state`.
- La route `*` gestisce i percorsi sconosciuti; va dentro il layout per mantenere menu e intestazione.
- Mai chiamare `navigate` durante il render.

---

### ➡️ Next
[Capitolo 05 — Nested Routes](./05_Nested_Routes.md): layout annidati e `AccountsPage` con il dettaglio come route figlia.
