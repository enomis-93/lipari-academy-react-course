# LipariBank — checkpoint Day 7

Stato del progetto alla fine del **Day 7 — Stato condiviso: da Context a Redux** del corso *React Zero to Hero*.

I dati bancari (conti, movimenti, caricamento ed errore) vivono in uno store Redux Toolkit in `src/store/`; la preferenza "nascondi saldi" resta in un Context; filtri e form restano state locale delle pagine.

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
