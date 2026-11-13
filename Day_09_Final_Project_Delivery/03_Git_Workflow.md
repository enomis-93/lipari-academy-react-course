# 🏦 LipariBank — React Zero to Hero

> **Day 9 · Capitolo 03**
> **Argomento:** Git Workflow
> **Durata stimata:** 40 minuti
> **Parte di LipariBank:** gestione del codice del progetto finale con branch, commit piccoli e push

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- lavorare con un branch per ogni funzionalità e unirlo a `main`;
- scrivere messaggi di commit nello stile *Conventional Commits*;
- risolvere un semplice conflitto di merge;
- configurare `.gitignore` e non commitare mai `.env`, segreti o `node_modules`.

---

## 📋 Prerequisiti
- [Git e GitHub](../Day_00_Setup/04_Git_GitHub.md) (Day 0): `git init`, `add`, `commit`, remote su GitHub.
- [Architettura e piano di lavoro](./02_Architettura_e_Piano.md): le fasi e i nomi dei branch.
- Il progetto `liparibank/` è una repository Git con un remote (la **tua** repo, creata nel Day 0).

---

## 🧭 In questo capitolo
- Perché un branch per funzionalità.
- Il ciclo quotidiano: branch → commit piccoli → push → merge.
- Messaggi di commit (Conventional Commits).
- Pull Request (facoltativa).
- Conflitti: cosa sono e come si risolvono.
- `.gitignore` e segreti.

---

## 🧠 Theory

### Branch per funzionalità
`main` contiene sempre una versione che funziona. Ogni fase del piano lavora su un branch separato: se qualcosa va storto, `main` non è toccato. Nomi suggeriti: `feature/<cosa>`, `fix/<cosa>`, `chore/<cosa>`, `docs/<cosa>`.

### Commit piccoli
Un commit = **un'unica modifica logica** che si può descrivere in una riga. "Aggiunge filtro per testo" è un buon commit; "modifiche varie" no. Commit piccoli permettono di tornare indietro, leggere la storia e risolvere conflitti più facilmente.

### Conventional Commits (stile semplificato)
Formato: `tipo(ambito): descrizione all'imperativo`

| Tipo | Quando | Esempio |
|---|---|---|
| `feat` | nuova funzionalità | `feat(transactions): aggiunge filtro per testo` |
| `fix` | correzione di bug | `fix(transfer): rifiuta importo maggiore del saldo` |
| `refactor` | riorganizza senza cambiare il comportamento | `refactor(dashboard): dichiara una volta sola handleToggleFavorite` |
| `style` | formattazione o CSS | `style(layout): rende il menu responsive` |
| `docs` | documentazione | `docs: aggiunge README` |
| `chore` | manutenzione, config | `chore: aggiunge .env.example` |

> 💡 **Remember**
>
> Il messaggio spiega **cosa e perché**, non "come". Il "come" è nel diff.

---

## 💻 Let's Code

Tutti i comandi si eseguono nella cartella `liparibank/`.

### 1. Controlla lo stato e parti da `main` aggiornato
```bash
git status
```

```bash
git switch main
```

Se hai un remote configurato:

```bash
git pull
```

### 2. Crea il branch della fase
```bash
git switch -c feature/account-filter
```

`-c` crea il branch e ci passa sopra. Il nome è quello della fase nel [piano](./02_Architettura_e_Piano.md).

### 3. Lavora, poi controlla cosa hai cambiato
```bash
git status
```

```bash
git diff
```

### 4. Aggiungi e committa piccoli blocchi
Aggiungi solo i file di una modifica logica:

```bash
git add src/pages/TransactionsPage.jsx
```

```bash
git commit -m "feat(transactions): aggiunge la scelta del conto nella pagina movimenti"
```

Un secondo commit, per un'altra modifica:

```bash
git add src/pages/DashboardPage.jsx
```

```bash
git commit -m "refactor(dashboard): dichiara una volta sola handleToggleFavorite"
```

### 5. Pubblica il branch
```bash
git push -u origin feature/account-filter
```

`-u` collega il branch locale a quello remoto; i `git push` successivi non richiedono argomenti. `origin` è il nome standard del remote.

### 6. Unisci a `main`
**Opzione A — da riga di comando** (lavori da solo):

```bash
git switch main
```

```bash
git merge feature/account-filter
```

```bash
git push
```

**Opzione B — Pull Request su GitHub** (facoltativa, ma utile per rileggere le modifiche): apri la repo su GitHub, scegli il branch appena pubblicato, usa il pulsante di creazione della Pull Request, controlla la scheda *Files changed* e, se è tutto a posto, esegui il merge dall'interfaccia. Poi in locale:

```bash
git switch main
```

```bash
git pull
```

Per ripulire il branch ormai unito:

```bash
git branch -d feature/account-filter
```

### 7. Conflitti di merge
Un conflitto avviene quando due branch modificano **le stesse righe**. Git si ferma e marca il file:

```text
<<<<<<< HEAD
<h1>Movimenti</h1>
=======
<h1>Elenco movimenti</h1>
>>>>>>> feature/account-filter
```

Risoluzione, passo per passo:
1. `git status` elenca i file "both modified".
2. Apri il file; tra `<<<<<<<` e `=======` c'è la versione di `main` (HEAD), tra `=======` e `>>>>>>>` quella del branch che stai unendo.
3. Scegli una delle due versioni o scrivine una nuova combinata, e **cancella le tre righe di marcatori**.
4. Salva, poi:

```bash
git add src/pages/TransactionsPage.jsx
```

```bash
git commit
```

Git propone un messaggio di merge già pronto: conferma. Per annullare l'intero merge e ripartire:

```bash
git merge --abort
```

Per ridurre i conflitti: branch di breve durata, `git pull` frequente su `main`, e **non** riformattare file interi senza motivo.

### 8. `.gitignore` e segreti
Il template Vite include già un `.gitignore` che ignora `node_modules`, `dist` e i file `*.local`. Il file `.env` (senza `.local`) **non** è coperto (verificato sul template generato): aggiungi in fondo a `.gitignore`:

```text
.env
.env.*
!.env.example
```

La riga `!.env.example` crea un'eccezione: `.env.example` (senza valori segreti) **deve** essere committato. Verifica che l'eccezione funzioni (nessun output = non ignorato; senza `-v`):

```bash
git check-ignore .env.example
```

Verifica che un file sia ignorato (deve stampare il nome del file con la regola):

```bash
git check-ignore -v .env
```

Verifica che non sia già tracciato (nessun output = ok):

```bash
git ls-files .env node_modules dist
```

Se `.env` è finito per errore nella storia, **non basta cancellarlo e committare**: il contenuto resta nei commit precedenti. Considera quel segreto compromesso, **cambialo** e chiedi aiuto per riscrivere la storia. Per questo nel corso non si mettono mai segreti nei file `.env`: LipariBank non ne ha.

---

## 🏦 LipariBank in action

Sequenza completa per la **Fase 1** (filtro per conto), con i commit che ti aspetti di vedere in `git log --oneline`:

```text
feat(transactions): aggiunge la scelta del conto nella pagina movimenti
feat(transactions): combina il filtro per conto con tipo e ricerca
fix(transactions): collega la label al campo del conto
```

Ogni riga corrisponde a un punto verificabile del [requisito REQ-06](./01_Brief_e_Requisiti.md). Per vedere la storia in forma compatta:

```bash
git log --oneline --graph --decorate -10
```

---

## 🧪 Your Turn

**Obiettivo:** applicare il workflow a una fase reale e provocare (e risolvere) un conflitto controllato.

**Requisiti**
1. Verifica `.gitignore`: `.env` e `*.local` ignorati, `.env.example` consentito, `node_modules` e `dist` ignorati. Verifica con `git check-ignore -v`.
2. Esegui la **Fase 0** del piano su `chore/baseline`, con almeno 2 commit nello stile Conventional Commits.
3. Pubblica il branch con `git push -u origin ...` ed eseguilo in merge su `main` (da CLI o Pull Request).
4. **Esercizio conflitto:** crea due branch da `main` (`fix/title-a`, `fix/title-b`), in ciascuno cambia lo stesso titolo `<h1>` di `NotFoundPage.jsx` con un testo diverso, unisci il primo, poi unisci il secondo: risolvi il conflitto scegliendo un testo unico.

**Passi suggeriti**
- Dopo ogni commit esegui `git status`: deve essere "working tree clean".
- Prima di fare `git add`, guarda sempre `git diff` per evitare di aggiungere file non voluti (`.env`, `dist/`).

**Risultato atteso:** `git log --oneline` mostra commit piccoli e leggibili; `main` contiene il merge; il conflitto è risolto senza marcatori residui.

**Criteri di completamento:** nessun file `.env`, `node_modules`, `dist` nella storia (`git ls-files` non li mostra); nessun carattere `<<<<<<<` nei sorgenti (cercalo con `Ctrl+Shift+F`).

---

## 🔗 Repository / Checkpoint

