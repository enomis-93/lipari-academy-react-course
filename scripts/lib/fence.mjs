import { escapeHtml } from "./highlight.mjs";
import { languageLabels, theme } from "./theme.mjs";

/**
 * Legge la riga del recinto di un blocco di codice.
 *   ```jsx title="src/App.jsx" collapse
 * `title` è il nome mostrato nella barra, `collapse` fa partire il blocco chiuso.
 */
export function parseFenceInfo(info) {
  let rest = (info || "").trim();
  let title = null;

  const titleMatch = rest.match(/\btitle="([^"]*)"/);
  if (titleMatch) {
    title = titleMatch[1];
    rest = rest.replace(titleMatch[0], " ");
  }

  const words = rest.split(/\s+/).filter(Boolean);
  const collapse = words.includes("collapse");
  const lang = words.find((word) => word !== "collapse") || "";

  return { lang, title, collapse };
}

export function isKnownLanguage(lang) {
  return Object.hasOwn(languageLabels, (lang || "").toLowerCase());
}

function countLines(code) {
  return code.split("\n").length;
}

function copyButton(style) {
  return `<button type="button" class="copy-code-btn" aria-label="Copia il codice" style="${style}">⧉ Copy</button>`;
}

/**
 * Pannello scuro di un blocco di codice.
 * Oltre la soglia di righe (o con `collapse`) diventa un accordion <details>:
 * parte chiuso se è marcato `collapse` o se è CSS, aperto negli altri casi.
 */
export function renderCodePanel({ code, lang, title, collapse, highlight, threshold = theme.collapseThreshold }) {
  const source = code.replace(/\r\n/g, "\n").replace(/\n+$/, "");
  const language = (lang || "").toLowerCase();
  const label = languageLabels[language] || (language ? language.toUpperCase() : "Codice");
  const lineCount = countLines(source);
  const body = highlight(source, language);

  const titleHtml = title ? `<span style="${theme.codeTitle}">${escapeHtml(title)}</span> &nbsp;·&nbsp; ` : "";
  const isAccordion = collapse || lineCount > threshold;

  if (!isAccordion) {
    return (
      `<div data-copy-panel="true" style="${theme.codePanel}">\n` +
      `<div style="${theme.codeBar}"><span style="${theme.codeLabel}">${titleHtml}${escapeHtml(label)}</span>${copyButton(theme.copyButton)}</div>\n` +
      `<pre style="${theme.pre}"><code>${body}</code></pre>\n` +
      `</div>\n`
    );
  }

  const startsClosed = collapse || language === "css";
  const rows = lineCount === 1 ? "1 riga" : `${lineCount} righe`;
  return (
    `<details data-copy-panel="true"${startsClosed ? "" : " open"} style="${theme.codePanel}">\n` +
    `<summary style="${theme.codeSummary}">${copyButton(theme.copyButtonInSummary)}` +
    `${titleHtml}${escapeHtml(label)} &nbsp;·&nbsp; ${rows} &nbsp;·&nbsp; clicca per aprire o chiudere</summary>\n` +
    `<pre style="${theme.preInAccordion}"><code>${body}</code></pre>\n` +
    `</details>\n`
  );
}

