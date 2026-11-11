# 🏦 LipariBank — Guida alla pubblicazione su Moodle

> **Destinatari:** chi deve pubblicare i contenuti del corso su una piattaforma Moodle.
> **Importante:** il comportamento di Moodle dipende dalla **versione**, dalle **funzionalità abilitate**, dai **permessi** dell'utente e dai **plugin/temi installati**. Questa guida descrive le opzioni più comuni: verifica sempre cosa è disponibile sulla tua installazione.

---

## 1. Markdown e HTML: che differenza c'è

- I file dei capitoli sono scritti in **Markdown** (`.md`): testo semplice con una sintassi leggera (`#` per i titoli, `-` per gli elenchi, ``` per i blocchi di codice).
- Moodle mostra agli studenti **HTML**. Il Markdown deve quindi essere interpretato (renderizzato) in qualche punto della catena: da Moodle stesso, da un plugin o da uno strumento esterno che lo converte prima della pubblicazione.
- **Non assumere** che Moodle trasformi automaticamente un file `.md` caricato in una pagina didattica. Un file `.md` caricato come *File* viene in genere offerto come download, non visualizzato come pagina formattata.

---

## 2. Opzioni per visualizzare il Markdown in Moodle

Valuta le opzioni in quest'ordine, in base a ciò che la tua installazione consente.

| Opzione | Come funziona | Quando conviene | Limiti |
|---|---|---|---|
| **Formato Markdown dell'editor** | Alcune installazioni offrono "Formato Markdown" nei campi di testo (es. in Pagina, Etichetta, Forum). | Se disponibile e abilitato dall'amministratore. | Disponibilità e supporto della sintassi variano per versione e configurazione. |
| **Conversione in HTML + risorsa Pagina** | Converti ogni `.md` in HTML, poi incolli l'HTML nell'editor (modalità codice/HTML) di una risorsa *Pagina*. | Opzione più portabile e controllabile. | Richiede un passaggio di conversione a ogni modifica. |
| **Plugin Markdown / renderer dedicato** | Un plugin rende il Markdown direttamente nelle risorse. | Se l'amministratore può installarlo e mantenerlo. | Dipende da plugin di terze parti e dalla compatibilità con la tua versione di Moodle. |
| **Libro (Book)** | Usa il modulo *Libro*: una cartella del corso diventa un libro, ogni capitolo un capitolo del libro. | Per mantenere la struttura Day → capitoli. | Il contenuto dei capitoli è comunque HTML (da convertire). |
| **Link a repository / sito statico** | Pubblichi i `.md` in una repository o in un sito statico e inserisci in Moodle un link (risorsa *URL*). | Se vuoi un'unica sorgente sempre aggiornata. | Gli studenti escono da Moodle; il rendering dipende dalla piattaforma esterna. |
| **File `.md` come download** | Carichi i file così come sono. | Solo come materiale di supporto. | Nessuna formattazione nel browser: non è una pagina didattica. |

---

## 3. Quando conviene convertire il Markdown in HTML

Converti in HTML quando:

- il tuo Moodle non ha un renderer Markdown;
- vuoi controllare l'aspetto finale con il tema del corso;
- hai bisogno del pulsante **Copy** sui blocchi di codice (vedi sezione 5);
- vuoi usare le risorse *Pagina* o *Libro*, che lavorano con HTML.

### Come convertire (esempi, scegline uno)

1. **Pandoc** (strumento da riga di comando). Dentro la cartella del corso:

   ```bash
   pandoc Day_01_React_Fundamentals/03_JSX.md -f gfm -t html -o 03_JSX.html
   ```

   Il formato `gfm` (GitHub Flavored Markdown) interpreta correttamente tabelle e blocchi di codice con linguaggio.

2. **Estensione o editor Markdown** che esporta in HTML (anteprima ed esportazione).
3. **Script Node.js** con una libreria Markdown (es. `markdown-it`) se devi convertire molti file in batch.

Dopo la conversione:

- apri l'HTML e verifica titoli, tabelle ed elenchi;
- copia solo il contenuto del `<body>` nell'editor HTML di Moodle (modalità codice sorgente), non l'intero documento.

> 💡 **Remember**
>
> Rigenera l'HTML ogni volta che modifichi il `.md`. Il Markdown è la sorgente di verità: non modificare a mano l'HTML pubblicato.

---

## 4. Come preservare i blocchi di codice

I capitoli usano blocchi *fenced* con il linguaggio indicato, ad esempio:

````text
```jsx
function Example() {
  return <section>LipariBank</section>;
}
```
````

Per preservarli su Moodle:

- converti con un renderer che produce `<pre><code class="language-jsx">…</code></pre>`: l'indicazione del linguaggio resta nella classe CSS e può essere usata da tema o plugin per la colorazione della sintassi;
- **non incollare il codice in un editor visuale (WYSIWYG)** senza verificare: l'editor può convertire gli spazi, sostituire le virgolette con quelle tipografiche (`“ ”`) o rimuovere l'indentazione, rendendo il codice non eseguibile;
- usa sempre la **modalità codice sorgente (HTML)** dell'editor per incollare l'HTML generato;
- verifica che i caratteri `<`, `>` e `&` nel JSX appaiano corretti (nell'HTML devono essere `&lt;`, `&gt;`, `&amp;` dentro `<code>`: i convertitori lo fanno in automatico);
- copia a campione uno snippet dalla pagina Moodle, incollalo in VS Code ed esegui `npm run dev` per assicurarti che il codice funzioni.

---

## 5. Il pulsante Copy: da cosa dipende

**Markdown standard non definisce alcun pulsante di copia.** Nei capitoli esistono solo blocchi di codice ben formattati: nessuna icona finta che simuli un pulsante.

La presenza di un pulsante **Copy** sui blocchi di codice dipende da **uno** di questi elementi:

- il **renderer** Markdown/HTML usato (alcuni lo aggiungono automaticamente);
- il **tema** di Moodle (alcuni temi lo includono per i blocchi `<pre>`);
- un **plugin** compatibile con la tua versione di Moodle (es. plugin di evidenziazione del codice o filtri).

Come procedere:

1. Chiedi all'amministratore Moodle se tema o plugin installati offrono il pulsante Copy per i blocchi di codice.
2. Se sì, verifica su una pagina di prova che compaia sui blocchi `<pre><code>`.
3. Se no, chiedi se può essere abilitato: è una modifica a livello di sito, non dei file Markdown.
4. In assenza di pulsante, gli studenti possono comunque selezionare e copiare il codice: i blocchi sono stati scritti per essere copiabili così come sono (un obiettivo per blocco, nessun commento esplicativo dentro i comandi).

### Perché non inserire JavaScript inline nei capitoli

- Il **Markdown** non deve dipendere da script: deve restare leggibile ovunque (editor, repository, anteprime, esportazioni).
- Moodle **filtra o rimuove** `<script>` e attributi `onclick` dai contenuti per ragioni di sicurezza (protezione XSS): gli script inline spesso non funzionano e, quando funzionano, indicano un'impostazione di sicurezza permissiva da evitare.
- Uno script scritto per una piattaforma o un tema specifico si rompe quando cambiano versione o tema.
- Un pulsante realizzato nel contenuto e non nel tema sarebbe incoerente tra i capitoli e difficile da mantenere.

La funzione Copy va configurata **una volta**, a livello di renderer, tema o plugin.

---

## 6. Come organizzare le cartelle come sezioni e capitoli Moodle

Mappatura suggerita (adattala alla struttura del tuo corso):

| Struttura del corso | In Moodle |
|---|---|
| Cartella `Day_XX_...` | **Sezione** del corso (o *Libro* dedicato) |
| File `NN_...md` | **Pagina** (o **capitolo** del Libro) |
| `Extra_JavaScript_Essentials/` | Sezione separata, dichiarata come "da consultare prima o durante il corso" |
| `README.md` e `COURSE_MAP.md` | Pagina introduttiva nella sezione iniziale |

Procedura consigliata:

1. Crea le sezioni nell'ordine di fruizione: **Day 0 → Extra JavaScript (consultabile prima o durante) → Day 1 → … → Day 9**.
2. Nelle sezioni usa la **numerazione dei file** (`01_`, `02_`, …) per mantenere l'ordine dei capitoli.
3. Per ogni capitolo crea una *Pagina* (o un capitolo di *Libro*) con titolo uguale al titolo del file.
4. Facoltativo: configura il **completamento attività** (es. "visualizza la pagina") per tracciare l'avanzamento.
5. Pubblica `COURSE_MAP.md` come pagina di orientamento all'inizio del corso.

---

## 7. Come aggiungere link a repository e risorse esterne

- I capitoli contengono i segnaposto `[DA CONFIGURARE: inserire URL reale della repository]` e `[DA CONFIGURARE: inserire nome reale del branch]`: **sostituiscili** con i valori reali **prima** di pubblicare.
- Cerca tutti i segnaposto con questo comando, dentro la cartella `LipariBank-React-Academy/`:

  ```bash
  grep -rn "DA CONFIGURARE" .
  ```

  In PowerShell:

  ```powershell
  Select-String -Path .\*\*.md -Pattern "DA CONFIGURARE"
  ```

- Nei link Markdown usa URL assoluti (`https://…`) per le risorse esterne. I link relativi tra capitoli (`../Day_02_…/01_….md`) funzionano su repository e visualizzatori Markdown, ma **non** tra pagine Moodle: dopo la conversione, sostituiscili con link alle pagine Moodle corrispondenti (o con link a risorse *URL*).
- In alternativa usa in Moodle il filtro "link automatici" o l'icona link dell'editor, apri in **nuova finestra** i link esterni.
- Se usi una repository starter, indicane nome e branch nella pagina del relativo checkpoint (Day 4, 5, 6, 9).

---

## 8. Controllo della formattazione su desktop e mobile

Dopo la pubblicazione di ogni sezione:

- ☐ I titoli (`#`, `##`, `###`) hanno una gerarchia visiva chiara.
- ☐ Gli elenchi puntati e numerati sono corretti (nessun elenco "schiacciato" in un paragrafo).
- ☐ Le tabelle sono leggibili; su mobile sono scorrevoli o non escono dallo schermo.
- ☐ I blocchi di codice mantengono indentazione e caratteri; le righe lunghe scorrono orizzontalmente senza rompere il layout.
- ☐ Le virgolette nel codice sono quelle dritte (`"` e `'`), non quelle tipografiche.
- ☐ Le emoji nei titoli sono visibili (altrimenti il testo resta comunque comprensibile).
- ☐ I link interni e le immagini funzionano.
- ☐ Un blocco di codice copiato da Moodle funziona se incollato in VS Code.
- ☐ Se il pulsante Copy è previsto dal tema, compare su tutti i blocchi.

Come testare:

1. Apri la pagina su **desktop** e su **smartphone** (anche con gli strumenti per sviluppatori del browser, modalità dispositivo).
2. Controlla almeno un capitolo ricco di codice (es. `Day_04_Forms_User_Input/04_Submit_e_Feedback.md`), uno con tabelle e uno con elenchi lunghi.
3. Prova con un account **studente** (non solo amministratore): permessi e filtri possono cambiare la resa.

---

## 9. Checklist finale di pubblicazione

- ☐ Segnaposto `DA CONFIGURARE` sostituiti (o consapevolmente lasciati).
- ☐ Ordine delle sezioni: Day 0, Extra, Day 1 … Day 9.
- ☐ Link interni convertiti in link Moodle.
- ☐ Blocchi di codice verificati.
- ☐ Funzione Copy verificata (se prevista) oppure studenti informati che si copia manualmente.
- ☐ Anteprima desktop e mobile controllata con un account studente.
