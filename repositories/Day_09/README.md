# LipariBank

App didattica di home banking **fittizia**, costruita con React nel corso *LipariBank — React Zero to Hero*. Cliente, conti, IBAN e movimenti sono inventati; nessuna banca e nessun servizio reale sono coinvolti, e i bonifici sono simulazioni che vivono solo in memoria.

Questa cartella è la **soluzione di riferimento del progetto finale** (checkpoint del Day 9).

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
- **Un bonifico è una sola azione, `transferAdded`, ascoltata da due slice**: una aggiunge il movimento, l'altra aggiorna il saldo. Non esistono due aggiornamenti da tenere allineati a mano.
- **L'accesso ai dati è isolato in `services/`.** Per usare un servizio reale si cambia quella cartella, non le pagine.

## Test
Non ci sono test automatici. Il piano di test manuale, con 42 casi collegati ai requisiti, è nel capitolo "Refactoring e test manuale" del Day 9.

Prima di ogni consegna: `npm run lint` e `npm run build` senza errori. Il lint lascia un solo avviso noto, `only-export-components` su `src/context/SettingsContext.jsx`, perché il file esporta insieme il Provider e l'hook `useSettings`.

## Deploy
Non eseguito. La build in `dist/` è statica: il servizio che la ospita deve rispondere con `index.html` a ogni percorso, altrimenti ricaricare `/transactions` restituisce un errore 404. Per pubblicare in una sottocartella vanno impostati `base` in Vite e `basename` nel router.

## Limiti noti
- I bonifici non vengono salvati: ricaricando la pagina si perdono.
- I preferiti non vengono salvati: ricaricando la pagina si perdono.
- Non c'è autenticazione e non c'è un back-end: i dati sono file JSON statici.
- La causale del bonifico viene validata ma non compare nell'elenco dei movimenti.