Il workflow di questo capitolo vale per la **tua** repository. I checkpoint del corso sono invece archivi allegati a ogni giorno sulla piattaforma: vedi [Come usare i checkpoint](../Day_00_Setup/06_Come_usare_i_checkpoint.md).

| Archivio | Stato del progetto | Capitolo di riferimento |
|---|---|---|
| `liparibank-day-01.zip` | Prima dashboard statica | [Day 1 · Esercizio](../Day_01_React_Fundamentals/06_Esercizio_LipariBank_Dashboard.md) |
| `liparibank-day-02.zip` | Conti e componenti riutilizzabili | [Day 2 · Esercizio](../Day_02_Components_Props/06_Esercizio_LipariBank_Accounts.md) |
| `liparibank-day-03.zip` | Selezione del conto, filtri, preferiti | [Day 3 · Esercizio](../Day_03_State_Events/07_Esercizio_LipariBank_Transactions.md) |
| `liparibank-day-04.zip` | Form del bonifico simulato | [Day 4 · Esercizio](../Day_04_Forms_User_Input/06_Esercizio_LipariBank_Bonifico.md) |
| `liparibank-day-05.zip` | Movimenti caricati in modo asincrono | [Day 5 · Esercizio](../Day_05_Effects_API/06_Esercizio_LipariBank_API_Transactions.md) |
| `liparibank-day-06.zip` | Applicazione a più pagine | [Day 6 · Esercizio](../Day_06_Routing/06_Esercizio_LipariBank_MultiPage.md) |
| `liparibank-day-07.zip` | Stato condiviso con Context e Redux | [Day 7 · Esercizio](../Day_07_Shared_State_Redux/06_Esercizio_Migrazione_a_Redux.md) |
| `liparibank-day-08.zip` | Hook, service layer e struttura finale: **punto di partenza del progetto finale** | [Day 8 · Esercizio](../Day_08_Advanced_Hooks_Architecture/05_Esercizio_Refactoring_LipariBank.md) |
| `liparibank-day-09.zip` | Soluzione completa del progetto finale | [Consegna](./07_README_e_Consegna.md) |

### Creare checkpoint nella tua repository
Un *tag* è un'etichetta fissa su un commit. Usalo per segnare la fine di ogni fase. Dentro `liparibank/`:

```bash
git tag -a fase-1-filtro-conto -m "Filtro per conto completato"
```

```bash
git push origin fase-1-filtro-conto
```

Per tornare a guardare quello stato senza perdere il lavoro corrente, crea un branch dedicato a partire dal tag:

```bash
git switch -c recovery/fase-1 fase-1-filtro-conto
```

---

## ⚠️ Common Mistakes
- **Commit `git add .` alla cieca**: può includere `.env` o `dist/`. Aggiungi file espliciti o rivedi `git status`.
- **Messaggi vaghi** ("fix", "aggiornato"): scrivi cosa è cambiato.
- **Lavorare direttamente su `main`**: crea sempre un branch.
- **Conflitto risolto lasciando i marcatori** `<<<<<<<`: l'app non compila. Cerca `<<<<<<<` prima del commit.
- **`.env` committato "solo una volta"**: resta nella storia. Prevenzione: `.gitignore` prima di creare il file.
- **Dimenticare `git pull` su `main`** prima di creare un nuovo branch.

---

## ✅ Checklist
- ☐ `.gitignore` copre `node_modules`, `dist`, `.env`, `.env.*` (con eccezione per `.env.example`).
- ☐ Ho lavorato su un branch per fase.
- ☐ I miei commit sono piccoli e usano `feat/fix/refactor/docs/chore`.
- ☐ Ho pubblicato il branch con `git push -u origin`.
- ☐ So risolvere un conflitto e annullare un merge.
- ☐ `git ls-files` non mostra `.env`, `node_modules`, `dist`.

---

## 🚀 Challenge
Aggiungi una piccola Pull Request "a te stesso" per la Fase 2: scrivi nella descrizione il requisito coperto (`REQ-01`) e il percorso manuale con cui lo hai verificato.

---

## 📌 Recap
- Un branch per funzionalità, `main` sempre funzionante.
- Commit piccoli con messaggi `tipo(ambito): descrizione`.
- I conflitti si risolvono scegliendo/combinando e rimuovendo i marcatori, poi `add` e `commit`.
- Mai commitare `.env`, `node_modules`, `dist`; versiona `.env.example`.

---

### ➡️ Next
Prossimo capitolo: [04 · Refactoring e test manuale](./04_Refactoring_e_Test_Manuale.md). Come rivedere il codice e dimostrare, con casi di prova scritti, che ogni requisito è rispettato.
