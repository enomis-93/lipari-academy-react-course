# 🏦 LipariBank — React Zero to Hero

> **Day 8 · Capitolo 06**
> **Argomento:** Repository Starter e Checkpoint
> **Durata stimata:** 25 minuti
> **Parte di LipariBank:** punto di ripartenza opzionale (CHECKPOINT 7) e mappa dei checkpoint intermedi

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- decidere se usare la tua repository o una repository starter del corso;
- ripartire da un checkpoint (clone, branch, installazione, avvio) e verificarlo;
- descrivere il contenuto, i gap e le verifiche del **CHECKPOINT 7**;
- usare la tabella dei checkpoint 1–7 per riallinearti in qualunque giorno.

---

## 📋 Prerequisiti
- [Git Workflow](./05_Git_Workflow.md) e [Git e GitHub](../Day_00_Setup/04_Git_GitHub.md).
- [Piano di Implementazione](./04_Piano_di_Implementazione.md).
- Node 22 LTS installato (`node --version`).

---

## 🧭 In questo capitolo
- Quando serve una repository starter.
- Come ripartire da un checkpoint, passo per passo.
- CHECKPOINT 7 in dettaglio.
- Tabella dei checkpoint 1–7 e segnaposto per URL e branch.
- Come creare checkpoint nella tua repository.

---

## 🧠 Theory

### Due modi di lavorare
1. **La tua repository** (consigliata): quella creata nel Day 0. I checkpoint sono commit o *tag* che crei tu.
2. **Una repository starter del corso** (opzionale): se il docente o la piattaforma ne fornisce una, contiene i checkpoint come branch o tag. Serve se sei rimasto indietro o se vuoi confrontare il tuo codice.

È disponibile anche una raccolta di [cartelle autonome per giorno](../repositories/README.md): `Day_00`–`Day_09`. Ogni cartella rappresenta la fine del giorno; per iniziare il progetto finale dal Day 7 usa `Day_07`. Se ricevi un archivio ZIP, estrailo, entra nella cartella del progetto e avvia `npm install` seguito da `npm run dev`. Non servono clone o branch Git per usare gli ZIP. I collegamenti per il download saranno disponibili solo dopo la pubblicazione.

### Perché i checkpoint
Il corso è cumulativo: ogni giorno parte dallo stato del precedente. Se un giorno si blocca, il checkpoint corrispondente ti permette di riprendere senza rifare tutto.

> 💡 **Remember**
>
> Questo corso **non** definisce URL o branch propri: finché non vengono forniti, nei file compaiono segnaposto da compilare. Non inventare indirizzi e non copiare link da fonti non fidate.

---

## 💻 Let's Code

### Ripartire da un checkpoint della repository starter
Sostituisci i segnaposto `<URL_REPOSITORY>`, `<NOME_BRANCH>` e `<CARTELLA>` con i valori reali che ti vengono forniti (vedi sezione sotto). Esegui dalla cartella di lavoro che contiene i tuoi progetti, **non** dentro un altro progetto.

Clona la repository in una nuova cartella:

```bash
git clone <URL_REPOSITORY> <CARTELLA>
```

Entra nella cartella e passa al branch del checkpoint:

```bash
cd <CARTELLA>
```

```bash
git switch <NOME_BRANCH>
```

Se il progetto React è in una sottocartella (per esempio `liparibank/`), entraci:

```bash
cd liparibank
```

Installa le dipendenze (dentro la cartella che contiene `package.json`):

```bash
npm install
```

Avvia e verifica:

```bash
npm run dev
```

Apri `http://localhost:5173/`. Se la porta è occupata, Vite ne propone un'altra e la stampa nel terminale.

Cosa fa: `git clone` copia la storia, `git switch` si posiziona sul checkpoint, `npm install` ricrea `node_modules` (non è mai nel repository). Come usarlo bene: lavora su un **nuovo branch** a partire dal checkpoint (`git switch -c feature/<COSA>`), non sul branch del checkpoint. Da evitare: copiare a mano file da una repo all'altra senza capire cosa cambia.

### Creare checkpoint nella tua repository
Un *tag* è un'etichetta fissa su un commit. Dentro `liparibank/`, a fine Day 7:

```bash
git tag -a checkpoint-6-routing -m "Routing completato"
```

```bash
git push origin checkpoint-6-routing
```

Per tornare a guardare quello stato senza perdere il lavoro corrente (lavora sempre in un branch dedicato):

```bash
git switch -c recovery/checkpoint-6 checkpoint-6-routing
```

I nomi `checkpoint-N-...` sono un suggerimento per la **tua** repository; per la repository ufficiale useranno i nomi reali che verranno indicati.

