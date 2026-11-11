# 🏦 LipariBank — React Zero to Hero

> **Day 8 · Capitolo 04**
> **Argomento:** Piano di Implementazione
> **Durata stimata:** 30 minuti di lettura + lavoro guidato (circa 5 ore e 30 di sviluppo, in più sessioni)
> **Parte di LipariBank:** completamento dell'app per fasi, ciascuna con timebox e definizione di "fatto"

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- suddividere il completamento di LipariBank in fasi con tempo massimo (*timebox*);
- decidere l'ordine in cui lavorare partendo dai requisiti Must;
- usare la **Definition of Done** di ogni fase per dichiarare "finito";
- registrare l'avanzamento in modo che sia verificabile.

---

## 📋 Prerequisiti
- [Requirements Funzionali](./02_Requirements_Funzionali.md) e [Architettura](./03_Architettura.md).
- Tabella di audit del [Brief](./01_Final_Project_Brief.md) compilata.
- Nozioni base di Git (Day 0): il workflow completo è nel [capitolo 05](./05_Git_Workflow.md).

---

## 🧭 In questo capitolo
- Principi per ordinare il lavoro.
- Le 7 fasi (0–6) con obiettivi, attività, requisiti coperti e DoD.
- Un tabellone di avanzamento.
- Cosa fare se sei in ritardo.

---

## 🧠 Theory

### Come ordinare il lavoro
1. **Prima ciò che sblocca altro**: dati e state prima delle pagine che li usano.
2. **Prima i Must**, poi Should, poi Could.
3. **Fette verticali**: completa una funzionalità dall'interfaccia ai dati prima di passare alla successiva.
4. **Verifica a ogni fase**: dopo ogni fase l'app deve avviarsi, lint e build devono passare.

### Timebox
Un timebox è un tempo massimo. Se lo superi, **non estendere in silenzio**: riduci l'ambito (sposta un Should in fondo) o chiedi aiuto. I tempi sotto sono indicativi per chi parte da un'app Day 7 sana.

> 💡 **Remember**
>
> Una fase è "fatta" quando tutti i punti della sua *Definition of Done* sono veri, non quando "ho scritto il codice".

---

## 💻 Let's Code

Il "codice" di questo capitolo sono i comandi di verifica che chiudono ogni fase. Esegui, dentro `liparibank/`:

```bash
npm run lint
```

```bash
npm run build
```

Poi avvia l'app e fai il percorso manuale descritto nella DoD della fase:

```bash
npm run dev
```

Cosa fanno: lint e build intercettano errori di sintassi, import mancanti, variabili inutilizzate; il percorso manuale intercetta i problemi di comportamento. Come usarli: al termine di ogni fase, **prima** del commit finale della fase. Da evitare: fare commit con la build rotta "tanto la sistemo dopo".

### Le fasi

#### Fase 0 — Audit e base pulita (30 min)
- **Branch:** `chore/baseline`
- **Attività:** esegui lint e build; correggi errori bloccanti; rimuovi boilerplate Vite rimasto (`src/assets/` inutilizzato, `App.css` se non usato); verifica `.gitignore` (il template Vite ignora `node_modules`, `dist` e `*.local`, ma **non** `.env`: lo sistemi nel [Git Workflow](./05_Git_Workflow.md)) ed esistenza di `.env.example` (lo completi nel Day 9); crea il tag o il commit "baseline".
- **Requisiti:** NFR-01 (parziale), NFR-02.
- **DoD:** `npm run lint` e `npm run build` passano; `npm run dev` parte; il commit "baseline" esiste.

