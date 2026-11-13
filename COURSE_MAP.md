# 🏦 LipariBank — React Zero to Hero · Mappa del corso

> Ordine delle giornate, obiettivi, prerequisiti, capitoli e risultato atteso.
> Versioni di riferimento: **Node.js 22 LTS · React 19 · Vite 8 · React Router 7 · Redux Toolkit 2**.

---

## 🧭 Come si segue il corso

Il corso costruisce una sola applicazione, **LipariBank**, un home banking con dati inventati. Ogni giornata parte dal progetto della precedente: le giornate vanno seguite **in ordine, dal Day 0 al Day 9**.

I due moduli extra sono separati dal percorso: JavaScript Essentials si può consultare in qualunque momento, React Legacy dopo il Day 6.

| Giorno | Tema | Capitoli | Durata |
|---|---|---|---|
| Day 0 | Setup dell'ambiente | 7 | 3 h 20 min |
| Day 1 | React Fundamentals | 6 | 2 h 50 min |
| Day 2 | Components e Props | 6 | 3 h |
| Day 3 | State ed eventi | 7 | 4 h |
| Day 4 | Form e input dell'utente | 6 | 4 h 5 min |
| Day 5 | Effects e API | 6 | 3 h 40 min |
| Day 6 | Routing | 6 | 4 h 10 min |
| Day 7 | Stato condiviso: da Context a Redux | 6 | 6 h |
| Day 8 | Hook avanzati e architettura | 5 | 5 h 5 min |
| Day 9 | Progetto finale e consegna | 7 | 6 h 45 min |
| Extra | JavaScript Essentials | 8 | 3 h 30 min |
| Extra | React Legacy | 7 | 5 h 55 min |

Alla fine di ogni giornata c'è un **checkpoint**: un archivio con il progetto com'è a quel punto. Serve per ripartire se sei bloccato o per confrontare la tua soluzione. Vedi [Come usare i checkpoint](./Day_00_Setup/06_Come_usare_i_checkpoint.md).

---

## Day 0 — Setup dell'ambiente

