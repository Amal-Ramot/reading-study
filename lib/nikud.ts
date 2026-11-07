// מסלול ניקוד מדורג: כל שלב מלמד צליל אחד, והמילים בכל שלב משתמשות רק בתנועות שכבר נלמדו
import { VOWELS, baseForm } from "./data";

export type NikudWord = { word: string; emoji: string };

export type NikudLevel = {
  id: number;
  sound: string; // הצליל, מנוקד
  title: string;
  vowelIds: string[]; // סימני הניקוד שנלמדים בשלב
  marks: { name: string; mark: string }[]; // לתצוגה על עיגול מנוקד
  tip: string; // הסבר לילד
  anchor: NikudWord; // מילת עוגן לזכירת הצליל
  color: string;
  soft: string;
  words: NikudWord[];
};

const DC = "◌"; // עיגול מנוקד – "מקום לאות"

export const NIKUD_LEVELS: NikudLevel[] = [
  {
    id: 1,
    sound: "אַ",
    title: "קָמָץ וּפַתָּח",
    vowelIds: ["kamatz", "patach"],
    marks: [
      { name: "קָמָץ", mark: DC + "ָ" },
      { name: "פַּתָּח", mark: DC + "ַ" },
    ],
    tip: "קַו עִם רֶגֶל קְטַנָּה אוֹ קַו יָשָׁר מִתַּחַת לָאוֹת. פּוֹתְחִים אֶת הַפֶּה גָּדוֹל וְאוֹמְרִים: אַ",
    anchor: { word: "אַבָּא", emoji: "👨" },
    color: "var(--c-coral)",
    soft: "var(--c-coral-soft)",
    words: [
      { word: "דָּג", emoji: "🐟" },
      { word: "יָד", emoji: "✋" },
      { word: "סַל", emoji: "🧺" },
      { word: "צָב", emoji: "🐢" },
      { word: "פַּח", emoji: "🗑️" },
      { word: "גָּמָל", emoji: "🐫" },
      { word: "חָלָב", emoji: "🥛" },
      { word: "נָחָשׁ", emoji: "🐍" },
      { word: "בָּנָנָה", emoji: "🍌" },
      { word: "אַבָּא", emoji: "👨" },
    ],
  },
  {
    id: 2,
    sound: "אִ",
    title: "חִירִיק",
    vowelIds: ["chirik"],
    marks: [{ name: "חִירִיק", mark: DC + "ִ" }],
    tip: "נְקֻדָּה אַחַת קְטַנָּה מִתַּחַת לָאוֹת. מְחַיְּכִים וְאוֹמְרִים: אִ",
    anchor: { word: "אִמָּא", emoji: "👩" },
    color: "var(--c-purple)",
    soft: "var(--c-purple-soft)",
    words: [
      { word: "אִמָּא", emoji: "👩" },
      { word: "פִּיל", emoji: "🐘" },
      { word: "תִּיק", emoji: "🎒" },
      { word: "סִיר", emoji: "🍲" },
      { word: "דָּגִים", emoji: "🐠" },
      { word: "גִּיטָרָה", emoji: "🎸" },
    ],
  },
  {
    id: 3,
    sound: "אוֹ",
    title: "חוֹלָם",
    vowelIds: ["cholam"],
    marks: [
      { name: "חוֹלָם מָלֵא", mark: "וֹ" },
      { name: "חוֹלָם חָסֵר", mark: DC + "ֹ" },
    ],
    tip: "נְקֻדָּה לְמַעְלָה – עַל הָאוֹת ו אוֹ לְיַד הָאוֹת. עוֹשִׂים פֶּה עָגֹל וְאוֹמְרִים: אוֹ",
    anchor: { word: "אוֹטוֹ", emoji: "🚗" },
    color: "var(--c-yellow-dark)",
    soft: "var(--c-yellow-soft)",
    words: [
      { word: "אוֹטוֹ", emoji: "🚗" },
      { word: "קוֹף", emoji: "🐒" },
      { word: "תּוֹף", emoji: "🥁" },
      { word: "דֹּב", emoji: "🐻" },
      { word: "עוֹף", emoji: "🐔" },
      { word: "כּוֹבַע", emoji: "🎩" },
      { word: "בַּלּוֹן", emoji: "🎈" },
      { word: "שָׁעוֹן", emoji: "⌚" },
      { word: "חַלּוֹן", emoji: "🪟" },
    ],
  },
  {
    id: 4,
    sound: "אוּ",
    title: "שׁוּרוּק וְקֻבּוּץ",
    vowelIds: ["shuruk", "kubutz"],
    marks: [
      { name: "שׁוּרוּק", mark: "וּ" },
      { name: "קֻבּוּץ", mark: DC + "ֻ" },
    ],
    tip: "נְקֻדָּה בַּבֶּטֶן שֶׁל הָאוֹת ו, אוֹ שָׁלוֹשׁ נְקֻדּוֹת בַּאֲלַכְסוֹן. מְכַוְּצִים שְׂפָתַיִם וְאוֹמְרִים: אוּ",
    anchor: { word: "עוּגָה", emoji: "🎂" },
    color: "var(--c-green)",
    soft: "var(--c-green-soft)",
    words: [
      { word: "עוּגָה", emoji: "🎂" },
      { word: "סוּס", emoji: "🐴" },
      { word: "תּוּת", emoji: "🍓" },
      { word: "דֻּבִּי", emoji: "🧸" },
      { word: "כַּדּוּר", emoji: "⚽" },
      { word: "חָתוּל", emoji: "🐱" },
      { word: "תַּפּוּחַ", emoji: "🍎" },
      { word: "אוֹטוֹבּוּס", emoji: "🚌" },
    ],
  },
  {
    id: 5,
    sound: "אֶ",
    title: "צֵירֵי וְסֶגּוֹל",
    vowelIds: ["tzere", "segol"],
    marks: [
      { name: "צֵירֵי", mark: DC + "ֵ" },
      { name: "סֶגּוֹל", mark: DC + "ֶ" },
    ],
    tip: "שְׁתֵּי נְקֻדּוֹת זוֹ לְיַד זוֹ, אוֹ שָׁלוֹשׁ נְקֻדּוֹת כְּמוֹ מְשֻׁלָּשׁ. אוֹמְרִים: אֶ",
    anchor: { word: "עֵץ", emoji: "🌳" },
    color: "var(--c-teal)",
    soft: "var(--c-teal-soft)",
    words: [
      { word: "עֵץ", emoji: "🌳" },
      { word: "יֶלֶד", emoji: "👦" },
      { word: "כֶּלֶב", emoji: "🐶" },
      { word: "לֶחֶם", emoji: "🍞" },
      { word: "סֵפֶר", emoji: "📕" },
      { word: "בֵּיצָה", emoji: "🥚" },
      { word: "שֶׁמֶשׁ", emoji: "☀️" },
      { word: "פֶּרַח", emoji: "🌸" },
      { word: "גֶּשֶׁם", emoji: "🌧️" },
      { word: "דֶּלֶת", emoji: "🚪" },
    ],
  },
  {
    id: 6,
    sound: "שְׁוָא",
    title: "שְׁוָא",
    vowelIds: ["shva"],
    marks: [{ name: "שְׁוָא", mark: DC + "ְ" }],
    tip: "שְׁתֵּי נְקֻדּוֹת אַחַת מֵעַל הַשְּׁנִיָּה. בִּתְחִלַּת מִלָּה – אוֹמְרִים קָצָר וּמַהֵר. בְּסוֹף הֲבָרָה – שׁוֹתְקִים.",
    anchor: { word: "גְּלִידָה", emoji: "🍦" },
    color: "var(--c-gray)",
    soft: "#eceef3",
    words: [
      { word: "גְּלִידָה", emoji: "🍦" },
      { word: "סְפִינָה", emoji: "🚢" },
      { word: "מְכוֹנִית", emoji: "🚗" },
      { word: "דְּבוֹרָה", emoji: "🐝" },
      { word: "צְפַרְדֵּעַ", emoji: "🐸" },
      { word: "פְּרָחִים", emoji: "💐" },
    ],
  },
];

