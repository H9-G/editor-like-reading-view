export const LANGUAGES = {
  en: "English",
  ja: "日本語",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  ko: "한국어",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
} as const;

export type LangCode = keyof typeof LANGUAGES;

export const isLangCode = (v: unknown): v is LangCode =>
  typeof v === "string" && Object.prototype.hasOwnProperty.call(LANGUAGES, v);

const en = {
  supportName: "Support development",
  supportDesc: "If this plugin is useful to you, you can buy me a coffee.",
  language: "Language",
  languageDesc: "Language of this plugin's settings.",
  headBlank: "Empty lines",
  blankLines: "Empty lines between blocks",
  blankLinesDesc: "Every empty line after the first one between paragraphs, headings and other blocks is shown as space, as in the editor.",
  blankInLists: "Empty lines between list items",
  blankInListsDesc: "Every empty line between list items and checklist items is shown as space.",
  leadingBlankLines: "Empty lines at the start of the note",
  leadingBlankLinesDesc: "Empty lines before the first text of the note (or after the properties) are shown as space.",
  headSpaces: "Indentation and spaces",
  indent: "Indentation",
  indentDesc: "Lines indented with spaces or tabs are shown indented, instead of as code. Lists are not changed.",
  innerSpaces: "Spaces and tabs inside lines",
  innerSpacesDesc: "Several spaces or tabs in a row inside a line are kept, instead of being shown as one space. Code is not changed.",
  headQuotes: "Quotes and callouts",
  quotes: "Empty lines and indentation in quotes and callouts",
  quotesDesc: "Inside quotes and callouts, empty lines and indented lines are shown as in the editor.",
};

export type MessageKey = keyof typeof en;
type Dict = Record<MessageKey, string>;

const ja: Dict = {
  supportName: "開発を応援する",
  supportDesc: "このプラグインが役に立ったら、コーヒーをおごってもらえるとうれしいです。",
  language: "言語",
  languageDesc: "このプラグインの設定画面の言語です。",
  headBlank: "空白行",
  blankLines: "ブロックの間の空白行",
  blankLinesDesc: "段落や見出しなどの間に続けて入れた空白行を、エディタと同じように空白で表示します（1行目は通常の間隔です）。",
  blankInLists: "リストの項目の間の空白行",
  blankInListsDesc: "リストやチェックリストの項目の間の空白行を、空白で表示します。",
  leadingBlankLines: "ノートの先頭の空白行",
  leadingBlankLinesDesc: "本文の最初（またはプロパティの後）に入れた空白行を、空白で表示します。",
  headSpaces: "インデントとスペース",
  indent: "インデント",
  indentDesc: "スペースやタブで字下げした行を、コードにせずに字下げして表示します。リストは変えません。",
  innerSpaces: "行の途中の連続スペース・タブ",
  innerSpacesDesc: "行の途中に続けて入れたスペースやタブを、1つにまとめずにそのまま表示します。コードは変えません。",
  headQuotes: "引用とコールアウト",
  quotes: "引用・コールアウト内の空白行とインデント",
  quotesDesc: "引用とコールアウトの中の空白行と字下げも、エディタと同じように表示します。",
};

const zhCN: Dict = {
  supportName: "支持开发",
  supportDesc: "如果这个插件对你有帮助，欢迎请我喝杯咖啡。",
  language: "语言",
  languageDesc: "此插件设置所用的语言。",
  headBlank: "空行",
  blankLines: "块之间的空行",
  blankLinesDesc: "段落、标题等块之间的连续空行，像编辑器中一样显示为空白（第一个空行为正常间距）。",
  blankInLists: "列表项之间的空行",
  blankInListsDesc: "列表项和清单项之间的空行显示为空白。",
  leadingBlankLines: "笔记开头的空行",
  leadingBlankLinesDesc: "笔记正文开头（或属性之后）的空行显示为空白。",
  headSpaces: "缩进与空格",
  indent: "缩进",
  indentDesc: "用空格或制表符缩进的行显示为缩进，而不是代码。列表不受影响。",
  innerSpaces: "行内的连续空格和制表符",
  innerSpacesDesc: "行内连续的空格或制表符按原样显示，不合并为一个空格。代码不受影响。",
  headQuotes: "引用与标注",
  quotes: "引用和标注中的空行与缩进",
  quotesDesc: "引用和标注中的空行与缩进也像编辑器中一样显示。",
};

