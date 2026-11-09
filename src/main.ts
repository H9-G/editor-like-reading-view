import { MarkdownView, Plugin, debounce, getLanguage } from "obsidian";
import { MessageKey, detectLanguage, tr } from "./i18n";
import { ReadingView } from "./reading";
import { PluginSettings, sanitizeSettings } from "./settings";
import { ReadingSettingTab } from "./settingsTab";

export default class EditorLikeReadingViewPlugin extends Plugin {
  settings!: PluginSettings;
  private reading!: ReadingView;

  t(key: MessageKey): string {
    return tr(this.settings.language || "en", key);
  }

  async onload(): Promise<void> {
    this.settings = sanitizeSettings(await this.loadData());
    // First run: follow the language Obsidian is using.
    if (this.settings.language === "") {
      this.settings.language = detectLanguage(getLanguage());
      await this.saveSettings();
    }

    this.reading = new ReadingView(this.app, () => this.settings);
    this.registerMarkdownPostProcessor((el, ctx) => this.reading.process(el, ctx));
    // Lines added or removed above a block change its space even when the block itself is not rendered again.
    const refresh = debounce(() => this.reading.refresh(), 300, true);
    this.registerEvent(this.app.workspace.on("editor-change", refresh));
    this.registerEvent(this.app.workspace.on("layout-change", refresh));
    this.registerEvent(this.app.vault.on("modify", refresh));

    this.addSettingTab(new ReadingSettingTab(this.app, this));
    // Notes already open in reading view get the changes too.
    this.app.workspace.onLayoutReady(() => this.renderAgain());
  }

  onunload(): void {
    this.reading.clear();
    // After the plugin is gone, show the notes the way Obsidian does by itself.
    const leaves = this.app.workspace.getLeavesOfType("markdown");
    window.setTimeout(() => {
      for (const leaf of leaves) if (leaf.view instanceof MarkdownView) leaf.view.previewMode.rerender(true);
    }, 0);
  }

  refresh(): void {
    this.reading.refresh();
  }

  /** Render every open reading view again. */
  renderAgain(): void {
    for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
      if (leaf.view instanceof MarkdownView) leaf.view.previewMode.rerender(true);
    }
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}
