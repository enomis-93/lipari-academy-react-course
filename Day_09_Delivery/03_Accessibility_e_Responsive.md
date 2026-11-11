# 🏦 LipariBank — React Zero to Hero

> **Day 9 · Capitolo 03**
> **Argomento:** Accessibility e Responsive
> **Durata stimata:** 60 minuti
> **Parte di LipariBank:** layout, menu, card, lista movimenti e form del bonifico accessibili e adattabili a schermi piccoli

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- usare HTML semantico (`header`, `nav`, `main`, `section`, `ul`) e label collegate ai campi;
- scegliere correttamente tra `<button>` e link, e rendere visibile il focus;
- annunciare feedback ed errori con `aria-live` / `role="alert"`;
- scrivere CSS mobile-first con flex, grid e media query, e verificarlo a 360 px, 768 px e desktop.

---

## 📋 Prerequisiti
- [Testing Manuale](./02_Testing_Manuale.md) (sfida finale: uso solo da tastiera).
- Pagine, `AppLayout` e `TransferForm` funzionanti (Day 4 e Day 6).
- Conoscenza base di CSS (`flex`, `grid`, selettori di classe).

---

## 🧭 In questo capitolo
- Accessibilità: principi minimi e regole pratiche.
- Struttura semantica del layout e skip link.
- Form accessibile con errori collegati ai campi.
- Feedback annunciato dagli screen reader.
- Responsive mobile-first con CSS.
- Come verificare tutto.

---

## 🧠 Theory

### Accessibilità di base (A11y)
Accessibilità significa che l'app è utilizzabile anche da chi naviga solo da tastiera, usa uno screen reader, ha problemi di vista o usa uno schermo piccolo. Per un'app bancaria è un requisito, non un extra (NFR-03, NFR-04). Cinque regole pratiche:

1. **HTML semantico prima di ARIA**: un `<button>` è già focalizzabile e attivabile con Invio/Spazio; un `<div onClick>` no.
2. **Ogni campo ha una `<label>`** collegata (`htmlFor` ↔ `id`).
3. **Il focus si vede sempre**: non rimuovere l'`outline` senza sostituirlo.
4. **Il colore non è l'unica informazione**: entrata/uscita hanno anche segno (`+`/`−`) e badge testuale.
5. **Contrasto sufficiente**: testo normale almeno 4.5:1 rispetto allo sfondo (linea guida WCAG AA); verificalo con lo strumento di contrasto dei DevTools.

### Button o link?
| Serve a… | Usa |
|---|---|
| andare a un'altra pagina/URL | `<Link>` / `<NavLink>` (rende un `<a>`) |
| eseguire un'azione (invia, mostra/nascondi, filtra) | `<button type="button">` o `type="submit"` |

### `aria-live`
Quando il contenuto cambia senza ricaricare la pagina (messaggio di conferma, errore di caricamento) uno screen reader non lo sa. Una *live region* lo annuncia:
- `role="status"` / `aria-live="polite"`: annuncio non invasivo (conferme);
- `role="alert"`: annuncio immediato (errori).
La live region deve **esistere già nel DOM** prima che il testo cambi.

### Responsive e mobile-first
Si scrive prima il CSS per lo schermo piccolo (colonna singola) e si **aggiunge** con `@media (min-width: ...)` per schermi più larghi. Strumenti: `flex` per allineamenti monodimensionali, `grid` per griglie di card.

> 💡 **Remember**
>
> Aggiungere attributi ARIA non rende accessibile un markup sbagliato. Prima la struttura corretta (`label`, `button`, `nav`), poi ARIA solo dove serve.

---

## 💻 Let's Code

### 1. Viewport e lingua
`index.html` (nella radice di `liparibank/`) deve contenere, dentro `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Il template Vite lo include già: **verifica che non sia stato rimosso**. Senza, i telefoni mostrano la pagina "ridotta" e le media query non si comportano come previsto.

Lo stesso file generato dichiara `<html lang="en">`: poiché l'interfaccia è in italiano, cambialo in `<html lang="it">`, così gli screen reader usano la pronuncia corretta. Il `<title>` è già `LipariBank`.

### 2. Layout semantico con skip link
`src/layouts/AppLayout.jsx` (snippet completo; adatta il percorso di `Header` se diverso):

```jsx
import { NavLink, Outlet } from "react-router";
import Header from "../components/Header.jsx";

function AppLayout() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Vai al contenuto principale
      </a>
      <Header />
      <nav aria-label="Navigazione principale">
        <ul className="nav-list">
          <li><NavLink to="/" end>Dashboard</NavLink></li>
          <li><NavLink to="/accounts">Conti</NavLink></li>
          <li><NavLink to="/transactions">Movimenti</NavLink></li>
          <li><NavLink to="/transfer">Bonifico</NavLink></li>
        </ul>
      </nav>
      <main id="main-content" className="page">
        <Outlet />
      </main>
    </>
  );
}

