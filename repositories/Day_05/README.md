# LipariBank — checkpoint Day 5

Stato del progetto alla fine del **Day 5 — Effects & API** del corso *React Zero to Hero*.

I movimenti arrivano in modo asincrono da `public/data/transactions.json` tramite `src/services/transactionService.js`, con stati di caricamento, errore con "Riprova" e assenza di dati.

> Progetto didattico: tutti i dati sono fittizi e nessuna operazione bancaria è reale.

## Avvio

Serve Node.js 22 LTS (22.12 o successivo). Dentro questa cartella:

```bash
npm install
```

```bash
npm run dev
```

Poi apri l'indirizzo mostrato dal terminale (di solito `http://localhost:5173/`).

## Controlli

`npm run lint` e `npm run build` devono terminare senza errori.
