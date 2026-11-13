# 🏦 LipariBank — React Zero to Hero

> **Day 8 · Capitolo 05**
> **Argomento:** Esercizio — Refactoring di LipariBank (CHECKPOINT 8)
> **Durata stimata:** 60 minuti
> **Parte di LipariBank:** i hook arrivano nelle pagine rimaste, il codice morto sparisce e la struttura viene verificata con ricerche mirate

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- applicare un custom hook a tutte le pagine che ripetono la stessa logica;
- trovare ed eliminare il codice morto che il linter non segnala;
- verificare con delle ricerche che il progetto rispetta le regole di struttura;
- dimostrare con una lista di controllo che il comportamento non è cambiato.

---

## 📋 Prerequisiti
- Capitoli [01](./01_Custom_Hooks.md), [02](./02_Memoization.md), [03](./03_Service_Layer_e_Error_Boundary.md) e [04](./04_Architettura_del_Progetto.md) completati.
- Stato del progetto: `TransactionsPage` usa `useTransactions`; `DashboardPage` e `AccountDetailPage` filtrano e ordinano ancora i movimenti a mano; `src/data/mockData.js` esporta ancora `accounts` e `transactions`.
- Tutti i comandi si lanciano dentro `liparibank/`.

---

## 🧭 In questo capitolo
- Che cosa significa fare refactoring.
- Come si trova il codice morto.
- Esempio guidato: il dettaglio del conto.
- Da solo: la dashboard, la pulizia, le verifiche di struttura.
- Lista di controllo finale.

---

## 🧠 Theory

### Refactoring: stessa funzione, struttura migliore
Un **refactoring** cambia *come* è scritto il codice, non *che cosa fa* l'app. Per questo:

1. **Fotografa il comportamento** prima di iniziare, con una lista di controllo.
2. Lavora a **passi piccoli**, con l'app sempre funzionante.
3. **Fai un commit** dopo ogni passo riuscito: se rompi qualcosa, torni indietro di poco.
4. Ripeti la lista di controllo **alla fine**.

### Come si trova il codice morto
Il linter segnala import e variabili inutilizzati **dentro un file**. Non segnala ciò che un file *esporta* e nessuno importa più: una funzione, un selector, un array di dati.

Per quelli serve una ricerca: cerca il nome in tutto `src/`. Se compare solo nel punto in cui è definito, è codice morto.

> 💡 **Remember**
>
> Un refactoring finito non lascia tracce: niente logica duplicata, niente export che nessuno usa, niente file "tenuti per sicurezza". Per quello c'è Git.

---

## 💻 Let's Code

### Passo 0 — Punto di partenza
Esegui la lista di controllo della sezione "LipariBank in action" sull'app attuale: deve essere già tutta verde. Poi, se usi la tua repository, salva il punto di partenza. Dentro `liparibank/`:

```bash
git add -A
```

```bash
git commit -m "Day 8: prima del refactoring finale"
```

### Passo 1 — Il dettaglio del conto (guidato)
`AccountDetailPage` legge tutti i movimenti, li filtra per conto e li ordina. È ciò che `useTransactions` fa già. Sostituisci `src/pages/AccountDetailPage.jsx`:

```jsx title="src/pages/AccountDetailPage.jsx"
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import Card from "../components/Card.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { useSettings } from "../context/SettingsContext.jsx";
import { useTransactions } from "../hooks/useTransactions.js";
import { selectAccounts } from "../store/accountsSlice.js";
import { favoriteToggled } from "../store/transactionsSlice.js";
import { formatCurrency } from "../utils/formatters.js";

export default function AccountDetailPage() {
  const { accountId } = useParams();
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const accountTransactions = useTransactions({ accountId });
  const { hideBalance } = useSettings();

  const account = accounts.find((item) => item.id === accountId);

  if (!account) {
    return (
      <section>
        <h2>Conto non trovato</h2>
        <p>Non esiste nessun conto con id "{accountId}".</p>
        <Link to="/accounts">Torna ai conti</Link>
      </section>
    );
  }

  return (
    <section>
      <Card title={account.name}>
        <p>{account.iban}</p>
        <p>Saldo: {hideBalance ? "••••••" : formatCurrency(account.balance)}</p>
      </Card>

      <h2>Movimenti del conto</h2>
      <TransactionList
        transactions={accountTransactions}
        onToggleFavorite={(transactionId) => dispatch(favoriteToggled(transactionId))}
      />
    </section>
  );
}
```

