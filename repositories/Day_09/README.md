# LipariBank — Day 9

Applicazione didattica React con dashboard, conti, movimenti filtrabili e bonifico simulato. Tutti i dati e gli IBAN sono fittizi: non esiste un collegamento a una banca.

Il progetto usa React 19, React Router 7, Redux Toolkit, Vite e oxlint. La dashboard mostra il saldo totale e gli ultimi cinque movimenti; la sezione conti permette di aprire il dettaglio. Il laboratorio legacy è un extra facoltativo nel checkpoint Extra React Legacy.

## Limiti

Non esiste un backend: i bonifici e i preferiti si perdono al ricaricamento. La preferenza per il saldo nascosto e il filtro per tipo sono salvati nel browser; la modalità compatta Redux si azzera al ricaricamento. I dati dei conti e dei movimenti vengono caricati dai file JSON locali. Per gli errori di caricamento viene mostrato un messaggio con il pulsante Riprova.

Per eseguire i test di validazione e del reducer:

```bash
node --test
```

## Raccolta dei checkpoint

Ogni cartella `Day_XX` è un progetto autonomo riferito alla fine del giorno indicato. Per il Day 7 si parte dal Day 6; il modulo React Legacy è un extra facoltativo. I dati sono fittizi e i bonifici sono simulati.

## Avvio

Installa Node.js 22 LTS (almeno 22.12.0), estrai la cartella del giorno e apri un terminale al suo interno, dove si trova `package.json`:

```bash
npm install
npm run dev
```

Apri l'indirizzo mostrato da Vite. Per controllare il progetto usa `npm run lint` e `npm run build`; per visualizzare la build usa `npm run preview`. Non includere `node_modules` o `dist` negli archivi da pubblicare.

| Giorno | Punto di arrivo |
|---|---|
| 00 | Progetto React e Vite iniziale |
| 01 | Dashboard e dati fittizi |
| 02 | Conti e componenti riutilizzabili |
| 03 | State, selezione conto e filtri |
| 04 | Bonifico simulato e validazione |
| 05 | Caricamento movimenti da JSON |
| 06 | Navigazione con React Router |
| Extra | `EXTRA_Legacy_React`: laboratorio legacy facoltativo |
| 07 | Context, reducer, hooks, service layer e Redux Toolkit |
| 08 | Requisiti del progetto finale |
| 09 | Versione di consegna |

I bonifici e le modifiche ai movimenti rimangono in memoria e si perdono ricaricando la pagina; eventuali preferenze persistenti sono indicate nel README del giorno. Per pubblicare un'app con routing su hosting statico è necessario configurare il fallback SPA verso `index.html`.
