# 🏦 LipariBank — React Zero to Hero

> **Day 9 · Capitolo 05**
> **Argomento:** README e Documentazione
> **Durata stimata:** 40 minuti
> **Parte di LipariBank:** il `README.md` del tuo repository, il report di test e le note di progetto

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- scrivere un README che permetta a un estraneo di installare, avviare e capire LipariBank in 5 minuti;
- documentare funzionalità, struttura, variabili d'ambiente, test e limiti noti;
- distinguere ciò che è **verificato** da ciò che non lo è (deploy compreso);
- completare i segnaposto senza inventare link.

---

## 📋 Prerequisiti
- [Environment e Deploy](./04_Environment_e_Deploy.md): `.env.example`, build, preview.
- [Testing Manuale](./02_Testing_Manuale.md): report di test.
- [Requirements Funzionali](../Day_08_Final_Project/02_Requirements_Funzionali.md): elenco requisiti.

---

## 🧭 In questo capitolo
- Cosa deve contenere un buon README.
- Un README completo da copiare e personalizzare.
- Altra documentazione utile (facoltativa).
- Come rileggerlo come un utente nuovo.

---

## 🧠 Theory

Il README è la **porta d'ingresso** del progetto: chi apre la repository (un docente, un collega, tu fra sei mesi) decide lì se capirlo e provarlo. Risponde a sei domande, in ordine:

1. **Cos'è?** (una frase e uno screenshot facoltativo)
2. **Cosa fa?** (funzionalità)
3. **Come lo avvio?** (requisiti, installazione, comandi)
4. **Come è fatto?** (stack, struttura, scelte)
5. **Come lo verifico?** (test, build)
6. **Cosa non fa / limiti?** (onestà)

Regole:
- Comandi in blocchi `bash` copiabili, con indicazione della cartella.
- Niente segreti, niente percorsi personali (`C:\Users\...`).
- Niente affermazioni non verificate: un deploy non eseguito **non** si descrive come online.
- Segnaposto espliciti dove manca un dato reale.

> 💡 **Remember**
>
> Un README si testa: apri una cartella vuota, clona la repo, segui **solo** il README. Se ti blocchi, il README è incompleto.

---

## 💻 Let's Code

Di seguito il README completo da copiare nella radice di `liparibank/` (file `README.md`; Vite non ne genera uno personalizzato, sostituisci quello eventuale del template). Il blocco usa quattro backtick come recinto esterno perché contiene blocchi di codice interni: **copia solo il contenuto**, senza i quattro backtick. Sostituisci tutti i testi tra parentesi quadre `[DA CONFIGURARE: ...]` con valori reali o rimuovi la riga.

````markdown
# LipariBank

App didattica di home banking **fittizia**, costruita con React nel corso "LipariBank — React Zero to Hero". Tutti i dati (cliente, conti, IBAN, movimenti) sono inventati; nessun servizio o banca reale è coinvolto e i bonifici sono solo simulazioni in memoria.

> Screenshot: [DA CONFIGURARE: aggiungere un'immagine in docs/ e linkarla, oppure rimuovere questa riga]

## Funzionalità
- Dashboard con saldo totale (nascondibile) e ultimi 5 movimenti
- Elenco conti e dettaglio conto (`/accounts/:accountId`)
- Elenco movimenti con filtri per tipo (tutti / entrate / uscite), testo e conto
- Bonifico simulato con validazione, messaggi di errore per campo e conferma
- Navigazione multipagina con pagina 404
- Stati di caricamento, errore e assenza di dati
- Preferenza "nascondi saldo" salvata nel browser
- Layout responsive e accessibilità di base

## Stack
- React 19 (Function Components e Hooks)
- Vite 8
- React Router 7 (declarative mode)
- JavaScript, CSS semplice, oxlint

## Requisiti
- Node.js 22 LTS (`node --version`)
- npm (incluso con Node.js)

## Avvio rapido
Dentro la cartella del progetto:

```bash
npm install
```

```bash
npm run dev
```

L'app è disponibile su `http://localhost:5173/` (se la porta è occupata Vite ne sceglie un'altra e la indica nel terminale).

