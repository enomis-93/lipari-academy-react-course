# 🏦 LipariBank — React Zero to Hero

> **Day 9 · Capitolo 02**
> **Argomento:** Architettura e piano di lavoro
> **Durata stimata:** 35 minuti
> **Parte di LipariBank:** dove va il codice che manca e in quale ordine scriverlo, fase per fase

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- indicare, per ogni funzionalità mancante, in quali file intervenire rispettando la struttura del progetto;
- ordinare il lavoro in fasi con un tempo massimo e una definizione di "fatto";
- chiudere ogni fase con le stesse verifiche;
- adattare il piano a ciò che è emerso dal tuo audit.

---

## 📋 Prerequisiti
- [Capitolo 01 — Brief e requisiti](./01_Brief_e_Requisiti.md): hai l'elenco di ciò che manca.
- [Day 8 · Architettura del progetto](../Day_08_Advanced_Hooks_Architecture/04_Architettura_del_Progetto.md): cartelle, convenzioni e direzione delle dipendenze.

---

## 🧭 In questo capitolo
- Richiamo dell'architettura: dove vive ogni dato.
- Dove intervenire per i tre requisiti di lavoro autonomo.
- Come ordinare il lavoro e che cos'è un timebox.
- Le fasi, con la loro definizione di "fatto".
- Il tabellone di avanzamento.

---

## 🧠 Theory

### L'architettura in una tabella
La struttura è quella del [Day 8](../Day_08_Advanced_Hooks_Architecture/04_Architettura_del_Progetto.md): non la ripetiamo. Per il progetto finale ti serve soprattutto sapere **dove vive ogni dato**.

| Dato | Dove vive | Chi lo cambia |
|---|---|---|
| Conti e saldi | Store Redux (`accountsSlice`) | `fetchAccounts`, `transferAdded` |
| Movimenti e preferiti | Store Redux (`transactionsSlice`) | `fetchTransactions`, `transferAdded`, `favoriteToggled` |
| Caricamento ed errore | Store Redux, letti con `useBankStatus()` | I thunk |
| "Nascondi saldi" | `SettingsContext`, salvato con `useLocalStorage` | `toggleHideBalance` |
| Filtri, ricerca, conto selezionato | State locale della pagina | La pagina stessa |
| Valori del form bonifico | `useTransferForm` | Il form |
| Cliente e beneficiari | `src/data/mockData.js` | Nessuno: sono dati fissi |

### Dove intervenire
Prima di scrivere una riga, per ogni requisito 🛠️ rispondi a due domande: **il dato esiste già?** e **chi lo sa già calcolare?**

| Requisito | Il dato esiste? | Chi sa già fare il lavoro |
|---|---|---|
| REQ-06 Filtro per conto | Sì: i movimenti hanno `accountId` e l'elenco dei conti è nello store | Guarda i parametri di `useTransactions` |
| REQ-01 Ultimi 5 movimenti | Sì: tutti i movimenti sono nello store | `useTransactions` li restituisce già ordinati; `TransactionList` e `Card` li mostrano |
| REQ-02 Stato vuoto dei conti | Sì: `accounts` può essere un array vuoto | `EmptyState` esiste già |

In nessuno dei tre casi serve toccare lo store, i service o creare componenti nuovi. È il risultato del lavoro dei Day 7 e 8: quando la struttura è buona, una funzionalità nuova è soprattutto *composizione* di pezzi esistenti.

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

Il "codice" di questo capitolo sono i comandi di verifica che chiudono **ogni** fase. Dentro `liparibank/`:

```bash
npm run lint
```

```bash
npm run build
```

Poi avvia l'app e fai il percorso manuale indicato dalla fase:

```bash
npm run dev
```

Lint e build intercettano errori di sintassi, import mancanti, variabili inutilizzate; il percorso manuale intercetta i problemi di comportamento. Vanno eseguiti **prima** del commit che chiude la fase. Da evitare: fare un commit con la build rotta "tanto la sistemo dopo".

### Le fasi

