# 🏦 LipariBank — React Zero to Hero

> **Day 1 · Capitolo 01**
> **Argomento:** React e LipariBank
> **Durata stimata:** 20 minuti
> **Parte di LipariBank:** punto di partenza — la pagina minima creata nel Day 0 viene "letta" e modificata per capire come ragiona React

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- spiegare che cos'è React e quali problemi risolve;
- descrivere che cos'è una **SPA** (Single Page Application);
- distinguere il **rendering dichiarativo** (React) da quello imperativo (DOM manuale);
- modificare `src/App.jsx` e vedere il risultato nel browser grazie all'aggiornamento automatico del dev server.

---

## 📋 Prerequisiti
- Ambiente pronto: [Day 0 · Verifica ambiente](../Day_00_Setup/07_Verifica_ambiente.md).
- Progetto `liparibank/` creato con Vite ([Day 0 · Vite e primo progetto React](../Day_00_Setup/05_Vite_e_primo_progetto_React.md)): `npm run dev` funziona e `src/App.jsx` mostra la pagina minima "LipariBank" (un `h1` e un paragrafo).
- Basi di JavaScript. Se ti servono ripassi, usa la sezione [Extra JavaScript Essentials](../Extra_JavaScript_Essentials/01_Variables_Types.md).

---

## 🧭 In questo capitolo
- Che cos'è React e perché si usa.
- SPA e rendering dichiarativo.
- Primo esperimento: cambiare l'interfaccia modificando codice.
- Anteprima del progetto LipariBank e dei suoi componenti.

---

## 🧠 Theory

### Che cos'è React
**React** è una libreria JavaScript per costruire interfacce utente. Non è un framework "completo": si occupa della **UI** (cosa mostrare a schermo) e lascia a te, o a librerie aggiuntive, routing, chiamate HTTP e altro. Nel corso aggiungeremo solo ciò che serve, un pezzo alla volta.

L'idea centrale: l'interfaccia è un **albero di componenti**. Ogni componente è una funzione JavaScript che restituisce una parte di UI. Componi i componenti come mattoncini per costruire pagine intere.

### Perché usare React
- **Riuso**: scrivi una volta il componente "riga movimento" e lo usi per ogni movimento.
- **Manutenibilità**: ogni pezzo di UI ha il suo file e la sua responsabilità.
- **Prevedibilità**: la UI è una funzione dei dati. Cambiano i dati, React aggiorna lo schermo.
- **Ecosistema**: strumenti, documentazione e community molto ampi.

### SPA — Single Page Application
In una **SPA** il browser carica **una sola pagina HTML** (`index.html`) con un contenitore vuoto, e JavaScript costruisce l'interfaccia dentro quel contenitore. Quando l'utente "cambia pagina", non viene scaricato un nuovo documento HTML: JavaScript sostituisce le parti di UI. La navigazione vera e propria la vedremo nel [Day 6](../Day_06_Routing/01_SPA_e_Routing.md).

### Rendering dichiarativo
Nel modo **imperativo** dici al browser *come* cambiare la pagina, passo dopo passo. Nel modo **dichiarativo** descrivi *come deve apparire* l'interfaccia e React si occupa di aggiornare il DOM.

> 💡 **Remember**
>
> In React non scrivi "trova l'elemento e cambia il testo". Scrivi "questa è la UI per questi dati". React calcola la differenza e aggiorna solo ciò che serve.

---

## 💻 Let's Code

### Confronto: DOM manuale vs React
Versione **imperativa** (JavaScript puro, solo per confronto, non va inserita nel progetto):

```javascript
const balanceElement = document.createElement("p");
balanceElement.textContent = "Saldo: 4.250,75 €";
balanceElement.className = "balance";
document.getElementById("root").appendChild(balanceElement);
```

Versione **dichiarativa** (React, la scriveremo davvero tra poco):

```jsx
function Balance() {
  return <p className="balance">Saldo: 4.250,75 €</p>;
}
```

Nel primo caso descrivi le operazioni da eseguire; nel secondo descrivi il risultato. Quando i dati diventeranno dinamici (Day 3), la seconda forma resterà semplice, la prima diventerà molto difficile da mantenere.

### Primo esperimento nel progetto
1. Apri un terminale **dentro la cartella `liparibank/`** e avvia il dev server:

```bash
npm run dev
```

2. Apri nel browser l'indirizzo mostrato dal terminale (di default `http://localhost:5173/`).
3. Lascia il server acceso. Apri `src/App.jsx`: dopo il Day 0 contiene `<main className="app">` con `h1` e paragrafo. Per questo esperimento useremo un fragment `<>...</>` al posto di `<main>`: sostituisci il contenuto con una struttura come questa (la tua può differire in piccoli dettagli):

