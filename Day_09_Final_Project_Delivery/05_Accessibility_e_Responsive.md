# 🏦 LipariBank — React Zero to Hero

> **Day 9 · Capitolo 05**
> **Argomento:** Accessibility e responsive
> **Durata stimata:** 60 minuti
> **Parte di LipariBank:** lingua e titolo delle pagine, skip link, saldo nascosto leggibile da uno screen reader, layout per schermi piccoli

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- elencare le regole di base dell'accessibilità e riconoscere quelle che LipariBank rispetta già;
- aggiungere uno *skip link* e un titolo diverso per ogni pagina;
- nascondere un'informazione alla vista senza nasconderla a uno screen reader, e viceversa;
- adattare il layout agli schermi piccoli con una media query;
- verificare l'app da tastiera e a 360 px di larghezza.

---

## 📋 Prerequisiti
- [Capitolo 04 — Refactoring e test manuale](./04_Refactoring_e_Test_Manuale.md): il piano di test, che rieseguirai in parte alla fine.
- Nozioni di base di CSS: selettori di classe, `flex`, `grid`.
- Fase 4 del [piano di lavoro](./02_Architettura_e_Piano.md): lavora sul branch `feature/a11y-responsive`.

---

## 🧭 In questo capitolo
- Che cosa significa accessibilità, in cinque regole.
- Che cosa LipariBank fa già bene.
- Lingua della pagina e skip link.
- Un titolo per ogni pagina: `useDocumentTitle`.
- Il saldo nascosto: `BalanceAmount`.
- Schermi piccoli.
- Come verificare.

---

## 🧠 Theory

### Accessibilità di base
Un'app è accessibile quando può usarla anche chi naviga solo con la tastiera, chi usa uno *screen reader* (un programma che legge la pagina ad alta voce), chi vede poco e chi ha uno schermo piccolo. In un'app bancaria è un requisito, non un abbellimento: nel brief sono NFR-03 e NFR-04.

Cinque regole pratiche:

1. **HTML semantico prima di tutto.** Un `<button>` si raggiunge con `Tab` e si attiva con `Invio` o `Spazio` senza scrivere nulla; un `<div onClick>` no.
2. **Ogni campo ha una `<label>` collegata**, con `htmlFor` uguale all'`id` del campo.
3. **Il focus si vede sempre.** Non togliere l'`outline` senza sostituirlo.
4. **Il colore non è l'unica informazione.** Un'uscita è rossa, ma ha anche il segno meno e l'etichetta "Uscita".
5. **Contrasto sufficiente** tra testo e sfondo: almeno 4,5:1 per il testo normale (livello AA delle linee guida WCAG). Gli strumenti di sviluppo del browser lo misurano.

### Pulsante o link?
| Serve a... | Usa |
|---|---|
| andare a un'altra pagina | `<Link>` o `<NavLink>` (diventano un `<a>`) |
| eseguire un'azione: inviare, mostrare, filtrare | `<button type="button">` o `type="submit"` |

### ARIA: quando l'HTML non basta
Gli attributi `aria-*` e `role` aggiungono informazioni per gli screen reader dove l'HTML da solo non le dà. I più usati in LipariBank:

- `role="alert"`: il testo viene annunciato subito. Per gli errori.
- `role="status"`: il testo viene annunciato alla prima pausa. Per le conferme.
- `aria-pressed`: dice se un pulsante a due stati è attivo.
- `aria-invalid` e `aria-describedby`: segnalano un campo errato e lo collegano al suo messaggio.
- `aria-hidden="true"`: nasconde un elemento **solo** agli screen reader.

> 💡 **Remember**
>
> Un attributo ARIA non ripara un markup sbagliato. Prima la struttura corretta (`label`, `button`, `nav`), poi ARIA solo dove serve.

### Che cosa fa già LipariBank
Molte di queste regole le hai applicate nei giorni scorsi, mentre costruivi l'app:

| Regola | Dove | Da quando |
|---|---|---|
| Campi con `label`, errori collegati con `aria-describedby` | `TransferForm.jsx` | Day 4 |
| Focus sul primo campo errato dopo l'invio | `useTransferForm.js` | Day 4 |
| Errori con `role="alert"`, conferme e caricamento con `role="status"` | `ErrorMessage.jsx`, `LoadingMessage.jsx`, `TransactionsPage.jsx` | Day 4 e 5 |
| Filtri e preferiti con `aria-pressed` | `TransactionFilters.jsx`, `TransactionItem.jsx` | Day 3 |
| Entrate e uscite distinte anche da un'etichetta | `TransactionItem.jsx` | Day 2 |
| Menu dentro `<nav>` con un nome, voce corrente segnalata | `AppLayout.jsx` | Day 6 |
| Focus visibile su pulsanti e menu | `index.css` | Day 1 |

