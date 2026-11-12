import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { checkCourse } from "../check-course.mjs";

const fence = "```";
const sections = [
  "## 🎯 Obiettivo", "## 📋 Prerequisiti", "## 🧭 In questo capitolo", "## 🧠 Theory", "## 💻 Let's Code",
  "## 🏦 LipariBank in action", "## 🧪 Your Turn", "## ⚠️ Common Mistakes", "## ✅ Checklist", "## 🚀 Challenge", "## 📌 Recap",
];
const chapter = ({ skip = [], extra = "", next = true } = {}) =>
  "# Corso\n\n" +
  sections.filter((title) => !skip.some((word) => title.includes(word))).map((title) => `${title}\n\nTesto.\n`).join("\n") +
  `\n${extra}\n` +
  (next ? "### ➡️ Next\n\nAvanti.\n" : "");

function makeCourse(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "check-"));
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    fs.writeFileSync(path.join(root, name), content);
  }
  return root;
}
const rulesOf = (root) => checkCourse({ root }).problems.map((problem) => problem.rule);

test("un corso in ordine non ha problemi", () => {
  const root = makeCourse({ "Day_01_A/01_x.md": chapter(), "Day_01_A/02_y.md": chapter({ next: false }) });
  assert.deepEqual(checkCourse({ root }).problems, []);
});

test("segnala una sezione del template mancante", () => {
  const root = makeCourse({ "Day_01_A/01_x.md": chapter({ skip: ["Recap"] }), "Day_01_A/02_y.md": chapter({ next: false }) });
  assert.deepEqual(rulesOf(root), ["template"]);
});

test("un capitolo di esercizio può fare a meno di Let's Code", () => {
  const root = makeCourse({ "Day_01_A/01_Esercizio_x.md": chapter({ skip: ["Let's Code"] }), "Day_01_A/02_y.md": chapter({ next: false }) });
  assert.deepEqual(rulesOf(root), []);
});

test("segnala le sezioni fuori ordine", () => {
  const swapped = chapter().replace("## 🧠 Theory\n\nTesto.\n\n## 💻 Let's Code\n\nTesto.\n", "## 💻 Let's Code\n\nTesto.\n\n## 🧠 Theory\n\nTesto.\n");
  const root = makeCourse({ "Day_01_A/01_x.md": swapped, "Day_01_A/02_y.md": chapter({ next: false }) });
  assert.deepEqual(rulesOf(root), ["template"]);
});

test("solo l'ultimo capitolo del corso può non avere Next", () => {
  const root = makeCourse({ "Day_01_A/01_x.md": chapter({ next: false }), "Day_01_A/02_y.md": chapter({ next: false }) });
  assert.deepEqual(rulesOf(root), ["template"]);
});

test("segnala un link relativo rotto ma non i link esterni", () => {
  const root = makeCourse({
    "Day_01_A/01_x.md": chapter({ extra: "[ok](./02_y.md) [rotto](./99_z.md) [web](https://react.dev)" }),
    "Day_01_A/02_y.md": chapter({ next: false }),
  });
  const problems = checkCourse({ root }).problems;
  assert.deepEqual(problems.map((problem) => problem.rule), ["link"]);
  assert.ok(problems[0].message.includes("99_z.md"));
});

test("segnala i segnaposto da configurare", () => {
  const root = makeCourse({ "Day_01_A/01_x.md": chapter({ extra: "`[DA CONFIGURARE: url]`" }), "Day_01_A/02_y.md": chapter({ next: false }) });
  assert.deepEqual(rulesOf(root), ["segnaposto"]);
});

test("segnala un blocco di codice senza linguaggio", () => {
  const root = makeCourse({ "Day_01_A/01_x.md": chapter({ extra: `${fence}\nciao\n${fence}` }), "Day_01_A/02_y.md": chapter({ next: false }) });
  assert.deepEqual(rulesOf(root), ["linguaggio"]);
});

