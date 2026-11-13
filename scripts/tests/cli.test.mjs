import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { convertCourse } from "../convert-to-tinymce.mjs";

function makeCourse(linkMap = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "corso di prova "));
  fs.mkdirSync(path.join(root, "Day_01_Prova"));
  fs.mkdirSync(path.join(root, "node_modules", "pacchetto"), { recursive: true });
  fs.writeFileSync(path.join(root, "node_modules", "pacchetto", "README.md"), "# No\n");
  fs.writeFileSync(
    path.join(root, "Day_01_Prova", "01_Primo.md"),
    "# Corso\n\n> **Day 1 · Capitolo 01**\n\n## 🧠 Theory\n\nVedi [il secondo](./02_Secondo.md).\n\n```jsx\nconst a = <p>ciao</p>;\n```\n",
  );
  fs.writeFileSync(path.join(root, "Day_01_Prova", "02_Secondo.md"), "# Corso\n\n## 🧠 Theory\n\nFine.\n");
  fs.writeFileSync(path.join(root, "moodle-links.json"), JSON.stringify(linkMap));
  return root;
}

const read = (root, ...parts) => fs.readFileSync(path.join(root, "tinymce-html", ...parts), "utf8");

test("converte tutte le cartelle del corso e ignora node_modules", async () => {
  const root = makeCourse();
  const summary = await convertCourse({ root });
  assert.equal(summary.converted.length, 2);
  assert.ok(read(root, "Day_01_Prova", "01_Primo.html").includes('data-copy-panel="true"'));
  assert.ok(!fs.existsSync(path.join(root, "tinymce-html", "node_modules")));
});

test("ogni pagina termina con lo script del Copy", async () => {
  const root = makeCourse();
  await convertCourse({ root });
  const html = read(root, "Day_01_Prova", "01_Primo.html");
  assert.equal(html.split("<script>").length - 1, 1);
  assert.ok(html.includes("copy-code-btn"));
  assert.ok(html.trimEnd().endsWith("</script>"));
});

test("il report elenca i link da collegare", async () => {
  const root = makeCourse();
  await convertCourse({ root });
  const report = read(root, "conversion-report.md");
  assert.ok(report.includes("Day_01_Prova/02_Secondo.md"));
  assert.ok(report.includes("Capitoli convertiti: 2"));
});

test("con la corrispondenza il link compare nella pagina e sparisce dal report", async () => {
  const root = makeCourse({ "Day_01_Prova/02_Secondo.md": "https://moodle.test/page?id=2" });
  await convertCourse({ root });
  assert.ok(read(root, "Day_01_Prova", "01_Primo.html").includes('href="https://moodle.test/page?id=2"'));
  assert.ok(read(root, "conversion-report.md").includes("Link da collegare: 0"));
});

test("due conversioni consecutive producono file identici", async () => {
  const root = makeCourse();
  await convertCourse({ root });
  const first = [read(root, "Day_01_Prova", "01_Primo.html"), read(root, "conversion-report.md")];
  await convertCourse({ root });
  assert.deepEqual([read(root, "Day_01_Prova", "01_Primo.html"), read(root, "conversion-report.md")], first);
});

test("si può convertire un solo file", async () => {
  const root = makeCourse();
  const summary = await convertCourse({ root, source: "Day_01_Prova/02_Secondo.md" });
  assert.deepEqual(summary.converted.map((item) => item.source), ["Day_01_Prova/02_Secondo.md"]);
});

test("una sorgente fuori dal corso viene rifiutata", async () => {
  const root = makeCourse();
  await assert.rejects(() => convertCourse({ root, source: ".." }), /dentro il corso/);
});
