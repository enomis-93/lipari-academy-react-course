# Copilot Guide — Convert LipariBank Markdown modules to TinyMCE HTML

## Goal

Convert every course module written in Markdown (`.md`) into HTML that can be pasted into the TinyMCE content editor.

The result must preserve the original lesson content and learning structure while applying the visual system described below. This is a conversion task, not a content rewrite.

## How to run the task

Ask GitHub Copilot Agent to:

1. Scan the repository recursively for course `.md` files.
2. Exclude generated/vendor folders and documentation that is not part of the course.
3. Convert each eligible Markdown file to HTML.
4. Preserve the directory structure and relative links.
5. Write converted files to a separate output directory named `tinymce-html/` at the repository root.
6. Never overwrite or delete the original Markdown files.
7. Produce a conversion report listing converted files, skipped files, warnings, and links that may need checking.

Typical folders to exclude:
- `.git/`
- `node_modules/`
- `dist/`
- `build/`
- `coverage/`
- `.next/`
- `vendor/`
- `tinymce-html/` (the output folder itself)

If the repository has a known course root (for example `React/`, `React_Course/`, `modules/`, or `content/`), prioritize that folder. Do not convert `README.md`, `CHANGELOG.md`, `LICENSE.md`, package documentation, or unrelated project documentation unless explicitly requested.

## Critical content-preservation rules

- Do not summarize, shorten, paraphrase, translate, or invent lesson content.
- Preserve all headings, paragraphs, lists, numbered steps, blockquotes, callouts, tables, exercises, checklists, challenges, recaps, and next-chapter sections.
- Preserve code exactly: punctuation, quotes, indentation, blank lines, operators, JSX, shell commands, and casing.
- Do not silently fix code, even if it appears incorrect. Report suspected issues separately.
- Preserve emoji and Italian/English wording.
- Preserve Markdown links as HTML links. Keep relative paths relative to the converted file's location. Do not turn a relative link into an invented absolute URL.
- Preserve image references and alt text. If an image path is relative, keep it relative to the corresponding converted file.
- Preserve ordered-list numbering and nested-list hierarchy.
- Escape HTML-sensitive characters in text and code correctly. Code examples must display as text, not execute as HTML.

## Visual design

Use a consistent, clean educational layout suitable for TinyMCE and Moodle-like content areas.

### General page styling

Use inline styles only. Do not depend on:
- external CSS files;
- `<style>` blocks;
- CSS classes for visual appearance;
- CSS variables;
- external fonts or icon libraries.

Recommended typography:
- `font-family: Arial, Helvetica, sans-serif`
- body text: `15px`, line-height `1.7`, color `#334155`
- main heading: `27px`, color `#172554`
- section headings (`h2`): `22px`, color `#172554`, bottom border `2px solid #dbeafe`, padding-bottom `8px`
- subsection headings (`h3`): `18px`, color `#1e40af`
- links: `color: #2563eb`
- horizontal separators: `border-top: 1px solid #e2e8f0`

Use sensible vertical spacing. Avoid oversized cards, excessive borders, gradients, and decorative elements that distract from the lesson.

### Page header

When the Markdown begins with a course/module title and metadata, render:
- the main title in a light-blue header panel;
- metadata such as day, chapter, topic, estimated duration, and project milestone beneath it;
- a pale-blue background `#eff6ff`, left border `5px solid #2563eb`, padding around `24px`, and rounded corners.

Do not invent metadata that is not present in the source.

### Callouts

Render blockquotes and explicitly labelled notes as restrained callouts:
- Remember / Tip: pale blue `#eff6ff`, left border `4px solid #3b82f6`;
- Warning / Common Mistakes: pale orange `#fff7ed`, left border `4px solid #f59e0b`;
- Success / Expected result: pale green `#f0fdf4`, left border `4px solid #16a34a`;
- neutral information: `#f8fafc`, left border `4px solid #64748b`.

Keep the original wording unchanged.

## Code blocks and Copy buttons

