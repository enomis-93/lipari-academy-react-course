# 🏦 LipariBank — React Zero to Hero

> **Day 7 · Capitolo 06**
> **Argomento:** Esercizio — Migrazione a Redux (CHECKPOINT 7)
> **Durata stimata:** 75 minuti
> **Parte di LipariBank:** le ultime due pagine passano allo store, `BankContext` viene eliminato e lo stato condiviso ha di nuovo una sola sorgente

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- completare una migrazione da Context a Redux senza cambiare il comportamento dell'app;
- eliminare il codice che la migrazione ha reso inutile;
- verificare il risultato con una lista di controllo e con i Redux DevTools;
- confrontare le due soluzioni e motivare quando sceglieresti l'una o l'altra.

---

## 📋 Prerequisiti
- Capitoli [01](./01_Context_e_useContext.md), [02](./02_useReducer.md), [03](./03_Redux_Quando_e_Perche.md), [04](./04_Redux_Toolkit_Slice_e_Thunk.md) e [05](./05_React_Redux_Selector_e_Dispatch.md) completati.
- Stato del progetto: lo store contiene conti e movimenti; `TransactionsPage`, `AccountsPage` e `AccountDetailPage` leggono dallo store; `DashboardPage` e `TransferPage` usano ancora `useBank()`; `BankProvider` è ancora montato.
- Tutti i comandi si lanciano dentro `liparibank/`.

---

## 🧭 In questo capitolo
- Come si chiude una migrazione.
- Esempio guidato: la pagina del bonifico.
- Da solo: la dashboard e l'eliminazione di `BankContext`.
- Lista di controllo finale.
- Confronto tra le due soluzioni.

---

## 🧠 Theory

### Come si chiude una migrazione
Una migrazione è finita quando sono vere tre cose.

1. **Il comportamento è identico.** L'utente non deve accorgersi di nulla, a parte le differenze che hai deciso tu.
2. **Ogni dato ha una sola sorgente.** Finché convivono `BankContext` e lo store, l'app può mostrare due verità diverse.
3. **Non resta codice morto.** File, import, Provider e funzioni che nessuno usa più vanno eliminati: chi leggerà il progetto tra sei mesi non deve chiedersi a che cosa servono.

Il metodo è quello di sempre: passi piccoli, l'app funzionante dopo ogni passo, un commit dopo ogni passo riuscito.

### Che cosa resta dov'è
Non tutto va nello store. A migrazione conclusa LipariBank avrà:

| Strumento | Che cosa contiene |
|---|---|
| Store Redux | Conti, movimenti, stato del caricamento, errore |
| Context | La preferenza "nascondi saldi" (`SettingsContext`) |
| State locale | Filtri, testo di ricerca, conto selezionato, valori del form |

> 💡 **Remember**
>
> Migrare non significa spostare tutto. Significa mettere ogni dato nello strumento adatto e togliere il resto.

---

## 💻 Let's Code

### Passo 0 — Punto di partenza
Se usi la tua repository, salva lo stato attuale prima di iniziare. Dentro `liparibank/`:

```bash
git add -A
```

```bash
git commit -m "Day 7: store Redux e prime pagine migrate"
```

### Passo 1 — La pagina del bonifico (guidato)
Sostituisci `src/pages/TransferPage.jsx`:

```jsx title="src/pages/TransferPage.jsx"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransferForm from "../components/TransferForm.jsx";
import { beneficiaries } from "../data/mockData.js";
import { selectAccounts } from "../store/accountsSlice.js";
import {
  fetchTransactions,
  selectTransactionsError,
  selectTransactionsStatus,
  transferAdded,
} from "../store/transactionsSlice.js";

export default function TransferPage() {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const status = useSelector(selectTransactionsStatus);
  const error = useSelector(selectTransactionsError);
  const navigate = useNavigate();

  if (status === "idle" || status === "loading") {
    return <LoadingMessage message="Caricamento dei conti..." />;
  }
  if (status === "failed") {
    return <ErrorMessage message={error} onRetry={() => dispatch(fetchTransactions())} />;
  }

  function handleAddTransfer(transfer) {
    const beneficiary = beneficiaries.find((item) => item.id === transfer.beneficiaryId);
    if (!beneficiary) return;

    dispatch(
      transferAdded({
        accountId: transfer.accountId,
        beneficiaryName: beneficiary.name,
        amount: transfer.amount,
      }),
    );
    navigate("/transactions", { state: { transferCompleted: true } });
  }

  return (
    <section>
      <h1>Nuovo bonifico</h1>
      <p>Operazione simulata: nessun denaro viene trasferito.</p>
      <TransferForm
        accounts={accounts}
        beneficiaries={beneficiaries}
        onAddTransfer={handleAddTransfer}
      />
    </section>
  );
}
```

