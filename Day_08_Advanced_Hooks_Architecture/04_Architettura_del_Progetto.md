# 🏦 LipariBank — React Zero to Hero

> **Day 7 · Capitolo 05**
> **Argomento:** Architettura del progetto
> **Durata stimata:** 40 minuti
> **Parte di LipariBank:** struttura finale di `src/` e regole su "cosa va dove"

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- descrivere la responsabilità di ogni cartella di `src/` (`components`, `pages`, `layouts`, `context`, `hooks`, `services`, `utils`, `data`);
- decidere dove va un nuovo file applicando domande semplici;
- rispettare le convenzioni di nome e la direzione delle dipendenze;
- riconoscere quando una struttura è già sufficiente e non va complicata.

---

## 📋 Prerequisiti
- [Cap. 01](./01_Context_e_useContext.md), [cap. 02](./02_useReducer.md), [cap. 03](./03_Custom_Hooks.md) e [cap. 04](./04_Memoization.md) di questo Day: ci sono ormai `context/`, `hooks/` e nuovi componenti.
- [Day 6 · MultiPage](../Day_06_Routing/06_Esercizio_LipariBank_MultiPage.md): `pages/` e `layouts/`.
- Progetto `liparibank/` aperto in VS Code.

---

## 🧭 In questo capitolo
- Le cartelle di `src/` e a cosa servono.
- Convenzioni di nome.
- Direzione delle dipendenze.
- Esempi "dove lo metto?" e come evitare l'over-engineering.

---

## 🧠 Theory

### Perché serve una struttura
Un'app cresce: senza regole, ogni file finisce "dove capita" e dopo poche settimane nessuno sa dove cercare. La struttura non è estetica: serve a rispondere in cinque secondi a **"dove si cambia questa cosa?"**.

### Le cartelle di `src/`

| Cartella | Cosa contiene | Cosa NON contiene |
|---|---|---|
| `components/` | Componenti riusabili e di presentazione (`BalanceCard`, `TransactionList`, `TransferForm`, `ErrorBoundary`) | Routing, chiamate `fetch` |
| `pages/` | Un componente per **route** (`DashboardPage`, `TransferPage`): compone componenti e legge i dati | Markup riusabile in altre pagine |
| `layouts/` | Struttura comune a più pagine (`AppLayout`: Header, navigazione, `<Outlet />`) | Logica di business |
| `context/` | Provider e hook `useXxx` per dati condivisi (`SettingsContext`, `BankContext`, `bankReducer`) | Dati usati da un solo componente |
| `hooks/` | Custom hook riusabili (`useTransactions`, `useTransferForm`, `useLocalStorage`) | Componenti (niente JSX) |
| `services/` | Accesso ai dati: `apiClient`, `transactionService`, `accountService` | React: niente hook né JSX |
| `utils/` | Funzioni pure di supporto (`formatCurrency`, `validateTransfer`) | State, effetti, accesso alla rete |
| `data/` | Dati statici locali (`mockData.js`: cliente, beneficiari, dati iniziali) | Dati caricati dalla rete |

Altre cartelle: `assets/` (immagini importate dal codice), `legacy/` (presente solo se hai seguito l'extra React Legacy), `public/data/*.json` (file serviti così come sono, che usiamo per **simulare** un'API). Nel capitolo 08 aggiungeremo `store/` per Redux.

> Attenzione a `data/` vs `public/data/`: il primo è codice importato dal bundle; il secondo contiene file statici letti a runtime con `fetch`. I secondi sono il nostro finto backend e si possono sostituire con un endpoint reale cambiando solo il service.

### Struttura finale di LipariBank dopo il Day 7

```text
liparibank/
├── public/
│   └── data/
│       ├── transactions.json
│       └── accounts.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── Header.jsx, Card.jsx, BalanceCard.jsx
    │   ├── AccountCard.jsx, AccountList.jsx
    │   ├── TransactionItem.jsx, TransactionList.jsx
    │   ├── TransactionFilters.jsx, TransferForm.jsx, CategorySummary.jsx
    │   ├── EmptyState.jsx, LoadingMessage.jsx, ErrorMessage.jsx
    │   └── ErrorBoundary.jsx
    ├── pages/        (DashboardPage, AccountsPage, AccountDetailPage, TransactionsPage, TransferPage, NotFoundPage)
    ├── layouts/      (AppLayout.jsx)
    ├── context/      (SettingsContext.jsx, bankReducer.js, BankContext.jsx)
    ├── hooks/        (useLocalStorage.js, useTransactions.js, useTransferForm.js)
    ├── services/     (apiClient.js, transactionService.js, accountService.js)
    ├── utils/        (formatters.js, validators.js, errorMessages.js)
    ├── data/         (mockData.js)
    └── legacy/       (facoltativo: extra React Legacy)
```

