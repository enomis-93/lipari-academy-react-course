# 🏦 LipariBank — React Zero to Hero

> **Day 4 · Capitolo 07**
> **Argomento:** `useRef` e focus
> **Durata stimata:** 30 minuti
> **Parte di LipariBank:** accesso rapido al campo importo del bonifico simulato

---

## 🎯 Obiettivo

- Creare una ref e collegarla a un elemento del DOM.
- Spostare il focus in risposta a un'azione dell'utente.
- Distinguere una ref dallo state.

---

## 📋 Prerequisiti

- [Checkpoint del Day 4](./06_Repository_Checkpoint.md): `TransferForm` funzionante.
- Conoscere `useState` e i form controllati.

---

## 🧭 In questo capitolo

- Ref e ciclo di vita del DOM.
- Focus sul campo importo.
- Differenze rispetto allo state e verifica da tastiera.

---

## 🧠 Theory

`useRef(initialValue)` restituisce lo stesso oggetto tra i render. React assegna il nodo DOM a `ref.current` quando monta l'elemento e lo riporta a `null` quando lo rimuove. Modificare `current` non provoca un render: non usarlo per dati che devono aggiornare la schermata. Per quelli usa lo state.

> 💡 **Remember**
>
> Usa le ref per necessità imperative, come focus, misure o identificativi di timer. Non leggere o modificare `current` durante il rendering; usa un handler o un effect. Mantieni i valori del form controllati da React.

---

## 💻 Let's Code

In `src/components/TransferForm.jsx`, aggiungi `useRef` all'import di React e crea la ref dentro `TransferForm`, prima del `return`:

```jsx
import { useRef, useState } from "react";
```

```jsx
const amountRef = useRef(null);
```

Nell'input esistente con `id="amount"` aggiungi la prop `ref={amountRef}` senza rimuovere `value`, `onChange` e le altre prop. Nello stesso form, prima dell'input, aggiungi:

```jsx
<button type="button" onClick={() => amountRef.current?.focus()}>
  Vai al campo importo
</button>
```

Il pulsante non invia il form: al clic legge il nodo montato e chiama `focus()`. L'optional chaining gestisce il caso in cui il nodo non sia montato. Il valore resta nello state e la validazione resta invariata.

---

## 🏦 LipariBank in action

Il cliente può raggiungere rapidamente l'importo senza perdere i dati già digitati. Questo non cambia l'importo né esegue un bonifico.

---

## 🧪 Your Turn

**Obiettivo:** aggiungere e verificare il collegamento.

**Requisiti:**

- Il pulsante è `type="button"`; l'input rimane controllato.
- Il focus raggiunge l'input anche usando la tastiera.

**Passi suggeriti:**

1. Aggiungi import, ref, prop e pulsante al form.
2. Inserisci un valore, attiva il pulsante e verifica che il valore rimanga.
3. Esegui `npm run lint` e `npm run build` in `liparibank/`.

**Risultato atteso:** il cursore si trova nell'importo e non viene creato alcun movimento.

**Criteri di completamento:** focus visibile; submit e validazione funzionano ancora.

---

## ⚠️ Common Mistakes

- **Usare `current` per mostrare dati:** usa `useState`, perché la ref non scatena render.
- **Dimenticare `type="button"`:** il pulsante dentro un form può inviarlo.
- **Usare `focus()` durante il render:** chiamalo nell'handler, quando il DOM esiste.

---

## ✅ Checklist

- ☐ Ho collegato la ref all'input.
- ☐ Ho verificato il focus e il form da tastiera.
- ☐ Ho verificato lint e build.

---

## 🚀 Challenge

Con una seconda ref aggiungi un collegamento al campo causale, senza duplicare lo state.

---

## 📌 Recap

- Una ref conserva un riferimento tra i render.
- `current` non provoca render.
- Focus e validazione hanno responsabilità separate.

---

### ➡️ Next

[Day 5 · Side Effects](../Day_05_Effects_API/01_Side_Effects.md): impariamo a sincronizzare React con sistemi esterni.
