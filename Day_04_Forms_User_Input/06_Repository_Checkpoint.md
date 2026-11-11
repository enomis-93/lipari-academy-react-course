# 🏦 LipariBank — React Zero to Hero

> **Day 4 · Capitolo 06**
> **Argomento:** Repository e Checkpoint — come proseguire da una repository GitHub
> **Durata stimata:** 40 minuti
> **Parte di LipariBank:** CHECKPOINT 4 "Form bonifico": ripartire dal progetto a fine Day 4 e pubblicare il tuo lavoro

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- clonare una repository, spostarti su un branch e avviare il progetto (`npm install`, `npm run dev`);
- verificare che il checkpoint funzioni con una lista di controllo;
- creare un branch personale, fare commit e pubblicarlo sulla tua repository GitHub;
- ripristinare un ambiente pulito da zero partendo solo da una repository.

---

## 📋 Prerequisiti
- Git e un account GitHub configurati: [Git e GitHub](../Day_00_Setup/04_Git_GitHub.md).
- Node.js e npm funzionanti: [Node e NPM](../Day_00_Setup/02_Node_NPM.md).
- Progetto di fine capitolo 05 (bonifico simulato) completato, oppure intenzione di ripartire dal checkpoint.

---

## 🧭 In questo capitolo
- Le due strade: la tua repository o quella del checkpoint.
- Clone, branch, installazione, avvio.
- Verifica del CHECKPOINT 4.
- Push del tuo lavoro.
- Problemi frequenti.

---

## 🧠 Theory

### A cosa servono i checkpoint
Un **checkpoint** è una versione completa e funzionante del progetto a un certo punto del corso. Serve se:

- sei rimasto bloccato e vuoi ripartire da una base corretta;
- vuoi confrontare il tuo codice con una versione di riferimento;
- inizi il corso da un giorno intermedio.

### Due strade
| Strada | Quando | Cosa fai |
|---|---|---|
| **A. La tua repository** | hai seguito i capitoli | metti un commit/tag sul tuo codice (es. tag `checkpoint-4`) |
| **B. Repository del checkpoint** | vuoi ripartire da una base di riferimento | cloni, ti sposti sul branch, lavori su un tuo branch |

La repository ufficiale del checkpoint **non è ancora indicata in questo materiale**: l'URL e il branch sono segnaposto, da compilare a cura di chi pubblica il corso.

- URL: `[DA CONFIGURARE: inserire URL reale della repository]`
- Branch: `[DA CONFIGURARE: inserire nome reale del branch]`

Non usare nessun URL "di esempio" trovato altrove: sostituisci i segnaposto solo con i valori forniti dal docente o dalla piattaforma del corso.

### Cosa contiene il CHECKPOINT 4
| Voce | Contenuto |
|---|---|
| **Contenuto iniziale** | progetto `liparibank` di fine Day 3 con `TransferForm` (campi controllati) e `validators.js` |
| **Da completare** | submit con `handleAddTransfer`, conferma, reset, saldi ricalcolati (capitoli 04-05) |
| **Già funzionante** | selezione conto, filtri e ricerca, preferiti, nascondi saldi, validazione per campo |
| **Come verificare** | scenari del [capitolo 05](./05_Esercizio_LipariBank_Bonifico.md), `npm run lint`, `npm run build` |
| **URL / Branch** | `[DA CONFIGURARE: inserire URL reale della repository]` / `[DA CONFIGURARE: inserire nome reale del branch]` |

> 💡 **Remember**
>
> `node_modules/` **non** è nella repository: è generata da `npm install`. Il `.gitignore` del template Vite la esclude (insieme a `dist/`). Non committare mai segreti, token o file `.env` con credenziali.

---

## 💻 Let's Code

### 1. Controlla gli strumenti
Da qualsiasi cartella:

```bash
git --version
```

```bash
node --version
```

Node.js deve essere una versione compatibile con Vite (22 LTS, come nel Day 0).

