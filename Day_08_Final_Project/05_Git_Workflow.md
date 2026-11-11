# 🏦 LipariBank — React Zero to Hero

> **Day 8 · Capitolo 05**
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
- [Piano di Implementazione](./04_Piano_di_Implementazione.md): le fasi e i nomi di branch.
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
| `refactor` | riorganizza senza cambiare il comportamento | `refactor(utils): estrae filterTransactions` |
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
git switch -c feature/transactions-filters
```

`-c` crea il branch e ci passa sopra. Il nome è quello della fase nel [piano](./04_Piano_di_Implementazione.md).

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
git add src/components/TransactionFilters.jsx src/pages/TransactionsPage.jsx
```

```bash
git commit -m "feat(transactions): aggiunge filtri per tipo e testo"
```

Un secondo commit, per un'altra modifica:

```bash
git add src/utils/transactionFilters.js
```

```bash
git commit -m "refactor(utils): estrae la funzione filterTransactions"
```

### 5. Pubblica il branch
```bash
git push -u origin feature/transactions-filters
```

`-u` collega il branch locale a quello remoto; i `git push` successivi non richiedono argomenti. `origin` è il nome standard del remote.

### 6. Unisci a `main`
**Opzione A — da riga di comando** (lavori da solo):

```bash
git switch main
```

```bash
git merge feature/transactions-filters
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
git branch -d feature/transactions-filters
```

### 7. Conflitti di merge
Un conflitto avviene quando due branch modificano **le stesse righe**. Git si ferma e marca il file:

```text
<<<<<<< HEAD
<h1>Movimenti</h1>
=======
<h1>Elenco movimenti</h1>
>>>>>>> feature/transactions-filters
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

Sequenza completa per la **Fase 3** (movimenti e filtri), con i commit che ti aspetti di vedere in `git log --oneline`:

```text
feat(transactions): aggiunge TransactionFilters con filtro tipo
feat(transactions): aggiunge ricerca per descrizione
feat(transactions): aggiunge filtro per conto
refactor(components): riusa TransactionList in dashboard e dettaglio conto
fix(transactions): mostra EmptyState se nessun risultato
```

Ogni riga corrisponde a un punto verificabile del [requisito REQ-05/06](./02_Requirements_Funzionali.md). Per vedere la storia in forma compatta:

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

Il workflow vale per la **tua** repository (Day 0). Per la repository ufficiale del corso, se presente, vedi il [capitolo 06](./06_Repository_Starter_e_Checkpoint.md).

- URL: `[DA CONFIGURARE: inserire URL reale della repository]`
- Branch: `[DA CONFIGURARE: inserire nome reale del branch]`

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
Aggiungi una piccola Pull Request "a te stesso" per la Fase 4: scrivi nella descrizione i requisiti coperti (`REQ-07`, `REQ-08`) e il percorso manuale con cui li hai verificati.

---

## 📌 Recap
- Un branch per funzionalità, `main` sempre funzionante.
- Commit piccoli con messaggi `tipo(ambito): descrizione`.
- I conflitti si risolvono scegliendo/combinando e rimuovendo i marcatori, poi `add` e `commit`.
- Mai commitare `.env`, `node_modules`, `dist`; versiona `.env.example`.

---

### ➡️ Next
Prossimo capitolo: [Repository Starter e Checkpoint](./06_Repository_Starter_e_Checkpoint.md) — come usare (o creare) una repository di partenza e i checkpoint intermedi, incluso il CHECKPOINT 7 del progetto finale.
