# 🏦 LipariBank — React Zero to Hero

> **Day 9 · Capitolo 07**
> **Argomento:** README e consegna
> **Durata stimata:** 75 minuti
> **Parte di LipariBank:** il `README.md` del tuo progetto, la verifica su una copia pulita e la consegna finale

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- scrivere un README con cui uno sconosciuto installa, avvia e capisce LipariBank in cinque minuti;
- distinguere ciò che hai **verificato** da ciò che non lo è;
- provare che il progetto funziona partendo da una copia pulita della repository;
- completare la checklist finale e l'autovalutazione per requisito;
- consegnare il progetto nel formato richiesto.

---

## 📋 Prerequisiti
- [Capitolo 04 — Refactoring e test manuale](./04_Refactoring_e_Test_Manuale.md): il registro dei test è compilato.
- [Capitolo 05 — Accessibility e responsive](./05_Accessibility_e_Responsive.md) e [capitolo 06 — Environment e deploy](./06_Environment_e_Deploy.md) completati.
- Tutto il lavoro è in un commit e pubblicato: `git status` è pulito.

---

## 🧭 In questo capitolo
- Le sei domande a cui risponde un README.
- Un modello di README da adattare.
- Che cosa significa consegnare.
- La verifica su una copia pulita.
- Checklist finale, autovalutazione e modulo di consegna.
- Che cosa studiare dopo.

---

## 🧠 Theory

### Il README
Il README è la porta d'ingresso del progetto. Chi apre la repository (un docente, un collega, tu fra sei mesi) decide lì se riesce a capirlo e a provarlo. Risponde a sei domande, in quest'ordine:

1. **Che cos'è?** Una frase.
2. **Che cosa fa?** Le funzionalità.
3. **Come lo avvio?** Requisiti, installazione, comandi.
4. **Com'è fatto?** Tecnologie, struttura, scelte.
5. **Come lo verifico?** Test, lint, build.
6. **Che cosa non fa?** I limiti noti.

Quattro regole:

- I comandi stanno in blocchi di codice copiabili, e dicono in quale cartella vanno eseguiti.
- Nessun segreto e nessun percorso del tuo computer (`C:\Users\...`).
- Nessuna affermazione non verificata: un deploy non eseguito **non** si descrive come pubblicato.
- Dove manca un dato reale, si scrive che manca.

> 💡 **Remember**
>
> Il README è una promessa. Se scrivi "filtro per conto" e il filtro non funziona, il difetto è del progetto, non della documentazione.

### Consegnare
Consegnare non significa caricare dei file. Significa che **un'altra persona ottiene lo stesso risultato che vedi tu**.

Sul tuo computer ci sono cose che chi riceve il progetto non ha: la cartella `node_modules`, il file `.env`, la cartella `dist/`, magari un file che hai dimenticato di aggiungere a Git. Per questo l'ultima verifica si fa su una **copia nuova** della repository, ottenuta con `git clone`.

Tre domande guidano la verifica:

1. **Funziona da zero?** Clone, installazione, avvio.
2. **È completo?** Requisiti Must e documentazione.
3. **È pulito?** Nessun segreto, nessun file inutile.

---

## 💻 Let's Code

### Il modello di README
Copia il modello nel file `README.md`, nella cartella principale di `liparibank/`, sostituendo quello generato da Vite. Poi adattalo: ogni riga deve descrivere **la tua** applicazione.

I testi tra parentesi quadre, `[DA COMPLETARE: ...]`, sono i punti in cui devi scrivere un dato tuo, oppure cancellare la riga.

````markdown title="README.md" collapse
# LipariBank

App didattica di home banking **fittizia**, costruita con React nel corso *LipariBank — React Zero to Hero*. Cliente, conti, IBAN e movimenti sono inventati; nessuna banca e nessun servizio reale sono coinvolti, e i bonifici sono simulazioni che vivono solo in memoria.

## Funzionalità
- Dashboard con saldo totale, che si può nascondere, e ultimi 5 movimenti
- Elenco dei conti e dettaglio di un conto (`/accounts/:accountId`)
- Elenco dei movimenti con filtri per tipo, testo e conto, e riepilogo delle uscite per categoria
- Bonifico simulato con validazione, un messaggio di errore per campo e conferma
- Movimenti preferiti
- Navigazione a più pagine con pagina 404
- Messaggi di caricamento, di errore e di assenza di dati
- Preferenze salvate nel browser: "Nascondi saldi" e filtro per tipo
- Accessibilità di base e layout adatto agli schermi piccoli

