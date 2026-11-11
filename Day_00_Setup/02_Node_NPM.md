# 🏦 LipariBank — React Zero to Hero

> **Day 0 · Capitolo 02**
> **Argomento:** Node.js e npm
> **Durata stimata:** 30 minuti
> **Parte di LipariBank:** nessun codice: prepari il motore che eseguirà gli strumenti di sviluppo di LipariBank

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- spiegare a cosa servono Node.js e npm in un progetto React;
- installare Node.js 22 LTS e verificare le versioni con il terminale;
- usare i comandi npm principali (`install`, `run`, `ls`, `npx`);
- risolvere i problemi più comuni (PATH, execution policy di PowerShell, permessi).

---

## 📋 Prerequisiti
- Aver letto [l'introduzione al corso](./01_Introduzione_al_corso.md) e creato la cartella `corso-react`.
- Un computer su cui puoi installare programmi.

---

## 🧭 In questo capitolo
- Node.js, npm e npx: che cosa sono;
- quale versione installare e perché;
- installazione su Windows, macOS e Linux (e `nvm` come alternativa);
- verifica delle versioni;
- comandi npm principali;
- troubleshooting.

---

## 🧠 Theory

### Perché serve Node.js se React gira nel browser?
Il codice React finale gira nel browser, ma durante lo sviluppo servono strumenti che girano sul tuo computer: il server di sviluppo, il compilatore JSX, il bundler, il linter. Questi strumenti (Vite, oxlint...) sono programmi JavaScript e hanno bisogno di **Node.js** per essere eseguiti fuori dal browser.

- **Node.js**: runtime che esegue JavaScript sul computer.
- **npm** (Node Package Manager): installato insieme a Node.js, scarica le librerie (React, Vite...) e le registra nel file `package.json`.
- **npx**: esegue un pacchetto senza installarlo globalmente. Lo usa indirettamente anche `npm create`.

### Quale versione scegliere
Scegli una versione **LTS** (Long Term Support): è la linea stabile, pensata per essere usata a lungo. Il corso è verificato con **Node.js 22 LTS**. Vite 8 richiede Node `^20.19.0 || >=22.12.0`, quindi qualsiasi versione 22.12 o successiva è accettabile; le versioni dispari o "Current" non sono consigliate.

> 💡 **Remember**
>
> Usa Node.js 22 LTS. Se hai già Node.js installato, controlla la versione: una versione troppo vecchia (per esempio 18) fa fallire Vite con un errore esplicito.

### Cos'è `package.json`
È il file che descrive un progetto: nome, script (`dev`, `build`...) e dipendenze. `npm install` legge `package.json` e scarica le librerie nella cartella `node_modules/`, che non va mai committata su Git né modificata a mano.

---

## 💻 Let's Code

### 1. Installare Node.js
**Windows:** scarica l'installer dalla pagina ufficiale `https://nodejs.org`, scegli la versione **22 LTS** (file `.msi`), esegui l'installer lasciando le opzioni predefinite (compresa "Add to PATH"). Se Node.js era già installato, l'installer aggiorna la versione.

**macOS:** scarica il pacchetto `.pkg` della versione 22 LTS da `https://nodejs.org`, oppure con Homebrew:

```bash
brew install node@22
```

Con Homebrew, `node@22` può richiedere di aggiungere la cartella `bin` al PATH: segui le istruzioni che `brew` stampa al termine.

**Linux:** i pacchetti della distribuzione possono avere versioni vecchie. Il metodo consigliato è `nvm` (vedi sotto) oppure le istruzioni ufficiali per la tua distribuzione su `https://nodejs.org`.

Dopo l'installazione **chiudi e riapri il terminale**: il PATH viene letto solo all'avvio.

### 2. Verificare le versioni
Apri un terminale (PowerShell su Windows, Terminal su macOS/Linux) in una cartella qualsiasi ed esegui:

```bash
node --version
```

Output atteso (le cifre dopo il 22 possono variare):

```text
v22.x.x
```

Poi verifica npm:

```bash
npm --version
```

Output atteso: un numero di versione come `10.x.x` o superiore. Se entrambi i comandi stampano una versione, l'installazione è riuscita.

### 3. Alternativa opzionale: nvm
`nvm` permette di installare più versioni di Node.js e passare dall'una all'altra: utile se lavori a progetti diversi. **Non è necessario per il corso.**

- Windows: `nvm-windows` (installer dal repository ufficiale del progetto).
- macOS / Linux: `nvm` (script di installazione ufficiale).

Una volta installato, i comandi sono gli stessi:

```bash
nvm install 22
```

```bash
nvm use 22
```

Per usarla di default nelle nuove finestre (macOS/Linux):

```bash
nvm alias default 22
```

Su Windows, `nvm use 22` può richiedere un terminale avviato come amministratore. Se installi `nvm`, disinstalla prima eventuali Node.js installati con l'installer normale, per evitare conflitti nel PATH.

### 4. Comandi npm principali
Questi comandi li userai in tutto il corso (da dentro la cartella del progetto, cioè dove c'è `package.json`):

| Comando | Cosa fa |
|---|---|
| `npm install` | Installa tutte le dipendenze elencate in `package.json` |
| `npm install <PACCHETTO>` | Aggiunge una dipendenza al progetto (es. `react-router@7` al Day 6) |
| `npm run <SCRIPT>` | Esegue uno script di `package.json` (es. `npm run dev`) |
| `npm ls <PACCHETTO>` | Mostra quale versione di un pacchetto è installata |
| `npm create <TEMPLATE>` | Crea un nuovo progetto da un template (es. Vite) |
| `npx <COMANDO>` | Esegue un comando di un pacchetto senza installarlo globalmente |

`<PACCHETTO>`, `<SCRIPT>` e `<TEMPLATE>` sono segnaposto da sostituire con i nomi reali.

Per vedere dove è installato Node.js sul tuo sistema, in PowerShell:

```powershell
Get-Command node | Select-Object -ExpandProperty Source
```

e in macOS / Linux:

```bash
which node
```

---

## 🏦 LipariBank in action
LipariBank userà Node.js e npm in ogni giorno del corso: `npm install` per le dipendenze, `npm run dev` per vedere l'app, `npm run build` per la consegna. Al Day 6 aggiungerai l'unica dipendenza extra del corso, con `npm install react-router@7`. Per ora basta che `node --version` e `npm --version` rispondano correttamente: nel capitolo 05 creerai il progetto.

---

## 🧪 Your Turn
**Obiettivo:** installare Node.js 22 LTS e verificare l'ambiente.

**Requisiti:**
1. Installa Node.js 22 LTS (o verifica che la versione installata sia ≥ 22.12).
2. Chiudi e riapri il terminale.
3. Esegui `node --version` e `npm --version` e annota gli output.
4. Esegui `npm ls -g --depth=0` per vedere i pacchetti globali installati.

**Suggerimento:** se `node` non viene riconosciuto, vai alla sezione *Common Mistakes* qui sotto.

**Risultato atteso:** `node --version` stampa `v22.x.x` (o superiore a 22.12) e `npm --version` stampa un numero di versione.

**Criteri di completamento:** i due comandi funzionano da una nuova finestra di terminale, aperta dopo l'installazione.

---

## ⚠️ Common Mistakes

### `node` o `npm` non riconosciuto
Messaggi tipici: `'node' is not recognized...` (Windows) oppure `command not found: node` (macOS/Linux).

- Chiudi **tutte** le finestre del terminale (e VS Code) e riaprile: il PATH si aggiorna solo all'avvio.
- Su Windows reinstalla Node.js assicurandoti che "Add to PATH" sia attivo.
- Se hai più installazioni, controlla quale viene usata con `Get-Command node` (PowerShell) o `which node` (macOS/Linux).

### Windows PowerShell: "running scripts is disabled on this system"
Se `npm` stampa un errore su `npm.ps1` e sull'esecuzione di script disabilitata, PowerShell blocca gli script. Consenti gli script firmati localmente, solo per il tuo utente:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Conferma con `S` (o `Y`) se richiesto. In alternativa usa il Prompt dei comandi (`cmd`) invece di PowerShell. Non serve impostare `Unrestricted` né avviare il terminale come amministratore.

### Errori di permessi (`EACCES`, `EPERM`)
- **macOS/Linux, `EACCES`:** non usare `sudo npm install`. Cambia la cartella dei pacchetti globali oppure usa `nvm`, che installa tutto nella tua home.
- **Windows, `EPERM`:** chiudi VS Code e altri programmi che usano la cartella, sposta il progetto fuori da OneDrive e, se serve, elimina `node_modules` e riprova `npm install`. Un antivirus può bloccare temporaneamente i file: riprova dopo qualche istante.

### Versione di Node.js troppo vecchia
Se Vite stampa un errore sulla versione richiesta di Node.js, installa Node.js 22 LTS (o usa `nvm use 22`) e riapri il terminale.

### Problemi di rete o proxy
Se `npm install` va in timeout, controlla la connessione e il registro configurato:

```bash
npm config get registry
```

Il valore predefinito è `https://registry.npmjs.org/`. In reti aziendali con proxy chiedi al tuo amministratore le impostazioni corrette. Non incollare mai in chat o nel codice token personali presenti nei file `.npmrc`.

### Cache corrotta
Se dopo un errore le installazioni falliscono in modo strano:

```bash
npm cache verify
```

---

## ✅ Checklist
- ☐ Ho installato Node.js 22 LTS (o ≥ 22.12).
- ☐ `node --version` stampa `v22.x.x` (o superiore a 22.12).
- ☐ `npm --version` stampa un numero di versione.
- ☐ So a cosa servono `npm install`, `npm run` e `npx`.
- ☐ So cosa fare se il PATH o PowerShell bloccano `npm`.

---

## 🚀 Challenge
Esegui `npm help` e scopri cosa fa `npm ls`. Poi, in una cartella vuota di prova, esegui `npm init -y`: leggi il `package.json` generato e individua i campi `name`, `version` e `scripts`. Elimina la cartella di prova al termine.

---

## 📌 Recap
- Node.js esegue gli strumenti di sviluppo; npm installa le librerie e lancia gli script.
- Si usa Node.js 22 LTS; Vite 8 richiede `^20.19.0 || >=22.12.0`.
- `node --version` e `npm --version` confermano l'installazione, dopo aver riaperto il terminale.
- I problemi più comuni sono PATH non aggiornato, execution policy di PowerShell e permessi.
- `nvm` è opzionale: serve solo per gestire più versioni di Node.js.

---

### ➡️ Next
[Capitolo 03 — Visual Studio Code](./03_VS_Code.md): installerai e configurerai l'editor in cui scriverai LipariBank.
