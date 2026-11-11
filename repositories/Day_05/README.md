# Checkpoint LipariBank

Ogni cartella `Day_XX` è un progetto autonomo riferito alla fine del giorno indicato. Per il Day 7 si parte dal Day 6: il modulo React Legacy è un laboratorio facoltativo e non è un prerequisito. I dati sono fittizi e i bonifici sono simulati: non viene effettuata alcuna operazione bancaria.

## Avvio

Installa Node.js 22 LTS (almeno 22.12.0), estrai la cartella del giorno e apri un terminale al suo interno, dove si trova `package.json`:

```bash
npm install
npm run dev
```

Apri l'indirizzo mostrato da Vite. Per controllare il progetto usa `npm run lint` e `npm run build`; per visualizzare la build usa `npm run preview`. Non includere `node_modules` o `dist` negli archivi da pubblicare.

Nei progetti dal Day 04 al Day 9 è inoltre possibile eseguire i test disponibili con `node --test`.

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

I bonifici e le modifiche ai movimenti rimangono in memoria e si perdono ricaricando la pagina. Dal Day 07 la preferenza del saldo nascosto e il filtro per tipo sono salvati nel browser; la modalità compatta Redux invece si azzera al ricaricamento. Per pubblicare un'app con routing su hosting statico è necessario configurare il fallback SPA verso `index.html`.