This is the most important rule.

### Which blocks get a Copy button

Add a Copy button ONLY to fenced Markdown code blocks that contain code or commands, for example:

- ` ```js `, ` ```jsx `, ` ```tsx `, ` ```ts `
- ` ```html `, ` ```css `, ` ```json `
- ` ```bash `, ` ```sh `, ` ```powershell `, ` ```shell `
- ` ```sql `, ` ```java `, ` ```python `, ` ```text ` when the block is actually a code/tree/configuration snippet.

A `text` block showing a component tree, directory tree, terminal output, or configuration example may receive Copy because copying the whole snippet is useful.

Do NOT add Copy buttons to:
- ordinary Markdown tables containing explanations or comparison data;
- normal paragraphs or inline code;
- checklists;
- callouts;
- headings;
- navigation links;
- tables that merely organize lesson information.

If a Markdown table contains a dedicated code-snippet cell or command that the learner is expected to copy, prefer converting that snippet into its own code panel. Only add a Copy control to the code panel, not to the entire explanatory table. Do not add Copy to a table just because one cell contains a short inline-code term.

### Code panel appearance

Use a dark navy panel:
- outer background: `#0f172a`;
- border: `1px solid #1e3a8a`;
- top toolbar: `#172554`;
- toolbar border: `1px solid #1e3a8a`;
- toolbar label: `#bfdbfe`;
- code text: `#e2e8f0`;
- terminal command text may use `#86efac`;
- monospace font: `Consolas, Monaco, monospace`;
- font size: `13px`;
- line-height: `1.7`;
- code area padding: `18px`;
- `overflow-x: auto`;
- preserve whitespace using `<pre style="white-space: pre;">`.

Each code panel should have a compact toolbar with:
- a short language label, derived from the fenced code language when available;
- a minimal button with a Material-style copy icon and an accessible `Copy code` label;
- button styling inline, transparent background, no prominent border, light-blue text.

Use a semantic structure similar to:

```html
<div style="background:#0f172a; border:1px solid #1e3a8a; border-radius:8px; overflow:hidden; margin:14px 0 22px;">
  <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:#172554; border-bottom:1px solid #1e3a8a;">
    <span style="font-size:12px; font-weight:600; color:#bfdbfe;">JAVASCRIPT</span>
    <button type="button" class="copy-code-btn" aria-label="Copy code" title="Copy code" style="display:inline-flex; align-items:center; gap:6px; background:transparent; border:0; color:#bfdbfe; cursor:pointer; font-size:12px; padding:4px 6px;">
      <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>
      <span>Copy</span>
    </button>
  </div>
  <pre style="margin:0; padding:18px; overflow-x:auto; color:#e2e8f0; font-family:Consolas, Monaco, monospace; font-size:13px; line-height:1.7; white-space:pre;"><code>...HTML-escaped source code...</code></pre>
</div>
```

The example above is a template only. Generate a separate panel for every eligible fenced code block. Do not put one shared Copy button around multiple snippets.

### Copy implementation

Provide the shared JavaScript source in the output, for example:

`tinymce-html/copy-code.js`

Every generated lesson HTML must also include the complete contents of `copy-code.js` inside its own `<script>` tag. Keep the standalone file as the canonical source and use the same event-delegation implementation in every generated page. Do not put `onclick` attributes on buttons.

For stronger panel targeting, add `data-copy-panel="true"` to each outer code-panel `<div>`.

Important deployment note: TinyMCE, Moodle filters, sanitizers, or iframe policies may remove inline scripts or prevent clipboard operations. Verify that the target host permits the required script. If it strips scripts, register the same shared source through the host application's approved mechanism and in the document or iframe that renders the lesson.

## Tables

- Preserve genuine Markdown tables as HTML `<table>` elements.
- Use a dark navy table theme, distinct from code panels:
  - table header background `#172554`;
  - header text `#eff6ff`;
  - body background `#ffffff`;
  - alternate row background `#f8fafc`;
  - borders `#dbeafe`;
  - body text `#334155`.
