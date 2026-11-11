# 🏦 LipariBank — React Zero to Hero

> **Day 0 · Capitolo 03**
> **Argomento:** Visual Studio Code
> **Durata stimata:** 30 minuti
> **Parte di LipariBank:** l'editor in cui scriverai tutto il codice di LipariBank

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:

- installare Visual Studio Code e aprire una cartella come workspace;
- usare il terminale integrato per eseguire `node` e `npm`;
- installare poche estensioni utili e configurare formattazione automatica e indentazione;
- eseguire un semplice file JavaScript da VS Code.

---

## 📋 Prerequisiti
- [Capitolo 02](./02_Node_NPM.md): Node.js 22 LTS installato (`node --version` funziona).
- La cartella `corso-react` creata nel [capitolo 01](./01_Introduzione_al_corso.md).

---

## 🧭 In questo capitolo
- installazione di VS Code;
- aprire una cartella (workspace) e il terminale integrato;
- estensioni consigliate, senza eccessi;
- formattazione automatica e impostazioni utili;
- scorciatoie essenziali.

---

## 🧠 Theory

### Editor e workspace
Visual Studio Code (VS Code) è un editor gratuito, multipiattaforma, con terminale integrato e supporto Git. In VS Code non si aprono singoli file, ma **cartelle**: la cartella aperta è il tuo *workspace*. Per il corso aprirai `corso-react/` e, dal capitolo 05, la cartella del progetto `liparibank/`.

### Terminale integrato
Il terminale integrato si apre già posizionato nella cartella del workspace. Questo evita molti errori del tipo "comando lanciato nella cartella sbagliata" (la causa più frequente di `npm` che non trova `package.json`).

### Estensioni: poche e utili
Più estensioni installi, più l'editor è lento e confuso. Per il corso bastano:

| Estensione | Perché |
|---|---|
| **Prettier - Code formatter** | Formatta il codice in modo uniforme a ogni salvataggio |
| **Oxc** (facoltativa) | Mostra nell'editor gli avvisi di oxlint, il linter del template Vite 8 |
| **ES7+ React/Redux/React-Native snippets** (facoltativa) | Scorciatoie per scrivere componenti più in fretta; utile solo dopo il Day 1 |

> 💡 **Remember**
>
> Gli snippet sono una comodità, non un requisito. Durante i primi Day scrivi i componenti a mano: capirai meglio come funzionano.

---

## 💻 Let's Code

### 1. Installare VS Code
Scarica l'installer per il tuo sistema operativo dal sito ufficiale `https://code.visualstudio.com` e installalo con le opzioni predefinite. Su Windows lascia attive le opzioni "Add to PATH" e "Open with Code": servono per il comando `code`. Su Linux usa il pacchetto `.deb`/`.rpm` ufficiale o lo store della tua distribuzione.

### 2. Aprire la cartella di lavoro
Avvia VS Code, poi dal menu scegli **File → Open Folder...** (su macOS: **File → Open...**) e seleziona `corso-react`. Se vuoi farlo da terminale, da dentro `corso-react/`:

```bash
code .
```

Se il comando `code` non è riconosciuto: su macOS apri la Command Palette (`Cmd+Shift+P`) ed esegui **Shell Command: Install 'code' command in PATH**; su Windows reinstalla VS Code attivando "Add to PATH".

