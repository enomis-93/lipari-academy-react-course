# 🏦 LipariBank — React Zero to Hero

> **Extra React Legacy · Capitolo 06**
> **Argomento:** Leggere e manutenere codice legacy: metodo, pattern frequenti, API deprecate, migrazione incrementale
> **Durata stimata:** 40 minuti
> **Parte di LipariBank:** nessun nuovo file; metodo di lavoro che applicherai nell'esercizio del capitolo 07

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- seguire una procedura per orientarti in una codebase React che non conosci;
- riconoscere i pattern legacy più diffusi (HOC, render props, `createReactClass`, `connect`);
- individuare API deprecate/rimosse e problemi di compatibilità di versione;
- pianificare una migrazione **incrementale**, senza riscrittura totale.

---

## 📋 Prerequisiti
- Capitoli [01](./01_React_Moderno_vs_Legacy.md)–[05](./05_Class_vs_Function_Components.md) di questo giorno.
- Terminale dentro `liparibank/` (per `npm ls`).

---

## 🧭 In questo capitolo
- procedura di "triage" di una codebase sconosciuta;
- catalogo dei pattern legacy (solo riconoscimento);
- ricerca di API deprecate: warning, `StrictMode`, ricerche nel codice, `npm ls`;
- regole di manutenzione sicura e ordine di migrazione.

---

## 🧠 Theory

