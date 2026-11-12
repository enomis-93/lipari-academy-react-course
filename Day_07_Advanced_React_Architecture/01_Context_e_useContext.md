# 🏦 LipariBank — React Zero to Hero

> **Day 7 · Capitolo 01**
> **Argomento:** Context e `useContext`
> **Durata stimata:** 50 minuti
> **Parte di LipariBank:** preferenza "nascondi saldo" condivisa tra tutte le pagine (`SettingsContext`)

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- spiegare cosa sia il *prop drilling* e quando diventa un problema reale;
- creare un Context con `createContext`, un Provider e un hook `useSettings` che lo legge con `useContext`;
- decidere, per un dato dell'app, se bastano le props o se serve un Context;
- descrivere il limite principale del Context: tutti i consumer si ri-renderizzano quando il valore cambia.

---

## 📋 Prerequisiti
- Day 6 completato: [Esercizio LipariBank MultiPage](../Day_06_Routing/06_Esercizio_LipariBank_MultiPage.md) (React Router v7, pagine in `src/pages/`, `App.jsx` che passa props).
- Conoscere `useState` ([Day 3 · useState](../Day_03_State_Events/02_useState.md)) e il lifting state up ([Day 3 · Lifting State Up](../Day_03_State_Events/06_Lifting_State_Up.md)).
- Progetto `liparibank/` funzionante con `npm run dev`. Tutti i comandi si lanciano dentro `liparibank/`.

---

## 🧭 In questo capitolo
- Il problema: props che attraversano componenti che non le usano.
- `createContext`, Provider, `useContext` e il pattern "Provider + hook dedicato".
- Sintassi React 19 (`<MyContext value={...}>`) e sintassi React 18 (`<MyContext.Provider>`).
- Quando **non** usare il Context e quali sono i suoi costi.
- Applicazione: `src/context/SettingsContext.jsx` con `hideBalance`.

---

## 🧠 Theory

### Il problema: prop drilling
Finora i dati viaggiano solo con le props, dall'alto verso il basso. Se `App.jsx` possiede un dato e lo usa un componente a quattro livelli di distanza, tutti i componenti intermedi devono "inoltrarlo" senza usarlo. Questo si chiama **prop drilling**.

Con 1-2 livelli **non è un problema**: è esplicito, facile da leggere e da testare. Diventa fastidioso quando:
- molti componenti, anche di pagine diverse, hanno bisogno dello stesso dato;
- i componenti intermedi ricevono props solo per inoltrarle;
- aggiungere un dato obbliga a modificare cinque file.

### Il Context in tre pezzi
1. **`createContext(defaultValue)`** crea il "canale".
2. **Il Provider** avvolge una parte dell'albero e fornisce un `value`.
3. **`useContext(MyContext)`** legge il `value` più vicino risalendo l'albero, senza props.

### React 19 e React 18
In **React 19** (versione di riferimento del corso) il Context stesso funziona da Provider:

```jsx
<SettingsContext value={value}>{children}</SettingsContext>
```

In **React 18 e precedenti** serve `.Provider`:

```jsx
<SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
```

In questo corso usiamo sempre la forma React 19. Se leggi codice più vecchio troverai `.Provider`: è la stessa cosa. React 19 introduce anche `use(MyContext)`, che può leggere un Context e, a differenza di `useContext`, si può chiamare anche in un `if`; qui usiamo `useContext`, che resta supportato ed è ovunque nel codice esistente.

### Il pattern Provider + hook dedicato
Non esportiamo il Context grezzo. Esportiamo:
- un componente `SettingsProvider` che contiene lo state;
- un hook `useSettings()` che legge il Context e segnala l'errore se si dimentica il Provider.

> 💡 **Remember**
>
> Il Context **non è uno state manager**: non memorizza nulla, trasporta un valore. Lo state vive in `useState`/`useReducer` dentro il Provider.

### Quando usare Context e quando no

| Situazione | Scelta |
|---|---|
| Dato usato da 1-2 livelli di componenti | **Props** |
| Dato usato solo da una pagina | **State locale** + props |
| Dato trasversale (tema, preferenze, utente, dati condivisi da più pagine) | **Context** |
| Dato che cambia molto spesso (ogni tasto premuto, ogni frame) | **Non nel Context**: tienilo vicino a chi lo usa |

