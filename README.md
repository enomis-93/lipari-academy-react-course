# 🏦 LipariBank — React Zero to Hero

Sorgenti del corso React della Lipari Academy. Lo studente costruisce, giorno dopo giorno, un'unica applicazione: **LipariBank**, un home banking fittizio.

Questa repository è lo spazio di lavoro di chi **scrive e mantiene** il corso. Gli studenti lo seguono sulla piattaforma Moodle, dove ogni capitolo è una pagina e ogni checkpoint un archivio allegato.

> Tutti i dati di LipariBank (cliente, IBAN, saldi, movimenti, beneficiari) sono inventati. Nessun bonifico è reale e nessun servizio esterno viene contattato.

## Che cosa contiene

```text
├── Day_00_Setup/ ... Day_09_Final_Project_Delivery/   i capitoli del corso, in Markdown
├── Extra_JavaScript_Essentials/                       modulo extra: il JavaScript che serve a React
├── Extra_Legacy_React/                                modulo extra: leggere e mantenere i Class Components
├── COURSE_MAP.md                                      mappa del corso (pubblicata anche su Moodle)
├── TEMPLATE_CAPITOLO.md                               struttura di un capitolo
├── CONVERSION_GUIDE.md                                conversione e pubblicazione su Moodle
├── moodle-links.json                                  indirizzi delle pagine Moodle, per i link tra capitoli
├── repositories/                                      i progetti di fine giornata (checkpoint)
└── scripts/                                           conversione, controlli e archivi dei checkpoint
```

## Il percorso

| Giorno | Tema | Capitoli |
|---|---|---|
| Day 0 | Setup dell'ambiente | 7 |
| Day 1 | React Fundamentals: JSX, componenti, DOM e Virtual DOM | 6 |
| Day 2 | Components e Props: composizione, liste, Fragment | 6 |
| Day 3 | State ed eventi, riconciliazione | 7 |
| Day 4 | Form, input dell'utente e `useRef` | 6 |
| Day 5 | Effects e API | 6 |
| Day 6 | Routing | 6 |
| Day 7 | Stato condiviso: da Context a Redux | 6 |
| Day 8 | Hook avanzati e architettura | 5 |
| Day 9 | Progetto finale e consegna | 7 |
| Extra | JavaScript Essentials | 8 |
| Extra | React Legacy | 7 |

Obiettivi, prerequisiti e risultato atteso di ogni giornata sono nella [mappa del corso](./COURSE_MAP.md).

Versioni di riferimento: Node.js 22 LTS, React 19, Vite 8, React Router 7 (*declarative mode*), Redux Toolkit 2 con React Redux 9, JavaScript senza TypeScript.

## Comandi

Serve Node.js 22 LTS. La prima volta, nella cartella principale:

```bash
npm install
```

| Comando | Che cosa fa |
|---|---|
| `npm run check` | Controlla tutti i capitoli: struttura, link, linguaggio dei blocchi, soluzioni, file citati |
| `npm run convert` | Converte i capitoli nell'HTML per TinyMCE, in `tinymce-html/` |
| `npm run checkpoints:verify` | Installa ed esegue lint e build di ogni checkpoint |
| `npm run checkpoints:zip` | Crea gli archivi dei checkpoint in `checkpoints-zip/` |
| `npm test` | Esegue i test degli script |

`tinymce-html/` e `checkpoints-zip/` sono generati e ignorati da Git.

## Modificare un capitolo

1. Modifica il file Markdown. La struttura è quella di [TEMPLATE_CAPITOLO.md](./TEMPLATE_CAPITOLO.md).
2. Se cambi del codice che lo studente scrive nel progetto, porta la stessa modifica nel checkpoint di quel giorno **e in tutti i successivi**: i checkpoint sono lo stato del progetto alla fine di ogni giornata e devono coincidere con i capitoli.
3. Esegui `npm run check`.
4. Converti il capitolo e ripubblicalo su Moodle, seguendo la [guida alla conversione](./CONVERSION_GUIDE.md).

## Convenzioni di scrittura

- Testo in italiano; i termini tecnici restano in inglese (`state`, `props`, `hook`).
- Solo Markdown standard: niente HTML, CSS o JavaScript nei capitoli. La grafica la applica lo script di conversione.
- Un solo titolo `#` per file; le sezioni seguono l'ordine del template.
- Ogni blocco di codice dichiara il linguaggio. Se il blocco è un file del progetto, il percorso va nel `title`: ` ```jsx title="src/App.jsx" `.
- Un blocco lungo che lo studente copia senza leggerlo riga per riga (per esempio i dati di prova) si marca con `collapse`.
- La soluzione di un esercizio sta sotto un titolo che comincia con "Soluzione".
- Checklist con `☐`.
- Prima di un blocco si dice sempre **dove** eseguire il comando o **quale file** modificare.
- I percorsi nel codice sono relativi alla cartella del progetto dello studente, `liparibank/`.
- Dati sempre fittizi, nessun segreto.

## Checkpoint

`repositories/Day_NN/` contiene il progetto com'è alla fine del giorno NN; `repositories/Extra_Legacy_React/` il laboratorio del modulo extra. Ogni cartella è un progetto Vite autonomo. Dettagli in [repositories/README.md](./repositories/README.md).