---

## 🏦 LipariBank in action

### CHECKPOINT 7 — Progetto finale

**Contenuto iniziale (starter):** LipariBank a fine Day 7: `BankContext` e `SettingsContext`, hooks in `src/hooks/`, service layer in `src/services/`, router con `src/pages/` e `src/layouts/`, `ErrorBoundary`; dati in `public/data/` e `src/data/mockData.js`.

**Cosa deve essere completato (da te):**
- tutti i requisiti **Must** `REQ-01…REQ-05`, `REQ-07…REQ-11` e `NFR-01`, `NFR-02`, `NFR-05` ([Requirements](./02_Requirements_Funzionali.md));
- i **Should** `REQ-06`, `REQ-12`, `REQ-13` se il tempo lo consente;
- rifinitura e documentazione nel Day 9.

**Cosa deve essere già funzionante nello starter:**
- navigazione tra le sei rotte e 404;
- caricamento dei movimenti da JSON locale con stato di caricamento e di errore;
- bonifico simulato base che aggiunge un movimento allo state;
- `npm run dev`, `npm run build`.

**Come verificare il risultato (stato finale atteso):**

| Verifica | Risultato atteso |
|---|---|
| `npm run lint` | nessun errore |
| `npm run build` | termina senza errori, crea `dist/` |
| `/` | saldo totale 17.050,75 € e 5 movimenti, il più recente "Spesa supermercato" |
| `/accounts/xyz` | messaggio "Conto non trovato" |
| `/transactions` + "utenza" + "Uscite" | 2 movimenti |
| `/transfer` con 5.000,00 € dal Conto Corrente | errore sul campo importo, nessun nuovo movimento |
| `/transfer` con 100,00 € a Giulia Bianchi | conferma, nuovo movimento −100,00 €, saldo Conto Corrente 4.150,75 € |
| Rinomina temporanea di `public/data/transactions.json` | messaggio di errore (poi ripristina il file) |

**URL e branch:**
- URL: `[DA CONFIGURARE: inserire URL reale della repository]`
- Branch: `[DA CONFIGURARE: inserire nome reale del branch]`

### Tabella dei checkpoint 1–7

| # | Nome | Capitolo | Funzionante al checkpoint | Come verificare |
|---|---|---|---|---|
| 1 | Prima dashboard | [Day 1 · 06](../Day_01_React_Fundamentals/06_Esercizio_LipariBank_Dashboard.md) | `Header`, `BalanceCard`, `RecentTransactions` con dati da array locale | `npm run dev`: vedi nome cliente, saldo totale, ultimi 5 movimenti |
| 2 | Conti e componenti riutilizzabili | [Day 2 · 06](../Day_02_Components_Props/06_Esercizio_LipariBank_Accounts.md) | `Card`, `AccountCard`, `AccountList`, `TransactionList`, `EmptyState`, `Dashboard` container | due conti visibili; importi verdi/rossi; stato vuoto con lista vuota |
| 3 | Gestione dello state | [Day 3 · 06](../Day_03_State_Events/07_Esercizio_LipariBank_Transactions.md) | selezione conto, nascondi saldo, filtri tipo e testo | clic su un conto; il filtro "Uscite" riduce la lista |
| 4 | Form bonifico | [Day 4 · 05](../Day_04_Forms_User_Input/06_Esercizio_LipariBank_Bonifico.md) e [06](../Day_04_Forms_User_Input/06_Repository_Checkpoint.md) | `TransferForm`, `validators.js`, bonifico simulato nello state | importo 0 → errore; importo valido → nuovo movimento |
| 5 | Integrazione API | [Day 5 · 06](../Day_05_Effects_API/06_Esercizio_LipariBank_API_Transactions.md) | `transactionService`, `useEffect` + `AbortController`, loading/error/empty | spinner all'avvio; con file JSON assente → errore |
| 6 | Routing | [Day 6 · 06](../Day_06_Routing/06_Esercizio_LipariBank_MultiPage.md) | `BrowserRouter`, `AppLayout`, 6 rotte, `useParams`, 404 | `/accounts/acc-001` apre il dettaglio; `/qualcosa` mostra la 404 |
| 7 | Progetto finale | questo capitolo | tutti i Must (vedi sopra) | tabella di verifica sopra |

I **checkpoint 1–6** sono *stati intermedi di avanzamento* (cosa devi avere a fine di ciascun giorno). Per ciascuno, il "contenuto iniziale" è lo stato di fine del checkpoint precedente (per il 1: progetto vuoto del Day 0) e "da completare" è l'esercizio del capitolo indicato.