## Script
| Comando | Descrizione |
|---|---|
| `npm run dev` | server di sviluppo |
| `npm run build` | build di produzione in `dist/` |
| `npm run preview` | anteprima locale della build (default `http://localhost:4173/`) |
| `npm run lint` | analisi del codice con oxlint |

## Variabili d'ambiente
Copia `.env.example` in `.env` (il file `.env` non è versionato):

```bash
cp .env.example .env
```

| Variabile | Descrizione | Default |
|---|---|---|
| `VITE_API_BASE_URL` | prefisso degli URL dei dati; vuoto = file statici in `public/data/` | vuoto |
| `VITE_APP_NAME` | nome mostrato nell'intestazione | `LipariBank` |

Solo le variabili con prefisso `VITE_` sono esposte al client e **sono pubbliche**: non inserire segreti.

## Struttura del progetto
```text
src/
├── components/   UI riutilizzabile
├── context/      BankContext (useReducer) e SettingsContext
├── data/         dati fittizi (mockData.js)
├── hooks/        useTransactions, useTransferForm, useLocalStorage
├── layouts/      AppLayout (header, menu, Outlet)
├── pages/        una pagina per rotta
├── services/     apiClient, transactionService, accountService
└── utils/        formatters, validators, funzioni pure
public/data/      accounts.json, transactions.json
```

## Rotte
| Percorso | Pagina |
|---|---|
| `/` | Dashboard |
| `/accounts` | Conti |
| `/accounts/:accountId` | Dettaglio conto |
| `/transactions` | Movimenti |
| `/transfer` | Bonifico simulato |
| `*` | Pagina non trovata |

## Scelte di progetto
- Stato condiviso (movimenti, caricamento, errore) in `BankContext` con `useReducer`; stato di UI (filtri, form) locale ai componenti.
- Il saldo mostrato è un dato derivato: saldo iniziale del conto + bonifici simulati.
- Accesso ai dati isolato nel service layer: per usare un servizio reale si cambiano solo i servizi.
- I dati arrivano da file JSON statici in `public/data/`: non è un'API reale.

## Test
Test manuali documentati in [docs/TEST_REPORT.md](docs/TEST_REPORT.md). Non ci sono test automatici in questo progetto.

Prima di consegnare: `npm run lint` (nessun errore né warning) e `npm run build` senza errori.

## Deploy
- Stato: [DA CONFIGURARE: "non eseguito" oppure descrivere servizio e data]
- URL: [DA CONFIGURARE: inserire URL del deploy, se disponibile]
- La build (`dist/`) è statica. Con React Router serve un fallback che riscriva tutte le rotte a `index.html`. Per pubblicare in un sotto-percorso si imposta `base` in Vite e `basename` nel router.

## Limiti noti
- I bonifici non vengono salvati: ricaricando la pagina si perdono.
- Nessuna autenticazione né back-end.
- [DA CONFIGURARE: aggiungere eventuali limiti emersi dai test]

## Autore
[DA CONFIGURARE: nome e cognome] — corso "LipariBank — React Zero to Hero"

Repository: [DA CONFIGURARE: inserire URL reale della repository]
````

Come usarlo: copia, incolla in `README.md`, poi **cerca** `DA CONFIGURARE` con `Ctrl+Shift+F` e risolvi ogni occorrenza. Prima di consegnare non devono restarne di non intenzionali.

### Documentazione aggiuntiva (facoltativa)
Cartella `docs/` nella radice di `liparibank/`:

| File | Contenuto |
|---|---|
| `docs/TEST_REPORT.md` | il report del [Testing Manuale](./02_Testing_Manuale.md) |
| `docs/DECISIONS.md` | 3–5 scelte tecniche con motivazione (Context vs props, dove vive il saldo, perché JSON statici) |
| `docs/screenshots/` | immagini per il README (riduci il peso dei file) |

Esempio di una voce di `docs/DECISIONS.md`:

```markdown
## Il saldo è derivato
**Decisione:** il saldo mostrato non è salvato nello state; si calcola da saldo iniziale e bonifici simulati.
**Motivo:** evita due fonti di verità che divergono.
**Alternativa scartata:** `useState` separato per il saldo, aggiornato a ogni bonifico.
```