## Stack
- React 19 (Function Components e Hooks)
- Vite 8
- React Router 7 (*declarative mode*)
- Redux Toolkit 2 e React Redux 9
- JavaScript, CSS in un file, oxlint

## Requisiti
- Node.js 22 LTS, versione 22.12 o successiva (`node --version`)
- npm, incluso con Node.js

## Avvio rapido
Dentro la cartella del progetto:

```bash
npm install
```

```bash
npm run dev
```

L'app risponde su `http://localhost:5173/`. Se la porta è occupata, Vite ne sceglie un'altra e la scrive nel terminale.

## Script
| Comando | Che cosa fa |
|---|---|
| `npm run dev` | Avvia il server di sviluppo |
| `npm run build` | Genera la build di produzione in `dist/` |
| `npm run preview` | Serve in locale la build (di solito su `http://localhost:4173/`) |
| `npm run lint` | Analizza il codice con oxlint |

## Variabili d'ambiente
Sono facoltative: senza file `.env` l'app funziona con i valori predefiniti. Per cambiarli copia `.env.example` in `.env` (che non è versionato).

| Variabile | Descrizione | Valore predefinito |
|---|---|---|
| `VITE_API_BASE_URL` | Prefisso degli indirizzi dei dati. Vuota: file statici in `public/data/` | vuota |
| `VITE_APP_NAME` | Nome mostrato nell'intestazione | `LipariBank` |

Le variabili con prefisso `VITE_` finiscono nel codice inviato al browser e sono **pubbliche**: non devono contenere segreti.

## Struttura del progetto
```text
src/
├── components/   interfaccia riutilizzabile
├── context/      SettingsContext: le preferenze dell'utente
├── data/         dati fissi: cliente e beneficiari
├── hooks/        useTransactions, useTransferForm, useBankStatus, useLocalStorage, useDocumentTitle
├── layouts/      AppLayout: intestazione, menu e Outlet
├── pages/        una pagina per route
├── services/     apiClient, accountService, transactionService
├── store/        store Redux, accountsSlice, transactionsSlice
└── utils/        formatters, validators, errorMessages
public/data/      accounts.json, transactions.json
```

## Route
| Percorso | Pagina |
|---|---|
| `/` | Dashboard |
| `/accounts` | Conti |
| `/accounts/:accountId` | Dettaglio del conto |
| `/transactions` | Movimenti |
| `/transfer` | Bonifico simulato |
| `*` | Pagina non trovata |

## Scelte di progetto
- **Conti, movimenti, caricamento ed errore vivono nello store Redux.** Li leggono più pagine e li modificano azioni diverse; con i Redux DevTools ogni cambiamento è tracciabile.
- **Le preferenze vivono in un Context.** Cambiano di rado e non hanno logica: uno store sarebbe sproporzionato.
- **Filtri e valori dei form sono state locale.** Servono a una sola pagina.
- **Un bonifico è una sola azione, `transferAdded`, ascoltata da due slice**: una aggiunge il movimento, l'altra aggiorna il saldo.
- **L'accesso ai dati è isolato in `services/`.** Per usare un servizio reale si cambia quella cartella, non le pagine.

## Test
Non ci sono test automatici. I test manuali eseguiti sono in [docs/TEST_REPORT.md](docs/TEST_REPORT.md).

Prima di ogni consegna: `npm run lint` e `npm run build` senza errori.