- Use inline styles on `<table>`, `<th>`, and `<td>`.
- Use `width:100%`, `border-collapse:collapse`, and readable cell padding.
- Do NOT add Copy buttons to ordinary data/explanation tables.
- If a table contains long code, avoid forcing code into narrow cells. Convert the code to a separate dark code panel after or before the table while preserving the intended order and explanation.

## Other Markdown elements

- Inline code: use `<code>` with a light neutral background, monospace font, and modest padding. Do not add a Copy button.
- Bold and italic: preserve semantic `<strong>` and `<em>`.
- Lists: preserve nesting and numbering.
- Links: render as `<a>` with inline blue styling. Keep relative targets intact.
- Images: render as `<img>` with useful alt text and responsive inline sizing (`max-width:100%; height:auto;`).
- Horizontal rules: use a subtle border.
- Checkboxes: preserve the checkbox symbol or use a safe textual equivalent; do not introduce JavaScript interactions unless requested.
- Mermaid or diagram source blocks: preserve the source in a copyable code panel. Do not pretend that TinyMCE will render Mermaid unless the host page has a Mermaid renderer.

## Conversion and validation requirements

Use a real Markdown parser rather than regex-only Markdown conversion. Suitable Node.js choices include `markdown-it` or `remark`.

The conversion process should:
1. Walk the eligible course directories recursively.
2. Parse Markdown while retaining fenced-code language information.
3. Convert Markdown tokens to HTML.
4. Replace fenced code tokens with the dark code-panel template and Copy button.
5. Style tables and other elements inline.
6. Preserve relative links and images relative to the mirrored output directory.
7. Write UTF-8 HTML files (prefer `.html` output extensions).
8. Keep original `.md` files unchanged.
9. Generate one shared `copy-code.js` file, not one script per lesson.
10. Generate a report, for example `tinymce-html/conversion-report.md`.

Do not use regular expressions as the primary Markdown parser. If a custom renderer is needed, use parser tokens or a renderer extension so code content is escaped correctly and tables are identified reliably.

### Validation checklist

For every converted file, verify:

- [ ] All source headings and sections are present.
- [ ] Paragraphs, lists, nested lists, links, images, and tables are preserved.
- [ ] Every fenced code block appears exactly once.
- [ ] Code indentation and line breaks are preserved.
- [ ] Only useful code/command blocks have Copy buttons.
- [ ] Ordinary explanatory tables have no Copy button.
- [ ] No script or inline `onclick` was inserted into lesson HTML.
- [ ] All relative links and image references have been checked.
- [ ] No original Markdown file was modified.
- [ ] HTML is valid enough for the TinyMCE content area.

## Recommended Copilot Agent prompt

Copy this prompt into GitHub Copilot Agent after adding this guide to the repository:

> Read `COPILOT_TINYMCE_CONVERSION_GUIDE.md` completely and follow it as the source of truth.
>
> Inspect the repository and identify the actual course content root. Then implement a repeatable recursive Markdown-to-TinyMCE-HTML conversion tool using a real Markdown parser. Convert all eligible course `.md` files into a mirrored `tinymce-html/` directory. Do not modify or delete source Markdown files.
>
> Preserve every lesson's wording and structure. Apply the inline visual theme from the guide. Add a Copy button only to fenced code/command/configuration/tree snippets that learners may reasonably need to copy. Never add Copy to ordinary explanatory tables or prose. Keep the JavaScript in one shared `tinymce-html/copy-code.js` file; do not embed scripts or inline event handlers in lesson HTML.
>
> Before converting everything, convert one representative lesson and show me the result for review. After approval, run the conversion recursively, validate the output, and create `tinymce-html/conversion-report.md` with converted/skipped files and warnings. Make the conversion command repeatable and document how to run it.
>
> If a source file contains ambiguous content, preserve it and report the ambiguity instead of guessing or rewriting it.
