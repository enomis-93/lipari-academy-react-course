# Guida alla conversione per Moodle (TinyMCE)

I capitoli del corso si scrivono in Markdown. Uno script li converte nell'HTML da incollare nell'editor TinyMCE di Moodle, applicando la grafica descritta in questa guida. **Il Markdown è l'unica sorgente**: l'HTML si rigenera, non si modifica a mano.

## Uso rapido

Serve Node.js 22 LTS. Nella cartella principale della repository, la prima volta:

```bash
npm install
```

Per convertire tutto il corso:

```bash
npm run convert
```

Per convertire una sola cartella o un solo capitolo:

```bash
npm run convert -- --source Day_03_State_Events
```

```bash
npm run convert -- --source Day_01_React_Fundamentals/03_JSX.md
```

Il risultato è in `tinymce-html/`, con la stessa struttura delle cartelle del corso e un file `.html` per ogni `.md`. La cartella è ignorata da Git: si rigenera quando serve.

Vengono convertiti i capitoli delle cartelle `Day_*` ed `Extra_*` e la mappa del corso (`COURSE_MAP.md`). Gli altri documenti della repository non fanno parte del corso.

## Pubblicare un capitolo su Moodle

1. Apri `tinymce-html/<cartella>/<capitolo>.html` in un editor di testo e copia tutto il contenuto.
2. Su Moodle apri la risorsa in modifica. Nell'editor scegli **Strumenti → Codice sorgente** (*Tools → Source code*).
3. Sostituisci il contenuto esistente con quello copiato e conferma.
4. Salva, poi apri la pagina come la vede uno studente.

Che cosa controllare dopo il primo salvataggio:

| Controllo | Esito atteso |
|---|---|
| Blocchi di codice | Pannello scuro, codice colorato, indentazione intatta |
| Pulsante **Copy** | Copia il codice e mostra "✓ Copiato" per un momento |
| Blocchi lunghi | Sono richiudibili con un clic sulla barra |
| Soluzioni | Sono chiuse e si aprono con un clic |
| Tabelle | Scorrono in orizzontale su schermi stretti, senza allargare la pagina |
| Link agli altri capitoli | Aprono la pagina giusta (vedi "Link tra i capitoli") |

Se il pulsante Copy o gli accordion non funzionano dopo il salvataggio, vedi "Limiti noti".

## Che cosa produce lo script

### Pagina

Ogni pagina è un solo contenitore con stili **inline**. TinyMCE su Moodle non conserva i fogli di stile né le classi usate per l'aspetto, quindi non ci sono tag `<style>` e ogni elemento porta il proprio stile.

| Elemento del Markdown | Risultato |
|---|---|
| Titolo `#` e riquadro dei metadati che lo segue | Un pannello di intestazione azzurro |
| Titoli `##`, `###`, `####` | Titoli blu, il `##` con una linea sotto |
| Tabelle | Intestazione scura, righe alternate, scorrimento orizzontale |
| Citazione `> 💡 **Remember**` | Riquadro azzurro |
| Citazione `> ⚠️ ...` | Riquadro arancione |
| Citazione `> ✅ ...` | Riquadro verde |
| Altre citazioni | Riquadro grigio |
| Elenco di righe `☐` | Riquadro della checklist |
| Sezione `### ➡️ Next` | Pannello scuro di chiusura |
| Codice `inline` | Sfondo grigio chiaro, carattere a larghezza fissa |

### Blocchi di codice

