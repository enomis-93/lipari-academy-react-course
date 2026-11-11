# 🏦 LipariBank — React Zero to Hero

> **Day 8 · Capitolo 01**
> **Argomento:** Final Project Brief
> **Durata stimata:** 30 minuti
> **Parte di LipariBank:** l'intera applicazione — da oggi smetti di aggiungere concetti e porti a termine un prodotto

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- descrivere cosa deve fare il progetto finale LipariBank, cosa è dentro e cosa è fuori dall'ambito;
- fare un **audit** della tua app a fine Day 7 e individuare cosa manca rispetto al brief;
- elencare i deliverable e i criteri con cui verrà valutato il lavoro;
- capire come si leggono i cinque capitoli successivi del Day 8.

---

## 📋 Prerequisiti
- Day 7 completato: [Redux Toolkit](../Day_07_Advanced_React_Architecture/08_Redux_Toolkit.md), dopo l'esercizio di refactoring.
- Progetto `liparibank/` funzionante con `npm run dev` (Node 22 LTS, React 19, Vite 8, React Router v7 declarative).
- Stato atteso: `BankContext` e `SettingsContext`, custom hooks in `src/hooks/`, service layer in `src/services/`, router con `src/pages/` e `src/layouts/`, Error Boundary.

---

## 🧭 In questo capitolo
- Lo scenario del progetto finale e il suo ambito.
- Le funzionalità richieste, a colpo d'occhio.
- Vincoli tecnici e deliverable.
- Audit dello stato attuale della tua app.
- Come usare i capitoli 02–06 del Day 8.

---

## 🧠 Theory

### Il progetto finale non è un nuovo progetto
Finora hai costruito LipariBank a pezzi: una dashboard statica, componenti riutilizzabili, state, form, fetch, routing, architettura. Il **progetto finale è la stessa applicazione**, portata a un livello "consegnabile": ogni funzionalità è completa, gestisce i casi limite (caricamento, errore, assenza di dati), ha una struttura ordinata ed è verificata.

Nel lavoro reale succede lo stesso: la maggior parte del tempo non va nello scrivere la prima versione, ma nel completarla, rifinirla e dimostrare che funziona.

### Lo scenario
LipariBank è un'app didattica di home banking **fittizia**. Il cliente di esempio è Mario Rossi, con due conti (Conto Corrente e Conto Risparmio) e otto movimenti. Tutti i dati sono inventati; non esiste nessun collegamento con banche o servizi reali. Il "bonifico" è una **simulazione** che modifica solo lo state locale dell'app.

### Ambito
| Dentro l'ambito | Fuori dall'ambito |
|---|---|
| Dashboard con saldo totale e ultimi movimenti | Login, registrazione, autenticazione reale |
| Elenco conti e dettaglio conto | Back-end vero, database, API reali |
| Elenco movimenti con filtri (tipo, testo, conto) | Salvataggio permanente dei bonifici |
| Form di bonifico simulato con validazione e feedback | Pagamenti o trasferimenti reali |
| Navigazione multipagina e pagina 404 | TypeScript, test automatici, librerie UI |
| Stati di caricamento, errore e assenza dati | Notifiche push, PDF, grafici |
| Componenti riutilizzabili e struttura ragionata | Internazionalizzazione completa |

### Vincoli tecnici
- JavaScript (niente TypeScript), Function Components e Hooks.
- React 19, Vite 8, React Router v7 in *declarative mode* (import da `"react-router"`).
- Mantieni Redux Toolkit e React Redux introdotti nel Day 7; non aggiungere axios o librerie UI. CSS in file semplici.
- Dati solo fittizi, nessun segreto nel repository.
- Lint pulito con `npm run lint` (oxlint) e build funzionante con `npm run build`.

> 💡 **Remember**
>
> "Finito" non significa "funziona sul mio schermo con i dati felici". Significa: funziona anche quando i dati mancano, la rete fallisce, l'utente sbaglia, la finestra è stretta.

---

## 💻 Let's Code

In questo capitolo non scrivi funzionalità nuove: **misuri il punto di partenza**. Esegui i tre comandi seguenti, ciascuno dentro `liparibank/`.

Avvia il server di sviluppo e apri `http://localhost:5173/`:

```bash
npm run dev
```

In un secondo terminale, controlla il lint:

```bash
npm run lint
```

Verifica che la build di produzione venga generata (non serve ancora pubblicarla):

```bash
npm run build
```

Cosa fa: `lint` analizza il codice con oxlint (se tutto è a posto non stampa nessun problema; gli avvisi come variabili o import inutilizzati sono *warning* e non fanno fallire il comando, ma nel corso vanno corretti comunque), `build` produce la cartella `dist/`. Se uno dei due fallisce **adesso**, annota gli errori: li sistemerai nella Fase 0 del [Piano di implementazione](./04_Piano_di_Implementazione.md). Non correggerli ora "a caso": prima serve il quadro completo.

