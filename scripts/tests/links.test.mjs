import { test } from "node:test";
import assert from "node:assert/strict";
import { createLinkResolver } from "../lib/links.mjs";

const url = "https://moodle.test/mod/page/view.php?id=7";

test("un indirizzo completo è un link esterno", () => {
  const resolve = createLinkResolver({});
  assert.deepEqual(resolve("https://react.dev/learn", "Day_01/01_a.md"), { kind: "external", url: "https://react.dev/learn" });
});

test("un link relativo con corrispondenza punta alla pagina Moodle", () => {
  const resolve = createLinkResolver({ "Day_01/02_b.md": url });
  assert.deepEqual(resolve("./02_b.md", "Day_01/01_a.md"), { kind: "mapped", url });
});

test("l'ancora non impedisce di trovare la corrispondenza", () => {
  const resolve = createLinkResolver({ "Day_01/02_b.md": url });
  assert.deepEqual(resolve("./02_b.md#sezione", "Day_01/01_a.md"), { kind: "mapped", url });
});

test("una chiave scritta con le barre di Windows viene riconosciuta", () => {
  const resolve = createLinkResolver({ [String.raw`Day_01\02_b.md`]: url });
  assert.equal(resolve("./02_b.md", "Day_01/01_a.md").kind, "mapped");
});

test("un link verso un altro giorno si risolve rispetto alla cartella del capitolo", () => {
  const resolve = createLinkResolver({ "Day_02/01_c.md": url });
  assert.equal(resolve("../Day_02/01_c.md", "Day_01/01_a.md").kind, "mapped");
});

test("un link a un file della radice è trattato come un capitolo", () => {
  assert.equal(createLinkResolver({ "README.md": url })("../README.md", "Day_01/01_a.md").kind, "mapped");
  assert.deepEqual(createLinkResolver({})("../README.md", "Day_01/01_a.md"), { kind: "unmapped", target: "README.md" });
});

test("un link a una cartella usa il nome della cartella come chiave", () => {
  const resolve = createLinkResolver({ Day_00_Setup: url });
  assert.equal(resolve("../Day_00_Setup/", "Day_01/01_a.md").kind, "mapped");
});

test("un link senza corrispondenza non restituisce mai un indirizzo", () => {
  const result = createLinkResolver({})("./02_b.md", "Day_01/01_a.md");
  assert.deepEqual(result, { kind: "unmapped", target: "Day_01/02_b.md" });
});

test("un'ancora interna alla pagina non è un link da collegare", () => {
  assert.deepEqual(createLinkResolver({})("#sezione", "Day_01/01_a.md"), { kind: "anchor" });
});