`NavLink` aggiunge da solo `aria-current="page"` al link della pagina corrente: è il modo in cui uno screen reader sa dove ti trovi.

Mancano quattro cose, ed è il lavoro di questo capitolo.

### Responsive
Un layout *responsive* si adatta alla larghezza dello schermo. Lo strumento è la *media query*: un blocco di regole CSS che vale solo sotto (o sopra) una certa larghezza.

Perché funzioni serve una riga in `index.html`, che il modello di Vite contiene già:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Senza, un telefono disegna la pagina come se fosse larga quasi mille pixel e poi la rimpicciolisce.

---

## 💻 Let's Code

### 1. La lingua della pagina
Apri `index.html`, nella cartella principale di `liparibank/`. Il modello di Vite dichiara la pagina in inglese:

```html
<html lang="en">
```

L'interfaccia è in italiano. Correggi:

```html title="index.html"
<html lang="it">
```

Uno screen reader sceglie la pronuncia in base a questo attributo: con `lang="en"` leggerebbe "Movimenti" con l'accento inglese.

### 2. Lo skip link
Chi naviga con la tastiera, a ogni cambio di pagina, deve attraversare con `Tab` l'intestazione e le quattro voci del menu prima di arrivare al contenuto. Uno *skip link* è un link, primo elemento della pagina, che porta direttamente al contenuto. Resta invisibile finché non riceve il focus.

In `src/layouts/AppLayout.jsx` aggiungi il link come primo figlio e dai un `id` a `<main>`:

```jsx title="src/layouts/AppLayout.jsx"
export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Vai al contenuto principale
      </a>

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

      <main id="main-content" className="app-main">
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
```

È un `<a>` e non un `Link` perché non cambia pagina: punta a un elemento della stessa pagina, quello con `id="main-content"`.

In fondo a `src/index.css` aggiungi:

```css title="src/index.css"
.skip-link {
  position: absolute;
  left: -999px;
  top: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: #ffffff;
  color: #0f4c81;
  font-weight: 600;
}

.skip-link:focus {
  left: 0.5rem;
}
```

Il link è fuori dallo schermo, ma esiste: al primo `Tab` riceve il focus e la regola `:focus` lo riporta in vista. Da evitare: nasconderlo con `display: none`, che lo toglierebbe anche dalla navigazione da tastiera.

### 3. Un titolo per ogni pagina
Il titolo del documento è il testo della scheda del browser, ed è la prima cosa che uno screen reader legge quando la pagina cambia. Oggi è sempre "LipariBank", tranne nella dashboard, dove dal Day 5 un `useEffect` lo imposta a mano.

Quell'effetto è la base di un custom hook. Crea `src/hooks/useDocumentTitle.js`:

```javascript title="src/hooks/useDocumentTitle.js"
import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = `${title} · LipariBank`;

    return () => {
      document.title = "LipariBank";
    };
  }, [title]);
}
```

In `src/pages/DashboardPage.jsx` sostituisci l'intero `useEffect` che imposta `document.title` con una riga, e togli `useEffect` dall'import di `react`:

```jsx title="src/pages/DashboardPage.jsx"
useDocumentTitle(selectedAccountName ? `Dashboard: ${selectedAccountName}` : "Dashboard");
```

Aggiungi l'import, qui e in ogni pagina in cui usi l'hook:

```jsx
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
```

Poi chiama l'hook nelle altre pagine, **prima** delle guardie di caricamento ed errore (un hook non può stare dopo un `return`):

| Pagina | Chiamata |
|---|---|
| `AccountsPage.jsx` | `useDocumentTitle("Conti");` |
| `TransactionsPage.jsx` | `useDocumentTitle("Movimenti");` |
| `TransferPage.jsx` | `useDocumentTitle("Bonifico");` |
| `NotFoundPage.jsx` | `useDocumentTitle("Pagina non trovata");` |

`AccountDetailPage` non ha bisogno di una chiamata: è una route annidata dentro `AccountsPage`, che resta montata e imposta già "Conti".

Verifica: passando da una pagina all'altra la scheda del browser mostra "Dashboard: Conto Corrente · LipariBank", "Conti · LipariBank", "Movimenti · LipariBank", e così via.

### 4. Il saldo nascosto
Quando l'utente sceglie "Nascondi saldi", l'app scrive `••••••`. Uno screen reader lo legge come "punto elenco, punto elenco, punto elenco...", oppure non legge nulla. Serve un testo alternativo.

La stessa espressione, `hideBalance ? "••••••" : formatCurrency(...)`, è ripetuta in quattro file. È una duplicazione come quelle del [capitolo 04](./04_Refactoring_e_Test_Manuale.md): prima di correggerla, mettila in un posto solo. Crea `src/components/BalanceAmount.jsx`:

```jsx title="src/components/BalanceAmount.jsx"
import { useSettings } from "../context/SettingsContext.jsx";
import { formatCurrency } from "../utils/formatters.js";

function BalanceAmount({ value }) {
  const { hideBalance } = useSettings();

  if (hideBalance) {
    return (
      <>
        <span aria-hidden="true">••••••</span>
        <span className="visually-hidden">Saldo nascosto</span>
      </>
    );
  }

  return formatCurrency(value);
}

export default BalanceAmount;
```

I due `<span>` sono complementari: il primo si vede ma non viene letto (`aria-hidden`), il secondo viene letto ma non si vede. La classe che lo rende invisibile va aggiunta in fondo a `src/index.css`:

```css title="src/index.css"
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
```

Da evitare: `display: none` o `visibility: hidden`, che nascondono il testo anche agli screen reader.

Ora usa il componente al posto dell'espressione ripetuta. In `src/components/BalanceCard.jsx`:

```jsx title="src/components/BalanceCard.jsx"
import BalanceAmount from "./BalanceAmount.jsx";

function BalanceCard({ total, label = "Saldo totale", note }) {
  return (
    <section className="balance-card">
      <p className="balance-card__label">{label}</p>
      <p className="balance-card__value">
        <BalanceAmount value={total} />
      </p>
      {note && <p className="balance-card__meta">{note}</p>}
    </section>
  );
}

export default BalanceCard;
```

Fai la stessa sostituzione negli altri tre file. In ognuno togli la chiamata a `useSettings()` e gli import di `useSettings` e `formatCurrency`, se non servono più: il linter ti avvisa di quelli rimasti inutilizzati.

| File | Prima | Dopo |
|---|---|---|
| `src/components/AccountCard.jsx` | `{hideBalance ? "••••••" : formatCurrency(account.balance)}` | `<BalanceAmount value={account.balance} />` |
| `src/pages/AccountsPage.jsx` | `<span>{hideBalance ? "••••••" : formatCurrency(account.balance)}</span>` | `<span><BalanceAmount value={account.balance} /></span>` |
| `src/pages/AccountDetailPage.jsx` | `Saldo: {hideBalance ? "••••••" : formatCurrency(account.balance)}` | `Saldo: <BalanceAmount value={account.balance} />` |

`DashboardPage` continua a usare `useSettings()`: le serve `toggleHideBalance` per il pulsante. Il pulsante cambia già il proprio testo tra "Nascondi saldi" e "Mostra saldi", quindi non ha bisogno di `aria-pressed`: sarebbe la stessa informazione detta due volte.

### 5. Schermi piccoli
Il contenitore dell'app ha già una larghezza massima e il layout dei conti passa a una colonna sotto i 640 px. Resta un punto debole: sotto i 480 px, in una riga di movimento, descrizione e importo si contendono lo spazio. Aggiungi in fondo a `src/index.css`:

```css title="src/index.css"
@media (max-width: 480px) {
  .transaction-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .main-nav a,
  .form-field input,
  .form-field select,
  .form-field textarea {
    min-height: 44px;
  }
}
```

Su uno schermo stretto la riga diventa una colonna: prima descrizione e data, sotto etichetta, importo e pulsante. `min-height: 44px` rende voci di menu e campi abbastanza alti da toccarli con un dito senza sbagliare.

Controlla infine il lavoro, dentro `liparibank/`:

```bash
npm run lint
```

---

## 🏦 LipariBank in action

### Verifica da tastiera
Chiudi il mouse in un cassetto e usa solo `Tab`, `Shift+Tab`, `Invio`, `Spazio` e le frecce.

| Controllo | Esito atteso | Esito |
|---|---|---|
| Primo `Tab` dopo aver caricato una pagina | Compare "Vai al contenuto principale"; con `Invio` il `Tab` successivo salta il menu | |
| `Tab` e `Shift+Tab` | L'ordine segue quello visivo; il focus si vede sempre | |
| Menu | Ogni voce si raggiunge e si attiva con `Invio` | |
| Filtri dei movimenti | Si attivano con `Invio` o `Spazio`; il menu del conto si cambia con le frecce | |
| Form del bonifico | Si compila e si invia senza mouse | |
| Invio con errori | Il focus va sul primo campo errato | |
| "Nascondi saldi" | Si attiva da tastiera; il testo del pulsante cambia | |
| Pagina 404 | Il link per tornare alla dashboard si raggiunge con `Tab` | |

### Verifica del titolo e della lingua
Negli strumenti di sviluppo, scheda **Elements**: il tag `<html>` ha `lang="it"`. Passando tra le pagine il titolo della scheda cambia.

Con i saldi nascosti, ispeziona un saldo: trovi i due `<span>`, uno con `aria-hidden="true"` e uno con la classe `visually-hidden` e il testo "Saldo nascosto".

