import MarkdownIt from "markdown-it";
import { isKnownLanguage, parseFenceInfo, renderCodePanel } from "./fence.mjs";
import { escapeAttribute, escapeHtml } from "./highlight.mjs";
import { theme } from "./theme.mjs";

const markdown = new MarkdownIt({ html: false, linkify: false, typographer: false });
const rules = markdown.renderer.rules;

// ---------------------------------------------------------------------------
// Link
// ---------------------------------------------------------------------------

function defaultResolveLink(href) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) return { kind: "external", url: href };
  if (href.startsWith("#")) return { kind: "anchor" };
  return { kind: "unmapped" };
}

rules.link_open = (tokens, index, options, env) => {
  const href = tokens[index].attrGet("href") || "";
  const resolved = env.resolveLink(href, env.sourcePath);
  env.linkStack.push(resolved.kind);

  if (resolved.kind === "external") {
    const style = env.inNext ? theme.nextLink : theme.link;
    return `<a href="${escapeAttribute(resolved.url)}" target="_blank" rel="noopener" style="${style}">`;
  }
  if (resolved.kind === "mapped") {
    const style = env.inNext ? theme.nextLink : theme.link;
    return `<a href="${escapeAttribute(resolved.url)}" style="${style}">`;
  }
  if (resolved.kind === "unmapped") env.warnings.push(`Link da collegare: ${resolved.target || href}`);
  return `<strong style="${env.inNext ? theme.nextUnlinked : theme.unlinked}">`;
};

rules.link_close = (tokens, index, options, env) => {
  const kind = env.linkStack.pop();
  return kind === "external" || kind === "mapped" ? "</a>" : "</strong>";
};

// ---------------------------------------------------------------------------
// Blocchi di codice
// ---------------------------------------------------------------------------

function renderFence(code, info, env) {
  const { lang, title, collapse } = parseFenceInfo(info);
  if (!lang) env.warnings.push("Blocco di codice senza linguaggio");
  else if (!isKnownLanguage(lang)) env.warnings.push(`Linguaggio non riconosciuto: ${lang}`);
  return renderCodePanel({ code, lang, title, collapse, highlight: env.highlight });
}

rules.fence = (tokens, index, options, env) => renderFence(tokens[index].content, tokens[index].info, env);
rules.code_block = (tokens, index, options, env) => renderFence(tokens[index].content, "", env);
rules.code_inline = (tokens, index, options, env) =>
  `<code style="${env.inNext ? theme.nextInlineCode : theme.inlineCode}">${escapeHtml(tokens[index].content)}</code>`;

// ---------------------------------------------------------------------------
// Testo
// ---------------------------------------------------------------------------

rules.heading_open = (tokens, index, options, env) => {
  const tag = tokens[index].tag;
  const style = env.inNext ? theme.nextTitle : theme[tag] || theme.h4;
  return `<${tag} style="${style}">`;
};
rules.heading_close = (tokens, index) => `</${tokens[index].tag}>\n`;

const paragraphCallouts = [
  { pattern: /^\*\*Risultato atteso/i, style: () => theme.callout.success },
  { pattern: /^\*\*Errori da evitare/i, style: () => theme.callout.warning },
];

rules.paragraph_open = (tokens, index, options, env) => {
  const token = tokens[index];
  if (token.hidden) return "";
  if (env.inHeader) return `<p style="${theme.headerMeta}">`;
  if (env.inNext) return `<p style="${theme.nextParagraph}">`;
  if (env.quoteDepth > 0) return `<p style="${theme.paragraphInBox}">`;
  if (token.level === 0) {
    const text = tokens[index + 1]?.content || "";
    const callout = paragraphCallouts.find(({ pattern }) => pattern.test(text));
    if (callout) return `<p style="${callout.style()}">`;
  }
  return `<p style="${theme.paragraph}">`;
};
rules.paragraph_close = (tokens, index) => (tokens[index].hidden ? "" : "</p>\n");

rules.softbreak = (tokens, index, options, env) => (env.quoteDepth > 0 || env.inHeader ? "<br>\n" : "\n");
rules.hr = () => `<hr style="${theme.rule}">\n`;

rules.image = (tokens, index) => {
  const token = tokens[index];
  const title = token.attrGet("title");
  return (
    `<img src="${escapeAttribute(token.attrGet("src") || "")}" alt="${escapeAttribute(token.content || "")}"` +
    `${title ? ` title="${escapeAttribute(title)}"` : ""} style="${theme.image}">`
  );
};

// ---------------------------------------------------------------------------
// Riquadri (blockquote)
// ---------------------------------------------------------------------------

function calloutKind(label) {
  if (/💡|remember|tip|consiglio|suggerimento/i.test(label)) return "info";
  if (/⚠️|attenzione|errore|errori|prova prima|warning/i.test(label)) return "warning";
  if (/✓|✅|risultato atteso|success/i.test(label)) return "success";
  return "neutral";
}

rules.blockquote_open = (tokens, index, options, env) => {
  env.quoteDepth += 1;
  const label = tokens.slice(index + 1).find((token) => token.type === "inline")?.content || "";
  const firstLine = label.split("\n", 1)[0];
  return `<blockquote style="${theme.callout[calloutKind(firstLine)]}">`;
};
rules.blockquote_close = (tokens, index, options, env) => {
  env.quoteDepth -= 1;
  return "</blockquote>\n";
};

// ---------------------------------------------------------------------------
// Elenchi e tabelle
// ---------------------------------------------------------------------------