`ErrorBoundary.jsx` ed `errorMessages.js` li creiamo nel [cap. 06](./06_Service_Layer_e_API.md).

### Convenzioni di nome
- **Componenti e pagine:** `PascalCase.jsx` (`TransactionList.jsx`, `AccountsPage.jsx`). Un componente principale per file, con `export default`.
- **Hook:** `camelCase` che inizia per `use` (`useTransactions.js`), named export.
- **Context:** `XxxContext.jsx` esporta `XxxProvider` e `useXxx`.
- **Service:** `xxxService.js`; funzioni con verbo (`getTransactions`, `getAccounts`).
- **Utils e reducer:** `camelCase.js` (`formatters.js`, `bankReducer.js`).
- **Nomi per ciò che fa, non per dove sta:** `formatters.js`, non `helpers2.js`.

### Direzione delle dipendenze
Chi sta in alto può usare chi sta sotto, mai il contrario:

```text
pages  →  components, hooks, context
layouts → components
components → hooks, context, utils
hooks → context, utils
context → services, utils, hook generici (useLocalStorage)
services → (solo apiClient e fetch)
utils → nessuno (eccezione: errorMessages importa la classe ApiError)
```

Regole pratiche:
- `useLocalStorage` è un hook **generico** (non importa nulla del progetto): per questo `SettingsContext` può usarlo senza violare la direzione;
- un **service** non importa React e non conosce i componenti;
- un **componente** non fa `fetch`: chiede i dati a un hook o al Context;
- una **pagina** non importa un'altra pagina;
- le **utils** sono funzioni pure e facili da provare da sole.

### Dove lo metto? Domande-guida
1. Contiene JSX? → `components/` (o `pages/` se è una route, `layouts/` se è un guscio comune).
2. Usa Hooks ma non restituisce JSX? → `hooks/` (o `context/` se condivide state tramite Provider).
3. Parla con la rete o legge file/JSON? → `services/`.
4. È una funzione pura senza React? → `utils/`.
5. Sono dati statici nel codice? → `data/`.

### Evitare l'over-engineering
- **Non creare cartelle con un solo file** "per il futuro": nasce quando serve.
- **Non dividere per feature** (`features/transfers/...`) finché l'app è piccola: la struttura per tipo (`components`, `hooks`...) è adeguata a LipariBank.
- **Non aggiungere `index.js` "barrel"** in ogni cartella: allungano le dipendenze e rendono più difficile seguire gli import.
- **Non spostare tutto nel Context o in un hook** per sembrare "architetturale": il codice più semplice che funziona e si legge bene è quello giusto.
- **Una regola vale se aiuta**: se una convenzione ti fa scrivere tre file in più senza vantaggio, riconsiderala.

> 💡 **Remember**
>
> Una buona architettura rende ovvio dove mettere il prossimo file. Se non lo è, la struttura è troppo complicata o ancora poco chiara.

---

## 💻 Let's Code
Verifica la struttura dal terminale, dentro `liparibank/`. Comandi per **PowerShell** (Windows):

```powershell
Get-ChildItem src
```

Crea le cartelle che ancora mancano (se esistono già non succede nulla di grave):

```powershell
New-Item -ItemType Directory -Force src/context, src/hooks, src/services, src/utils, src/layouts, src/pages
```

Su macOS/Linux gli equivalenti sono `ls src` e `mkdir -p src/context src/hooks src/services src/utils src/layouts src/pages`. In alternativa crea le cartelle da VS Code (tasto destro in Explorer → *New Folder*).

Poi cerca le chiamate `fetch(` nel codice:

```powershell
Get-ChildItem src -Recurse -Include *.js, *.jsx | Select-String -Pattern "fetch\("
```

Su macOS/Linux: `grep -rn "fetch(" src`. Se `fetch(` compare in file diversi da `src/services/`, quel codice andrà spostato nel service (lo facciamo nel [cap. 06](./06_Service_Layer_e_API.md)).

---

## 🏦 LipariBank in action
Esempi concreti di decisione:

| Nuovo file | Dove | Motivo |
|---|---|---|
| `CategorySummary.jsx` | `components/` | JSX riusabile |
| `SettingsContext.jsx` | `context/` | Provider + hook per dati trasversali |
| `useTransferForm.js` | `hooks/` | Logica con state, senza JSX |
| `accountService.js` | `services/` | Accesso a `accounts.json` |
| `formatters.js` | `utils/` | Funzioni pure |
| `mockData.js` | `data/` | Dati statici (cliente, beneficiari) |
| `NotFoundPage.jsx` | `pages/` | Una route (`*`) |
| `AppLayout.jsx` | `layouts/` | Header + navigazione + `<Outlet />` |

Un caso ambiguo: `ErrorMessage.jsx` (messaggio di errore con pulsante "Riprova") è JSX riusabile → `components/`. La funzione che trasforma un errore in testo (`getErrorMessage`) non ha JSX → `utils/`.

---

## 🧪 Your Turn
**Obiettivo:** assegnare ogni file alla cartella corretta e verificare la tua struttura reale.

**Requisiti:**
1. Per ciascun elemento scrivi la cartella: (a) `validateTransfer`, (b) `TransferPage`, (c) `getTransactions`, (d) un hook `useDebouncedValue`, (e) la lista dei beneficiari fittizi, (f) un `Footer` presente in tutte le pagine, (g) `transactions.json`, (h) `LoadingMessage`.
2. Confronta `src/` con la struttura finale mostrata sopra e annota file fuori posto.
3. Individua se esistono import "verso l'alto" (per esempio un componente che importa una pagina o un service che importa un componente).
4. Sposta i file fuori posto (solo se esistono davvero) e verifica con `npm run build`.

**Suggerimenti:** usa le cinque domande-guida. Cerca gli import con la ricerca di VS Code (`Ctrl+Shift+F`).

**Risultato atteso:** `npm run build` termina senza errori e ogni file sta nella cartella prevista.

**Criteri di completamento:** hai la tabella del punto 1 corretta, nessun import contrario alla direzione delle dipendenze, nessuna cartella vuota creata "per dopo".

Risposta di riferimento al punto 1: (a) `utils/`, (b) `pages/`, (c) `services/`, (d) `hooks/`, (e) `data/` (`mockData.js`), (f) `components/` (usato dal layout) oppure direttamente nel layout, (g) `public/data/`, (h) `components/`.

---

## ⚠️ Common Mistakes
- **Componenti che fanno `fetch`**: accoppiano UI e rete e rendono tutto più difficile da cambiare.
- **`utils/` come "cestino"**: se una funzione usa Hooks, non è una util ma un hook.
- **Pagine enormi**: una pagina compone componenti; se supera qualche decina di righe di JSX, estrai componenti.
- **Import circolari** (`context` ↔ `hooks`): un file importa un altro che importa il primo. Riorganizza seguendo la direzione delle dipendenze.
- **Spostare i file senza aggiornare gli import**: usa VS Code (trascina il file nell'Explorer) che aggiorna gli import automaticamente.

---

## ✅ Checklist
- ☐ So spiegare in una frase la responsabilità di ogni cartella di `src/`.
- ☐ Nessun `fetch` fuori da `services/`.
- ☐ I componenti non importano pagine.
- ☐ Tutti i nomi seguono le convenzioni (`PascalCase.jsx`, `useXxx.js`, `xxxService.js`).
- ☐ So distinguere `src/data/` da `public/data/`.
- ☐ Non ho creato cartelle o file inutili.

---

## 🚀 Challenge
Scrivi un `STRUCTURE.md` di 15 righe nella root di `liparibank/` che spieghi a un nuovo collega "dove si cambia cosa" (per esempio: "voglio cambiare il formato della data" → `utils/formatters.js`). Sarà una base per il README del Day 9.

---

## 📌 Recap
- Ogni cartella ha una responsabilità: UI, route, layout, state condiviso, logica con Hooks, accesso ai dati, funzioni pure, dati statici.
- Le dipendenze vanno dall'alto (pagine) verso il basso (utils/services).
- I componenti non fanno `fetch`; i service non conoscono React.
- Nomi: componenti `PascalCase.jsx`, hook `useXxx.js`, service `xxxService.js`.
- Meno è meglio: la struttura cresce quando serve, non "per il futuro".

---

### ➡️ Next
Prossimo capitolo: [06 · Service Layer e API](./06_Service_Layer_e_API.md). Costruiamo `apiClient`, i service, la gestione degli errori e l'`ErrorBoundary`.
