// תוכן לימודי לכיתה א' – כל הטקסטים מנוקדים

export type Letter = {
  char: string;
  name: string; // שם האות מנוקד
  nameVariants: string[]; // איך זיהוי דיבור עשוי לכתוב את שם האות (ללא ניקוד)
  word: string; // מילה לדוגמה מנוקדת
  emoji: string;
  final?: string; // אות סופית
};

export const LETTERS: Letter[] = [
  { char: "א", name: "אָלֶף", nameVariants: ["אלף", "אלפ", "עלף"], word: "אַרְיֵה", emoji: "🦁" },
  { char: "ב", name: "בֵּית", nameVariants: ["בית", "בת", "ביית", "בייט"], word: "בַּיִת", emoji: "🏠" },
  { char: "ג", name: "גִּימֶל", nameVariants: ["גימל", "גמל", "גימעל"], word: "גְּלִידָה", emoji: "🍦" },
  { char: "ד", name: "דָּלֶת", nameVariants: ["דלת", "דלט", "דלד"], word: "דָּג", emoji: "🐟" },
  { char: "ה", name: "הֵא", nameVariants: ["הא", "הי", "הה", "היי", "הי."], word: "הַר", emoji: "⛰️" },
  { char: "ו", name: "וָו", nameVariants: ["וו", "ואו", "וב", "וואו", "ואב"], word: "וֶרֶד", emoji: "🌹" },
  { char: "ז", name: "זַיִן", nameVariants: ["זין", "זיין", "זאין"], word: "זֶבְּרָה", emoji: "🦓" },
  { char: "ח", name: "חֵית", nameVariants: ["חית", "חת", "חיט", "חט"], word: "חָתוּל", emoji: "🐱" },
  { char: "ט", name: "טֵית", nameVariants: ["טית", "טת", "טיט", "תית"], word: "טֶלֶפוֹן", emoji: "📞" },
  { char: "י", name: "יוֹד", nameVariants: ["יוד", "יוט", "יוּד", "יודה"], word: "יָד", emoji: "✋" },
  { char: "כ", name: "כַּף", nameVariants: ["כף", "קף", "כאף", "כפ"], word: "כַּדּוּר", emoji: "⚽", final: "ך" },
  { char: "ל", name: "לָמֶד", nameVariants: ["למד", "לאמד", "למת"], word: "לֶחֶם", emoji: "🍞" },
  { char: "מ", name: "מֵם", nameVariants: ["מם", "מים", "מאם"], word: "מַיִם", emoji: "💧", final: "ם" },
  { char: "נ", name: "נוּן", nameVariants: ["נון", "נונ", "נוּן"], word: "נָחָשׁ", emoji: "🐍", final: "ן" },
  { char: "ס", name: "סָמֶךְ", nameVariants: ["סמך", "סמח", "סמכ", "סאמך"], word: "סוּס", emoji: "🐴" },
  { char: "ע", name: "עַיִן", nameVariants: ["עין", "עיין", "איין", "אין"], word: "עֵץ", emoji: "🌳" },
  { char: "פ", name: "פֵּא", nameVariants: ["פא", "פה", "פי", "פיי"], word: "פִּיל", emoji: "🐘", final: "ף" },
  { char: "צ", name: "צָדִי", nameVariants: ["צדי", "צדיק", "צאדי", "צדיי"], word: "צָב", emoji: "🐢", final: "ץ" },
  { char: "ק", name: "קוֹף", nameVariants: ["קוף", "קופ", "כוף"], word: "קוֹף", emoji: "🐒" },
  { char: "ר", name: "רֵישׁ", nameVariants: ["ריש", "רש", "רייש"], word: "רַכֶּבֶת", emoji: "🚂" },
  { char: "ש", name: "שִׁין", nameVariants: ["שין", "שן", "סין", "שיין"], word: "שֶׁמֶשׁ", emoji: "☀️" },
  { char: "ת", name: "תָּו", nameVariants: ["תו", "טו", "תאו", "תב", "טאו"], word: "תַּפּוּחַ", emoji: "🍎" },
];

export type Vowel = {
  id: string;
  name: string;
  sound: string; // הצליל (לתצוגה)
  color: string;
  build: (consonant: string) => string;
};

