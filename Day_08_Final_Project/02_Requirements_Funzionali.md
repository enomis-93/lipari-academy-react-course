# 🏦 LipariBank — React Zero to Hero

> **Day 8 · Capitolo 02**
> **Argomento:** Requirements Funzionali
> **Durata stimata:** 40 minuti
> **Parte di LipariBank:** specifica dei requisiti con ID, criteri di accettazione e priorità

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- leggere e usare un elenco di requisiti con ID (`REQ-01`…) e priorità *Must / Should / Could*;
- verificare un requisito tramite i suoi **criteri di accettazione**;
- collegare ogni requisito a pagine, componenti e file del progetto;
- scrivere un tuo requisito in forma verificabile.

---

## 📋 Prerequisiti
- [Final Project Brief](./01_Final_Project_Brief.md), con la tabella di audit compilata.
- Conoscenza dei dati fittizi di LipariBank (`src/data/mockData.js`, `public/data/*.json`).

---

## 🧭 In questo capitolo
- Cos'è un requisito verificabile e come si scrive un criterio di accettazione.
- La priorità MoSCoW (Must / Should / Could).
- I requisiti funzionali `REQ-01`…`REQ-14` con criteri e priorità.
- I requisiti non funzionali `NFR-01`…`NFR-05`.
- La matrice requisito → file.

---

## 🧠 Theory

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

---

## 💻 Let's Code

Un requisito non è codice, ma lo trasformi in codice (e in test manuali, vedi [Testing Manuale](../Day_09_Delivery/02_Testing_Manuale.md)). Esempio: dal criterio *"con importo 0 il form mostra un errore"* nasce questa verifica in `src/utils/validators.js`. Snippet parziale, da adattare a quanto scritto nel Day 4:

```javascript
export function validateTransfer(values, availableBalance) {
  const errors = {};
  const amount = Number(values.amount);

  if (!values.fromAccountId) errors.fromAccountId = "Seleziona il conto di addebito.";
  if (!values.beneficiaryId) errors.beneficiaryId = "Seleziona un beneficiario.";
  if (values.amount === "" || Number.isNaN(amount) || amount <= 0) {
    errors.amount = "Inserisci un importo maggiore di zero.";
  } else if (amount > availableBalance) {
    errors.amount = "Saldo insufficiente per questo bonifico.";
  }

  return errors;
}
```

Cosa fa: restituisce un oggetto vuoto se tutto è valido, altrimenti una chiave per ogni campo errato. Perché funziona: ogni criterio di accettazione di `REQ-07` corrisponde a una `if`. Come modificarlo: se aggiungi il requisito "causale massimo 60 caratteri", aggiungi una riga e un criterio. Da evitare: validare solo nel browser con `required`/`min` HTML; la validazione in JavaScript è la fonte di verità del corso.

---

## 🏦 LipariBank in action

### Requisiti funzionali

