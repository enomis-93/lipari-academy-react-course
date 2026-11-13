# 🏦 LipariBank — React Zero to Hero

> **Day 1 · Capitolo 02**
> **Argomento:** Struttura del progetto
> **Durata stimata:** 20 minuti
> **Parte di LipariBank:** esplorazione del progetto `liparibank/` e preparazione delle cartelle in cui nasceranno i componenti

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- descrivere il ruolo dei file principali di un progetto Vite + React;
- spiegare come `index.html` e `src/main.jsx` avviano l'applicazione;
- eseguire gli script `dev`, `build`, `lint` e `preview`;
- creare le cartelle `src/components/`, `src/data/` e `src/utils/` usate da LipariBank.

---

## 📋 Prerequisiti
- [Day 1 · React e LipariBank](./01_React_e_LipariBank.md).
- Progetto `liparibank/` funzionante (Day 0).

---

## 🧭 In questo capitolo
- Mappa dei file generati da Vite.
- Come parte l'applicazione: `index.html` → `main.jsx` → `App.jsx`.
- Gli script di `package.json`.
- Convenzioni sulle cartelle di LipariBank.

---

## 🧠 Theory

### La struttura generata da Vite
Dopo `npm create vite@latest liparibank -- --template react` trovi (i dettagli possono variare leggermente con la versione di riferimento del template):

```text
liparibank/
├── index.html
├── package.json
├── vite.config.js
├── .oxlintrc.json
├── public/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    └── assets/
```

| Elemento | Ruolo |
| --- | --- |
| `index.html` | Unica pagina HTML della SPA. Contiene `<div id="root"></div>` e il tag `<script type="module" src="/src/main.jsx">`. |
| `package.json` | Nome del progetto, dipendenze (`react`, `react-dom`, Vite…) e script. |
| `vite.config.js` | Configurazione di Vite; contiene il plugin `@vitejs/plugin-react`. |
| `.oxlintrc.json` | Regole di lint per **oxlint**, il linter del template Vite 8. |
| `public/` | File statici copiati così come sono (icone, in futuro JSON di esempio). Si referenziano con percorso assoluto, es. `/favicon.svg`. |
| `src/main.jsx` | Punto di ingresso: monta React dentro `#root`. |
| `src/App.jsx` | Componente radice della nostra interfaccia. |
| `src/index.css` | Stili globali. |
| `src/assets/` | Immagini e risorse importate dal codice. |

### Come parte l'applicazione
Il browser carica `index.html`, che esegue `src/main.jsx`. Questo file crea la **root** di React e vi renderizza `<App />`.

### `package.json` e gli script
Nella sezione `scripts` trovi (indicativo, controlla il tuo file):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  }
}
```

| Comando | Cosa fa |
| --- | --- |
| `npm run dev` | Avvia il server di sviluppo con HMR. |
| `npm run build` | Produce la versione ottimizzata nella cartella `dist/`. |
| `npm run lint` | Analizza il codice con oxlint e segnala problemi. |
| `npm run preview` | Serve localmente la build di produzione per provarla. |

> 💡 **Remember**
>
> `dev` serve per sviluppare, `build` + `preview` per verificare il risultato "di produzione". Per ora useremo quasi solo `dev` e `lint`.

---

## 💻 Let's Code

### 1. Leggere `src/main.jsx`
Apri `src/main.jsx`. Il contenuto è simile a questo:

```jsx title="src/main.jsx"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- `createRoot(...)` collega React al `div#root` di `index.html`.
- `.render(...)` disegna l'albero di componenti.
- `StrictMode` è un componente di aiuto: **solo in sviluppo** esegue controlli aggiuntivi (ad esempio richiama alcune funzioni due volte per scovare impurità). Non produce nulla di visibile e non incide sulla build di produzione. Lascialo.
- `import './index.css'` carica gli stili globali.

### 2. Cambiare il titolo della scheda
Apri `index.html` e cerca il tag `<title>`. Sostituisci il testo con `LipariBank`:

```html title="index.html"
<title>LipariBank</title>
```

Salva: il titolo della scheda del browser cambia.

### 3. Eseguire lint e build
Dentro `liparibank/`:

```bash
npm run lint
```

Se non ci sono problemi il comando termina senza errori. Poi:

```bash
npm run build
```

Compare la cartella `dist/` con i file ottimizzati. Provala in locale:

```bash
npm run preview
```

Apri l'indirizzo indicato dal terminale e interrompi il server con `Ctrl+C` quando hai finito.

### 4. Creare le cartelle di LipariBank
Dentro `liparibank/` crea:

```bash
mkdir src/components
```

```bash
mkdir src/data
```

```bash
mkdir src/utils
```

Un comando per cartella funziona identico in PowerShell, cmd, macOS e Linux (in Windows PowerShell `mkdir` non accetta più percorsi nello stesso comando). In alternativa crea le cartelle dal pannello *Explorer* di VS Code (tasto destro su `src` → *New Folder*).

**Perché queste cartelle.** Tenere i componenti in `src/components/`, i dati in `src/data/` e le funzioni di utilità in `src/utils/` evita un `src/` caotico. Altre cartelle (`pages`, `services`, `hooks`...) nasceranno nei giorni successivi, quando servono.

**Errori da evitare.** Lanciare i comandi `npm run ...` fuori da `liparibank/` produce l'errore "Missing script" o "could not read package.json".

---

## 🏦 LipariBank in action
Da questo momento tutti i percorsi del corso sono relativi a `liparibank/`. Per esempio `src/components/Header.jsx` significa `liparibank/src/components/Header.jsx`.

La struttura che stiamo preparando per fine Day 1 è:

```text
src/
├── main.jsx
├── App.jsx
├── index.css
├── components/
│   ├── Header.jsx
│   ├── BalanceCard.jsx
│   ├── TransactionItem.jsx
│   └── RecentTransactions.jsx
├── data/
│   └── mockData.js
└── utils/
    └── formatters.js
```

---

## 🧪 Your Turn

**Obiettivo:** conoscere il progetto abbastanza da ritrovare ogni file senza esitazioni.

**Requisiti**
1. Il titolo della scheda del browser è `LipariBank`.
2. Esistono le cartelle `src/components/`, `src/data/` e `src/utils/`.
3. `npm run lint` e `npm run build` terminano senza errori.
4. Sai rispondere per iscritto (anche in un file note personale) a queste domande: quale file contiene `<div id="root">`? Quale file crea la root di React? Quale comando produce `dist/`?

**Passi suggeriti:** segui la sezione *Let's Code*; per le domande rileggi la tabella dei file.

**Risultato atteso:** progetto invariato nel comportamento, con titolo cambiato e tre cartelle vuote pronte.

**Criteri di completamento:** tutti e quattro i requisiti verificati.

---

## ⚠️ Common Mistakes
- **Modificare `dist/`**: è generata da `build`, ogni build la sovrascrive. Non va modificata a mano.
- **Mettere un file in `public/` e importarlo con percorso relativo**: i file di `public/` si usano con percorso assoluto (`/nome-file`); le risorse in `src/assets/` si importano.
- **Confondere `main.jsx` con `App.jsx`**: `main.jsx` avvia l'app (non lo modificheremo quasi mai), `App.jsx` descrive la UI.
- **Cercare `eslint.config.js`**: il template usato in questo corso utilizza oxlint (`.oxlintrc.json`).

---

## ✅ Checklist
- ☐ Ho letto `index.html` e `src/main.jsx`.
- ☐ So dire a cosa serve `StrictMode`.
- ☐ Ho eseguito `npm run lint`, `npm run build` e `npm run preview`.
- ☐ Ho creato `src/components/`, `src/data/` e `src/utils/`.
- ☐ Il titolo della scheda è `LipariBank`.

---

## 🚀 Challenge
Apri `package.json` e trova le versioni di `react` e `react-dom`: devono essere entrambe 19.x. Poi apri `vite.config.js` e individua dove viene usato il plugin React. Annota cosa pensi faccia, lo confronterai con la documentazione di Vite.

---

## 📌 Recap
- `index.html` contiene il `div#root`; `src/main.jsx` monta `<App />` con `createRoot`.
- `StrictMode` aggiunge controlli solo in sviluppo.
- Script principali: `dev`, `build`, `lint`, `preview`.
- Il lint del template è **oxlint** (`.oxlintrc.json`).
- LipariBank organizza il codice in `components/`, `data/` e `utils/`.

---

### ➡️ Next
Prossimo capitolo: [JSX](./03_JSX.md). Ora sai dove scrivere il codice: vediamo la sintassi con cui si descrive la UI dentro i componenti.