### 2. Clona la repository
Scegli una cartella di lavoro (non dentro un'altra repository), poi esegui il comando sostituendo `<URL_REPOSITORY>` con il valore reale dell'URL (il segnaposto `[DA CONFIGURARE: inserire URL reale della repository]` va compilato prima):

```bash
git clone <URL_REPOSITORY>
```

Entra nella cartella creata, sostituendo `<NOME_CARTELLA_REPOSITORY>` con il nome che Git ha generato (di solito coincide con il nome della repository):

```bash
cd <NOME_CARTELLA_REPOSITORY>
```

### 3. Passa al branch del checkpoint
Elenca i branch disponibili:

```bash
git branch -a
```

Posizionati sul branch indicato (`<NOME_BRANCH>` è il valore del segnaposto `[DA CONFIGURARE: inserire nome reale del branch]`):

```bash
git switch <NOME_BRANCH>
```

Controlla di essere sul branch giusto:

```bash
git status
```

### 4. Trova la cartella del progetto
Il file `package.json` deve trovarsi nella cartella dove lanci `npm`. Elenca il contenuto:

```bash
ls
```

Se `package.json` non c'è, ma c'è una sottocartella `liparibank/`, entraci con `cd liparibank`. Da qui in poi tutti i comandi `npm` vanno lanciati **dentro la cartella che contiene `package.json`**.

### 5. Installa le dipendenze e avvia
```bash
npm install
```

```bash
npm run dev
```

Apri l'indirizzo mostrato nel terminale (di default `http://localhost:5173/`; se la porta è occupata Vite ne sceglie un'altra e te lo scrive). Per fermare il server premi `Ctrl+C`.

### 6. Verifica il checkpoint
Con il server acceso esegui gli scenari del [capitolo 05](./05_Esercizio_LipariBank_Bonifico.md). In un secondo terminale, dentro la cartella del progetto:

```bash
npm run lint
```

```bash
npm run build
```

`npm run build` crea la cartella `dist/` (ignorata da Git). Il checkpoint è valido se non compaiono errori e gli 11 scenari danno il risultato atteso.

### 7. Lavora su un tuo branch
Non lavorare direttamente sul branch del checkpoint. Crea il tuo:

```bash
git switch -c day-04-bonifico
```

(`day-04-bonifico` è un nome suggerito per **il tuo** branch: puoi scegliere un altro nome.)

Quando hai fatto delle modifiche:

```bash
git status
```

```bash
git add .
```

```bash
git commit -m "Day 4: bonifico simulato con saldi ricalcolati"
```

### 8. Pubblica sulla tua repository
Non hai (di norma) il permesso di scrivere sulla repository del corso: pubblica su **una tua repository**. Due modi.

**Modo 1 — Fork.** Sulla pagina GitHub della repository usa il pulsante *Fork*, poi clona **il tuo fork** con il passo 2 usando l'URL del fork.

**Modo 2 — Nuova repository + cambio di remote.** Crea sul sito GitHub una repository vuota (senza README), poi dentro il progetto:

```bash
git remote rename origin upstream
```

```bash
git remote add origin <URL_DELLA_TUA_REPOSITORY>
```

```bash
git remote -v
```

L'ultimo comando elenca i remote: `origin` deve puntare alla tua repository, `upstream` a quella originale. Poi:

```bash
git push -u origin day-04-bonifico
```

`<URL_DELLA_TUA_REPOSITORY>` è l'URL della repository che hai creato tu su GitHub.

**Autenticazione.** GitHub non accetta la password dell'account per le operazioni Git su HTTPS: Git for Windows usa di norma *Git Credential Manager*, che apre il browser per l'accesso; in alternativa puoi usare una chiave SSH. Non scrivere token o password in file del progetto, negli script o nei messaggi di commit.

### 9. Metti un tag di checkpoint (opzionale)
Sulla tua repository, un tag marca il punto di fine giornata:

```bash
git tag checkpoint-4
```

```bash
git push origin checkpoint-4
```

---

## 🏦 LipariBank in action

Il CHECKPOINT 4 è il punto di partenza del **Day 5**: da qui in poi la lista dei movimenti arriverà da un file JSON servito da Vite tramite `fetch`. Avere un checkpoint verificato significa poter aggiungere `useEffect`, loading ed error state su una base che funziona.

Verifica finale prima di proseguire:

