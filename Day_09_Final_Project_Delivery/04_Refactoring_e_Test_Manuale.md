# 🏦 LipariBank — React Zero to Hero

> **Day 9 · Capitolo 04**
> **Argomento:** Refactoring e test manuale
> **Durata stimata:** 90 minuti
> **Parte di LipariBank:** revisione del codice e verifica di tutti i requisiti con casi di prova scritti

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- rivedere il tuo codice con una checklist, senza cambiarne il comportamento;
- eliminare duplicazioni, file inutilizzati e `console.log` rimasti;
- eseguire un piano di test manuali con passi, risultato atteso ed esito;
- simulare caricamento lento, errore di rete e dati vuoti;
- descrivere un difetto in modo che chiunque possa riprodurlo.

---

## 📋 Prerequisiti
- [Capitolo 01 — Brief e requisiti](./01_Brief_e_Requisiti.md): gli ID `REQ-xx` e `NFR-xx`.
- [Capitolo 03 — Git workflow](./03_Git_Workflow.md): lavori su un branch, con `git status` pulito prima di cominciare.
- Fasi 1, 2 e 3 del [piano di lavoro](./02_Architettura_e_Piano.md) completate, oppure il checkpoint `liparibank-day-09.zip` per seguire il capitolo sul codice di riferimento.

---

## 🧭 In questo capitolo
- Che cos'è il refactoring e la sua regola.
- La checklist di revisione.
- Un esempio guidato: una duplicazione e un file inutilizzato.
- Che cos'è un caso di prova.
- Il piano di test di LipariBank, collegato ai requisiti.
- Come segnalare un difetto.

---

## 🧠 Theory

### Refactoring
Fare *refactoring* significa cambiare la **struttura** del codice senza cambiarne il **comportamento osservabile**. Per questo si procede a piccoli passi, verificando dopo ciascuno: lint, build, un giro nell'app.

Che cosa cercare:

- **Duplicazione**: la stessa logica copiata in due punti. Diventa una funzione, un componente o un hook condiviso.
- **Codice morto**: file, funzioni, variabili e import che nessuno usa.
- **Nomi poco chiari**: `data`, `x`, `temp`, `handle`.
- **Componenti con troppe responsabilità**: caricano dati, filtrano e disegnano l'interfaccia tutti insieme.
- **Residui di lavoro**: `console.log`, `debugger`, codice commentato.

> 💡 **Remember**
>
> Rifattorizza solo codice che **funziona** e che sai verificare. Se durante il refactoring trovi un bug, annotalo e correggilo in un commit `fix:` separato.

### Caso di prova
Un test manuale è una **procedura ripetibile**: chiunque la esegua con gli stessi passi deve ottenere lo stesso risultato. Ogni caso di prova ha:

- un **ID** (`TC-01`, `TC-02`...);
- i **passi** da eseguire;
- un **risultato atteso** osservabile: un testo, un numero, un comportamento;
- il **requisito** che verifica;
- un **esito**: ✅ passato, ❌ fallito, ⏭ non eseguito.

Un buon piano copre sempre quattro tipi di caso: il **percorso felice** (tutto va bene), l'**input errato**, il **caso limite** (per esempio un importo uguale al saldo) e lo **stato anomalo** (caricamento, errore, assenza di dati).

> 💡 **Remember**
>
> I dati del corso sono fissi: Conto Corrente 4.250,75 €, Conto Risparmio 12.800,00 €, totale 17.050,75 €, 8 movimenti (4 entrate e 4 uscite). Se i tuoi numeri sono diversi, l'app o i file in `public/data/` non sono allineati.

---

## 💻 Let's Code

### Checklist di revisione
Percorrila sul tuo codice, una riga alla volta.

