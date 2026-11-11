# 🏦 LipariBank — React Zero to Hero

> **Day 2 · Capitolo 01**
> **Argomento:** Componenti e composizione
> **Durata stimata:** 25 minuti
> **Parte di LipariBank:** introduzione del componente `Dashboard` che coordina i componenti della pagina

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- decidere quando conviene estrarre un nuovo componente;
- riconoscere i limiti di un componente che legge i dati da solo;
- distinguere un componente **presentazionale** da un componente **container**;
- creare `Dashboard.jsx` e semplificare `App.jsx`.

---

## 📋 Prerequisiti
- [Day 1 · Esercizio Dashboard](../Day_01_React_Fundamentals/06_Esercizio_LipariBank_Dashboard.md) completato (**Checkpoint 1**): `Header`, `BalanceCard`, `RecentTransactions` e `TransactionItem` funzionanti, `App.jsx` che li compone.
- Dev server acceso (`npm run dev` dentro `liparibank/`).

---

## 🧭 In questo capitolo
- Quando e come dividere l'interfaccia in componenti.
- Il problema dei componenti "con i dati incollati dentro".
- Presentazionale vs container.
- Creazione di `Dashboard.jsx`.

---

## 🧠 Theory

### Quando estrarre un componente
Estrai un componente quando almeno una di queste condizioni è vera:

1. **Si ripete**: lo stesso blocco di JSX compare più volte (come la riga di un movimento).
2. **Ha un nome chiaro**: riesci a dire in poche parole cosa è (`BalanceCard`, `AccountCard`).
3. **Ha una sola responsabilità**: fa una cosa, non cinque.
4. **Il file è troppo lungo** per essere compreso senza scorrere.

Non esiste una regola sulle righe: se hai dubbi, parti dal nome. Se non riesci a dargliene uno, forse non è un componente.

### Il problema dei dati "incollati" dentro
Nel Day 1 `BalanceCard` e `RecentTransactions` importano direttamente `mockData.js`. Funziona, ma:

- `BalanceCard` può mostrare **solo** il totale di *tutti* i conti: non puoi riusarla per un singolo conto;
- `RecentTransactions` mostra **solo** gli ultimi 5 movimenti globali: non puoi riusarla per i movimenti di un conto;
- per provare un componente con altri dati devi modificare il file.

Più avanti i dati arriveranno da altre fonti (stato, API): i componenti che li leggono direttamente andrebbero riscritti tutti.

### Presentazionale vs container
Una separazione molto utile:

| Tipo | Cosa fa | Cosa non fa |
| --- | --- | --- |
| **Presentazionale** (`BalanceCard`, `AccountCard`, `TransactionItem`...) | Riceve dati tramite **props** e li mostra. | Non sa da dove arrivano i dati, non li importa. |
| **Container** (`Dashboard`) | Ottiene/prepara i dati (importa, filtra, calcola) e li passa ai figli. | Ha poco markup proprio: compone i componenti presentazionali. |

> 💡 **Remember**
>
> Un componente presentazionale è come una funzione pura: stessi dati in ingresso, stessa UI in uscita. Il container decide *quali* dati usare.

---

## 💻 Let's Code

### 1. Creare il container `Dashboard`
Per ora il container compone soltanto i componenti già esistenti. Crea `src/components/Dashboard.jsx`:

```jsx
import BalanceCard from "./BalanceCard.jsx";
import RecentTransactions from "./RecentTransactions.jsx";

function Dashboard() {
  return (
    <main className="dashboard">
      <BalanceCard />
      <RecentTransactions />
    </main>
  );
}

export default Dashboard;
```

### 2. Semplificare `App`
Sostituisci `src/App.jsx`:

```jsx
import Header from "./components/Header.jsx";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  return (
    <div className="app">
      <Header />
      <Dashboard />
    </div>
  );
}

export default App;
```

`App` ora è solo la "radice": mette insieme intestazione e dashboard. Se avevi `Footer` (esercizio Day 1), puoi rimuoverlo o lasciarlo sotto `<Dashboard />`.

### 3. Stili del container
In `src/index.css` **aggiungi in fondo**:

```css
.dashboard {
  display: grid;
  gap: 1.5rem;
}
```

Poi nella regola `.balance-card` cambia `margin-bottom: 1.5rem;` in `margin-bottom: 0;`, perché la spaziatura è ora gestita dal `gap` della griglia.

**Cosa fa.** `Dashboard` diventa l'unico punto in cui verrà deciso *cosa* mostrare nella pagina.

