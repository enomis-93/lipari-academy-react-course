import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { renderChapter } from "../lib/render.mjs";
import { createHighlighter } from "../lib/highlight.mjs";
import { theme } from "../lib/theme.mjs";
import { lines } from "./helpers.mjs";

const highlight = await createHighlighter();
const render = (source, options = {}) => renderChapter(source, { sourcePath: "Day_01/01_Test.md", highlight, ...options });
const count = (text, piece) => text.split(piece).length - 1;
const fence = "```";

const header = [
  "# 🏦 LipariBank — React Zero to Hero",
  "",
  "> **Day 1 · Capitolo 04**",
  "> **Argomento:** Function Components",
  "> **Durata stimata:** 25 minuti",
  "",
  "---",
  "",
].join("\n");

test("titolo e metadati finiscono in un unico pannello d'intestazione", () => {
  const { html } = render(header + "## 🧠 Theory\n\nTesto.\n");
  assert.equal(count(html, `<div style="${theme.header}">`), 1);
  assert.ok(!html.includes("<blockquote"));
  assert.match(html, /Capitolo 04<\/strong><br>/);
});

test("un blocco di codice del capitolo diventa un pannello con il titolo dichiarato", () => {
  const { html, warnings } = render(`Crea il file:\n\n${fence}jsx title="src/App.jsx"\nconst a = 1;\n${fence}\n`);
  assert.equal(count(html, 'data-copy-panel="true"'), 1);
  assert.ok(html.includes("src/App.jsx"));
  assert.deepEqual(warnings, []);
});

test("un linguaggio sconosciuto produce un avviso e non un errore", () => {
  const { html, warnings } = render(`${fence}foobar\na < b\n${fence}\n`);
  assert.ok(html.includes("a &lt; b"));
  assert.ok(warnings.some((warning) => warning.includes("foobar")));
});

test("un blocco senza linguaggio produce un avviso", () => {
  const { warnings } = render(`${fence}\nciao\n${fence}\n`);
  assert.ok(warnings.some((warning) => warning.includes("senza linguaggio")));
});

test("un blocco dentro un elenco numerato viene reso senza perdere l'indentazione", () => {
  const { html } = render(`1. Primo passo:\n\n   ${fence}jsx\n   function A() {\n     return null;\n   }\n   ${fence}\n\n2. Secondo passo.\n`);
  assert.equal(count(html, 'data-copy-panel="true"'), 1);
  assert.ok(html.includes("\n  ")); // l'indentazione interna al blocco resta
  assert.ok(html.includes("Secondo passo"));
});

test("la soluzione come ultima sezione finisce in un accordion chiuso", () => {
  const { html } = render(`## 🧪 Your Turn\n\nFai.\n\n### Soluzione di riferimento\n\n${fence}jsx\nconst a = 1;\n${fence}\n`);
  assert.equal(count(html, `<details style="${theme.solution}">`), 1);
  assert.equal(count(html, "</details>"), 1);
  assert.ok(html.indexOf("</details>") > html.indexOf("const"));
});

test("la soluzione si chiude prima di una riga orizzontale e della sezione successiva", () => {
  const { html } = render(
    `### Soluzione di riferimento\n\nSpiegazione.\n\n${fence}jsx\nconst a = 1;\n${fence}\n\n${fence}jsx\nconst b = 2;\n${fence}\n\n---\n\n## ⚠️ Common Mistakes\n\n- Errore.\n`,
  );
  assert.equal(count(html, `<details style="${theme.solution}">`), 1);
  const close = html.indexOf("</details>");
  assert.ok(close > html.indexOf("const</span> b") || close > html.indexOf("b = "));
  assert.ok(close < html.indexOf("Common Mistakes"));
});

test("una soluzione si chiude davanti a un titolo dello stesso livello", () => {
  const { html } = render(`### Soluzione di riferimento\n\nTesto.\n\n### ➡️ Next\n\nProssimo capitolo.\n`);
  assert.ok(html.indexOf("</details>") < html.indexOf("Prossimo capitolo"));
});

test("un blocco lungo dentro la soluzione mantiene il proprio accordion", () => {
  const { html } = render(`### Soluzione di riferimento\n\n${fence}jsx\n${lines(25)}${fence}\n`);
  assert.equal(count(html, "<details"), 2);
  assert.equal(count(html, "</details>"), 2);
});

test("i blockquote diventano riquadri colorati secondo l'etichetta", () => {
  const { html } = render("> 💡 **Remember**\n>\n> Regola.\n\n> ⚠️ **Prova prima da solo**\n>\n> Aspetta.\n");
  assert.ok(html.includes(`<blockquote style="${theme.callout.info}">`));
  assert.ok(html.includes(`<blockquote style="${theme.callout.warning}">`));
});

test("la sezione Next diventa un pannello scuro", () => {
  const { html } = render("## 📌 Recap\n\n- Punto.\n\n---\n\n### ➡️ Next\n\nProssimo capitolo: [JSX](./03_JSX.md).\n");
  assert.equal(count(html, `<div style="${theme.next}">`), 1);
  assert.ok(html.indexOf(`<div style="${theme.next}">`) < html.indexOf("Prossimo capitolo"));
});

test("la checklist finisce in un riquadro senza puntini", () => {
  const { html } = render("## ✅ Checklist\n\n- ☐ Ho capito.\n- ☐ Ho provato.\n");
  assert.ok(html.includes(`<div style="${theme.checklistBox}">`));
  assert.ok(html.includes(`<ul style="${theme.checklistList}">`));
});

test("un link a un capitolo senza corrispondenza diventa testo e viene segnalato", () => {
  const { html, warnings } = render("Vedi [il capitolo sul JSX](./03_JSX.md).\n");
  assert.ok(!html.includes("<a "));
  assert.ok(!html.includes(".md"));
  assert.ok(html.includes("il capitolo sul JSX"));
  assert.ok(warnings.some((warning) => warning.includes("./03_JSX.md")));
});

test("un link risolto diventa un collegamento vero", () => {
  const resolveLink = () => ({ kind: "mapped", url: "https://example.test/page?id=1" });
  const { html, warnings } = render("Vedi [JSX](./03_JSX.md).\n", { resolveLink });
  assert.ok(html.includes('<a href="https://example.test/page?id=1"'));
  assert.deepEqual(warnings, []);
});

test("un link esterno si apre in una nuova scheda", () => {
  const resolveLink = (href) => ({ kind: "external", url: href });
  const { html } = render("Leggi [la documentazione](https://react.dev).\n", { resolveLink });
  assert.ok(html.includes('target="_blank"'));
  assert.ok(html.includes('rel="noopener"'));
});

test("le tabelle sono scorrevoli in orizzontale", () => {
  const { html } = render("| A | B |\n|---|---|\n| 1 | 2 |\n");
  assert.ok(html.includes(`<div style="${theme.tableWrapper}"><table`));
  assert.ok(html.includes("</table></div>"));
});

test("un capitolo reale rispetta i vincoli dell'editor del sito", () => {
  const source = fs.readFileSync(new URL("../../Day_01_React_Fundamentals/03_JSX.md", import.meta.url), "utf8");
  const { html } = render(source);
  assert.ok(!/<style|<svg|onclick=|<span>/.test(html));
  assert.ok(!/href="[^"]*\.md/.test(html));
  assert.equal(count(html, "<details"), count(html, "</details>"));
  assert.equal(count(html, "<div"), count(html, "</div>"));
});