Confrontala con la versione del capitolo 02. Prima la pagina costruiva l'intero movimento: id, data, descrizione, segno dell'importo, categoria. Ora passa a `transferAdded` solo ciò che **lei** sa (conto, nome del beneficiario, importo) e il resto lo aggiunge `prepare`, dentro lo slice. Se domani cambiasse il formato della descrizione, modificheresti un solo file.

Verifica con il tab Redux aperto: esegui un bonifico di 50 € dal Conto Corrente a Giulia Bianchi.

- Nell'elenco compare **una** action, `transactions/transferAdded`.
- Nella scheda *Diff* le modifiche sono **due**: un elemento in più in `transactions.items` e il `balance` del conto in `accounts.items` passato da `4250.75` a `4200.75`.

Una action, due slice aggiornati: è ciò che avevi provato con Node nel capitolo 04.

Se usi la tua repository: `git commit -am "Day 7: TransferPage su Redux"`.

---

## 🏦 LipariBank in action

### Il flusso dei dati a migrazione conclusa

```text
main.jsx      Provider (store) > SettingsProvider > BrowserRouter
App.jsx       invia fetchTransactions() all'avvio; contiene solo le route
pagine        useSelector(...) per leggere, dispatch(...) per scrivere
store         accountsSlice + transactionsSlice
              fetchTransactions → transactionService → transactions.json
preferenze    SettingsContext → useSettings()
```

### Lista di controllo: che cosa deve restare identico

| # | Che cosa controllare | Risultato atteso |
|---|---|---|
| 1 | Apri `/` | Per un attimo "Caricamento dei movimenti...", poi la dashboard |
| 2 | Saldo totale in dashboard | `17.050,75 €` |
| 3 | Card "Movimenti — Conto Corrente" | 6 movimenti dal più recente; "Seleziona conto" sul Conto Risparmio → 2 movimenti e titolo della scheda `LipariBank — Conto Risparmio` |
| 4 | `/accounts` | Due conti: Conto Corrente e Conto Risparmio |
| 5 | `/accounts/acc-001` e `/accounts/acc-002` | 6 movimenti per il corrente, 2 per il risparmio |
| 6 | `/transactions` | 8 movimenti; "Entrate" → 4, "Uscite" → 4; ricerca `utenza` → 2; "☆ Preferito" diventa "★" |
| 7 | Bonifico di 50 € dal Conto Corrente a Giulia Bianchi | Navigazione a `/transactions` con "Bonifico simulato registrato."; in testa `Bonifico a Giulia Bianchi` di `-50,00 €`; Conto Corrente `4.200,75 €` in `/accounts`; totale `17.000,75 €` in dashboard |
| 8 | Bonifico non valido (importo vuoto, o maggiore del saldo) | Errori per campo, focus sul primo campo da correggere, nessun movimento aggiunto |
| 9 | Preferito messo in `/transactions`, poi apri la dashboard | Lo stesso movimento è "★" anche lì |
| 10 | "Nascondi saldi" in dashboard, poi `/accounts` | Importi nascosti in entrambe le pagine |
| 11 | Indirizzo inesistente (`/xyz`) | Pagina 404 dentro il layout |
| 12 | Ricarica (F5) dopo un bonifico | Bonifici e preferiti spariscono: lo store vive in memoria |
| 13 | Tab *Network* dopo un ricaricamento | **Una** sola richiesta per `transactions.json` |
| 14 | Console del browser durante la navigazione | Nessun errore e nessun avviso |

Le righe 9 e 13 falliscono finché convivono due sorgenti: sono la prova che la migrazione è davvero conclusa.

---

## 🧪 Your Turn

### Parte A — Completa la migrazione
**Obiettivo:** portare la dashboard sullo store ed eliminare `BankContext`.

**Requisiti:**
1. **`DashboardPage`:** conti, movimenti, `status` ed errore arrivano da `useSelector`; "Riprova" e "Preferito" usano `dispatch`. Nessun uso di `useBank()`. `hideBalance` continua ad arrivare da `useSettings()`.
2. **`main.jsx`:** `BankProvider` non c'è più. Restano `Provider` dello store, `SettingsProvider` e `BrowserRouter`.
3. **File eliminati:** `src/context/BankContext.jsx` e `src/context/bankReducer.js`.
4. **Nessun riferimento residuo:** il comando di ricerca qui sotto non trova nulla.
5. **Pulizia:** nessun `console.log` di prova; `npm run lint` e `npm run build` senza errori.
6. **Verifica:** tutte le 14 righe della lista di controllo.

Per il requisito 4, in PowerShell:

```powershell
Select-String -Path src\*.jsx, src\*\*.jsx, src\*\*.js -Pattern "useBank|BankContext|bankReducer"
```

