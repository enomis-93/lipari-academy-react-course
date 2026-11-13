// Verifica i checkpoint di repositories/ e ne crea gli archivi per gli studenti.
//
//   npm run checkpoints:verify   copia ogni checkpoint in una cartella temporanea, poi npm ci, lint e build
//   npm run checkpoints:zip      crea checkpoints-zip/<nome>.zip, con una sola cartella <nome>/ all'interno

import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import AdmZip from "adm-zip";

const EXCLUDED = new Set(["node_modules", "dist", ".git"]);
const OUTPUT_FOLDER = "checkpoints-zip";

/** Nome dell'archivio (e della cartella al suo interno) per una cartella di repositories/. */
export function archiveName(folder) {
  const day = folder.match(/^Day_(\d+)$/i);
  if (day) return `liparibank-day-${day[1].padStart(2, "0")}`;
  const extra = folder.match(/^Extra_(\w+?)_React$/i);
  if (extra) return `liparibank-extra-${extra[1].toLowerCase()}`;
  return `liparibank-${folder.toLowerCase().replaceAll("_", "-")}`;
}

/** I checkpoint presenti in `root/repositories`: solo le cartelle con un package.json. */
export function listCheckpoints(root) {
  const base = path.join(root, "repositories");
  return fs
    .readdirSync(base)
    .filter((name) => fs.existsSync(path.join(base, name, "package.json")))
    .sort((a, b) => a.localeCompare(b, "en"))
    .map((name) => ({ folder: name, path: path.join(base, name), archive: archiveName(name) }));
}

function projectFiles(directory, relative = "") {
  const files = [];
  for (const entry of fs.readdirSync(path.join(directory, relative), { withFileTypes: true })) {
    if (EXCLUDED.has(entry.name)) continue;
    const child = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...projectFiles(directory, child));
    else files.push(child);
  }
  return files;
}

/** Crea un archivio per checkpoint in `root/checkpoints-zip` e restituisce i percorsi creati. */
export function zipCheckpoints({ root }) {
  const output = path.join(root, OUTPUT_FOLDER);
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });

  return listCheckpoints(root).map((checkpoint) => {
    const zip = new AdmZip();
    for (const file of projectFiles(checkpoint.path)) {
      const folderInZip = path.posix.join(checkpoint.archive, path.posix.dirname(file));
      zip.addLocalFile(path.join(checkpoint.path, file), folderInZip);
    }
    const target = path.join(output, `${checkpoint.archive}.zip`);
    zip.writeZip(target);
    return target;
  });
}

/** Installa ed esegue lint e build di ogni checkpoint, in una copia temporanea. */
export function verifyCheckpoints({ root }) {
  const failures = [];
  for (const checkpoint of listCheckpoints(root)) {
    const copy = fs.mkdtempSync(path.join(os.tmpdir(), `${checkpoint.archive}-`));
    try {
      for (const file of projectFiles(checkpoint.path)) {
        fs.mkdirSync(path.dirname(path.join(copy, file)), { recursive: true });
        fs.copyFileSync(path.join(checkpoint.path, file), path.join(copy, file));
      }
      for (const command of ["npm ci --no-audit --no-fund", "npm run lint", "npm run build"]) {
        execSync(command, { cwd: copy, stdio: "pipe" });
      }
      console.log(`ok      ${checkpoint.folder}`);
    } catch (error) {
      failures.push(checkpoint.folder);
      console.log(`ERRORE  ${checkpoint.folder}\n${error.stdout || ""}${error.stderr || error.message}`);
    } finally {
      fs.rmSync(copy, { recursive: true, force: true });
    }
  }
  return failures;
}

function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const command = process.argv[2];

  if (command === "zip") {
    const archives = zipCheckpoints({ root });
    console.log(`Creati ${archives.length} archivi in ${OUTPUT_FOLDER}/.`);
  } else if (command === "verify") {
    const failures = verifyCheckpoints({ root });
    if (failures.length > 0) {
      console.log(`\n${failures.length} checkpoint con errori: ${failures.join(", ")}`);
      process.exitCode = 1;
    } else {
      console.log("\nTutti i checkpoint superano lint e build.");
    }
  } else {
    console.log("Uso: node scripts/checkpoints.mjs <verify|zip>");
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
