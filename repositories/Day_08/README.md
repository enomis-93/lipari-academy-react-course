# LipariBank — checkpoint Day 8

Stato del progetto alla fine del **Day 8 — Hook avanzati e architettura** del corso *React Zero to Hero*.

Custom hook (`useBankStatus`, `useTransactions`, `useTransferForm`, `useLocalStorage`), memoization e selector memoizzato, service layer con `apiClient`, conti caricati da `accounts.json`, Error Boundary e struttura finale di `src/`.

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
