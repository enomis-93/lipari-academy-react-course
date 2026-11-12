import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFenceInfo, renderCodePanel } from "../lib/fence.mjs";
import { createHighlighter } from "../lib/highlight.mjs";
import { lines, textOf } from "./helpers.mjs";

const highlight = await createHighlighter();
const panel = (options) => renderCodePanel({ highlight, threshold: 20, title: null, collapse: false, ...options });

test("parseFenceInfo legge il solo linguaggio", () => {
  assert.deepEqual(parseFenceInfo("jsx"), { lang: "jsx", title: null, collapse: false });
});

test("parseFenceInfo legge il titolo", () => {
  assert.deepEqual(parseFenceInfo('jsx title="src/App.jsx"'), { lang: "jsx", title: "src/App.jsx", collapse: false });
});

test("parseFenceInfo legge titolo e collapse", () => {
  assert.deepEqual(parseFenceInfo('javascript title="src/data/mockData.js" collapse'), {
    lang: "javascript",
    title: "src/data/mockData.js",
    collapse: true,
  });
});

test("parseFenceInfo accetta un recinto vuoto", () => {
  assert.deepEqual(parseFenceInfo(""), { lang: "", title: null, collapse: false });
});

test("parseFenceInfo non scambia collapse per un linguaggio", () => {
  assert.deepEqual(parseFenceInfo("collapse"), { lang: "", title: null, collapse: true });
});

test("parseFenceInfo accetta un titolo con spazi", () => {
  assert.equal(parseFenceInfo('text title="Output atteso nel terminale"').title, "Output atteso nel terminale");
});

test("un blocco corto non è un accordion", () => {
  const html = panel({ code: lines(3), lang: "jsx" });
  assert.ok(!html.includes("<details"));
  assert.match(html, /^<div data-copy-panel="true"/);
});

test("un blocco di 20 righe non è ancora un accordion", () => {
  assert.ok(!panel({ code: lines(20), lang: "jsx" }).includes("<details"));
});

test("un blocco lungo di codice è un accordion aperto con il numero di righe", () => {
  const html = panel({ code: lines(21), lang: "jsx" });
  assert.match(html, /^<details data-copy-panel="true" open /);
  assert.ok(html.includes("21 righe"));
});

test("un blocco lungo marcato collapse parte chiuso", () => {
  const html = panel({ code: lines(21), lang: "javascript", collapse: true });
  assert.match(html, /^<details data-copy-panel="true" style=/);
});

test("un blocco css lungo parte chiuso", () => {
  assert.match(panel({ code: lines(21), lang: "css" }), /^<details data-copy-panel="true" style=/);
});

test("collapse su un blocco corto lo rende comunque un accordion chiuso", () => {
  assert.match(panel({ code: lines(5), lang: "javascript", collapse: true }), /^<details data-copy-panel="true" style=/);
});

test("il titolo compare nella barra insieme al pulsante Copy", () => {
  const html = panel({ code: lines(3), lang: "jsx", title: "src/components/Header.jsx" });
  assert.ok(html.includes("src/components/Header.jsx"));
  assert.ok(html.includes('class="copy-code-btn"'));
  assert.ok(html.includes("⧉ Copy"));
});

test("il codice con caratteri HTML resta testo e si ricostruisce identico", () => {
  const code = 'const a = "<script>alert(1)</script>" && <p>{x}</p>;\n';
  const html = panel({ code, lang: "jsx" });
  const inside = html.slice(html.indexOf("<code>") + 6, html.indexOf("</code>"));
  assert.ok(!/<script|<p>|<\/p>/.test(inside));
  assert.equal(textOf(inside), code.trimEnd());
});

test("un linguaggio sconosciuto viene reso come testo senza errori", () => {
  const html = panel({ code: "a < b\n", lang: "foobar" });
  assert.ok(html.includes("a &lt; b"));
});

test("i comandi di terminale sono verdi e senza tokenizzazione", () => {
  const html = panel({ code: "npm run dev\n", lang: "bash" });
  assert.ok(html.includes('<span style="color:#86efac;">npm run dev</span>'));
});

test("il pannello non contiene svg, stili globali, onclick o span senza attributi", () => {
  const html = panel({ code: lines(30, "const x = 1; // nota"), lang: "javascript", title: "src/x.js" });
  assert.ok(!/<svg|<style|onclick=|<span>/.test(html));
});