---

## 🏦 LipariBank in action

Collega il README al progetto reale: ogni riga **deve essere vera**. Controlla:

| Affermazione nel README | Come la verifichi |
|---|---|
| "Node 22 LTS" | `node --version` |
| Elenco script | `package.json` → `scripts` |
| Variabili d'ambiente | confronto con `.env.example` |
| Struttura cartelle | confronto con `src/` reale |
| Rotte | `src/App.jsx` |
| Funzionalità | tabella dei Must (REQ-01…REQ-05, REQ-07…REQ-11) e [Testing Manuale](./02_Testing_Manuale.md) |
| Deploy | stato reale: eseguito solo se lo hai fatto e verificato |

Il **README è una promessa**: se scrivi "filtri per conto" ma il filtro non funziona, è un difetto del progetto, non della documentazione.

---

## 🧪 Your Turn

**Obiettivo:** produrre un README completo e verificato a freddo.

**Requisiti**
1. Crea `README.md` nella radice di `liparibank/` partendo dal modello, adattandolo alla **tua** app (funzionalità effettivamente presenti, struttura reale, scelte tue).
2. Risolvi ogni `[DA CONFIGURARE: ...]` o cancella la riga; lascia il segnaposto solo se il dato non esiste (es. deploy non eseguito).
3. Crea `docs/TEST_REPORT.md` con il report del capitolo precedente.
4. Scrivi almeno **3 limiti noti** reali.
5. Esegui il "test a freddo": clona la tua repo in una cartella nuova e, seguendo **solo** il README, avvia l'app.
6. Commit: `docs: aggiunge README e report di test`.

**Passi suggeriti**
- Scrivi il README dopo aver finito codice e test, ma prima di consegnare.
- Usa `Ctrl+Shift+V` in VS Code per l'anteprima Markdown e controlla tabelle e blocchi di codice.

**Risultato atteso:** un estraneo avvia LipariBank in pochi minuti solo con il README.

**Criteri di completamento:** nessuna affermazione falsa; comandi eseguibili; nessun segreto o percorso personale; link relativi funzionanti; segnaposto residui solo intenzionali.

---

## 🔗 Repository / Checkpoint

La consegna richiede l'URL della **tua** repository: non esiste un URL ufficiale predefinito.

- URL: `[DA CONFIGURARE: inserire URL reale della repository]`
- Branch: `[DA CONFIGURARE: inserire nome reale del branch]`

---

## ⚠️ Common Mistakes
- **README di template Vite lasciato intatto**: non descrive LipariBank.
- **Funzionalità elencate ma non presenti**.
- **Comandi senza cartella** o con percorsi della tua macchina.
- **Dichiarare un deploy mai eseguito**, o inventare un URL.
- **Segreti o valori reali** in esempi o screenshot.
- **Blocchi di codice rotti**: un recinto di backtick non chiuso rovina il resto della pagina. Controlla l'anteprima.
- **Link non funzionanti** nel `docs/`: verifica i percorsi relativi.

---

## ✅ Checklist
- ☐ Il README risponde alle sei domande (cos'è, cosa fa, come si avvia, com'è fatto, come si verifica, limiti).
- ☐ Tutte le affermazioni sono verificate.
- ☐ Nessun segreto, nessun percorso personale.
- ☐ Nessun `[DA CONFIGURARE: ...]` non intenzionale.
- ☐ Ho fatto il test a freddo con un clone pulito.
- ☐ `docs/TEST_REPORT.md` presente.

---

## 🚀 Challenge
Aggiungi al README una breve sezione "Come contribuire" con la convenzione dei branch e dei commit usata ([Git Workflow](../Day_08_Final_Project/05_Git_Workflow.md)).

---

## 📌 Recap
- Il README è la porta d'ingresso: avvio rapido, struttura, variabili, test, limiti.
- Ogni riga deve essere vera e verificabile.
- Segnaposto espliciti dove manca un dato reale; mai link inventati.
- Il test a freddo (clone pulito) è la prova del nove.

---

### ➡️ Next
Prossimo capitolo: [Consegna Finale](./06_Consegna_Finale.md) — checklist conclusiva, formato di consegna e chiusura del corso.