Ogni blocco diventa un pannello scuro con una barra in alto: a sinistra il nome del file (se indicato) e il linguaggio, a destra il pulsante **Copy**. Il codice è colorato con [Shiki](https://shiki.style/) e i colori sono scritti inline, uno `<span>` per ogni elemento.

Sulla riga di apertura del blocco si possono aggiungere due indicazioni:

````markdown
```jsx title="src/components/Header.jsx"
```

```javascript title="src/data/mockData.js" collapse
```
````

| Indicazione | Effetto |
|---|---|
| `title="percorso/del/file"` | Il percorso compare nella barra del blocco |
| `collapse` | Il blocco è richiudibile e parte **chiuso** |

Un blocco con più di 20 righe diventa richiudibile da solo: parte aperto, tranne il CSS, che parte chiuso. `collapse` serve per i blocchi che lo studente deve copiare ma non leggere riga per riga, come i dati di prova.

I linguaggi riconosciuti sono `jsx`, `javascript`, `bash`, `powershell`, `css`, `json`, `html`, `markdown`, `diff` e `text`. Un linguaggio diverso finisce tra gli avvisi del report.

### Soluzioni

Tutto ciò che sta sotto un titolo che comincia con **Soluzione** (per esempio `### Soluzione di riferimento`) viene racchiuso in un accordion chiaro, chiuso: lo studente lo apre dopo aver provato. L'accordion finisce al titolo successivo dello stesso livello o di livello superiore, oppure alla prima riga di separazione `---`.

### Il pulsante Copy

TinyMCE elimina gli attributi `onclick`. Per questo il pulsante si riconosce dalla classe `copy-code-btn` e in fondo a ogni pagina c'è un piccolo `<script>` che gestisce il clic per tutta la pagina. Lo script si installa una volta sola, anche se la pagina contiene più contenuti convertiti.

## Link tra i capitoli

Nei file Markdown i link sono relativi (`../Day_02_Components_Props/02_Props.md`) e funzionano su GitHub e nell'anteprima dell'editor. Su Moodle ogni capitolo è una pagina con un proprio indirizzo, che lo script non può conoscere.

Gli indirizzi si scrivono in `moodle-links.json`, una riga per capitolo: a sinistra il percorso del file nella repository, a destra l'indirizzo della pagina su Moodle.

```json
{
  "Day_01_React_Fundamentals/03_JSX.md": "https://dev-academy.liparipeople.com/mod/page/view.php?id=0000",
  "COURSE_MAP.md": "https://dev-academy.liparipeople.com/course/view.php?id=120"
}
```

- Un link che ha una voce nel file diventa un link alla pagina Moodle.
- Un link **senza** voce diventa testo in grassetto, non un link rotto, ed è elencato nel report.
- I link esterni (`https://...`) restano invariati.

Il file si può compilare un po' alla volta: man mano che crei le pagine su Moodle aggiungi la riga e rilanci la conversione.

## Il report

Ogni conversione scrive `tinymce-html/conversion-report.md` con:

- i link ancora da collegare, capitolo per capitolo;
- gli altri avvisi, per esempio un blocco di codice con un linguaggio non riconosciuto;
- l'elenco dei capitoli convertiti.

Lo script non corregge e non riassume: testo e codice passano invariati. Un problema del contenuto si corregge nel Markdown.

## Prima di convertire

```bash
npm run check
```

Il controllo legge tutti i capitoli e segnala: sezioni del template mancanti o fuori ordine, link relativi rotti, segnaposto dimenticati, blocchi di codice senza linguaggio, soluzioni senza un titolo "Soluzione", file citati che non esistono in nessun checkpoint. Deve terminare con "Nessun problema".

## Checkpoint

I progetti di fine giornata sono in `repositories/`. Gli studenti li ricevono come archivi allegati alle giornate su Moodle.

```bash
npm run checkpoints:verify
```

Copia ogni checkpoint in una cartella temporanea, installa le dipendenze ed esegue lint e build. Richiede qualche minuto e la connessione di rete.

```bash
npm run checkpoints:zip
```

Crea in `checkpoints-zip/` un archivio per checkpoint (`liparibank-day-01.zip` ... `liparibank-day-09.zip`, `liparibank-extra-legacy.zip`), senza `node_modules` e `dist`. Ogni archivio contiene una sola cartella con lo stesso nome dell'archivio.

## Cambiare la grafica

| Che cosa | Dove |
|---|---|
| Colori, margini, caratteri, soglia delle 20 righe | `scripts/lib/theme.mjs` |
| Pannello del codice e accordion | `scripts/lib/fence.mjs` |
| Regole di conversione degli elementi | `scripts/lib/render.mjs` |
| Colorazione del codice | `scripts/lib/highlight.mjs` |
| Comportamento del pulsante Copy | `scripts/lib/copy-script.mjs` |

Dopo una modifica:

```bash
npm test
```

## Limiti noti

- **Il filtro di Moodle può essere più severo dell'editor.** L'editor accetta `<details>`, `<summary>`, gli attributi `data-*` e il tag `<script>`. Che il **salvataggio** li conservi dipende dalla configurazione del sito e dai permessi di chi pubblica. Va verificato una volta, salvando un capitolo e riaprendolo: se gli accordion spariscono o il pulsante Copy non risponde, il contenuto resta comunque leggibile e copiabile a mano, e il problema va segnalato a chi amministra la piattaforma.
- **Il pulsante Copy usa gli appunti del browser**, disponibili solo sulle pagine servite in HTTPS.
- **Le immagini** conservano il percorso scritto nel Markdown: vanno caricate su Moodle e collegate a mano.
- **Le ancore interne** (`#titolo`) non vengono generate: i link a una sezione della stessa pagina diventano testo.
