# 🏦 LipariBank — React Zero to Hero

> **Day 0 · Capitolo 04**
> **Argomento:** Git e GitHub
> **Durata stimata:** 40 minuti
> **Parte di LipariBank:** il tuo repository GitHub `liparibank`, dove salverai e consegnerai il progetto

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- spiegare la differenza tra Git e GitHub;
- installare e configurare Git (nome, email, branch predefinito);
- eseguire il ciclo `add` → `commit` → `push` e `pull` su un repository di prova;
- creare il tuo repository GitHub `liparibank`, autenticarti e riconoscere gli errori più comuni.

---

## 📋 Prerequisiti
- [Capitolo 03](./03_VS_Code.md): VS Code con terminale integrato funzionante.
- Un account GitHub (gratuito): registrati su `https://github.com` usando la mail aziendale se non ne hai uno.
- Cartella `corso-react` esistente.

---

## 🧭 In questo capitolo
- Git vs GitHub;
- installazione e configurazione di Git;
- concetti: repository, commit, remote, branch;
- pratica su un repository di prova (`git-prova`);
- creazione del repository `liparibank` su GitHub;
- autenticazione ed errori comuni.

---

## 🧠 Theory

### Git e GitHub non sono la stessa cosa
- **Git** è il programma, installato sul tuo computer, che registra la storia del codice: ogni **commit** è uno "scatto" del progetto con un messaggio.
- **GitHub** è un servizio online che ospita repository Git: ti dà un posto remoto per il backup, la condivisione e la consegna del lavoro.

### Il flusso base

| Concetto | Significato |
|---|---|
| Working directory | I file su cui stai lavorando |
| Staging area (`git add`) | I cambiamenti scelti per il prossimo commit |
| Commit (`git commit`) | Lo scatto salvato nella storia locale |
| Remote (`origin`) | Il repository su GitHub collegato al tuo progetto |
| `git push` | Invia i commit locali al remote |
| `git pull` | Scarica e integra i commit presenti sul remote |
| Branch | Una linea di sviluppo; la principale si chiama `main` |

> 💡 **Remember**
>
> Un commit è locale finché non fai `git push`. Se il PC si rompe prima del push, quel lavoro è perso.

### Cosa non si committa mai
`node_modules/` (si rigenera con `npm install`), `dist/` (output di build) e qualsiasi **segreto**: password, token, chiavi API, file `.env` con valori sensibili. Il template Vite include già un `.gitignore` corretto per le prime due.

---

## 💻 Let's Code

### 1. Installare Git
**Windows:** scarica "Git for Windows" da `https://git-scm.com` e installa lasciando le opzioni predefinite. L'installer include **Git Credential Manager**, che gestisce il login a GitHub dal browser.

**macOS:** esegui in Terminal, e accetta l'installazione degli strumenti di sviluppo:

```bash
xcode-select --install
```

In alternativa, con Homebrew: `brew install git`.

**Linux (Debian/Ubuntu):**

```bash
sudo apt install git
```

Chiudi e riapri il terminale, poi verifica:

```bash
git --version
```

Output atteso: `git version 2.x.x` (il numero dipende dal sistema).

### 2. Configurare nome, email e branch
Esegui una sola volta (valida per tutti i repository del tuo utente). Sostituisci i valori tra virgolette con i tuoi:

```bash
git config --global user.name "<NOME COGNOME>"
```

```bash
git config --global user.email "<EMAIL_DEL_TUO_ACCOUNT_GITHUB>"
```

```bash
git config --global init.defaultBranch main
```

`<NOME COGNOME>` è il nome che comparirà nei commit; l'email è quella associata al tuo account GitHub (se preferisci non esporla, usa l'indirizzo "noreply" mostrato in GitHub → Settings → Emails). L'ultimo comando fa sì che i nuovi repository partano con il branch `main`.

Su Windows, per evitare avvisi sui fine riga (LF/CRLF) puoi impostare:

```bash
git config --global core.autocrlf true
```

Verifica la configurazione:

```bash
git config --global --list
```

### 3. Creare un repository di prova su GitHub
Per fare pratica senza toccare il progetto vero, crea un repository di prova:

1. Vai su GitHub e scegli **New repository** (pulsante `+` in alto a destra).
2. Nome: `git-prova`. Visibilità: **Private**.
3. **Non** selezionare "Add a README", ".gitignore" né licenza.
4. Premi **Create repository**: GitHub mostra la pagina "Quick setup" con l'URL del repository, del tipo `https://github.com/<TUO_UTENTE>/git-prova.git`.

### 4. Primo commit e push
Nel terminale integrato, dentro `corso-react/`, crea la cartella di prova:

```bash
mkdir git-prova
```

```bash
cd git-prova
```

Crea un file `README.md` (con VS Code oppure da terminale). In PowerShell:

```powershell
"# Repository di prova" | Out-File -Encoding utf8 README.md
```

In macOS / Linux:

```bash
echo "# Repository di prova" > README.md
```

Inizializza il repository, controlla lo stato e fai il primo commit:

```bash
git init
```

```bash
git status
```

```bash
git add .
```

```bash
git commit -m "Primo commit di prova"
```

`git status` mostra file nuovi (untracked) o in staging; `git add .` mette in staging tutto; `git commit -m` salva lo scatto con un messaggio breve e descrittivo (al presente: "Aggiungi README").

Collega il remote e invia il branch `main`. Sostituisci l'URL con quello del tuo repository:

```bash
git remote add origin <URL_DEL_TUO_REPOSITORY>
```

```bash
git push -u origin main
```

`<URL_DEL_TUO_REPOSITORY>` è l'URL copiato da GitHub. L'opzione `-u` ricorda il collegamento tra `main` locale e `origin/main`: dai prossimi push basterà `git push`.

### 5. Autenticazione
Al primo `push` Git deve sapere chi sei. Opzioni, in ordine di semplicità:

- **Windows / macOS (consigliato):** si apre una finestra del browser: accedi a GitHub e autorizza. Le credenziali vengono salvate dal credential manager del sistema (Git Credential Manager su Windows, Keychain su macOS).
- **Personal Access Token (PAT):** GitHub non accetta più la password dell'account per `push` via HTTPS. Se il browser non è disponibile (per esempio su Linux), crei un token da *GitHub → Settings → Developer settings → Personal access tokens*, limitato al solo repository e con permesso di scrittura sui contenuti, e lo incolli quando Git chiede la password. Il token è un segreto: non va mai scritto nel codice, nei commit o nei messaggi di chat.
- **SSH:** alternativa avanzata con chiavi; non necessaria per il corso.

### 6. Modificare, committare e fare pull
Aggiungi una riga a `README.md`, poi esegui:

```bash
git add README.md
```

```bash
git commit -m "Aggiorna README"
```

```bash
git push
```

Per simulare il lavoro da un'altra macchina, modifica il file direttamente su GitHub (pulsante matita → *Commit changes*) e poi, nel terminale:

```bash
git pull
```

`git pull` scarica il commit fatto su GitHub e aggiorna il file locale. Per rivedere la storia:

```bash
git log --oneline
```

---

## 🏦 LipariBank in action
Ora crea sul sito GitHub il repository **vero** del progetto, vuoto, che userai nel capitolo 05 per il primo push di LipariBank:

1. **New repository** → nome `liparibank`.
2. Visibilità public, così potrai linkare il tuo progetto e renderlo accessibile per una validazione.
3. **Non** aggiungere README, `.gitignore` né licenza: serve un repository completamente vuoto.
4. Copia l'URL del repository, per esempio `https://github.com/<TUO_UTENTE>/liparibank.git`, e tienilo a portata di mano.

Il progetto `liparibank/` non esiste ancora in locale: lo crei con Vite nel capitolo 05, dove lo collegherai a questo repository con `git remote add`, `git commit` e `git push`.

Durante il corso salverai il lavoro con commit piccoli e frequenti, per esempio:

```text
Setup iniziale LipariBank
Aggiungi componente Header
Completa dashboard Day 1
```

Oltre alla tua repository, il corso mette a disposizione un **checkpoint** per ogni giorno: un archivio con il progetto funzionante a fine giornata. Vedrai come usarlo nel [capitolo 06](./06_Come_usare_i_checkpoint.md).

---

## 🧪 Your Turn
**Obiettivo:** completare il ciclo Git locale + remoto sul repository di prova e creare il repository `liparibank`.

