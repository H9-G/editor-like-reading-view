import { LangCode, isLangCode } from "./i18n";

export interface ReadingSettings {
  /** Extra empty lines between blocks become space. */
  blankLines: boolean;
  /** Empty lines between list items become space. */
  blankInLists: boolean;
  /** Empty lines at the start of the note (or after the front matter) become space. */
  leadingBlankLines: boolean;
  /** Spaces and tabs at the start of lines are kept (outside lists). */
  indent: boolean;
  /** Several spaces and tabs inside a line are kept. */
  innerSpaces: boolean;
  /** Empty lines and indentation inside quotes and callouts are kept. */
  quotes: boolean;
}

export interface PluginSettings extends ReadingSettings {
  /** Empty until first run, when it is taken from Obsidian's language. */
  language: LangCode | "";
}

export const DEFAULT_SETTINGS: PluginSettings = {
  language: "",
  blankLines: true,
  blankInLists: true,
  leadingBlankLines: true,
  indent: true,
  innerSpaces: true,
  quotes: true,
};

export const FEATURE_KEYS = ["blankLines", "blankInLists", "leadingBlankLines", "indent", "innerSpaces", "quotes"] as const;
export type FeatureKey = (typeof FEATURE_KEYS)[number];

/** Settings that change only the space above blocks; the others need the notes to be rendered again. */
export const SPACE_ONLY: readonly FeatureKey[] = ["blankLines", "blankInLists", "leadingBlankLines"];

export function sanitizeSettings(raw: unknown): PluginSettings {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: PluginSettings = { ...DEFAULT_SETTINGS, language: isLangCode(r.language) ? r.language : "" };
  for (const k of FEATURE_KEYS) if (typeof r[k] === "boolean") out[k] = r[k];
  return out;
}
