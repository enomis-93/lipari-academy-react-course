# 🏦 LipariBank — React Zero to Hero

> **Day 9 · Capitolo 01**
> **Argomento:** Brief e requisiti del progetto finale
> **Durata stimata:** 45 minuti
> **Parte di LipariBank:** l'intera applicazione — da oggi smetti di aggiungere concetti e porti a termine un prodotto

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- descrivere scopo, ambito e vincoli del progetto finale;
- leggere un elenco di requisiti con ID, criteri di accettazione e priorità *Must / Should / Could*;
- distinguere i requisiti che la tua app soddisfa già da quelli che devi completare da solo;
- produrre l'elenco preciso di ciò che manca.

---

## 📋 Prerequisiti
- [Day 8 · Esercizio — Refactoring di LipariBank](../Day_08_Advanced_Hooks_Architecture/05_Esercizio_Refactoring_LipariBank.md) completato, oppure il checkpoint `liparibank-day-08.zip`.
- `npm run dev`, `npm run lint` e `npm run build` funzionano dentro `liparibank/`.

---

## 🧭 In questo capitolo
- Che cos'è il progetto finale, e che cosa non è.
- Ambito e vincoli tecnici.
- Come si scrive un requisito verificabile.
- I requisiti di LipariBank, con il loro stato a fine Day 8.
- L'audit della tua applicazione.

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

### Requisito verificabile
Un requisito è utile solo se si può rispondere "sì/no" alla domanda *"è soddisfatto?"*. Confronta:

| Debole | Verificabile |
|---|---|
| "La dashboard deve essere bella." | "La dashboard mostra il saldo totale formattato in euro e gli ultimi 5 movimenti ordinati per data decrescente." |
| "Il form deve validare." | "Con importo 0 il form mostra un errore sotto il campo e non crea nessun movimento." |

### Criteri di accettazione
Per ogni requisito scrivi uno o più criteri nella forma **Dato / Quando / Allora**:
- **Dato** uno stato di partenza (pagina, dati);
- **Quando** l'utente compie un'azione;
- **Allora** succede un risultato osservabile.

### Priorità MoSCoW
- **Must** — senza, il progetto non è consegnabile.
- **Should** — importante, da fare se il tempo lo consente dopo i Must.
- **Could** — miglioramento facoltativo.

> 💡 **Remember**
>
> Completa tutti i **Must** prima di toccare un solo **Should**. Un'app con 12 funzionalità a metà vale meno di una con 8 complete.

### Già soddisfatto o lavoro autonomo
Seguendo il corso hai già costruito quasi tutto. Per questo ogni requisito ha uno **stato a fine Day 8**:

- **✅ Già soddisfatto**: l'applicazione di fine Day 8 lo rispetta. Devi solo verificarlo.
- **🛠️ Lavoro autonomo**: manca, del tutto o in parte. Il corso ti dà il criterio di accettazione ma **non i passi**: è la parte in cui dimostri di saper usare da solo ciò che hai imparato.

La soluzione completa esiste, ed è il checkpoint del Day 9. Consultala dopo aver provato, per confrontare: non è l'unica soluzione corretta.

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

Cosa fa: `lint` analizza il codice con oxlint (se tutto è a posto non stampa nessun problema; gli avvisi come variabili o import inutilizzati sono *warning* e non fanno fallire il comando, ma nel corso vanno corretti comunque), `build` produce la cartella `dist/`. Se uno dei due fallisce **adesso**, annota gli errori: li sistemerai nella Fase 0 del [piano di lavoro](./02_Architettura_e_Piano.md). Non correggerli ora "a caso": prima serve il quadro completo.

Poi percorri a mano l'app nel browser, in quest'ordine: `/`, `/accounts`, `/accounts/acc-001`, `/transactions`, `/transfer`, e un indirizzo inventato come `/non-esiste`.

---

## 🏦 LipariBank in action

### Requisiti funzionali