Poi percorri a mano l'app nel browser, in quest'ordine: `/`, `/accounts`, `/accounts/acc-001`, `/transactions`, `/transfer`, e un indirizzo inventato come `/non-esiste`.

---

## 🏦 LipariBank in action

### Le funzionalità richieste (vista d'insieme)
Il dettaglio con ID, criteri di accettazione e priorità è nel capitolo [Requirements Funzionali](./02_Requirements_Funzionali.md). Qui la mappa:

| Area | Cosa deve fare l'utente |
|---|---|
| Dashboard | Vedere saldo totale (nascondibile) e ultimi 5 movimenti |
| Conti | Vedere i conti e aprire il dettaglio di uno di essi |
| Movimenti | Consultare tutti i movimenti e filtrarli per tipo, testo, conto |
| Bonifico | Compilare un form, ricevere errori chiari, vedere il bonifico simulato comparire nei movimenti |
| Navigazione | Muoversi tra le pagine; vedere una 404 sensata |
| Robustezza | Vedere caricamento, errore e assenza di dati in modo comprensibile |

### Audit: cosa hai a fine Day 7
Confronta la tua app con questa tabella. Per ogni riga scrivi ✅ (c'è e funziona), 🟡 (c'è ma incompleto) o ❌ (manca).

| # | Elemento | Da dove arriva | Stato |
|---|---|---|---|
| A1 | Dashboard con saldo totale e ultimi 5 movimenti | Day 1–2, Day 6 (`DashboardPage`) | |
| A2 | Pulsante mostra/nascondi saldo | Day 3, Day 7 (`SettingsContext`) | |
| A3 | Lista conti e dettaglio `/accounts/:accountId` | Day 2, Day 6 | |
| A4 | Lista movimenti con filtro entrate/uscite e ricerca testuale | Day 3 | |
| A5 | Filtro per conto | Da verificare | |
| A6 | Form bonifico con validazione per campo | Day 4 | |
| A7 | Bonifico simulato che aggiorna movimenti e saldo | Day 4, Day 7 (`ADD_TRANSFER`) | |
| A8 | Caricamento da `public/data/*.json` con loading/error/empty | Day 5, Day 7 | |
| A9 | Pagina 404 e `NavLink` nel layout | Day 6 | |
| A10 | Error Boundary | Day 7 | |
| A11 | `npm run lint` senza errori | — | |
| A12 | `npm run build` senza errori | — | |

---

## 🧪 Your Turn

**Obiettivo:** produrre l'elenco dei "gap" della tua app, la base di lavoro per i prossimi capitoli.

**Requisiti**
1. Compila la tabella di audit sopra (copiala in un tuo file di appunti, fuori da `src/`).
2. Per ogni riga ❌ o 🟡 scrivi una frase: *cosa manca esattamente* (es. "il filtro per conto non esiste", non "sistemare i filtri").
3. Annota l'output di `npm run lint` e `npm run build`: numero di errori e warning, nome dei file coinvolti.
4. Percorri le 6 URL elencate sopra e annota ogni errore in console del browser.

**Passi suggeriti**
- Apri DevTools (F12) → scheda Console prima di navigare.
- Se un'area funziona "quasi", classificala 🟡 e descrivi il caso che non va.

**Risultato atteso:** un elenco di gap concreti, ordinato per area, con almeno una riga per ogni ❌/🟡.

**Criteri di completamento:** nessuna riga della tabella è vuota; ogni gap è descritto in modo verificabile.

---

## ⚠️ Common Mistakes
- **Ricominciare da zero** perché "il codice è brutto": rifinisci, non riscrivere. Il refactoring è un'attività del Day 9.
- **Aggiungere funzionalità fuori brief** (login, grafici) prima di completare quelle richieste.
- **Saltare l'audit** e scoprire i problemi all'ultimo momento.
- **Correggere durante l'audit**: se ti fermi a sistemare ogni cosa perdi il quadro d'insieme.

---

## ✅ Checklist
- ☐ Ho letto ambito, vincoli e deliverable.
- ☐ Ho eseguito `npm run dev`, `npm run lint`, `npm run build` e annotato gli esiti.
- ☐ Ho navigato tutte le rotte principali e la 404.
- ☐ Ho compilato la tabella di audit.
- ☐ Ho un elenco di gap concreti.

---

## 🚀 Challenge
Aggiungi alla tabella di audit una riga "A13" con un tuo criterio di qualità (per esempio "nessun `console.log` rimasto") e valutala.

---

## 📌 Recap
- Il progetto finale è LipariBank stessa, completata e rifinita.
- L'ambito è chiuso: nessun login, nessun back-end reale, nessuna dipendenza nuova.
- Il bonifico è una simulazione che vive solo nello state locale.
- L'audit di partenza trasforma "mi sembra quasi finita" in un elenco verificabile di gap.

---

### ➡️ Next
Prossimo capitolo: [Requirements Funzionali](./02_Requirements_Funzionali.md) — trasformiamo la mappa di questo capitolo in requisiti numerati con criteri di accettazione.
