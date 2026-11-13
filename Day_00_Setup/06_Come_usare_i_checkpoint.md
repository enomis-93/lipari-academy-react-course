# 🏦 LipariBank — React Zero to Hero

> **Day 0 · Capitolo 06**
> **Argomento:** Come usare i checkpoint
> **Durata stimata:** 20 minuti
> **Parte di LipariBank:** nessuna modifica al progetto: impari a ripartire da una versione funzionante di LipariBank e a confrontarla con la tua

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- spiegare a cosa serve un checkpoint e quando conviene usarlo;
- scaricare, estrarre e avviare il checkpoint di un giorno;
- confrontare il tuo codice con quello del checkpoint;
- proseguire da un checkpoint dentro la tua repository, senza perdere il lavoro già fatto.

---

## 📋 Prerequisiti
- Node.js e npm funzionanti: [Node.js e npm](./02_Node_NPM.md).
- VS Code con il comando `code` disponibile nel terminale: [Visual Studio Code](./03_VS_Code.md).
- La tua repository `liparibank` con il primo commit: [Vite e primo progetto React](./05_Vite_e_primo_progetto_React.md).

---

## 🧭 In questo capitolo
- Che cos'è un checkpoint e che cosa contiene.
- Scaricare, estrarre e avviare un checkpoint.
- Confrontare il checkpoint con il tuo progetto.
- Ripartire da un checkpoint nella tua repository.

---

## 🧠 Theory

### Che cos'è un checkpoint
Un **checkpoint** è il progetto LipariBank completo e funzionante **alla fine di un Day**. Contiene esattamente ciò che si ottiene seguendo i capitoli di quel giorno, comprese le soluzioni di riferimento degli esercizi.

Ogni checkpoint è un archivio `.zip` allegato alla sezione del giorno sulla piattaforma del corso:

| Archivio | Stato del progetto |
|---|---|
| `liparibank-day-00.zip` | Progetto Vite ridotto alla pagina minima |
| `liparibank-day-01.zip` | Prima dashboard statica |
| `liparibank-day-02.zip` | Componenti riutilizzabili per conti e movimenti |
| `liparibank-day-03.zip` | Interazioni: selezione del conto, filtri, preferiti |
| `liparibank-day-04.zip` | Form del bonifico simulato con validazione |
| `liparibank-day-05.zip` | Movimenti caricati in modo asincrono |
| `liparibank-day-06.zip` | Applicazione a più pagine con React Router |
| `liparibank-day-07.zip` | Stato condiviso con Context e Redux Toolkit |
| `liparibank-day-08.zip` | Custom hooks, service layer e struttura finale |
| `liparibank-day-09.zip` | Soluzione completa del progetto finale |
| `liparibank-extra-legacy.zip` | Laboratorio del modulo extra React Legacy (progetto di fine Day 6 con la cartella `src/legacy/`) |

L'archivio non contiene `node_modules/`: le dipendenze si installano con `npm install`, come in qualunque progetto scaricato.

### Quando usarlo
- **Sei bloccato** e vuoi ripartire da una base che funziona.
- **Vuoi confrontare** la tua soluzione con quella di riferimento, dopo aver completato un esercizio.
- **Inizi da un giorno intermedio** e ti serve il punto di partenza.

### Quando non usarlo
Prima di aver provato l'esercizio. Il checkpoint mostra *una* soluzione corretta, non l'unica: se la tua funziona e rispetta i requisiti del capitolo, va bene anche se è scritta in modo diverso.

> 💡 **Remember**
>
> Tieni sempre il checkpoint in una cartella **separata** dal tuo progetto. Così puoi avviarlo, leggerlo e confrontarlo senza rischiare di sovrascrivere il tuo lavoro.

---

## 💻 Let's Code

Proviamo con il checkpoint del Day 0, che corrisponde al progetto che hai appena creato.

### 1. Scaricare ed estrarre
Scarica `liparibank-day-00.zip` dalla sezione Day 0 della piattaforma. Poi estrailo in una cartella `checkpoint` dentro `corso-react/`.

In PowerShell (Windows), se l'archivio è nella cartella Download:

```powershell
Expand-Archive -Path $HOME\Downloads\liparibank-day-00.zip -DestinationPath $HOME\corso-react\checkpoint
```

In Terminal (macOS / Linux):

```bash
unzip ~/Downloads/liparibank-day-00.zip -d ~/corso-react/checkpoint
```

Ottieni la cartella `corso-react/checkpoint/liparibank-day-00/`, accanto al tuo `liparibank/`.

### 2. Installare e avviare
Entra nella cartella del checkpoint:

```bash
cd checkpoint/liparibank-day-00
```

Installa le dipendenze:

```bash
npm install
```

Avvia il server di sviluppo:

```bash
npm run dev
```

Apri l'indirizzo mostrato dal terminale. Se il server del tuo progetto è ancora acceso, Vite sceglie da solo la porta successiva (per esempio `http://localhost:5174/`): leggi sempre l'indirizzo stampato.

### 3. Verificare che sia integro
Con il server fermo o in un secondo terminale, dentro la cartella del checkpoint:

```bash
npm run lint
```

```bash
npm run build
```

