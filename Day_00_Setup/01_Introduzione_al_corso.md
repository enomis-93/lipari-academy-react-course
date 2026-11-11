# 🏦 LipariBank — React Zero to Hero

> **Day 0 · Capitolo 01**
> **Argomento:** Introduzione al corso
> **Durata stimata:** 20 minuti
> **Parte di LipariBank:** nessun codice in questo capitolo: presentiamo il progetto e il percorso

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- descrivere cosa saprai fare al termine del corso e come è organizzato il percorso (Day 0, Extra, Day 1-9);
- verificare di avere i prerequisiti necessari per partire;
- spiegare come usare i capitoli, gli esercizi e i checkpoint;
- descrivere il progetto LipariBank e come evolve giorno dopo giorno.

---

## 📋 Prerequisiti
Per seguire il corso servono:

- conoscenze di base di programmazione (variabili, funzioni, cicli, condizioni) in un qualsiasi linguaggio;
- nozioni elementari di HTML e CSS (tag, attributi, classi, selettori semplici);
- un computer Windows, macOS o Linux su cui puoi installare software;
- una connessione a Internet e un account GitHub (gratuito, lo creerai nel capitolo 04);
- circa 4-6 ore di lavoro per ogni Day.

Non servono conoscenze pregresse di React. Se JavaScript moderno (arrow function, `map`, destructuring, `import`/`export`, `async/await`) non ti è familiare, usa la sezione [Extra JavaScript Essentials](../Extra_JavaScript_Essentials/01_Variables_Types.md) prima o durante il corso.

---

## 🧭 In questo capitolo
- gli obiettivi del corso;
- la struttura: Day 0, Extra, Day 1-9;
- la metodologia e come usare ogni capitolo;
- la presentazione di LipariBank, il progetto unico del corso;
- le regole di lavoro (versioni, dati fittizi, cartelle).

---

## 🧠 Theory

### Cosa imparerai
Il corso porta da zero a un'applicazione React completa. Al termine saprai:

- capire la struttura di un'applicazione React e scrivere interfacce con JSX e Function Components;
- gestire props, state, eventi, liste e rendering condizionale;
- realizzare form con validazione;
- recuperare dati in modo asincrono (`fetch`) e gestire loading, errori e assenza di dati;
- usare React Router per la navigazione tra pagine;
- organizzare il progetto in componenti, hooks, servizi e moduli; usare Context, `useReducer` e custom hooks;
- leggere e manutenere codice legacy con Class Components;
- lavorare con Git e GitHub e consegnare un'applicazione documentata.

### Struttura del corso

| Sezione | Cartella | Contenuto |
|---|---|---|
| Day 0 | `Day_00_Setup/` | Ambiente: Node, VS Code, Git, Vite, primo progetto |
| Extra | `Extra_JavaScript_Essentials/` | JavaScript necessario per React, da consultare quando serve |
| Day 1 | `Day_01_React_Fundamentals/` | JSX, Function Components, composizione, prima dashboard |
| Day 2 | `Day_02_Components_Props/` | Props, children, liste, rendering condizionale, conti |
| Day 3 | `Day_03_State_Events/` | Eventi, `useState`, immutabilità, lifting state up |
| Day 4 | `Day_04_Forms_User_Input/` | Controlled components, validazione, bonifico simulato e useRef |
| Day 5 | `Day_05_Effects_API/` | `useEffect`, `fetch`, loading/error/empty |
| Day 6 | `Day_06_Routing/` | React Router, rotte dinamiche, 404, nested routes |
| Extra | `EXTRA_Legacy_React/` | Facoltativo: Class Components e codice legacy |
| Day 7 | `Day_07_Advanced_React_Architecture/` | Context, reducer, custom hooks, memoization, service layer e Redux Toolkit |
| Day 8 | `Day_08_Final_Project/` | Progetto finale: requisiti, architettura, piano |
| Day 9 | `Day_09_Delivery/` | Refactoring, test manuali, build, deploy, consegna |

La mappa completa dei capitoli è in [COURSE_MAP.md](../COURSE_MAP.md).

### Metodologia
Ogni capitolo segue lo stesso ritmo: **Spiega → Mostra → Fai provare → Verifica → Collega**. Le sezioni sono sempre le stesse:

1. **Obiettivo, Prerequisiti, In questo capitolo**: cosa otterrai e da quale stato del progetto parti;
2. **Theory**: la teoria essenziale, senza digressioni;
3. **Let's Code**: un esempio guidato da scrivere e provare;
4. **LipariBank in action**: l'applicazione concreta al progetto;
5. **Your Turn**: un esercizio con requisiti verificabili;
6. **Common Mistakes, Checklist, Challenge, Recap**: errori tipici, autovalutazione, estensione facoltativa, riepilogo;
7. **Next**: il capitolo successivo.

> 💡 **Remember**
>
> Scrivi il codice a mano invece di limitarti a leggerlo: gli errori che incontri sono parte dell'apprendimento. Copia e incolla i soli comandi e le configurazioni lunghe.

### Regole del corso
- **Linguaggio:** JavaScript (non TypeScript). Function Components e Hooks per lo sviluppo nuovo; le classi si approfondiscono nell'extra React Legacy e sono usate per l'Error Boundary del Day 7.
- **Versioni di riferimento:** Node.js 22 LTS, React 19, Vite 8, React Router 7 (modalità declarative). Le versioni esatte installate sono in `package.json`.
- **Dati:** tutti i dati bancari sono fittizi. Non inserire mai dati reali, credenziali o token nel codice o nei commit.
- **Cartelle:** i percorsi nei capitoli (es. `src/components/Header.jsx`) sono sempre relativi alla cartella del progetto `liparibank/`. Per ogni comando viene indicata la cartella da cui lanciarlo.

