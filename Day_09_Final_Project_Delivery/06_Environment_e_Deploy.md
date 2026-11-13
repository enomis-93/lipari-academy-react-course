# 🏦 LipariBank — React Zero to Hero

> **Day 9 · Capitolo 06**
> **Argomento:** Environment e Deploy
> **Durata stimata:** 60 minuti
> **Parte di LipariBank:** variabili d'ambiente, build di produzione, anteprima locale e preparazione al deploy statico

---

## 🎯 Obiettivo
Alla fine del capitolo sarai in grado di:
- usare variabili d'ambiente Vite (`import.meta.env.VITE_*`) senza esporre segreti;
- configurare `.env.example` e `.gitignore` in modo sicuro;
- generare la build con `npm run build` e provarla con `npm run preview`;
- preparare un deploy statico (SPA fallback, `base`) e **verificarlo** quando lo esegui.

---

## 📋 Prerequisiti
- [Refactoring e test manuale](./04_Refactoring_e_Test_Manuale.md) e [Accessibility e responsive](./05_Accessibility_e_Responsive.md) completati.
- [Git workflow](./03_Git_Workflow.md): `.gitignore`, mai fare il commit di `.env`.
- [Service Layer e API](../Day_08_Advanced_Hooks_Architecture/03_Service_Layer_e_Error_Boundary.md): `apiClient.js` che usa `import.meta.env.VITE_API_BASE_URL`.

---

## 🧭 In questo capitolo
- Come funzionano le variabili d'ambiente in Vite e perché **non** sono segrete.
- `.env`, `.env.example`, `.gitignore`.
- Build di produzione e preview locale.
- Deploy statico: cosa serve, SPA fallback, `base`.
- Come verificare un deploy e risolvere i problemi tipici.

---

## 🧠 Theory

### Variabili d'ambiente in Vite
Vite legge file `.env` e rende disponibili le variabili tramite `import.meta.env`. **Solo** quelle con prefisso `VITE_` vengono esposte al codice client:

| Variabile | Visibile nel codice React? |
|---|---|
| `VITE_API_BASE_URL` | sì (`import.meta.env.VITE_API_BASE_URL`) |
| `DB_PASSWORD` | no (non ha il prefisso) |