Entrambi i comandi devono terminare senza errori. Se falliscono su un checkpoint appena estratto, il problema è nell'ambiente (versione di Node.js, installazione interrotta), non nel codice.

### 4. Confrontare con il tuo progetto
VS Code confronta due file affiancati. Dentro `corso-react/`:

```bash
code --diff liparibank/src/App.jsx checkpoint/liparibank-day-00/src/App.jsx
```

A sinistra vedi il tuo file, a destra quello del checkpoint; le righe diverse sono evidenziate. È il modo più rapido per capire perché la tua versione si comporta diversamente.

### 5. Ripartire da un checkpoint nella tua repository
Quando vuoi proseguire dal checkpoint invece che dal tuo codice, lavora su un **branch nuovo**: il tuo lavoro precedente resta al sicuro sul branch di partenza.

Dentro `liparibank/` crea il branch (qui l'esempio per il Day 3):

```bash
git switch -c riparto-dal-day-03
```

Copia dal checkpoint, sovrascrivendo, le cartelle `src/` e `public/` e i file `index.html`, `package.json` e `package-lock.json`. **Non** copiare `node_modules/` (non c'è) e non toccare la cartella nascosta `.git/` del tuo progetto. Poi riallinea le dipendenze:

```bash
npm install
```

Controlla che l'applicazione parta:

```bash
npm run dev
```

Infine salva il nuovo punto di partenza:

```bash
git add .
```

```bash
git commit -m "Riparto dal checkpoint Day 3"
```

**Perché un branch.** Se cambi idea torni al tuo codice con `git switch main`: nulla è andato perso.

**Errori da evitare.** Estrarre l'archivio *dentro* `liparibank/`: ti ritroveresti un progetto dentro l'altro, con due `package.json`.

---

## 🏦 LipariBank in action
Da ora la tua cartella di lavoro ha questa forma:

```text
corso-react/
├── liparibank/                  il TUO progetto (repository Git)
└── checkpoint/
    └── liparibank-day-00/       copia di riferimento, sola lettura
```

Nei capitoli di esercizio troverai la sezione **Repository / Checkpoint**, che indica quale archivio corrisponde alla fine di quel giorno e come verificare il risultato.

---

## 🧪 Your Turn

**Obiettivo:** avviare un checkpoint e usarlo per un confronto.

**Requisiti:**
1. Estrai `liparibank-day-00.zip` in `corso-react/checkpoint/`.
2. Installa le dipendenze e avvia il checkpoint: la pagina mostra il titolo `LipariBank` e il paragrafo di benvenuto.
3. Confronta `src/App.jsx` e `src/index.css` del checkpoint con i tuoi usando `code --diff`.
4. Annota le differenze che trovi. Dovrebbero essere solo le personalizzazioni dell'esercizio precedente (il tuo nome nel paragrafo, il colore del titolo).

**Passi suggeriti:**
1. Segui i passi 1–3 del capitolo.
2. Ferma il server del checkpoint con `Ctrl + C` quando hai finito.

**Risultato atteso:** due cartelle affiancate, `liparibank/` e `checkpoint/liparibank-day-00/`, entrambe avviabili.

**Criteri di completamento:** `npm run lint` e `npm run build` senza errori nel checkpoint; sai indicare ogni riga in cui il tuo progetto differisce.

---

## ⚠️ Common Mistakes
- **Estrarre il checkpoint dentro `liparibank/`.** Usa sempre la cartella separata `checkpoint/`.
- **Avviare senza `npm install`.** L'errore tipico è `'vite' non è riconosciuto come comando`: l'archivio non contiene le dipendenze.
- **Confondere le due finestre del browser.** Con due server accesi controlla la porta nell'indirizzo: una è il tuo progetto, l'altra il checkpoint.
- **Copiare il checkpoint prima di provare l'esercizio.** Impari molto di più da un tentativo sbagliato confrontato con la soluzione.
- **Modificare il checkpoint.** Trattalo come sola lettura: se lo cambi non è più un riferimento affidabile. Nel dubbio, estrailo di nuovo.

---

## ✅ Checklist
- ☐ So che cos'è un checkpoint e dove trovo gli archivi.
- ☐ Ho estratto e avviato il checkpoint del Day 0.
- ☐ Ho confrontato un file con `code --diff`.
- ☐ So come ripartire da un checkpoint usando un branch nuovo.

---

## 🚀 Challenge
Dentro la cartella del checkpoint esegui `npm ls react vite` e fai lo stesso nel tuo progetto. Le versioni coincidono? Se differiscono solo nell'ultima cifra è normale: dipende dal giorno in cui hai creato il progetto.

---

## 📌 Recap
- Un checkpoint è LipariBank funzionante alla fine di un Day, distribuito come archivio `.zip`.
- Va tenuto in una cartella separata e trattato come sola lettura.
- Dopo l'estrazione serve `npm install`; poi `npm run dev`, `npm run lint`, `npm run build`.
- `code --diff` confronta il tuo file con quello di riferimento.
- Per ripartire da un checkpoint si usa un branch nuovo nella propria repository.

---

### ➡️ Next
[Capitolo 07 — Verifica ambiente](./07_Verifica_ambiente.md): un controllo finale, passo per passo, prima di iniziare con React.
