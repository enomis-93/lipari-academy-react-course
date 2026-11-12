# 🏦 LipariBank — React Zero to Hero · Mappa del corso

> Ordine di fruizione, obiettivi, prerequisiti, capitoli, checkpoint e risultato atteso di ogni giorno.
> Versioni di riferimento: **Node.js 22 LTS · React 19 · Vite 8 · React Router 7** (vedi [README](./README.md)).

---

## 🧭 Ordine di fruizione

1. [Day 0 — Setup](#day-0--setup-dellambiente) (obbligatorio, per primo)
2. [Extra — JavaScript Essentials](#extra--javascript-essentials) (**prima o durante** il corso, secondo necessità)
3. Day 1 → Day 9 in ordine. L'extra React Legacy è facoltativo dopo il Day 6; il Day 7 parte dal Day 6 anche se lo salti.

| Giorno | Tema | Capitoli | Checkpoint |
|---|---|---|---|
| Day 0 | Setup dell'ambiente | 6 | — |
| Extra | JavaScript Essentials | 8 | — |
| Day 1 | React Fundamentals | 6 | 1 · Prima dashboard |
| Day 2 | Components & Props | 6 | 2 · Conti e componenti riutilizzabili |
| Day 3 | State & Events | 6 | 3 · Gestione dello state |
| Day 4 | Forms, User Input e useRef | 7 | 4 · Form bonifico |
| Day 5 | Effects & API | 6 | 5 · Integrazione API |
| Day 6 | Routing | 6 | 6 · Routing |
| Extra | React Legacy, facoltativo | 7 | — |
| Day 7 | Advanced React, Architecture e Redux | 8 | Refactoring e Redux |
| Day 8 | Final Project | 6 | 7 · Progetto finale |
| Day 9 | Delivery | 6 | — |

> I link a repository e branch dei checkpoint sono **segnaposto**: `[DA CONFIGURARE: inserire URL reale della repository]` e `[DA CONFIGURARE: inserire nome reale del branch]`. Vedi il [README](./README.md#-come-completare-i-segnaposto-delle-repository).

---

## Day 0 — Setup dell'ambiente

- **Cartella:** [Day_00_Setup/](./Day_00_Setup/)
- **Obiettivo:** avere un ambiente funzionante (Node.js, npm, VS Code, Git/GitHub) e il progetto `liparibank` avviato con Vite.
- **Prerequisiti:** conoscenze di programmazione di base; un computer con permessi per installare software.
- **Capitoli:**
  1. [Introduzione al corso](./Day_00_Setup/01_Introduzione_al_corso.md)
  2. [Node.js e npm](./Day_00_Setup/02_Node_NPM.md)
  3. [Visual Studio Code](./Day_00_Setup/03_VS_Code.md)
  4. [Git e GitHub](./Day_00_Setup/04_Git_GitHub.md)
  5. [Vite e primo progetto React](./Day_00_Setup/05_Vite_e_primo_progetto_React.md)
  6. [Verifica ambiente](./Day_00_Setup/07_Verifica_ambiente.md)
- **Checkpoint:** nessuno (la verifica è la checklist del capitolo 06).
- **Risultato atteso:** `npm run dev` mostra la prima pagina LipariBank su `http://localhost:5173/`; il progetto è in una repository Git.

---

## Extra — JavaScript Essentials

- **Cartella:** [Extra_JavaScript_Essentials/](./Extra_JavaScript_Essentials/)
- **Obiettivo:** colmare le lacune JavaScript necessarie per React (moderno JS, non tutto JS).
- **Prerequisiti:** nozioni base di programmazione. Non richiede il progetto React.
- **Quando:** prima del Day 1 se JavaScript moderno è nuovo per te; altrimenti consultalo quando un capitolo lo richiama.
- **Capitoli:**
  1. [Variables e Types](./Extra_JavaScript_Essentials/01_Variables_Types.md)
  2. [Functions e Arrow Functions](./Extra_JavaScript_Essentials/02_Functions_Arrow_Functions.md)
  3. [Objects e Arrays](./Extra_JavaScript_Essentials/03_Objects_Arrays.md)
  4. [map, filter, reduce](./Extra_JavaScript_Essentials/04_Map_Filter_Reduce.md)
  5. [Destructuring, Spread, Rest](./Extra_JavaScript_Essentials/05_Destructuring_Spread_Rest.md)
  6. [ES Modules](./Extra_JavaScript_Essentials/06_ES_Modules.md)
  7. [Promises e async/await](./Extra_JavaScript_Essentials/07_Promises_Async_Await.md)
  8. [Optional chaining e ternary](./Extra_JavaScript_Essentials/08_Optional_Chaining_Ternary.md)
- **Checkpoint:** nessuno.
- **Risultato atteso:** sai manipolare conti e movimenti con array e oggetti, importare/esportare moduli e gestire una Promise.

---

## Day 1 — React Fundamentals

- **Cartella:** [Day_01_React_Fundamentals/](./Day_01_React_Fundamentals/)
- **Obiettivo:** capire cos'è React, la struttura di un progetto Vite, JSX e i Function Components; costruire la prima dashboard.
- **Prerequisiti:** Day 0 completato (progetto `liparibank` avviato).
- **Capitoli:**
  1. [React e LipariBank](./Day_01_React_Fundamentals/01_React_e_LipariBank.md)
  2. [Struttura del progetto](./Day_01_React_Fundamentals/02_Struttura_del_progetto.md)
  3. [JSX](./Day_01_React_Fundamentals/03_JSX.md)
  4. [Function Components](./Day_01_React_Fundamentals/04_Function_Components.md)
  5. [Rendering e composizione](./Day_01_React_Fundamentals/05_Rendering_e_Composizione.md)
  6. [Esercizio — LipariBank Dashboard](./Day_01_React_Fundamentals/06_Esercizio_LipariBank_Dashboard.md)
- **Checkpoint 1:** prima dashboard (capitolo 06).
- **Risultato atteso:** dashboard statica con nome cliente, saldo totale e ultimi cinque movimenti da un array locale.

---

## Day 2 — Components & Props

- **Cartella:** [Day_02_Components_Props/](./Day_02_Components_Props/)
- **Obiettivo:** componenti riutilizzabili con props, `children`, rendering condizionale e liste con `key`.
- **Prerequisiti:** Day 1 (checkpoint 1).
- **Capitoli:**
  1. [Componenti e composizione](./Day_02_Components_Props/01_Componenti_e_Composizione.md)
  2. [Props](./Day_02_Components_Props/02_Props.md)
  3. [Children](./Day_02_Components_Props/03_Children.md)
  4. [Conditional Rendering](./Day_02_Components_Props/04_Conditional_Rendering.md)
  5. [Liste e Keys](./Day_02_Components_Props/05_Liste_e_Keys.md)
  6. [Esercizio — LipariBank Accounts](./Day_02_Components_Props/06_Esercizio_LipariBank_Accounts.md)
- **Checkpoint 2:** conti e componenti riutilizzabili (capitolo 06).
- **Risultato atteso:** card dei conti, lista movimenti con stato vuoto, componente container `Dashboard`.

---

## Day 3 — State & Events

- **Cartella:** [Day_03_State_Events/](./Day_03_State_Events/)
- **Obiettivo:** rendere la dashboard interattiva con eventi e `useState`, aggiornamenti immutabili e lifting state up.
- **Prerequisiti:** Day 2 (checkpoint 2).
- **Capitoli:**
  1. [Event Handling](./Day_03_State_Events/01_Event_Handling.md)
  2. [useState](./Day_03_State_Events/02_useState.md)
  3. [State e re-render](./Day_03_State_Events/03_State_e_Rerender.md)
  4. [Immutabilità dello state](./Day_03_State_Events/05_Immutabilita_dello_State.md)
  5. [Lifting State Up](./Day_03_State_Events/06_Lifting_State_Up.md)
  6. [Esercizio — LipariBank Transactions](./Day_03_State_Events/07_Esercizio_LipariBank_Transactions.md)
- **Checkpoint 3:** gestione dello state (capitolo 06).
- **Risultato atteso:** filtri entrate/uscite e ricerca, selezione del conto, mostra/nascondi saldo.

---

## Day 4 — Forms & User Input

- **Cartella:** [Day_04_Forms_User_Input/](./Day_04_Forms_User_Input/)
- **Obiettivo:** form controllati, validazione, feedback e `useRef` per un bonifico **simulato**.
- **Prerequisiti:** Day 3 (checkpoint 3).
- **Capitoli:**
  1. [Form e Controlled Components](./Day_04_Forms_User_Input/01_Form_e_Controlled_Components.md)
  2. [Input e Select](./Day_04_Forms_User_Input/02_Input_e_Select.md)
  3. [Validazione](./Day_04_Forms_User_Input/03_Validazione.md)
  4. [Submit e feedback](./Day_04_Forms_User_Input/04_Submit_e_Feedback.md)
  5. [Esercizio — LipariBank Bonifico](./Day_04_Forms_User_Input/05_Esercizio_LipariBank_Bonifico.md)
  6. [Repository checkpoint](./Day_04_Forms_User_Input/06_Repository_Checkpoint.md)
  7. [useRef e focus](./Day_04_Forms_User_Input/07_useRef.md)
- **Checkpoint 4:** form bonifico (capitoli 05 e 06; il capitolo 06 spiega come proseguire da una repository GitHub).
- **Risultato atteso:** form con validazione di importo, beneficiario e campi obbligatori; il bonifico simulato compare nei movimenti.

---

## Day 5 — Effects & API

- **Cartella:** [Day_05_Effects_API/](./Day_05_Effects_API/)
- **Obiettivo:** `useEffect`, fetch, cleanup/annullamento delle richieste e stati loading/error/empty.
- **Prerequisiti:** Day 4 (checkpoint 4).
- **Capitoli:**
  1. [Side Effects](./Day_05_Effects_API/01_Side_Effects.md)
  2. [useEffect](./Day_05_Effects_API/02_useEffect.md)
  3. [Dipendenze e cleanup](./Day_05_Effects_API/03_Dipendenze_e_Cleanup.md)
  4. [Fetch API](./Day_05_Effects_API/04_Fetch_API.md)
  5. [Loading, Error, Empty states](./Day_05_Effects_API/05_Loading_Error_Empty_States.md)
  6. [Esercizio — LipariBank API Transactions](./Day_05_Effects_API/06_Esercizio_LipariBank_API_Transactions.md)
- **Checkpoint 5:** integrazione API (capitolo 06).
- **Risultato atteso:** movimenti caricati in modo asincrono da un file JSON locale (stand-in di un'API, sostituibile cambiando solo il service) con stati di caricamento, errore e assenza dati.

---

## Day 6 — Routing

- **Cartella:** [Day_06_Routing/](./Day_06_Routing/)
- **Obiettivo:** trasformare LipariBank in un'applicazione multi-pagina con React Router 7 (declarative mode).
- **Prerequisiti:** Day 5 (checkpoint 5).
- **Capitoli:**
  1. [SPA e routing](./Day_06_Routing/01_SPA_e_Routing.md)
  2. [React Router](./Day_06_Routing/02_React_Router.md)
  3. [Dynamic Routes e useParams](./Day_06_Routing/03_Dynamic_Routes_e_useParams.md)
  4. [Navigation e 404](./Day_06_Routing/04_Navigation_e_404.md)
  5. [Nested Routes](./Day_06_Routing/05_Nested_Routes.md)
  6. [Esercizio — LipariBank MultiPage](./Day_06_Routing/06_Esercizio_LipariBank_MultiPage.md)
- **Checkpoint 6:** routing (capitolo 06).
- **Risultato atteso:** pagine Dashboard, Conti, Dettaglio conto, Movimenti, Bonifico e 404 con navigazione.

---

## Extra — React Legacy (facoltativo)

- **Cartella:** [EXTRA_Legacy_React/](./EXTRA_Legacy_React/)
- **Obiettivo:** leggere, capire e manutenere codice con Class Components e versioni precedenti di React.
- **Prerequisiti:** Day 5 (useEffect) consigliato; Day 6 completato per l'esercizio.
- **Capitoli:**
  1. [React moderno vs legacy](./EXTRA_Legacy_React/01_React_Moderno_vs_Legacy.md)
  2. [Class Components](./EXTRA_Legacy_React/02_Class_Components.md)
  3. [Lifecycle Methods](./EXTRA_Legacy_React/03_Lifecycle_Methods.md)
  4. [State, props e setState](./EXTRA_Legacy_React/04_State_Props_setState.md)
  5. [Class vs Function Components](./EXTRA_Legacy_React/05_Class_vs_Function_Components.md)
  6. [Leggere e manutenere codice legacy](./EXTRA_Legacy_React/06_Leggere_e_Manutenere_Codice_Legacy.md)
  7. [Esercizio — LipariBank Legacy](./EXTRA_Legacy_React/07_Esercizio_LipariBank_Legacy.md)
- **Checkpoint:** facoltativo, nella cartella `repositories/EXTRA_Legacy_React`; il laboratorio è indipendente dal percorso principale.
- **Risultato atteso:** sai leggere una class component, seguirne il lifecycle, individuare API deprecate e migrarla a Function Component + Hooks.
- **Regola:** gli esercizi di sviluppo del corso restano su Function Components e Hooks.

---

## Day 7 — Advanced React & Architecture

- **Cartella:** [Day_07_Advanced_React_Architecture/](./Day_07_Advanced_React_Architecture/)
- **Obiettivo:** Context, `useReducer`, custom hooks, memoization (con giudizio), service layer e struttura del progetto.
- **Prerequisiti:** Day 6 (routing). L'extra React Legacy è facoltativo; l'Error Boundary è spiegato nel capitolo 06.
- **Capitoli:**
  1. [Context e useContext](./Day_07_Advanced_React_Architecture/01_Context_e_useContext.md)
  2. [useReducer](./Day_07_Advanced_React_Architecture/02_useReducer.md)
  3. [Custom Hooks](./Day_07_Advanced_React_Architecture/03_Custom_Hooks.md)
  4. [Memoization](./Day_07_Advanced_React_Architecture/04_Memoization.md)
  5. [Architettura del progetto](./Day_07_Advanced_React_Architecture/05_Architettura_del_Progetto.md)
  6. [Service layer e API](./Day_07_Advanced_React_Architecture/06_Service_Layer_e_API.md)
  7. [Esercizio — Refactoring LipariBank](./Day_07_Advanced_React_Architecture/07_Esercizio_Refactoring_LipariBank.md)
  8. [Redux Toolkit](./Day_07_Advanced_React_Architecture/08_Redux_Toolkit.md)
- **Checkpoint:** refactoring (capitolo 07), poi Redux (capitolo 08).
- **Risultato atteso:** Context + reducer per i dati bancari, Redux Toolkit per una preferenza condivisa, hook dedicati e service layer.

---

## Day 8 — Final Project

- **Cartella:** [Day_08_Final_Project/](./Day_08_Final_Project/)
- **Obiettivo:** definire e implementare il progetto finale LipariBank.
- **Prerequisiti:** Day 7 completato (o checkpoint di refactoring).
- **Capitoli:**
  1. [Final Project Brief](./Day_08_Final_Project/01_Final_Project_Brief.md)
  2. [Requirements funzionali](./Day_08_Final_Project/02_Requirements_Funzionali.md)
  3. [Architettura](./Day_08_Final_Project/03_Architettura.md)
  4. [Piano di implementazione](./Day_08_Final_Project/04_Piano_di_Implementazione.md)
  5. [Git Workflow](./Day_08_Final_Project/05_Git_Workflow.md)
  6. [Repository starter e checkpoint](./Day_08_Final_Project/06_Repository_Starter_e_Checkpoint.md)
- **Checkpoint 7:** progetto finale (capitolo 06; repository starter opzionale).
- **Risultato atteso:** applicazione completa rispetto ai requisiti: dashboard, conti, movimenti con filtri, bonifico simulato, navigazione, stati loading/error/empty.

---

## Day 9 — Delivery

- **Cartella:** [Day_09_Delivery/](./Day_09_Delivery/)
- **Obiettivo:** verificare, rifinire, documentare e consegnare l'applicazione.
- **Prerequisiti:** Day 8 (applicazione funzionante).
- **Capitoli:**
  1. [Refactoring finale](./Day_09_Delivery/01_Refactoring_Finale.md)
  2. [Testing manuale](./Day_09_Delivery/02_Testing_Manuale.md)
  3. [Accessibility e Responsive](./Day_09_Delivery/03_Accessibility_e_Responsive.md)
  4. [Environment e Deploy](./Day_09_Delivery/04_Environment_e_Deploy.md)
  5. [README e documentazione](./Day_09_Delivery/05_README_e_Documentazione.md)
  6. [Consegna finale](./Day_09_Delivery/06_Consegna_Finale.md)
- **Checkpoint:** nessuno (checklist di consegna nel capitolo 06).
- **Risultato atteso:** build di produzione verificata, README completo, repository pronta per la consegna. Un eventuale deploy statico è descritto, non eseguito dal corso.

---

## 🔗 Altri file

- [README.md](./README.md) — presentazione del corso e uso dei file.
- [TEMPLATE_CAPITOLO.md](./TEMPLATE_CAPITOLO.md) — struttura comune dei capitoli.
- [MOODLE_IMPORT_GUIDE.md](./MOODLE_IMPORT_GUIDE.md) — pubblicazione su Moodle.