rules.bullet_list_open = (tokens, index, options, env) => {
  const firstText = tokens.slice(index + 1).find((token) => token.type === "inline")?.content || "";
  const isChecklist = firstText.trimStart().startsWith("☐");
  env.listStack.push(isChecklist);
  return isChecklist
    ? `<div style="${theme.checklistBox}"><ul style="${theme.checklistList}">`
    : `<ul style="${theme.list}">`;
};
rules.bullet_list_close = (tokens, index, options, env) => (env.listStack.pop() ? "</ul></div>\n" : "</ul>\n");

rules.ordered_list_open = (tokens, index) => {
  const start = tokens[index].attrGet("start");
  const startAttribute = start && String(start) !== "1" ? ` start="${escapeAttribute(String(start))}"` : "";
  return `<ol style="${theme.list}"${startAttribute}>`;
};
rules.list_item_open = () => `<li style="${theme.listItem}">`;

rules.table_open = (tokens, index, options, env) => {
  env.tableRow = -1;
  return `<div style="${theme.tableWrapper}"><table style="${theme.table}">`;
};
rules.table_close = () => "</table></div>\n";
rules.tbody_open = (tokens, index, options, env) => {
  env.tableRow = 0;
  return "<tbody>";
};
rules.tr_open = (tokens, index, options, env) => {
  if (env.tableRow >= 0) env.tableRow += 1;
  return "<tr>";
};
rules.th_open = () => `<th style="${theme.tableHead}">`;
rules.td_open = (tokens, index, options, env) => {
  const background = env.tableRow % 2 === 0 ? theme.tableRowEven : theme.tableRowOdd;
  return `<td style="${theme.tableCell} background:${background};">`;
};

// ---------------------------------------------------------------------------
// Capitolo
// ---------------------------------------------------------------------------

function blockEnd(tokens, start) {
  if (tokens[start].nesting !== 1) return start;
  for (let index = start + 1; index < tokens.length; index += 1) {
    if (tokens[index].nesting === -1 && tokens[index].level === tokens[start].level) return index;
  }
  return tokens.length - 1;
}

function headingText(tokens, index) {
  return tokens[index + 1]?.content || "";
}

const isSolutionHeading = (text) => /^soluzion[ei]/i.test(text.replace(/^[^\p{L}]+/u, ""));
const isNextHeading = (text) => /(?:^|\s)next\s*$/i.test(text.trim());

/**
 * Converte il Markdown di un capitolo nell'HTML da incollare in TinyMCE.
 * Restituisce l'HTML (senza lo script del Copy) e gli avvisi per il report.
 */
export function renderChapter(source, { sourcePath = "", resolveLink = defaultResolveLink, highlight }) {
  const env = {
    sourcePath,
    resolveLink,
    highlight,
    warnings: [],
    linkStack: [],
    listStack: [],
    quoteDepth: 0,
    tableRow: -1,
    inHeader: false,
    inNext: false,
  };
  const tokens = markdown.parse(source.replace(/\r\n/g, "\n"), env);
  const renderTokens = (from, to) => markdown.renderer.render(tokens.slice(from, to + 1), markdown.options, env);
  const renderInline = (index) => markdown.renderer.renderInline(tokens[index + 1].children || [], markdown.options, env);

  let html = "";
  let index = 0;
  let solutionLevel = null;

  const closeSolution = () => {
    if (solutionLevel === null) return;
    html += "</div>\n</details>\n";
    solutionLevel = null;
  };
  const closeNext = () => {
    if (!env.inNext) return;
    html += "</div>\n";
    env.inNext = false;
  };

  // Intestazione: titolo principale + riquadro dei metadati in un unico pannello.
  if (tokens[0]?.type === "heading_open" && tokens[0].tag === "h1") {
    const titleEnd = blockEnd(tokens, 0);
    html += `<div style="${theme.header}">\n<h1 style="${theme.headerTitle}">${renderInline(0)}</h1>\n`;
    index = titleEnd + 1;
    if (tokens[index]?.type === "blockquote_open") {
      const quoteEnd = blockEnd(tokens, index);
      env.inHeader = true;
      html += renderTokens(index + 1, quoteEnd - 1);
      env.inHeader = false;
      index = quoteEnd + 1;
    }
    html += "</div>\n";
    if (tokens[index]?.type === "hr") index += 1;
  }

  while (index < tokens.length) {
    const token = tokens[index];
    const end = blockEnd(tokens, index);

    if (token.type === "heading_open") {
      const level = Number(token.tag.slice(1));
      const text = headingText(tokens, index);
      if (solutionLevel !== null && level <= solutionLevel) closeSolution();
      closeNext();

      if (isSolutionHeading(text)) {
        html +=
          `<details style="${theme.solution}">\n` +
          `<summary style="${theme.solutionSummary}">${renderInline(index)} — prova prima da solo, poi clicca per aprire</summary>\n` +
          `<div style="${theme.solutionBody}">\n`;
        solutionLevel = level;
        index = end + 1;
        continue;
      }
      if (isNextHeading(text)) {
        closeSolution();
        html += `<div style="${theme.next}">\n`;
        env.inNext = true;
      }
    } else if (token.type === "hr") {
      closeSolution();
    }

    html += renderTokens(index, end);
    index = end + 1;
  }

  closeSolution();
  closeNext();

  return { html: `<div style="${theme.wrapper}">\n${html}</div>\n`, warnings: [...new Set(env.warnings)] };
}