| ID | Requisito | Criteri di accettazione | Priorità |
|---|---|---|---|
| **REQ-01** | **Dashboard**: saldo totale e ultimi movimenti | **Dato** `/`, **allora** vedo il saldo totale (somma dei conti) formattato in euro e gli ultimi 5 movimenti, dal più recente. Il pulsante "Nascondi saldo" sostituisce l'importo con un segnaposto (es. `••••`) e "Mostra saldo" lo ripristina. | Must |
| **REQ-02** | **Elenco conti** | **Dato** `/accounts`, **allora** vedo una card per ogni conto con nome, IBAN fittizio e saldo. Se non ci sono conti vedo un messaggio di stato vuoto. | Must |
| **REQ-03** | **Dettaglio conto** | **Dato** `/accounts/acc-001`, **allora** vedo i dati del conto e i suoi movimenti. **Dato** `/accounts/xyz`, **allora** vedo un messaggio "Conto non trovato" con link per tornare ai conti, senza errori in console. | Must |
| **REQ-04** | **Elenco movimenti** | **Dato** `/transactions`, **allora** vedo tutti i movimenti ordinati per data decrescente; ogni riga mostra data (`it-IT`), descrizione, categoria, importo con classe verde (entrata) o rossa (uscita) e badge testuale Entrata/Uscita. | Must |
| **REQ-05** | **Filtri per tipo e testo** | **Quando** scelgo "Uscite" vedo solo importi negativi; "Entrate" solo positivi; "Tutti" li vedo tutti. **Quando** scrivo "utenza" vedo solo i movimenti la cui descrizione contiene "utenza", senza distinguere maiuscole/minuscole. I due filtri si combinano. | Must |
| **REQ-06** | **Filtro per conto** | **Quando** scelgo "Conto Risparmio" vedo solo i movimenti con `accountId: "acc-002"`; la selezione si combina con REQ-05. | Should |
| **REQ-07** | **Form bonifico con validazione** | **Dato** `/transfer`, **quando** invio con campi vuoti, importo ≤ 0, importo non numerico o importo > saldo disponibile del conto scelto, **allora** vedo un errore per ogni campo errato e **nessun** movimento viene creato. | Must |
| **REQ-08** | **Feedback e effetto del bonifico** | **Quando** invio un bonifico valido (es. 100,00 € dal Conto Corrente a "Giulia Bianchi"), **allora** vedo un messaggio di conferma, il form si svuota, compare un nuovo movimento "Bonifico a Giulia Bianchi" con importo −100,00 € e il saldo del conto scende di 100,00 €. Nessuna chiamata di rete viene fatta. | Must |
| **REQ-09** | **Navigazione e 404** | Il layout mostra Header e menu con voci Dashboard, Conti, Movimenti, Bonifico; la voce attiva è evidenziata. **Dato** un URL inesistente, **allora** vedo la pagina 404 con link alla dashboard. Ricaricando (F5) una rotta valida la pagina si riapre correttamente in sviluppo. | Must |
| **REQ-10** | **Stati di caricamento, errore, assenza dati** | **Durante** il caricamento vedo un messaggio/spinner; **se** il caricamento fallisce vedo un messaggio di errore comprensibile; **se** i dati sono vuoti vedo un `EmptyState` con testo esplicativo. Mai una pagina bianca. | Must |
| **REQ-11** | **Componenti riutilizzabili** | `Card`, `EmptyState`, `LoadingMessage`, `ErrorMessage`, `TransactionList` sono usati in più pagine senza duplicare il markup. | Must |
| **REQ-12** | **Preferenza saldo nascosto persistente** | **Quando** nascondo il saldo e ricarico la pagina, il saldo resta nascosto (`useLocalStorage`). | Should |
| **REQ-13** | **Error Boundary** | Un errore di rendering in un componente mostra un messaggio di fallback con possibilità di ricaricare, invece di una pagina bianca. | Should |
| **REQ-14** | **Nota o preferito su un movimento** | **Quando** segno un movimento come preferito, lo state viene aggiornato in modo immutabile e il segno resta visibile finché non ricarico la pagina. | Could |
| **REQ-15** | **Modalità compatta Redux** | Il pulsante modifica la spaziatura dei movimenti, espone `aria-pressed` e conserva la scelta navigando; al reload ritorna disattivata. | Must |
| **REQ-16** | **Accesso rapido all'importo** | Il pulsante del form porta il focus sull'importo senza inviare il bonifico né cancellare i valori. | Must |

### Requisiti non funzionali

| ID | Requisito | Verifica | Priorità |
|---|---|---|---|
| **NFR-01** | Qualità del codice: `npm run lint` senza errori, nessun `console.log` residuo | [Refactoring Finale](../Day_09_Delivery/01_Refactoring_Finale.md) | Must |
| **NFR-02** | Build di produzione: `npm run build` termina senza errori | [Environment e Deploy](../Day_09_Delivery/04_Environment_e_Deploy.md) | Must |
| **NFR-03** | Accessibilità di base: label sui campi, HTML semantico, uso da tastiera, `aria-live` sul feedback | [Accessibility e Responsive](../Day_09_Delivery/03_Accessibility_e_Responsive.md) | Should |
| **NFR-04** | Layout responsive da ~360 px a desktop | idem | Should |
| **NFR-05** | Nessun segreto nel repository; solo variabili `VITE_*` non sensibili | [Environment e Deploy](../Day_09_Delivery/04_Environment_e_Deploy.md) | Must |

### Matrice requisito → file (indicativa)