Che cosa è cambiato:

- `useTransactions({ accountId })` sostituisce il selector dei movimenti e la catena `filter` + `sort`;
- il hook è chiamato **prima** del `return` anticipato per il conto inesistente: gli Hooks vanno sempre in cima;
- se l'`accountId` dell'indirizzo non esiste, il hook restituisce semplicemente un array vuoto, che in quel caso non viene usato.

Verifica: `/accounts/acc-001` mostra 6 movimenti, `/accounts/acc-002` ne mostra 2, `/accounts/xyz` mostra "Conto non trovato".

---

## 🏦 LipariBank in action

### Il flusso dei dati a fine Day 8

```text
pagine        useBankStatus() · useTransactions() · useSelector(...) · dispatch(...)
componenti    solo interfaccia; TransferForm → useTransferForm()
store         accountsSlice + transactionsSlice (reducer, thunk, selector)
service       accountService, transactionService → apiClient → file JSON
preferenze    SettingsContext → useLocalStorage → localStorage
```

### Lista di controllo

| # | Che cosa controllare | Risultato atteso |
|---|---|---|
| 1 | Apri `/` | Per un attimo "Caricamento dei movimenti...", poi la dashboard |
| 2 | Saldo totale | `17.050,75 €` |
| 3 | Card "Movimenti — Conto Corrente" | 6 movimenti dal più recente; "Seleziona conto" sul Conto Risparmio → 2 movimenti e titolo della scheda `LipariBank — Conto Risparmio` |
| 4 | Filtri e ricerca in dashboard | "Entrate" sul Conto Corrente → 2 movimenti; ricerca `utenza` → 2 |
| 5 | `/accounts/acc-001` e `/accounts/acc-002` | 6 movimenti per il corrente, 2 per il risparmio |
| 6 | `/transactions` | 8 movimenti; "Entrate" → 4, "Uscite" → 4; ricerca `utenza` → 2; "☆ Preferito" diventa "★" |
| 7 | "Uscite per categoria" in `/transactions` | `Utenze: 143,10 €`, `Alimentari: 62,40 €`, `Svago: 39,90 €`; click su "Utenze" → 2 movimenti; secondo click → di nuovo tutti |
| 8 | Bonifico di 50 € dal Conto Corrente a Giulia Bianchi | Navigazione a `/transactions` con "Bonifico simulato registrato."; in testa `Bonifico a Giulia Bianchi` di `-50,00 €`; Conto Corrente `4.200,75 €`; totale `17.000,75 €` |
| 9 | Bonifico non valido | Errori per campo, focus sul primo campo da correggere, nessun movimento aggiunto |
| 10 | "Nascondi saldi", poi `F5` | I saldi restano nascosti in tutte le pagine |
| 11 | Filtro "Uscite" in `/transactions`, poi `F5` | Il filtro resta selezionato |
| 12 | Indirizzo inesistente (`/xyz`) | Pagina 404 dentro il layout |
| 13 | `F5` dopo un bonifico | Bonifici e preferiti spariscono (lo store vive in memoria); le preferenze restano |
| 14 | Tab *Network* dopo un ricaricamento | Una richiesta per `accounts.json` e una per `transactions.json` |
| 15 | Console del browser durante la navigazione | Nessun errore e nessun avviso |

---

## 🧪 Your Turn

**Obiettivo:** completare il refactoring senza cambiare nessuna delle 15 righe della lista di controllo.