## Deploy
- Stato: [DA COMPLETARE: "non eseguito", oppure servizio usato e data]
- Indirizzo: [DA COMPLETARE: indirizzo dell'app pubblicata, oppure cancella la riga]

La build in `dist/` è statica: il servizio che la ospita deve rispondere con `index.html` a ogni percorso.

## Limiti noti
- I bonifici e i preferiti non vengono salvati: ricaricando la pagina si perdono.
- Non c'è autenticazione e non c'è un back-end: i dati sono file JSON statici.
- [DA COMPLETARE: i limiti emersi dai tuoi test]

## Autore
[DA COMPLETARE: nome e cognome], corso *LipariBank — React Zero to Hero*
````

Il modello è racchiuso tra quattro accenti gravi perché contiene a sua volta blocchi di codice: copia solo il contenuto.

Quando hai finito, cerca `DA COMPLETARE` in tutto il progetto (`Ctrl+Shift+F` in VS Code): non deve restarne nessuno.

### Rendere vero il README
Controlla ogni affermazione contro il progetto reale.

| Affermazione | Come la verifichi |
|---|---|
| Versione di Node.js | `node --version` |
| Elenco degli script | `scripts` in `package.json` |
| Variabili d'ambiente | Confronto con `.env.example` |
| Struttura delle cartelle | Confronto con `src/` |
| Route | `src/App.jsx` |
| Funzionalità | Il tuo registro dei test |
| Deploy | Lo stato reale: "eseguito" solo se lo hai fatto **e** provato |

Se non hai realizzato una funzionalità (per esempio il filtro per conto, che è uno *Should*), toglila dall'elenco e scrivila tra i limiti noti.

### Il registro dei test
Crea la cartella `docs/` nella cartella principale di `liparibank/` e salva il registro compilato nel [capitolo 04](./04_Refactoring_e_Test_Manuale.md) come `docs/TEST_REPORT.md`. Il README lo collega.

### Verifica su una copia pulita
Esegui i comandi in una cartella **diversa** da quella del progetto. Sostituisci `<URL_REPOSITORY>` con l'indirizzo della tua repository e `<NOME_BRANCH>` con il branch che consegni.

```bash
git clone <URL_REPOSITORY> liparibank-verifica
```

```bash
cd liparibank-verifica
```

```bash
git switch <NOME_BRANCH>
```

Installa le dipendenze esattamente come sono descritte in `package-lock.json`:

```bash
npm ci
```

`npm ci` funziona solo se `package-lock.json` è nella repository. Se fallisce per questo, aggiungi il file nel progetto originale, fai il commit e ricomincia.

```bash
npm run lint
```

```bash
npm run build
```

```bash
npm run preview
```

Apri l'indirizzo scritto nel terminale (di solito `http://localhost:4173/`) ed esegui il **percorso breve di accettazione**:

| Passo | Risultato atteso | Esito |
|---|---|---|
| Apri `/` | Saldo totale `17.050,75 €`; 5 righe in "Ultimi movimenti" | |
| Apri `/accounts/acc-001` | Dettaglio del Conto Corrente, 6 movimenti | |
| `/transactions`, testo `utenza`, filtro "Uscite" | 2 movimenti | |
| `/transactions`, conto "Conto Risparmio" | 2 movimenti | |
| `/transfer`, 5000 dal Conto Corrente | "Saldo insufficiente sul conto selezionato."; nessun movimento | |
| `/transfer`, 100 dal Conto Corrente a Giulia Bianchi | Conferma; Conto Corrente `4.150,75 €` | |
| `/non-esiste` | Pagina 404 | |
| `F5` su `/transactions` | La pagina si riapre | |
| Primo `Tab` in una pagina | Compare "Vai al contenuto principale" | |

Poi controlla che la repository non contenga file che non dovrebbero esserci. Nella cartella della copia:

```bash
git ls-files .env node_modules dist
```

Nessun risultato: nessun file locale o generato è stato aggiunto a Git.

Cerca infine parole sospette nei sorgenti. Su Windows (PowerShell):

```powershell
Get-ChildItem src -Recurse -Include *.js,*.jsx | Select-String -Pattern "password|token|secret|apikey"
```

Su macOS e Linux:

```bash
grep -rniE "password|token|secret|apikey" src
```

Nel progetto di riferimento la ricerca non trova nulla. Se trovi una chiave o una credenziale reale, cancellare il file non basta: resta nella storia di Git. Considerala compromessa e sostituiscila.

Alla fine puoi eliminare la cartella `liparibank-verifica`: è una copia.

---

## 🏦 LipariBank in action

### Checklist finale di consegna

**Funzionalità**
- ☐ Tutti i requisiti *Must* sono soddisfatti: REQ-01, 02, 03, 04, 05, 07, 08, 09, 10, 11, 15, 16.
- ☐ Gli *Should* (REQ-06, REQ-12, REQ-13) sono realizzati, oppure la loro assenza è scritta nei limiti noti.
- ☐ Ogni pagina con dati gestisce caricamento, errore e assenza di dati.

**Qualità del codice**
- ☐ `npm run lint` senza errori; `npm run build` senza errori.
- ☐ Nessun `console.log`, nessun `debugger`, nessun import o file inutilizzato.
- ☐ Nessuna logica ripetuta in più pagine.
- ☐ Struttura delle cartelle coerente con l'[architettura del progetto](../Day_08_Advanced_Hooks_Architecture/04_Architettura_del_Progetto.md).

**Test e uso**
- ☐ Piano di test eseguito; `docs/TEST_REPORT.md` compilato.
- ☐ App utilizzabile con la sola tastiera.
- ☐ Layout verificato a 360 px, 768 px e 1280 px.

**Sicurezza e configurazione**
- ☐ `.env` ignorato da Git; `.env.example` presente nella repository.
- ☐ Nessun segreto nel codice, nei file o nella storia.
- ☐ `node_modules/` e `dist/` non sono nella repository.

**Documentazione e Git**
- ☐ `README.md` completo e verificato su una copia pulita.
- ☐ Nessun `[DA COMPLETARE: ...]` rimasto.
- ☐ Storia dei commit leggibile.
- ☐ Branch di consegna pubblicato.
- ☐ Tag finale creato.

Per creare e pubblicare il tag finale, dentro `liparibank/`:

```bash
git tag -a consegna-finale -m "Consegna finale LipariBank"
```

```bash
git push origin consegna-finale
```

### Autovalutazione per requisito
Per ogni riga scrivi ✅ (verificato), 🟡 (in parte) o ❌ (assente), con una nota.

| Requisito | Priorità | Esito | Nota |
|---|---|---|---|
| REQ-01 Dashboard: saldo e ultimi movimenti | Must | | |
| REQ-02 Elenco conti e stato vuoto | Must | | |
| REQ-03 Dettaglio conto | Must | | |
| REQ-04 Elenco movimenti | Must | | |
| REQ-05 Filtri per tipo e testo | Must | | |
| REQ-06 Filtro per conto | Should | | |
| REQ-07 Form bonifico con validazione | Must | | |
| REQ-08 Effetto del bonifico | Must | | |
| REQ-09 Navigazione e 404 | Must | | |
| REQ-10 Caricamento, errore, assenza di dati | Must | | |
| REQ-11 Componenti riutilizzabili | Must | | |
| REQ-12 Preferenze persistenti | Should | | |
| REQ-13 Error Boundary | Should | | |
| REQ-14 Movimento preferito | Could | | |
| REQ-15 Stato condiviso | Must | | |
| REQ-16 Focus nel form | Must | | |
| NFR-01 Qualità del codice | Must | | |
| NFR-02 Build di produzione | Must | | |
| NFR-03 Accessibilità di base | Should | | |
| NFR-04 Layout da 360 px | Should | | |
| NFR-05 Nessun segreto | Must | | |

### Modulo di consegna
Copialo nel campo di consegna previsto dal corso e compilalo. Per il deploy, se non lo hai fatto, scrivi "non eseguito": è una risposta corretta.

```text
CONSEGNA FINALE — LipariBank (React Zero to Hero)

Nome e cognome: [DA COMPLETARE]
Repository: [DA COMPLETARE: indirizzo della tua repository]
Branch consegnato: [DA COMPLETARE]
Tag finale: [DA COMPLETARE: per esempio consegna-finale]
Registro dei test: docs/TEST_REPORT.md
Deploy: [DA COMPLETARE: indirizzo, oppure "non eseguito"]

Requisiti Must soddisfatti: [DA COMPLETARE: per esempio 12 su 12]
Should realizzati: [DA COMPLETARE: elenco degli ID]
Limiti noti: [DA COMPLETARE: elenco breve]
```

---

## 🧪 Your Turn

**Obiettivo:** consegnare un progetto documentato, verificato e riproducibile.

**Requisiti:**
1. Scrivi `README.md` partendo dal modello e adattandolo alla tua app: funzionalità davvero presenti, struttura reale, scelte tue.
2. Scrivi **almeno tre limiti noti** reali.
3. Salva il registro dei test in `docs/TEST_REPORT.md`.
4. Fai il commit (`docs: aggiunge README e registro dei test`) e pubblica il branch.
5. Esegui la verifica su una copia pulita e il percorso breve di accettazione.
6. Completa la checklist finale e l'autovalutazione.
7. Crea il tag finale, compila il modulo e consegnalo.

**Passi suggeriti:**
1. Per rileggere il README usa l'anteprima di VS Code (`Ctrl+Shift+V`): controlla tabelle e blocchi di codice.
2. Se qualcosa fallisce nella copia pulita, correggi nel progetto originale, fai il commit, pubblica e **ripeti** la verifica dall'inizio.
3. Confronta il tuo progetto con il checkpoint `liparibank-day-09.zip` solo dopo aver consegnato: le differenze sono spunti, non errori.

**Risultato atteso:** una repository che si installa, si avvia e supera il percorso di accettazione con i soli comandi del README.

**Criteri di completamento:** la copia pulita supera lint, build e percorso di accettazione; la checklist è completa; il modulo contiene solo dati reali.

---

## 🔗 Repository / Checkpoint

### CHECKPOINT 9 — Soluzione del progetto finale

- **Checkpoint del corso:** `liparibank-day-09.zip`, allegato al Day 9 sulla piattaforma. Per usarlo vedi [Come usare i checkpoint](../Day_00_Setup/06_Come_usare_i_checkpoint.md).
- **La tua repository:** tag `consegna-finale`.

| Domanda | Risposta |
|---|---|
| **Contenuto** | Il progetto di fine Day 8 con i tre requisiti di lavoro autonomo, il refactoring del capitolo 04, l'accessibilità del capitolo 05, le variabili d'ambiente del capitolo 06 e il README. |
| **Come usarlo** | Per confrontare le tue scelte dopo aver provato. È **una** soluzione corretta, non l'unica. |
| **Che cosa non contiene** | Il registro dei test e il deploy: sono lavoro tuo. |
| **Come verificare** | `npm install`, `npm run lint`, `npm run build`, poi il percorso breve di accettazione. |

---

## ⚠️ Common Mistakes
- **Lasciare il README generato da Vite**: non descrive LipariBank.
- **Elencare funzionalità che non ci sono.**
- **Dichiarare un deploy mai eseguito**, o inventare un indirizzo.
- **Scrivere comandi con i percorsi del proprio computer.**
- **Verificare solo nella cartella di sviluppo**: lì esistono `node_modules` e `.env`, che chi riceve il progetto non ha.
- **Non aver aggiunto `package-lock.json` a Git**: `npm ci` fallisce.
- **Consegnare il branch sbagliato**, o dimenticare `git push`.
- **Modificare il codice all'ultimo minuto** senza ripetere lint, build e percorso di accettazione.

---

## ✅ Checklist
- ☐ Il README risponde alle sei domande.
- ☐ Ogni affermazione del README è verificata.
- ☐ Nessun segreto, nessun percorso personale, nessun `[DA COMPLETARE: ...]`.
- ☐ La copia pulita supera `npm ci`, `npm run lint`, `npm run build` e il percorso di accettazione.
- ☐ Checklist finale e autovalutazione sono compilate.
- ☐ Branch e tag sono pubblicati.
- ☐ Il modulo di consegna è inviato.

---

## 🚀 Challenge
Chiedi a un'altra persona di seguire il tuo README su un computer diverso, senza aiutarla. Annota ogni punto in cui si ferma o ti fa una domanda: sono i prossimi miglioramenti della documentazione.

---

## 📌 Recap
- Il README è la porta d'ingresso: che cos'è, che cosa fa, come si avvia, com'è fatto, come si verifica, che cosa non fa.
- Ogni riga del README deve essere vera e verificabile.
- Si consegna ciò che si può riprodurre da una copia pulita.
- La checklist copre funzionalità, qualità, test, sicurezza e documentazione.
- Un dato che manca si dichiara; non si inventa.

---

### ➡️ Next
**Hai completato il percorso.** In dieci giornate sei passato dall'installazione di Node.js a un'applicazione React a più pagine, con state condiviso in Redux, form validati, dati asincroni, routing, un'architettura a livelli, accessibilità di base e una build di produzione. LipariBank è tua: sai leggerla, modificarla e spiegarla.

Due moduli extra completano il corso:

- [JavaScript Essentials](../Extra_JavaScript_Essentials/01_Variables_Types.md), per ripassare il JavaScript che React dà per scontato;
- [React Legacy](../Extra_Legacy_React/01_React_Moderno_vs_Legacy.md), per leggere e mantenere il codice con i Class Components che incontrerai nei progetti esistenti.

Che cosa studiare dopo, in base ai tuoi obiettivi:

- **TypeScript**: tipi per props, state e dati, per trovare gli errori prima di eseguire il codice.
- **Test automatici**: verificare funzioni come `validateTransfer` e i componenti con un programma, invece che a mano.
- **RTK Query**: la parte di Redux Toolkit dedicata al caricamento dei dati, che sostituisce i thunk scritti a mano con cache e ricaricamento automatici.
- **Un framework React**: routing con caricamento dei dati e rendering sul server.
- **Un back-end semplice**: sostituire i file JSON con un'API tua, cambiando solo la cartella `services/`.

Per ripassare un argomento torna alla [mappa del corso](../COURSE_MAP.md). Buon lavoro!
