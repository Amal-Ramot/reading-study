"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LETTERS, WORDS, shuffle } from "@/lib/data";
import { canRecognize, heardMatches, listenOnce, normalizeHebrew, speak } from "@/lib/speech";
import { masteryLevel, useProgress } from "@/components/ProgressProvider";
import { Celebration } from "@/components/Celebration";

type Mode = "letters" | "words";
type Item = { key: string; display: string; targets: string[]; answer: string; hint: string };
type Status = "idle" | "listening" | "ok" | "bad";

const ROUND = 10;

function letterItem(char: string): Item {
  const l = LETTERS.find((x) => x.char === char)!;
  return { key: l.char, display: l.char, targets: [l.char, l.name, ...l.nameVariants], answer: l.name, hint: "אִמְרוּ בְּקוֹל אֶת שֵׁם הָאוֹת" };
}

function wordItem(i: number): Item {
  const w = WORDS[i];
  return { key: w.word, display: w.word, targets: [w.word], answer: w.word, hint: "קִרְאוּ בְּקוֹל אֶת הַמִּלָּה" };
}

export default function CheckPage() {
  const progress = useProgress();
  const [mode, setMode] = useState<Mode>("letters");
  const [queue, setQueue] = useState<Item[]>([]);
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [heard, setHeard] = useState("");
  const [tries, setTries] = useState(0);
  const [results, setResults] = useState<{ item: Item; ok: boolean }[]>([]);
  const [supported, setSupported] = useState(true);
  const [adultMode, setAdultMode] = useState(false);
  const [party, setParty] = useState(0);
  const cancelRef = useRef<() => void>(() => {});

  // בונה סבב: קודם האותיות החלשות ביותר, ואם הגיעו עם ?letter= – מתחילים בה
  const buildQueue = useCallback(
    (m: Mode, first?: string) => {
      if (m === "letters") {
        const ordered = shuffle(LETTERS).sort(
          (a, b) => (masteryLevel(progress.letters[a.char]) || 1.5) - (masteryLevel(progress.letters[b.char]) || 1.5),
        );
        let chars = ordered.map((l) => l.char).slice(0, ROUND);
        if (first) chars = [first, ...chars.filter((c) => c !== first)].slice(0, ROUND);
        return chars.map(letterItem);
      }
      return shuffle(WORDS.map((_, i) => i)).slice(0, ROUND).map(wordItem);
    },
    [progress.letters],
  );

  const start = useCallback(
    (m: Mode, first?: string) => {
      cancelRef.current();
      setMode(m);
      setQueue(buildQueue(m, first));
      setIdx(0);
      setResults([]);
      setStatus("idle");
      setMessage("");
      setHeard("");
      setTries(0);
    },
    [buildQueue],
  );

  useEffect(() => {
    const ok = canRecognize();
    setSupported(ok);
    setAdultMode(!ok);
    const first = new URLSearchParams(window.location.search).get("letter") ?? undefined;
    start("letters", first && LETTERS.some((l) => l.char === first) ? first : undefined);
    return () => cancelRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const item = queue[idx];
  const finished = queue.length > 0 && idx >= queue.length;

  const record = (ok: boolean) => {
    if (!item) return;
    if (mode === "letters") progress.recordLetter(item.key, ok);
    else progress.recordWord(item.key, ok);
    setResults((r) => [...r, { item, ok }]);
    if (ok) {
      progress.addStars(1);
      setParty((p) => p + 1);
    }
  };

  const next = () => {
    setIdx((i) => i + 1);
    setStatus("idle");
    setMessage("");
    setHeard("");
    setTries(0);
  };

  const listen = async () => {
    if (!item || status === "listening") return;
    setStatus("listening");
    setMessage("אֲנִי מַקְשִׁיב... 👂");
    setHeard("");
    const { promise, cancel } = listenOnce();
    cancelRef.current = cancel;
    const res = await promise;

    if (!res.ok) {
      setStatus("idle");
      if (res.error === "not-allowed") setMessage("צריך לאשר גישה למיקרופון בדפדפן 🎙️");
      else if (res.error === "unsupported") { setSupported(false); setAdultMode(true); setMessage(""); }
      else setMessage("לא שמעתי 🙉 נסו שוב, קצת יותר חזק");
      return;
    }

    setHeard(res.alternatives[0] ?? "");
    const ok = heardMatches(res.alternatives, item.targets);
    if (ok) {
      setStatus("ok");
      setMessage(["כָּל הַכָּבוֹד! 🎉", "מְצֻיָּן! ⭐", "יוֹפִי שֶׁל קְרִיאָה! 🌟"][Math.floor(Math.random() * 3)]);
      record(true);
      setTimeout(next, 1400);
    } else {
      const t = tries + 1;
      setTries(t);
      setStatus("bad");
      if (t >= 2) {
        setMessage(`כִּמְעַט! קוֹרְאִים: ${item.answer}`);
        record(false);
        await speak(item.answer);
      } else {
        setMessage("עוֹד נִסָּיוֹן אֶחָד 💪");
      }
    }
  };

  const adultMark = (ok: boolean) => {
    record(ok);
    if (ok) {
      setStatus("ok");
      setMessage("כָּל הַכָּבוֹד! 🎉");
      setTimeout(next, 900);
    } else {
      setStatus("bad");
      setMessage(`נְתַרְגֵּל עוֹד: ${item.answer}`);
      speak(item.answer);
    }
  };

  const correct = results.filter((r) => r.ok).length;

  return (
    <>
      <Celebration trigger={party} />
      <h1 className="page-title read">בְּדִיקַת קְרִיאָה 🎤</h1>
      <p className="page-sub">
        הילד/ה קורא/ת בקול – והמחשב בודק אם הקריאה נכונה. כל תוצאה נשמרת ב<Link href="/report" style={{ textDecoration: "underline" }}>דוח ההתקדמות</Link>.
      </p>

      {!supported && (
        <div className="notice">
          הדפדפן הזה לא תומך בזיהוי דיבור בעברית. אפשר לפתוח ב-<b>Chrome</b> או <b>Edge</b>,
          או להמשיך ב<b>בדיקה ע&quot;י מבוגר</b>: הילד/ה קורא/ת בקול ומבוגר מסמן אם הקריאה נכונה.
        </div>
      )}

      <div className="tabs">
        <button className={"chip" + (mode === "letters" ? " active" : "")} onClick={() => start("letters")}>🔤 אותיות</button>
        <button className={"chip" + (mode === "words" ? " active" : "")} onClick={() => start("words")}>🧩 מילים</button>
        <label className="chip" style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" checked={adultMode} onChange={(e) => setAdultMode(e.target.checked)} disabled={!supported} />
          בדיקה ע&quot;י מבוגר
        </label>
      </div>

      <div className="card center">
        {finished ? (
          <div>
            <div style={{ fontSize: 80 }}>{correct >= ROUND * 0.8 ? "🏆" : correct >= ROUND * 0.5 ? "🌟" : "💪"}</div>
            <h2 className="read" style={{ fontSize: 34, margin: "6px 0" }}>
              קָרָאתָ נָכוֹן {correct} מִתּוֹךְ {results.length}
            </h2>
            {results.some((r) => !r.ok) && (
              <>
                <p className="muted">כדאי לתרגל עוד:</p>
                <div className="row" style={{ justifyContent: "center" }}>
                  {results.filter((r) => !r.ok).map((r) => (
                    <button key={r.item.key} className="chip read" style={{ fontSize: 30 }} onClick={() => speak(r.item.answer)}>
                      🔊 {r.item.display}
                    </button>
                  ))}
                </div>
              </>
            )}
            <div className="row" style={{ justifyContent: "center", marginTop: 22 }}>
              <button className="btn btn-primary btn-lg" onClick={() => start(mode)}>🔁 סבב חדש</button>
              <Link href="/report" className="btn btn-lg">📊 לדוח ההתקדמות</Link>
            </div>
          </div>
        ) : item ? (
          <>
            <div className="progress-bar" aria-label={`${idx} מתוך ${queue.length}`}>
              <div style={{ width: `${(idx / queue.length) * 100}%` }} />
            </div>
            <p className="read" style={{ fontSize: 24, margin: "16px 0 0" }}>{item.hint}</p>
            <div className={"check-target" + (mode === "words" ? " word" : "") + (status === "ok" ? " ok" : status === "bad" ? " bad" : "")}>
              {item.display}
            </div>

            {adultMode ? (
              <div className="row" style={{ justifyContent: "center" }}>
                <button className="btn btn-green btn-lg" onClick={() => adultMark(true)} disabled={status === "ok"}>✓ קָרָא נָכוֹן</button>
                <button className="btn btn-red btn-lg" onClick={() => adultMark(false)} disabled={status !== "idle"}>✗ עוֹד לֹא</button>
              </div>
            ) : (
              <button
                className={"mic" + (status === "listening" ? " listening" : "")}
                onClick={listen}
                disabled={status === "ok" || (status === "bad" && tries >= 2)}
                aria-label="לחצו ודברו"
              >
                🎤
              </button>
            )}

            <div className={"feedback read" + (status === "ok" ? " ok" : status === "bad" ? " bad" : "")}>{message}</div>
            <div className="heard">{heard && <>שָׁמַעְתִּי: &quot;{normalizeHebrew(heard) || heard}&quot;</>}</div>

            <div className="row" style={{ justifyContent: "center", marginTop: 10 }}>
              {(status === "bad" && (tries >= 2 || adultMode)) && (
                <button className="btn btn-primary" onClick={next}>הַבָּא ←</button>
              )}
              <button className="btn btn-sm" onClick={() => speak(item.answer)}>💡 רֶמֶז: שִׁמְעוּ</button>
              <button className="btn btn-sm" onClick={next}>דַּלֵּג</button>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