test("segnala una soluzione senza titolo dedicato", () => {
  const root = makeCourse({
    "Day_01_A/01_x.md": chapter({ extra: `Elenco degli errori. Soluzione:\n\n${fence}jsx\nconst a = 1;\n${fence}` }),
    "Day_01_A/02_y.md": chapter({ extra: `### Soluzione di riferimento\n\n${fence}jsx\nconst a = 1;\n${fence}`, next: false }),
  });
  const problems = checkCourse({ root }).problems;
  assert.deepEqual(problems.map((problem) => `${problem.file}:${problem.rule}`), ["Day_01_A/01_x.md:soluzione"]);
});

test("segnala un file citato che nessun checkpoint contiene", () => {
  const root = makeCourse({
    "Day_01_A/01_x.md": chapter({ extra: "Crea `src/utils/formatters.js` e `src/App.jsx`." }),
    "Day_01_A/02_y.md": chapter({ next: false }),
    "repositories/Day_01/src/App.jsx": "export default 1;",
    "repositories/Day_01/src/utils/format.js": "export default 1;",
  });
  const problems = checkCourse({ root }).problems;
  assert.deepEqual(problems.map((problem) => problem.rule), ["checkpoint"]);
  assert.ok(problems[0].message.includes("src/utils/formatters.js"));
});

test("accetta un file che arriva in un checkpoint successivo", () => {
  const root = makeCourse({
    "Day_01_A/01_x.md": chapter({ extra: "Nel Day 2 creeremo `src/pages/Home.jsx`." }),
    "Day_01_A/02_y.md": chapter(),
    "Day_02_B/01_z.md": chapter({ next: false }),
    "repositories/Day_01/src/App.jsx": "x",
    "repositories/Day_02/src/pages/Home.jsx": "x",
  });
  assert.deepEqual(rulesOf(root), []);
});

test("segnala un file che esiste solo nei checkpoint precedenti", () => {
  const root = makeCourse({
    "Day_01_A/01_x.md": chapter(),
    "Day_02_B/01_z.md": chapter({ extra: "Apri `src/vecchio.js`.", next: false }),
    "repositories/Day_01/src/vecchio.js": "x",
    "repositories/Day_02/src/App.jsx": "x",
  });
  assert.deepEqual(rulesOf(root), ["checkpoint"]);
});

test("accetta i file di laboratorio dichiarati temporanei", () => {
  const root = makeCourse({
    "Day_01_A/01_x.md": chapter({ extra: "Crea `src/components/RerenderLab.jsx` (da eliminare a fine capitolo)." }),
    "Day_01_A/02_y.md": chapter({ next: false }),
    "repositories/Day_01/src/App.jsx": "x",
  });
  assert.deepEqual(rulesOf(root), []);
});

test("senza checkpoint non controlla i percorsi", () => {
  const root = makeCourse({ "Day_01_A/01_x.md": chapter({ extra: "Crea `src/a.js`." }), "Day_01_A/02_y.md": chapter({ next: false }) });
  assert.deepEqual(rulesOf(root), []);
});

test("accetta i file di un'estensione facoltativa", () => {
  const root = makeCourse({
    "Day_01_A/01_x.md": chapter({ extra: "Estensione facoltativa: crea `src/components/Extra.jsx`." }),
    "Day_01_A/02_y.md": chapter({ next: false }),
    "repositories/Day_01/src/App.jsx": "x",
  });
  assert.deepEqual(rulesOf(root), []);
});

test("segnala il codice mostrato dopo 'Prova prima da solo' senza un titolo Soluzione", () => {
  const quote = "> ⚠️ **Prova prima da solo**\n>\n> La soluzione è qui sotto.\n\n";
  const code = `${fence}jsx\nconst a = 1;\n${fence}`;
  const root = makeCourse({
    "Day_01_A/01_x.md": chapter({ extra: quote + code }),
    "Day_01_A/02_y.md": chapter({ extra: `${quote}### Soluzione di riferimento\n\n${code}`, next: false }),
  });
  const problems = checkCourse({ root }).problems;
  assert.deepEqual(problems.map((problem) => `${problem.file}:${problem.rule}`), ["Day_01_A/01_x.md:soluzione"]);
});
