"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type LetterStat = { correct: number; attempts: number; streak: number };

type Progress = {
  stars: number;
  letters: Record<string, LetterStat>;
  words: Record<string, LetterStat>;
  /** ציון הכי טוב (באחוזים) לכל שלב ניקוד ולכל תרגיל בו: nikud["1"].listen */
  nikud: Record<string, Partial<Record<NikudStep, number>>>;
};

export type NikudStep = "listen" | "match" | "read";

type Ctx = Progress & {
  addStars: (n?: number) => void;
  recordLetter: (char: string, correct: boolean) => void;
  recordWord: (word: string, correct: boolean) => void;
  recordNikud: (level: number, step: NikudStep, pct: number) => void;
  reset: () => void;
};

const EMPTY: Progress = { stars: 0, letters: {}, words: {}, nikud: {} };
const KEY = "reading-study-progress-v1";

const ProgressContext = createContext<Ctx | null>(null);

function bump(map: Record<string, LetterStat>, key: string, correct: boolean) {
  const prev = map[key] ?? { correct: 0, attempts: 0, streak: 0 };
  return {
    ...map,
    [key]: {
      correct: prev.correct + (correct ? 1 : 0),
      attempts: prev.attempts + 1,
      streak: correct ? prev.streak + 1 : 0,
    },
  };
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Progress>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, loaded]);

  const addStars = useCallback((n = 1) => setState((s) => ({ ...s, stars: s.stars + n })), []);
  const recordLetter = useCallback(
    (char: string, correct: boolean) => setState((s) => ({ ...s, letters: bump(s.letters, char, correct) })),
    [],
  );
  const recordWord = useCallback(
    (word: string, correct: boolean) => setState((s) => ({ ...s, words: bump(s.words, word, correct) })),
    [],
  );
  const recordNikud = useCallback(
    (level: number, step: NikudStep, pct: number) =>
      setState((s) => {
        const prev = s.nikud[level] ?? {};
        return { ...s, nikud: { ...s.nikud, [level]: { ...prev, [step]: Math.max(prev[step] ?? 0, pct) } } };
      }),
    [],
  );
  const reset = useCallback(() => setState(EMPTY), []);

  return (
    <ProgressContext.Provider value={{ ...state, addStars, recordLetter, recordWord, recordNikud, reset }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}

/** רמת שליטה באות: 0 = לא נבדק, 1 = צריך תרגול, 2 = בדרך, 3 = שולט */
export function masteryLevel(stat?: LetterStat): 0 | 1 | 2 | 3 {
  if (!stat || stat.attempts === 0) return 0;
  const ratio = stat.correct / stat.attempts;
  if (stat.streak >= 2 && ratio >= 0.7) return 3;
  if (ratio >= 0.5) return 2;
  return 1;
}