Con un terminale bash (Git Bash, macOS, Linux):

```bash
grep -rnE "useBank|BankContext|bankReducer" src
```

**Passi suggeriti:**
1. Migra `DashboardPage` e verifica le righe 1-3 e 9 della lista.
2. Togli `BankProvider` da `main.jsx`: se una pagina usa ancora `useBank()`, l'errore "useBank deve essere usato dentro `<BankProvider>`" ti dice quale.
3. Elimina i due file e lancia il comando di ricerca.
4. Esegui tutta la lista di controllo.

**Risultato atteso:** l'app si comporta come prima; nel tab *Network* c'è una sola richiesta dei movimenti; ogni azione dell'utente sui dati bancari compare nei Redux DevTools.

**Criteri di completamento:** i 6 requisiti sono soddisfatti; hai fatto un commit per ogni passo riuscito.

> ⚠️ **Prova prima da solo.** La soluzione serve a confrontare la forma (hook in cima, guardie su `status`, nessun `useBank`), non ogni riga.

### Soluzione di riferimento — parti chiave

`src/pages/DashboardPage.jsx`:

```jsx title="src/pages/DashboardPage.jsx"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import AccountList from "../components/AccountList.jsx";
import BalanceCard from "../components/BalanceCard.jsx";
import Card from "../components/Card.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransactionFilters from "../components/TransactionFilters.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { useSettings } from "../context/SettingsContext.jsx";
import { selectAccounts } from "../store/accountsSlice.js";
import {
  favoriteToggled,
  fetchTransactions,
  selectTransactions,
  selectTransactionsError,
  selectTransactionsStatus,
} from "../store/transactionsSlice.js";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const transactions = useSelector(selectTransactions);
  const status = useSelector(selectTransactionsStatus);
  const error = useSelector(selectTransactionsError);
  const { hideBalance, toggleHideBalance } = useSettings();

  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const selectedAccount =
    accounts.find((account) => account.id === selectedAccountId) ?? accounts[0];
  const selectedAccountName = selectedAccount?.name;

  useEffect(() => {
    if (!selectedAccountName) return undefined;

    document.title = `LipariBank — ${selectedAccountName}`;

    return () => {
      document.title = "LipariBank";
    };
  }, [selectedAccountName]);

  if (status === "idle" || status === "loading") {
    return <LoadingMessage message="Caricamento dei movimenti..." />;
  }
  if (status === "failed") {
    return <ErrorMessage message={error} onRetry={() => dispatch(fetchTransactions())} />;
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const normalizedSearch = searchText.trim().toLowerCase();

  const visibleTransactions = transactions
    .filter((transaction) => transaction.accountId === selectedAccount.id)
    .filter((transaction) => {
      if (filter === "income") return transaction.amount > 0;
      if (filter === "expense") return transaction.amount < 0;
      return true;
    })
    .filter((transaction) => transaction.description.toLowerCase().includes(normalizedSearch))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="dashboard">
      <button type="button" onClick={toggleHideBalance}>
        {hideBalance ? "Mostra saldi" : "Nascondi saldi"}
      </button>

      <BalanceCard total={totalBalance} note="Somma di tutti i tuoi conti" />

      <Card title="I tuoi conti">
        <AccountList
          accounts={accounts}
          transactions={transactions}
          selectedAccountId={selectedAccount.id}
          onSelectAccount={setSelectedAccountId}
        />
      </Card>

      <Card title={`Movimenti — ${selectedAccount.name}`}>
        <TransactionFilters
          filter={filter}
          searchText={searchText}
          onFilterChange={setFilter}
          onSearchChange={setSearchText}
        />
        {transactions.length === 0 ? (
          <EmptyState message="Non ci sono ancora movimenti per i tuoi conti." />
        ) : (
          <TransactionList
            transactions={visibleTransactions}
            onToggleFavorite={(transactionId) => dispatch(favoriteToggled(transactionId))}
          />
        )}
      </Card>

      <p>
        <Link to="/transfer">Nuovo bonifico</Link>
      </p>
    </div>
  );
}
```

`src/main.jsx`:

```jsx title="src/main.jsx"
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { store } from "./store/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SettingsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SettingsProvider>
    </Provider>
  </StrictMode>,
);
```

`App.jsx`, gli slice e le altre pagine sono quelli dei capitoli 04 e 05.

### Parte B — Confronta e motiva
**Obiettivo:** saper spiegare la scelta, non solo eseguirla.

Rispondi per iscritto, in due o tre righe ciascuna.

1. Che cosa hai guadagnato passando da `BankContext` allo store? Indica almeno due vantaggi che hai **visto** in questi capitoli.
2. Che cosa ti è costato?
3. Perché `hideBalance` è rimasto in un Context?
4. In quale progetto **non** introdurresti Redux?

