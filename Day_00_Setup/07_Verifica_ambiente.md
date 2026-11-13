# 🏦 LipariBank — React Zero to Hero

> **Day 0 · Capitolo 07**
> **Argomento:** Verifica dell'ambiente
> **Durata stimata:** 20 minuti
> **Parte di LipariBank:** controllo finale del progetto `liparibank/` prima di iniziare il Day 1

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- verificare Node.js, npm, Git, VS Code e il progetto React con una checklist ripetibile;
- confrontare ogni output con quello atteso;
- diagnosticare e risolvere i problemi più frequenti;
- dichiarare l'ambiente pronto per il Day 1.

---

## 📋 Prerequisiti
- Capitoli [01](./01_Introduzione_al_corso.md), [02](./02_Node_NPM.md), [03](./03_VS_Code.md), [04](./04_Git_GitHub.md), [05](./05_Vite_e_primo_progetto_React.md) e [06](./06_Come_usare_i_checkpoint.md) completati.
- Progetto `liparibank/` creato, ridotto alla pagina minima (`src/App.jsx` con titolo e paragrafo) e collegato a GitHub.

---

## 🧭 In questo capitolo
- verifica di Node.js e npm;
- verifica di Git e GitHub;
- verifica di VS Code;
- verifica del progetto React (dipendenze, dev server, lint, build);
- tabella dei problemi frequenti;
- risultato finale atteso.

---

## 🧠 Theory

Un ambiente "pronto" significa che ogni anello della catena funziona: **terminale → Node/npm → progetto → browser → Git → GitHub**. Se un anello è rotto, i sintomi si manifestano altrove (per esempio: `npm run dev` che non parte perché Node è troppo vecchio). Per questo si verifica in ordine, dall'alto in basso, e ci si ferma al primo errore.

> 💡 **Remember**
>
> I numeri di versione sotto sono indicativi: contano la linea principale (Node 22, React 19, Vite 8) e l'assenza di errori. Le cifre dopo il punto possono essere diverse sul tuo computer.

---

## 💻 Let's Code

### 1. Node.js e npm
In un terminale qualsiasi:

```bash
node --version
```

Atteso: `v22.x.x` (accettabile qualsiasi versione ≥ 22.12).

```bash
npm --version
```

Atteso: un numero di versione (per esempio `10.x.x` o superiore).

### 2. Git e configurazione
```bash
git --version
```

Atteso: `git version 2.x.x`.

```bash
git config --global user.name
```

```bash
git config --global user.email
```

Atteso: il tuo nome e la tua email, esattamente come li hai configurati.

```bash
git config --global init.defaultBranch
```

Atteso: `main`.

### 3. Visual Studio Code
```bash
code --version
```

Atteso: tre righe: versione, hash del commit e architettura. Se `code` non è riconosciuto, apri VS Code manualmente e controlla il menu **Help → About**: il comando `code` non è indispensabile.

Controlla a mano in VS Code: il terminale integrato si apre, l'estensione Prettier è installata e il file `prova.js` viene riformattato al salvataggio.

### 4. Progetto React
Apri il terminale dentro `liparibank/` (da VS Code: **File → Open Folder → liparibank**) e verifica le dipendenze installate:

```bash
npm ls react react-dom vite
```

Atteso (le versioni esatte possono variare):

```text
liparibank@0.0.0
├── react-dom@19.x.x
├── react@19.x.x
└── vite@8.x.x
```

Se l'output mostra anche `UNMET DEPENDENCY` o errori, esegui `npm install` e riprova. Poi avvia il server:

```bash
npm run dev
```

Atteso: `VITE v8.x.x ready in ... ms` e `Local: http://localhost:5173/`. Apri l'indirizzo: devi vedere "LipariBank" e il paragrafo di benvenuto. Ferma il server con `Ctrl+C`.

Controlla la qualità del codice e la build:

```bash
npm run lint
```

Atteso: nessun errore riportato.

```bash
npm run build
```

Atteso: messaggi di build conclusi con successo e creazione della cartella `dist/`.

### 5. Git e GitHub sul progetto
Dentro `liparibank/`:

```bash
git status
```

Atteso: `On branch main` e `nothing to commit, working tree clean`.

```bash
git remote -v
```

Atteso: due righe `origin` (fetch e push) con l'URL del tuo repository `liparibank`.

```bash
git log --oneline
```

Atteso: almeno il commit `Setup iniziale LipariBank`.

Infine apri la pagina del repository su GitHub e verifica che sia presente il codice senza `node_modules/` né `dist/`.

### 6. Tabella dei problemi frequenti

