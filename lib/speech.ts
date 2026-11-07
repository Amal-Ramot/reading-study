"use client";

import audioManifest from "./audioManifest.json";

// קבצי קול מוקלטים מראש (קול Google Translate) – מנוגנים במקום הקול של הדפדפן כשקיימים
const AUDIO = audioManifest as Record<string, string>;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
let currentAudio: HTMLAudioElement | null = null;

export function hasRecording(text: string): boolean {
  return text.normalize("NFC") in AUDIO;
}

function playRecording(text: string): Promise<boolean> {
  const file = AUDIO[text.normalize("NFC")];
  if (!file || typeof Audio === "undefined") return Promise.resolve(false);
  return new Promise((resolve) => {
    currentAudio?.pause();
    const a = new Audio(`${BASE}/audio/${file}`);
    currentAudio = a;
    a.onended = () => resolve(true);
    a.onerror = () => resolve(false);
    a.play().catch(() => resolve(false));
  });
}

// ---------- הקראה (Text-to-Speech) ----------

let cachedVoice: SpeechSynthesisVoice | null | undefined;

function hebrewVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  cachedVoice = voices.find((v) => v.lang?.toLowerCase().startsWith("he")) ?? null;
  return cachedVoice;
}

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function hasHebrewVoice(): boolean {
  return hebrewVoice() !== null;
}

export function stopSpeaking() {
  currentAudio?.pause();
  if (canSpeak()) window.speechSynthesis.cancel();
}

export async function speak(text: string, rate = 0.8): Promise<void> {
  if (await playRecording(text)) return;
  return speakSynth(text, rate);
}

function speakSynth(text: string, rate: number): Promise<void> {
  return new Promise((resolve) => {
    if (!canSpeak()) return resolve();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "he-IL";
    u.rate = rate;
    const v = hebrewVoice();
    if (v) u.voice = v;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = undefined;
  };
}

// ---------- זיהוי דיבור (Speech-to-Text) ----------

type RecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function canRecognize(): boolean {
  return getRecognitionCtor() !== null;
}

export type ListenResult =
  | { ok: true; alternatives: string[] }
  | { ok: false; error: "unsupported" | "no-speech" | "not-allowed" | "other" };

/** מקשיב לילד/ה פעם אחת ומחזיר את כל האפשרויות שהמנוע זיהה */
export function listenOnce(timeoutMs = 7000): { promise: Promise<ListenResult>; cancel: () => void } {
  const Ctor = getRecognitionCtor();
  if (!Ctor) {
    return { promise: Promise.resolve({ ok: false, error: "unsupported" }), cancel: () => {} };
  }
  const rec = new Ctor();
  rec.lang = "he-IL";
  rec.interimResults = false;
  rec.maxAlternatives = 5;
  rec.continuous = false;

  let settled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const promise = new Promise<ListenResult>((resolve) => {
    const finish = (r: ListenResult) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      resolve(r);
    };
    rec.onresult = (e) => {
      const alts: string[] = [];
      for (let i = 0; i < e.results.length; i++) {
        const res = e.results[i];
        for (let j = 0; j < res.length; j++) alts.push(res[j].transcript);
      }
      finish({ ok: true, alternatives: alts });
    };
    rec.onerror = (e) => {
      if (e.error === "no-speech") finish({ ok: false, error: "no-speech" });
      else if (e.error === "not-allowed" || e.error === "service-not-allowed")
        finish({ ok: false, error: "not-allowed" });
      else finish({ ok: false, error: "other" });
    };
    rec.onend = () => finish({ ok: false, error: "no-speech" });
    timer = setTimeout(() => {
      try {
        rec.stop();
      } catch {}
    }, timeoutMs);
    try {
      rec.start();
    } catch {
      finish({ ok: false, error: "other" });
    }
  });

  return {
    promise,
    cancel: () => {
      try {
        rec.abort();
      } catch {}
    },
  };
}

// ---------- השוואת מה שנאמר למה שצריך ----------

const FINALS: Record<string, string> = { ך: "כ", ם: "מ", ן: "נ", ף: "פ", ץ: "צ" };

/** מסיר ניקוד, פיסוק ומאחד אותיות סופיות */
export function normalizeHebrew(s: string): string {
  return s
    .replace(/[֑-ׇ]/g, "")
    .replace(/[ךםןףץ]/g, (c) => FINALS[c])
    .replace(/[^א-ת\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
  return dp[a.length][b.length];
}

function tokenMatches(token: string, target: string): boolean {
  if (token === target) return true;
  // סובלנות קטנה לשגיאות זיהוי במילים ארוכות
  return target.length >= 4 && levenshtein(token, target) <= 1;
}

/** האם אחת האפשרויות שזוהו מכילה את אחת המטרות */
export function heardMatches(alternatives: string[], targets: string[]): boolean {
  const normTargets = targets.map(normalizeHebrew).filter(Boolean);
  for (const alt of alternatives) {
    const norm = normalizeHebrew(alt);
    if (!norm) continue;
    const tokens = norm.split(" ");
    for (const t of normTargets) {
      if (t.includes(" ") ? norm.includes(t) : tokens.some((tok) => tokenMatches(tok, t))) return true;
    }
  }
  return false;
}
