# 🏦 LipariBank — React Zero to Hero

> **Day 9 · Capitolo 01**
> **Argomento:** Refactoring Finale
> **Durata stimata:** 60 minuti
> **Parte di LipariBank:** revisione del codice, eliminazione di duplicazioni e codice morto, lint pulito

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- fare una **code review** della tua app con una checklist;
- individuare ed estrarre logica duplicata in funzioni pure o componenti;
- rimuovere codice morto, import inutilizzati e `console.log`;
- far passare `npm run lint` (oxlint) senza errori né warning, **senza cambiare il comportamento**.

---

## 📋 Prerequisiti
- Day 8 completato: tutti i requisiti Must soddisfatti ([Requirements](../Day_08_Final_Project/02_Requirements_Funzionali.md)).
- Repository con lavoro committato (`git status` pulito): il refactoring si fa su un branch `refactor/final-cleanup`.
- [Memoization](../Day_08_Advanced_Hooks_Architecture/02_Memoization.md): per non ottimizzare senza motivo.

---

## 🧭 In questo capitolo
- Cos'è il refactoring e la regola d'oro.
- Checklist di revisione del codice.
- Esempio guidato: estrarre il filtro dei movimenti e il calcolo del saldo.
- Rimozione di codice morto e `console.log`.
- Lint con oxlint.

---

## 🧠 Theory

### Refactoring
Refactoring = cambiare la **struttura** del codice senza cambiarne il **comportamento osservabile**. Per questo si fa a piccoli passi, verificando dopo ciascuno (`npm run lint`, app nel browser, test manuali del [prossimo capitolo](./02_Testing_Manuale.md)).

### Cosa cercare
- **Duplicazione**: la stessa logica copiata in due file. Diventa una funzione/componente/hook condiviso.
- **Codice morto**: file, funzioni, variabili, import mai usati.
- **Nomi poco chiari**: `data`, `x`, `handle`, `temp`.
- **Componenti troppo grandi**: più di una responsabilità (fetch + filtri + markup).
- **Effetti collaterali nascosti**: `console.log`, mutazioni dello state, `useEffect` senza cleanup dove serve.

> 💡 **Remember**
>
> Rifattorizza solo codice che **funziona** e che sai verificare. Se noti un bug durante il refactoring, annotalo e correggilo in un commit `fix:` separato.

---

## 💻 Let's Code

### Checklist di revisione

