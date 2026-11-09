/**
 * Empty lines. Markdown folds several empty lines into one gap; the editor shows every one of them.
 * Between blocks the first empty line is the normal gap and every further one adds a line of space.
 * Between list items (which have no gap of their own) and at the start of the note, every empty line counts.
 */

export const BLANK_CLASS = "elrv-blank";
export const GAP_CLASS = "elrv-gap";
export const BLANK_BEFORE_CLASS = "elrv-blank-before";
export const GAP_BEFORE_CLASS = "elrv-gap-before";
export const LINES_VAR = "--elrv-lines";

const isBlank = (line: string) => line.trim() === "";
const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s/;
const QUOTED_LIST_ITEM = /^(?:\s*>)*\s*(?:[-*+]|\d+[.)])\s/;
const LIST_START = /^(\s*(?:(?:[-*+]|\d+[.)])\s+(?:\[.\]\s+)?)?)/;
const FENCE = /^\s*(`{3,}|~{3,})/;
const KEEP_AT_START = /^(?:`{3}|~{3}|\$\$|[#>|<]|[-*_](?:\s*[-*_]){2,}\s*$)/;

const countOf = (s: string, part: string) => s.split(part).length - 1;
const unquote = (line: string) => line.replace(/^(?:\s*>)+/, "");

const spacer = (extra: number) => `<div class="${BLANK_CLASS}">${"<br>".repeat(extra)}</div>`;

function withGap(line: string, lines: number): string | null {
  const start = LIST_START.exec(line)?.[1] ?? "";
  const rest = line.slice(start.length);
  if (rest.trim() === "" || KEEP_AT_START.test(rest.trimStart())) return null;
  return `${start}<span class="${GAP_CLASS} ${GAP_CLASS}-${lines}"></span>${rest}`;
}

/**
 * Markdown text with its empty lines turned into space: spacers between blocks, markers between list items.
 * Used for the inside of quotes and callouts, which are rendered again from this text.
 */
export function keepBlankLines(md: string, lists = true): string {
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let fence: string | null = null;
  let math = false;
  let comment = false;
  let blanks = 0;
  let prev: string | null = null;

  for (let line of lines) {
    const free = fence === null && !math && !comment;
    if (free && isBlank(line)) {
      blanks++;
      out.push(line);
      continue;
    }
    if (free && blanks > 0 && prev !== null) {
      const inList = LIST_ITEM.test(prev) || /^[ \t]/.test(prev);
      const indented = /^[ \t]/.test(line);
      if (inList && LIST_ITEM.test(line)) {
        const marked = lists ? withGap(line, blanks) : null;
        if (marked !== null) {
          out.splice(out.length - blanks, blanks);
          line = marked;
        }
      } else if (indented) {
        if (lists && inList && blanks > 1) line = withGap(line, blanks - 1) ?? line;
      } else if (blanks > 1) {
        out.push(spacer(blanks - 1), "");
      }
    }
    blanks = 0;
    out.push(line);
    prev = line;

    const t = line.trim();
    const f = FENCE.exec(line);
    if (fence !== null) {
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length && t === f[1]) fence = null;
      continue;
    }
    if (math) {
      if (t.endsWith("$$")) math = false;
      continue;
    }
    if (comment) {
      if (countOf(line, "%%") % 2 === 1) comment = false;
      continue;
    }
    if (f) fence = f[1];
    else if (t.startsWith("$$") && !(t.length > 2 && t.endsWith("$$"))) math = true;
    else if (countOf(line, "%%") % 2 === 1) comment = true;
  }
  return out.join("\n");
}

let cacheText = "";
let cacheLines: string[] = [];
function linesOf(text: string): string[] {
  if (text !== cacheText) {
    cacheText = text;
    cacheLines = text.split(/\r?\n/);
  }
  return cacheLines;
}

/** Index of the line that closes the front matter, or -1 when the note has none. */
function frontmatterEnd(lines: string[]): number {
  if (lines[0]?.trim() !== "---") return -1;
  for (let i = 1; i < lines.length; i++) if (lines[i].trim() === "---") return i;
  return -1;
}

export interface Space {
  lines: number;
  /** The space is padding above the block (lists and the start of the note), not a spacer that replaces a margin. */
  padding: boolean;
}

/**
 * The space above the block that starts at `lineStart`.
 * `leading`: also count empty lines at the start of the note (or right after the front matter).
 */
export function spaceBefore(text: string, lineStart: number, lineEnd = lineStart, leading = true): Space {
  const lines = linesOf(text);
  let start = lineStart;
  while (start < lineEnd && start < lines.length && isBlank(lines[start])) start++;
  let i = start - 1;
  let n = 0;
  while (i >= 0 && isBlank(lines[i])) {
    n++;
    i--;
  }
  if (n === 0) return { lines: 0, padding: false };
  if (i < 0 || i === frontmatterEnd(lines)) return leading ? { lines: n, padding: true } : { lines: 0, padding: false };
  const prev = lines[i];
  const cur = lines[start] ?? "";
  if ((QUOTED_LIST_ITEM.test(prev) || /^[ \t]/.test(prev)) && QUOTED_LIST_ITEM.test(cur)) return { lines: n, padding: true };
  return { lines: Math.max(0, n - 1), padding: false };
}

/** For each list item in lines lineStart…lineEnd (in order), how many empty lines are right above it. */
export function listItemGaps(text: string, lineStart: number, lineEnd: number): number[] {
  const lines = linesOf(text);
  const out: number[] = [];
  let fence: string | null = null;
  for (let i = lineStart; i <= lineEnd && i < lines.length; i++) {
    const line = unquote(lines[i]);
    const f = FENCE.exec(line);
    if (fence !== null) {
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length) fence = null;
      continue;
    }
    if (f) {
      fence = f[1];
      continue;
    }
    if (!QUOTED_LIST_ITEM.test(lines[i])) continue;
    let n = 0;
    let j = i - 1;
    while (j >= lineStart && isBlank(unquote(lines[j]))) {
      n++;
      j--;
    }
    out.push(j < lineStart ? 0 : n);
  }
  return out;
}