| Area | Domanda | OK? |
|---|---|---|
| Struttura | Ogni file è nella cartella prevista dall'[architettura del progetto](../Day_08_Advanced_Hooks_Architecture/04_Architettura_del_Progetto.md)? | ☐ |
| Dipendenze | Le pagine usano hook e componenti, e nessun componente di `components/` chiama `fetch` o importa da `services/`? | ☐ |
| Duplicazioni | La stessa logica compare in più pagine? | ☐ |
| State | Nessun dato derivato salvato in `useState`? Nessun dato dello store copiato nello state di una pagina? | ☐ |
| Store | Nei reducer nessuna logica che dipende dall'ora o dal caso (`Date.now()`, `nanoid()`): sta nel `prepare`? | ☐ |
| Liste | Ogni `map` ha una `key` stabile (`transaction.id`, non l'indice)? | ☐ |
| Effetti | Ogni `useEffect` ha le dipendenze corrette e la pulizia dove serve? | ☐ |
| Nomi | Componenti in PascalCase, funzioni in camelCase, gestori `handleX`, props di callback `onX`? | ☐ |
| Codice morto | Nessun import, variabile o file inutilizzato? | ☐ |
| Residui | Nessun `console.log` o `debugger`? | ☐ |
| Sicurezza | Nessun segreto nel codice? | ☐ |
| Lint e build | `npm run lint` e `npm run build` senza errori? | ☐ |

### Esempio 1 — Una duplicazione
Dopo aver aggiunto la card "Ultimi movimenti" (REQ-01), in `src/pages/DashboardPage.jsx` ci sono due `TransactionList`. È probabile che tu abbia scritto due volte la stessa funzione:

```jsx
<TransactionList
  transactions={recentTransactions}
  onToggleFavorite={(transactionId) => dispatch(favoriteToggled(transactionId))}
/>
```

```jsx
<TransactionList
  transactions={visibleTransactions}
  onToggleFavorite={(transactionId) => dispatch(favoriteToggled(transactionId))}
/>
```

Dai un nome a quella funzione e dichiarala una volta sola, nel corpo di `DashboardPage`, prima delle guardie di caricamento:

```jsx title="src/pages/DashboardPage.jsx"
function handleToggleFavorite(transactionId) {
  dispatch(favoriteToggled(transactionId));
}
```

Poi usala in entrambe le liste:

```jsx title="src/pages/DashboardPage.jsx"
<TransactionList
  transactions={recentTransactions}
  onToggleFavorite={handleToggleFavorite}
/>
```

Che cosa è cambiato: la struttura. Il comportamento è identico, e adesso c'è un solo punto da modificare se un giorno il "preferito" dovrà fare altro. Non abbiamo aggiunto `useCallback`: lo scopo qui è togliere una ripetizione, non ottimizzare. Si ottimizza solo dopo aver misurato, come hai visto nel capitolo sulla [memoization](../Day_08_Advanced_Hooks_Architecture/02_Memoization.md).

Verifica: nella dashboard il pulsante "Preferito" funziona in entrambe le card, e il segno compare in tutte e due quando il movimento è presente in entrambe.

### Esempio 2 — Un file che nessuno usa
`public/icons.svg` viene dal modello iniziale di Vite. Per sapere se è usato, cerca il suo nome in tutto il progetto: in VS Code con `Ctrl+Shift+F` (su macOS `Cmd+Shift+F`), testo `icons.svg`.

Nessun risultato: `icons.svg` è codice morto, eliminalo. Fai lo stesso controllo per ogni file di `src/components/`, `src/hooks/` e `src/utils/`: se il nome compare solo nel file stesso, nessuno lo importa.

### Cercare i residui
Cerca `console.` dentro `src/`. Da terminale, dentro `liparibank/`, su Windows (PowerShell):

```powershell
Get-ChildItem src -Recurse -Include *.js,*.jsx | Select-String "console\.|debugger"
```

Su macOS e Linux:

```bash
grep -rnE "console\.|debugger" src
```

Nel progetto di riferimento restano tre risultati, tutti **voluti**: i `console.error` nei due thunk e quello in `ErrorBoundary.jsx`. Registrano un errore reale per chi sviluppa, mentre l'utente vede un messaggio comprensibile. Ogni `console.log` va invece eliminato.

### Lint
Dentro `liparibank/`:

```bash
npm run lint
```

oxlint stampa ogni problema con file, riga e colonna. Variabili e import inutilizzati sono **avvisi**, non errori: il comando termina comunque con successo, ma vanno corretti.

Nel progetto di riferimento resta **un solo avviso noto**, `only-export-components` su `src/context/SettingsContext.jsx`: il file esporta insieme il Provider e l'hook `useSettings`, una scelta fatta nel Day 7 per tenere vicine le due cose. Ogni altro avviso è da sistemare.

Da evitare: far sparire un problema disattivando la regola in `.oxlintrc.json` o con un commento. Si corregge il codice.

### Preparare i test
1. Avvia l'app con `npm run dev` e apri `http://localhost:5173/` con gli strumenti di sviluppo aperti sulla scheda **Console**.
2. Ricarica la pagina (`F5`) prima di ogni gruppo di casi: i bonifici simulati vivono solo in memoria e **si perdono al ricaricamento**. È il comportamento previsto.
3. Due scelte invece **restano** dopo il ricaricamento, perché sono salvate in `localStorage`: "Nascondi saldi" e il filtro per tipo della pagina Movimenti. Prima di ogni gruppo riportale a "Mostra saldi" e "Tutti".

---

## 🏦 LipariBank in action

### A. Dashboard e preferenze

| ID | Passi | Risultato atteso | REQ | Esito |
|---|---|---|---|---|
| TC-01 | Apri `/` | Saldo totale `17.050,75 €`. La card "Ultimi movimenti" ha 5 righe, dalla più recente: Spesa supermercato (27/10/2026), Pagamento utenza luce, Stipendio, Abbonamento palestra, Rimborso spese. Nessun errore in Console | REQ-01 | |
| TC-02 | Premi "Nascondi saldi" | Tutti i saldi sono sostituiti da `••••••`; il pulsante diventa "Mostra saldi"; gli importi dei movimenti restano visibili | REQ-01 | |
| TC-03 | Con i saldi nascosti premi `F5` | I saldi restano nascosti | REQ-12 | |
| TC-04 | Premi "Mostra saldi", poi `F5` | I saldi sono visibili | REQ-12 | |
| TC-05 | Nella card "Ultimi movimenti" premi "Preferito" su Stipendio | La stella diventa piena, anche nella card "Movimenti — Conto Corrente" e nella pagina Movimenti | REQ-14 | |

### B. Conti

| ID | Passi | Risultato atteso | REQ | Esito |
|---|---|---|---|---|
| TC-06 | Apri `/accounts` | Due voci: Conto Corrente `4.250,75 €` e Conto Risparmio `12.800,00 €`; a destra l'invito a selezionare un conto | REQ-02 | |
| TC-07 | Seleziona Conto Corrente | Indirizzo `/accounts/acc-001`; IBAN fittizio, saldo, 6 movimenti; la voce è evidenziata | REQ-03 | |
| TC-08 | Vai a `/accounts/acc-002` | 2 movimenti: Accantonamento mensile, Interessi maturati | REQ-03 | |
| TC-09 | Vai a `/accounts/xyz` | "Conto non trovato" con il link "Torna ai conti"; nessun errore in Console | REQ-03 | |

### C. Movimenti e filtri

| ID | Passi | Risultato atteso | REQ | Esito |
|---|---|---|---|---|
| TC-10 | Apri `/transactions` | 8 movimenti dal più recente; uscite in rosso, entrate in verde; etichetta Entrata o Uscita su ogni riga | REQ-04 | |
| TC-11 | Filtro "Uscite" | 4 movimenti, tutti negativi | REQ-05 | |
| TC-12 | Filtro "Entrate" | 4 movimenti, tutti positivi | REQ-05 | |
| TC-13 | Filtro "Tutti", testo `utenza` | 2 movimenti: luce e gas | REQ-05 | |
| TC-14 | Testo `STIPENDIO` (maiuscolo) | 1 movimento: Stipendio | REQ-05 | |
| TC-15 | Testo `utenza` e filtro "Entrate" | "Nessun movimento da mostrare." con il suggerimento di cambiare filtro; nessuna pagina bianca | REQ-05, REQ-10 | |
| TC-16 | Cancella il testo, filtro "Tutti", conto "Conto Risparmio" | 2 movimenti | REQ-06 | |
| TC-17 | Conto "Conto Corrente" e filtro "Uscite" | 4 movimenti | REQ-06 | |
| TC-18 | Conto "Conto Risparmio" e filtro "Uscite" | "Nessun movimento da mostrare." | REQ-06 | |
| TC-19 | "Tutti i conti", filtro "Tutti", nessun testo | Tornano 8 movimenti | REQ-05 | |
| TC-20 | Filtro "Uscite", poi `F5` | Il filtro "Uscite" è ancora attivo. Riportalo a "Tutti" | REQ-12 | |

### D. Bonifico simulato

| ID | Passi | Risultato atteso | REQ | Esito |
|---|---|---|---|---|
| TC-21 | Apri `/transfer` e invia il form vuoto | Un errore sotto ognuno dei quattro campi; il cursore è sul campo del conto; nessun movimento creato | REQ-07, REQ-16 | |
| TC-22 | Compila tutto, importo `0` | "L'importo deve essere maggiore di zero."; il cursore è sul campo dell'importo | REQ-07, REQ-16 | |
| TC-23 | Importo `-10` | Errore sull'importo | REQ-07 | |
| TC-24 | Prova a scrivere `abc` nell'importo, poi invia | Il campo non accetta lettere (è un `type="number"`); resta vuoto e all'invio compare "Inserisci l'importo." | REQ-07 | |
| TC-25 | Conto Corrente, importo `5000` | "Saldo insufficiente sul conto selezionato."; nessun movimento; saldo invariato | REQ-07 | |
| TC-26 | `F5`, poi Conto Corrente, importo `4250.75` (esattamente il saldo), beneficiario e causale a piacere | Accettato; il saldo del Conto Corrente diventa `0,00 €` | REQ-07 | |
| TC-27 | `F5`, poi Conto Corrente, Giulia Bianchi, importo `100`, causale a piacere | Si apre la pagina Movimenti con "Bonifico simulato registrato."; in testa c'è "Bonifico a Giulia Bianchi" `-100,00 €`; Conto Corrente `4.150,75 €`; totale in dashboard `16.950,75 €` | REQ-08 | |
| TC-28 | Subito dopo, secondo bonifico da `50` a Luca Verdi | Conto Corrente `4.100,75 €`; totale `16.900,75 €`; due nuovi movimenti | REQ-08 | |
| TC-29 | `F5`, poi bonifico da `5000` dal Conto Risparmio | Accettato; Conto Risparmio `7.800,00 €`; totale `12.050,75 €` | REQ-08 | |
| TC-30 | Dopo un bonifico valido premi `F5` | Il bonifico non c'è più: è una simulazione in memoria | REQ-08 | |
| TC-31 | Durante un bonifico valido osserva la scheda Network | L'invio del form non genera nessuna richiesta di rete | REQ-08 | |
| TC-32 | Con i Redux DevTools aperti, invia un bonifico valido | Compare l'azione `transactions/transferAdded`, con importo e beneficiario nel payload | REQ-15 | |

### E. Caricamento, errore, assenza di dati

| ID | Passi | Risultato atteso | REQ | Esito |
|---|---|---|---|---|
| TC-33 | Scheda Network: velocità "Slow 4G" (o la più lenta disponibile), poi ricarica `/transactions` | Compare il messaggio di caricamento prima dei dati. **Riporta la velocità a "No throttling"** | REQ-10 | |
| TC-34 | Scheda Network: blocca la richiesta di `transactions.json` (clic destro sulla richiesta, *Block request URL*), poi ricarica | "Impossibile contattare il servizio." con il pulsante "Riprova"; intestazione e menu restano visibili. **Rimuovi il blocco** e premi "Riprova": i dati arrivano | REQ-10 | |
| TC-35 | Sostituisci temporaneamente il contenuto di `public/data/transactions.json` con `[]` e ricarica `/transactions` | "Non ci sono ancora movimenti." **Ripristina il file** | REQ-10 | |
| TC-36 | Sostituisci temporaneamente il contenuto di `public/data/accounts.json` con `[]` e apri `/accounts`, poi `/` | "Nessun conto disponibile." in entrambe le pagine, senza errori in Console. **Ripristina il file** | REQ-02 | |

### F. Navigazione e robustezza

| ID | Passi | Risultato atteso | REQ | Esito |
|---|---|---|---|---|
| TC-37 | Premi ogni voce del menu | La pagina cambia senza che il browser ricarichi; la voce corrente è evidenziata | REQ-09 | |
| TC-38 | Vai a `/non-esiste` | Pagina 404 con il link alla dashboard | REQ-09 | |
| TC-39 | Scrivi `/transactions` nella barra degli indirizzi, poi `F5` | La pagina si riapre correttamente | REQ-09 | |
| TC-40 | Dashboard → Movimenti → Conti, poi i pulsanti Indietro e Avanti del browser | Si riaprono le pagine corrispondenti | REQ-09 | |
| TC-41 | Aggiungi temporaneamente `throw new Error("prova");` come prima riga del corpo di `TransactionItem`, apri `/`, poi **rimuovi la riga** | "Qualcosa è andato storto" con "Riprova"; intestazione e menu restano visibili | REQ-13 | |
| TC-42 | Percorri tutte le pagine con la Console aperta | Nessun errore. In sviluppo `StrictMode` esegue due volte gli effetti: è previsto e non è un difetto | NFR-01 | |

### Registro dei risultati
Copialo nei tuoi appunti, oppure in un file `docs/TEST_REPORT.md` del tuo progetto, e compilalo mentre esegui i casi:

```markdown
# Test report — LipariBank

- Data: [DA COMPLETARE: data di esecuzione]
- Browser e versione: [DA COMPLETARE: browser usato]
- Comando: npm run dev

| Gruppo | Eseguiti | Passati | Falliti | Note |
|---|---|---|---|---|
| A Dashboard e preferenze | 5 | | | |
| B Conti | 4 | | | |
| C Movimenti e filtri | 11 | | | |
| D Bonifico | 12 | | | |
| E Caricamento, errore, vuoto | 4 | | | |
| F Navigazione e robustezza | 6 | | | |
```

### Segnalare un difetto
Un difetto è descritto bene quando si può riprodurre senza chiedere nulla a chi l'ha trovato:

```markdown
**ID:** BUG-01
**Caso:** TC-25
**Passi:** 1) apri /transfer 2) scegli Conto Corrente 3) importo 5000 4) invia
**Atteso:** errore "Saldo insufficiente sul conto selezionato."
**Ottenuto:** il movimento viene creato
**Note:** nessun errore in Console
```

Correggilo in un branch `fix/<descrizione>`, con un commit `fix(transfer): ...`, poi **riesegui il caso fallito e quelli collegati**.

---

## 🧪 Your Turn

**Obiettivo:** consegnare un codice rivisto e un piano di test eseguito per intero.

**Requisiti:**
1. Crea il branch `refactor/final-cleanup` e percorri la checklist di revisione. Elimina **almeno una duplicazione** e ogni file o import inutilizzato; annota i file toccati.
2. Elimina ogni `console.log` e `debugger`.
3. `npm run lint` senza errori (resta al più l'avviso noto su `SettingsContext.jsx`) e `npm run build` senza errori.
4. Esegui tutti i casi da TC-01 a TC-42 e registra l'esito di ognuno. Motiva ogni caso non eseguito.
5. Per ogni ❌ scrivi un difetto (`BUG-xx`), correggilo e riesegui il caso.
6. Aggiungi **almeno tre casi tuoi** (`TC-43`...) su aspetti non coperti: per esempio una causale di 141 caratteri, un importo con tre decimali, il cambio di conto dopo un errore di saldo insufficiente.

**Passi suggeriti:**
1. Un commit per ogni modifica di struttura, verificando l'app dopo ciascuno.
2. Lavora per gruppo, ricaricando la pagina tra un gruppo e l'altro.
3. Per i casi TC-35, TC-36 e TC-41 annota che cosa hai modificato: alla fine `git status` deve tornare pulito.

**Risultato atteso:** stessa app e stesso comportamento, meno codice ripetuto, tutti i casi ✅ e il registro compilato.

**Criteri di completamento:** `git status` non mostra modifiche a `public/data/*.json` né a `TransactionItem.jsx`; ogni difetto è corretto, oppure descritto tra i "limiti noti" del README che scriverai nel [capitolo 07](./07_README_e_Consegna.md).

---

## ⚠️ Common Mistakes
- **Rifattorizzare senza verificare**: ogni passo va controllato nel browser.
- **Cambiare il comportamento "già che ci sono"**: tieni separati i commit `refactor`, `fix` e `feat`.
- **Aggiungere `useMemo` o `useCallback` "per pulire"**: non è refactoring, e senza una misura non è nemmeno ottimizzazione.
- **Silenziare il lint** invece di correggere il codice.
- **Provare solo il percorso felice**: i difetti stanno negli input errati e nei casi limite.
- **Non ricaricare tra un gruppo e l'altro**: i bonifici di prova falsano i saldi.
- **Dimenticare di ripristinare** i file JSON, il blocco di rete o il `throw` temporaneo.
- **Segnare "passato" a memoria**: scrivi l'esito mentre esegui il caso.

---

## ✅ Checklist
- ☐ Ho percorso tutta la checklist di revisione.
- ☐ Ho eliminato almeno una duplicazione senza cambiare il comportamento.
- ☐ Nessun `console.log`, nessun file o import inutilizzato.
- ☐ `npm run lint` e `npm run build` passano.
- ☐ Ho eseguito i casi di tutti i gruppi, da A a F.
- ☐ Ho simulato caricamento lento, errore di rete e dati vuoti.
- ☐ Ho corretto o documentato ogni difetto.
- ☐ Ho ripristinato tutto ciò che avevo modificato per le prove.

---

## 🚀 Challenge
Ripeti il gruppo D usando **solo la tastiera**: `Tab`, `Shift+Tab`, le frecce nei menu a tendina, `Invio`. Annota i punti in cui non capisci dove si trova il cursore: è il tema del prossimo capitolo.

---

## 📌 Recap
- Refactoring: stessa funzionalità, struttura migliore, a piccoli passi verificati.
- Una duplicazione si elimina dando un nome a ciò che si ripete.
- Lint pulito, nessun `console.log`, nessun file inutilizzato.
- Un caso di prova ha passi, risultato atteso osservabile, requisito ed esito.
- Vanno coperti percorso felice, input errati, casi limite e stati anomali.
- Un difetto si segnala in modo riproducibile e si corregge in un commit `fix:` dedicato.

---

### ➡️ Next
Prossimo capitolo: [05 · Accessibility e responsive](./05_Accessibility_e_Responsive.md). Rendiamo LipariBank utilizzabile da tastiera, comprensibile a uno screen reader e adatta agli schermi piccoli.