const zhTW: Dict = {
  supportName: "支持開發",
  supportDesc: "如果這個外掛對你有幫助，歡迎請我喝杯咖啡。",
  language: "語言",
  languageDesc: "此外掛設定所用的語言。",
  headBlank: "空行",
  blankLines: "區塊之間的空行",
  blankLinesDesc: "段落、標題等區塊之間的連續空行，像編輯器中一樣顯示為空白（第一個空行為正常間距）。",
  blankInLists: "清單項目之間的空行",
  blankInListsDesc: "清單項目和核取清單項目之間的空行顯示為空白。",
  leadingBlankLines: "筆記開頭的空行",
  leadingBlankLinesDesc: "筆記正文開頭（或屬性之後）的空行顯示為空白。",
  headSpaces: "縮排與空格",
  indent: "縮排",
  indentDesc: "以空格或定位字元縮排的行顯示為縮排，而不是程式碼。清單不受影響。",
  innerSpaces: "行內的連續空格和定位字元",
  innerSpacesDesc: "行內連續的空格或定位字元按原樣顯示，不合併為一個空格。程式碼不受影響。",
  headQuotes: "引用與標註",
  quotes: "引用和標註中的空行與縮排",
  quotesDesc: "引用和標註中的空行與縮排也像編輯器中一樣顯示。",
};

const ko: Dict = {
  supportName: "개발 응원하기",
  supportDesc: "이 플러그인이 도움이 되었다면 커피 한 잔 사 주세요.",
  language: "언어",
  languageDesc: "이 플러그인 설정에 쓰이는 언어입니다.",
  headBlank: "빈 줄",
  blankLines: "블록 사이의 빈 줄",
  blankLinesDesc: "문단이나 제목 같은 블록 사이에 연속으로 넣은 빈 줄을 편집기처럼 여백으로 표시합니다(첫 번째 빈 줄은 보통 간격입니다).",
  blankInLists: "목록 항목 사이의 빈 줄",
  blankInListsDesc: "목록과 체크리스트 항목 사이의 빈 줄을 여백으로 표시합니다.",
  leadingBlankLines: "노트 시작 부분의 빈 줄",
  leadingBlankLinesDesc: "본문 맨 앞(또는 속성 뒤)에 넣은 빈 줄을 여백으로 표시합니다.",
  headSpaces: "들여쓰기와 공백",
  indent: "들여쓰기",
  indentDesc: "스페이스나 탭으로 들여 쓴 줄을 코드가 아니라 들여 쓴 글로 표시합니다. 목록은 바꾸지 않습니다.",
  innerSpaces: "줄 중간의 연속 공백과 탭",
  innerSpacesDesc: "줄 중간에 연속으로 넣은 스페이스나 탭을 하나로 합치지 않고 그대로 표시합니다. 코드는 바꾸지 않습니다.",
  headQuotes: "인용과 콜아웃",
  quotes: "인용·콜아웃 안의 빈 줄과 들여쓰기",
  quotesDesc: "인용과 콜아웃 안의 빈 줄과 들여쓰기도 편집기처럼 표시합니다.",
};

const es: Dict = {
  supportName: "Apoya el desarrollo",
  supportDesc: "Si este plugin te resulta útil, puedes invitarme a un café.",
  language: "Idioma",
  languageDesc: "Idioma de los ajustes de este plugin.",
  headBlank: "Líneas vacías",
  blankLines: "Líneas vacías entre bloques",
  blankLinesDesc: "Cada línea vacía después de la primera entre párrafos, títulos y otros bloques se muestra como espacio, como en el editor.",
  blankInLists: "Líneas vacías entre elementos de lista",
  blankInListsDesc: "Cada línea vacía entre elementos de lista y de listas de tareas se muestra como espacio.",
  leadingBlankLines: "Líneas vacías al principio de la nota",
  leadingBlankLinesDesc: "Las líneas vacías antes del primer texto de la nota (o después de las propiedades) se muestran como espacio.",
  headSpaces: "Sangría y espacios",
  indent: "Sangría",
  indentDesc: "Las líneas sangradas con espacios o tabulaciones se muestran sangradas, no como código. Las listas no cambian.",
  innerSpaces: "Espacios y tabulaciones dentro de las líneas",
  innerSpacesDesc: "Varios espacios o tabulaciones seguidos dentro de una línea se conservan, en lugar de mostrarse como un solo espacio. El código no cambia.",
  headQuotes: "Citas y llamadas",
  quotes: "Líneas vacías y sangría en citas y llamadas",
  quotesDesc: "Dentro de citas y llamadas, las líneas vacías y las líneas sangradas se muestran como en el editor.",
};