| Area | Domanda | OK? |
|---|---|---|
| Struttura | Ogni file è nella cartella giusta ([Architettura](../Day_08_Final_Project/03_Architettura.md))? | ☐ |
| Duplicazioni | Esiste logica copiata tra `DashboardPage`, `TransactionsPage`, `AccountDetailPage`? | ☐ |
| Componenti | I presentazionali ricevono solo props? Nessun fetch al loro interno? | ☐ |
| State | Nessun dato derivato salvato in `useState`? Nessuna mutazione diretta? | ☐ |
| Liste | Ogni `map` ha una `key` stabile (`transaction.id`, mai l'indice se la lista cambia)? | ☐ |
| Effetti | Ogni `useEffect` ha dipendenze corrette e cleanup (`AbortController`) dove serve? | ☐ |
| Naming | Nomi di componenti in PascalCase, funzioni in camelCase, handler `handleX`, callback prop `onX`? | ☐ |
| Codice morto | Nessun import, variabile, file inutilizzato? `src/assets/` e CSS di template rimossi? | ☐ |
| Log | Nessun `console.log` / `debugger` residuo? | ☐ |
| Sicurezza | Nessun segreto nel codice; nessun URL hard-coded non necessario? | ☐ |
| Lint | `npm run lint` pulito? | ☐ |

### Esempio 1 — Estrarre il filtro dei movimenti
Se la stessa logica `filter` esiste in due pagine, centralizzala in una **funzione pura**. Nuovo file opzionale `src/utils/transactionFilters.js`:

```javascript
export function filterTransactions(
  transactions,
  { type = "all", text = "", accountId = "all" } = {}
) {
  const normalizedText = text.trim().toLowerCase();

  return transactions.filter((transaction) => {
    if (accountId !== "all" && transaction.accountId !== accountId) return false;
    if (type === "income" && transaction.amount <= 0) return false;
    if (type === "expense" && transaction.amount >= 0) return false;
    if (
      normalizedText &&
      !transaction.description.toLowerCase().includes(normalizedText)
    ) {
      return false;
    }
    return true;
  });
}

export function sortByDateDesc(transactions) {
  return [...transactions].sort((a, b) => b.date.localeCompare(a.date));
}
```

Uso in `src/pages/TransactionsPage.jsx` (snippet parziale: adatta i nomi di state e hook ai tuoi):

```jsx
import { filterTransactions, sortByDateDesc } from "../utils/transactionFilters.js";

const visibleTransactions = sortByDateDesc(
  filterTransactions(transactions, { type: filter, text: searchText, accountId })
);
```

Perché funziona: `filter` e `sort` non modificano l'array originale (`[...transactions]` crea una copia prima di `sort`, che altrimenti **muta**). Perché è meglio: una sola regola da correggere e da verificare. Da evitare: mettere `visibleTransactions` in un `useState`: è un dato **derivato**, si calcola a ogni render.

### Esempio 2 — Un solo posto per il saldo
Se saldo di un conto e saldo totale sono calcolati in più componenti, estrai in `src/utils/balance.js` (nuovo file opzionale):

```javascript
const roundToCents = (value) => Math.round(value * 100) / 100;

export function getAccountBalance(account, transactions) {
  const simulatedTransfers = transactions
    .filter(
      (transaction) =>
        transaction.accountId === account.id && transaction.category === "Bonifici"
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return roundToCents(account.balance + simulatedTransfers);
}

export function getTotalBalance(accounts, transactions) {
  const total = accounts.reduce(
    (sum, account) => sum + getAccountBalance(account, transactions),
    0
  );
  return roundToCents(total);
}
```

Cosa fa: il saldo iniziale è quello del conto; i bonifici simulati (categoria `"Bonifici"`) vengono sommati (sono negativi). L'arrotondamento a centesimi evita risultati come `4150.750000000001`. Prova mentale: Conto Corrente 4250.75 con un bonifico da −100 → 4150.75; totale 4150.75 + 12800 = 16950.75. Se nel Day 4 hai scelto un altro modo di aggiornare il saldo, **non mischiare i due**: scegline uno solo e rimuovi l'altro.

### Rimuovere `console.log` e codice morto
Cerca nei sorgenti. In VS Code: `Ctrl+Shift+F`, testo `console.`, filtro `src`. Da terminale PowerShell, dentro `liparibank/`:

```powershell
Get-ChildItem src -Recurse -Include *.js,*.jsx | Select-String "console\.|debugger"
```

Su macOS/Linux:

```bash
grep -rnE "console\.|debugger" src
```

Elimina ogni risultato che non sia un'eccezione voluta. Poi cerca file mai importati: per ogni file in `src/components/`, `src/hooks/`, `src/utils/` cerca il suo nome nei sorgenti; se compare solo nella sua stessa definizione, è codice morto. La cartella `src/legacy/` è materiale dell'extra React Legacy: **non** importata dall'app. Decidi se tenerla (documentandola nel README come "esempi di lettura") o spostarla fuori dal progetto consegnato.

### Lint
Dentro `liparibank/`:

```bash
npm run lint
```

oxlint segnala problemi di correttezza e li stampa con file, riga e colonna. Se non trova nulla non stampa nessun problema (dopo la riga del comando torni subito al prompt). Attenzione: variabili e import inutilizzati sono **warning**, non errori, e il comando termina comunque con successo; nel corso consideriamo "pulito" un lint **senza né errori né warning**. Facoltativo, per far fallire il comando anche sui warning (utile in una pipeline): `npx oxlint --deny-warnings`. Il lint **non** segnala i `console.log` (si cercano a mano, vedi sopra). Il set esatto di regole dipende dalla configurazione `.oxlintrc.json` del tuo progetto: non modificarla per far sparire un problema, correggi il codice. Poi ripeti finché l'output non ha problemi.

---

## 🏦 LipariBank in action

Commit consigliati per questo capitolo (uno per modifica logica):

```text
refactor(utils): estrae filterTransactions e sortByDateDesc
refactor(utils): centralizza il calcolo del saldo in balance.js
refactor(components): riusa TransactionList in dashboard e dettaglio conto
chore: rimuove console.log e import inutilizzati
chore: rimuove boilerplate Vite non usato
style: uniforma i nomi degli handler (handleX / onX)
```

Dopo ogni commit esegui `npm run lint` e un giro rapido nell'app (dashboard → movimenti → bonifico). I test manuali completi arrivano nel [capitolo successivo](./02_Testing_Manuale.md).

---

## 🧪 Your Turn

**Obiettivo:** ridurre la duplicazione e portare il lint a zero errori senza cambiare il comportamento.

**Requisiti**
1. Crea il branch `refactor/final-cleanup`.
2. Individua **almeno due** duplicazioni nel tuo codice (filtro, formattazione, calcolo saldo, markup di una riga movimento, blocco loading/error/empty) e eliminale estraendo funzione/componente. Annota prima e dopo: file toccati, righe rimosse.
3. Rimuovi tutti i `console.*` e `debugger`.
4. Rimuovi gli import e i file inutilizzati.
5. Rinomina almeno tre identificatori poco chiari.
6. `npm run lint` (nessun errore né warning) e `npm run build` senza errori.

**Passi suggeriti**
- Usa la ricerca di VS Code per trovare le duplicazioni: copia una riga caratteristica (per esempio `amount < 0`) e vedi dove compare.
- Estrai prima la funzione pura, poi sostituisci le occorrenze una alla volta, controllando l'app.
- Un commit per estrazione.

**Risultato atteso:** stessa app, stesso comportamento, meno codice ripetuto, lint pulito.

**Criteri di completamento:** nessuna regola di business (filtro, saldo) definita in più di un file; nessun `console.log`; lint e build verdi; i numeri della [tabella di verifica](../Day_08_Final_Project/06_Repository_Starter_e_Checkpoint.md) (es. 17.050,75 € totale, 2 risultati per `utenza` + Uscite) sono invariati.

---

## ⚠️ Common Mistakes
- **Refactoring senza verificare**: ogni passo va controllato nel browser.
- **Cambiare comportamento "già che ci sono"**: separa `refactor` da `fix`/`feat`.
- **`sort` direttamente sull'array dello state**: muta lo state; copia con `[...array]`.
- **Aggiungere `useMemo`/`useCallback` per "pulire"**: non è refactoring e spesso non serve (vedi [Memoization](../Day_08_Advanced_Hooks_Architecture/02_Memoization.md)).
- **Silenziare il lint** con commenti o regole disattivate invece di correggere.
- **Eliminare un file senza controllare gli import**: se la build si rompe, `npm run build` o `npm run dev` ti indicano il file mancante.

---

## ✅ Checklist
- ☐ Ho percorso tutta la checklist di revisione.
- ☐ Ho eliminato almeno due duplicazioni.
- ☐ Nessun `console.log` o `debugger` residuo.
- ☐ Nessun import o file inutilizzato.
- ☐ `npm run lint` passa.
- ☐ `npm run build` passa.
- ☐ Il comportamento dell'app è invariato (verificato a mano).

---

## 🚀 Challenge
Estrai un hook `useFilteredTransactions(transactions, filters)` che restituisca l'elenco filtrato e ordinato, usando `filterTransactions` e `sortByDateDesc`. Valuta onestamente se serve `useMemo`: con otto movimenti la risposta è probabilmente no.

---

## 📌 Recap
- Refactoring = stessa funzionalità, struttura migliore, a piccoli passi verificati.
- Regole di business in funzioni pure, in un solo posto.
- I dati derivati si calcolano, non si salvano nello state.
- Lint pulito, niente `console.log`, niente codice morto.

---

### ➡️ Next
Prossimo capitolo: [Testing Manuale](./02_Testing_Manuale.md) — dopo il refactoring serve dimostrare che i flussi principali funzionano ancora, con casi di test concreti.