### Il limite: i re-render
Quando il `value` del Provider cambia, **tutti** i componenti che chiamano `useContext` su quel Context si ri-renderizzano, anche se leggono solo una parte del valore. Mitigazioni:
- Context piccoli e separati per argomento (impostazioni da una parte, dati bancari dall'altra);
- `value` stabile (lo vedremo nel [cap. 04](./04_Memoization.md));
- non mettere nel Context dati che cambiano di continuo.

---

## 💻 Let's Code

### 1. Il Context delle impostazioni
Crea `src/context/SettingsContext.jsx` (crea la cartella `src/context/`):

```jsx
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [hideBalance, setHideBalance] = useState(false);

  const toggleHideBalance = useCallback(() => {
    setHideBalance((current) => !current);
  }, []);

  const value = useMemo(
    () => ({ hideBalance, toggleHideBalance }),
    [hideBalance, toggleHideBalance],
  );

  return <SettingsContext value={value}>{children}</SettingsContext>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === null) {
    throw new Error("useSettings deve essere usato dentro <SettingsProvider>.");
  }
  return context;
}
```

`useCallback` e `useMemo` servono a mantenere stabili la funzione e l'oggetto `value`: per ora leggili come "mantieni la stessa identità finché le dipendenze non cambiano". Li spiegheremo bene nel [cap. 04](./04_Memoization.md), dove vedremo anche perché qui non sono indispensabili.

Il Context ha `null` come default: se qualcuno usa `useSettings` fuori dal Provider riceve un errore chiaro invece di un misterioso "cannot destructure property of null".

> Nota: alcuni strumenti di sviluppo (Fast Refresh) preferiscono file che esportano solo componenti. Tenere `SettingsProvider` e `useSettings` nello stesso file è una scelta comune e semplice; se vedi un avviso al riguardo è solo di sviluppo, non un errore.

### 2. Montare il Provider
In `src/main.jsx`:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SettingsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SettingsProvider>
  </StrictMode>,
);
```

Il Provider sta fuori dal router: le impostazioni valgono per tutte le pagine. Vite risolve gli import anche senza estensione (`./context/SettingsContext`); qui manteniamo `.jsx` per coerenza con le righe già generate dal template.

### 3. Consumare il Context
Nel Day 3-6 il pulsante "Nascondi saldi" usava uno state locale di `DashboardPage` (`hideBalance`) che veniva passato come prop a `BalanceCard` (`hidden`) e ad `AccountList` → `AccountCard` (`hideBalance`). Ora la preferenza arriva dal Context. Snippet parziali su `src/pages/DashboardPage.jsx`:

```jsx
import { useSettings } from "../context/SettingsContext";

// dentro DashboardPage, al posto di useState(false) per hideBalance:
const { hideBalance, toggleHideBalance } = useSettings();

// nel JSX il pulsante diventa:
<button type="button" onClick={toggleHideBalance}>
  {hideBalance ? "Mostra saldi" : "Nascondi saldi"}
</button>
```

Nello stesso file **togli** le prop che inoltravano la preferenza: `hidden={hideBalance}` su `<BalanceCard />` e `hideBalance={hideBalance}` su `<AccountList />`. Poi `src/components/BalanceCard.jsx` legge la preferenza direttamente (componente completo, come nel progetto di Day 6 senza la prop `hidden`):

```jsx
import { useSettings } from "../context/SettingsContext.jsx";
import { formatCurrency } from "../utils/formatters.js";

function BalanceCard({ total, label = "Saldo totale", note }) {
  const { hideBalance } = useSettings();

  return (
    <section className="balance-card">
      <p className="balance-card__label">{label}</p>
      <p className="balance-card__value">
        {hideBalance ? "••••••" : formatCurrency(total)}
      </p>
      {note && <p className="balance-card__meta">{note}</p>}
    </section>
  );
}

export default BalanceCard;
```

In `src/components/AccountCard.jsx` fai lo stesso (snippet parziale): togli `hideBalance` dalle props e leggilo con `useSettings()`; in `src/components/AccountList.jsx` togli la prop `hideBalance` e non passarla più a `AccountCard`.

```jsx
import { useSettings } from "../context/SettingsContext.jsx";

