import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(repositoryRoot, "tinymce-html");
const excludedDirectories = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  "vendor",
  "tinymce-html",
]);
const excludedFiles = new Set(["readme.md", "changelog.md", "license.md"]);
const copyableLanguages = new Set([
  "bash",
  "sh",
  "shell",
  "powershell",
  "ps1",
  "js",
  "jsx",
  "ts",
  "tsx",
  "javascript",
  "typescript",
  "html",
  "css",
  "json",
  "sql",
  "java",
  "python",
  "py",
  "xml",
  "yaml",
  "yml",
  "toml",
  "diff",
  "mermaid",
  "text",
  "txt",
]);

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
});
let tableBodyRow = -1;

const inlineStyles = {
  wrapper:
    "font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:1.7; color:#334155;",
  h1: "margin:0 0 18px; padding:24px; background:#eff6ff; border-left:5px solid #2563eb; border-radius:8px; color:#172554; font-size:27px; line-height:1.35;",
  h2: "margin:30px 0 12px; padding-bottom:8px; border-bottom:2px solid #dbeafe; color:#172554; font-size:22px; line-height:1.4;",
  h3: "margin:24px 0 10px; color:#1e40af; font-size:18px; line-height:1.4;",
  paragraph: "margin:0 0 14px;",
  link: "color:#2563eb;",
  inlineCode:
    "padding:2px 5px; background:#f1f5f9; border-radius:4px; color:#1e293b; font-family:Consolas, Monaco, monospace; font-size:0.92em;",
  list: "margin:0 0 16px; padding-left:26px;",
  horizontalRule: "margin:24px 0; border:0; border-top:1px solid #e2e8f0;",
  table:
    "width:100%; margin:16px 0 22px; border-collapse:collapse; color:#334155;",
  tableHeader:
    "padding:10px 12px; border:1px solid #dbeafe; background:#172554; color:#eff6ff; text-align:left; vertical-align:top;",
  tableCell:
    "padding:10px 12px; border:1px solid #dbeafe; background:#ffffff; text-align:left; vertical-align:top;",
};

function parseArguments(args) {
  let sourceArgument = "Day_01_React_Fundamentals";
  let limit = Number.POSITIVE_INFINITY;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--source") {
      sourceArgument = args[index + 1];
      if (!sourceArgument) throw new Error("--source requires a repository-relative folder.");
      index += 1;
    } else if (argument === "--limit") {
      const value = Number(args[index + 1]);
      if (!Number.isInteger(value) || value < 1) {
        throw new Error("--limit must be a positive integer.");
      }
      limit = value;
      index += 1;
    } else {
      throw new Error(`Unknown option: ${argument}`);
    }
  }

  const sourceRoot = path.resolve(repositoryRoot, sourceArgument);
  if (
    sourceRoot === repositoryRoot ||
    !sourceRoot.startsWith(`${repositoryRoot}${path.sep}`)
  ) {
    throw new Error("--source must identify a folder inside the repository.");
  }

  return { sourceRoot, limit };
}

async function collectMarkdownFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (entry.isDirectory()) {
      if (!excludedDirectories.has(entry.name)) {
        files.push(...(await collectMarkdownFiles(path.join(directory, entry.name))));
      }
    } else if (
      entry.isFile() &&
      entry.name.toLowerCase().endsWith(".md") &&
      !excludedFiles.has(entry.name.toLowerCase())
    ) {
      files.push(path.join(directory, entry.name));
    }
  }

  return files;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function shouldOfferCopy(language, content) {
  const normalizedLanguage = language.toLowerCase();
  if (copyableLanguages.has(normalizedLanguage)) {
    if (normalizedLanguage === "text" || normalizedLanguage === "txt") {
      return /(?:^[│├└|+\-].*$|^\s*(?:npm|node|git|cd|mkdir|code)\b|^\s*[\w.-]+\/)/m.test(
        content,
      );
    }
    return content.trim().length > 0;
  }

  return (
    normalizedLanguage === "" &&
    /(?:^\s*(?:const|let|function|import|export|npm|git|cd)\b|^\s*[{}\w./-]+\s*[{};=])/m.test(
      content,
    )
  );
}

