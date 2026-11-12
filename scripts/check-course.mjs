// Controllo di coerenza del corso.
//
//   npm run check
//
// Verifica che ogni capitolo rispetti il template, che i link relativi esistano,
// che non restino segnaposto, che ogni blocco abbia il linguaggio, che le soluzioni
// abbiano un titolo "Soluzione…" e che i file citati esistano nei checkpoint.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const COURSE_FOLDER = /^(?:Day_|Extra_)/i;
const REQUIRED_SECTIONS = [
  "🎯 Obiettivo",
  "📋 Prerequisiti",
  "🧭 In questo capitolo",
  "🧠 Theory",
  "💻 Let's Code",
  "🏦 LipariBank in action",
  "🧪 Your Turn",
  "⚠️ Common Mistakes",
  "✅ Checklist",
  "🚀 Challenge",
  "📌 Recap",
];
const OPTIONAL_IN_EXERCISES = new Set(["💻 Let's Code"]);
const TEMPORARY_FILE = /elimin|temporane|di prova|rimuov|file di esercizio|didattico|facoltativ/i;
const PROJECT_PATH = /\b((?:src|public)\/[\w./-]+\.(?:jsx?|css|json|html|svg|png))\b/g;

const toPosix = (value) => value.split(path.sep).join("/");

/** Separa il testo dai blocchi di codice, tenendo traccia delle righe di apertura. */
function splitFences(source) {
  const prose = [];
  const openings = [];
  let fence = null;
  source.split(/\r?\n/).forEach((line, index) => {
    const match = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
    if (fence === null) {
      if (match) {
        fence = match[1];
        openings.push({ line: index, info: match[2].trim() });
        prose.push("");
      } else {
        prose.push(line);
      }
    } else {
      if (match && match[1][0] === fence[0] && match[1].length >= fence.length && match[2].trim() === "") fence = null;
      prose.push("");
    }
  });
  return { prose, openings };
}

function listChapters(root) {
  const chapters = [];
  for (const folder of fs.readdirSync(root).sort((a, b) => a.localeCompare(b, "en"))) {
    const folderPath = path.join(root, folder);
    if (!COURSE_FOLDER.test(folder) || !fs.statSync(folderPath).isDirectory()) continue;
    for (const file of fs.readdirSync(folderPath).sort((a, b) => a.localeCompare(b, "en"))) {
      if (file.toLowerCase().endsWith(".md")) chapters.push({ folder, file, path: path.join(folderPath, file) });
    }
  }
  return chapters;
}

function listCheckpoints(root) {
  const base = path.join(root, "repositories");
  if (!fs.existsSync(base)) return [];
  return fs
    .readdirSync(base)
    .filter((name) => fs.statSync(path.join(base, name)).isDirectory())
    .map((name) => {
      const day = name.match(/^Day_(\d+)/i);
      return { name, day: day ? Number(day[1]) : null, path: path.join(base, name) };
    });
}

