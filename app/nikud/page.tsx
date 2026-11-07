"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { shuffle } from "@/lib/data";
import {
  NIKUD_CONSONANTS,
  NIKUD_LEVELS,
  NikudLevel,
  NikudWord,
  levelWords,
  reviewWords,
  speakableSyllable,
  syllable,
} from "@/lib/nikud";
import { canRecognize, heardMatches, listenOnce, speak } from "@/lib/speech";
import { NikudStep, useProgress } from "@/components/ProgressProvider";
import { Celebration } from "@/components/Celebration";
import { PageHeader } from "@/components/Characters";

const PASS = 80;
const STEPS: { id: "intro" | NikudStep; label: string; icon: string }[] = [
  { id: "intro", label: "מַכִּירִים", icon: "👀" },
  { id: "listen", label: "שׁוֹמְעִים וּבוֹחֲרִים", icon: "👂" },
  { id: "match", label: "קוֹרְאִים וּמַתְאִימִים", icon: "🧩" },
  { id: "read", label: "קוֹרְאִים בְּקוֹל", icon: "🎤" },
];

function isDone(scores?: Partial<Record<NikudStep, number>>) {
  return !!scores && (scores.listen ?? 0) >= PASS && (scores.match ?? 0) >= PASS && (scores.read ?? 0) >= PASS;
}

export default function NikudPage() {
  const { nikud } = useProgress();
  const [levelId, setLevelId] = useState<number | null>(null);
  const [step, setStep] = useState<(typeof STEPS)[number]["id"]>("intro");

  useEffect(() => {
    const q = Number(new URLSearchParams(window.location.search).get("level"));
    if (q >= 1 && q <= NIKUD_LEVELS.length) setLevelId(q);
  }, []);

  const recommended = NIKUD_LEVELS.find((l) => !isDone(nikud[l.id]))?.id ?? NIKUD_LEVELS.length;
  const level = NIKUD_LEVELS.find((l) => l.id === levelId);

  if (!level) {
    return (
      <>
        <PageHeader who="octopus" title="מַסְלוּל הַנִּקּוּד 🎵">
          
          לומדים צליל אחד בכל פעם. בכל שלב: מכירים את הסימן, שומעים ומבחינים, קוראים מילים ומתאימים לתמונה, וקוראים בקול.
          שלב עובר כשכל התרגילים מגיעים ל-{PASS}%.
        
        </PageHeader>
        <div className="level-map">
          {NIKUD_LEVELS.map((l) => {
            const sc = nikud[l.id];
            const done = isDone(sc);
            const rec = l.id === recommended;
            return (
              <button
                key={l.id}
                className={"level-card" + (rec ? " recommended" : "") + (done ? " done" : "")}
                style={{ background: l.soft, borderColor: rec ? l.color : undefined }}
                onClick={() => { setLevelId(l.id); setStep("intro"); }}
              >
                <span className="level-num">שלב {l.id}{done ? " ⭐" : rec ? " ← מכאן" : ""}</span>
                <span className="level-sound read" style={{ color: l.color }}>{l.marks.map((m) => m.mark).join(" ")}</span>
                <span className="read level-title">{l.title}</span>
                <span className="read muted">אוֹמְרִים: {l.sound}</span>
                <span className="level-scores">
                  <span title="שמיעה">👂 {sc?.listen ?? "–"}{sc?.listen != null && "%"}</span>
                  <span title="התאמה">🧩 {sc?.match ?? "–"}{sc?.match != null && "%"}</span>
                  <span title="קריאה בקול">🎤 {sc?.read ?? "–"}{sc?.read != null && "%"}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="muted" style={{ marginTop: 20 }}>
          רוצים לראות את כל סימני הניקוד ביחד? <Link href="/vowels" style={{ textDecoration: "underline" }}>ללוח הניקוד</Link>
        </p>
      </>
    );
  }

  const stepIdx = STEPS.findIndex((s) => s.id === step);
  const goNext = () => {
    if (stepIdx < STEPS.length - 1) setStep(STEPS[stepIdx + 1].id);
    else if (level.id < NIKUD_LEVELS.length) { setLevelId(level.id + 1); setStep("intro"); }
    else setLevelId(null);
  };

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
        <h1 className="page-title read" style={{ margin: 0 }}>
          שָׁלָב {level.id}: <span style={{ color: level.color }}>{level.title}</span>
        </h1>
        <button className="btn btn-sm" onClick={() => setLevelId(null)}>→ לכל השלבים</button>
      </div>

      <div className="stepper">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            className={"step-chip read" + (s.id === step ? " active" : "")}
            style={s.id === step ? { background: level.color, borderColor: level.color } : undefined}
            onClick={() => setStep(s.id)}
          >
            <b>{i + 1}</b> {s.icon} {s.label}
            {s.id !== "intro" && nikud[level.id]?.[s.id] != null && (
              <small> · {nikud[level.id]?.[s.id]}%</small>
            )}
          </button>
        ))}
      </div>

      <div className="card" key={`${level.id}-${step}`}>
        {step === "intro" && <Intro level={level} onNext={goNext} />}
        {step === "listen" && <ListenQuiz level={level} onNext={goNext} />}
        {step === "match" && <MatchQuiz level={level} onNext={goNext} />}
        {step === "read" && <ReadAloud level={level} onNext={goNext} />}
      </div>
    </>
  );
}

