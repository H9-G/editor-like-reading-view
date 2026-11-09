import { App, PluginSettingTab, SettingDefinitionItem } from "obsidian";
import type EditorLikeReadingViewPlugin from "./main";
import { LANGUAGES, MessageKey } from "./i18n";
import { FeatureKey, SPACE_ONLY, sanitizeSettings } from "./settings";

const SUPPORT_URL = "https://buymeacoffee.com/imh9";

export class ReadingSettingTab extends PluginSettingTab {
  constructor(
    app: App,
    private plugin: EditorLikeReadingViewPlugin,
  ) {
    super(app, plugin);
  }

  getControlValue(key: string): unknown {
    return (this.plugin.settings as unknown as Record<string, unknown>)[key];
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    const next = sanitizeSettings({ ...this.plugin.settings, [key]: value });
    if ((next as unknown as Record<string, unknown>)[key] !== value) return; // invalid input: keep the old value
    this.plugin.settings = next;
    await this.plugin.saveSettings();
    if (key === "language") this.update(); // redraw in the new language
    else if (SPACE_ONLY.includes(key as FeatureKey)) this.plugin.refresh();
    else this.plugin.renderAgain();
  }

  getSettingDefinitions(): SettingDefinitionItem[] {
    const t = (k: MessageKey) => this.plugin.t(k);
    const toggle = (key: FeatureKey) => ({ name: t(key), desc: t(`${key}Desc` as MessageKey), control: { type: "toggle" as const, key } });
    return [
      {
        name: t("supportName"),
        desc: t("supportDesc"),
        render: (setting) => {
          setting.addButton((b) => b.setButtonText("☕ Buy me a coffee").setCta().onClick(() => window.open(SUPPORT_URL)));
        },
      },
      { name: t("language"), desc: t("languageDesc"), control: { type: "dropdown", key: "language", options: { ...LANGUAGES } } },
      { type: "group", heading: t("headBlank"), items: [toggle("blankLines"), toggle("blankInLists"), toggle("leadingBlankLines")] },
      { type: "group", heading: t("headSpaces"), items: [toggle("indent"), toggle("innerSpaces")] },
      { type: "group", heading: t("headQuotes"), items: [toggle("quotes")] },
    ];
  }
}
