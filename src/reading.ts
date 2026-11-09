import { App, MarkdownPostProcessorContext, MarkdownRenderChild, MarkdownRenderer } from "obsidian";
import { BLANK_BEFORE_CLASS, GAP_BEFORE_CLASS, GAP_CLASS, LINES_VAR, listItemGaps, spaceBefore } from "./blank";
import { ReadingSettings } from "./settings";
import { blockText, keepInnerSpaces } from "./text";

interface SectionInfo {
  text: string;
  lineStart: number;
  lineEnd: number;
}

/** Text inside these is shown as written already (code) or is not text (math, drawings). */
const NO_SPACES = "code, pre, .math, mjx-container, svg, style, script, .frontmatter, .frontmatter-container, .metadata-container";

function mark(el: HTMLElement, cls: string, n: number): void {
  el.toggleClass(cls, n > 0);
  if (n > 0) el.setCssProps({ [LINES_VAR]: String(n) });
}

/** Clear the space classes; the variable is left only if a class still uses it. */
function unmarkAll(el: HTMLElement): void {
  el.removeClasses([BLANK_BEFORE_CLASS, GAP_BEFORE_CLASS]);
  el.setCssProps({ [LINES_VAR]: "" });
}

/**
 * Makes reading view look like the editor: empty lines, indentation, spaces inside lines, quotes and callouts.
 * Each block remembers its context, so the space above it can be updated when lines are added or removed
 * above a block whose own text did not change (Obsidian does not render such a block again).
 */
export class ReadingView {
  private blocks = new Map<HTMLElement, MarkdownPostProcessorContext>();
  /** While a block is rendered again, its own blocks are not changed a second time. */
  private rendering = 0;

  constructor(
    private app: App,
    private settings: () => ReadingSettings,
  ) {}

  async process(el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<void> {
    const info = ctx.getSectionInfo(el);
    if (!info) return; // not a block of a note in reading view
    const s = this.settings();
    this.blocks.set(el, ctx);
    const child = new MarkdownRenderChild(el);
    child.register(() => this.blocks.delete(el));
    ctx.addChild(child);

    if (this.rendering === 0 && (s.indent || s.quotes)) await this.renderAgain(el, ctx, info, child);
    this.space(el, ctx);
    if (s.innerSpaces) this.spaces(el);
  }

  /** A paragraph, an indented block or a quote is rendered again from text changed to match the editor. */
  private async renderAgain(el: HTMLElement, ctx: MarkdownPostProcessorContext, info: SectionInfo, child: MarkdownRenderChild): Promise<void> {
    const s = this.settings();
    const first = el.firstElementChild;
    if (!first) return;
    const tag = first.tagName;
    const isQuote = tag === "BLOCKQUOTE" || first.hasClass("callout");
    if (!(tag === "P" || tag === "PRE" || isQuote)) return;
    if (!isQuote && el.querySelector("ul, ol")) return;
    const src = info.text.split(/\r?\n/).slice(info.lineStart, info.lineEnd + 1).join("\n");
    const out = blockText(src, { indent: s.indent, quotes: s.quotes, lists: s.blankInLists });
    if (out === src) return;
    el.empty();
    this.rendering++;
    try {
      await MarkdownRenderer.render(this.app, out, el, ctx.sourcePath, child);
    } finally {
      this.rendering--;
    }
    // Space between list items inside a quote: the marker tells how many lines.
    for (const m of Array.from(el.querySelectorAll<HTMLElement>(`span.${GAP_CLASS}`))) {
      const n = Number(new RegExp(`${GAP_CLASS}-(\\d+)`).exec(m.className)?.[1] ?? 0);
      const parent = m.parentElement;
      const li = m.closest("li");
      const firstP = li?.querySelector(":scope > p");
      const target = parent?.tagName === "P" && li && parent !== firstP ? parent : (li ?? parent);
      if (target && n > 0) mark(target, GAP_BEFORE_CLASS, n);
      m.remove();
    }
  }

  /** Space above the block and between its list items. */
  private space(el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
    const s = this.settings();
    const info = s.blankLines ? ctx.getSectionInfo(el) : null;
    unmarkAll(el);
    if (info) {
      const above = spaceBefore(info.text, info.lineStart, info.lineEnd, s.leadingBlankLines);
      const lines = above.padding && !s.blankInLists && above.lines > 0 && !this.atStart(info) ? 0 : above.lines;
      mark(el, above.padding ? GAP_BEFORE_CLASS : BLANK_BEFORE_CLASS, lines);
    }

    const items = Array.from(el.querySelectorAll<HTMLElement>("li")).filter(
      // Lists inside quotes were handled when the quote was rendered again.
      (li) => !(s.quotes && li.closest("blockquote, .callout")),
    );
    if (items.length === 0) return;
    const gaps = info && s.blankInLists ? listItemGaps(info.text, info.lineStart, info.lineEnd) : [];
    items.forEach((li, i) => {
      let n = 0;
      if (info && s.blankInLists) {
        if (gaps.length === items.length) n = gaps[i];
        else if (li.dataset.line !== undefined) {
          const line = info.lineStart + Number(li.dataset.line);
          if (line > info.lineStart) n = listItemGaps(info.text, info.lineStart, line).pop() ?? 0;
        }
      }
      unmarkAll(li);
      mark(li, GAP_BEFORE_CLASS, n);
    });
  }

  /** Whether only empty lines (and front matter) are above the block. */
  private atStart(info: SectionInfo): boolean {
    const lines = info.text.split(/\r?\n/).slice(0, info.lineStart);
    let i = 0;
    if (lines[0]?.trim() === "---") {
      i = lines.findIndex((l, k) => k > 0 && l.trim() === "---") + 1;
      if (i === 0) return false;
    }
    return lines.slice(i).every((l) => l.trim() === "");
  }

  /** Several spaces or tabs inside lines are kept. */
  private spaces(el: HTMLElement): void {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n as Text);
    for (const node of nodes) {
      if (node.parentElement?.closest(NO_SPACES)) continue;
      const v = node.nodeValue ?? "";
      const out = keepInnerSpaces(v);
      if (out !== v) node.nodeValue = out;
    }
  }

  /** Update the space above blocks (after lines were added or removed, or a setting changed). */
  refresh(): void {
    for (const [el, ctx] of this.blocks) this.space(el, ctx);
  }

  clear(): void {
    for (const el of this.blocks.keys()) {
      unmarkAll(el);
      for (const g of Array.from(el.querySelectorAll<HTMLElement>(`.${GAP_BEFORE_CLASS}`))) unmarkAll(g);
    }
    this.blocks.clear();
  }
}
