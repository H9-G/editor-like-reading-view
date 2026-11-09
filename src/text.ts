import { keepBlankLines } from "./blank";
import { keepIndent } from "./indent";

export interface TextOptions {
  indent: boolean;
  quotes: boolean;
  lists: boolean;
}

const QUOTE = /^ {0,3}>/;

/**
 * Quotes and callouts: the inside of each quote keeps its empty lines and indentation, as in the editor.
 * Quotes inside quotes are handled the same way.
 */
export function keepQuotes(md: string, lists = true): string {
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    if (!QUOTE.test(lines[i])) {
      out.push(lines[i++]);
      continue;
    }
    const inner: string[] = [];
    while (i < lines.length && QUOTE.test(lines[i])) inner.push(lines[i++].replace(/^ {0,3}> ?/, ""));
    const done = keepBlankLines(keepIndent(keepQuotes(inner.join("\n"), lists)), lists);
    for (const l of done.split("\n")) out.push(l === "" ? ">" : `> ${l}`);
  }
  return out.join("\n");
}

/** The text of one block of the note, changed so that rendering it gives what the editor shows. */
export function blockText(src: string, o: TextOptions): string {
  let out = src;
  if (o.quotes) out = keepQuotes(out, o.lists);
  if (o.indent) out = keepIndent(out);
  return out;
}

/** Spaces and tabs inside a line: the first space stays a normal space (so the line can wrap there). */
export function keepInnerSpaces(s: string, tab = 4): string {
  if (!/ {2}|\t/.test(s)) return s;
  return s.replace(/\t/g, " ".repeat(tab)).replace(/ {2,}/g, (m) => " " + " ".repeat(m.length - 1));
}