function checkTemplate(chapter, prose, isLastChapter, report) {
  const headings = prose.filter((line) => line.startsWith("## ")).map((line) => line.slice(3).trim());
  const isExercise = /esercizio/i.test(chapter.file);
  const missing = REQUIRED_SECTIONS.filter(
    (section) => !headings.includes(section) && !(isExercise && OPTIONAL_IN_EXERCISES.has(section)),
  );
  if (missing.length) report("template", `Sezioni mancanti: ${missing.join(", ")}`);

  const present = headings.filter((heading) => REQUIRED_SECTIONS.includes(heading));
  const expected = REQUIRED_SECTIONS.filter((section) => present.includes(section));
  if (present.join("|") !== expected.join("|")) report("template", "Sezioni fuori ordine rispetto al template");

  const hasNext = prose.some((line) => /^#{2,4} .*\bNext\s*$/.test(line));
  if (!hasNext && !isLastChapter) report("template", "Manca la sezione Next");
}

function checkLinks(chapter, prose, report) {
  const text = prose.join("\n").replace(/`[^`\n]*`/g, "");
  for (const match of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    const target = match[1];
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(target)) continue;
    const clean = decodeURIComponent(target.split(/[?#]/, 1)[0]);
    if (clean && !fs.existsSync(path.resolve(path.dirname(chapter.path), clean))) {
      report("link", `Link rotto: ${target}`);
    }
  }
}

function checkFences(source, prose, openings, report) {
  if (source.includes("DA CONFIGURARE")) report("segnaposto", "Contiene un segnaposto DA CONFIGURARE");

  for (const opening of openings) {
    if (!opening.info) report("linguaggio", `Blocco di codice senza linguaggio (riga ${opening.line + 1})`);

    let previous = opening.line - 1;
    while (previous >= 0 && prose[previous].trim() === "") previous -= 1;
    const line = previous >= 0 ? prose[previous] : "";
    if (!line.startsWith("#") && /soluzion[ei][^.!?]*:\s*(?:\*\*)?\s*$/i.test(line)) {
      report("soluzione", `Soluzione senza titolo "Soluzione…" (riga ${previous + 1})`);
    }
  }

  // Dopo l'invito "Prova prima da solo" il codice deve stare sotto un titolo "Soluzione…":
  // è quel titolo a farlo finire nell'accordion chiuso della pagina generata.
  const fenceLines = new Set(openings.map((opening) => opening.line));
  prose.forEach((line, index) => {
    if (!/^>.*Prova prima da solo/i.test(line)) return;
    let cursor = index + 1;
    while (cursor < prose.length && (prose[cursor].startsWith(">") || prose[cursor].trim() === "")) {
      if (fenceLines.has(cursor)) break;
      cursor += 1;
    }
    for (; cursor < prose.length; cursor += 1) {
      if (/^#{1,6} /.test(prose[cursor]) || /^---\s*$/.test(prose[cursor])) return;
      if (fenceLines.has(cursor)) {
        report("soluzione", `Codice dopo "Prova prima da solo" senza titolo "Soluzione…" (riga ${cursor + 1})`);
        return;
      }
    }
  });
}

function checkProjectPaths(chapter, source, checkpoints, report) {
  const day = chapter.folder.match(/^Day_(\d+)/i);
  let candidates;
  if (day) {
    candidates = checkpoints.filter((checkpoint) => checkpoint.day !== null && checkpoint.day >= Number(day[1]));
  } else {
    const own = checkpoints.filter((checkpoint) => checkpoint.name.toLowerCase() === chapter.folder.toLowerCase());
    if (own.length === 0) return;
    candidates = [...own, ...checkpoints.filter((checkpoint) => checkpoint.day !== null)];
  }
  if (candidates.length === 0) return;

  const lines = source.split(/\r?\n/);
  const seen = new Set();
  for (const match of source.matchAll(PROJECT_PATH)) {
    const projectPath = match[1];
    if (seen.has(projectPath)) continue;
    seen.add(projectPath);

    if (candidates.some((checkpoint) => fs.existsSync(path.join(checkpoint.path, projectPath)))) continue;

    const baseName = path.posix.basename(projectPath);
    const stem = baseName.replace(/\.[^.]+$/, "");
    const isTemporary = lines.some(
      (line) => TEMPORARY_FILE.test(line) && (line.includes(baseName) || new RegExp(`\\b${stem}\\b`).test(line)),
    );
    if (!isTemporary) report("checkpoint", `File citato ma assente dai checkpoint: ${projectPath}`);
  }
}

/** Esegue tutti i controlli sul corso che si trova in `root`. */
export function checkCourse({ root }) {
  const courseRoot = path.resolve(root);
  const chapters = listChapters(courseRoot);
  const checkpoints = listCheckpoints(courseRoot);
  const mainChapters = chapters.filter((chapter) => /^Day_/i.test(chapter.folder));
  const lastChapter = mainChapters.at(-1) || chapters.at(-1);
  const problems = [];

  for (const chapter of chapters) {
    const file = toPosix(path.relative(courseRoot, chapter.path));
    const report = (rule, message) => problems.push({ file, rule, message });
    const source = fs.readFileSync(chapter.path, "utf8");
    const { prose, openings } = splitFences(source);

    checkTemplate(chapter, prose, chapter === lastChapter, report);
    checkLinks(chapter, prose, report);
    checkFences(source, prose, openings, report);
    checkProjectPaths(chapter, source, checkpoints, report);
  }

  return { chapters: chapters.length, problems };
}

function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const { chapters, problems } = checkCourse({ root });

  let currentFile = null;
  for (const problem of problems) {
    if (problem.file !== currentFile) {
      currentFile = problem.file;
      console.log(`\n${currentFile}`);
    }
    console.log(`  [${problem.rule}] ${problem.message}`);
  }

  if (problems.length) {
    console.log(`\n${problems.length} problemi in ${new Set(problems.map((problem) => problem.file)).size} capitoli (su ${chapters}).`);
    process.exitCode = 1;
  } else {
    console.log(`Nessun problema: ${chapters} capitoli controllati.`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
