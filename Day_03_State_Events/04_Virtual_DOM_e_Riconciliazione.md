# 🏦 LipariBank — React Zero to Hero

> **Day 3 · Capitolo 04**
> **Argomento:** Virtual DOM e riconciliazione
> **Durata stimata:** 35 minuti
> **Parte di LipariBank:** capire perché, premendo "Nascondi saldi", React ritocca solo i saldi invece di ridisegnare tutta la pagina

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- spiegare la differenza tra il DOM del browser e gli elementi React (il "Virtual DOM");
- descrivere come React confronta due render successivi e le due regole che applica;
- prevedere quando lo state di un componente viene conservato e quando viene azzerato;
- usare `key` per azzerare di proposito lo state di un componente.

---

## 📋 Prerequisiti
- [Capitolo 03 — State e Re-render](./03_State_e_Rerender.md): conosci il ciclo *trigger → render → commit*.
- [Day 1 · Rendering e composizione](../Day_01_React_Fundamentals/05_Rendering_e_Composizione.md): il primo sguardo a DOM e Virtual DOM.
- [Day 2 · Liste e Keys](../Day_02_Components_Props/05_Liste_e_Keys.md): sai a cosa serve `key` nelle liste.
- `Dashboard` con lo state `hideBalance` e il pulsante "Nascondi saldi".

---

## 🧭 In questo capitolo
- Due alberi: il DOM e gli elementi React.
- La riconciliazione e le sue due regole.
- Perché lo state è legato alla posizione nell'albero.
- `key` fuori dalle liste: azzerare un componente.
- Che cosa il Virtual DOM non è.

---

## 🧠 Theory

### Due alberi
Nel browser la pagina è un albero di nodi: il **DOM**. Ogni modifica a un nodo può costringere il browser a ricalcolare stili e posizioni, quindi conviene toccarlo il meno possibile.

Un componente React non produce nodi del DOM. Restituisce **elementi React**: normali oggetti JavaScript che *descrivono* che cosa dovrebbe esserci sullo schermo.

```javascript
{ type: "p", props: { className: "balance-card__value", children: "4.250,75 €" } }
```

L'albero formato da questi oggetti è ciò che comunemente si chiama **Virtual DOM**. Crearlo costa poco: sono solo oggetti in memoria. A ogni render React ne ottiene uno nuovo, eseguendo di nuovo le funzioni dei componenti.

### La riconciliazione
Dopo un render React ha in mano due descrizioni: quella di prima e quella nuova. Le confronta, individua le differenze e nella fase di *commit* applica al DOM **solo quelle**. Questo confronto si chiama **riconciliazione**.

| Fase | Che cosa succede | Tocca il DOM? |
|---|---|---|
| Trigger | Un setter chiede un aggiornamento | No |
| Render | React riesegue i componenti e ottiene il nuovo albero di elementi | No |
| Riconciliazione | React confronta il nuovo albero con il precedente | No |
| Commit | React applica al DOM le sole differenze trovate | Sì |

Ecco perché nel capitolo precedente hai visto tanti `console.log` di render senza che la pagina "lampeggiasse": rieseguire le funzioni non significa riscrivere il DOM.

### Le due regole
Confrontare due alberi qualsiasi, nodo per nodo, sarebbe troppo lento. React usa due regole pratiche, che conviene conoscere perché spiegano molti comportamenti a prima vista strani.

1. **Tipo diverso nella stessa posizione: si ricomincia.** Se dove prima c'era un `<p>` ora c'è un `<div>`, oppure dove c'era `<AccountCard>` ora c'è `<EmptyState>`, React non prova a trasformare l'uno nell'altro. Smonta il vecchio sottoalbero (i suoi nodi vengono rimossi e **il suo state viene perso**) e monta quello nuovo da zero.
2. **Stesso tipo nella stessa posizione: si aggiorna.** Se dove c'era `<AccountCard>` c'è ancora `<AccountCard>`, React conserva il nodo del DOM e lo state, e aggiorna soltanto le props e gli attributi cambiati.

"Posizione" significa il posto occupato **tra i figli dello stesso genitore**, non la riga del file in cui hai scritto il JSX.

### Lo state è legato alla posizione
La seconda regola ha una conseguenza importante: lo state non appartiene alla riga di codice che dichiara `useState`, ma **alla posizione del componente nell'albero**. Finché in quella posizione resta un componente dello stesso tipo, lo state sopravvive, anche se le props cambiano completamente.

```jsx
{isSavings ? (
  <OperationCounter accountName="Conto Risparmio" />
) : (
  <OperationCounter accountName="Conto Corrente" />
)}
```

Nel codice sembrano due componenti distinti. Per React sono lo **stesso** componente, nella stessa posizione, con una prop diversa: il contatore interno non si azzera quando `isSavings` cambia.

### `key`: dare un'identità
Nelle liste `key` dice a React quale voce è quale, così un riordino non confonde gli elementi. La stessa idea vale fuori dalle liste: **cambiare la `key` di un componente equivale a dire "questo è un altro componente"**. React smonta quello vecchio e ne monta uno nuovo, con lo state iniziale.

