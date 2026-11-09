import { BLANK_CLASS, GAP_CLASS, keepBlankLines, listItemGaps, spaceBefore } from "../src/blank";
import { allDicts, detectLanguage, tr } from "../src/i18n";
import { keepIndent } from "../src/indent";
import { DEFAULT_SETTINGS, sanitizeSettings } from "../src/settings";
import { blockText, keepInnerSpaces, keepQuotes } from "../src/text";

let failed = 0;
let passed = 0;
function test(name: string, f: () => void) {
  try {
    f();
    passed++;
  } catch (e) {
    failed++;
    console.error(`✗ ${name}\n  ${(e as Error).message}`);
  }
}
function eq(a: unknown, b: unknown) {
  const x = JSON.stringify(a);
  const y = JSON.stringify(b);
  if (x !== y) throw new Error(`expected ${y}\n  got      ${x}`);
}
const spacer = (n: number) => `<div class="${BLANK_CLASS}">${"<br>".repeat(n)}</div>`;
const gap = (n: number) => `<span class="${GAP_CLASS} ${GAP_CLASS}-${n}"></span>`;
const nb = (n: number) => "&nbsp;".repeat(n);

test("space above blocks", () => {
  const text = "a\n\n\n\nb\n\nc";
  eq(spaceBefore(text, 4), { lines: 2, padding: false });
  eq(spaceBefore(text, 6), { lines: 0, padding: false });
});

test("space between parts of a list counts every empty line", () => {
  eq(spaceBefore("- a\n\n- b", 2), { lines: 1, padding: true });
  eq(spaceBefore("> - a\n\n> - b", 2), { lines: 1, padding: true });
});

test("space at the start of the note", () => {
  eq(spaceBefore("\n\nfirst", 2), { lines: 2, padding: true });
  eq(spaceBefore("\n\nfirst", 2, 2, false), { lines: 0, padding: false });
  eq(spaceBefore("---\ntags: a\n---\n\n\ntext", 5), { lines: 2, padding: true });
  eq(spaceBefore("---\ntags: a\n---\ntext", 3), { lines: 0, padding: false });
});

test("list item gaps", () => {
  eq(listItemGaps("- a\n- b\n\n- c\n\n\n  - d\n```\n- no\n```", 0, 9), [0, 0, 1, 2]);
  eq(listItemGaps("> - a\n>\n> - b", 0, 2), [0, 1]);
});

test("empty lines inside a block of text", () => {
  eq(keepBlankLines("a\n\n\nb"), `a\n\n\n${spacer(1)}\n\nb`);
  eq(keepBlankLines("- a\n\n- b"), `- a\n- ${gap(1)}b`);
  eq(keepBlankLines("- a\n\n- b", false), "- a\n\n- b");
  eq(keepBlankLines("```\na\n\n\nb\n```"), "```\na\n\n\nb\n```");
});

test("indentation", () => {
  eq(keepIndent("\tone\n  two"), `${nb(4)}one\n${nb(2)}two`);
  eq(keepIndent("- a\n  - b"), "- a\n  - b");
  eq(keepIndent("```\n  x\n```"), "```\n  x\n```");
});

test("quotes keep empty lines and indentation", () => {
  eq(keepQuotes("> a\n>\n>\n> b"), `> a\n>\n>\n> ${spacer(1)}\n>\n> b`);
  eq(keepQuotes(">   indented"), `> ${nb(2)}indented`);
  eq(keepQuotes("> [!note] Title\n> text\n>\n>\n>\n> more"), `> [!note] Title\n> text\n>\n>\n>\n> ${spacer(2)}\n>\n> more`);
  eq(keepQuotes("> > inner\n> >\n> >\n> > b"), `> > inner\n> >\n> >\n> > ${spacer(1)}\n> >\n> > b`);
  eq(keepQuotes("> - a\n>\n> - b"), `> - a\n> - ${gap(1)}b`);
  eq(keepQuotes("plain\n\n\ntext"), "plain\n\n\ntext");
});

test("block text uses only the parts that are on", () => {
  const src = "  a\n> x\n>\n>\n> y";
  eq(blockText(src, { indent: false, quotes: false, lists: true }), src);
  eq(blockText("  a", { indent: true, quotes: false, lists: true }), `${nb(2)}a`);
  eq(blockText("> x\n>\n>\n> y", { indent: false, quotes: true, lists: true }), `> x\n>\n>\n> ${spacer(1)}\n>\n> y`);
});

test("spaces and tabs inside lines", () => {
  eq(keepInnerSpaces("a  b"), "a  b");
  eq(keepInnerSpaces("a    b c"), "a    b c");
  eq(keepInnerSpaces("a\tb"), "a    b");
  eq(keepInnerSpaces("a b"), "a b");
  eq(keepInnerSpaces(keepInnerSpaces("a  b")), "a  b");
});

test("settings", () => {
  eq(sanitizeSettings(undefined), DEFAULT_SETTINGS);
  const s = sanitizeSettings({ indent: false, quotes: "x", language: "ja", other: 1 });
  eq([s.indent, s.quotes, s.language, "other" in s], [false, true, "ja", false]);
});

test("all languages have the same keys", () => {
  const dicts = allDicts();
  const keys = Object.keys(dicts.en).sort();
  for (const [lang, d] of Object.entries(dicts)) {
    eq([lang, Object.keys(d).sort()], [lang, keys]);
    for (const k of keys) if (!(d as Record<string, string>)[k]) throw new Error(`${lang}.${k} is empty`);
  }
});

test("language detection", () => {
  eq(["ja", "zh-TW", "zh", "en-US", "pt"].map(detectLanguage), ["ja", "zh-TW", "zh-CN", "en", "en"]);
  eq(tr("ja", "indent"), "インデント");
});

console.log(`${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