- **Obiettivo:** preparare l'ambiente di lavoro (Node.js, npm, VS Code, Git e GitHub), creare il progetto `liparibank` con Vite e capire come usare i checkpoint del corso.
- **Prerequisiti:** conoscenze di programmazione di base; un computer su cui puoi installare software.
- **Durata stimata:** 3 h 20 min.
- **Capitoli:**
  1. [Introduzione al corso](./Day_00_Setup/01_Introduzione_al_corso.md)
  2. [Node.js e npm](./Day_00_Setup/02_Node_NPM.md)
  3. [Visual Studio Code](./Day_00_Setup/03_VS_Code.md)
  4. [Git e GitHub](./Day_00_Setup/04_Git_GitHub.md)
  5. [Vite e primo progetto React](./Day_00_Setup/05_Vite_e_primo_progetto_React.md)
  6. [Come usare i checkpoint](./Day_00_Setup/06_Come_usare_i_checkpoint.md)
  7. [Verifica dell'ambiente](./Day_00_Setup/07_Verifica_ambiente.md)
- **Checkpoint:** `liparibank-day-00.zip`: il progetto Vite ridotto alla pagina minima.
- **Risultato atteso:** `npm run dev` mostra la prima pagina di LipariBank su `http://localhost:5173/` e il progetto è in una repository Git.

---

## Day 1 — React Fundamentals

- **Obiettivo:** capire che cos'è React, com'è fatto un progetto Vite, come si scrive JSX (Fragment compresi), che cosa sono i Function Components e come React passa dal Virtual DOM al DOM.
- **Prerequisiti:** Day 0 completato.
- **Durata stimata:** 2 h 50 min.
- **Capitoli:**
  1. [React e LipariBank](./Day_01_React_Fundamentals/01_React_e_LipariBank.md)
  2. [Struttura del progetto](./Day_01_React_Fundamentals/02_Struttura_del_progetto.md)
  3. [JSX](./Day_01_React_Fundamentals/03_JSX.md)
  4. [Function Components](./Day_01_React_Fundamentals/04_Function_Components.md)
  5. [Rendering e composizione](./Day_01_React_Fundamentals/05_Rendering_e_Composizione.md)
  6. [Esercizio LipariBank — Dashboard](./Day_01_React_Fundamentals/06_Esercizio_LipariBank_Dashboard.md)
- **Checkpoint:** `liparibank-day-01.zip`: la prima dashboard.
- **Risultato atteso:** una dashboard statica con il nome del cliente, il saldo totale e gli ultimi cinque movimenti.

---

## Day 2 — Components e Props

- **Obiettivo:** costruire componenti riutilizzabili con props e `children`, mostrare contenuti in base a una condizione e disegnare liste con `key`.
- **Prerequisiti:** Day 1.
- **Durata stimata:** 3 h.
- **Capitoli:**
  1. [Componenti e composizione](./Day_02_Components_Props/01_Componenti_e_Composizione.md)
  2. [Props](./Day_02_Components_Props/02_Props.md)
  3. [Children](./Day_02_Components_Props/03_Children.md)
  4. [Conditional Rendering](./Day_02_Components_Props/04_Conditional_Rendering.md)
  5. [Liste e Keys](./Day_02_Components_Props/05_Liste_e_Keys.md)
  6. [Esercizio LipariBank — Accounts](./Day_02_Components_Props/06_Esercizio_LipariBank_Accounts.md)
- **Checkpoint:** `liparibank-day-02.zip`: conti e componenti riutilizzabili.
- **Risultato atteso:** le card dei conti, la lista dei movimenti con il suo stato vuoto e un componente `Card` generico.

---

## Day 3 — State ed eventi

- **Obiettivo:** rendere l'interfaccia interattiva con eventi e `useState`; capire che cosa succede a ogni render, come funziona la riconciliazione e perché lo state non si modifica direttamente; spostare lo state dove serve.
- **Prerequisiti:** Day 2.
- **Durata stimata:** 4 h.
- **Capitoli:**
  1. [Event Handling (`onClick`, `onChange`, event object)](./Day_03_State_Events/01_Event_Handling.md)
  2. [`useState`](./Day_03_State_Events/02_useState.md)
  3. [State e Re-render (snapshot, batching, perché lo state non è una variabile)](./Day_03_State_Events/03_State_e_Rerender.md)
  4. [Virtual DOM e riconciliazione](./Day_03_State_Events/04_Virtual_DOM_e_Riconciliazione.md)
  5. [Immutabilità dello State (oggetti e array)](./Day_03_State_Events/05_Immutabilita_dello_State.md)
  6. [Lifting State Up e dati derivati](./Day_03_State_Events/06_Lifting_State_Up.md)
  7. [Esercizio — filtri, ricerca e preferiti sui movimenti](./Day_03_State_Events/07_Esercizio_LipariBank_Transactions.md)
- **Checkpoint:** `liparibank-day-03.zip`: la dashboard interattiva.
- **Risultato atteso:** selezione del conto, filtro entrate/uscite, ricerca per testo, movimenti preferiti e saldo che si può nascondere.

---

## Day 4 — Form e input dell'utente

- **Obiettivo:** costruire form controllati, validarli, dare un riscontro all'utente e usare `useRef` per raggiungere il DOM.
- **Prerequisiti:** Day 3.
- **Durata stimata:** 4 h 5 min.
- **Capitoli:**
  1. [Form e Controlled Components](./Day_04_Forms_User_Input/01_Form_e_Controlled_Components.md)
  2. [`input`, `select`, `textarea` e state a oggetto](./Day_04_Forms_User_Input/02_Input_e_Select.md)
  3. [Validazione dei form e messaggi di errore accessibili](./Day_04_Forms_User_Input/03_Validazione.md)
  4. [Submit, feedback e reset del form](./Day_04_Forms_User_Input/04_Submit_e_Feedback.md)
  5. [`useRef`: riferimenti al DOM e valori che non provocano render](./Day_04_Forms_User_Input/05_useRef.md)
  6. [Esercizio — bonifico simulato e saldi ricalcolati](./Day_04_Forms_User_Input/06_Esercizio_LipariBank_Bonifico.md)
- **Checkpoint:** `liparibank-day-04.zip`: il form del bonifico.
- **Risultato atteso:** un bonifico **simulato** con validazione di ogni campo, focus sul primo errore e saldi ricalcolati.

---

## Day 5 — Effects e API

- **Obiettivo:** distinguere il rendering dagli effetti, usare `useEffect` con dipendenze e pulizia, caricare dati con `fetch` e gestire caricamento, errore e assenza di dati.
- **Prerequisiti:** Day 4.
- **Durata stimata:** 3 h 40 min.
- **Capitoli:**
  1. [Side Effects](./Day_05_Effects_API/01_Side_Effects.md)
  2. [useEffect](./Day_05_Effects_API/02_useEffect.md)
  3. [Dipendenze e Cleanup](./Day_05_Effects_API/03_Dipendenze_e_Cleanup.md)
  4. [Fetch API](./Day_05_Effects_API/04_Fetch_API.md)
  5. [Loading, Error ed Empty States](./Day_05_Effects_API/05_Loading_Error_Empty_States.md)
  6. [Esercizio LipariBank — API Transactions](./Day_05_Effects_API/06_Esercizio_LipariBank_API_Transactions.md)
- **Checkpoint:** `liparibank-day-05.zip`: i movimenti caricati in modo asincrono.
- **Risultato atteso:** i movimenti arrivano da un file JSON servito dall'applicazione, con messaggi di caricamento ed errore e la possibilità di riprovare.

---

## Day 6 — Routing

- **Obiettivo:** trasformare LipariBank in un'applicazione a più pagine con React Router 7: route, parametri, navigazione, pagina 404 e route annidate.
- **Prerequisiti:** Day 5.
- **Durata stimata:** 4 h 10 min.
- **Capitoli:**
  1. [SPA e Routing](./Day_06_Routing/01_SPA_e_Routing.md)
  2. [React Router](./Day_06_Routing/02_React_Router.md)
  3. [Dynamic Routes e useParams](./Day_06_Routing/03_Dynamic_Routes_e_useParams.md)
  4. [Navigation e 404](./Day_06_Routing/04_Navigation_e_404.md)
  5. [Nested Routes](./Day_06_Routing/05_Nested_Routes.md)
  6. [Esercizio LipariBank — MultiPage](./Day_06_Routing/06_Esercizio_LipariBank_MultiPage.md)
- **Checkpoint:** `liparibank-day-06.zip`: l'applicazione a più pagine.
- **Risultato atteso:** Dashboard, Conti con dettaglio, Movimenti e Bonifico sono pagine con un proprio indirizzo; lo state condiviso sta in `App.jsx` e passa per props.

---

## Day 7 — Stato condiviso: da Context a Redux

- **Obiettivo:** eliminare il passaggio di props a catena con Context e `useReducer`, misurarne i limiti, capire **quando e perché** serve Redux e saperlo usare con Redux Toolkit e React Redux.
- **Prerequisiti:** Day 6.
- **Durata stimata:** 6 h.
- **Capitoli:**
  1. [Context e `useContext`](./Day_07_Shared_State_Redux/01_Context_e_useContext.md)
  2. [`useReducer` e lo state condiviso di LipariBank](./Day_07_Shared_State_Redux/02_useReducer.md)
  3. [Redux: quando e perché](./Day_07_Shared_State_Redux/03_Redux_Quando_e_Perche.md)
  4. [Redux Toolkit: slice e thunk](./Day_07_Shared_State_Redux/04_Redux_Toolkit_Slice_e_Thunk.md)
  5. [React Redux: selector e dispatch](./Day_07_Shared_State_Redux/05_React_Redux_Selector_e_Dispatch.md)
  6. [Esercizio — Migrazione a Redux](./Day_07_Shared_State_Redux/06_Esercizio_Migrazione_a_Redux.md)
- **Checkpoint:** `liparibank-day-07.zip`: lo stato condiviso nello store.
- **Risultato atteso:** conti e movimenti vivono nello store Redux, le preferenze in un Context, i filtri restano locali; LipariBank è stata migrata da Context a Redux una pagina alla volta.

---

## Day 8 — Hook avanzati e architettura

- **Obiettivo:** estrarre la logica ripetuta in custom hooks, ottimizzare solo dopo aver misurato, isolare l'accesso ai dati in un service layer, intercettare gli errori di rendering e dare al progetto una struttura a livelli.
- **Prerequisiti:** Day 7.
- **Durata stimata:** 5 h 5 min.
- **Capitoli:**
  1. [Custom Hooks](./Day_08_Advanced_Hooks_Architecture/01_Custom_Hooks.md)
  2. [Memoization (`useMemo`, `useCallback`, `React.memo`) e quando NON usarla](./Day_08_Advanced_Hooks_Architecture/02_Memoization.md)
  3. [Service layer, API ed Error Boundary](./Day_08_Advanced_Hooks_Architecture/03_Service_Layer_e_Error_Boundary.md)
  4. [Architettura del progetto](./Day_08_Advanced_Hooks_Architecture/04_Architettura_del_Progetto.md)
  5. [Esercizio — Refactoring di LipariBank](./Day_08_Advanced_Hooks_Architecture/05_Esercizio_Refactoring_LipariBank.md)
- **Checkpoint:** `liparibank-day-08.zip`: il punto di partenza del progetto finale.
- **Risultato atteso:** pagine brevi che compongono hook e componenti; `fetch` in un solo file; un Error Boundary attorno a ogni pagina.

---

## Day 9 — Progetto finale e consegna

- **Obiettivo:** portare LipariBank a un livello consegnabile: leggere i requisiti, completare da soli ciò che manca, lavorare con Git a piccoli passi, verificare con un piano di test, curare accessibilità e schermi piccoli, preparare la build e documentare.
- **Prerequisiti:** Day 8.
- **Durata stimata:** 6 h 45 min.
- **Capitoli:**
  1. [Brief e requisiti del progetto finale](./Day_09_Final_Project_Delivery/01_Brief_e_Requisiti.md)
  2. [Architettura e piano di lavoro](./Day_09_Final_Project_Delivery/02_Architettura_e_Piano.md)
  3. [Git Workflow](./Day_09_Final_Project_Delivery/03_Git_Workflow.md)
  4. [Refactoring e test manuale](./Day_09_Final_Project_Delivery/04_Refactoring_e_Test_Manuale.md)
  5. [Accessibility e responsive](./Day_09_Final_Project_Delivery/05_Accessibility_e_Responsive.md)
  6. [Environment e Deploy](./Day_09_Final_Project_Delivery/06_Environment_e_Deploy.md)
  7. [README e consegna](./Day_09_Final_Project_Delivery/07_README_e_Consegna.md)
- **Checkpoint:** `liparibank-day-09.zip`: una soluzione di riferimento, da confrontare con la propria dopo la consegna.
- **Risultato atteso:** una repository che si installa, si avvia e supera il percorso di accettazione seguendo solo il suo README.

---

## Extra — JavaScript Essentials

- **Obiettivo:** ripassare il JavaScript che React dà per scontato: funzioni freccia, oggetti e array, `map`/`filter`/`reduce`, destructuring, moduli, Promise.
- **Prerequisiti:** nozioni di base di programmazione. Non richiede il progetto React.
- **Quando:** prima del Day 1 se il JavaScript moderno è nuovo per te; altrimenti quando un capitolo lo richiama.
- **Durata stimata:** 3 h 30 min.
- **Capitoli:**
  1. [Variabili, tipi, conversioni e truthy/falsy](./Extra_JavaScript_Essentials/01_Variables_Types.md)
  2. [Funzioni, parametri, return, arrow functions e callback](./Extra_JavaScript_Essentials/02_Functions_Arrow_Functions.md)
  3. [Oggetti e array: proprietà, accesso e modifica dei dati](./Extra_JavaScript_Essentials/03_Objects_Arrays.md)
  4. [`map`, `filter`, `reduce` applicati a conti e movimenti](./Extra_JavaScript_Essentials/04_Map_Filter_Reduce.md)
  5. [Destructuring, spread, rest e immutabilità dei dati](./Extra_JavaScript_Essentials/05_Destructuring_Spread_Rest.md)
  6. [ES Modules — `import`, `export default`, named exports e organizzazione dei file](./Extra_JavaScript_Essentials/06_ES_Modules.md)
  7. [Promise, `async`/`await`, `try`/`catch`/`finally` e asincronia](./Extra_JavaScript_Essentials/07_Promises_Async_Await.md)
  8. [Optional chaining, nullish coalescing, operatore ternario e condizioni](./Extra_JavaScript_Essentials/08_Optional_Chaining_Ternary.md)
- **Checkpoint:** nessuno.
- **Risultato atteso:** sai trasformare elenchi di conti e movimenti, importare ed esportare moduli e gestire una Promise.

---

## Extra — React Legacy

- **Obiettivo:** leggere, modificare e migrare il codice React scritto prima degli Hooks: Class Components, metodi del ciclo di vita, `setState`, API rimosse.
- **Prerequisiti:** Day 6. Si svolge sul progetto di fine Day 6.
- **Quando:** dopo il Day 6 oppure a corso finito. Non è un prerequisito del Day 7.
- **Durata stimata:** 5 h 55 min.
- **Capitoli:**
  1. [React moderno vs React legacy: versioni, API rimosse e compatibilità](./Extra_Legacy_React/01_React_Moderno_vs_Legacy.md)
  2. [Class Components: `extends Component`, `constructor`, `this.props`, `this.state`, `render()`](./Extra_Legacy_React/02_Class_Components.md)
  3. [Lifecycle Methods: mounting, updating, unmounting, cleanup e rapporto con `useEffect`](./Extra_Legacy_React/03_Lifecycle_Methods.md)
  4. [`this.props`, `this.state` e `this.setState`: forma oggetto, forma funzionale, asincronia, callback e merge](./Extra_Legacy_React/04_State_Props_setState.md)
  5. [Class Components vs Function Components: confronto e mappa di migrazione](./Extra_Legacy_React/05_Class_vs_Function_Components.md)
  6. [Leggere e manutenere codice legacy: metodo, pattern frequenti, API deprecate, migrazione incrementale](./Extra_Legacy_React/06_Leggere_e_Manutenere_Codice_Legacy.md)
  7. [Esercizio LipariBank Legacy: leggere, modificare in stile class e migrare `LegacyTransactionsPanel`](./Extra_Legacy_React/07_Esercizio_LipariBank_Legacy.md)
- **Checkpoint:** `liparibank-extra-legacy.zip`: il laboratorio completo.
- **Risultato atteso:** sai seguire il flusso di un componente a classe, aggiungergli una funzionalità e riscriverlo con gli Hooks verificando che si comporti allo stesso modo.

---

## 🏦 Come cresce LipariBank

| Dopo il... | LipariBank è... |
|---|---|
| Day 1 | una dashboard statica |
| Day 2 | un insieme di componenti riutilizzabili |
| Day 3 | interattiva: selezione, filtri, preferiti |
| Day 4 | capace di registrare un bonifico simulato |
| Day 5 | collegata a dati caricati in modo asincrono |
| Day 6 | un'applicazione a più pagine |
| Day 7 | basata su uno store Redux |
| Day 8 | organizzata in livelli: pagine, hook, store, servizi |
| Day 9 | verificata, documentata e pronta per la consegna |