#### Fase 0 — Base pulita (20 min)
- **Branch:** `chore/baseline`
- **Attività:** lint e build senza errori; nessun `console.log` rimasto; `.gitignore` in ordine (lo completi nel [capitolo 03](./03_Git_Workflow.md)).
- **Requisiti:** NFR-01, NFR-02.
- **Fatto quando:** `npm run lint` e `npm run build` passano e il commit di partenza esiste.

#### Fase 1 — Filtro per conto (40 min)
- **Branch:** `feature/account-filter`
- **Attività:** nella pagina Movimenti l'utente può scegliere "Tutti i conti" oppure un conto; la scelta si combina con il filtro per tipo e con la ricerca.
- **Requisiti:** REQ-06.
- **Fatto quando:** "Conto Risparmio" → 2 movimenti; "Conto Risparmio" + "Uscite" → stato vuoto; "Conto Corrente" + `utenza` → 2 movimenti; "Tutti i conti" → 8 movimenti. Il campo ha una `<label>` collegata.

#### Fase 2 — Ultimi movimenti in dashboard (30 min)
- **Branch:** `feature/recent-transactions`
- **Attività:** la dashboard mostra una card "Ultimi movimenti" con i 5 movimenti più recenti di tutti i conti.
- **Requisiti:** REQ-01.
- **Fatto quando:** la card elenca, nell'ordine, Spesa supermercato, Pagamento utenza luce, Stipendio, Abbonamento palestra, Rimborso spese; dopo un bonifico simulato il nuovo movimento è il primo della card; il pulsante "Preferito" funziona anche lì.

#### Fase 3 — Stato vuoto dei conti (15 min)
- **Branch:** `feature/accounts-empty-state`
- **Attività:** quando non ci sono conti, la pagina Conti mostra un messaggio invece di un elenco vuoto; anche la dashboard non deve andare in errore.
- **Requisiti:** REQ-02.
- **Fatto quando:** con `public/data/accounts.json` ridotto a `[]`, sia `/accounts` sia `/` mostrano "Nessun conto disponibile." senza errori in console. **Poi ripristina il file.**

#### Fase 4 — Accessibilità e responsive (60 min)
- **Branch:** `feature/a11y-responsive`
- **Attività:** quelle guidate nel [capitolo 05](./05_Accessibility_e_Responsive.md).
- **Requisiti:** NFR-03, NFR-04.
- **Fatto quando:** le verifiche da tastiera e a 360 px del capitolo 05 passano.

#### Fase 5 — Verifica, build e consegna (90 min)
- **Branch:** `chore/delivery`
- **Attività:** revisione e test manuale ([capitolo 04](./04_Refactoring_e_Test_Manuale.md)), variabili d'ambiente e build ([capitolo 06](./06_Environment_e_Deploy.md)), README e consegna ([capitolo 07](./07_README_e_Consegna.md)).
- **Requisiti:** tutti i Must; NFR-01, NFR-02, NFR-05.
- **Fatto quando:** la checklist di consegna del capitolo 07 è completa.

L'ordine di lettura dei capitoli e l'ordine di lavoro non coincidono: leggi prima i capitoli 03 e 04 (come usare Git e come verificare), poi esegui le fasi.

---

## 🏦 LipariBank in action

### Tabellone di avanzamento
Copialo nei tuoi appunti e aggiornalo alla fine di ogni fase.

| Fase | Timebox | Requisiti | Branch | Inizio | Fine | Stato |
|---|---|---|---|---|---|---|
| 0 Base pulita | 20 min | NFR-01, NFR-02 | `chore/baseline` | | | ☐ |
| 1 Filtro per conto | 40 min | REQ-06 | `feature/account-filter` | | | ☐ |
| 2 Ultimi movimenti | 30 min | REQ-01 | `feature/recent-transactions` | | | ☐ |
| 3 Stato vuoto dei conti | 15 min | REQ-02 | `feature/accounts-empty-state` | | | ☐ |
| 4 Accessibilità e responsive | 60 min | NFR-03, NFR-04 | `feature/a11y-responsive` | | | ☐ |
| 5 Verifica, build e consegna | 90 min | Must, NFR-01/02/05 | `chore/delivery` | | | ☐ |

Le fasi 1, 2 e 3 sono indipendenti tra loro: puoi farle in qualsiasi ordine. REQ-06 è uno *Should*: se il tempo stringe, fai prima le fasi 2 e 3, che sono *Must*.