---

## 💻 Let's Code
In questo capitolo non scrivi codice, ma prepari la cartella di lavoro che useremo in tutto il corso. Scegli un percorso semplice, senza spazi e fuori da cartelle sincronizzate (OneDrive, Dropbox), per esempio:

- Windows: `C:\Users\<NOME_UTENTE>\corso-react`
- macOS / Linux: `~/corso-react`

Crea la cartella dal terminale. In PowerShell (Windows):

```powershell
mkdir $HOME\corso-react
```

In Terminal (macOS / Linux):

```bash
mkdir -p ~/corso-react
```

`<NOME_UTENTE>` è il tuo utente del sistema operativo. Nei capitoli successivi la chiameremo `corso-react/`: dentro creerai il progetto `liparibank/` (capitolo 05).

---

## 🏦 LipariBank in action
**LipariBank** è una banca fittizia. Costruirai passo dopo passo il suo home banking: un'unica applicazione che cresce durante tutto il corso. Non ci sono esercizi scollegati: ogni capitolo migliora una parte di LipariBank.

Il dominio usa questi concetti: **Customer** (cliente), **Account** (conto), **Balance** (saldo), **Transaction** (movimento), **Beneficiary** (beneficiario), **Transfer** (bonifico), **Dashboard** (riepilogo) e **Settings** (impostazioni).

Dati di esempio usati nel corso (tutti inventati):

```text
Cliente:     Mario Rossi
Conto:       IT00 0000 0000 0000 0000 0000 000
Saldo:       4.250,75 €
Movimenti:   Stipendio, Pagamento utenza luce, Spesa supermercato
Beneficiari: Giulia Bianchi, Luca Verdi
```

Come evolve il progetto:

| Day | Cosa aggiungi a LipariBank |
|---|---|
| 0 | Progetto Vite con una prima pagina minima "LipariBank" |
| 1 | Prima dashboard statica: header, saldo, ultimi movimenti |
| 2 | Componenti riutilizzabili per conti e movimenti |
| 3 | Interazioni: selezione conto, filtri, mostra/nascondi saldo |
| 4 | Form per un bonifico simulato con validazione |
| 5 | Caricamento asincrono dei movimenti (loading, errore, vuoto) |
| 6 | Navigazione tra dashboard, conti, movimenti e bonifico |
| 7 | Lettura e migrazione di un modulo legacy con Class Components |
| 8 | Refactoring: Context, reducer, custom hooks, service layer |
| 9-10 | Progetto finale, test, documentazione e consegna |

Nessuna operazione è reale: nessun backend bancario, nessuna autenticazione vera, nessun servizio esterno.

---

## 🧪 Your Turn
**Obiettivo:** preparare il tuo piano di lavoro e la cartella di lavoro.

**Requisiti:**
1. Crea la cartella `corso-react` nel percorso scelto (senza spazi, fuori da OneDrive/Dropbox).
2. Leggi [COURSE_MAP.md](../COURSE_MAP.md) e individua in quali Day pensi di avere più difficoltà.
3. Decidi se partire dall'[Extra JavaScript](../Extra_JavaScript_Essentials/01_Variables_Types.md) o affrontarlo "al bisogno".
4. Scrivi (su carta o in un file di testo fuori dal corso) quanti blocchi di studio svolgerai ogni giorno.

**Risultato atteso:** la cartella `corso-react` esiste e hai un piano di studio con i giorni previsti.

**Criteri di completamento:** sai rispondere a "cosa costruisco al Day 4?" e "dove trovo il JavaScript di base?" senza rileggere il capitolo.

---

## ⚠️ Common Mistakes
- **Saltare Day 0:** quasi tutti i problemi dei Day successivi nascono da un ambiente configurato male. Completa anche [la verifica finale](./06_Verifica_ambiente.md).
- **Cartella di lavoro in OneDrive o con spazi/accenti nel percorso:** causa errori di permessi e percorsi con `npm`. Usa un percorso semplice.
- **Copiare senza capire:** se un esempio funziona ma non sai spiegarlo, rileggi la sezione Theory prima di proseguire.
- **Confondere versioni:** gli esempi sono coerenti con React 19 e Vite 8. Tutorial trovati online con versioni diverse possono usare API differenti.

---

## ✅ Checklist
- ☐ Ho conoscenze di base di programmazione, HTML e CSS.
- ☐ So come è organizzato il corso (Day 0, Extra, Day 1-9).
- ☐ Ho letto la struttura di un capitolo e so cosa trovo in ogni sezione.
- ☐ So cos'è LipariBank e come evolve.
- ☐ Ho creato la cartella `corso-react`.

---

## 🚀 Challenge
Disegna a mano una dashboard bancaria con: nome cliente, saldo totale, elenco degli ultimi movimenti. Conserva il disegno: al Day 1 lo confronterai con la tua prima dashboard.

---

## 📌 Recap
- Il corso porta da zero a un'app React completa in Day 0 + 9 giorni, con due sezioni Extra facoltative.
- Tutti gli esempi ruotano attorno a un solo progetto: **LipariBank**, una banca fittizia.
- Si usano JavaScript, Function Components e Hooks; le classi si approfondiscono nell'extra React Legacy e si usano per l'Error Boundary del Day 7.
- Ogni capitolo ha lo stesso ritmo e la stessa struttura; i dati sono sempre fittizi.

---

### ➡️ Next
[Capitolo 02 — Node.js e npm](./02_Node_NPM.md): installerai Node.js 22 LTS e verificherai che `node` e `npm` funzionino.
