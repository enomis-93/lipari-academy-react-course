# 🏦 LipariBank — React Zero to Hero

Corso pratico per imparare React costruendo un'unica applicazione progressiva: **LipariBank**, una banca fittizia.

> ⚠️ **LipariBank è un progetto didattico.** Tutti i dati (clienti, IBAN, saldi, movimenti, beneficiari) sono **fittizi**. Nessun bonifico è reale, nessun servizio bancario viene contattato, non servono credenziali né API key.

---

## 🎯 Finalità del corso

Al termine sarai in grado di:

- comprendere la struttura di un'applicazione React;
- sviluppare interfacce con JSX e Function Components;
- gestire props, state, eventi, liste e rendering condizionale;
- realizzare form con validazione;
- integrare dati asincroni tramite `fetch`;
- usare React Router;
- organizzare un progetto in componenti, servizi e moduli;
- usare `useRef`, Context, reducer, custom hooks e Redux Toolkit;
- opzionalmente, leggere progetti legacy con Class Components;
- lavorare con Git e GitHub;
- sviluppare, documentare e consegnare un'applicazione React completa.

## 👥 Destinatari

Sviluppatori con conoscenze di programmazione di base (variabili, funzioni, cicli, condizioni) e una minima familiarità con HTML e CSS. JavaScript moderno si può recuperare con l'[Extra](#-percorso-principale-vs-extra-javascript).

## 📋 Prerequisiti

- Conoscenze di programmazione di base.
- HTML e CSS elementari.
- Un computer (Windows, macOS o Linux) con permessi per installare software.
- Un account GitHub (si crea nel [Day 0](./Day_00_Setup/04_Git_GitHub.md)).

---

## 🧱 Versioni di riferimento

Gli esempi sono scritti e coerenti con:

| Componente | Riferimento |
|---|---|
| Node.js | 22 LTS (Vite 8 richiede `^20.19.0` oppure `>=22.12.0`) |
| React / React DOM | 19.x |
| Vite | 8.x (progetto creato con `npm create vite@latest`, template `react`) |
| React Router | 7.x, *declarative mode* (`npm install react-router@7`) |
| Linguaggio | JavaScript (non TypeScript) |
| Lint | oxlint, incluso nel template Vite (`npm run lint`) |

Le versioni esatte installate sono quelle scritte nel `package.json` del tuo progetto. Se usi versioni diverse, i capitoli potrebbero non corrispondere: verifica i numeri di versione e consulta le note di aggiornamento.

---

## 🗂️ Struttura delle cartelle

```text
LipariBank-React-Academy/
├── README.md
├── COURSE_MAP.md
├── MOODLE_IMPORT_GUIDE.md
├── TEMPLATE_CAPITOLO.md
│
├── Day_00_Setup/                        (6 capitoli)
├── Extra_JavaScript_Essentials/         (8 capitoli)
├── Day_01_React_Fundamentals/           (6 capitoli)
├── Day_02_Components_Props/             (6 capitoli)
├── Day_03_State_Events/                 (6 capitoli)
├── Day_04_Forms_User_Input/             (7 capitoli)
├── Day_05_Effects_API/                  (6 capitoli)
├── Day_06_Routing/                      (6 capitoli)
├── EXTRA_Legacy_React/                 (7 capitoli, EXTRA facoltativo)
├── Day_07_Advanced_React_Architecture/  (8 capitoli)
├── Day_08_Final_Project/                (6 capitoli)
└── Day_09_Delivery/                     (6 capitoli)
```

Ogni capitolo è un file Markdown numerato (`01_...md`, `02_...md`) per mantenere l'ordine. La mappa completa con obiettivi, prerequisiti, checkpoint e risultati attesi è in [COURSE_MAP.md](./COURSE_MAP.md).

---

## 🏦 Il progetto LipariBank

Un unico progetto, `liparibank/`, che cresce giorno dopo giorno:

1. dashboard statica;
2. componenti riutilizzabili per conti e movimenti;
3. interazioni e gestione dello state;
4. form per un bonifico simulato;
5. recupero asincrono di dati;
6. navigazione tra dashboard, conti, movimenti e bonifici;
7. refactoring, architettura e Redux;
8. progetto finale;
9. verifica, documentazione e consegna.

Il modulo React Legacy è un approfondimento facoltativo, separato dal percorso principale.

Dominio: *Customer* (cliente), *Account* (conto corrente), *Balance* (saldo), *Transaction* (movimento), *Beneficiary* (beneficiario), *Transfer* (bonifico), *Dashboard*, *Settings*. Ogni capitolo indica quale parte di LipariBank sviluppa o migliora.

---

## 🧪 Metodologia

Ogni capitolo segue il ritmo **Spiega → Mostra → Fai provare → Verifica → Collega al prossimo argomento** ed è composto, nello stesso ordine, da: obiettivo, prerequisiti, teoria essenziale, esempio guidato, applicazione a LipariBank, esercizio pratico, checkpoint (quando pertinente), errori comuni, checklist, challenge facoltativa, recap, capitolo successivo. La struttura è descritta in [TEMPLATE_CAPITOLO.md](./TEMPLATE_CAPITOLO.md).