**Requisiti:**
1. **`DashboardPage`:** i movimenti del conto selezionato, con filtro e ricerca, arrivano da `useTransactions({ accountId, filter, searchText })`. La catena `filter` + `sort` sparisce dalla pagina.
2. **Nessuna logica duplicata:** in `src/pages/` non compare più `localeCompare`.
3. **Codice morto nei dati:** `src/data/mockData.js` esporta solo `customer` e `beneficiaries`. Prima di cancellare `accounts` e `transactions` verifica con una ricerca che nessun file li importi più da lì.
4. **Regole di struttura** (capitolo 04), da verificare con le ricerche qui sotto:
   - `fetch(` compare solo in `src/services/apiClient.js`;
   - nessun file in `src/services/` o `src/store/` importa `react` o `react-redux`;
   - nessun file in `src/components/`, `src/hooks/` o `src/store/` importa da `pages/`.
5. **Verifica:** `npm run lint` e `npm run build` senza errori; tutte le 15 righe della lista di controllo.

Ricerche in PowerShell:

```powershell
Get-ChildItem src -Recurse -Include *.js, *.jsx | Select-String -Pattern "fetch\(", "localeCompare", "mockData"
```

```powershell
Get-ChildItem src\services, src\store -Recurse | Select-String -Pattern "from ""react"
```

```powershell
Get-ChildItem src\components, src\hooks, src\store -Recurse | Select-String -Pattern "pages/"
```

Con un terminale bash (Git Bash, macOS, Linux):

```bash
grep -rnE "fetch\(|localeCompare|mockData" src
```

```bash
grep -rn 'from "react' src/services src/store
```

```bash
grep -rn "pages/" src/components src/hooks src/store
```

**Passi suggeriti:**
1. In `DashboardPage` chiama `useTransactions` **prima** delle guardie su caricamento ed errore. All'avvio il conto selezionato non esiste ancora: passa `accountId: selectedAccount?.id ?? null`.
2. Dopo ogni requisito esegui `npm run lint` e controlla il browser; poi fai un commit.
3. Per il requisito 3 cerca `mockData` in tutto `src/` e guarda **che cosa** importa ogni file.

**Risultato atteso:**
- la prima ricerca trova `fetch(` in `apiClient.js`, `localeCompare` solo in `src/hooks/useTransactions.js` e `mockData` solo in `AppLayout.jsx` (per `customer`) e `TransferPage.jsx` (per `beneficiaries`);
- la seconda e la terza ricerca non trovano nulla.

**Criteri di completamento:** i 5 requisiti sono soddisfatti; hai fatto un commit per ogni passo riuscito.

> ⚠️ **Prova prima da solo.** La soluzione serve a confrontare, non a copiare.

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
import { useBankStatus } from "../hooks/useBankStatus.js";
import { useTransactions } from "../hooks/useTransactions.js";
import { selectAccounts } from "../store/accountsSlice.js";
import { favoriteToggled, selectTransactions } from "../store/transactionsSlice.js";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const transactions = useSelector(selectTransactions);
  const { isLoading, error, reload } = useBankStatus();
  const { hideBalance, toggleHideBalance } = useSettings();

  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const selectedAccount =
    accounts.find((account) => account.id === selectedAccountId) ?? accounts[0];
  const selectedAccountName = selectedAccount?.name;

  const visibleTransactions = useTransactions({
    accountId: selectedAccount?.id ?? null,
    filter,
    searchText,
  });

  useEffect(() => {
    if (!selectedAccountName) return undefined;

    document.title = `LipariBank — ${selectedAccountName}`;

    return () => {
      document.title = "LipariBank";
    };
  }, [selectedAccountName]);

  if (isLoading) return <LoadingMessage message="Caricamento dei movimenti..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

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

`useTransactions` è chiamato quando `accounts` può essere ancora vuoto: in quel caso riceve `accountId: null` e restituisce tutti i movimenti, che non vengono mostrati perché la guardia su `isLoading` interrompe il render subito dopo. `transactions` (tutti i movimenti) serve ancora ad `AccountList` per contare i movimenti di ogni conto e per distinguere "nessun movimento" da "nessun movimento con questi filtri".

`src/data/mockData.js`:

```javascript title="src/data/mockData.js"
export const customer = { id: "cust-001", firstName: "Mario", lastName: "Rossi" };

export const beneficiaries = [
  { id: "ben-001", name: "Giulia Bianchi", iban: "IT00 0000 0000 0000 0000 0000 111" },
  { id: "ben-002", name: "Luca Verdi", iban: "IT00 0000 0000 0000 0000 0000 222" },
  { id: "ben-003", name: "Condominio Lipari (fittizio)", iban: "IT00 0000 0000 0000 0000 0000 333" },
];
```

---

## 🔗 Repository / Checkpoint

### CHECKPOINT 8 — Hook, service layer e struttura finale

Puoi proseguire dal tuo progetto oppure ripartire dal checkpoint del giorno.

- **Checkpoint del corso:** `liparibank-day-08.zip`, allegato al Day 8 sulla piattaforma. Per usarlo vedi [Come usare i checkpoint](../Day_00_Setup/06_Come_usare_i_checkpoint.md).
- **La tua repository:** tag suggerito `checkpoint-8-refactoring`.

| Domanda | Risposta |
|---|---|
| **Contenuto iniziale** | Progetto a fine Day 7: store Redux, `SettingsContext`, pagine con selector e filtri scritti a mano. |
| **Che cosa completare** | I quattro hook in `src/hooks/`; `CategorySummary` e il selector memoizzato; `apiClient`, i service, `accounts.json`, `errorMessages`; `ErrorBoundary`; pulizia di `mockData.js`. |
| **Che cosa non deve esserci** | Catene `filter` + `sort` nelle pagine; `fetch` fuori da `apiClient.js`; export inutilizzati. |
| **Come verificare** | Le 15 righe della lista di controllo; le tre ricerche; `npm run lint`; `npm run build`. |

---

## ⚠️ Common Mistakes
- **Cancellare prima di cercare.** Togli un export solo dopo aver verificato che nessuno lo importi.
- **Chiamare `useTransactions` dopo le guardie.** Gli Hooks vanno prima di qualunque `return`.
- **Fidarsi solo del linter.** Trova gli import inutilizzati, non gli export inutilizzati.
- **Refactoring e nuove funzioni nello stesso commit.** Se qualcosa si rompe non sai quale delle due modifiche è stata.
- **Saltare la lista di controllo finale.** "Compila" non significa "si comporta come prima".
- **Lasciare codice commentato "per sicurezza".** La versione precedente è nella storia di Git.

---

## ✅ Checklist
- ☐ `DashboardPage` e `AccountDetailPage` usano `useTransactions`.
- ☐ In `src/pages/` non ci sono più catene `filter` + `sort` sui movimenti.
- ☐ `mockData.js` esporta solo `customer` e `beneficiaries`.
- ☐ Le tre ricerche danno il risultato atteso.
- ☐ Le 15 righe della lista di controllo sono verificate.
- ☐ `npm run lint` e `npm run build` terminano senza errori.
- ☐ Ho salvato il lavoro con un commit (CHECKPOINT 8).

---

## 🚀 Challenge
Quanto si sono alleggerite le pagine? Se hai fatto un commit a inizio giornata, confrontalo con lo stato attuale usando `git diff --stat <commit iniziale> -- src/pages`. Poi scegli la pagina che si è ridotta di più e spiega dove è finito il codice che non c'è più.

---

## 📌 Recap
- Un refactoring cambia la struttura, non il comportamento: lo dimostra la lista di controllo.
- I custom hook eliminano la logica ripetuta: filtri, ordinamento e stato del caricamento stanno ciascuno in un punto solo.
- Il codice morto si trova cercando i nomi; il linter non vede gli export inutilizzati.
- Le regole di struttura si possono verificare con semplici ricerche.
- LipariBank ora ha una forma stabile: pagine, componenti, hook, store, service, utils.

---

### ➡️ Next
[Day 9 · Capitolo 01 — Brief e requisiti](../Day_09_Final_Project_Delivery/01_Brief_e_Requisiti.md): non aggiungiamo altri concetti. Porti LipariBank fino alla consegna, completando da solo le ultime funzionalità.