function languageLabel(language) {
  return (language || "CODE").toUpperCase();
}

markdown.renderer.rules.fence = (tokens, index) => {
  const token = tokens[index];
  const language = token.info.trim().split(/\s+/, 1)[0] || "";
  const copyButton = shouldOfferCopy(language, token.content)
    ? '<button type="button" class="copy-code-btn" aria-label="Copy code" title="Copy code" style="display:inline-flex; align-items:center; gap:6px; background:transparent; border:0; color:#bfdbfe; cursor:pointer; font-size:12px; padding:4px 6px;"><svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg><span>Copy</span></button>'
    : "";
  const toolbarLabel = languageLabel(language);

  return `<div data-copy-panel="true" style="background:#0f172a; border:1px solid #1e3a8a; border-radius:8px; overflow:hidden; margin:14px 0 22px;">\n<div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:#172554; border-bottom:1px solid #1e3a8a;">\n<span style="font-size:12px; font-weight:600; color:#bfdbfe;">${escapeHtml(toolbarLabel)}</span>\n${copyButton}\n</div>\n<pre style="margin:0; padding:18px; overflow-x:auto; color:#e2e8f0; font-family:Consolas, Monaco, monospace; font-size:13px; line-height:1.7; white-space:pre;"><code>${escapeHtml(token.content)}</code></pre>\n</div>\n`;
};

markdown.renderer.rules.heading_open = (tokens, index, options, environment, renderer) => {
  const token = tokens[index];
  const headingLevel = token.tag;
  const styles = headingLevel === "h1" ? inlineStyles.h1 : headingLevel === "h2" ? inlineStyles.h2 : inlineStyles.h3;
  return `<${headingLevel} style="${styles}">`;
};
markdown.renderer.rules.heading_close = (tokens, index) => `</${tokens[index].tag}>\n`;
markdown.renderer.rules.paragraph_open = () => `<p style="${inlineStyles.paragraph}">`;
markdown.renderer.rules.paragraph_close = () => "</p>\n";
markdown.renderer.rules.bullet_list_open = () => `<ul style="${inlineStyles.list}">`;
markdown.renderer.rules.ordered_list_open = (tokens, index) => {
  const start = tokens[index].attrGet("start");
  return `<ol style="${inlineStyles.list}"${start && String(start) !== "1" ? ` start="${escapeHtml(String(start))}"` : ""}>`;
};
markdown.renderer.rules.list_item_open = () => "<li>";
markdown.renderer.rules.link_open = (tokens, index) => {
  const href = tokens[index].attrGet("href") || "";
  return `<a href="${escapeHtml(href)}" style="${inlineStyles.link}">`;
};
markdown.renderer.rules.image = (tokens, index) => {
  const token = tokens[index];
  const src = escapeHtml(token.attrGet("src") || "");
  const alt = escapeHtml(token.content || "");
  const title = token.attrGet("title");
  return `<img src="${src}" alt="${alt}"${title ? ` title="${escapeHtml(title)}"` : ""} style="max-width:100%; height:auto;">`;
};
markdown.renderer.rules.code_inline = (tokens, index) =>
  `<code style="${inlineStyles.inlineCode}">${escapeHtml(tokens[index].content)}</code>`;
