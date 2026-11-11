# 🏦 LipariBank — React Zero to Hero

> **Day 9 · Capitolo 06**
> **Argomento:** Consegna Finale
> **Durata stimata:** 45 minuti
> **Parte di LipariBank:** verifica finale, pacchetto di consegna e chiusura del corso

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- eseguire la verifica finale su un **clone pulito** della tua repository;
- completare la checklist di consegna (codice, qualità, documentazione, sicurezza);
- compilare il modulo di consegna con repository, branch, README ed eventuale deploy;
- valutare il tuo lavoro rispetto ai requisiti e individuare i prossimi passi.

---

## 📋 Prerequisiti
- Tutti i capitoli del [Day 9](./01_Refactoring_Finale.md) completati: refactoring, test manuali, accessibilità, build/env, README.
- Requisiti Must del [Day 8](../Day_08_Final_Project/02_Requirements_Funzionali.md) soddisfatti.
- Repository sul tuo account GitHub con tutto il lavoro pubblicato.

---

## 🧭 In questo capitolo
- Verifica finale su clone pulito.
- Checklist di consegna.
- Formato di consegna con segnaposto.
- Autovalutazione per requisito.
- Chiusura del corso e prossimi passi.

---

## 🧠 Theory

Consegnare non significa "caricare i file": significa che **un'altra persona può ottenere lo stesso risultato che vedi tu**. Per questo la verifica finale si fa su una copia nuova del repository, dove non esistono file "che sulla mia macchina c'erano": `node_modules` assente, `.env` assente, `dist/` assente.

Tre domande guida:
1. **Funziona da zero?** (clone → install → dev/build)
2. **È completo?** (requisiti Must, documentazione)
3. **È sicuro e pulito?** (nessun segreto, nessun file inutile)

> 💡 **Remember**
>
> Dichiara solo ciò che hai verificato. Un deploy non eseguito si scrive "non eseguito": è una risposta corretta, un link inventato no.

---

## 💻 Let's Code

### Verifica su clone pulito
Esegui da una cartella di lavoro **diversa** da quella del progetto (per esempio una cartella nuova accanto alla tua). Sostituisci `<URL_REPOSITORY>` con l'URL reale della **tua** repository (nel modulo sotto lo trovi come segnaposto) e `<NOME_BRANCH>` con il branch che consegni:

```bash
git clone <URL_REPOSITORY> liparibank-verifica
```

```bash
cd liparibank-verifica
```

```bash
git switch <NOME_BRANCH>
```

Se `package.json` si trova in una sottocartella (per esempio `liparibank/`), entraci prima di proseguire.

Installa le dipendenze **esattamente come da lockfile**:

```bash
npm ci
```

`npm ci` richiede che `package-lock.json` sia nel repository: se fallisce per questo motivo, committalo nella repo originale. Poi:

```bash
npm run lint
```

```bash
npm run build
```

```bash
npm run preview
```

Apri l'indirizzo che il terminale stampa (di default `http://localhost:4173/`) ed esegui il **percorso breve di accettazione**:

| Passo | Atteso |
|---|---|
| `/` | saldo totale `17.050,75 €`, 5 movimenti |
| `/accounts/acc-001` | dettaglio Conto Corrente |
| `/transactions` → "utenza" + "Uscite" | 2 movimenti |
| `/transfer` → 5.000,00 € dal Conto Corrente | errore, nessun movimento |
| `/transfer` → 100,00 € a Giulia Bianchi | conferma, saldo Conto Corrente `4.150,75 €` |
| `/non-esiste` | pagina 404 |
| F5 su `/transactions` | pagina riaperta correttamente |

Poi controlla la sicurezza dalla cartella del clone:

```bash
git ls-files .env node_modules dist
```

Nessun output = nessun file sensibile o generato tracciato. Per cercare valori sospetti nei sorgenti (PowerShell):

```powershell
Get-ChildItem src -Recurse -Include *.js,*.jsx | Select-String -Pattern "password|token|secret|apikey" -CaseSensitive:$false
```

Su macOS/Linux:

```bash
grep -rniE "password|token|secret|apikey" src
```

Eventuali risultati vanno letti: nomi come `tokenize` o testi di interfaccia sono innocui; **chiavi o credenziali reali no**, e se ne trovi una nella storia di Git considerala compromessa e cambiala.