// בּ כּ פּ בתחילת הברה מקבלות דגש; שׁ מקבלת נקודה ימנית
export function baseForm(c: string): string {
  if (c === "ב" || c === "כ" || c === "פ") return c + "ּ";
  if (c === "ש") return c + "ׁ";
  return c;
}

export const VOWELS: Vowel[] = [
  { id: "kamatz", name: "קָמָץ", sound: "אָ", color: "var(--c-coral)", build: (c) => baseForm(c) + "ָ" },
  { id: "patach", name: "פַּתָּח", sound: "אַ", color: "var(--c-coral)", build: (c) => baseForm(c) + "ַ" },
  { id: "tzere", name: "צֵירֵי", sound: "אֵ", color: "var(--c-teal)", build: (c) => baseForm(c) + "ֵ" },
  { id: "segol", name: "סֶגּוֹל", sound: "אֶ", color: "var(--c-teal)", build: (c) => baseForm(c) + "ֶ" },
  { id: "chirik", name: "חִירִיק", sound: "אִ", color: "var(--c-purple)", build: (c) => baseForm(c) + "ִ" },
  { id: "cholam", name: "חוֹלָם", sound: "אוֹ", color: "var(--c-yellow-dark)", build: (c) => baseForm(c) + "וֹ" },
  { id: "shuruk", name: "שׁוּרוּק", sound: "אוּ", color: "var(--c-green)", build: (c) => baseForm(c) + "וּ" },
  { id: "kubutz", name: "קֻבּוּץ", sound: "אֻ", color: "var(--c-green)", build: (c) => baseForm(c) + "ֻ" },
  { id: "shva", name: "שְׁוָא", sound: "אְ", color: "var(--c-gray)", build: (c) => baseForm(c) + "ְ" },
];

export const PRACTICE_CONSONANTS = ["מ", "ל", "ס", "ב", "ד", "נ", "ר", "ש", "ת", "פ", "כ", "ג"];

export type Word = {
  word: string;
  syllables: string[];
  emoji: string;
};

export const WORDS: Word[] = [
  { word: "אַבָּא", syllables: ["אַ", "בָּא"], emoji: "👨" },
  { word: "אִמָּא", syllables: ["אִ", "מָּא"], emoji: "👩" },
  { word: "דָּג", syllables: ["דָּג"], emoji: "🐟" },
  { word: "גַּן", syllables: ["גַּן"], emoji: "🌻" },
  { word: "תּוּת", syllables: ["תּוּת"], emoji: "🍓" },
  { word: "סוּס", syllables: ["סוּס"], emoji: "🐴" },
  { word: "יֶלֶד", syllables: ["יֶ", "לֶד"], emoji: "👦" },
  { word: "כֶּלֶב", syllables: ["כֶּ", "לֶב"], emoji: "🐶" },
  { word: "סֵפֶר", syllables: ["סֵ", "פֶר"], emoji: "📕" },
  { word: "חָתוּל", syllables: ["חָ", "תוּל"], emoji: "🐱" },
  { word: "בַּיִת", syllables: ["בַּ", "יִת"], emoji: "🏠" },
  { word: "לֶחֶם", syllables: ["לֶ", "חֶם"], emoji: "🍞" },
  { word: "שֶׁמֶשׁ", syllables: ["שֶׁ", "מֶשׁ"], emoji: "☀️" },
  { word: "פֶּרַח", syllables: ["פֶּ", "רַח"], emoji: "🌸" },
  { word: "עוּגָה", syllables: ["עוּ", "גָה"], emoji: "🎂" },
  { word: "כּוֹבַע", syllables: ["כּוֹ", "בַע"], emoji: "🎩" },
  { word: "שָׁלוֹם", syllables: ["שָׁ", "לוֹם"], emoji: "👋" },
  { word: "בָּנָנָה", syllables: ["בָּ", "נָ", "נָה"], emoji: "🍌" },
  { word: "מְכוֹנִית", syllables: ["מְ", "כוֹ", "נִית"], emoji: "🚗" },
  { word: "תַּפּוּחַ", syllables: ["תַּ", "פּוּ", "חַ"], emoji: "🍎" },
];

export type Story = {
  id: string;
  title: string;
  emoji: string;
  sentences: string[];
  nikudLevel?: number; // סיפור שבנוי רק מהניקוד של שלב זה במסלול הניקוד
};