| ID | Requisito | Criteri di accettazione | Priorità | Stato a fine Day 8 |
|---|---|---|---|---|
| **REQ-01** | **Dashboard**: saldo totale e ultimi movimenti | **Dato** `/`, **allora** vedo il saldo totale (somma dei conti) formattato in euro e una card "Ultimi movimenti" con gli ultimi 5 movimenti **di tutti i conti**, dal più recente. "Nascondi saldi" sostituisce gli importi con un segnaposto e "Mostra saldi" li ripristina. | Must | 🛠️ Manca la card "Ultimi movimenti" |
| **REQ-02** | **Elenco conti** | **Dato** `/accounts`, **allora** vedo per ogni conto nome e saldo. **Se** non ci sono conti, vedo un messaggio di stato vuoto invece di un elenco vuoto. | Must | 🛠️ Manca lo stato vuoto |
| **REQ-03** | **Dettaglio conto** | **Dato** `/accounts/acc-001`, **allora** vedo IBAN, saldo e movimenti del conto. **Dato** `/accounts/xyz`, **allora** vedo "Conto non trovato" con un link per tornare ai conti, senza errori in console. | Must | ✅ |
| **REQ-04** | **Elenco movimenti** | **Dato** `/transactions`, **allora** vedo tutti i movimenti ordinati per data decrescente; ogni riga mostra data (`it-IT`), descrizione, categoria, importo verde (entrata) o rosso (uscita) e l'etichetta testuale Entrata/Uscita. | Must | ✅ |
| **REQ-05** | **Filtri per tipo e testo** | **Quando** scelgo "Uscite" vedo solo importi negativi; "Entrate" solo positivi; "Tutti" li vedo tutti. **Quando** scrivo `utenza` vedo solo i movimenti la cui descrizione la contiene, senza distinguere maiuscole e minuscole. I due filtri si combinano. | Must | ✅ |
| **REQ-06** | **Filtro per conto** | **Dato** `/transactions`, **quando** scelgo "Conto Risparmio" vedo solo i movimenti con `accountId: "acc-002"`; "Tutti i conti" li mostra tutti. La scelta si combina con REQ-05. | Should | 🛠️ Manca |
| **REQ-07** | **Form bonifico con validazione** | **Dato** `/transfer`, **quando** invio con campi vuoti, importo ≤ 0, importo non numerico o superiore al saldo del conto scelto, **allora** vedo un errore per ogni campo errato e **nessun** movimento viene creato. | Must | ✅ |
| **REQ-08** | **Effetto del bonifico** | **Quando** invio un bonifico valido (per esempio 50,00 € dal Conto Corrente a Giulia Bianchi), **allora** arrivo alla pagina Movimenti con il messaggio "Bonifico simulato registrato.", il nuovo movimento `Bonifico a Giulia Bianchi` di −50,00 € è in testa e il saldo del conto è sceso di 50,00 € in tutte le pagine. | Must | ✅ |
| **REQ-09** | **Navigazione e 404** | Il layout mostra intestazione e menu con Dashboard, Conti, Movimenti, Bonifico; la voce attiva è evidenziata. **Dato** un indirizzo inesistente, **allora** vedo la pagina 404 con un link alla dashboard. Ricaricando (`F5`) una pagina valida, questa si riapre correttamente. | Must | ✅ |
| **REQ-10** | **Caricamento, errore, assenza di dati** | **Durante** il caricamento vedo un messaggio; **se** il caricamento fallisce vedo un messaggio comprensibile con "Riprova"; **se** i dati sono vuoti vedo un `EmptyState`. Mai una pagina bianca. | Must | ✅ |
| **REQ-11** | **Componenti riutilizzabili** | `Card`, `EmptyState`, `LoadingMessage`, `ErrorMessage`, `TransactionList` sono usati in più pagine senza duplicare il markup. | Must | ✅ |
| **REQ-12** | **Preferenze persistenti** | **Quando** nascondo i saldi o scelgo un filtro per tipo nei movimenti e ricarico la pagina, la scelta resta. | Should | ✅ |
| **REQ-13** | **Error Boundary** | Un errore di rendering in una pagina mostra un messaggio di ripiego con "Riprova", lasciando visibili intestazione e menu. | Should | ✅ |
| **REQ-14** | **Movimento preferito** | **Quando** segno un movimento come preferito, il segno è visibile in tutte le pagine finché non ricarico. | Could | ✅ |
| **REQ-15** | **Stato condiviso** | Conti, movimenti, caricamento ed errore vivono nello store Redux, e ogni azione dell'utente su questi dati compare nei Redux DevTools. Le preferenze vivono in un Context; filtri e form in state locale. Nessun dato è duplicato. | Must | ✅ |
| **REQ-16** | **Focus nel form** | Dopo un invio non valido il focus è sul primo campo con errore. | Must | ✅ |

### Requisiti non funzionali

| ID | Requisito | Dove lo verifichi | Priorità | Stato a fine Day 8 |
|---|---|---|---|---|
| **NFR-01** | Qualità del codice: `npm run lint` senza errori, nessun `console.log` residuo, nessun codice morto | [Refactoring e test manuale](./04_Refactoring_e_Test_Manuale.md) | Must | ✅ da riverificare |
| **NFR-02** | Build di produzione: `npm run build` termina senza errori | [Environment e deploy](./06_Environment_e_Deploy.md) | Must | ✅ da riverificare |
| **NFR-03** | Accessibilità di base: lingua della pagina, etichette sui campi, uso da tastiera, saldo nascosto comprensibile a uno screen reader, titolo di ogni pagina | [Accessibility e responsive](./05_Accessibility_e_Responsive.md) | Should | Guidato nel capitolo 05 |
| **NFR-04** | Layout utilizzabile da circa 360 px di larghezza fino al desktop | [Accessibility e responsive](./05_Accessibility_e_Responsive.md) | Should | Guidato nel capitolo 05 |
| **NFR-05** | Nessun segreto nel repository; solo variabili `VITE_*` non sensibili | [Git workflow](./03_Git_Workflow.md) ed [Environment e deploy](./06_Environment_e_Deploy.md) | Must | Guidato nei capitoli 03 e 06 |

### Matrice requisito → file (indicativa)

