import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import AdmZip from "adm-zip";
import { archiveName, listCheckpoints, zipCheckpoints } from "../checkpoints.mjs";

function makeRepo(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "checkpoints-"));
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    fs.writeFileSync(path.join(root, name), content);
  }
  return root;
}

test("il nome dell'archivio segue la cartella del checkpoint", () => {
  assert.equal(archiveName("Day_03"), "liparibank-day-03");
  assert.equal(archiveName("Extra_Legacy_React"), "liparibank-extra-legacy");
});

test("elenca solo le cartelle che contengono un progetto", () => {
  const root = makeRepo({
    "repositories/README.md": "x",
    "repositories/Day_01/package.json": "{}",
    "repositories/Appunti/nota.txt": "x",
  });
  assert.deepEqual(listCheckpoints(root).map((item) => item.folder), ["Day_01"]);
});

test("l'archivio ha una sola cartella radice e non contiene node_modules né dist", () => {
  const root = makeRepo({
    "repositories/Day_01/package.json": "{}",
    "repositories/Day_01/.gitignore": "node_modules",
    "repositories/Day_01/src/App.jsx": "export default 1;",
    "repositories/Day_01/node_modules/react/index.js": "x",
    "repositories/Day_01/dist/index.html": "x",
  });
  const [archive] = zipCheckpoints({ root });
  assert.equal(path.basename(archive), "liparibank-day-01.zip");

  const entries = new AdmZip(archive).getEntries().map((entry) => entry.entryName).sort();
  assert.deepEqual(entries, [
    "liparibank-day-01/.gitignore",
    "liparibank-day-01/package.json",
    "liparibank-day-01/src/App.jsx",
  ]);
});