export default AppLayout;
```

Cosa fa: `<nav>` con etichetta e lista, `<main>` unico, skip link per saltare il menu da tastiera. Perché funziona: `NavLink` aggiunge da solo `aria-current="page"` al link attivo (e la classe `active`, se non usi la prop `className` come nel tuo `AppLayout` del Day 6); `end` evita che `/` risulti attivo su ogni pagina. Da evitare: più `<main>` nella pagina; `<div>` cliccabili al posto dei link.

### 3. Titolo di pagina (opzionale)
Nuovo file opzionale `src/hooks/useDocumentTitle.js`: aiuta chi usa uno screen reader a capire dove si trova.

```javascript
import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = `${title} · LipariBank`;
  }, [title]);
}
```

Uso in una pagina (snippet parziale):

```jsx
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

function TransactionsPage() {
  useDocumentTitle("Movimenti");
  // ...resto della pagina
}
```

### 4. Form accessibile
In `src/components/TransferForm.jsx`. Snippet **parziale** (un campo + feedback); `values`, `errors`, `handleChange`, `successMessage` sono quelli del tuo `useTransferForm`:

```jsx
<div className="form-field">
  <label htmlFor="amount">Importo (EUR)</label>
  <input
    id="amount"
    name="amount"
    type="number"
    inputMode="decimal"
    step="0.01"
    min="0"
    value={values.amount}
    onChange={handleChange}
    aria-invalid={Boolean(errors.amount)}
    aria-describedby={errors.amount ? "amount-error" : undefined}
  />
  {errors.amount && (
    <p id="amount-error" className="field-error">
      {errors.amount}
    </p>
  )}
</div>

<div role="status" aria-live="polite">
  {successMessage && <p className="form-success">{successMessage}</p>}