### Procedura in 8 passi per leggere una codebase sconosciuta
1. **`package.json`**: versioni di `react` e `react-dom` (Hooks solo se ≥ 16.8), librerie correlate (router, Redux, test), script di build.
2. **Punto di ingresso** (`index.js` / `main.jsx`): `ReactDOM.render` (≤ 17) o `createRoot` (≥ 18).
3. **Mappa dei componenti**: cerca `extends Component`, `extends React.Component`, `extends PureComponent`, `createReactClass`.
4. **Lifecycle e side effect**: dove si fanno fetch, timer, listener (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`).
5. **Flusso dei dati**: da dove arrivano le props, dove vive lo state, chi lo aggiorna.
6. **Ref e DOM**: `createRef`, callback ref, `this.refs`, `findDOMNode`.
7. **HOC, render props, `connect`**: chi "avvolge" chi e quali props vengono iniettate.
8. **Avvia l'app e osserva la console**: warning e errori ti dicono molto.

> 💡 **Remember**
>
> Prima di cambiare qualcosa: l'app parte? I test (se ci sono) passano? Annota il comportamento attuale. Senza una base nota non puoi dire di non aver rotto niente.

### Pattern legacy frequenti (solo riconoscimento)
**HOC (Higher-Order Component):** una funzione che riceve un componente e ne restituisce uno nuovo con props aggiuntive.

```jsx
function withBalance(WrappedComponent) {
  return class WithBalance extends Component {
    state = { balance: 0 };

    render() {
      return <WrappedComponent {...this.props} balance={this.state.balance} />;
    }
  };
}

export default withBalance(AccountCard);
```

**Render props:** un componente che chiama una funzione ricevuta come prop.

```jsx
<DataFetcher url="/data/transactions.json" render={(data) => <List items={data} />} />
```

**`createReactClass` e mixins** (React ≤ 15, `React.createClass` rimosso in React 16): oggetti con `getInitialState`, `mixins: [...]`. Se li incontri, il progetto è molto vecchio e richiede aggiornamenti graduali.

**Redux `connect`:** `export default connect(mapStateToProps, mapDispatchToProps)(Component)`: collega il componente a uno store esterno. Riconosci le props iniettate dallo store; nel [Day 7](../Day_07_Shared_State_Redux/06_Esercizio_Migrazione_a_Redux.md) useremo gli hook moderni.

Tutti questi pattern si sostituiscono, in codice nuovo, con **custom hooks** (e `useContext`/`useReducer`, Day 7). Non vanno riscritti solo per moda.

### Individuare API deprecate e compatibilità di versione
Strumenti, dal più veloce al più approfondito:

| Strumento | Cosa ti dice |
|---|---|
| Console del browser | Warning di deprecazione ("componentWillMount has been renamed...") |
| `<StrictMode>` | Segnala `UNSAFE_` e legacy context con `console.error`, e rivela side effect nel render (doppia esecuzione in sviluppo). In React 19 string refs e `findDOMNode` non danno più warning: sono già **rimossi** e producono errori |
| `npm ls react react-dom` | Versioni effettivamente installate (anche duplicate) |
| `npm outdated` | Pacchetti con versioni più recenti |
| Ricerca nel codice | Pattern elencati sotto |
| Guide di upgrade / changelog | API rimosse per versione e istruzioni ufficiali |
| Codemod ufficiali | React ha pubblicato script automatici per alcune trasformazioni (es. rinominare i lifecycle con `UNSAFE_`); leggi la guida di upgrade della versione target per sapere quali usare e controlla sempre il diff |

Pattern da cercare con la ricerca globale dell'editor (anche in modalità regex):

```text
ReactDOM.render|ReactDOM.hydrate|unmountComponentAtNode|findDOMNode
componentWillMount|componentWillReceiveProps|componentWillUpdate|UNSAFE_
this\.refs|ref="
contextTypes|childContextTypes|getChildContext
createReactClass|React\.createClass|mixins
propTypes|defaultProps
```

Cosa significa un risultato: `propTypes` indica la presenza del pacchetto `prop-types` (non installato in LipariBank); `defaultProps` su classi funziona, su funzioni è ignorato in React 19.

Verifica delle dipendenze: la versione di React che installi deve essere compatibile con quella richiesta dalle altre librerie (`peerDependencies`). Se `npm install` segnala conflitti di peer dependency, leggi il messaggio prima di forzare con opzioni come `--force`.

### Manutenzione incrementale: regole pratiche
1. **Mai riscrittura "big bang".** Un'app che funziona vale più di una riscrittura incompleta.
2. **Cambia poco, verifica spesso.** Un cambiamento per volta, controllo manuale (o test) dopo ciascuno.
3. **Coesistenza.** Classi e funzioni convivono: un Function Component può renderizzare una classe e viceversa.
4. **Nuove feature in stile moderno** (Function Components + Hooks) se la versione di React lo consente (≥ 16.8).
5. **Regola del boy scout:** quando devi comunque toccare un componente classe, valuta se migrarlo; altrimenti lascialo com'è.
6. **Non migrare ciò che funziona e non tocchi.** Priorità a ciò che blocca un upgrade.

### Ordine di migrazione ragionevole
1. Base verde: app avviabile, test/controlli manuali annotati.
2. Allineare versione di React e librerie correlate, **un salto di versione per volta**, leggendo la guida di upgrade.
3. Eliminare le API rimosse o deprecate (entry point, string refs, `UNSAFE_`, legacy context).
4. Migrare i componenti classe **semplici** (solo props/state) prima di quelli con lifecycle complessi.
5. Sostituire HOC/render props con custom hooks dove ha senso.
6. Lasciare le classi che devono restare tali (Error Boundaries).

---

## 💻 Let's Code

### 1. Controllare il tuo progetto
Dentro `liparibank/`:

```bash
npm ls react react-dom
```

```bash
npm outdated
```

Il primo mostra le versioni installate; il secondo elenca i pacchetti con una versione più recente (può non mostrare nulla se tutto è aggiornato).

### 2. Cercare le classi nel progetto
Nel tuo `liparibank/src` le uniche classi dovrebbero essere quelle in `src/legacy/`. In VS Code usa la ricerca globale con questa espressione regolare:

```text
extends (React\.)?(Pure)?Component
```

Controlla che i risultati corrispondano ai file attesi (`LegacyBalanceWidget.jsx`, `SetStateLab.jsx` e, dopo il capitolo 07, `LegacyTransactionsPanel.jsx`).

### 3. Esempio di migrazione di un HOC in custom hook
HOC legacy (snippet di lettura, parziale):

```jsx
export default withBalance(AccountCard);
```

Equivalente moderno (snippet parziale):

```jsx
function AccountCard({ account }) {
  const { hidden, toggleHidden } = useBalanceVisibility();
  return <button type="button" onClick={toggleHidden}>{hidden ? "••••" : account.balance}</button>;
}
```

`useBalanceVisibility` sarebbe un custom hook (Day 7); la logica è nel hook, non in un wrapper che altera le props.

---

## 🏦 LipariBank in action
Immagina di ereditare il codice di una vecchia app bancaria: `package.json` con React 16.4, `ReactDOM.render`, un `connect` di Redux e dieci classi con `componentWillReceiveProps`. Il piano realistico: (1) farlo partire e annotare il comportamento; (2) salire a una versione che supporta Hooks (≥ 16.8) solo dopo aver verificato le librerie; (3) sostituire `componentWillReceiveProps` con `componentDidUpdate`; (4) migrare un componente alla volta. Nel capitolo 07 farai in piccolo lo stesso percorso su `LegacyTransactionsPanel`.

---

## 🧪 Your Turn
**Obiettivo:** leggere un modulo e fare il triage senza eseguirlo.

**Requisiti:** il frammento seguente è di un progetto **fittizio**, **NON eseguibile su React 19** e non va copiato nel progetto. Elenca: (a) la versione minima di React compatibile, (b) almeno 4 API deprecate/rimosse in React 19, (c) quale pattern legacy riconosci, (d) quale sarebbe il primo cambiamento che faresti.

```jsx
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

class TransferBox extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.accountId !== this.props.accountId) {
      this.setState({ amount: "" });
    }
  }

  focusAmount() {
    ReactDOM.findDOMNode(this.refs.amount).focus();
  }

  render() {
    return <input ref="amount" value={this.state.amount} />;
  }
}

