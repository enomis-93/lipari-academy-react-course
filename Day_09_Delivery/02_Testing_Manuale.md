# 🏦 LipariBank — React Zero to Hero

> **Day 9 · Capitolo 02**
> **Argomento:** Testing Manuale
> **Durata stimata:** 60 minuti
> **Parte di LipariBank:** verifica dei flussi principali con casi di test concreti collegati ai requisiti

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- eseguire un piano di test manuali strutturato (ID, passi, risultato atteso, esito);
- simulare i casi limite: importo oltre il saldo, caricamento lento, errore di rete, dati vuoti;
- annotare un difetto in modo riproducibile;
- produrre un breve rapporto di test da allegare alla consegna.

---

## 📋 Prerequisiti
- [Refactoring Finale](./01_Refactoring_Finale.md) completato; `npm run lint` e `npm run build` passano.
- [Requirements Funzionali](../Day_08_Final_Project/02_Requirements_Funzionali.md) (ID `REQ-xx`).
- App avviata con `npm run dev` (dentro `liparibank/`) su `http://localhost:5173/`.
- DevTools del browser (F12): schede **Console** e **Network**.

---

## 🧭 In questo capitolo
- Come si progetta un test manuale.
- Preparazione dell'ambiente.
- Tabelle di test per area (dashboard, conti, movimenti, bonifico, stati, navigazione).
- Registro dei risultati e segnalazione dei difetti.

---

## 🧠 Theory

Un test manuale è una **procedura ripetibile**: chiunque la esegua con gli stessi passi ottiene lo stesso risultato atteso. Ogni caso ha:
- **ID** (`TC-01`…);
- **Precondizione** (dove sono, quali dati);
- **Passi**;
- **Risultato atteso** *osservabile* (testo, numero, comportamento);
- **Requisito** collegato;
- **Esito** (✅ passato / ❌ fallito / ⏭ non eseguito).

Tipi di caso da coprire sempre: **percorso felice** (tutto va bene), **input errato**, **caso limite**, **stato anomalo** (caricamento, errore, vuoto).

> 💡 **Remember**
>
> I dati sono quelli canonici del corso: Conto Corrente 4.250,75 €, Conto Risparmio 12.800,00 €, totale 17.050,75 €, 8 movimenti (4 entrate e 4 uscite). Se i tuoi numeri differiscono, l'app o i JSON in `public/data/` non sono allineati.

---

## 💻 Let's Code

### Preparazione
1. Apri `http://localhost:5173/` con DevTools aperto (Console visibile).
2. Ricarica la pagina (F5) prima di ogni gruppo: i bonifici simulati vivono solo nello state e **si perdono al ricaricamento**; è il comportamento atteso.
3. Per i test sugli stati anomali (TC-29…31) usa gli strumenti indicati; ripristina sempre tutto dopo la prova.

### A. Dashboard e preferenze

| ID | Passi | Risultato atteso | REQ | Esito |
|---|---|---|---|---|
| TC-01 | Apri `/` | Saldo totale `17.050,75 €`; 5 movimenti, il primo "Spesa supermercato" (27/10/2026); ordine per data decrescente; nessun errore in Console | REQ-01 | |
| TC-02 | Clicca "Nascondi saldo" | L'importo è sostituito dal segnaposto; il pulsante diventa "Mostra saldo" | REQ-01 | |
| TC-03 | Con saldo nascosto premi F5 | Il saldo resta nascosto | REQ-12 | |
| TC-04 | Clicca "Mostra saldo", premi F5 | Il saldo è visibile | REQ-12 | |

### B. Conti

| ID | Passi | Risultato atteso | REQ | Esito |
|---|---|---|---|---|
| TC-05 | Apri `/accounts` | Due card: Conto Corrente `4.250,75 €` e Conto Risparmio `12.800,00 €`, con IBAN fittizi | REQ-02 | |
| TC-06 | Apri il dettaglio di Conto Corrente | URL `/accounts/acc-001`; dati del conto; 6 movimenti | REQ-03 | |
| TC-07 | Vai a `/accounts/acc-002` | 2 movimenti ("Accantonamento mensile", "Interessi maturati") | REQ-03 | |
| TC-08 | Vai a `/accounts/xyz` | Messaggio "Conto non trovato" con link ai conti; nessun errore in Console | REQ-03 | |

### C. Movimenti e filtri

