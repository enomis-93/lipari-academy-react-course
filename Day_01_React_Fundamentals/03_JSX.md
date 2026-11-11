# 🏦 LipariBank — React Zero to Hero

> **Day 1 · Capitolo 03**
> **Argomento:** JSX
> **Durata stimata:** 25 minuti
> **Parte di LipariBank:** la sintassi con cui descriveremo ogni elemento della dashboard

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- scrivere JSX valido rispettando le sue regole (radice unica, `className`, tag chiusi);
- inserire valori JavaScript nel JSX con `{ }`;
- applicare stili inline con oggetti JavaScript;
- individuare e correggere gli errori di JSX più frequenti.

---

## 📋 Prerequisiti
- [Day 1 · Struttura del progetto](./02_Struttura_del_progetto.md).
- Dev server acceso (`npm run dev` dentro `liparibank/`).
- Utile: [Extra · Optional Chaining e Ternary](../Extra_JavaScript_Essentials/08_Optional_Chaining_Ternary.md).

---

## 🧭 In questo capitolo
- Che cos'è il JSX.
- Radice unica e fragment.
- `className`, `htmlFor` e attributi in camelCase.
- Tag auto-chiudenti.
- Espressioni `{ }`, stili inline, commenti.
- Esercizio di correzione del JSX.

---

## 🧠 Theory

### Che cos'è il JSX
Il **JSX** è una sintassi che assomiglia all'HTML ma vive dentro JavaScript. Non è compreso dal browser: gli strumenti di build (qui Vite) lo trasformano in normali chiamate JavaScript. Per questo valgono le regole di JavaScript, non quelle di HTML.

### Le regole fondamentali