**Perché funziona.** Un componente può contenere altri componenti a qualsiasi profondità: l'albero è ora `App → Header, Dashboard → BalanceCard, RecentTransactions → TransactionItem`.

**Come modificarlo.** Cambia l'ordine di `<BalanceCard />` e `<RecentTransactions />` e osserva la pagina.

**Errori da evitare.** Dimenticare di rimuovere gli import non più usati in `App.jsx`: `npm run lint` li segnala.

---

## 🏦 LipariBank in action
Albero dei componenti all'inizio del Day 2 e obiettivo a fine giornata:

```text
Oggi                               Fine Day 2
App                                App
├── Header                         ├── Header
└── Dashboard                      └── Dashboard            (container)
    ├── BalanceCard                    ├── BalanceCard
    └── RecentTransactions             ├── Card "I tuoi conti"
        └── TransactionItem            │   └── AccountList → AccountCard
                                       └── Card "Ultimi movimenti"
                                           └── TransactionList → TransactionItem / EmptyState
```

Nei prossimi capitoli i componenti diventeranno presentazionali (props), nascerà `Card` (children), e `Dashboard` diventerà l'unico a conoscere `mockData.js`.

---

## 🧪 Your Turn

**Obiettivo:** applicare i criteri di estrazione e la separazione presentazionale/container.

**Requisiti**
1. `src/components/Dashboard.jsx` esiste e `App.jsx` renderizza solo `<Header />` e `<Dashboard />` (più eventualmente `Footer`).
2. `App.jsx` non importa più `BalanceCard` né `RecentTransactions`.
3. La pagina è visivamente identica a quella del Day 1 (header, saldo `17.050,75 €`, cinque movimenti).
4. Crea un file di appunti personale (fuori da `src/`) in cui classifichi ciascuno di questi componenti come *presentazionale* o *container* **così come sono oggi** e spiega in una riga perché: `Header`, `BalanceCard`, `TransactionItem`, `RecentTransactions`, `Dashboard`.

**Passi suggeriti**
- Per ogni componente chiediti: importa `mockData.js`? Se sì, decide da solo quali dati mostrare.
- Poi chiediti: quale file dovrebbe importare i dati in un mondo ideale?

**Risultato atteso:** pagina invariata, struttura più pulita, appunti completati.

**Criteri di completamento:** i primi tre requisiti verificati nel browser e con `npm run lint`; gli appunti motivano le classificazioni.

Traccia di verifica per gli appunti: oggi `TransactionItem` è presentazionale (riceve `transaction`), `Header`, `BalanceCard` e `RecentTransactions` mescolano le due responsabilità perché importano direttamente i dati, e `Dashboard` non ha ancora dati da coordinare. Nei prossimi capitoli sistemeremo tutto.

---

## ⚠️ Common Mistakes
- **Estrarre componenti troppo presto o troppo piccoli**: un `<p>` usato una volta non è un componente.
- **Un componente "tuttofare"** che calcola, filtra e disegna 200 righe di JSX: dividilo per responsabilità.
- **Importazione circolare**: `Dashboard` importa `BalanceCard`, ma `BalanceCard` non deve importare `Dashboard`.
- **Più `<main>` nella pagina**: ce ne deve essere uno solo; ora è dentro `Dashboard`.

---

## ✅ Checklist
- ☐ So elencare almeno tre motivi per estrarre un componente.
- ☐ So spiegare la differenza tra presentazionale e container.
- ☐ Ho creato `Dashboard.jsx` e semplificato `App.jsx`.
- ☐ La pagina è identica a prima.
- ☐ Ho classificato i componenti esistenti.

---

## 🚀 Challenge
Disegna su carta (o in un file di testo) l'albero di componenti che ti servirà per mostrare **anche** una sezione "I tuoi conti" con una card per ogni conto. Quali componenti nuovi servono? Confronta poi il tuo schema con quello della sezione *LipariBank in action*.

---

## 📌 Recap
- Estrai un componente quando si ripete, ha un nome chiaro, una responsabilità sola.
- I dati importati direttamente dentro i componenti li rendono poco riusabili.
- Presentazionale = mostra ciò che riceve; container = coordina i dati.
- `Dashboard` è il container della pagina; `App` è la radice.

---

### ➡️ Next
Prossimo capitolo: [Props](./02_Props.md). Per rendere i componenti presentazionali dobbiamo imparare a passare loro i dati con le **props**.