| Sintomo | Causa probabile | Soluzione |
|---|---|---|
| `node` / `npm` non riconosciuto | PATH non aggiornato | Riapri tutti i terminali e VS Code; reinstalla Node.js ([capitolo 02](./02_Node_NPM.md)) |
| `npm.ps1 cannot be loaded` | Execution policy di PowerShell | `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` oppure usa `cmd` |
| Vite segnala versione di Node non supportata | Node troppo vecchio | Installa Node.js 22 LTS o usa `nvm use 22` |
| `ENOENT ... package.json` | Terminale nella cartella sbagliata | `cd liparibank` e controlla con `pwd` |
| `EPERM` / `EACCES` | Permessi, OneDrive, antivirus | Sposta il progetto fuori da OneDrive, chiudi i programmi che usano la cartella, non usare `sudo` |
| Pagina bianca | Errore in `App.jsx` o import mancante | Leggi il terminale di Vite e la console del browser (`F12`) |
| `Failed to resolve import "./App.css"` | `App.css` eliminato ma ancora importato | Rimuovi l'import da `App.jsx` |
| Porta 5173 occupata | Altro server attivo | Usa l'URL stampato da Vite (5174...) o chiudi l'altro server |
| `Authentication failed` al push | Credenziali o token non validi | Rifai il login dal browser o crea un nuovo token ([capitolo 04](./04_Git_GitHub.md)) |
| `rejected` al push | Il remote ha commit che non hai | `git pull`, risolvi i conflitti, poi `git push` |
| `src refspec main does not match any` | Nessun commit o branch diverso | Fai un commit; `git branch -M main` |

---

## 🏦 LipariBank in action
Il Day 1 parte esattamente dallo stato verificato qui: `liparibank/` con `src/App.jsx` minimo, `src/index.css` essenziale e nessun file `App.css`. Se una riga della checklist non è verde, risolvila ora: al Day 1 non avrai bisogno di toccare l'ambiente, solo il codice.

---

## 🧪 Your Turn
**Obiettivo:** produrre la prova che l'ambiente è pronto.

**Requisiti:**
1. Esegui tutti i comandi delle sezioni 1-5 e confronta gli output con quelli attesi.
2. Per ogni controllo fallito, individua la riga corrispondente nella tabella e applica la soluzione.
3. Apri `src/App.jsx`, cambia il paragrafo in "Ambiente verificato: pronto per il Day 1", salva e controlla che il browser si aggiorni da solo.
4. Fai un commit con messaggio `Verifica ambiente completata` e un `git push`.

**Suggerimento:** se un comando fallisce, leggi il **primo** messaggio di errore, non l'ultimo: di solito è la causa.

**Risultato atteso:** tutti i controlli superati, pagina aggiornata, commit visibile su GitHub.

**Criteri di completamento:** `git status` pulito dopo il push e tutte le voci della checklist sotto spuntate.

---

## 🔗 Repository / Checkpoint
Per tenere traccia del tuo avanzamento sulla **tua** repository `liparibank`, puoi marcare lo stato di fine Day 0 con un tag:

```bash
git tag day-00-setup
```

```bash
git push origin day-00-setup
```

Il nome del tag è un suggerimento per la tua repository personale; potrai tornare a questo punto del progetto in qualsiasi momento. Il checkpoint del corso per questo punto è `liparibank-day-00.zip`: vedi [Come usare i checkpoint](./06_Come_usare_i_checkpoint.md).

---

## ⚠️ Common Mistakes
- **Verificare solo che "sembri funzionare":** esegui davvero ogni comando e confronta l'output.
- **Controllare dal terminale sbagliato:** i comandi `npm` vanno lanciati in `liparibank/`, quelli globali (`node`, `git --version`) ovunque.
- **Ignorare gli avvisi di versione:** una versione di Node troppo vecchia causa errori poco chiari più avanti.
- **Continuare con un controllo rosso:** un problema di ambiente non risolto ora ricompare ogni giorno.
- **Dimenticare il push:** senza `git push` il lavoro esiste solo sul tuo computer.

---

## ✅ Checklist
- ☐ `node --version` → `v22.x.x` (o ≥ 22.12).
- ☐ `npm --version` → versione stampata.
- ☐ `git --version` → `git version 2.x.x`.
- ☐ Nome, email e `init.defaultBranch` (`main`) configurati.
- ☐ VS Code apre il progetto, il terminale integrato funziona e Prettier formatta al salvataggio.
- ☐ `npm ls react react-dom vite` → React 19, Vite 8.
- ☐ `npm run dev` apre `http://localhost:5173/` con la pagina LipariBank.
- ☐ `npm run lint` senza errori.
- ☐ `npm run build` completata, `dist/` creata.
- ☐ `git status` pulito, `git remote -v` mostra `origin`.
- ☐ Il codice è visibile su GitHub, senza `node_modules/` né `dist/`.

---

## 🚀 Challenge
Scrivi un breve file `NOTE_AMBIENTE.md` fuori dal repository con le versioni di Node, npm, Git e VS Code che stai usando e con i problemi che hai incontrato (e come li hai risolti). Ti servirà come riferimento se dovrai ripetere l'installazione su un altro computer.

---

## 📌 Recap
- Un ambiente pronto = terminale, Node/npm, progetto Vite, browser, Git e GitHub funzionanti.
- Si verifica in ordine e ci si ferma al primo errore.
- Versioni di riferimento: Node 22 LTS, React 19, Vite 8.
- A fine Day 0 hai `liparibank/` con pagina minima, `lint` e `build` verdi e un commit su GitHub.

---

### ➡️ Next
[Day 1 · Capitolo 01 — React e LipariBank](../Day_01_React_Fundamentals/01_React_e_LipariBank.md): inizia a costruire la prima dashboard. Se JavaScript moderno non ti è familiare, puoi prima consultare l'[Extra JavaScript Essentials](../Extra_JavaScript_Essentials/01_Variables_Types.md).