const fr: Dict = {
  supportName: "Soutenir le développement",
  supportDesc: "Si ce plugin vous est utile, vous pouvez m'offrir un café.",
  language: "Langue",
  languageDesc: "Langue des réglages de ce plugin.",
  headBlank: "Lignes vides",
  blankLines: "Lignes vides entre les blocs",
  blankLinesDesc: "Chaque ligne vide après la première entre les paragraphes, titres et autres blocs est affichée comme un espace, comme dans l'éditeur.",
  blankInLists: "Lignes vides entre les éléments de liste",
  blankInListsDesc: "Chaque ligne vide entre les éléments de liste et de liste de tâches est affichée comme un espace.",
  leadingBlankLines: "Lignes vides au début de la note",
  leadingBlankLinesDesc: "Les lignes vides avant le premier texte de la note (ou après les propriétés) sont affichées comme un espace.",
  headSpaces: "Indentation et espaces",
  indent: "Indentation",
  indentDesc: "Les lignes indentées avec des espaces ou des tabulations sont affichées indentées, et non comme du code. Les listes ne changent pas.",
  innerSpaces: "Espaces et tabulations dans les lignes",
  innerSpacesDesc: "Plusieurs espaces ou tabulations à la suite dans une ligne sont conservés, au lieu d'être affichés comme un seul espace. Le code ne change pas.",
  headQuotes: "Citations et encadrés",
  quotes: "Lignes vides et indentation dans les citations et encadrés",
  quotesDesc: "Dans les citations et les encadrés, les lignes vides et les lignes indentées sont affichées comme dans l'éditeur.",
};

const de: Dict = {
  supportName: "Entwicklung unterstützen",
  supportDesc: "Wenn dir dieses Plugin hilft, kannst du mir einen Kaffee spendieren.",
  language: "Sprache",
  languageDesc: "Sprache der Einstellungen dieses Plugins.",
  headBlank: "Leerzeilen",
  blankLines: "Leerzeilen zwischen Blöcken",
  blankLinesDesc: "Jede Leerzeile nach der ersten zwischen Absätzen, Überschriften und anderen Blöcken wird als Abstand gezeigt, wie im Editor.",
  blankInLists: "Leerzeilen zwischen Listeneinträgen",
  blankInListsDesc: "Jede Leerzeile zwischen Listen- und Aufgabeneinträgen wird als Abstand gezeigt.",
  leadingBlankLines: "Leerzeilen am Anfang der Notiz",
  leadingBlankLinesDesc: "Leerzeilen vor dem ersten Text der Notiz (oder nach den Eigenschaften) werden als Abstand gezeigt.",
  headSpaces: "Einrückung und Leerzeichen",
  indent: "Einrückung",
  indentDesc: "Mit Leerzeichen oder Tabs eingerückte Zeilen werden eingerückt gezeigt, nicht als Code. Listen werden nicht verändert.",
  innerSpaces: "Leerzeichen und Tabs innerhalb von Zeilen",
  innerSpacesDesc: "Mehrere Leerzeichen oder Tabs hintereinander in einer Zeile bleiben erhalten, statt als ein Leerzeichen gezeigt zu werden. Code wird nicht verändert.",
  headQuotes: "Zitate und Callouts",
  quotes: "Leerzeilen und Einrückung in Zitaten und Callouts",
  quotesDesc: "In Zitaten und Callouts werden Leerzeilen und eingerückte Zeilen wie im Editor gezeigt.",
};

const DICTS: Record<LangCode, Dict> = { en, ja, "zh-CN": zhCN, "zh-TW": zhTW, ko, es, fr, de };

export const allDicts = (): Record<LangCode, Dict> => DICTS;

export function tr(lang: LangCode, key: MessageKey): string {
  return (DICTS[lang] ?? en)[key] ?? en[key];
}

/** Map a locale string (e.g. "ja", "zh-TW", "en-US") to a supported language; anything else is English. */
export function detectLanguage(locale: string | null | undefined): LangCode {
  if (!locale) return "en";
  const l = locale.toLowerCase().replace(/_/g, "-");
  if (l.startsWith("zh")) return /^zh-(tw|hk|mo|hant)/.test(l) ? "zh-TW" : "zh-CN";
  const base = l.split("-")[0];
  return isLangCode(base) ? base : "en";
}