### Verifica a schermo stretto
Negli strumenti di sviluppo attiva la modalità dispositivo (icona del telefono, oppure `Ctrl+Shift+M`) e prova tre larghezze.

| Larghezza | Che cosa controllare | Esito |
|---|---|---|
| 360 px | Nessuna barra di scorrimento orizzontale; il menu va a capo; nei movimenti la riga è in colonna; il form occupa tutta la larghezza | |
| 768 px | Conti e dettaglio affiancati; righe dei movimenti su una linea | |
| 1280 px | Contenuto centrato, con una larghezza massima | |

Prova anche lo zoom del browser al 200%: nessun testo deve sparire o sovrapporsi.

Facoltativo: esegui il controllo di accessibilità integrato nel browser (in Chrome ed Edge, la scheda **Lighthouse**) e leggi le segnalazioni. Trova i problemi più comuni, non tutti: non sostituisce la prova da tastiera.

---

## 🧪 Your Turn

**Obiettivo:** chiudere la Fase 4 del piano di lavoro.

**Requisiti:**
1. `index.html` dichiara `lang="it"`.
2. Lo skip link compare al primo `Tab` e porta al contenuto.
3. Ogni pagina ha il suo titolo; in `DashboardPage` non c'è più un `useEffect` che scrive `document.title`.
4. `hideBalance ? "••••••"` non compare più in nessun file tranne `BalanceAmount.jsx`.
5. A 360 px non c'è scorrimento orizzontale in nessuna pagina.
6. `npm run lint` e `npm run build` senza errori.

**Passi suggeriti:**
1. Segui i cinque passi di "Let's Code" nell'ordine, con un commit per passo.
2. Per il requisito 4 cerca `••••••` in tutto il progetto con la ricerca di VS Code.
3. Compila le tre tabelle di verifica.

**Risultato atteso:** l'app si usa per intero senza mouse e resta leggibile su uno schermo stretto.

**Criteri di completamento:** le tabelle di verifica sono tutte ✅; i casi TC-02, TC-03 e da TC-21 a TC-27 del [piano di test](./04_Refactoring_e_Test_Manuale.md) passano ancora.

---

## ⚠️ Common Mistakes
- **`<div onClick>` al posto di `<button>`**: non si raggiunge con `Tab`.
- **Un link usato come pulsante**, o un pulsante usato per cambiare pagina: scegli con la tabella "Pulsante o link?".
- **Il placeholder al posto della `label`**: sparisce appena scrivi e non identifica il campo.
- **`outline: none`** per ragioni estetiche: chi usa la tastiera non sa più dove si trova.
- **Chiamare `useDocumentTitle` dopo un `return`**: viola le regole degli Hooks.
- **Nascondere con `display: none`** un testo destinato agli screen reader: non verrà letto.
- **`aria-label` ovunque**: ARIA usata male peggiora l'esperienza. Prima l'HTML nativo.
- **Larghezze fisse in pixel** sui contenitori: causano lo scorrimento orizzontale.

---

## ✅ Checklist
- ☐ So elencare le cinque regole di base dell'accessibilità.
- ☐ `index.html` ha `lang="it"` e il meta `viewport`.
- ☐ Lo skip link funziona.
- ☐ Ogni pagina imposta il titolo con `useDocumentTitle`.
- ☐ Il saldo nascosto ha un testo per gli screen reader, in un solo componente.
- ☐ Ho provato l'app con la sola tastiera.
- ☐ Ho provato l'app a 360 px, 768 px e 1280 px.
- ☐ Lint e build passano.

---

## 🚀 Challenge
Dopo un cambio di pagina il focus resta sulla voce di menu premuta. Sposta il focus sul titolo `<h1>` della nuova pagina: ti servono un `ref`, `tabIndex={-1}` sul titolo e un effetto che dipende da `location.pathname`. Verifica con la tastiera che il `Tab` successivo parta dal contenuto.

---

## 📌 Recap
- HTML semantico e `label` collegate sono la base; ARIA si aggiunge solo dove serve.
- `<button>` per le azioni, `<Link>` e `<NavLink>` per la navigazione.
- Lo skip link e il titolo della pagina aiutano chi non vede lo schermo a orientarsi.
- `aria-hidden` nasconde agli screen reader; `.visually-hidden` nasconde alla vista.
- Una duplicazione si corregge meglio dopo averla portata in un solo componente.
- Una media query adatta il layout agli schermi stretti.
- L'accessibilità si verifica usando l'app: tastiera, zoom, larghezze diverse.

---

### ➡️ Next
Prossimo capitolo: [06 · Environment e deploy](./06_Environment_e_Deploy.md). Variabili d'ambiente, build di produzione e pubblicazione statica.