| ID | Passi | Risultato atteso | REQ | Esito |
|---|---|---|---|---|
| TC-09 | Apri `/transactions` | 8 movimenti per data decrescente; importi negativi in rosso, positivi in verde; badge Entrata/Uscita | REQ-04 | |
| TC-10 | Filtro "Uscite" | 4 movimenti, tutti con importo negativo | REQ-05 | |
| TC-11 | Filtro "Entrate" | 4 movimenti, tutti con importo positivo | REQ-05 | |
| TC-12 | Filtro "Tutti", testo `utenza` | 2 movimenti (luce, gas) | REQ-05 | |
| TC-13 | Testo `STIPENDIO` (maiuscolo) | 1 movimento "Stipendio" | REQ-05 | |
| TC-14 | Testo `utenza` + filtro "Entrate" | Stato vuoto con messaggio (nessuna pagina bianca) | REQ-05, REQ-10 | |
| TC-15 | Filtro conto "Conto Risparmio" | 2 movimenti | REQ-06 | |
| TC-16 | Conto "Conto Corrente" + "Uscite" | 4 movimenti | REQ-06 | |
| TC-17 | Cancella tutti i filtri | Tornano 8 movimenti | REQ-05 | |

### D. Bonifico simulato

| ID | Passi | Risultato atteso | REQ | Esito |
|---|---|---|---|---|
| TC-18 | Apri `/transfer`, invia il form vuoto | Errori accanto ai campi obbligatori; nessun movimento creato | REQ-07 | |
| TC-19 | Importo `0` | Errore "importo maggiore di zero" (o equivalente) | REQ-07 | |
| TC-20 | Importo `-10` | Errore sull'importo | REQ-07 | |
| TC-21 | Importo non numerico (se il campo accetta testo) | Errore sull'importo; con `type="number"` il browser blocca le lettere | REQ-07 | |
| TC-22 | **Importo `5000` dal Conto Corrente** (saldo 4.250,75 €) | Errore "saldo insufficiente"; nessun nuovo movimento; saldo invariato | REQ-07 | |
| TC-23 | Premi F5, poi importo `4250.75` dal Conto Corrente (esattamente il saldo) | Comportamento coerente con la regola scelta nel Day 4 (di norma accettato, saldo `0,00 €`); documenta la regola nel README | REQ-07 | |
| TC-24 | **Premi F5, poi importo `100`, Conto Corrente → Giulia Bianchi, causale a piacere** | Messaggio di conferma; form svuotato; in `/transactions` compare "Bonifico a Giulia Bianchi" `−100,00 €`; saldo Conto Corrente `4.150,75 €`; totale `16.950,75 €` | REQ-08 | |
| TC-25 | Subito dopo TC-24, secondo bonifico da `50` a Luca Verdi | Saldo Conto Corrente `4.100,75 €`; totale `16.900,75 €`; due nuovi movimenti | REQ-08 | |
| TC-26 | Premi F5, poi bonifico da `5000` dal **Conto Risparmio** (saldo 12.800,00 €) | Accettato; saldo `7.800,00 €`; totale `12.050,75 €` | REQ-08 | |
| TC-27 | Dopo un bonifico valido premi F5 | Il bonifico non c'è più (è una simulazione solo in memoria) | REQ-08 | |
| TC-28 | Durante un bonifico valido, guarda la scheda Network | Nessuna richiesta di rete generata dall'invio del form | REQ-08 | |

### E. Stati di caricamento, errore e vuoto