| Requisito | Pagina | File principali |
|---|---|---|
| REQ-01 | `DashboardPage` · `/` | `BalanceCard.jsx`, `TransactionList.jsx`, `useTransactions.js` |
| REQ-02, REQ-03 | `AccountsPage`, `AccountDetailPage` | `accountsSlice.js`, `accountService.js`, `EmptyState.jsx` |
| REQ-04, REQ-05, REQ-06 | `TransactionsPage` · `/transactions` | `TransactionFilters.jsx`, `TransactionList.jsx`, `useTransactions.js` |
| REQ-07, REQ-08, REQ-16 | `TransferPage` · `/transfer` | `TransferForm.jsx`, `useTransferForm.js`, `validators.js`, `transactionsSlice.js` |
| REQ-09 | `AppLayout`, `NotFoundPage` | `AppLayout.jsx`, `App.jsx` |
| REQ-10, REQ-11 | tutte | `useBankStatus.js`, `LoadingMessage.jsx`, `ErrorMessage.jsx`, `EmptyState.jsx`, `Card.jsx` |
| REQ-12 | tutte | `SettingsContext.jsx`, `useLocalStorage.js` |
| REQ-13 | layout | `ErrorBoundary.jsx`, `AppLayout.jsx` |
| REQ-15 | tutte | `store.js`, `accountsSlice.js`, `transactionsSlice.js`, `SettingsContext.jsx` |

---

## 🧪 Your Turn

**Obiettivo:** produrre l'elenco di ciò che manca alla tua app, la base di lavoro per i prossimi capitoli.

**Requisiti:**
1. Copia nei tuoi appunti (fuori da `src/`) la tabella dei requisiti funzionali e, per ogni riga, verifica **nel browser** il criterio di accettazione: scrivi ✅ (rispettato), 🟡 (in parte) o ❌ (manca).
2. Per ogni 🟡 e ❌ scrivi una frase su *che cosa manca esattamente* (per esempio "in dashboard non c'è la card con gli ultimi 5 movimenti di tutti i conti", non "sistemare la dashboard").
3. Annota l'esito di `npm run lint` e `npm run build`: numero di errori e avvisi, file coinvolti.
4. Apri, una dopo l'altra, `/`, `/accounts`, `/accounts/acc-001`, `/transactions`, `/transfer` e un indirizzo inventato, annotando ogni errore in console.

**Passi suggeriti:**
1. Tieni aperta la Console del browser mentre navighi.
2. Per il caso "nessun conto" di REQ-02 svuota temporaneamente `public/data/accounts.json` lasciando solo `[]`, guarda `/accounts`, poi ripristina il file.

**Risultato atteso:** se sei partito dal Day 8, i tuoi 🟡 e ❌ coincidono con i tre requisiti marcati 🛠️. Se ne trovi altri, sono difetti da correggere prima di tutto il resto.

**Criteri di completamento:** nessuna riga senza esito; ogni mancanza è descritta in modo verificabile.

---

## ⚠️ Common Mistakes
- **Ricominciare da zero** perché "il codice è brutto": rifinisci, non riscrivere. Il refactoring è un'attività del Day 9.
- **Aggiungere funzionalità fuori brief** (login, grafici) prima di completare quelle richieste.
- **Saltare l'audit** e scoprire i problemi all'ultimo momento.
- **Correggere durante l'audit**: se ti fermi a sistemare ogni cosa perdi il quadro d'insieme.
- **Criteri vaghi** ("l'interfaccia è chiara"): riscrivili con un risultato osservabile.
- **Tutto "Must"**: se tutto è prioritario, nulla lo è. Il brief indica quali sono i Must.
- **Requisito = soluzione tecnica** ("usare `useReducer`"): un requisito dice *cosa*, l'architettura dice *come*.
- **Dimenticare i casi di errore**: ogni form e ogni caricamento ha un percorso "negativo" da specificare.

---

## ✅ Checklist
- ☐ So spiegare che cosa rende "consegnabile" un'applicazione.
- ☐ So leggere un requisito: ID, criterio di accettazione, priorità.
- ☐ So distinguere Must, Should e Could.
- ☐ Ho verificato nel browser ogni requisito funzionale.
- ☐ Ho l'elenco scritto di ciò che manca.
- ☐ `npm run lint` e `npm run build` terminano senza errori.

---

## 🚀 Challenge
Scrivi tu un requisito in più, di priorità *Could*, con il suo criterio di accettazione nella forma **Dato / Quando / Allora**: per esempio un filtro "solo preferiti" nella pagina Movimenti. Se a fine giornata ti avanza tempo, realizzalo.

---

## 📌 Recap
- Il progetto finale è la stessa LipariBank, portata a un livello consegnabile.
- Un requisito è utile se è verificabile: ha un ID, un criterio di accettazione e una priorità.
- Prima i Must, poi gli Should, poi i Could.
- Quasi tutti i requisiti sono già soddisfatti; tre richiedono lavoro autonomo, senza passi guidati.
- L'audit trasforma "mi sembra che funzioni" in un elenco preciso di cose da fare.

---

### ➡️ Next
Prossimo capitolo: [02 · Architettura e piano di lavoro](./02_Architettura_e_Piano.md). Decidi dove va il codice che manca e in che ordine scriverlo.