### Soluzione di riferimento — Parte B
1. I re-render: `AccountsPage` non viene più rieseguita quando cambia un preferito (capitolo 05). La tracciabilità: ogni azione è nei DevTools con payload e differenze, e si può tornare indietro. In più: la logica si prova con Node senza React, e un bonifico aggiorna due slice con una sola action.
2. Due pacchetti in più, più concetti (slice, thunk, selector), più file, e una fase di migrazione con due sorgenti dei dati.
3. È un solo valore, trasversale, che cambia di rado: il caso d'uso del Context. Nello store non porterebbe alcun vantaggio.
4. In un'app piccola, con poco stato condiviso, o in un prototipo: il costo supererebbe il beneficio.

---

## 🔗 Repository / Checkpoint

### CHECKPOINT 7 — Stato condiviso con Redux

Puoi proseguire dal tuo progetto oppure ripartire dal checkpoint del giorno.

- **Checkpoint del corso:** `liparibank-day-07.zip`, allegato al Day 7 sulla piattaforma. Per usarlo vedi [Come usare i checkpoint](../Day_00_Setup/06_Come_usare_i_checkpoint.md).
- **La tua repository:** tag suggerito `checkpoint-7-redux`.

| Domanda | Risposta |
|---|---|
| **Contenuto iniziale** | Progetto a fine Day 6: `App.jsx` con state e props, pagine in `src/pages/`. |
| **Che cosa completare** | `SettingsContext`; `src/store/` con `accountsSlice`, `transactionsSlice`, `store`; `Provider`; pagine collegate con `useSelector` e `useDispatch`. |
| **Che cosa non deve esserci** | `BankContext.jsx`, `bankReducer.js`, state o props di dati in `App.jsx`. |
| **Come verificare** | Le 14 righe della lista di controllo; `npm run lint`; `npm run build`. |

---

## ⚠️ Common Mistakes
- **Lasciare `BankProvider` montato "per sicurezza".** Carica i movimenti una seconda volta e tiene in vita una sorgente che nessuno legge.
- **Dimenticare una pagina.** Tolto il Provider, `useBank()` lancia un errore chiaro: leggilo, indica il file.
- **Lasciare i file del Context nel progetto.** Codice morto: confonde chi legge e il linter non sempre lo segnala.
- **Portare `hideBalance` nello store "già che ci sono".** Funzionerebbe, ma è lavoro senza beneficio.
- **Verificare solo la pagina appena migrata.** Un bonifico tocca tre pagine: esegui sempre tutta la lista.
- **Chiamare gli hook dopo le guardie su `status`.** `useSelector`, `useDispatch`, `useSettings` e `useEffect` vanno prima di qualunque `return`.

---

## ✅ Checklist
- ☐ `TransferPage` e `DashboardPage` leggono e scrivono sullo store.
- ☐ `BankProvider` non è più in `main.jsx`; `BankContext.jsx` e `bankReducer.js` non esistono più.
- ☐ La ricerca di `useBank`, `BankContext` e `bankReducer` in `src` non trova nulla.
- ☐ Le 14 righe della lista di controllo sono verificate.
- ☐ Un bonifico produce una sola action che aggiorna due slice.
- ☐ So spiegare perché `hideBalance` è rimasto in Context.
- ☐ `npm run lint` e `npm run build` terminano senza errori.

---

## 🚀 Challenge
Il saldo totale della dashboard è calcolato nella pagina con `reduce`. Spostalo in un selector `selectTotalBalance` in `accountsSlice.js` e usalo in `DashboardPage`. Poi rispondi: questo selector esegue un calcolo a ogni chiamata, ma non provoca re-render inutili. Perché? E perché lo stesso non varrebbe per un selector che restituisce l'elenco dei movimenti filtrati?

---

## 📌 Recap
- Una migrazione è finita quando il comportamento è identico, ogni dato ha una sola sorgente e non resta codice morto.
- LipariBank ora usa tre strumenti: store Redux per i dati bancari, Context per le preferenze, state locale per la UI di ogni pagina.
- Le pagine dichiarano che cosa è successo (`dispatch`) e che cosa vogliono leggere (`useSelector`); come cambia lo state lo sanno solo gli slice.
- Redux ha portato meno re-render e piena tracciabilità, al prezzo di più concetti e più file.
- Scegliere lo strumento è una decisione da motivare caso per caso.

---

### ➡️ Next
[Day 8 · Capitolo 01 — Custom Hooks](../Day_08_Advanced_Hooks_Architecture/01_Custom_Hooks.md): i filtri sui movimenti sono ancora duplicati tra due pagine. Li estrarremo in un hook riusabile, insieme alla logica del form e alla persistenza delle preferenze.
