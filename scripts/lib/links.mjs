import path from "node:path";

const normalizeKey = (key) => key.replaceAll("\\", "/").replace(/^\.\//, "").replace(/\/+$/, "");

/**
 * Crea la funzione che decide cosa fare di ogni link di un capitolo.
 *
 * `linkMap` è il contenuto di moodle-links.json: percorso del file nel repository
 * (es. "Day_01_React_Fundamentals/03_JSX.md") → indirizzo della pagina su Moodle.
 * `sourcePath` è il percorso del capitolo che contiene il link, relativo alla radice.
 */
export function createLinkResolver(linkMap) {
  const map = new Map(Object.entries(linkMap || {}).map(([key, url]) => [normalizeKey(key), url]));

  return function resolveLink(href, sourcePath) {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) return { kind: "external", url: href };
    if (href.startsWith("#")) return { kind: "anchor" };

    const withoutAnchor = decodeURIComponent(href.split(/[?#]/, 1)[0]);
    const sourceDirectory = path.posix.dirname(normalizeKey(sourcePath));
    const target = normalizeKey(path.posix.normalize(path.posix.join(sourceDirectory, withoutAnchor)));

    const url = map.get(target);
    return url ? { kind: "mapped", url } : { kind: "unmapped", target };
  };
}