/** מילה בלי סימני פיסוק – כך היא מוקראת */
export const cleanWord = (w: string) => w.replace(/[.,!?:]/g, "");

export const STORIES: Story[] = [
  // ----- סיפורים בקמץ ופתח בלבד (שלב 1 במסלול הניקוד) -----
  {
    id: "kp-aba",
    title: "אַבָּא בָּא",
    emoji: "👨",
    nikudLevel: 1,
    sentences: ["אַבָּא בָּא.", "אַבָּא בָּא לַגַּן.", "גַּל רָץ.", "גַּל אָמַר: אַבָּא, אַבָּא!", "אַבָּא צָחַק."],
  },
  {
    id: "kp-fish",
    title: "דָּג בַּיָּם",
    emoji: "🐟",
    nikudLevel: 1,
    sentences: ["נָדָב בָּא לַיָּם.", "בַּיָּם שָׁט דָּג.", "נָדָב רָאָה דָּג.", "הַדָּג שָׁט, שָׁט, שָׁט.", "נָדָב צָחַק."],
  },
  {
    id: "kp-basket",
    title: "מָה בַּסַּל?",
    emoji: "🧺",
    nikudLevel: 1,
    sentences: ["סַבָּא בָּא.", "סַבָּא לָקַח סַל.", "מָה בַּסַּל?", "בַּסַּל בָּנָנָה.", "בַּסַּל גַּם אַגָּס.", "דָּנָה שָׁרָה: בָּנָנָה, בָּנָנָה!"],
  },
  {
    id: "kp-camel",
    title: "הַגָּמָל",
    emoji: "🐫",
    nikudLevel: 1,
    sentences: ["גָּמָל עָמַד עַל הָהָר.", "הַגָּמָל רָאָה נָחָשׁ.", "הַגָּמָל פָּחַד.", "הַגָּמָל בָּרַח.", "הַנָּחָשׁ צָחַק."],
  },
  {
    id: "kp-turtle",
    title: "הַצָּב",
    emoji: "🐢",
    nikudLevel: 1,
    sentences: ["צָב נָח בַּגַּן.", "תָּמָר בָּאָה לַגַּן.", "תָּמָר שָׁרָה.", "הַצָּב קָם.", "הַצָּב בָּרַח."],
  },
  {
    id: "kp-shabbat",
    title: "שַׁבָּת",
    emoji: "🕯️",
    nikudLevel: 1,
    sentences: ["שַׁבָּת בָּאָה.", "אַבָּא שָׁר.", "דָּנָה שָׁרָה.", "סַבָּא נָתַן חַלָּה.", "גַּל אָכַל חַלָּה.", "גַּל אָמַר: חַלָּה, חַלָּה!"],
  },
  // ----- סיפורים עם כל סימני הניקוד -----
  {
    id: "dani",
    title: "דָּנִי וְהַכֶּלֶב",
    emoji: "🐶",
    sentences: [
      "דָּנִי הָלַךְ לַגַּן.",
      "בַּגַּן הָיָה כֶּלֶב.",
      "הַכֶּלֶב אָמַר: הַב הַב!",
      "דָּנִי צָחַק.",
    ],
  },
  {
    id: "basket",
    title: "מָה יֵשׁ בַּסַּל?",
    emoji: "🧺",
    sentences: [
      "לְאִמָּא יֵשׁ סַל.",
      "בַּסַּל יֵשׁ תַּפּוּחַ.",
      "בַּסַּל יֵשׁ גַּם בָּנָנָה.",
      "מִי רוֹצֶה לֶאֱכֹל?",
    ],
  },
  {
    id: "morning",
    title: "בֹּקֶר טוֹב",
    emoji: "🌞",
    sentences: [
      "בַּבֹּקֶר עוֹלָה הַשֶּׁמֶשׁ.",
      "הַצִּפּוֹר שָׁרָה.",
      "נוֹעָה קָמָה מֵהַמִּטָּה.",
      "יוֹם טוֹב!",
    ],
  },
];

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRandom<T>(arr: T[], n: number, exclude?: T): T[] {
  return shuffle(arr.filter((x) => x !== exclude)).slice(0, n);
}