/* ---------------- 1. הכרות ---------------- */

function Intro({ level, onNext }: { level: NikudLevel; onNext: () => void }) {
  const [c, setC] = useState("מ");
  const learned = NIKUD_LEVELS.filter((l) => l.id <= Math.min(level.id, 5));
  const isShva = level.vowelIds[0] === "shva";

  return (
    <div>
      <div className="intro-head">
        <div className="marks">
          {level.marks.map((m) => (
            <div key={m.name} className="mark-box" style={{ borderColor: level.color }}>
              <span className="read mark" style={{ color: level.color }}>{m.mark}</span>
              <span className="read">{m.name}</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <p className="read tip">{level.tip}</p>
          <div className="row">
            <button className="btn btn-teal" onClick={() => speak(level.tip, 0.8)}>🔊 הַקְרֵא לִי</button>
            <button className="btn" onClick={() => speak(level.anchor.word)}>
              <span style={{ fontSize: 28 }}>{level.anchor.emoji}</span>
              <span className="read" style={{ fontSize: 28 }}>{level.anchor.word}</span>
            </button>
          </div>
        </div>
      </div>

      {!isShva ? (
        <>
          <h3 className="read" style={{ marginBottom: 6 }}>לוֹחֲצִים עַל הֲבָרָה, שׁוֹמְעִים, וְקוֹרְאִים אַחֲרֶיהָ בְּקוֹל:</h3>
          {level.vowelIds.map((v) => (
            <div key={v} className="syllable-train">
              {NIKUD_CONSONANTS.slice(0, 8).map((cc) => (
                <button key={cc} style={{ color: level.color }} onClick={() => speak(speakableSyllable(cc, v), 0.7)}>
                  {syllable(cc, v)}
                </button>
              ))}
            </div>
          ))}

          {learned.length > 1 && (
            <>
              <h3 className="read" style={{ margin: "22px 0 6px" }}>⚖️ מָה הַהֶבְדֵּל? אוֹתָהּ אוֹת – נִקּוּד אַחֵר</h3>
              <div className="row" style={{ marginBottom: 6 }}>
                {NIKUD_CONSONANTS.slice(0, 8).map((x) => (
                  <button key={x} className={"chip read" + (x === c ? " active" : "")} style={{ fontSize: 22 }} onClick={() => setC(x)}>{x}</button>
                ))}
              </div>
              <div className="syllable-train">
                {learned.map((l) => {
                  const v = l.vowelIds[0];
                  return (
                    <button key={l.id} style={{ color: l.color, borderColor: l.id === level.id ? l.color : undefined }} onClick={() => speak(speakableSyllable(c, v), 0.7)}>
                      {syllable(c, v)}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <h3 className="read">מִלִּים עִם שְׁוָא – לוֹחֲצִים וְשׁוֹמְעִים:</h3>
          <div className="row" style={{ justifyContent: "center" }}>
            {level.words.map((w) => (
              <button key={w.word} className="btn read" style={{ fontSize: 30 }} onClick={() => speak(w.word)}>
                {w.emoji} {w.word}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="row" style={{ justifyContent: "center", marginTop: 24 }}>
        <button className="btn btn-primary btn-lg" onClick={onNext}>הִכַּרְנוּ! לַתַּרְגִּיל ←</button>
      </div>
    </div>
  );
}

/* ---------------- כלים משותפים לתרגילים ---------------- */

function useQuizScore(level: NikudLevel, step: NikudStep, total: number) {
  const { recordNikud, addStars } = useProgress();
  const [firstTry, setFirstTry] = useState(0);
  const [done, setDone] = useState(false);
  const finish = useCallback(
    (score: number) => {
      const pct = Math.round((score / total) * 100);
      recordNikud(level.id, step, pct);
      setDone(true);
      return pct;
    },
    [level.id, step, total, recordNikud],
  );
  return { firstTry, setFirstTry, done, setDone, finish, addStars };
}

function Result({ pct, onRetry, onNext }: { pct: number; onRetry: () => void; onNext: () => void }) {
  const pass = pct >= PASS;
  return (
    <div className="center">
      <div style={{ fontSize: 84 }}>{pct === 100 ? "🏆" : pass ? "🌟" : "💪"}</div>
      <h2 className="read" style={{ fontSize: 34, margin: "4px 0" }}>{pct}%</h2>
      <p className="read" style={{ fontSize: 22 }}>
        {pass ? "מְצֻיָּן! אֶפְשָׁר לְהַמְשִׁיךְ." : `עוֹד קְצָת תִּרְגּוּל – צָרִיךְ ${PASS}% כְּדֵי לַעֲבֹר.`}
      </p>
      <div className="row" style={{ justifyContent: "center" }}>
        <button className={"btn btn-lg" + (pass ? "" : " btn-primary")} onClick={onRetry}>🔁 עוֹד פַּעַם</button>
        {pass && <button className="btn btn-primary btn-lg" onClick={onNext}>הַלְאָה ←</button>}
      </div>
    </div>
  );
}

function QuizProgress({ n, total }: { n: number; total: number }) {
  return <div className="progress-bar" style={{ marginBottom: 14 }}><div style={{ width: `${(n / total) * 100}%` }} /></div>;
}

/* ---------------- 2. שומעים ובוחרים ---------------- */

type ListenRound = { speakText: string; answer: string; options: { text: string; speak: string }[] };
const LISTEN_ROUNDS = 8;

function makeListenRound(level: NikudLevel): ListenRound {
  const lvl = Math.min(level.id, 5);
  const pickV = (l: NikudLevel) => l.vowelIds[Math.floor(Math.random() * l.vowelIds.length)];
  if (lvl === 1) {
    // רק צליל אחד נלמד: מבחינים בין אותיות שונות עם אותו ניקוד
    const cs = shuffle(NIKUD_CONSONANTS).slice(0, 3);
    const opts = cs.map((c) => { const v = pickV(level); return { text: syllable(c, v), speak: speakableSyllable(c, v) }; });
    const ans = opts[Math.floor(Math.random() * 3)];
    return { speakText: ans.speak, answer: ans.text, options: opts };
  }
  // אותה אות, ניקוד שונה – זה בדיוק מה שמתרגל קריאה נכונה של ניקוד
  const c = NIKUD_CONSONANTS[Math.floor(Math.random() * NIKUD_CONSONANTS.length)];
  const learned = NIKUD_LEVELS.filter((l) => l.id <= lvl);
  const current = NIKUD_LEVELS.find((l) => l.id === lvl)!;
  const target = level.id <= 5 && Math.random() < 0.6 ? current : learned[Math.floor(Math.random() * learned.length)];
  const others = shuffle(learned.filter((l) => l.id !== target.id)).slice(0, 2);
  const opts = shuffle([target, ...others]).map((l) => { const v = pickV(l); return { text: syllable(c, v), speak: speakableSyllable(c, v), id: l.id }; });
  const ans = opts.find((o) => o.id === target.id)!;
  return { speakText: ans.speak, answer: ans.text, options: opts };
}

function ListenQuiz({ level, onNext }: { level: NikudLevel; onNext: () => void }) {
  const q = useQuizScore(level, "listen", LISTEN_ROUNDS);
  const [rounds, setRounds] = useState<ListenRound[]>([]);
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [pct, setPct] = useState(0);
  const [party, setParty] = useState(0);

  const start = useCallback(() => {
    const rs = Array.from({ length: LISTEN_ROUNDS }, () => makeListenRound(level));
    setRounds(rs); setN(0); setPicked([]); q.setFirstTry(0); q.setDone(false);
    setTimeout(() => speak(rs[0].speakText, 0.7), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);
  useEffect(start, [start]);

  const r = rounds[n];
  if (q.done) return <Result pct={pct} onRetry={start} onNext={onNext} />;
  if (!r) return null;

  const choose = (text: string, speakText: string) => {
    if (picked.includes(r.answer)) return;
    setPicked((p) => [...p, text]);
    if (text === r.answer) {
      const first = picked.length === 0;
      const score = q.firstTry + (first ? 1 : 0);
      if (first) { q.setFirstTry(score); q.addStars(1); }
      setParty((p) => p + 1);
      setTimeout(() => {
        if (n + 1 >= LISTEN_ROUNDS) { setPct(q.finish(score)); return; }
        setN(n + 1); setPicked([]);
        speak(rounds[n + 1].speakText, 0.7);
      }, 900);
    } else {
      // משמיעים את מה שנבחר, כדי שהילד ישמע את ההבדל
      speak(speakText, 0.7);
    }
  };

  return (
    <div className="center">
      <Celebration trigger={party} />
      <QuizProgress n={n} total={LISTEN_ROUNDS} />
      <p className="read" style={{ fontSize: 24, margin: 0 }}>הַקְשִׁיבוּ – אֵיזוֹ הֲבָרָה שְׁמַעְתֶּם?</p>
      <button className="mic" style={{ background: level.color, margin: "16px 0", boxShadow: "none" }} onClick={() => speak(r.speakText, 0.7)} aria-label="שמעו שוב">🔊</button>
      <div className="options">
        {r.options.map((o) => (
          <button
            key={o.text}
            className={"option" + (picked.includes(o.text) ? (o.text === r.answer ? " correct" : " wrong") : "")}
            style={{ fontSize: 84 }}
            onClick={() => choose(o.text, o.speak)}
          >
            {o.text}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- 3. קוראים ומתאימים לתמונה ---------------- */

type MatchRound = { word: NikudWord; options: string[] };
const MATCH_ROUNDS = 8;

function makeMatchRounds(level: NikudLevel): MatchRound[] {
  const own = levelWords(level.id);
  const pool = reviewWords(level.id);
  let list: NikudWord[] = [];
  while (list.length < MATCH_ROUNDS) list = [...list, ...shuffle(own)];
  return list.slice(0, MATCH_ROUNDS).map((w) => {
    const distract = shuffle(Array.from(new Set(pool.map((p) => p.emoji))).filter((e) => e !== w.emoji)).slice(0, 2);
    return { word: w, options: shuffle([w.emoji, ...distract]) };
  });
}

function MatchQuiz({ level, onNext }: { level: NikudLevel; onNext: () => void }) {
  const q = useQuizScore(level, "match", MATCH_ROUNDS);
  const [rounds, setRounds] = useState<MatchRound[]>([]);
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [pct, setPct] = useState(0);
  const [party, setParty] = useState(0);

  const start = useCallback(() => {
    setRounds(makeMatchRounds(level)); setN(0); setPicked([]); q.setFirstTry(0); q.setDone(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);
  useEffect(start, [start]);

  const r = rounds[n];
  if (q.done) return <Result pct={pct} onRetry={start} onNext={onNext} />;
  if (!r) return null;
  const solved = picked.includes(r.word.emoji);

  const choose = (e: string) => {
    if (solved) return;
    setPicked((p) => [...p, e]);
    if (e === r.word.emoji) {
      const first = picked.length === 0;
      const score = q.firstTry + (first ? 1 : 0);
      if (first) { q.setFirstTry(score); q.addStars(1); }
      setParty((p) => p + 1);
      speak(r.word.word);
      setTimeout(() => {
        if (n + 1 >= MATCH_ROUNDS) { setPct(q.finish(score)); return; }
        setN(n + 1); setPicked([]);
      }, 1300);
    }
  };

  return (
    <div className="center">
      <Celebration trigger={party} />
      <QuizProgress n={n} total={MATCH_ROUNDS} />
      <p className="read" style={{ fontSize: 24, margin: 0 }}>קִרְאוּ אֶת הַמִּלָּה לְבַד – וּבַחֲרוּ אֶת הַתְּמוּנָה</p>
      <div className={"check-target word" + (solved ? " ok" : "")}>{r.word.word}</div>
      <div className="options" style={{ maxWidth: 560, margin: "0 auto" }}>
        {r.options.map((e) => (
          <button
            key={e}
            className={"option" + (picked.includes(e) ? (e === r.word.emoji ? " correct" : " wrong") : "")}
            style={{ fontSize: 72 }}
            onClick={() => choose(e)}
          >
            {e}
          </button>
        ))}
      </div>
      {picked.length > 0 && !solved && (
        <p className="read muted" style={{ marginTop: 14 }}>
          לֹא נוֹרָא! קִרְאוּ שׁוּב לְאַט, הֲבָרָה הֲבָרָה. <button className="btn btn-sm" onClick={() => speak(r.word.word, 0.6)}>💡 רֶמֶז</button>
        </p>
      )}
    </div>
  );
}

/* ---------------- 4. קוראים בקול ---------------- */

const READ_ROUNDS = 6;

function ReadAloud({ level, onNext }: { level: NikudLevel; onNext: () => void }) {
  const q = useQuizScore(level, "read", READ_ROUNDS);
  const [words, setWords] = useState<NikudWord[]>([]);
  const [n, setN] = useState(0);
  const [status, setStatus] = useState<"idle" | "listening" | "ok" | "bad">("idle");
  const [msg, setMsg] = useState("");
  const [tries, setTries] = useState(0);
  const [adult, setAdult] = useState(false);
  const [supported, setSupported] = useState(true);
  const [pct, setPct] = useState(0);
  const [party, setParty] = useState(0);
  const scoreRef = useRef(0);
  const cancelRef = useRef<() => void>(() => {});

  const start = useCallback(() => {
    let list: NikudWord[] = [];
    while (list.length < READ_ROUNDS) list = [...list, ...shuffle(levelWords(level.id))];
    setWords(list.slice(0, READ_ROUNDS)); setN(0); setStatus("idle"); setMsg(""); setTries(0);
    scoreRef.current = 0; q.setDone(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  useEffect(() => {
    const ok = canRecognize();
    setSupported(ok); setAdult(!ok);
    start();
    return () => cancelRef.current();
  }, [start]);

  const w = words[n];
  if (q.done) return <Result pct={pct} onRetry={start} onNext={onNext} />;
  if (!w) return null;

  const advance = () => {
    if (n + 1 >= READ_ROUNDS) { setPct(q.finish(scoreRef.current)); return; }
    setN(n + 1); setStatus("idle"); setMsg(""); setTries(0);
  };

  const result = (ok: boolean) => {
    if (ok) {
      if (tries === 0) { scoreRef.current += 1; q.addStars(1); }
      setStatus("ok"); setMsg("קָרָאתָ נָכוֹן! 🎉"); setParty((p) => p + 1);
      setTimeout(advance, 1200);
      return;
    }
    const t = tries + 1;
    setTries(t); setStatus("bad");
    if (t >= 2) { setMsg(`קוֹרְאִים: ${w.word}`); speak(w.word, 0.7); }
    else setMsg("כִּמְעַט! נַסּוּ שׁוּב, הֲבָרָה הֲבָרָה 💪");
  };

  const listen = async () => {
    if (status === "listening") return;
    setStatus("listening"); setMsg("אֲנִי מַקְשִׁיב... 👂");
    const { promise, cancel } = listenOnce();
    cancelRef.current = cancel;
    const res = await promise;
    if (!res.ok) {
      setStatus("idle");
      if (res.error === "not-allowed") setMsg("צריך לאשר גישה למיקרופון 🎙️");
      else if (res.error === "unsupported") { setSupported(false); setAdult(true); setMsg(""); }
      else setMsg("לֹא שָׁמַעְתִּי 🙉 נַסּוּ שׁוּב");
      return;
    }
    result(heardMatches(res.alternatives, [w.word]));
  };

  return (
    <div className="center">
      <Celebration trigger={party} />
      <QuizProgress n={n} total={READ_ROUNDS} />
      {!supported && <div className="notice">הדפדפן לא תומך בזיהוי דיבור – מבוגר מקשיב ומסמן אם הקריאה נכונה (או פתחו ב-Chrome / Edge).</div>}
      <div className="row" style={{ justifyContent: "center" }}>
        <p className="read" style={{ fontSize: 24, margin: 0 }}>קִרְאוּ אֶת הַמִּלָּה בְּקוֹל</p>
        <label className="chip" style={{ display: "inline-flex", gap: 8, alignItems: "center", fontSize: 15 }}>
          <input type="checkbox" checked={adult} disabled={!supported} onChange={(e) => setAdult(e.target.checked)} />
          בדיקה ע&quot;י מבוגר
        </label>
      </div>
      <div className={"check-target word" + (status === "ok" ? " ok" : status === "bad" ? " bad" : "")}>{w.word}</div>
      {status === "ok" && <div style={{ fontSize: 64, marginTop: -6 }}>{w.emoji}</div>}

      {status !== "ok" && (tries < 2 ? (
        adult ? (
          <div className="row" style={{ justifyContent: "center" }}>
            <button className="btn btn-green btn-lg" onClick={() => result(true)}>✓ קָרָא נָכוֹן</button>
            <button className="btn btn-red btn-lg" onClick={() => result(false)}>✗ עוֹד לֹא</button>
          </div>
        ) : (
          <button className={"mic" + (status === "listening" ? " listening" : "")} onClick={listen} aria-label="לחצו ודברו">🎤</button>
        )
      ) : (
        <button className="btn btn-primary btn-lg" onClick={advance}>הַמִּלָּה הַבָּאָה ←</button>
      ))}
      <div className={"feedback read" + (status === "ok" ? " ok" : status === "bad" ? " bad" : "")}>{msg}</div>
    </div>
  );
}
