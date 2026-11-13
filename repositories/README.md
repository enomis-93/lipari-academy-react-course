# Checkpoint di LipariBank

Ogni cartella è il progetto `liparibank/` com'è **alla fine** di una giornata del corso, ricostruito applicando il codice dei capitoli. Sono progetti Vite autonomi: nessuno dipende dagli altri.

| Cartella | Stato del progetto | Archivio per gli studenti |
|---|---|---|
| `Day_00` | Progetto Vite ridotto alla pagina minima | `liparibank-day-00.zip` |
| `Day_01` | Prima dashboard statica | `liparibank-day-01.zip` |
| `Day_02` | Componenti riutilizzabili per conti e movimenti | `liparibank-day-02.zip` |
| `Day_03` | Selezione del conto, filtri, ricerca, preferiti | `liparibank-day-03.zip` |
| `Day_04` | Form del bonifico simulato con validazione | `liparibank-day-04.zip` |
| `Day_05` | Movimenti caricati in modo asincrono | `liparibank-day-05.zip` |
| `Day_06` | Applicazione a più pagine con React Router | `liparibank-day-06.zip` |
| `Day_07` | Stato condiviso nello store Redux, preferenze in un Context | `liparibank-day-07.zip` |
| `Day_08` | Custom hooks, service layer, Error Boundary, struttura finale | `liparibank-day-08.zip` |
| `Day_09` | Soluzione del progetto finale | `liparibank-day-09.zip` |
| `Extra_Legacy_React` | Progetto di fine Day 6 con il laboratorio `src/legacy/` | `liparibank-extra-legacy.zip` |

Il punto di partenza di un giorno è il checkpoint del giorno precedente. Il modulo extra React Legacy parte dal Day 6 e non è un prerequisito del Day 7.

## Provare un checkpoint

Serve Node.js 22 LTS (22.12 o successivo). Dentro la cartella del checkpoint:

```bash
npm install
```

```bash
npm run dev
```

`npm run lint` e `npm run build` devono terminare senza errori.

## Verificarli tutti e creare gli archivi

Dalla cartella principale della repository:

```bash
npm run checkpoints:verify
```

```bash
npm run checkpoints:zip
```

Gli archivi finiscono in `checkpoints-zip/`, senza `node_modules` e `dist`, e si allegano alla giornata corrispondente su Moodle.

## Regola di manutenzione

Un checkpoint deve coincidere con ciò che lo studente ottiene seguendo i capitoli. Se un capitolo cambia il codice del progetto, la stessa modifica va portata nel checkpoint di quel giorno e in tutti i successivi. `npm run check` segnala i file citati nei capitoli che nessun checkpoint contiene.