| ID | Passi | Risultato atteso | REQ | Esito |
|---|---|---|---|---|
| TC-29 | Scheda Network → throttling "Slow 3G" (o equivalente), ricarica `/transactions` | Appare il messaggio/spinner di caricamento prima dei dati | REQ-10 | |
| TC-30 | Nella scheda Network usa il blocco della richiesta per `transactions.json` (*request blocking*), oppure rinomina temporaneamente `public/data/transactions.json`; ricarica | Messaggio di errore comprensibile (con il file rinominato, il server di Vite risponde con `index.html` e l'errore nasce dalla lettura del JSON, non da un 404); nessuna pagina bianca; **ripristina** il blocco/il file | REQ-10 | |
| TC-31 | Sostituisci temporaneamente il contenuto di `public/data/transactions.json` con `[]`; ricarica `/transactions` | `EmptyState` con testo esplicativo; **ripristina** il file | REQ-10 | |

### F. Navigazione e robustezza

| ID | Passi | Risultato atteso | REQ | Esito |
|---|---|---|---|---|
| TC-32 | Clicca ogni voce del menu | Cambia pagina senza ricaricare il browser; la voce corrente è evidenziata | REQ-09 | |
| TC-33 | Vai a `/non-esiste` | Pagina 404 con link alla dashboard | REQ-09 | |
| TC-34 | Apri `/transactions` direttamente nella barra degli indirizzi, poi F5 | La pagina si riapre correttamente (con `npm run dev`; per la build vedi [Environment e Deploy](./04_Environment_e_Deploy.md)) | REQ-09 | |
| TC-35 | Naviga Dashboard → Movimenti → Conti, poi usa Indietro/Avanti del browser | Le pagine corrispondenti si riaprono | REQ-09 | |
| TC-36 | (Solo prova) lancia temporaneamente `throw new Error("test")` nel corpo di `TransactionItem`, ricarica `/`, poi **rimuovi la riga** | Compare il fallback dell'Error Boundary, non una pagina bianca | REQ-13 | |
| TC-37 | Percorri tutte le pagine con Console aperta | Nessun errore rosso. In sviluppo, `StrictMode` può duplicare richieste o effetti: è atteso e non è un difetto | NFR-01 | |

---

## 🏦 LipariBank in action

### Registro dei risultati
Copia in un file `docs/TEST_REPORT.md` (cartella `docs/` nuova, facoltativa) o nei tuoi appunti:

```markdown
# Test Report — LipariBank

- Data: [DA CONFIGURARE: data esecuzione]
- Browser e versione: [DA CONFIGURARE: browser usato]
- Comando: npm run dev

| Gruppo | Eseguiti | Passati | Falliti | Note |
|---|---|---|---|---|
| A Dashboard | 4 | | | |
| B Conti | 4 | | | |
| C Movimenti e filtri | 9 | | | |
| D Bonifico | 11 | | | |
| E Stati | 3 | | | |
| F Navigazione | 6 | | | |
```

### Segnalare un difetto
Un buon difetto si può riprodurre senza chiedere nulla all'autore:

```markdown
**ID:** BUG-01
**Caso:** TC-22
**Passi:** 1) apri /transfer 2) scegli Conto Corrente 3) importo 5000 4) invia
**Atteso:** errore "saldo insufficiente"
**Ottenuto:** il movimento viene creato
**Note:** nessun errore in Console
```

Correggi il difetto in un branch `fix/<descrizione>`, con commit `fix(transfer): ...`, poi **riesegui il caso fallito e quelli collegati**.

---

## 🧪 Your Turn

**Obiettivo:** eseguire l'intero piano e documentare gli esiti.

**Requisiti**
1. Esegui tutti i casi TC-01…TC-37 (o motiva ogni caso "non eseguito").
2. Registra l'esito di ciascuno nella colonna *Esito* (✅/❌/⏭).
3. Per ogni ❌ scrivi un difetto (BUG-xx) e correggilo; riesegui il caso.
4. Aggiungi **almeno tre casi tuoi** (`TC-38`…) su aspetti non coperti: per esempio causale molto lunga, beneficiario non selezionato, doppio clic su "Invia".
5. Compila il `TEST_REPORT.md`.

**Passi suggeriti**
- Lavora per gruppo; F5 tra un gruppo e l'altro.
- Per TC-30/31, annota cosa hai modificato, così ripristini senza dimenticare nulla (`git status` deve tornare pulito dopo il ripristino).

**Risultato atteso:** tutti i casi ✅, report compilato, nessun file di prova rimasto modificato.

**Criteri di completamento:** `git status` non mostra modifiche a `public/data/*.json` né a `TransactionItem.jsx` legate ai test; ogni difetto trovato è corretto o motivatamente rimandato nel README ("limiti noti").

---

## ⚠️ Common Mistakes
- **Testare solo il percorso felice**: i difetti stanno negli input errati e nei casi limite.
- **Non ricaricare tra un gruppo e l'altro**: i bonifici di prova falsano i saldi.
- **Dimenticare di ripristinare** i JSON o il `throw` temporaneo: committa solo dopo `git status` e `git diff`.
- **Dichiarare "passato" a memoria**: scrivi l'esito mentre esegui.
- **Ignorare i warning in Console**: spesso segnalano `key` mancanti o dipendenze di `useEffect`.

---

## ✅ Checklist
- ☐ Ho eseguito i casi di tutti i gruppi A–F.
- ☐ Ho provato l'importo maggiore del saldo (TC-22).
- ☐ Ho simulato caricamento lento, errore e dati vuoti.
- ☐ Ho corretto o documentato ogni difetto.
- ☐ Ho compilato il test report.
- ☐ Ho ripristinato tutti i file modificati per le prove.

---

## 🚀 Challenge
Ripeti il gruppo D usando **solo la tastiera** (Tab, Shift+Tab, frecce nelle select, Invio). Annota i punti dove perdi il focus o non capisci dove sei: li risolverai nel capitolo successivo.

---

## 📌 Recap
- Un test manuale è una procedura ripetibile con risultato atteso osservabile.
- Coprire percorso felice, input errati, casi limite e stati anomali.
- I numeri canonici (4.250,75 €, 17.050,75 €, 4.150,75 €, 16.950,75 €) permettono verifiche oggettive.
- I difetti si segnalano in modo riproducibile e si correggono in commit `fix:` dedicati.

---

### ➡️ Next
Prossimo capitolo: [Accessibility e Responsive](./03_Accessibility_e_Responsive.md) — rendiamo LipariBank utilizzabile da tastiera, comprensibile per gli screen reader e adatta a schermi piccoli.
