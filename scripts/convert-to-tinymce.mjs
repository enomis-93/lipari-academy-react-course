// Converte i capitoli Markdown del corso nell'HTML da incollare in TinyMCE (Moodle).
//
//   npm run convert                                  tutto il corso
//   npm run convert -- --source Day_03_State_Events  una cartella
//   npm run convert -- --source Day_01_React_Fundamentals/03_JSX.md   un file
//
// L'output finisce in tinymce-html/ con la stessa struttura delle cartelle.
// Regole grafiche e pubblicazione: vedi CONVERSION_GUIDE.md.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { copyScript } from "./lib/copy-script.mjs";
import { createHighlighter } from "./lib/highlight.mjs";
import { createLinkResolver } from "./lib/links.mjs";
import { renderChapter } from "./lib/render.mjs";

const OUTPUT_FOLDER = "tinymce-html";
const LINK_MAP_FILE = "moodle-links.json";
const COURSE_FOLDER = /^(?:Day_|Extra_)/i;
const ROOT_PAGES = ["COURSE_MAP.md"];
const LINK_WARNING = "Link da collegare: ";

const toPosix = (value) => value.split(path.sep).join("/");

async function collectMarkdown(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name, "en"))) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectMarkdown(fullPath)));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) files.push(fullPath);
  }
  return files;
}

async function selectSources(root, source) {
  if (source) {
    const target = path.resolve(root, source);
    if (target !== root && !target.startsWith(root + path.sep)) {
      throw new Error(`--source deve indicare una cartella o un file dentro il corso: ${source}`);
    }
    if (target === root) throw new Error("--source deve indicare una cartella o un file dentro il corso, non la radice.");
    const stats = await fs.stat(target);
    return stats.isDirectory() ? collectMarkdown(target) : [target];
  }

  const entries = await fs.readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name, "en"))) {
    if (entry.isDirectory() && COURSE_FOLDER.test(entry.name)) {
      files.push(...(await collectMarkdown(path.join(root, entry.name))));
    }
  }
  for (const page of ROOT_PAGES) {
    const fullPath = path.join(root, page);
    if (await fs.stat(fullPath).then(() => true, () => false)) files.push(fullPath);
  }
  return files;
}

async function readLinkMap(root) {
  try {
    return JSON.parse(await fs.readFile(path.join(root, LINK_MAP_FILE), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw new Error(`${LINK_MAP_FILE} non è un JSON valido: ${error.message}`);
  }
}

function buildReport(converted) {
  const linkTargets = new Map();
  const otherWarnings = [];
  for (const item of converted) {
    for (const warning of item.warnings) {
      if (warning.startsWith(LINK_WARNING)) {
        const target = warning.slice(LINK_WARNING.length);
        if (!linkTargets.has(target)) linkTargets.set(target, []);
        linkTargets.get(target).push(item.source);
      } else {
        otherWarnings.push(`- \`${item.source}\`: ${warning}`);
      }
    }
  }

  const linkRows = [...linkTargets.keys()]
    .sort()
    .map((target) => `- \`${target}\` — citato in ${linkTargets.get(target).length} capitoli`);

  return [
    "# Report di conversione",
    "",
    `- Capitoli convertiti: ${converted.length}`,
    `- Link da collegare: ${linkTargets.size}`,
    `- Altri avvisi: ${otherWarnings.length}`,
    "",
    "## Link da collegare",
    "",
    "Pagine citate dai capitoli ma assenti da `moodle-links.json`: nelle pagine generate compaiono come testo, non come link.",
    "",
    linkRows.length ? linkRows.join("\n") : "- Nessuno",
    "",
    "## Altri avvisi",
    "",
    otherWarnings.length ? otherWarnings.join("\n") : "- Nessuno",
    "",
    "## Capitoli convertiti",
    "",
    converted.map((item) => `- \`${item.source}\` → \`${item.output}\``).join("\n"),
    "",
  ].join("\n");
}

/**
 * Converte il corso (o la sola `source`) che si trova in `root`.
 * Restituisce l'elenco dei capitoli convertiti con i relativi avvisi.
 */
export async function convertCourse({ root, source } = {}) {
  const courseRoot = path.resolve(root);
  const files = await selectSources(courseRoot, source);
  if (files.length === 0) throw new Error("Nessun file Markdown da convertire.");

  const highlight = await createHighlighter();
  const resolveLink = createLinkResolver(await readLinkMap(courseRoot));
  const outputRoot = path.join(courseRoot, OUTPUT_FOLDER);
  const converted = [];

  for (const file of files) {
    const sourcePath = toPosix(path.relative(courseRoot, file));
    const markdown = await fs.readFile(file, "utf8");
    const { html, warnings } = renderChapter(markdown, { sourcePath, resolveLink, highlight });
    const outputPath = path.join(outputRoot, sourcePath.replace(/\.md$/i, ".html"));

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, `${html}<script>\n${copyScript}\n</script>\n`, "utf8");
    converted.push({ source: sourcePath, output: toPosix(path.relative(courseRoot, outputPath)), warnings });
  }

  await fs.mkdir(outputRoot, { recursive: true });
  await fs.writeFile(path.join(outputRoot, "conversion-report.md"), buildReport(converted), "utf8");
  return { converted };
}

function parseArguments(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--source" && args[index + 1]) {
      options.source = args[index + 1];
      index += 1;
    } else {
      throw new Error(`Opzione non riconosciuta: ${args[index]}. Uso: npm run convert -- [--source <cartella|file>]`);
    }
  }
  return options;
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const { converted } = await convertCourse({ root, ...parseArguments(process.argv.slice(2)) });
  const warnings = converted.reduce((total, item) => total + item.warnings.length, 0);
  console.log(`Convertiti ${converted.length} capitoli in ${OUTPUT_FOLDER}/ (${warnings} avvisi).`);
  console.log(`Dettagli: ${OUTPUT_FOLDER}/conversion-report.md`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`Conversione non riuscita: ${error.message}`);
    process.exitCode = 1;
  });
}
