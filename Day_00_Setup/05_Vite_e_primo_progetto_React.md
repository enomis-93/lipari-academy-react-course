# 🏦 LipariBank — React Zero to Hero

> **Day 0 · Capitolo 05**
> **Argomento:** Vite e primo progetto React
> **Durata stimata:** 40 minuti
> **Parte di LipariBank:** creazione del progetto `liparibank/` e prima pagina minima

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- creare un progetto React + JavaScript con Vite e installarne le dipendenze;
- avviare il server di sviluppo e aprire l'app nel browser;
- riconoscere le cartelle e i file principali del progetto;
- ridurre il template alla prima pagina minima di LipariBank e salvarla su GitHub.

---

## 📋 Prerequisiti
- [Capitolo 02](./02_Node_NPM.md): Node.js 22 LTS e npm funzionanti.
- [Capitolo 03](./03_VS_Code.md): VS Code con terminale integrato.
- [Capitolo 04](./04_Git_GitHub.md): Git configurato e repository vuoto `liparibank` creato su GitHub.
- Il terminale è aperto dentro `corso-react/`.

---

## 🧭 In questo capitolo
- cos'è Vite e cosa fa;
- creazione del progetto con `npm create vite@latest`;
- `npm install` e `npm run dev`;
- struttura del progetto generato e script disponibili;
- pulizia del template e prima pagina LipariBank;
- primo commit e push su GitHub.

---

## 🧠 Theory

### Cos'è Vite
**Vite** è lo strumento di sviluppo del progetto: avvia un server locale con aggiornamento istantaneo (*hot reload*), trasforma JSX in JavaScript comprensibile dal browser e produce la versione ottimizzata per la consegna (`npm run build`). **React** è la libreria che disegna l'interfaccia; Vite è l'ambiente che la rende eseguibile.

### Cosa viene generato
Con il template `react` (JavaScript) ottieni un progetto con questa struttura:

```text
liparibank/
├── index.html
├── package.json
├── vite.config.js
├── .oxlintrc.json
├── .gitignore
├── public/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    └── assets/
```

- `index.html`: l'unica pagina HTML; contiene `<div id="root">` dove React disegna l'app;
- `src/main.jsx`: punto d'ingresso, monta `<App />` dentro `#root` in `StrictMode`;
- `src/App.jsx`: il componente principale, il punto da cui costruiremo LipariBank;
- `vite.config.js`: configurazione di Vite (con il plugin React);
- `.oxlintrc.json`: configurazione del linter **oxlint**, usato dal template Vite 8;
- `public/`: file statici serviti così come sono;
- `package.json`: dipendenze e script.

### Script disponibili

| Comando | Cosa fa |
|---|---|
| `npm run dev` | Avvia il server di sviluppo (default `http://localhost:5173/`) |
| `npm run build` | Crea la versione ottimizzata nella cartella `dist/` |
| `npm run preview` | Serve in locale la build già creata |
| `npm run lint` | Esegue il linter oxlint sul codice |

> 💡 **Remember**
>
> I comandi `npm install` e `npm run ...` vanno lanciati **dentro** `liparibank/`, dove c'è `package.json`. Solo il comando di creazione si lancia da `corso-react/`.

---

## 💻 Let's Code

### 1. Creare il progetto
Dentro `corso-react/` esegui:

```bash
npm create vite@latest liparibank -- --template react
```

`liparibank` è il nome della cartella; `--template react` sceglie React con JavaScript (non TypeScript). Se npm chiede di installare `create-vite`, conferma con `y`. Se il programma ti propone di scegliere framework e variante, seleziona **React** e **JavaScript**. Se alla fine chiede "Install with npm and start now?", rispondi **No**: eseguiremo i passaggi a mano per capirli.

Entra nella cartella e aprila in VS Code:

```bash
cd liparibank
```

```bash
code .
```

Dai prossimi passaggi usa il terminale integrato di VS Code, che parte già dentro `liparibank/`.

### 2. Installare le dipendenze
Dentro `liparibank/`:

```bash
npm install
```

npm legge `package.json` e scarica React, Vite e il resto in `node_modules/`. Al termine non devono comparire errori (eventuali avvisi `npm warn` o sulle vulnerabilità del template non bloccano il corso).

### 3. Avviare il server di sviluppo
Dentro `liparibank/`:

```bash
npm run dev
```

Output atteso (la versione varia):

```text
  VITE v8.x.x  ready in ... ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Apri `http://localhost:5173/` nel browser: vedi la pagina di esempio del template. Lascia il server acceso: ogni salvataggio aggiorna la pagina in automatico. Per fermarlo premi `Ctrl+C` nel terminale. Se la porta 5173 è occupata, Vite sceglie la successiva (5174...) e la stampa nel terminale.

Apri un **secondo terminale** (pulsante `+`) per i comandi seguenti, lasciando il server acceso.

### 4. Ridurre il template a LipariBank
Il template contiene un'applicazione di esempio con contatore, loghi e stili che non ci servono. Facciamo pulizia, **in questo ordine** (altrimenti il server segnala un errore perché `App.jsx` importerebbe un file già eliminato).

**a) Sostituisci il contenuto di `src/App.jsx`** con:

```jsx
function App() {
  return (
    <main className="app">
      <h1>LipariBank</h1>
      <p>Benvenuto in LipariBank, la banca fittizia del corso React Zero to Hero.</p>
    </main>
  );
}

export default App;
```

Il file non importa più `App.css` né immagini: è un **Function Component** che restituisce JSX e viene esportato con `export default`.

**b) Sostituisci il contenuto di `src/index.css`** con:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  background-color: #f4f6f8;
  color: #1f2933;
}