markdown.renderer.rules.softbreak = () => "<br>\n";
markdown.renderer.rules.hr = () => `<hr style="${inlineStyles.horizontalRule}">\n`;
markdown.renderer.rules.table_open = () => `<table style="${inlineStyles.table}">`;
markdown.renderer.rules.th_open = () => `<th style="${inlineStyles.tableHeader}">`;
markdown.renderer.rules.tbody_open = () => {
  tableBodyRow = 0;
  return "<tbody>";
};
markdown.renderer.rules.tbody_close = () => {
  tableBodyRow = -1;
  return "</tbody>";
};
markdown.renderer.rules.tr_open = () => {
  if (tableBodyRow < 0) return "<tr>";
  tableBodyRow += 1;
  return `<tr style="background:${tableBodyRow % 2 === 0 ? "#f8fafc" : "#ffffff"};">`;
};
markdown.renderer.rules.td_open = () => {
  const background = tableBodyRow > 0 && tableBodyRow % 2 === 0 ? "#f8fafc" : "#ffffff";
  return `<td style="${inlineStyles.tableCell.replace("#ffffff", background)}">`;
};
markdown.renderer.rules.blockquote_open = (tokens, index) => {
  const followingTokens = tokens.slice(index + 1, index + 8);
  const quoteText = followingTokens
    .filter((token) => token.type === "inline")
    .map((token) => token.content)
    .join(" ");
  const isMetadata = tokens[index - 1]?.type === "heading_close" && tokens[index - 1].tag === "h1";
  const isWarning = /warning|common mistakes|attenzione|errore/i.test(quoteText);
  const isSuccess = /success|expected result|risultato atteso/i.test(quoteText);
  const style = isMetadata || /remember|tip|consiglio/i.test(quoteText)
    ? "background:#eff6ff; border-left:4px solid #3b82f6; padding:14px 18px; margin:16px 0; border-radius:4px;"
    : isWarning
      ? "background:#fff7ed; border-left:4px solid #f59e0b; padding:14px 18px; margin:16px 0; border-radius:4px;"
      : isSuccess
        ? "background:#f0fdf4; border-left:4px solid #16a34a; padding:14px 18px; margin:16px 0; border-radius:4px;"
        : "background:#f8fafc; border-left:4px solid #64748b; padding:14px 18px; margin:16px 0; border-radius:4px;";
  return `<blockquote style="${style}">`;
};

markdown.renderer.rules.table_close = () => "</table>\n";
markdown.renderer.rules.blockquote_close = () => "</blockquote>\n";

