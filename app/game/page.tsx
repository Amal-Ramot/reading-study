"use client";

import { useEffect, useState } from "react";
import { LETTERS, WORDS, pickRandom, shuffle } from "@/lib/data";
import { speak } from "@/lib/speech";
import { useProgress } from "@/components/ProgressProvider";
import { Celebration } from "@/components/Celebration";
import { PageHeader } from "@/components/Characters";

type Mode = "picture" | "letter";
type Round = { prompt: string; promptSpeak: string; answer: string; options: string[] };
const ROUNDS = 8;

function makeRound(mode: Mode): Round {
  if (mode === "picture") {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    const others = pickRandom(WORDS, 2, w).map((x) => x.word);
    return { prompt: w.emoji, promptSpeak: w.word, answer: w.word, options: shuffle([w.word, ...others]) };
  }
  const l = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  const others = pickRandom(LETTERS, 3, l).map((x) => x.char);
  return { prompt: "👂", promptSpeak: l.name, answer: l.char, options: shuffle([l.char, ...others]) };
}

export default function GamePage() {
  const [mode, setMode] = useState<Mode>("picture");
  const [round, setRound] = useState<Round | null>(null);
  const [n, setN] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [firstTry, setFirstTry] = useState(true);
  const [party, setParty] = useState(0);
  const { addStars } = useProgress();

  const restart = (m: Mode) => {
    setMode(m);
    setN(0);
    setScore(0);
    setPicked(null);
    setFirstTry(true);
    const r = makeRound(m);
    setRound(r);
    if (m === "letter") speak(r.promptSpeak);
  };

  useEffect(() => restart("picture"), []); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (opt: string) => {
    if (!round || picked === round.answer) return;
    setPicked(opt);
    if (opt === round.answer) {
      if (firstTry) { setScore((s) => s + 1); addStars(1); }
      setParty((p) => p + 1);
      if (mode === "picture") speak(opt);
      setTimeout(() => {
        const next = n + 1;
        setN(next);
        setPicked(null);
        setFirstTry(true);
        if (next < ROUNDS) {
          const r = makeRound(mode);
          setRound(r);
          if (mode === "letter") speak(r.promptSpeak);
        }
      }, 1100);
    } else {
      setFirstTry(false);
    }
  };

  return (
    <>
      <Celebration trigger={party} />
      <PageHeader who="puffer" title="מִשְׂחַק קְרִיאָה 🎮">
        בוחרים משחק ועונים. תשובה נכונה בניסיון הראשון = כוכב ⭐
      </PageHeader>

      <div className="tabs">
        <button className={"chip" + (mode === "picture" ? " active" : "")} onClick={() => restart("picture")}>🖼️ איזו מילה מתאימה לתמונה?</button>
        <button className={"chip" + (mode === "letter" ? " active" : "")} onClick={() => restart("letter")}>👂 שומעים ומוצאים אות</button>
      </div>

      <div className="card center">
        {n >= ROUNDS ? (
          <div>
            <div style={{ fontSize: 90 }}>🏆</div>
            <h2 className="read" style={{ fontSize: 34 }}>צָבַרְתָּ {score} מִתּוֹךְ {ROUNDS}!</h2>
            <button className="btn btn-primary btn-lg" onClick={() => restart(mode)}>🔁 שׂוֹחֲקִים שׁוּב</button>
          </div>
        ) : round ? (
          <>
            <div className="progress-bar"><div style={{ width: `${(n / ROUNDS) * 100}%` }} /></div>
            <div style={{ fontSize: 110, margin: "18px 0 4px" }}>{round.prompt}</div>
            {mode === "letter" ? (
              <button className="btn btn-teal" onClick={() => speak(round.promptSpeak)}>🔊 שִׁמְעוּ שׁוּב אֶת הָאוֹת</button>
            ) : (
              <p className="muted" style={{ margin: 0 }}>איזו מילה כתובה פה?</p>
            )}
            <div className="options">
              {round.options.map((o) => (
                <button
                  key={o}
                  className={"option" + (picked === o ? (o === round.answer ? " correct" : " wrong") : "")}
                  style={mode === "letter" ? { fontSize: 80 } : undefined}
                  onClick={() => choose(o)}
                >
                  {o}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