Valori sempre presenti: `import.meta.env.MODE`, `DEV` (true in sviluppo), `PROD` (true nella build), `BASE_URL` (percorso base dell'app, di default `/`).

File letti (dal meno al più specifico): `.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local`. Le variabili sono **sostituite nel codice al momento della build**: Se le cambi devi **rifare la build**; in sviluppo devi **riavviare** `npm run dev`. I valori scritti nei file `.env` sono sempre stringhe (anche `VITE_API_BASE_URL=` vuota è la stringa vuota).

> 💡 **Remember**
>
> Tutto ciò che finisce nel bundle del client è **pubblico**: chiunque apra gli strumenti del browser può leggerlo. Il prefisso `VITE_` non rende una variabile sicura, la rende *visibile*. **Mai** mettere password, token, chiavi API private in una variabile `VITE_*`. LipariBank non ha segreti: le variabili sono solo configurazione.

### Cosa si versiona
| File | Nel repository? | Contenuto |
|---|---|---|
| `.env.example` | **sì** | nomi delle variabili, valori d'esempio non sensibili |
| `.env` | **no** | i tuoi valori locali |
| `.env.local`, `.env.*.local` | **no** | valori locali per modo |

---

## 💻 Let's Code

### 1. `.env.example`
Crea `liparibank/.env.example`:

```text
VITE_API_BASE_URL=
VITE_APP_NAME=LipariBank
```

`VITE_API_BASE_URL` vuoto significa "usa i file statici in `public/data/`" (comportamento del Day 5/8). In futuro, con un back-end reale, qui andrebbe l'indirizzo del servizio: **solo l'indirizzo, mai credenziali**.

Crea la tua copia locale. Da PowerShell, dentro `liparibank/`:

```powershell
Copy-Item .env.example .env
```

Su macOS/Linux:

```bash
cp .env.example .env
```

### 2. Verifica `.gitignore` (obbligatorio)
Il template Vite genera un `.gitignore` che contiene `node_modules`, `dist` e `*.local` (quindi `.env.local`), ma **non** `.env`: va aggiunto. In fondo a `.gitignore` scrivi:

```text
.env
.env.*
!.env.example
```

Controlla che `.env` sia ignorato (deve stampare la regola che lo esclude):

```bash
git check-ignore -v .env
```

Controlla che `.env.example` **non** sia ignorato (nessun output = ok; senza `-v`, perché con `-v` Git stampa anche la regola di eccezione `!.env.example`):

```bash
git check-ignore .env.example
```

Controlla che nessun file sensibile sia già tracciato (nessun output = ok):

```bash
git ls-files .env node_modules dist
```

### 3. Usare le variabili
`src/components/Header.jsx` — snippet **parziale** (mantieni il resto del tuo componente):

```jsx
const appName = import.meta.env.VITE_APP_NAME || "LipariBank";
```

`src/services/apiClient.js` — snippet **parziale**; adatta al tuo file. L'idea: se `VITE_API_BASE_URL` è vuota, usa il percorso base dell'app (`BASE_URL`, senza `/` finale), così funziona anche in un sotto-percorso:

```javascript
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.BASE_URL.replace(/\/$/, "");
```

Con `base: "/"` il risultato è `""` (come prima); con `base: "/liparibank/"` diventa `"/liparibank"`, e l'URL costruito come `BASE_URL` + `/data/transactions.json` punta al posto giusto.

Dopo ogni modifica a `.env`, riavvia il server di sviluppo:

```bash
npm run dev
```

### 4. Build di produzione
Dentro `liparibank/`:

```bash
npm run build
```

Vite crea la cartella `dist/` con: `index.html`, una cartella `assets/` con JS e CSS con nome "hashato" (per la cache), e una copia del contenuto di `public/` (quindi anche `dist/data/*.json`). La build **fallisce** se ci sono errori di import o sintassi: leggi il messaggio, indica il file.

### 5. Anteprima locale
```bash
npm run preview
```

Il comando serve il contenuto di `dist/`, di default su `http://localhost:4173/` (se la porta è occupata Vite ne sceglie un'altra e la stampa nel terminale). Non è un server di produzione, ma è il modo più rapido per provare la build vera.

Verifica:
1. Apri la pagina e percorri le rotte; esegui i test principali del [test manuale](./04_Refactoring_e_Test_Manuale.md).
2. Scheda **Network**: ricarica; le richieste a `/data/transactions.json` e `/data/accounts.json` devono avere stato `200`; JS e CSS arrivano da `/assets/...`.
3. Apri `http://localhost:4173/transactions` direttamente e premi F5: deve aprirsi la pagina (la preview applica il fallback a `index.html`; **non** garantisce che il tuo hosting lo faccia).
4. Console senza errori.

Per **dimostrarti** che le variabili sono pubbliche, usa un valore riconoscibile: in `.env` imposta `VITE_APP_NAME=Nome-Prova-123`, rifai `npm run build` e cercalo nel bundle. PowerShell, dentro `liparibank/`:

```powershell
Select-String -Path dist\assets\*.js -Pattern "Nome-Prova-123" -List | Select-Object -ExpandProperty Path
```

Su macOS/Linux:

```bash
grep -rl "Nome-Prova-123" dist/assets
```

Il file JavaScript pubblicato compare nei risultati: lo stesso accadrebbe per qualsiasi valore `VITE_*`. Poi ripristina `VITE_APP_NAME=LipariBank` in `.env` e rifai la build. (Non cercare "LipariBank": il testo è già nel codice dell'interfaccia e la prova non dimostrerebbe nulla.)

### 6. Deploy statico: come si ragiona
Un'app React + Vite è, dopo la build, **solo file statici** (`dist/`). Serve un hosting statico (o un web server qualsiasi) che li pubblichi. I dettagli cambiano da servizio a servizio: segui la **documentazione ufficiale** di quello che scegli. Cosa ti serve sapere, in generale:

| Impostazione | Valore per LipariBank |
|---|---|
| Comando di build | `npm run build` |
| Cartella da pubblicare | `dist` |
| Versione di Node per la build | 22 LTS (Vite 8 richiede Node `^20.19.0` o `>=22.12.0`) |
| Variabili d'ambiente | si impostano nel pannello del servizio (o nella pipeline) **prima della build**; solo `VITE_*` non sensibili |
| Fallback SPA | necessario (vedi sotto) |

Alternative di pubblicazione: caricare a mano il contenuto di `dist/` su un hosting statico; collegare la repository a un servizio che esegue la build ad ogni push; servire `dist/` da un tuo web server.

> ⚠️ In questo corso **non** viene eseguito nessun deploy e non esiste un URL pubblico di riferimento: scegli tu il servizio, eseguilo e verifica con la checklist qui sotto.

### 7. SPA fallback (indispensabile con React Router)
Con `BrowserRouter` le rotte (`/transactions`, `/accounts/acc-001`) **non esistono come file**: esiste solo `index.html`. Se un utente apre direttamente `/transactions` o preme F5, il server cerca un file `transactions` e risponde 404. Serve una regola che **riscriva tutte le richieste che non corrispondono a un file reale verso `index.html`** (rewrite con stato 200). Ogni servizio la chiama in modo diverso: cerca nella sua documentazione "SPA fallback", "rewrite all routes to index.html" o simili.

Esempio per un web server Nginx tuo (solo per capire il principio):

```text
location / {
  try_files $uri /index.html;
}
```

Significa: se esiste un file con quel percorso servilo, altrimenti servi `index.html` e lascia che React Router mostri la pagina giusta (o la 404 dell'app).

### 8. `base` per sotto-percorsi (es. GitHub Pages)
Se l'app non è alla radice del dominio ma in un sotto-percorso (es. `https://<UTENTE>.github.io/<NOME_REPO>/`), Vite deve sapere il percorso base, altrimenti `index.html` richiede `/assets/...` e ottieni 404.

Opzione A — da riga di comando, senza toccare i file (`<NOME_REPO>` è il nome della tua repository):

```bash
npm run build -- --base=/<NOME_REPO>/
```

Opzione B — in `vite.config.js` (il tuo file generato può differire leggermente: aggiungi solo la riga `base`):

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/<NOME_REPO>/",
  plugins: [react()],
});
```

Sostituisci `<NOME_REPO>` con il nome reale (e le barre iniziale e finale restano). Servono anche due adattamenti del codice:

1. `src/main.jsx`: dì al router il percorso base:
   ```jsx
   <BrowserRouter basename={import.meta.env.BASE_URL}>
   ```
2. I `fetch` dei file in `public/` devono partire da `BASE_URL` (già gestito dal frammento di `apiClient.js` sopra).

Alcuni hosting statici **non offrono rewrite** (per esempio GitHub Pages, che serve solo file). Soluzioni tipiche: copiare `index.html` come `404.html` a fine build (se il servizio usa `404.html` come pagina di errore: controlla la sua documentazione), oppure usare `HashRouter` (URL con `#`). Controlla cosa supporta il servizio scelto e **ripeti la verifica dei deep link**.

---

## 🏦 LipariBank in action

### Verifica di un deploy (quando lo avrai eseguito)
Sostituisci `<URL_DEL_DEPLOY>` con l'indirizzo reale che il tuo servizio ti fornisce.

| # | Verifica | Esito atteso |
|---|---|---|
| 1 | Apri `<URL_DEL_DEPLOY>` | La dashboard compare con saldo totale `17.050,75 €` |
| 2 | Apri direttamente `<URL_DEL_DEPLOY>/transactions` | La pagina Movimenti si apre (no 404 del server) |
| 3 | Su `/transactions` premi F5 | La pagina resta Movimenti |
| 4 | Apri `<URL_DEL_DEPLOY>/accounts/acc-001` | Dettaglio del Conto Corrente |
| 5 | Apri `<URL_DEL_DEPLOY>/non-esiste` | La **404 dell'app**, con il layout |
| 6 | Network → ricarica | I file JSON di `/data/` rispondono `200`; JS/CSS da `assets/` senza 404 |
| 7 | Console | Nessun errore |
| 8 | Variabili d'ambiente | L'interfaccia mostra i valori attesi (per esempio il nome app); se un valore è `undefined`, rifai la build dopo aver impostato la variabile nel servizio |
| 9 | Esegui il bonifico di prova TC-27 | Funziona come in locale |

### Problemi tipici

| Sintomo | Causa probabile | Soluzione |
|---|---|---|
| Pagina bianca; in Network 404 su `/assets/...` | `base` mancante per sotto-percorso | imposta `base`, rifai la build |
| 404 aprendo `/transactions` o con F5 | manca il fallback SPA | configura il rewrite a `index.html` |
| Rotte che non si riconoscono in sotto-percorso | manca `basename={import.meta.env.BASE_URL}` | aggiungilo in `main.jsx` |
| Dati vuoti/errore; 404 (o `index.html` al posto del JSON) su `/data/transactions.json` | `fetch` non usa `BASE_URL` | correggi `apiClient.js` |
| `import.meta.env.VITE_...` è `undefined` | nome senza `VITE_`, `.env` non letto o build fatta prima di impostarla | rinomina, riavvia/rifai la build |
| La build funziona in locale ma fallisce sul servizio | versione di Node non compatibile | imposta Node 22 LTS |

---

## 🧪 Your Turn

**Obiettivo:** preparare e verificare la build di produzione e, se vuoi, eseguire un deploy statico.

**Requisiti**
1. Crea `.env.example` e `.env`; verifica con `git check-ignore -v .env` che `.env` sia ignorato e con `git ls-files` che nulla di sensibile sia tracciato.
2. Usa `VITE_APP_NAME` in `Header.jsx` con fallback e `BASE_URL` in `apiClient.js`.
3. Esegui `npm run build` senza errori; ispeziona `dist/` e annota i file prodotti.
4. Avvia `npm run preview` e verifica: rotte, deep link con F5, richieste JSON `200`, Console pulita.
5. Cerca un valore riconoscibile di `VITE_APP_NAME` nel bundle (vedi sopra) e scrivi una riga su cosa dimostra.
6. **Facoltativo:** scegli un hosting statico, esegui il deploy seguendo la sua documentazione e compila la tabella di verifica. Se non lo esegui, scrivilo onestamente nel README ("deploy non eseguito").
7. Committa `.env.example` e le modifiche (`chore: aggiunge .env.example`), **non** `.env` né `dist/`.

**Passi suggeriti**
- Fai prima la build senza `base`; aggiungi `base` solo se pubblichi in un sotto-percorso.
- Se cambi `.env`, riavvia `npm run dev` / rifai `npm run build`.

**Risultato atteso:** build verde, preview funzionante, repository senza segreti, `.env.example` versionato.

**Criteri di completamento:** `git status` non mostra `.env` né `dist/`; la tabella di verifica della preview è tutta ✅; la sezione deploy del README è veritiera.

---

## ⚠️ Common Mistakes
- **Variabile senza `VITE_`**: `import.meta.env.API_URL` è `undefined`.
- **Segreto in una `VITE_*`**: finisce nel bundle pubblico. Non farlo mai.
- **Committare `.env`**: aggiungilo a `.gitignore` *prima* di crearlo.
- **Dimenticare `!.env.example`** dopo `.env.*`: il file d'esempio verrebbe ignorato.
- **Cambiare `.env` senza riavviare/ricostruire**.
- **Pubblicare la cartella sbagliata** (`src/` o la radice invece di `dist/`).
- **Dare per scontato il fallback SPA** perché `preview` funziona: è l'hosting a doverlo garantire.
- **Dire "è online" senza averlo verificato** con la tabella sopra.

---

## ✅ Checklist
- ☐ `.env.example` committato; `.env` ignorato.
- ☐ Nessun segreto nel codice o nelle variabili `VITE_*`.
- ☐ `npm run build` e `npm run preview` funzionano.
- ☐ Deep link e F5 verificati nella preview.
- ☐ So spiegare SPA fallback e `base`.
- ☐ Se ho fatto il deploy: tabella di verifica compilata.

---

## 🚀 Challenge
Aggiungi `VITE_APP_ENV=development` in `.env.example` e mostra nel footer un'etichetta "Ambiente: development" solo quando `import.meta.env.DEV` è `true`.

---

## 📌 Recap
- Solo `VITE_*` arriva al client, ed è **pubblico**.
- Si versiona `.env.example`, non `.env`.
- `npm run build` → `dist/`; `npm run preview` (porta di default 4173) per provarlo.
- Un deploy statico richiede fallback SPA per i deep link e, in sotto-percorso, `base` + `basename`.
- Un deploy si dichiara riuscito solo dopo la verifica.

---

### ➡️ Next
Prossimo capitolo: [07 · README e consegna](./07_README_e_Consegna.md). Rendiamo il progetto comprensibile a chi lo apre per la prima volta e chiudiamo il percorso.