Al termine puoi cancellare la cartella `liparibank-verifica` (è una copia).

---

## 🏦 LipariBank in action

### Checklist finale di consegna

**Funzionalità**
- ☐ Tutti i requisiti **Must** (REQ-01…REQ-05, REQ-07…REQ-11) soddisfatti.
- ☐ I Should (REQ-06, REQ-12, REQ-13) fatti o motivati nel README.
- ☐ Dashboard, conti, movimenti con filtri, bonifico simulato, navigazione e 404 funzionano.
- ☐ Loading, errore e assenza dati gestiti in ogni pagina con dati.

**Qualità del codice**
- ☐ `npm run lint` senza errori né warning.
- ☐ `npm run build` senza errori.
- ☐ Nessun `console.log`, `debugger`, import o file inutilizzato.
- ☐ Nessuna logica di business duplicata (filtro, saldo).
- ☐ Nomi chiari e struttura di cartelle coerente con l'[Architettura](../Day_08_Final_Project/03_Architettura.md).

**Test e UX**
- ☐ Test manuali eseguiti; `docs/TEST_REPORT.md` compilato.
- ☐ Caso "importo oltre il saldo" verificato.
- ☐ Uso completo da tastiera; label sui campi; feedback in live region.
- ☐ Layout verificato a 360 px, 768 px e desktop.

**Sicurezza e configurazione**
- ☐ `.env` ignorato da Git; `.env.example` committato.
- ☐ Nessun segreto nel codice, nei file o nella storia.
- ☐ `node_modules/` e `dist/` non tracciati.

**Documentazione e Git**
- ☐ `README.md` completo e verificato con clone pulito.
- ☐ Nessun `[DA CONFIGURARE: ...]` residuo non intenzionale.
- ☐ Storia dei commit leggibile (Conventional Commits).
- ☐ Branch di consegna pubblicato sul remote; `main` aggiornato.
- ☐ Tag finale creato (suggerito: `checkpoint-7-final`).

Per creare e pubblicare il tag finale sulla **tua** repository (dentro `liparibank/`):

```bash
git tag -a checkpoint-7-final -m "Consegna finale LipariBank"
```

```bash
git push origin checkpoint-7-final
```

### Formato di consegna
Compila questo modulo (copialo in un file di testo o nel campo di consegna richiesto dal corso). Sostituisci i segnaposto con i valori reali; lascia il segnaposto del deploy solo se non lo hai eseguito, scrivendo "non eseguito".

```text
CONSEGNA FINALE — LipariBank (React Zero to Hero)

Nome e cognome: [DA CONFIGURARE: nome e cognome]
Repository: [DA CONFIGURARE: inserire URL reale della repository]
Branch consegnato: [DA CONFIGURARE: inserire nome reale del branch]
Tag finale (se creato): [DA CONFIGURARE: nome del tag, es. checkpoint-7-final]
README: README.md nella radice della repository
Report di test: docs/TEST_REPORT.md
Deploy statico (facoltativo): [DA CONFIGURARE: inserire URL del deploy, oppure scrivere "non eseguito"]

Requisiti Must soddisfatti: [DA CONFIGURARE: es. 10 su 10]
Should realizzati: [DA CONFIGURARE: elenco REQ]
Limiti noti: [DA CONFIGURARE: elenco breve]
```

### Autovalutazione per requisito
Per ogni riga, scrivi ✅ (verificato), 🟡 (parziale) o ❌ (assente), con una nota.