```jsx
<OperationCounter key={accountName} accountName={accountName} />
```

È il modo corretto di azzerare lo state di un componente quando cambia l'oggetto a cui si riferisce (un altro conto, un altro cliente, un altro documento).

### Che cosa il Virtual DOM non è
- **Non è "più veloce del DOM".** Creare e confrontare oggetti è lavoro in più. Il vantaggio è un altro: tu descrivi l'interfaccia per i dati correnti e React si occupa di trovare le modifiche minime, invece di doverle scrivere a mano.
- **Non è una copia del DOM del browser.** È una descrizione fatta di oggetti; il browser non la vede mai.
- **Non è lo Shadow DOM.** Quello è una funzionalità del browser per isolare stili e markup; non c'entra con React.

> 💡 **Remember**
>
> Stesso tipo nella stessa posizione = stesso componente: lo state resta. Tipo diverso o `key` diversa = componente nuovo: lo state riparte da zero.

---

## 💻 Let's Code

Crea `src/components/ReconciliationLab.jsx` (componente di prova, da eliminare a fine capitolo):

```jsx title="src/components/ReconciliationLab.jsx"
import { useState } from "react";

function OperationCounter({ accountName }) {
  const [count, setCount] = useState(0);

  return (
    <p>
      Operazioni annotate per {accountName}: {count}{" "}
      <button type="button" onClick={() => setCount((prev) => prev + 1)}>
        +1
      </button>
    </p>
  );
}

function ReconciliationLab() {
  const [isSavings, setIsSavings] = useState(false);
  const accountName = isSavings ? "Conto Risparmio" : "Conto Corrente";

  return (
    <section>
      <button type="button" onClick={() => setIsSavings((prev) => !prev)}>
        Cambia conto
      </button>
      <OperationCounter accountName={accountName} />
    </section>
  );
}

export default ReconciliationLab;
```

Aggiungilo temporaneamente a `src/App.jsx` (`import ReconciliationLab from "./components/ReconciliationLab.jsx";` e `<ReconciliationLab />` sopra `<Dashboard />`).

### Esperimento 1 — stesso tipo, stessa posizione
Premi `+1` tre volte, poi "Cambia conto".

Il testo passa da "Conto Corrente" a "Conto Risparmio", ma il contatore **resta a 3**. Per React in quella posizione c'è sempre un `OperationCounter`: aggiorna la prop e conserva lo state.

### Esperimento 2 — tipo diverso nella stessa posizione
Sostituisci la riga `<OperationCounter accountName={accountName} />` con:

```jsx
{isSavings ? (
  <div>
    <OperationCounter accountName={accountName} />
  </div>
) : (
  <OperationCounter accountName={accountName} />
)}
```

Premi `+1` tre volte, poi "Cambia conto": il contatore **torna a 0**. Nella stessa posizione prima c'era un `OperationCounter`, ora c'è un `<div>`: tipo diverso, quindi React butta via il vecchio sottoalbero. Un contenitore aggiunto "solo per il layout" basta ad azzerare lo state di ciò che contiene.

### Esperimento 3 — `key` diversa
Ripristina la riga singola e aggiungi la `key`:

```jsx
<OperationCounter key={accountName} accountName={accountName} />
```

Premi `+1` tre volte, poi "Cambia conto": il contatore **torna a 0**, questa volta perché lo hai chiesto tu. Con una `key` diversa React considera il componente un altro componente.

### Guardare la riconciliazione nel browser
Apri gli strumenti di sviluppo (`F12`), tab *Elements*, ed espandi l'albero fino al paragrafo del laboratorio. I nodi che il browser modifica vengono evidenziati per un istante.

- Nell'esperimento 1, al click su "Cambia conto" lampeggia solo il testo del nome del conto.
- Negli esperimenti 2 e 3 lampeggia l'intero paragrafo: è stato rimosso e ricreato.

**Cosa fa.** Mostra le due regole in azione su un componente con state.

**Perché funziona.** React decide che cosa conservare guardando *tipo* e *posizione*; `key` gli dà un'informazione in più sull'identità.

**Errori da evitare.** Non usare `key` per "forzare un aggiornamento": un cambio di state basta. La `key` serve quando il componente deve davvero ripartire da capo.

---

## 🏦 LipariBank in action

Applichiamo quanto visto alla dashboard.