#### Fase 1 — Dati, servizi e state (45 min)
- **Branch:** `feature/data-layer`
- **Attività:** verifica `public/data/accounts.json` e `transactions.json` (stessi dati canonici di `mockData.js`); controlla `apiClient.js`, `transactionService.js`, `accountService.js` (supporto `signal`, errore su risposta non `ok`); verifica che `bankReducer.js` gestisca `LOAD_START`, `LOAD_SUCCESS`, `LOAD_ERROR`, `ADD_TRANSFER` e che il saldo mostrato sia derivato.
- **Requisiti:** REQ-10 (parte dati), base di REQ-08.
- **DoD:** nella scheda Network vedi le richieste ai due JSON; lo state iniziale, di successo e di errore è corretto (prova rinominando temporaneamente un file JSON: il server di Vite risponde con `index.html` invece di un 404, quindi l'errore nasce dalla lettura del JSON, non da `response.ok`; il tuo codice deve gestire entrambi i casi); nessun fetch dentro i componenti presentazionali.

#### Fase 2 — Dashboard e conti (60 min)
- **Branch:** `feature/dashboard-accounts`
- **Attività:** completa `DashboardPage` (saldo totale, nascondi/mostra, ultimi 5 movimenti ordinati); `AccountsPage` con `AccountList`; `AccountDetailPage` con gestione del conto inesistente; persistenza di `hideBalance` con `useLocalStorage`.
- **Requisiti:** REQ-01, REQ-02, REQ-03, REQ-12.
- **DoD:** i criteri di REQ-01/02/03 passano a mano; `/accounts/xyz` mostra "Conto non trovato" senza errori in console; ricaricando la pagina il saldo nascosto resta nascosto.

#### Fase 3 — Movimenti e filtri (60 min)
- **Branch:** `feature/transactions-filters`
- **Attività:** `TransactionsPage` con `TransactionFilters` (tipo, testo, conto); filtri combinabili; `EmptyState` quando nessun risultato; riuso di `TransactionList`/`TransactionItem` in dashboard, dettaglio conto e pagina movimenti.
- **Requisiti:** REQ-04, REQ-05, REQ-06, REQ-11.
- **DoD:** `utenza` + "Uscite" → 2 risultati (luce e gas); `utenza` + "Entrate" → stato vuoto; "Conto Risparmio" → 2 movimenti; nessuna copia del markup di una riga movimento.

#### Fase 4 — Bonifico simulato (60 min)
- **Branch:** `feature/transfer`
- **Attività:** `TransferForm` + `useTransferForm` + `validateTransfer`; conferma di successo; `ADD_TRANSFER`; saldo e movimenti aggiornati; form svuotato dopo il successo; importo > saldo disponibile rifiutato.
- **Requisiti:** REQ-07, REQ-08.
- **DoD:** bonifico di 100,00 € dal Conto Corrente a Giulia Bianchi → nuovo movimento −100,00 €, saldo Conto Corrente 4.150,75 €, saldo totale 16.950,75 €; bonifico di 5.000,00 € dal Conto Corrente → errore, nessun movimento.

#### Fase 5 — Navigazione, stati UX e robustezza (45 min)
- **Branch:** `feature/ux-states`
- **Attività:** `AppLayout` con `NavLink` e voce attiva; `NotFoundPage` con link alla dashboard; `LoadingMessage`, `ErrorMessage`, `EmptyState` in **tutte** le pagine che dipendono dai dati; `ErrorBoundary` attivo.
- **Requisiti:** REQ-09, REQ-10, REQ-13.
- **DoD:** URL inesistente → 404; con rete lenta (throttling nel browser) si vede il caricamento; con risorsa bloccata si vede l'errore; nessuna pagina bianca in nessuno scenario.

#### Fase 6 — Rifinitura e checkpoint (30 min)
- **Branch:** `chore/final-polish`
- **Attività:** chiudi i Should rimasti (REQ-13 se non l'hai già fatto nella Fase 5); REQ-14 (Could) solo se resta tempo; controlla i nomi; crea il CHECKPOINT 7 (vedi [Repository Starter e Checkpoint](./06_Repository_Starter_e_Checkpoint.md)); apri il Day 9.
- **Requisiti:** tutti i Must soddisfatti.
- **DoD:** tabella requisiti con tutti i Must ✔; lint e build passano; merge su `main`; tag di checkpoint creato.

---

## 🏦 LipariBank in action

### Tabellone di avanzamento
Copialo nei tuoi appunti e aggiornalo a fine di ogni fase.

| Fase | Timebox | Requisiti | Branch | Data inizio | Data fine | Stato |
|---|---|---|---|---|---|---|
| 0 Audit e base pulita | 30 min | NFR-01/02 | `chore/baseline` | | | ☐ |
| 1 Dati, servizi, state | 45 min | REQ-10 (dati), REQ-08 (base) | `feature/data-layer` | | | ☐ |
| 2 Dashboard e conti | 60 min | REQ-01/02/03/12 | `feature/dashboard-accounts` | | | ☐ |
| 3 Movimenti e filtri | 60 min | REQ-04/05/06/11 | `feature/transactions-filters` | | | ☐ |
| 4 Bonifico simulato | 60 min | REQ-07/08 | `feature/transfer` | | | ☐ |
| 5 Navigazione e stati UX | 45 min | REQ-09/10/13 | `feature/ux-states` | | | ☐ |
| 6 Rifinitura e checkpoint | 30 min | tutti i Must | `chore/final-polish` | | | ☐ |

Ordine di dipendenza: 0 → 1 → (2, 3, 4 in qualsiasi ordine, ma 3 e 4 riusano componenti di 2) → 5 → 6.

---

## 🧪 Your Turn

**Obiettivo:** pianificare *il tuo* completamento, adattando il piano ai gap del tuo audit.

**Requisiti**
1. Per ogni fase, cancella le attività che nella tua app sono già complete (con evidenza: "verificato con REQ-xx").
2. Aggiungi le attività mancanti emerse dall'audit, ognuna con il requisito che copre.
3. Assegna a ogni fase una data o una sessione di lavoro realistica.
4. Esegui la **Fase 0** adesso: lint, build, pulizia boilerplate, commit di baseline.

**Passi suggeriti**
- Se la Fase 1 è già a posto, la verifica comunque va fatta (rinomina un JSON per simulare l'errore, poi ripristinalo).
- Se hai un solo pomeriggio: completa 0, 1, 2, 3, 4 (i Must) e rimanda 5–6.

**Risultato atteso:** piano personalizzato + Fase 0 completata con commit.

**Criteri di completamento:** `npm run lint` e `npm run build` passano; il tabellone ha date per ogni fase.

---

## ⚠️ Common Mistakes
- **Cominciare dalle rifiniture grafiche** prima dei Must.
- **Fase "infinita"**: nessun timebox → deriva. Se un timebox scade, ridimensiona.
- **Cambiare più cose senza verificare**: un'ora di modifiche senza avviare l'app rende i bug introvabili.
- **Dichiarare "fatto" senza DoD**: usa i numeri concreti (4.150,75 €, 16.950,75 €, 2 risultati).
- **Dimenticare di ripristinare** i file JSON rinominati per le prove di errore.

---

## ✅ Checklist
- ☐ Conosco le 7 fasi e la DoD di ciascuna.
- ☐ Ho personalizzato il piano sull'audit.
- ☐ Ho assegnato date/sessioni.
- ☐ Ho completato la Fase 0 con un commit di baseline.
- ☐ So cosa fare se un timebox scade.

---

## 🚀 Challenge
Stima il tempo reale per ogni fase *prima* di farla; a fine Day 8 confronta stima e realtà e scrivi due righe su cosa ti ha sorpreso.

---

## 📌 Recap
- Lavora per fasi corte con tempo massimo e criteri di "fatto" misurabili.
- Dati e state prima, poi pagine; Must prima di Should e Could.
- Lint, build e percorso manuale chiudono ogni fase.
- Il tabellone rende visibile l'avanzamento.

---

### ➡️ Next
Prossimo capitolo: [Git Workflow](./05_Git_Workflow.md) — come trasformare questo piano in branch, commit piccoli e merge ordinati.