TransferBox.propTypes = { accountId: PropTypes.string };

ReactDOM.render(<TransferBox accountId="acc-001" />, document.getElementById("root"));
```

**Passi suggeriti:** applica i passi 1–8 della procedura; usa la tabella di API rimosse del capitolo 01.

**Risultato atteso:**
- (a) nessun Hook usato: non richiede React 16.8; è scritto per React 15/16/17 (con warning su `componentWillReceiveProps` e string ref nelle versioni più recenti);
- (b) `componentWillReceiveProps`, `findDOMNode`, string ref (`ref="amount"` / `this.refs`), `ReactDOM.render`; in più `propTypes` (richiede `prop-types`, ignorato a runtime in React 19);
- (c) nessun HOC; è una classe semplice con lifecycle deprecato; manca anche l'inizializzazione di `this.state` (`this.state.amount` darebbe errore: un altro bug);
- (d) prima di tutto avviare e verificare il comportamento; poi sostituire `componentWillReceiveProps` con `componentDidUpdate(prevProps)` e la string ref con `createRef`.

**Criteri di completamento:** hai trovato almeno quattro API e il bug sullo state non inizializzato.

---

## ⚠️ Common Mistakes
- **Riscrivere tutto prima di capire:** si perdono casi limite non documentati.
- **Aggiornare più versioni maggiori in un colpo solo:** non sai quale salto ha causato l'errore.
- **Forzare `npm install --force` senza leggere i conflitti di peer dependency.**
- **Ignorare i warning in console:** sono la lista gratuita dei debiti tecnici.
- **Migrare un componente classe senza aver capito cleanup e dipendenze degli effect.**

---

## ✅ Checklist
- ☐ So applicare i passi di triage a un progetto nuovo.
- ☐ So riconoscere HOC, render props, `createReactClass`, `connect`.
- ☐ So cercare le API deprecate/rimosse nel codice.
- ☐ So usare `npm ls react react-dom` e interpretare StrictMode e warning.
- ☐ So perché si migra in modo incrementale.

---

## 🚀 Challenge
Scrivi su un foglio (o in un file tuo, fuori da `src/`) un piano di migrazione in 5 passi per la codebase immaginaria "React 16.4 con Redux e 10 classi", indicando per ogni passo come verificheresti di non aver rotto nulla.

---

## 📌 Recap
- Triage: versione, entry point, classi, lifecycle, flusso dati, ref, wrapper, console.
- Pattern legacy da riconoscere: HOC, render props, mixins, `connect`.
- API deprecate si trovano con warning, StrictMode, ricerche nel codice, changelog.
- Migrazione incrementale, con coesistenza di classi e funzioni; mai big-bang.

---

### ➡️ Next
Prossimo capitolo: [07 — Esercizio LipariBank Legacy](./07_Esercizio_LipariBank_Legacy.md). Metterai in pratica tutto su `LegacyTransactionsPanel`.