**Il pulsante "Nascondi saldi".** Con il tab *Elements* aperto, espandi `BalanceCard` e una `AccountCard`, poi premi "Nascondi saldi". Nel capitolo precedente hai visto che `Dashboard` e tutti i suoi figli vengono rieseguiti; ora osserva che nel DOM cambia **soltanto il testo dei saldi** (e l'etichetta del pulsante). Intestazione, IBAN e conteggio dei movimenti non vengono toccati: le loro descrizioni sono identiche a prima.

**Il rendering condizionale non sposta gli altri elementi.** In `BalanceCard` hai scritto:

```jsx
{note && <p className="balance-card__meta">{note}</p>}
```

Quando `note` manca, l'espressione vale un valore "vuoto" che occupa comunque il suo posto tra i figli. Gli elementi vicini restano nella stessa posizione, quindi React non li confonde tra loro. È il motivo per cui questo schema è sicuro.

**Le card dei conti.** In `AccountList` ogni `AccountCard` ha `key={account.id}`: se un giorno l'elenco verrà riordinato, React sposterà i nodi esistenti invece di ricrearli.

---

## 🧪 Your Turn

**Obiettivo:** prevedere che cosa React conserva e che cosa ricrea, poi verificarlo.

**Requisiti:**
1. Per ciascuno dei tre esperimenti scrivi **prima** la tua previsione (il contatore resta o si azzera?) e poi verificala.
2. In `Dashboard`, con *Elements* aperto, premi "Nascondi saldi" e annota quali nodi vengono evidenziati.
3. In `src/components/AccountList.jsx` sostituisci temporaneamente `key={account.id}` con `key={Math.random()}`, premi di nuovo "Nascondi saldi" e osserva che cosa cambia in *Elements*. Poi ripristina `key={account.id}`.
4. Elimina `ReconciliationLab.jsx` e il suo uso in `App.jsx`.

**Passi suggeriti:**
1. Usa una tabella su carta con tre colonne: esperimento, previsione, risultato.
2. Per il punto 3 guarda le card dei conti, non il saldo totale.

**Risultato atteso:** nei punti 1 e 2 ritrovi i comportamenti descritti nel capitolo. Nel punto 3, con la `key` casuale, **tutte le card dei conti vengono evidenziate per intero** a ogni click: React le distrugge e le ricrea, perché a ogni render la loro identità è diversa.

**Criteri di completamento:**
- Sai spiegare a parole perché l'esperimento 1 conserva il contatore e l'esperimento 2 no.
- `AccountList` usa di nuovo `key={account.id}`.
- `ReconciliationLab.jsx` non esiste più e `npm run lint` non segnala errori.

---

## ⚠️ Common Mistakes

| Errore | Sintomo | Correzione |
|---|---|---|
| Pensare che "re-render" significhi "il DOM viene riscritto" | Ottimizzazioni premature | Il DOM cambia solo dove le descrizioni differiscono |
| Avvolgere un componente in un `<div>` solo in certi casi | Il suo state si azzera | Mantieni la stessa struttura; cambia classi o props, non il tipo del contenitore |
| `key={Math.random()}` o `key={Date.now()}` | Tutto viene ricreato a ogni render, i campi perdono testo e focus | Usa un'identità stabile, come l'`id` del dato |
| Aspettarsi che cambiare le props azzeri lo state | Dati del "vecchio" conto mostrati per quello nuovo | Aggiungi una `key` legata all'oggetto a cui il componente si riferisce |
| Definire un componente dentro un altro componente | Lo state si azzera a ogni render del padre | Definisci ogni componente a livello di file |

---

## ✅ Checklist
- ☐ So spiegare che cosa sono gli elementi React e che cos'è il Virtual DOM.
- ☐ So descrivere la riconciliazione e in quale fase viene toccato il DOM.
- ☐ Conosco le due regole: tipo diverso si ricrea, stesso tipo si aggiorna.
- ☐ So perché lo state è legato alla posizione nell'albero.
- ☐ So usare `key` per azzerare di proposito un componente.
- ☐ Ho eliminato `ReconciliationLab.jsx` e ripristinato la `key` di `AccountList`.

---

## 🚀 Challenge
Prima di eliminare il laboratorio, sposta la definizione di `OperationCounter` **dentro** la funzione `ReconciliationLab` (rimuovi `key`, se l'avevi lasciata). Premi `+1` e poi "Cambia conto": il contatore si azzera sempre. Spiega perché usando la prima regola. Suggerimento: a ogni render di `ReconciliationLab` viene creata una *nuova* funzione `OperationCounter`, quindi per React il tipo in quella posizione è ogni volta diverso.

---

## 📌 Recap
- Un componente restituisce **elementi React**: oggetti che descrivono la UI. Il loro albero è il **Virtual DOM**.
- La **riconciliazione** confronta il nuovo albero con il precedente; nel *commit* React applica al DOM solo le differenze.
- Tipo diverso nella stessa posizione: il sottoalbero viene ricreato e lo state si perde.
- Stesso tipo nella stessa posizione: nodo e state restano, cambiano solo props e attributi.
- `key` definisce l'identità: nelle liste evita confusione, fuori dalle liste permette di azzerare un componente.

---

### ➡️ Next
[Capitolo 05 — Immutabilità dello State](./05_Immutabilita_dello_State.md): finora lo state era un boolean; con oggetti e array (i movimenti!) serve una regola in più, che nasce proprio dal modo in cui React confronta i valori.