Le soluzioni non vengono sempre date subito: prova prima da solo, poi confronta.

---

## 🧰 Percorso principale vs Extra JavaScript

- **Percorso principale:** Day 0 → Day 1–9, in ordine.
- **Extra — JavaScript Essentials:** 8 capitoli brevi su ciò che serve di JavaScript per seguire React (arrow function, `map/filter/reduce`, destructuring, moduli, `async/await`...). Si consulta **prima o durante** il corso, secondo necessità. Non è un corso JavaScript completo.
- **Extra — React Legacy:** facoltativo dopo il Day 6; non è un prerequisito del Day 7.

## ⚛️ React moderno e legacy

- **Sviluppo:** tutti gli esercizi usano **Function Components e Hooks**.
- **Legacy:** l'[extra React Legacy](./EXTRA_Legacy_React/01_React_Moderno_vs_Legacy.md) introduce lettura e manutenzione di **Class Components** e lifecycle. Gli Hooks esistono da React 16.8. L'Error Boundary del Day 7 è una piccola eccezione spiegata nel capitolo stesso.

---

## 📖 Come usare i file Markdown

1. Segui l'ordine indicato in [COURSE_MAP.md](./COURSE_MAP.md).
2. Leggi un capitolo alla volta; digita il codice (non limitarti a copiarlo) e verifica il risultato nel browser.
3. Esegui l'esercizio "Your Turn" prima di guardare le soluzioni di riferimento.
4. Spunta la checklist di fine capitolo.
5. I percorsi dei file nel codice sono relativi alla cartella del progetto `liparibank/` (es. `src/components/Header.jsx`); i comandi indicano la cartella da cui eseguirli.
6. Apri i file in VS Code con l'anteprima Markdown (`Ctrl+Shift+V`) oppure pubblicali su Moodle.

### Convenzioni di scrittura (per chi mantiene il corso)

- Un solo titolo `#` per file; sezioni `##`, sotto-sezioni `###`.
- Solo Markdown standard: niente HTML, CSS o JavaScript inline.
- Blocchi di codice sempre con il linguaggio (`bash`, `json`, `jsx`, `javascript`, `css`, `text`), un obiettivo per blocco.
- Checklist con `☐` invece delle task list GFM, non supportate da tutti i renderer.
- Nessun pulsante "Copy" finto: la funzione dipende da renderer, tema o plugin (vedi [MOODLE_IMPORT_GUIDE.md](./MOODLE_IMPORT_GUIDE.md)).
- Dati fittizi soltanto; nessun segreto nei file.

---

## 🔗 Come completare i segnaposto delle repository

Il corso **non include** link a repository reali: dove servirebbe un link ci sono segnaposto espliciti:

- `[DA CONFIGURARE: inserire URL reale della repository]`
- `[DA CONFIGURARE: inserire nome reale del branch]`

Per completarli:

1. Pubblica la repository starter e/o i checkpoint (opzionali) su GitHub.
2. Cerca tutti i segnaposto, dentro `LipariBank-React-Academy/`:

   ```bash
   grep -rn "DA CONFIGURARE" .
   ```

   In PowerShell:

   ```powershell
   Select-String -Path .\*\*.md -Pattern "DA CONFIGURARE"
   ```

3. Sostituisci ogni segnaposto con URL e branch reali. I checkpoint previsti sono: prima dashboard (Day 1), conti e componenti (Day 2), state (Day 3), form bonifico (Day 4), integrazione API (Day 5), routing (Day 6), refactoring (Day 7) e progetto finale (Day 8).
4. Gli studenti possono sempre proseguire dalla **propria** repository creata nel Day 0.

---

## 🎓 Note per la pubblicazione su Moodle

- Markdown e HTML sono cose diverse: Moodle mostra HTML. Non dare per scontato che un file `.md` caricato diventi una pagina formattata; dipende da versione, funzionalità abilitate, permessi e plugin.
- Il pulsante **Copy** sui blocchi di codice dipende dal renderer, dal tema o da un plugin: non è parte del Markdown e i capitoli non contengono JavaScript inline per simularlo.
- Leggi la guida completa: [MOODLE_IMPORT_GUIDE.md](./MOODLE_IMPORT_GUIDE.md).

## 🧩 Conversione TinyMCE

Installa le dipendenze con `npm install`, poi esegui `npm run tinymce:convert` per convertire ricorsivamente il Day 1. Per convertire un altro modulo, passa la cartella sorgente, ad esempio `npm run tinymce:convert -- --source Day_02_Components_Props`. Usa `--limit 1` per generare un singolo capitolo di anteprima. I file HTML sono salvati in `tinymce-html/`; il JavaScript condiviso per i pulsanti Copy deve essere caricato dalla pagina ospitante.

---

## ▶️ Da dove iniziare

Parti da [Day 0 — Introduzione al corso](./Day_00_Setup/01_Introduzione_al_corso.md).