function collectLinkWarnings(tokens, sourceFile, sourceRoot) {
  const warnings = [];
  const sourceDirectory = path.dirname(sourceFile);

  const allTokens = tokens.flatMap((token) => [token, ...(token.children || [])]);
  for (const token of allTokens) {
    if (token.type !== "link_open" && token.type !== "image") continue;
    const target = token.attrGet(token.type === "image" ? "src" : "href") || "";
    if (!target || /^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(target)) continue;

    const cleanTarget = decodeURIComponent(target.split(/[?#]/, 1)[0]);
    const resolvedTarget = path.resolve(sourceDirectory, cleanTarget);
    if (!resolvedTarget.startsWith(`${sourceRoot}${path.sep}`) && resolvedTarget !== sourceRoot) {
      warnings.push(`Relative link points outside the selected source folder: ${target}`);
    }
  }

  return [...new Set(warnings)];
}

function countTokens(tokens, type) {
  return tokens.filter((token) => token.type === type).length;
}

function relativePosix(filePath) {
  return path.relative(repositoryRoot, filePath).split(path.sep).join("/");
}

function buildReport(sourceLabel, converted, deferred) {
  const warnings = converted.flatMap((item) =>
    item.warnings.map((warning) => `- \`${item.source}\`: ${warning}`),
  );
  const convertedRows = converted.length
    ? converted.map((item) => `- \`${item.source}\` → \`${item.output}\``).join("\n")
    : "- None";
  const deferredRows = deferred.length
    ? deferred.map((file) => `- \`${file}\` — deferred by \`--limit\``).join("\n")
    : "- None";

  return `# TinyMCE conversion report

- Selected source: \`${sourceLabel}\`
- Converted in this run: ${converted.length}
- Deferred in this run: ${deferred.length}

## Converted files

${convertedRows}

## Skipped / deferred files

${deferredRows}

## Warnings and links to check

${warnings.length ? warnings.join("\n") : "- None"}
`;
}

async function main() {
  const { sourceRoot, limit } = parseArguments(process.argv.slice(2));
  const sourceStats = await fs.stat(sourceRoot);
  if (!sourceStats.isDirectory()) {
    throw new Error(`Source is not a directory: ${relativePosix(sourceRoot)}`);
  }

  const allFiles = await collectMarkdownFiles(sourceRoot);
  if (allFiles.length === 0) {
    throw new Error(`No eligible Markdown files found in ${relativePosix(sourceRoot)}.`);
  }

  const selectedFiles = allFiles.slice(0, limit);
  const deferredFiles = allFiles.slice(selectedFiles.length).map(relativePosix);
  const converted = [];

  for (const sourceFile of selectedFiles) {
    const source = await fs.readFile(sourceFile, "utf8");
    const tokens = markdown.parse(source, {});
    const output = markdown.render(source, {});
    const outputFile = path.join(
      outputRoot,
      path.relative(repositoryRoot, sourceFile).replace(/\.md$/i, ".html"),
    );
    const wrappedOutput = `<div style="${inlineStyles.wrapper}">\n${output}</div>\n<script>\n${copyHandlerSource}\n</script>\n`;

    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await fs.writeFile(outputFile, wrappedOutput, "utf8");

    converted.push({
      source: relativePosix(sourceFile),
      output: relativePosix(outputFile),
      headings: countTokens(tokens, "heading_open"),
      codeBlocks: countTokens(tokens, "fence"),
      tables: countTokens(tokens, "table_open"),
      warnings: collectLinkWarnings(tokens, sourceFile, sourceRoot),
    });
  }

  await fs.mkdir(outputRoot, { recursive: true });
  await fs.writeFile(
    path.join(outputRoot, "copy-code.js"),
    copyHandlerSource,
    "utf8",
  );
  await fs.writeFile(
    path.join(outputRoot, "conversion-report.md"),
    buildReport(relativePosix(sourceRoot), converted, deferredFiles),
    "utf8",
  );

  for (const item of converted) {
    console.log(
      `Converted ${item.source} -> ${item.output} ` +
        `(${item.headings} headings, ${item.codeBlocks} code blocks, ${item.tables} tables)`,
    );
  }
  console.log(`Deferred ${deferredFiles.length} file(s).`);
}

const copyHandlerSource = `(function () {
  if (window.lipariBankCopyHandlerInstalled) return;
  window.lipariBankCopyHandlerInstalled = true;

  document.addEventListener('click', async function (event) {
    var button = event.target.closest('.copy-code-btn');
    if (!button) return;

    event.preventDefault();

    var panel = button.closest('[data-copy-panel]');
    if (!panel) panel = button.parentElement.parentElement;

    var code = panel.querySelector('pre code');
    if (!code) return;

    var value = code.textContent;
    var originalContent = button.innerHTML;
    var originalLabel = button.getAttribute('aria-label') || 'Copy code';

    function showSuccess() {
      button.textContent = 'Copied!';
      button.setAttribute('aria-label', 'Code copied');
      window.setTimeout(function () {
        button.innerHTML = originalContent;
        button.setAttribute('aria-label', originalLabel);
      }, 1500);
    }

    function fallbackCopy() {
      var textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();

      var copied = false;
      try {
        copied = document.execCommand('copy');
      } catch (error) {
        copied = false;
      }

      document.body.removeChild(textarea);

      if (copied) showSuccess();
      else button.textContent = 'Copy failed';
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        showSuccess();
      } else {
        fallbackCopy();
      }
    } catch (error) {
      fallbackCopy();
    }
  });
})();
`;

main().catch((error) => {
  console.error(`TinyMCE conversion failed: ${error.stack || error.message}`);
  process.exitCode = 1;
});