- ☐ Da una cartella vuota riesci a clonare, installare e avviare l'app.
- ☐ Gli 11 scenari del bonifico funzionano.
- ☐ `npm run lint` e `npm run build` non danno errori.
- ☐ Il tuo lavoro è su un tuo branch e pubblicato sulla tua repository.

---

## 🧪 Your Turn

**Obiettivo:** dimostrare che il tuo progetto è riproducibile da zero.

**Requisiti**
1. Il tuo lavoro di Day 4 è committato su un branch (es. `day-04-bonifico`) e pubblicato sulla **tua** repository GitHub.
2. Crei il tag `checkpoint-4` e lo pubblichi.
3. In una **cartella nuova** (diversa da quella di lavoro) cloni la **tua** repository, ti sposti sul tuo branch, esegui `npm install` e `npm run dev`.
4. Nella copia clonata esegui almeno gli scenari 1, 4, 6 e 7 del capitolo 05.
5. Controlli con `git status` che `node_modules/` e `dist/` non risultino da committare.

**Passi suggeriti**
- Segui i passi 7-9 per pubblicare, poi i passi 2-6 sulla tua repository.
- Se qualcosa non funziona nella copia clonata, confronta con la cartella di lavoro: spesso manca un file non committato.

**Risultato atteso:** la copia clonata si avvia senza interventi manuali e si comporta come il progetto originale.

**Criteri di completamento**
- `git log --oneline` (dentro la copia clonata) mostra il tuo commit di Day 4.
- Gli scenari verificati danno i risultati attesi.
- Nessun file con segreti è stato committato.

---

## ⚠️ Common Mistakes

| Errore | Sintomo | Correzione |
|---|---|---|
| `npm` lanciato nella cartella sbagliata | `ENOENT ... package.json` | spostarsi nella cartella che contiene `package.json` |
| Saltare `npm install` dopo il clone | `vite` non trovato, import non risolti | eseguire `npm install` |
| Versione di Node non compatibile | errori di Vite all'avvio | verificare `node --version` (vedi [Node e NPM](../Day_00_Setup/02_Node_NPM.md)) |
| Segnaposto `<URL_REPOSITORY>` lasciato nel comando | `repository not found` | sostituirlo con l'URL reale |
| `git switch` rifiutato per modifiche non salvate | errore su file locali | `git status`, poi commit oppure `git stash` |
| Lavorare sul branch del checkpoint | difficoltà a tornare alla base | creare sempre un proprio branch |
| `git push` rifiutato (permessi) | `403` / permission denied | pubblicare su una propria repository (fork o nuova) |
| Committare `node_modules/` o `.env` con segreti | repository pesante o dati sensibili esposti | verificare `.gitignore`; non committare mai segreti |
| Porta occupata | Vite usa un'altra porta | usare l'URL stampato nel terminale |

---

## ✅ Checklist
- ☐ So clonare una repository e passare a un branch.
- ☐ So perché serve `npm install` dopo il clone.
- ☐ So verificare un checkpoint (scenari, lint, build).
- ☐ So lavorare su un branch personale e pubblicarlo sulla mia repository.
- ☐ So che URL e branch del checkpoint ufficiale vanno compilati dal docente (segnaposto).
- ☐ Non ho committato segreti, `node_modules/` o `dist/`.

---

## 🚀 Challenge
Aggiungi al tuo `README.md` una sezione "Come avviare il progetto" con i comandi dei passi 2-5 e una riga che dichiara che il bonifico è **simulato**. Poi chiedi a un collega (o usa un'altra cartella) di seguirla alla lettera: se si blocca, correggi il README.

---

## 📌 Recap
- Un checkpoint è una versione funzionante da cui ripartire; puoi usare la **tua** repository o quella del checkpoint.
- Flusso: `git clone` → `git switch <branch>` → `npm install` → `npm run dev` → verifica.
- Si lavora su un **branch personale** e si pubblica sulla **propria** repository.
- URL e branch ufficiali sono segnaposto `[DA CONFIGURARE: ...]`: non vanno inventati.
- Mai committare segreti, `node_modules/` o `dist/`.

---

### ➡️ Next
[Capitolo 07 — useRef e focus](./07_useRef.md): miglioriamo l'accesso al campo importo prima di passare agli effetti.