function AccountCard({ account, transactionCount, isSelected, onSelect }) {
  const { hideBalance } = useSettings();

  // ...il resto del componente è invariato: {hideBalance ? "••••••" : formatCurrency(account.balance)}
}
```

Infine applica `useSettings()` anche a `src/pages/AccountsPage.jsx` (importo accanto al nome nei link) e a `src/pages/AccountDetailPage.jsx` (riga "Saldo:"), con la stessa espressione `hideBalance ? "••••••" : formatCurrency(...)`.

Cosa succede: premi il pulsante → cambia `hideBalance` nel Provider → i componenti che chiamano `useSettings()` si ri-renderizzano con il nuovo valore. Nessun componente intermedio ha dovuto inoltrare props.

Da evitare: scrivere `value={{ hideBalance, toggleHideBalance }}` direttamente nel JSX; crea un nuovo oggetto a ogni render del Provider.

---

## 🏦 LipariBank in action
La preferenza "nascondi saldo" è un buon candidato per il Context perché è **trasversale**: serve a `BalanceCard` e alle `AccountCard` (dashboard), ai link dei conti (`/accounts`) e alla pagina di dettaglio (`/accounts/:accountId`). Prima era uno state di `DashboardPage`: cambiando pagina il componente veniva smontato e la preferenza si perdeva.

Risultato: la prop `hideBalance`/`hidden` sparisce da `BalanceCard`, `AccountCard` e `AccountList`: un livello di prop drilling in meno.

Cambio di comportamento **voluto** di questo capitolo: ora la preferenza resta valida navigando tra le pagine. Nel [cap. 03](./03_Custom_Hooks.md) la renderemo persistente anche dopo il ricaricamento.

Cosa **non** mettiamo nel Context: `searchText` e `filter` (servono a una sola pagina, state locale), i valori del form bonifico (servono solo a `TransferForm`).

---

## 🧪 Your Turn

### Parte A — Implementa
**Obiettivo:** rendere `hideBalance` condiviso tra dashboard e conti.

**Requisiti:**
1. `src/context/SettingsContext.jsx` esporta `SettingsProvider` e `useSettings`.
2. `main.jsx` monta il Provider sopra `<BrowserRouter>`.
3. `BalanceCard`, `AccountCard`, i link in `AccountsPage` e il saldo in `AccountDetailPage` mostrano `••••••` al posto dell'importo quando `hideBalance` è `true`.
4. Il pulsante si trova solo in `DashboardPage`; non esiste più uno `useState` per `hideBalance` nelle pagine, né le prop `hidden`/`hideBalance` nei componenti.
5. Usare `useSettings()` fuori dal Provider lancia un errore con messaggio leggibile.

**Passi suggeriti:** crea il file → monta il Provider → modifica `BalanceCard` → modifica `AccountCard` e `AccountList` → modifica `AccountsPage` e `AccountDetailPage` → rimuovi da `DashboardPage` il vecchio state e le prop inoltrate.

**Risultato atteso:** nascondi il saldo in dashboard, vai su "Conti" con i link di navigazione (senza ricaricare la pagina): gli importi sono ancora nascosti.

**Criteri di completamento:** i requisiti 1-5 sono verificati; `npm run lint` e `npm run build` non danno errori.

### Parte B — Decidi: props o Context?
Per ciascun dato scegli: *props*, *state locale* o *Context*. Poi confronta con la risposta.

1. `selectedAccountId` nella dashboard.
2. `searchText` nella pagina movimenti.
3. `transactions`, `isLoading`, `error` (usati da dashboard, conti e movimenti).
4. Il valore dell'input "importo" del bonifico.

Risposta di riferimento: 1 → state locale + props (1-2 livelli); 2 → state locale; 3 → Context (condiviso tra più pagine, lo faremo nel [cap. 02](./02_useReducer.md)); 4 → state locale (o custom hook, [cap. 03](./03_Custom_Hooks.md)).

---

## ⚠️ Common Mistakes
- **Dimenticare il Provider** → `useSettings` lancia l'errore previsto. Controlla `main.jsx`.
- **Dimenticare `value`** sul Provider → i consumer ricevono `undefined`.
- **Usare `.Provider` e la forma React 19 mescolati** nello stesso progetto: funziona, ma scegli una forma e mantienila.
- **Mettere tutto nel Context** "per comodità": ogni modifica ri-renderizza tutti i consumer e il flusso dei dati diventa opaco.
- **Mutare il valore** (`settings.hideBalance = true`): il Context non se ne accorge. Cambia sempre lo state nel Provider.

---

## ✅ Checklist
- ☐ So spiegare il prop drilling e perché 1-2 livelli non sono un problema.
- ☐ So scrivere Context + Provider + hook dedicato.
- ☐ So usare la forma React 19 e riconoscere `.Provider` nel codice più vecchio.
- ☐ `hideBalance` resta attivo cambiando pagina.
- ☐ So dire perché `searchText` non va nel Context.

---

## 🚀 Challenge
Aggiungi al `SettingsContext` una seconda impostazione, `compactView` (booleano), che riduce lo spazio tra le righe dell'elenco movimenti tramite una classe CSS. Poi rifletti: conviene un Context unico o due Context separati? Cosa succede ai consumer di `hideBalance` quando cambia `compactView`?

---

## 📌 Recap
- Il prop drilling è un problema solo quando i livelli o i consumer crescono.
- Context = trasporto di un valore; lo state vive nel Provider.
- Pattern: `Provider` + hook `useXxx` con controllo "dentro il Provider".
- React 19: `<MyContext value>`; React 18: `<MyContext.Provider value>`.
- Ogni cambio di `value` ri-renderizza tutti i consumer: usa Context piccoli e solo per dati davvero trasversali.

---

### ➡️ Next
Prossimo capitolo: [02 · useReducer](./02_useReducer.md). Gestiremo `transactions`, `isLoading` ed `error` con un reducer, pronto da condividere via Context.