**Requisiti:**
1. Configura `user.name`, `user.email` e `init.defaultBranch`, e verifica con `git config --global --list`.
2. Crea `git-prova` su GitHub, crea la cartella locale `git-prova` in `corso-react/`, fai almeno **due commit** con messaggi diversi e un `git push`.
3. Modifica un file su GitHub e scaricalo con `git pull`.
4. Esegui `git log --oneline` e verifica che compaiano tutti i commit.
5. Crea il repository vuoto `liparibank` su GitHub e annota l'URL.

**Suggerimento:** se il push chiede credenziali e non si apre il browser, passa al metodo PAT descritto sopra.

**Risultato atteso:** il repository `git-prova` su GitHub mostra i tuoi commit; il repository `liparibank` esiste ed è vuoto.

**Criteri di completamento:** `git status` in `git-prova` dice `nothing to commit, working tree clean` e `git push` non segnala errori.

---

## ⚠️ Common Mistakes

| Errore | Causa e soluzione |
|---|---|
| `Author identity unknown` / `Please tell me who you are` | `user.name` e `user.email` non configurati: esegui i comandi `git config --global` della sezione 2. |
| `fatal: not a git repository` | Sei nella cartella sbagliata o manca `git init`. Controlla il percorso con `pwd` e spostati nel progetto. |
| `error: src refspec main does not match any` | Non esiste ancora nessun commit, oppure il branch si chiama diversamente. Fai un commit e controlla il nome con `git branch`; per rinominare: `git branch -M main`. |
| `remote origin already exists` | Il remote è già impostato. Controlla con `git remote -v`; per correggere l'URL: `git remote set-url origin <URL_DEL_TUO_REPOSITORY>`. |
| `Authentication failed` / `Permission denied` | Credenziali errate o scadute, o token senza permessi di scrittura. Rifai l'accesso dal browser o genera un nuovo token con i permessi corretti; controlla l'URL del repository. |
| `repository not found` | URL sbagliato o repository privato di un altro account. Ricopia l'URL da GitHub. |
| `rejected ... (fetch first)` / `non-fast-forward` | Il remote ha commit che non hai in locale. Esegui `git pull`, risolvi eventuali conflitti e riprova `git push`. |
| Conflitto di merge | Git segna il file con `<<<<<<<`, `=======`, `>>>>>>>`: modifica il file tenendo la versione giusta, poi `git add`, `git commit`. |
| `detected dubious ownership` | Cartella con proprietario diverso. Se la cartella è tua e sicura: `git config --global --add safe.directory <PERCORSO_DELLA_CARTELLA>`. |
| Avviso `LF will be replaced by CRLF` | Normale su Windows: è solo un avviso sui fine riga; la configurazione `core.autocrlf true` lo gestisce. |

Un errore grave da evitare: **committare un segreto**. Se succede, non basta cancellarlo con un nuovo commit: revoca subito il token dal sito del servizio.

---

## ✅ Checklist
- ☐ `git --version` stampa una versione.
- ☐ Nome, email e `init.defaultBranch` sono configurati.
- ☐ So spiegare la differenza tra Git (locale) e GitHub (remoto).
- ☐ Ho fatto `add`, `commit`, `push` e `pull` su `git-prova`.
- ☐ Ho creato il repository vuoto `liparibank` su GitHub e ho annotato l'URL.
- ☐ So che token e password non vanno mai nel codice o nei commit.

---

## 🚀 Challenge
Crea un branch con `git switch -c prova-branch`, aggiungi un file e fai un commit, poi torna su `main` con `git switch main` e osserva che il file non c'è. Fai il merge con `git merge prova-branch` e rimuovi il branch con `git branch -d prova-branch`.

---

## 📌 Recap
- Git registra la storia in locale; GitHub ospita i repository remoti.
- Il ciclo base è `git add` → `git commit` → `git push`; `git pull` scarica le novità.
- Configura una volta nome, email e branch `main`.
- L'autenticazione avviene via browser/credential manager o con un token personale, che è un segreto.
- Mai committare `node_modules/`, `dist/`, token o password.

---

### ➡️ Next
[Capitolo 05 — Vite e primo progetto React](./05_Vite_e_primo_progetto_React.md): creerai il progetto `liparibank`, lo avvierai e lo collegherai al repository GitHub appena creato.
