import { createHighlighter as createShiki } from "shiki";
import { terminalLanguages, theme } from "./theme.mjs";

// Linguaggi che Shiki colora. Gli altri (text, diff, sconosciuti) restano testo semplice.
const shikiLanguages = {
  jsx: "jsx",
  javascript: "javascript",
  js: "javascript",
  css: "css",
  json: "json",
  html: "html",
  markdown: "markdown",
  md: "markdown",
};

export function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}


function tokenStyle(token, commentColor) {
  if (!token.color) return null;
  const color = token.color.toLowerCase();
  if (color === commentColor) return `color:${theme.codeComment}; font-style:italic;`;
  return `color:${color};`;
}

/**
 * Restituisce una funzione sincrona `(code, lang) => html`.
 * I colori finiscono nell'HTML come <span style="color:...">: sul sito non serve JavaScript.
 */
export async function createHighlighter() {
  const shiki = await createShiki({
    themes: [theme.codeTheme],
    langs: [...new Set(Object.values(shikiLanguages))],
  });
  const themeData = shiki.getTheme(theme.codeTheme);
  const foreground = (themeData.fg || "").toLowerCase();
  const commentColor = findCommentColor(themeData);

  return function highlight(code, lang) {
    const language = (lang || "").toLowerCase();
    if (terminalLanguages.has(language)) {
      return `<span style="color:${theme.terminalText};">${escapeHtml(code)}</span>`;
    }
    const shikiLanguage = shikiLanguages[language];
    if (!shikiLanguage) return escapeHtml(code);

    const tokenLines = shiki.codeToTokensBase(code, { lang: shikiLanguage, theme: theme.codeTheme });
    return tokenLines
      .map((tokens) => {
        let html = "";
        let pendingStyle = null;
        let pendingText = "";
        const flush = () => {
          if (!pendingText) return;
          html += pendingStyle
            ? `<span style="${pendingStyle}">${escapeHtml(pendingText)}</span>`
            : escapeHtml(pendingText);
          pendingText = "";
        };
        for (const token of tokens) {
          const isDefault = !token.color || token.color.toLowerCase() === foreground;
          const isBlank = token.content.trim() === "";
          const style = isDefault || isBlank ? null : tokenStyle(token, commentColor);
          // Gli spazi si attaccano al token precedente: meno <span>, stesso aspetto.
          if (isBlank || style === pendingStyle) {
            pendingText += token.content;
            continue;
          }
          flush();
          pendingStyle = style;
          pendingText = token.content;
        }
        flush();
        return html;
      })
      .join("\n");
  };
}

function findCommentColor(themeData) {
  for (const setting of themeData.settings || themeData.tokenColors || []) {
    const scopes = [].concat(setting.scope || []);
    if (scopes.some((scope) => scope === "comment" || scope.startsWith("comment"))) {
      const color = setting.settings?.foreground;
      if (color) return color.toLowerCase();
    }
  }
  return "";
}