| Requisito | Pagina / route | File principali |
|---|---|---|
| REQ-01, REQ-12 | `DashboardPage` · `/` | `BalanceCard.jsx`, `TransactionList.jsx`, `SettingsContext.jsx`, `useLocalStorage.js` |
| REQ-02, REQ-03 | `AccountsPage`, `AccountDetailPage` | `AccountList.jsx`, `AccountCard.jsx`, `accountService.js` |
| REQ-04, REQ-05, REQ-06 | `TransactionsPage` · `/transactions` | `TransactionFilters.jsx`, `TransactionList.jsx`, `TransactionItem.jsx` |
| REQ-07, REQ-08 | `TransferPage` · `/transfer` | `TransferForm.jsx`, `useTransferForm.js`, `validators.js`, `bankReducer.js` |
| REQ-09 | `AppLayout`, `NotFoundPage` · `*` | `AppLayout.jsx`, `App.jsx` |
| REQ-10, REQ-11 | tutte | `LoadingMessage.jsx`, `ErrorMessage.jsx`, `EmptyState.jsx`, `Card.jsx` |
| REQ-13 | root | `ErrorBoundary.jsx`, `main.jsx` |
| REQ-15 | layout e tutte le pagine | `DisplayDensity.jsx`, `displaySlice.js`, `store.js` |
| REQ-16 | `TransferPage` · `/transfer` | `TransferForm.jsx` |

---

## 🧪 Your Turn

**Obiettivo:** appropriarti dei requisiti e scrivere il tuo.

**Requisiti**
1. Copia la tabella dei requisiti funzionali in un file di appunti e aggiungi una colonna **Stato** (☐ / in corso / fatto).
2. Collega la tabella di audit del [capitolo 01](./01_Final_Project_Brief.md) ai requisiti: per ogni gap scrivi l'ID `REQ-xx` che lo copre.
3. Scrivi **un tuo requisito `REQ-17`** (priorità *Could*) con almeno due criteri Dato/Quando/Allora. Esempi di idee: ordinamento dei movimenti per importo; pulsante "Riprova" nello stato di errore; contatore "N movimenti trovati" sotto i filtri.
4. Verifica che il tuo requisito sia verificabile: un'altra persona deve poter rispondere sì/no guardando l'app.

**Passi suggeriti**
- Parti dal verbo: "mostra", "consente", "impedisce", "aggiorna".
- Indica sempre un esempio numerico o testuale concreto (importi, descrizioni dei dati fittizi).

**Risultato atteso:** tabella requisiti con stato, gap collegati agli ID, e un `REQ-17` ben formulato.

**Criteri di completamento:** nessun requisito ha criteri vaghi ("funziona bene"); `REQ-17` ha almeno 2 criteri osservabili.

---

## ⚠️ Common Mistakes
- **Criteri vaghi** ("l'interfaccia è chiara"): riscrivili con un risultato osservabile.
- **Tutto "Must"**: se tutto è prioritario, nulla lo è. Il brief indica quali sono i Must.
- **Requisito = soluzione tecnica** ("usare `useReducer`"): un requisito dice *cosa*, l'architettura dice *come*.
- **Dimenticare i casi di errore**: ogni form e ogni caricamento ha un percorso "negativo" da specificare.

---

## ✅ Checklist
- ☐ Conosco l'ID e la priorità di ogni requisito.
- ☐ So spiegare un criterio Dato/Quando/Allora con un esempio.
- ☐ Ho collegato i gap dell'audit ai requisiti.
- ☐ Ho scritto `REQ-17` in forma verificabile.
- ☐ So quali requisiti sono Must.

---

## 🚀 Challenge
Scrivi per `REQ-08` un criterio aggiuntivo sul caso "due bonifici consecutivi": cosa succede al saldo e all'elenco dopo il secondo?

---

## 📌 Recap
- Un requisito ha un ID, criteri osservabili e una priorità.
- I Must definiscono il minimo consegnabile; Should e Could vengono dopo.
- I requisiti non funzionali (lint, build, accessibilità, segreti) contano quanto quelli funzionali.
- La matrice requisito → file ti dice dove intervenire quando un criterio fallisce.

---

### ➡️ Next
Prossimo capitolo: [Architettura](./03_Architettura.md) — la struttura di cartelle, il flusso dei dati e le regole di dipendenza che rendono implementabili questi requisiti.