### 3. Aprire il terminale integrato
Dal menu scegli **Terminal → New Terminal** (la scorciatoia è ``Ctrl+` ``, cioè il tasto backtick, scomodo su alcune tastiere italiane: il menu va benissimo). Si apre un pannello in basso, già nella cartella `corso-react`. Verifica:

```bash
node --version
```

Se vedi `v22.x.x` (o superiore a 22.12), VS Code usa lo stesso Node.js del tuo sistema. Se hai appena installato Node.js e il comando fallisce, chiudi **tutte** le finestre di VS Code e riaprile.

Su Windows il terminale predefinito è PowerShell. Se compare l'errore sugli script disabilitati, vedi la sezione *Common Mistakes* del [capitolo 02](./02_Node_NPM.md).

### 4. Installare le estensioni
Apri il pannello Extensions (`Ctrl+Shift+X`), cerca il nome e premi **Install**. Oppure, da terminale:

```bash
code --install-extension esbenp.prettier-vscode
```

L'identificativo `esbenp.prettier-vscode` è quello di Prettier. Per Oxc e per gli snippet cerca nel pannello Extensions "Oxc" e "ES7+ React/Redux/React-Native snippets", controllando che l'editore sia quello ufficiale.

### 5. Configurare formattazione e indentazione
Apri la Command Palette (`Ctrl+Shift+P`, su macOS `Cmd+Shift+P`), esegui **Preferences: Open User Settings (JSON)** e aggiungi queste impostazioni dentro le parentesi graffe principali:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "files.autoSave": "onFocusChange",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

Se il file contiene già altre impostazioni, aggiungi queste righe separandole con una virgola, senza duplicare le parentesi graffe esterne. Cosa fanno:

- `editor.formatOnSave` e `editor.defaultFormatter`: a ogni salvataggio Prettier riformatta il file;
- `editor.tabSize`: indentazione a 2 spazi, lo standard dei progetti React;
- `files.autoSave`: salva quando cambi file o finestra;
- `emmet.includeLanguages`: abilita le abbreviazioni Emmet (come `div.card` + `Tab`) anche nei file JSX.

> ℹ️ Il template Vite usa virgolette singole e niente punto e virgola; Prettier di default usa virgolette doppie e punto e virgola. Il corso usa lo stile di Prettier: se formatti un file del template, vedrai queste differenze. Non è un errore.

### 6. Eseguire un file JavaScript
Nel pannello Explorer (a sinistra) crea un file `prova.js` dentro `corso-react/` con questo contenuto:

```javascript
const cliente = "Mario Rossi";
const saldo = 4250.75;

console.log(`Cliente: ${cliente} — saldo: ${saldo} EUR`);
```

Salvalo e, nel terminale integrato, dentro `corso-react/`:

```bash
node prova.js
```

Output atteso:

```text
Cliente: Mario Rossi — saldo: 4250.75 EUR
```

Il codice usa un *template literal* (le virgolette inverse) per inserire variabili in una stringa. Se in salvataggio il file viene riformattato, Prettier è attivo.

### 7. Scorciatoie essenziali

| Azione | Windows / Linux | macOS |
|---|---|---|
| Command Palette | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| Apri file per nome | `Ctrl+P` | `Cmd+P` |
| Cerca nei file | `Ctrl+Shift+F` | `Cmd+Shift+F` |
| Terminale | ``Ctrl+` `` | ``Ctrl+` `` |
| Commenta riga | `Ctrl+/` | `Cmd+/` |
| Salva | `Ctrl+S` | `Cmd+S` |

---

## 🏦 LipariBank in action
Nel capitolo 05 aprirai in VS Code la cartella `liparibank/` e userai il terminale integrato per lanciare `npm run dev`. L'editor, con Prettier attivo, manterrà il codice dei componenti ordinato e coerente con gli esempi del corso. Tieni sempre aperti **un terminale per il server** (`npm run dev`) e **un secondo terminale** per Git e altri comandi (pulsante `+` nel pannello terminale).

---

## 🧪 Your Turn
**Obiettivo:** avere VS Code pronto per lavorare.

**Requisiti:**
1. Installa VS Code e aprilo sulla cartella `corso-react`.
2. Apri il terminale integrato ed esegui `node --version`.
3. Installa Prettier e imposta `editor.formatOnSave` come mostrato.
4. Crea `prova.js` con 3 variabili a tua scelta (nome cliente, saldo, IBAN fittizio) e stampale con `console.log`; scrivilo volutamente con indentazione e spazi disordinati.
5. Salva: verifica che Prettier riformatti il file. Poi esegui `node prova.js`.

**Suggerimento:** se il formato non cambia, apri la Command Palette ed esegui **Format Document With...** e scegli Prettier come formatter predefinito.

**Risultato atteso:** il file viene riformattato al salvataggio e `node prova.js` stampa le tue variabili.

**Criteri di completamento:** terminale integrato funzionante, Prettier attivo, file eseguito con Node.

---

## ⚠️ Common Mistakes
- **Aprire un singolo file invece della cartella:** il terminale parte in una cartella inattesa. Apri sempre la cartella del progetto.
- **Terminale nella cartella sbagliata:** controlla il percorso mostrato nel prompt prima di lanciare `npm`. Con `pwd` (macOS/Linux/PowerShell) vedi dove ti trovi.
- **Più formatter in conflitto:** se il formato cambia in modo strano, controlla che `editor.defaultFormatter` sia Prettier e di non avere altri formatter attivi.
- **Troppe estensioni:** installa solo quelle necessarie; ogni estensione rallenta l'avvio e può modificare il codice.
- **VS Code non vede il nuovo Node.js:** chiudi tutte le finestre di VS Code, non solo il terminale.

---

## ✅ Checklist
- ☐ VS Code è installato e apre la cartella `corso-react`.
- ☐ Il terminale integrato esegue `node --version` correttamente.
- ☐ Prettier è installato e il file viene formattato al salvataggio.
- ☐ So aprire la Command Palette e il file `settings.json` utente.
- ☐ Ho eseguito `node prova.js` con successo.

---

## 🚀 Challenge
Apri un secondo terminale con il pulsante `+`, rinominalo e usa `Ctrl+Shift+P → Preferences: Open Keyboard Shortcuts` per scoprire la scorciatoia di **Toggle Terminal**. Poi elimina `prova.js` o spostalo in una cartella `esperimenti/`.

---

## 📌 Recap
- In VS Code si apre sempre una cartella, il workspace; il terminale integrato parte da lì.
- Bastano poche estensioni: Prettier (necessaria), Oxc e gli snippet (facoltative).
- `formatOnSave` con Prettier e `tabSize` a 2 danno codice uniforme.
- `node nomefile.js` esegue un file JavaScript direttamente dal terminale.

---

### ➡️ Next
[Capitolo 04 — Git e GitHub](./04_Git_GitHub.md): configurerai Git, creerai il tuo repository GitHub e farai il primo commit e push.