| Requisito | Priorità | Esito | Nota |
|---|---|---|---|
| REQ-01 Dashboard | Must | | |
| REQ-02 Elenco conti | Must | | |
| REQ-03 Dettaglio conto | Must | | |
| REQ-04 Elenco movimenti | Must | | |
| REQ-05 Filtri tipo/testo | Must | | |
| REQ-06 Filtro per conto | Should | | |
| REQ-07 Form con validazione | Must | | |
| REQ-08 Feedback ed effetto del bonifico | Must | | |
| REQ-09 Navigazione e 404 | Must | | |
| REQ-10 Loading/errore/vuoto | Must | | |
| REQ-11 Componenti riutilizzabili | Must | | |
| REQ-12 Saldo nascosto persistente | Should | | |
| REQ-13 Error Boundary | Should | | |
| REQ-14 Preferito su un movimento | Could | | |
| REQ-15 Modalità compatta Redux | Must | | |
| REQ-16 Focus sull'importo | Must | | |
| REQ-17 (tuo, se l'hai scritto nel Day 8) | Could | | |
| NFR-01…05 Lint, build, a11y, responsive, segreti | Must/Should | | |

---

## 🧪 Your Turn

**Obiettivo:** consegnare un progetto verificato, documentato e riproducibile.

**Requisiti**
1. Esegui la **verifica su clone pulito** e il percorso breve di accettazione: tutto ✅.
2. Completa la checklist finale: nessuna casella lasciata vuota senza motivo scritto.
3. Compila l'autovalutazione per requisito.
4. Crea il tag finale e pubblica il branch.
5. Compila il modulo di consegna e inoltralo nel canale previsto dal corso.

**Passi suggeriti**
- Se qualcosa fallisce nel clone pulito, correggi nella repo originale, committa, pubblica e **ripeti** la verifica.
- Rileggi il README con gli occhi di uno sconosciuto.

**Risultato atteso:** un repository che si installa, si avvia e supera il percorso di accettazione con i soli comandi del README.

**Criteri di completamento:** clone pulito verde; checklist completa; modulo compilato con valori reali o segnaposto intenzionali.

---

## ⚠️ Common Mistakes
- **Verificare solo nella cartella di sviluppo**: là esistono `node_modules` e `.env` che il revisore non ha.
- **`package-lock.json` non committato**: `npm ci` fallisce.
- **Consegnare il branch sbagliato** o non aver fatto `git push`.
- **URL inventati o segnaposto dimenticati** nel modulo.
- **Ultimo-minuto-refactoring**: modifiche non verificate nelle ultime ore. Dopo l'ultimo cambiamento riesegui lint, build e percorso di accettazione.
- **Segreti nella storia Git**: cancellare il file non basta; cambia il segreto.

---

## ✅ Checklist
- ☐ Clone pulito: `npm ci`, `npm run lint`, `npm run build`, `npm run preview` ok.
- ☐ Percorso breve di accettazione superato.
- ☐ Checklist finale completa.
- ☐ Autovalutazione compilata.
- ☐ Tag e branch pubblicati.
- ☐ Modulo di consegna inviato.

---

## 🚀 Challenge
Chiedi a un'altra persona di seguire il tuo README su un computer diverso e annota ogni punto in cui si ferma o ti fa una domanda: sono i prossimi miglioramenti della documentazione.

---

## 📌 Recap
- Si consegna ciò che si può riprodurre da un clone pulito.
- La checklist copre funzionalità, qualità, test, sicurezza e documentazione.
- Il modulo di consegna usa valori reali o segnaposto espliciti, mai link inventati.
- L'autovalutazione per requisito mostra cosa è finito e cosa resta.

---

### 🎓 Chiusura — fine del percorso

**Congratulazioni!** In dieci giorni sei passato dall'installazione di Node a un'app React multipagina con state condiviso, form validati, dati asincroni, routing, architettura a livelli, accessibilità e build di produzione. LipariBank è tua: puoi leggerla, modificarla e spiegarla.

Possibili prossimi passi (ognuno è un percorso a sé, scegli in base ai tuoi obiettivi):
- **TypeScript**: tipi statici per props, state e dati dei servizi, per intercettare errori prima dell'esecuzione.
- **Test automatici**: scrivere test dei componenti e delle funzioni pure (`validateTransfer`, `filterTransactions`) invece di soli test manuali.
- **Librerie per il data fetching**: strumenti dedicati a cache, revalidazione e stati di caricamento delle richieste, al posto di `useEffect` scritti a mano.
- **Un framework React**: soluzioni che aggiungono routing con caricamento dati, rendering lato server e convenzioni di progetto.
- **Accessibilità e performance in profondità**: approfondire WCAG, strumenti di audit e profiling.
- **Un back-end semplice**: sostituire i JSON statici con un'API tua, cambiando solo il service layer.

Torna a [Day 1](../Day_01_React_Fundamentals/01_React_e_LipariBank.md) o alla [mappa del corso](../COURSE_MAP.md) ogni volta che vuoi ripassare un argomento. Buon lavoro!