.app {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

h1 {
  margin: 0 0 0.5rem;
  color: #0b5cab;
}
```

**c) Elimina `src/App.css` e le risorse inutilizzate in `src/assets/`.** In PowerShell (Windows), da `liparibank/`:

```powershell
Remove-Item src\App.css
```

```powershell
Remove-Item -Recurse src\assets
```

In macOS / Linux, da `liparibank/`:

```bash
rm src/App.css
```

```bash
rm -r src/assets
```

Puoi anche eliminarli dal pannello Explorer di VS Code (tasto destro → Delete). Se in futuro servono immagini ricrei la cartella `src/assets/`.

**d) Controlla `src/main.jsx`.** Non devi modificarlo: deve essere equivalente a questo (virgolette singole o doppie sono indifferenti):

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`createRoot` collega React al `<div id="root">` di `index.html`; `StrictMode` abilita controlli extra durante lo sviluppo; `import "./index.css"` carica il CSS globale.

**e) Imposta il titolo della scheda.** Apri `index.html` e cambia il contenuto del tag `<title>` in `LipariBank`. Il file `public/` con l'icona di Vite può restare: serve ancora come favicon finché non lo sostituisci.

Torna al browser: la pagina mostra il titolo "LipariBank" e il paragrafo, senza il template. Prova a cambiare il testo del paragrafo, salva: la pagina si aggiorna da sola.

### 5. Verificare build e lint
Con il server fermo o in un secondo terminale, dentro `liparibank/`:

```bash
npm run lint
```

```bash
npm run build
```

Il lint non deve riportare errori; la build crea `dist/` (che Git ignora grazie a `.gitignore`).

### 6. Collegare il progetto al tuo repository GitHub
Dentro `liparibank/`, controlla che `.gitignore` contenga `node_modules` e `dist` (lo genera il template), poi:

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Setup iniziale LipariBank"
```

```bash
git branch -M main
```

```bash
git remote add origin <URL_DEL_TUO_REPOSITORY>
```

```bash
git push -u origin main
```

`<URL_DEL_TUO_REPOSITORY>` è l'URL del repository vuoto `liparibank` creato nel capitolo 04 (es. `https://github.com/<TUO_UTENTE>/liparibank.git`). Aggiorna la pagina del repository su GitHub: devono comparire `src/`, `package.json` e gli altri file, ma non `node_modules/`.

---

## 🏦 LipariBank in action
Questo è lo **stato di LipariBank a fine Day 0**:

```text
liparibank/
├── index.html            (titolo: LipariBank)
├── package.json
├── vite.config.js
├── .oxlintrc.json
├── .gitignore
├── public/
└── src/
    ├── main.jsx
    ├── App.jsx           (h1 + paragrafo)
    └── index.css         (CSS minimo)
```

Non ci sono ancora componenti, dati o logica: dal Day 1 partirai da qui per creare `Header`, `BalanceCard` e `RecentTransactions`. Da questo momento tutti i percorsi nei capitoli (es. `src/components/Header.jsx`) sono relativi a `liparibank/`.

---

## 🧪 Your Turn
**Obiettivo:** avere LipariBank funzionante in locale e salvato su GitHub.

**Requisiti:**
1. Crea il progetto `liparibank` con il comando Vite e installa le dipendenze.
2. Avvia `npm run dev` e apri `http://localhost:5173/`.
3. Riduci `src/App.jsx` a un `<h1>` "LipariBank" e a un paragrafo; sostituisci `src/index.css`; elimina `src/App.css` e `src/assets/`.
4. Personalizza: aggiungi al paragrafo il tuo nome come "sviluppatore" e cambia il colore del titolo in `src/index.css`.
5. Esegui `npm run lint` e `npm run build` senza errori.
6. Fai il primo commit e il push su GitHub.

**Suggerimento:** se la pagina è bianca, apri la console del browser (`F12`) e leggi il primo errore: di solito è un import di un file eliminato (`App.css`) rimasto in `App.jsx`.

**Risultato atteso:** nel browser compaiono titolo e paragrafo; il repository GitHub contiene il progetto senza `node_modules/`.

**Criteri di completamento:** `npm run dev` parte, `npm run lint` e `npm run build` finiscono senza errori, il commit è visibile su GitHub.

---

## ⚠️ Common Mistakes
- **Comando nella cartella sbagliata:** `npm install` o `npm run dev` fuori da `liparibank/` danno `ENOENT ... package.json`. Esegui `cd liparibank`.
- **Cartella già esistente:** se `liparibank/` esiste, il comando di creazione chiede cosa fare. Scegli un altro nome o elimina la cartella se è vuota o di prova.
- **Errore sulla versione di Node.js:** Vite 8 richiede Node `^20.19.0 || >=22.12.0`. Aggiorna a Node.js 22 LTS ([capitolo 02](./02_Node_NPM.md)).
- **Errore `Failed to resolve import "./App.css"`:** hai eliminato `App.css` ma `App.jsx` lo importa ancora. Rimuovi la riga `import "./App.css"`.
- **Porta occupata:** se un altro server usa la 5173, Vite sceglie una porta successiva: usa l'URL stampato nel terminale.
- **Pagina bianca:** controlla il terminale di Vite e la console del browser; il messaggio indica file e riga dell'errore.
- **`npm install` fallisce con `EPERM`/`EACCES`:** vedi la sezione permessi del [capitolo 02](./02_Node_NPM.md); sposta il progetto fuori da OneDrive.
- **`git push` rifiutato:** probabilmente il repository remoto non è vuoto (README creato da GitHub). Vedi gli errori del [capitolo 04](./04_Git_GitHub.md).

---

## ✅ Checklist
- ☐ Ho creato `liparibank/` con `npm create vite@latest liparibank -- --template react`.
- ☐ `npm install` termina senza errori.
- ☐ `npm run dev` mostra `Local: http://localhost:5173/` e la pagina si apre.
- ☐ `src/App.jsx` mostra solo titolo e paragrafo, senza import di `App.css`.
- ☐ `src/App.css` e `src/assets/` sono stati eliminati.
- ☐ `npm run lint` e `npm run build` non danno errori.
- ☐ Il primo commit è su GitHub e non contiene `node_modules/`.

---

## 🚀 Challenge
Avvia il server con una porta diversa, cercando nella guida di Vite l'opzione corretta, e verifica l'indirizzo stampato. Poi esegui `npm run build` e `npm run preview`: confronta la pagina servita dalla build con quella del server di sviluppo.

---

## 📌 Recap
- Vite avvia il server di sviluppo e produce la build; React disegna l'interfaccia.
- Il progetto si crea con `npm create vite@latest liparibank -- --template react`, poi `npm install` e `npm run dev` dentro `liparibank/`.
- `main.jsx` monta `<App />` in `StrictMode`; `App.jsx` è il componente da cui parte LipariBank.
- A fine Day 0 il progetto contiene solo una pagina minima e il CSS globale essenziale.
- Il progetto è collegato al tuo repository GitHub con un primo commit.

---

### ➡️ Next
[Capitolo 06 — Come usare i checkpoint](./06_Come_usare_i_checkpoint.md): impari a scaricare e avviare una versione di riferimento del progetto, da usare quando resti bloccato.