1. **Un solo elemento radice.** Un componente restituisce un unico elemento. Per restituirne più di uno usa un contenitore oppure un **Fragment** `<>...</>` (non aggiunge nodi al DOM).
2. **Tutti i tag vanno chiusi.** I tag senza contenuto si scrivono auto-chiudenti: `<input />`, `<img />`, `<br />`.
3. **`className` al posto di `class`**, **`htmlFor` al posto di `for`**. Gli altri attributi sono in camelCase: `tabIndex`, `onClick`, `maxLength`.
4. **Espressioni JavaScript tra graffe** `{ }`: variabili, chiamate di funzione, operazioni, ternari. Non puoi inserire *istruzioni* (`if`, `for`).
5. **Stili inline come oggetto**: `style={{ color: "green" }}` (le graffe esterne sono JSX, le interne sono l'oggetto), con proprietà in camelCase (`backgroundColor`).
6. **Commenti** dentro il JSX: `{/* commento */}`.
7. **Componenti con la maiuscola**: `<Header />` è un componente, `<header>` è un tag HTML.

> 💡 **Remember**
>
> `{ }` significa "qui dentro c'è JavaScript". Dove React si aspetta del testo o degli elementi puoi usare qualunque *espressione* che produca un valore.

### Cosa si può renderizzare
Stringhe e numeri vengono mostrati. `true`, `false`, `null` e `undefined` **non** producono nulla. Un oggetto "semplice" (come `{ id: 1 }`) **non** si può mettere come figlio: React segnala un errore.

---

## 💻 Let's Code

Per sperimentare modifica temporaneamente `src/App.jsx`: nei prossimi capitoli lo sostituiremo con la dashboard vera.

### Radice unica e Fragment
Non valido (due radici):

```jsx
function App() {
  return (
    <h1>LipariBank</h1>
    <p>Dashboard</p>
  );
}
```

Valido, con Fragment:

```jsx
function App() {
  return (
    <>
      <h1>LipariBank</h1>
      <p>Dashboard</p>
    </>
  );
}

export default App;
```

### Espressioni, attributi e stili
Codice completo per `src/App.jsx`:

```jsx
function App() {
  const firstName = "Mario";
  const lastName = "Rossi";
  const balance = 4250.75;
  const isActive = true;

  const statusStyle = {
    color: isActive ? "green" : "crimson",
    fontWeight: "bold",
  };

  return (
    <>
      {/* Intestazione */}
      <h1 className="title">LipariBank</h1>
      <p>
        Cliente: {firstName} {lastName}
      </p>
      <p>Saldo (arrotondato): {Math.round(balance)} €</p>
      <p style={statusStyle}>{isActive ? "Conto attivo" : "Conto sospeso"}</p>

      <label htmlFor="note">Nota</label>
      <input id="note" type="text" placeholder="Scrivi una nota" />
    </>
  );
}

export default App;
```

**Cosa fa.** Dichiara alcune costanti prima del `return` (qui puoi usare qualsiasi istruzione JavaScript) e le inserisce nel JSX con `{ }`.

**Perché funziona.** Ogni `{ ... }` contiene una espressione: un nome di variabile, una chiamata a `Math.round`, un ternario. Lo stile è un oggetto con proprietà camelCase.

**Come modificarlo.** Cambia `isActive` in `false` e osserva testo e colore. Aggiungi un secondo attributo a `<p>`, ad esempio `title="Stato del conto"`.

**Errori da evitare.** `style="color: green"` (stringa) non è valido in JSX; `{ if (...) ... }` non è permesso, usa il ternario.

### Cosa non si può mettere tra graffe
Snippet **non valido** (a scopo dimostrativo):

```jsx
const account = { name: "Conto Corrente", balance: 4250.75 };

// <p>{account}</p>   → errore: un oggetto non è un figlio valido
```

Versione corretta, accedendo alle proprietà:

```jsx
<p>
  {account.name}: {account.balance}
</p>
```

---

## 🏦 LipariBank in action
Il componente `Header` della dashboard mostrerà il nome del cliente. Con ciò che hai appena imparato potresti già scrivere:

```jsx
<header className="header">
  <h1 className="header__brand">LipariBank</h1>
  <p className="header__name">Cliente: {customer.firstName} {customer.lastName}</p>
</header>
```

Nota `className` e le due espressioni sulla stessa riga: lo spazio tra `}` e `{` viene mantenuto. Nel [capitolo 04](./04_Function_Components.md) lo trasformeremo in un componente con i dati veri.

---

## 🧪 Your Turn

**Obiettivo:** correggere del JSX non valido.

**Requisiti.** Il codice seguente (**non valido volutamente**) contiene **8 errori**. Copialo in `src/App.jsx`, correggi tutto finché la pagina non mostra il risultato atteso senza errori nel terminale e nella console.

```jsx
function App() {
  return (
    <h1 class="title">LipariBank</h1>
    <p>Saldo: <b>4.250,75 €<b></p>
    <label for="importo">Importo</label>
    <input id="importo" type="text">
    <div style="color: green; font-size: 14px">Conto attivo</div>
    <!-- fine pagina -->
  );
}
```

**Passi suggeriti**
- Leggi il messaggio d'errore di Vite: indica file e riga.
- Conta le radici, controlla ogni tag aperto, ogni attributo e il commento.
- Controlla anche la riga finale del file: manca qualcosa che `main.jsx` si aspetta.

**Risultato atteso:** titolo, riga del saldo in grassetto, campo "Importo" con etichetta collegata e un testo verde "Conto attivo".

**Criteri di completamento:** nessun errore a video, `npm run lint` senza errori, etichetta cliccabile (cliccando su "Importo" il campo prende il focus).

> ⚠️ **Prova prima da solo**
>
> La soluzione è qui sotto: guardala solo dopo aver tentato.

Elenco degli errori: radice multipla, `class`, `<b>` non chiuso, `for`, `<input>` non auto-chiuso, `style` come stringa, commento HTML, `export default` mancante. Soluzione:

```jsx
function App() {
  return (
    <>
      <h1 className="title">LipariBank</h1>
      <p>
        Saldo: <b>4.250,75 €</b>
      </p>
      <label htmlFor="importo">Importo</label>
      <input id="importo" type="text" />
      <div style={{ color: "green", fontSize: "14px" }}>Conto attivo</div>
      {/* fine pagina */}
    </>
  );
}

export default App;
```

---

## ⚠️ Common Mistakes
- **`class` e `for`** → usa `className` e `htmlFor`.
- **Dimenticare la chiusura di un tag** (`<input>`, `<img>`, `<br>`) → `<input />`.
- **Due elementi radice** → Fragment `<>...</>`.
- **Oggetto come figlio** (`{account}`) → mostra le singole proprietà.
- **`style` come stringa** → oggetto con doppie graffe e camelCase.
- **Commento `//` o `<!-- -->` nel JSX** → `{/* ... */}`.
- **Parentesi dopo `return` omesse** su più righe: se il JSX inizia sulla riga successiva a `return`, racchiudilo tra `( )`.

---

## ✅ Checklist
- ☐ So perché serve un solo elemento radice e cos'è un Fragment.
- ☐ Uso `className`, `htmlFor` e tag auto-chiudenti.
- ☐ So inserire variabili ed espressioni con `{ }`.
- ☐ So scrivere uno stile inline come oggetto.
- ☐ Ho corretto tutti gli 8 errori dell'esercizio.

---

## 🚀 Challenge
Aggiungi al tuo `App.jsx` di prova una lista `<ul>` con tre `<li>` che mostrano i nomi dei beneficiari fittizi (Giulia Bianchi, Luca Verdi, Condominio Lipari (fittizio)) prelevati da un array dichiarato nel componente e scritti con tre espressioni `{ }` separate (`names[0]`, `names[1]`, `names[2]`). Nel Day 2 vedremo un modo migliore.

---

## 📌 Recap
- Il JSX è JavaScript, non HTML: ha regole proprie.
- Radice unica (o Fragment), tag sempre chiusi, `className`/`htmlFor`.
- `{ }` accetta espressioni, non istruzioni.
- Gli stili inline sono oggetti con proprietà camelCase.
- Commenti nel JSX: `{/* ... */}`.

---

### ➡️ Next
Prossimo capitolo: [Function Components](./04_Function_Components.md). Ora che sai scrivere JSX, lo mettiamo dentro componenti separati, esportati e importati tra file.