---

## 🧪 Your Turn

**Obiettivo:** pianificare *il tuo* completamento ed eseguire la prima fase.

**Requisiti:**
1. Aggiungi al tabellone le attività emerse dal tuo audit che non rientrano nei tre requisiti 🛠️, ognuna con il requisito che copre.
2. Assegna a ogni fase una sessione di lavoro realistica.
3. Per le fasi 1, 2 e 3 scrivi, **prima di programmare**, quali file pensi di modificare.
4. Esegui la **Fase 0** adesso.

**Passi suggeriti:**
1. Per il punto 3 usa la tabella "Dove intervenire": per ogni requisito dovresti arrivare a uno o due file.
2. Se hai un solo pomeriggio, completa le fasi 0, 2, 3 e 5, e rimanda la 1 e la 4.

**Risultato atteso:** un piano personalizzato e la Fase 0 chiusa con un commit.

**Criteri di completamento:** `npm run lint` e `npm run build` passano; il tabellone ha una sessione per ogni fase; per le fasi 1-3 hai indicato i file.

> ⚠️ **Prova prima da solo.** Qui sotto trovi la risposta al punto 3, non il codice.

### Soluzione di riferimento — i file da modificare
- **REQ-06:** solo `src/pages/TransactionsPage.jsx`. Uno state locale per il conto scelto, un `<select>` con la sua `<label>`, e `accountId` passato a `useTransactions`.
- **REQ-01:** solo `src/pages/DashboardPage.jsx`. Una seconda chiamata a `useTransactions`, senza parametri, i primi 5 elementi, e una `Card` con `TransactionList`.
- **REQ-02:** `src/pages/AccountsPage.jsx` e `src/pages/DashboardPage.jsx`. Un controllo su `accounts.length` dopo le guardie di caricamento ed errore, con `EmptyState`.

Il codice completo è nel checkpoint `liparibank-day-09.zip`.

---

## ⚠️ Common Mistakes
- **Cominciare dalle rifiniture grafiche** prima dei Must.
- **Fase "infinita"**: nessun timebox → deriva. Se un timebox scade, ridimensiona.
- **Cambiare più cose senza verificare**: un'ora di modifiche senza avviare l'app rende i bug introvabili.
- **Dichiarare "fatto" senza DoD**: usa i numeri concreti (4.150,75 €, 16.950,75 €, 2 risultati).
- **Dimenticare di ripristinare** i file JSON rinominati per le prove di errore.
- **Creare file nuovi senza chiedersi se ne esiste già uno adatto**: i tre requisiti si risolvono componendo hook e componenti esistenti.
- **Mettere nello store il filtro per conto**: serve a una sola pagina, è state locale.
- **Due fonti di verità** per lo stesso dato (per esempio una copia dei movimenti nello state di una pagina): divergeranno.

---

## ✅ Checklist
- ☐ So dire dove vive ogni dato di LipariBank.
- ☐ Per ogni requisito 🛠️ so quali file modificare.
- ☐ Ogni fase ha un timebox e una definizione di "fatto".
- ☐ Ho un tabellone con le mie sessioni di lavoro.
- ☐ La Fase 0 è chiusa: lint e build passano, il commit esiste.

---

## 🚀 Challenge
Stima quanto tempo ti servirà per ogni fase **prima** di cominciare e annota il tempo reale alla fine. Di quanto hai sbagliato, e in quale direzione? Stimare è un'abilità che si allena solo confrontando la previsione con il risultato.

---

## 📌 Recap
- Sapere dove vive ogni dato dice dove intervenire.
- I tre requisiti mancanti si risolvono nelle pagine, riusando hook e componenti esistenti.
- Prima i Must; ogni fase ha un tempo massimo e una definizione di "fatto".
- Le stesse verifiche chiudono ogni fase: lint, build, percorso manuale.
- Il tabellone rende visibile l'avanzamento.

---

### ➡️ Next
Prossimo capitolo: [03 · Git workflow](./03_Git_Workflow.md). Un branch per fase, commit piccoli e nessun segreto nella repository.
