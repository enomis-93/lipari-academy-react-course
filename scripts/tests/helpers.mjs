// Utility condivise dai test: tolgono i tag e decodificano le entità.
export function textOf(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");
}

export function lines(count, text = "riga") {
  return Array.from({ length: count }, (_, index) => `${text} ${index + 1}`).join("\n") + "\n";
}