</div>
```

Cosa fa: `label` ↔ `id` fa leggere il nome del campo; `aria-invalid` segnala l'errore; `aria-describedby` collega il messaggio al campo, così viene letto insieme. Il `div role="status"` è sempre presente e il testo vi compare dentro, quindi viene annunciato. Ripeti lo stesso schema per `select` (conto, beneficiario) e `textarea` (causale). Il pulsante di invio è `<button type="submit">Invia bonifico</button>`.

Al submit con errori, sposta il focus sul primo campo errato (facoltativo, ottimo per tastiera). Per il blocco di errore globale (es. caricamento fallito) assicurati che `ErrorMessage` abbia `role="alert"`:

```jsx
function ErrorMessage({ message }) {
  return (
    <div className="error-message" role="alert">
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;
```

### 5. Entrate/uscite non solo a colori e saldo nascosto
Snippet parziale per `TransactionItem.jsx`:

```jsx
const isIncome = transaction.amount > 0;

<span className={isIncome ? "amount amount--income" : "amount amount--expense"}>
  {isIncome ? "+" : ""}{formatCurrency(transaction.amount)}
</span>
<span className="badge">{isIncome ? "Entrata" : "Uscita"}</span>
```

Per il saldo nascosto, evita che lo screen reader legga "punto punto punto":

```jsx
<span aria-hidden="true">••••</span>
<span className="visually-hidden">Saldo nascosto</span>
```

Il pulsante mostra/nascondi cambia già il proprio testo ("Mostra saldo"/"Nascondi saldo"): non aggiungere anche `aria-pressed`, per non duplicare l'informazione.

### 6. CSS mobile-first
`src/index.css` — aggiungi (adatta ai nomi di classe del tuo progetto; snippet di esempio, non sostituisce il tuo CSS esistente):

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  line-height: 1.5;
  color: #1f2937;
  background: #f3f4f6;
}

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

.skip-link {
  position: absolute;
  left: -999px;
  top: 0;
  padding: 0.75rem 1rem;
  background: #ffffff;
}

.skip-link:focus {
  left: 1rem;
}

:focus-visible {
  outline: 3px solid #1d4ed8;
  outline-offset: 2px;
}

.page {
  max-width: 72rem;
  margin: 0 auto;
  padding: 1rem;
}

.nav-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0.5rem 1rem;
  list-style: none;
}

.nav-list a {
  display: inline-block;
  padding: 0.75rem 1rem;
  min-height: 44px;
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.transaction-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.25rem 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.form-field input,
.form-field select,
.form-field textarea,
button {
  font: inherit;
  min-height: 44px;
}

.amount--income {
  color: #166534;
}

.amount--expense,
.field-error {
  color: #b91c1c;
}

@media (min-width: 48rem) {
  .page {
    padding: 2rem;
  }

  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 64rem) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

Perché funziona: senza media query vale la regola mobile (una colonna); da 768 px (`48rem` con font base 16 px) due colonne; da 1024 px tre. `min-height: 44px` rende bersagli touch comodi. `:focus-visible` mostra il focus a chi usa la tastiera. Da evitare: `outline: none` globale; larghezze fisse in `px` per i contenitori; testo sotto ~16 px sui form (su alcuni telefoni causa zoom automatico).

---

## 🏦 LipariBank in action

### Verifica responsive
Nei DevTools attiva la modalità dispositivo (barra "Toggle device toolbar") e prova tre larghezze:

| Larghezza | Cosa controllare |
|---|---|
| 360 px | nessuno scroll orizzontale; menu che va a capo; card in colonna; righe movimento leggibili; form a tutta larghezza |
| 768 px | card su due colonne; spaziature maggiori |
| ≥ 1280 px | contenuto centrato con larghezza massima; tre colonne dove previsto |

Prova anche zoom al 200 % del browser: nessun contenuto deve sparire o sovrapporsi.

### Verifica accessibilità da tastiera

| Controllo | Esito atteso |
|---|---|
| Primo `Tab` su ogni pagina | compare lo skip link e porta al contenuto |
| `Tab` / `Shift+Tab` | ordine logico; il focus è sempre visibile |
| Menu | voci raggiungibili e attivabili con `Invio` |
| Form | si compila e si invia solo con tastiera; select cambiabili con le frecce |
| Errori di validazione | il testo errore è accanto al campo, collegato con `aria-describedby` |
| Conferma bonifico | il messaggio compare dentro la live region |
| Caricamento fallito | `ErrorMessage` con `role="alert"` |
| Pagina 404 | ha un titolo e un link di ritorno |

Facoltativo: esegui l'audit di accessibilità integrato nel browser (per esempio la scheda Lighthouse dei DevTools) e leggi le segnalazioni; usalo come aiuto, non come garanzia di accessibilità completa.

---

## 🧪 Your Turn

**Obiettivo:** portare LipariBank a un livello di accessibilità e responsive "di base" verificabile.

**Requisiti**
1. `AppLayout` usa `header`/`nav`/`main`, skip link e `NavLink` con `end` sulla Dashboard.
2. Tutti i campi di `TransferForm` hanno `label` ↔ `id`, `aria-invalid` e `aria-describedby` per gli errori.
3. Il messaggio di conferma sta in una live region sempre presente; `ErrorMessage` ha `role="alert"`.
4. Entrate/uscite sono distinguibili anche senza colore.
5. Il focus è visibile in ogni controllo; nessun `outline: none` senza alternativa.
6. Il layout non ha scroll orizzontale a 360 px; ha due colonne a 768 px.
7. Ogni pagina imposta un titolo di documento (`useDocumentTitle` o equivalente).

**Passi suggeriti**
- Parti dal layout, poi dal form, poi dal CSS.
- Usa la ricerca di VS Code per `outline: none`, `onClick` su `div` o `span`, `<input` senza `id`.
- Dopo ogni gruppo di modifiche, ripeti i controlli delle tabelle sopra.

**Risultato atteso:** uso completo dell'app da sola tastiera; layout fluido da 360 px al desktop.

**Criteri di completamento:** le due tabelle di verifica sono tutte ✅; `npm run lint` passa; nessun requisito funzionale è regredito (riesegui TC-18…TC-28 del [Testing Manuale](./02_Testing_Manuale.md)).

---

## ⚠️ Common Mistakes
- **`<div onClick>` al posto di `<button>`**: non è raggiungibile con Tab. Usa l'elemento nativo.
- **Link usato come pulsante** (`<a href="#" onClick>`) o pulsante usato per navigare: scegli secondo la tabella button/link.
- **Placeholder al posto della label**: sparisce quando scrivi e non è affidabile per lo screen reader.
- **Rimuovere l'outline** per "estetica".
- **Live region creata insieme al messaggio**: spesso non viene annunciata; il contenitore deve esistere prima.
- **Solo desktop-first**: partire dal grande e "ridurre" porta a override continui. Parti dal piccolo.
- **Larghezze fisse** (`width: 800px`): causano scroll orizzontale su mobile.
- **`aria-label` ovunque**: l'ARIA sbagliata peggiora l'esperienza; usa prima l'HTML nativo.

---

## ✅ Checklist
- ☐ `<meta name="viewport">` presente in `index.html` e `<html lang="it">`.
- ☐ `nav`, `main` e skip link nel layout.
- ☐ Ogni input/select/textarea ha una `label` collegata.
- ☐ Errori collegati ai campi con `aria-describedby`.
- ☐ Conferme in live region, errori con `role="alert"`.
- ☐ Entrate/uscite non solo a colori.
- ☐ Focus visibile ovunque.
- ☐ Layout verificato a 360 px, 768 px, desktop.
- ☐ App usabile con la sola tastiera.

---

## 🚀 Challenge
Aggiungi `@media (prefers-reduced-motion: reduce)` per disattivare le animazioni (per esempio dello spinner di caricamento, se ne hai una) e prova a trasformare la lista movimenti, su schermi ≥ 768 px, in una tabella semantica `<table>` con `<th scope="col">`.

---

## 📌 Recap
- HTML semantico e label collegate sono la base dell'accessibilità.
- `<button>` per azioni, `<Link>`/`<NavLink>` per navigazione.
- Feedback in `aria-live`/`role="status"`, errori critici in `role="alert"`.
- CSS mobile-first: regole base per lo schermo piccolo, media query `min-width` per ampliare.
- Si verifica a mano: tastiera, zoom, tre larghezze.

---

### ➡️ Next
Prossimo capitolo: [Environment e Deploy](./04_Environment_e_Deploy.md) — con l'app rifinita, prepariamo variabili d'ambiente, build di produzione e deploy statico.