export const NIKUD_CONSONANTS = ["מ", "ל", "ס", "ב", "ד", "נ", "ר", "ש", "ת", "פ", "ג", "כ"];

/** ההברה כפי שהיא מוצגת לילד */
export function syllable(c: string, vowelId: string): string {
  return VOWELS.find((v) => v.id === vowelId)!.build(c);
}

/**
 * צורה שמנוע ההקראה מבטא בצורה אמינה יותר (עם אם קריאה),
 * למשל "מָ" נשמעת כמו "מָה", "מִ" כמו "מִי".
 */
export function speakableSyllable(c: string, vowelId: string): string {
  const b = baseForm(c);
  switch (vowelId) {
    case "kamatz": return b + "ָ" + "ה";
    case "patach": return b + "ַ" + "ה";
    case "chirik": return b + "ִ" + "י";
    case "kubutz": return b + "וּ";
    case "tzere": return b + "ֵ" + "ה";
    case "segol": return b + "ֶ" + "ה";
    default: return syllable(c, vowelId);
  }
}

/** מילים לתרגול בשלב: מילות השלב, ואם צריך עוד – מילים משלבים קודמים */
export function levelWords(levelId: number): NikudWord[] {
  return NIKUD_LEVELS.find((l) => l.id === levelId)!.words;
}

export function reviewWords(levelId: number): NikudWord[] {
  return NIKUD_LEVELS.filter((l) => l.id <= levelId).flatMap((l) => l.words);
}

/** כל הטקסטים שמוקראים בתרגול הניקוד – עבורם מייצרים קבצי קול מראש (scripts/generate-audio.ts) */
export function nikudSpeechTexts(): string[] {
  const out = new Set<string>();
  for (const l of NIKUD_LEVELS) {
    out.add(l.tip);
    out.add(l.anchor.word);
    l.words.forEach((w) => out.add(w.word));
  }
  for (const c of NIKUD_CONSONANTS) for (const v of VOWELS) out.add(speakableSyllable(c, v.id));
  return [...out];
}
