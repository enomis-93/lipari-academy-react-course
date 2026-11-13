// Tutti gli stili della pagina generata. TinyMCE su Moodle applica solo stili inline:
// niente <style>, niente classi usate per l'aspetto. Per cambiare la grafica si modifica questo file.

const mono = "Consolas, Monaco, monospace";

export const theme = {
  // Un blocco di codice più lungo di così diventa richiudibile.
  collapseThreshold: 20,

  // Tema di Shiki da cui si prendono i colori del codice.
  codeTheme: "night-owl",
  codeForeground: "#e2e8f0",
  codeComment: "#8492a6",
  terminalText: "#86efac",

  wrapper: "font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:1.7; color:#334155;",

  header: "margin:0 0 24px; padding:22px 24px; background:#eff6ff; border-left:5px solid #2563eb; border-radius:8px;",
  headerTitle: "margin:0 0 10px; color:#172554; font-size:27px; line-height:1.35;",
  headerMeta: "margin:0; color:#334155;",

  h1: "margin:0 0 18px; color:#172554; font-size:27px; line-height:1.35;",
  h2: "margin:30px 0 12px; padding-bottom:8px; border-bottom:2px solid #dbeafe; color:#172554; font-size:22px; line-height:1.4;",
  h3: "margin:24px 0 10px; color:#1e40af; font-size:18px; line-height:1.4;",
  h4: "margin:20px 0 8px; color:#1e40af; font-size:16px; line-height:1.4;",

  paragraph: "margin:0 0 14px;",
  paragraphInBox: "margin:0 0 6px;",
  link: "color:#2563eb;",
  unlinked: "color:#1e3a8a;",
  inlineCode: `padding:2px 5px; background:#f1f5f9; border-radius:4px; color:#1e293b; font-family:${mono}; font-size:0.92em;`,
  list: "margin:0 0 16px; padding-left:26px;",
  listItem: "margin:0 0 6px;",
  rule: "margin:24px 0; border:0; border-top:1px solid #e2e8f0;",
  image: "max-width:100%; height:auto;",

  tableWrapper: "overflow-x:auto; margin:16px 0 22px;",
  table: "width:100%; border-collapse:collapse; color:#334155;",
  tableHead: "padding:10px 12px; border:1px solid #dbeafe; background:#172554; color:#eff6ff; text-align:left; vertical-align:top;",
  tableCell: "padding:10px 12px; border:1px solid #dbeafe; text-align:left; vertical-align:top;",
  tableRowOdd: "#ffffff",
  tableRowEven: "#f8fafc",

  callout: {
    info: "background:#eff6ff; border-left:4px solid #3b82f6; padding:14px 18px; margin:16px 0; border-radius:4px;",
    warning: "background:#fff7ed; border-left:4px solid #f59e0b; padding:14px 18px; margin:16px 0; border-radius:4px;",
    success: "background:#f0fdf4; border-left:4px solid #16a34a; padding:14px 18px; margin:16px 0; border-radius:4px;",
    neutral: "background:#f8fafc; border-left:4px solid #64748b; padding:14px 18px; margin:16px 0; border-radius:4px;",
  },

  checklistBox: "background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px 18px; margin:14px 0;",
  checklistList: "margin:0; padding:0; list-style:none;",

  codePanel: "background:#0f172a; border:1px solid #1e3a8a; border-radius:8px; overflow:hidden; margin:14px 0 22px;",
  codeBar: "display:flex; justify-content:space-between; align-items:center; padding:8px 14px; background:#172554; border-bottom:1px solid #1e3a8a;",
  codeSummary: "padding:10px 14px; background:#172554; color:#93c5fd; cursor:pointer; font-size:13px; line-height:26px;",
  codeLabel: "font-size:13px; color:#93c5fd;",
  codeTitle: `font-family:${mono}; font-weight:600; color:#e0f2fe;`,
  copyButton: "background:transparent; border:1px solid #334155; border-radius:6px; color:#bfdbfe; cursor:pointer; font-size:12px; line-height:16px; padding:4px 10px;",
  copyButtonInSummary: "float:right; background:transparent; border:1px solid #334155; border-radius:6px; color:#bfdbfe; cursor:pointer; font-size:12px; line-height:16px; padding:4px 10px;",
  pre: `margin:0; padding:16px 18px; overflow-x:auto; color:#e2e8f0; font-family:${mono}; font-size:13px; line-height:1.7; white-space:pre;`,
  preInAccordion: `margin:0; padding:16px 18px; overflow-x:auto; border-top:1px solid #1e3a8a; color:#e2e8f0; font-family:${mono}; font-size:13px; line-height:1.7; white-space:pre;`,

  solution: "margin:16px 0 22px; border:1px solid #bfdbfe; border-radius:8px; overflow:hidden; background:#ffffff;",
  solutionSummary: "padding:12px 16px; background:#eff6ff; color:#1e40af; cursor:pointer; font-weight:700;",
  solutionBody: "padding:14px 16px 2px;",

  next: "background:#172554; border-radius:8px; padding:18px 20px; margin-top:28px;",
  nextTitle: "margin:0 0 6px; color:#bfdbfe; font-size:17px; line-height:1.4;",
  nextParagraph: "margin:0; color:#e2e8f0;",
  nextLink: "color:#93c5fd; font-weight:600;",
  nextUnlinked: "color:#bfdbfe;",
  nextInlineCode: `padding:2px 5px; background:#1e3a8a; border-radius:4px; color:#e0f2fe; font-family:${mono}; font-size:0.92em;`,
};

// Etichette mostrate nella barra del blocco. Un linguaggio assente da qui viene segnalato nel report.
export const languageLabels = {
  jsx: "JSX",
  javascript: "JavaScript",
  js: "JavaScript",
  bash: "Terminale",
  sh: "Terminale",
  shell: "Terminale",
  powershell: "PowerShell",
  ps1: "PowerShell",
  css: "CSS",
  json: "JSON",
  html: "HTML",
  markdown: "Markdown",
  md: "Markdown",
  diff: "Diff",
  text: "Testo",
  txt: "Testo",
};

export const terminalLanguages = new Set(["bash", "sh", "shell", "powershell", "ps1"]);