### Segnaposto per URL e branch
Compila questa tabella con i valori reali **solo** quando ti vengono forniti. Finché non lo sono, lasciala invariata.

| Checkpoint | URL repository | Branch |
|---|---|---|
| 1 Prima dashboard | `[DA CONFIGURARE: inserire URL reale della repository]` | `[DA CONFIGURARE: inserire nome reale del branch]` |
| 2 Conti e componenti | `[DA CONFIGURARE: inserire URL reale della repository]` | `[DA CONFIGURARE: inserire nome reale del branch]` |
| 3 State | `[DA CONFIGURARE: inserire URL reale della repository]` | `[DA CONFIGURARE: inserire nome reale del branch]` |
| 4 Form bonifico | `[DA CONFIGURARE: inserire URL reale della repository]` | `[DA CONFIGURARE: inserire nome reale del branch]` |
| 5 API | `[DA CONFIGURARE: inserire URL reale della repository]` | `[DA CONFIGURARE: inserire nome reale del branch]` |
| 6 Routing | `[DA CONFIGURARE: inserire URL reale della repository]` | `[DA CONFIGURARE: inserire nome reale del branch]` |
| 7 Progetto finale | `[DA CONFIGURARE: inserire URL reale della repository]` | `[DA CONFIGURARE: inserire nome reale del branch]` |

---

## 🧪 Your Turn

**Obiettivo:** creare i tuoi checkpoint e provare un ripristino.

**Requisiti**
1. Nella **tua** repository, crea i tag `checkpoint-1-dashboard` … `checkpoint-6-routing` sui commit che corrispondono alla fine di ciascun giorno (se non hai commit separati, crea almeno `checkpoint-6-routing` sull'ultimo commit stabile del Day 6/8).
2. Pubblica i tag con `git push origin <NOME_TAG>`.
3. Clona la tua repository in una **cartella nuova**, fai `npm install`, `npm run dev`, e controlla che l'app parta: è la prova che il repository è completo.
4. Compila la tabella di verifica del CHECKPOINT 7 con ✅/❌ per ciascuna riga sulla tua app.

**Passi suggeriti**
- Per elencare i commit e scegliere dove mettere un tag: `git log --oneline`.
- Per vedere i tag locali: `git tag`.

**Risultato atteso:** i tag esistono sul remote; il clone pulito si avvia; la tabella del CHECKPOINT 7 è compilata.

**Criteri di completamento:** il clone funziona senza file copiati a mano; ogni ❌ è collegato a un requisito del piano.

---

## 🔗 Repository / Checkpoint

Nessuna repository ufficiale è referenziata in questo corso finché non viene fornita. Usa i segnaposto:

- URL: `[DA CONFIGURARE: inserire URL reale della repository]`
- Branch: `[DA CONFIGURARE: inserire nome reale del branch]`

---

## ⚠️ Common Mistakes
- **Dimenticare `npm install`** dopo il clone: `node_modules` non è nel repository.
- **Lanciare i comandi nella cartella sbagliata**: `package.json` deve essere nella cartella corrente.
- **Lavorare direttamente sul branch del checkpoint**: crea un branch di lavoro.
- **Usare un URL "trovato in rete"** al posto di quello fornito: usa solo quello ufficiale.
- **Tag duplicato**: se il tag esiste già, Git rifiuta; scegli un nome diverso o elimina il tag locale sbagliato con `git tag -d <NOME_TAG>`.

---

## ✅ Checklist
- ☐ So come ripartire da un checkpoint con clone, branch, `npm install`, `npm run dev`.
- ☐ Ho creato tag di checkpoint nella mia repository.
- ☐ Ho verificato un clone pulito della mia repo.
- ☐ Ho compilato la tabella di verifica del CHECKPOINT 7.
- ☐ Non ho inventato nessun URL o branch.

---

## 🚀 Challenge
Scrivi un breve `CHECKPOINTS.md` nella tua repo (fuori da `src/`) con i tuoi tag, il commit di ciascuno e una riga su cosa funzionava a quel punto.

---

## 📌 Recap
- Puoi lavorare dalla tua repo o da una starter fornita dal corso.
- Ripartire = clone → branch → `npm install` → `npm run dev` → verifica.
- CHECKPOINT 7 è l'app con tutti i Must completati.
- URL e branch ufficiali sono segnaposto finché non vengono forniti.

---

### ➡️ Next
Prossimo capitolo: [Day 9 · Refactoring Finale](../Day_09_Delivery/01_Refactoring_Finale.md) — con tutti i Must in piedi, si passa alla revisione del codice, alla rimozione di duplicazioni e al lint.