```jsx title="src/App.jsx"
function App() {
  return (
    <>
      <h1>LipariBank</h1>
      <p>Benvenuto nella tua banca digitale.</p>
    </>
  );
}

export default App;
```

4. Modifica il paragrafo e salva il file:

```jsx
function App() {
  return (
    <>
      <h1>LipariBank</h1>
      <p>La tua banca digitale (fittizia) è pronta per React.</p>
    </>
  );
}

export default App;
```

**Cosa succede.** Appena salvi, il browser si aggiorna **senza ricaricare la pagina**: è l'*Hot Module Replacement* (HMR) di Vite. `App` è una funzione: React la esegue, prende il JSX restituito e lo trasforma in elementi DOM dentro `<div id="root">`.

**Come modificarlo.** Cambia il testo dell'`h1`, aggiungi un secondo paragrafo: dovrai racchiuderlo nello stesso elemento padre (il fragment `<>...</>`). Il perché lo vedremo nel [capitolo sul JSX](./03_JSX.md).

**Errori da evitare.** Non togliere `export default App;`: senza di esso `main.jsx` non può importare il componente.

---

## 🏦 LipariBank in action
Alla fine del Day 1 la dashboard sarà composta da componenti piccoli, ciascuno con un compito:

```text
App
├── Header              → nome del cliente
└── main
    ├── BalanceCard         → saldo totale
    └── RecentTransactions  → ultimi 5 movimenti
        └── TransactionItem → una riga movimento
```

Tutti i dati arrivano da un array locale (`src/data/mockData.js`): cliente fittizio **Mario Rossi**, due conti e alcuni movimenti. Nessuna chiamata di rete, nessun dato reale.

---

## 🧪 Your Turn

**Obiettivo:** sperimentare il ciclo "modifico → salvo → vedo".

**Requisiti**
1. Il dev server è acceso e la pagina è aperta nel browser.
2. In `src/App.jsx` il titolo mostra `LipariBank` e sotto compaiono **due** righe di testo: una con il nome del cliente (`Mario Rossi`) e una con la scritta "Dashboard in costruzione".
3. Le due righe devono essere elementi `<p>` distinti, dentro il fragment.

**Passi suggeriti**
- Parti dal codice dell'esempio e aggiungi un secondo `<p>`.
- Salva e controlla il browser, senza ricaricare manualmente.
- Apri gli strumenti di sviluppo del browser (tasto `F12`), tab *Elements*: osserva che dentro `<div id="root">` ci sono `h1` e `p`.

**Risultato atteso:** la pagina mostra titolo e due paragrafi, aggiornati subito dopo il salvataggio.

**Criteri di completamento:** nessun errore nel terminale e nella console del browser; i due paragrafi sono visibili.

---

## ⚠️ Common Mistakes
- **Il browser non si aggiorna.** Controlla che `npm run dev` sia ancora in esecuzione e che tu abbia salvato il file.
- **Schermata bianca dopo la modifica.** Probabile errore di sintassi: leggi il messaggio nel terminale o nell'overlay di Vite, che indica file e riga.
- **Aprire `index.html` con doppio click.** Il progetto va visto attraverso il dev server, non come file locale.

---

## ✅ Checklist
- ☐ So spiegare in due frasi che cos'è React.
- ☐ So spiegare che cos'è una SPA.
- ☐ Ho visto la differenza tra codice imperativo e dichiarativo.
- ☐ Ho modificato `src/App.jsx` e ho visto l'aggiornamento nel browser.
- ☐ Ho completato l'esercizio dei due paragrafi.

---

## 🚀 Challenge
Aggiungi un terzo paragrafo che mostra il saldo del conto corrente scrivendolo **a mano** nel testo (`4.250,75 €`). Poi chiediti: cosa succederebbe se il saldo dovesse cambiare in 50 punti diversi della pagina? Terrai la risposta in mente fino al Day 3.

---

## 📌 Recap
- React costruisce l'interfaccia come albero di **componenti**.
- Una **SPA** carica un solo `index.html`; JavaScript costruisce la UI.
- Il rendering è **dichiarativo**: descrivi il risultato, React aggiorna il DOM.
- Vite aggiorna il browser a ogni salvataggio (HMR).
- LipariBank nasce come dashboard statica fatta di componenti piccoli.

---

### ➡️ Next
Prossimo capitolo: [Struttura del progetto](./02_Struttura_del_progetto.md). Prima di scrivere altri componenti guardiamo da vicino i file che Vite ha generato e il ruolo di ciascuno.
