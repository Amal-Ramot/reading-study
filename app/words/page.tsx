"use client";

import { useState } from "react";
import { WORDS } from "@/lib/data";
import { speak } from "@/lib/speech";
import { useProgress } from "@/components/ProgressProvider";
import { Celebration } from "@/components/Celebration";
import { PageHeader } from "@/components/Characters";

export default function WordsPage() {
  const [i, setI] = useState(0);
  const [lit, setLit] = useState(-1);
  const [showWhole, setShowWhole] = useState(false);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [party, setParty] = useState(0);
  const { addStars } = useProgress();
  const w = WORDS[i];

  const go = (d: number) => {
    setI((i + d + WORDS.length) % WORDS.length);
    setShowWhole(false);
    setLit(-1);
  };

  const readBySyllable = async () => {
    for (let k = 0; k < w.syllables.length; k++) {
      setLit(k);
      await speak(w.syllables[k], 0.6);
      await new Promise((r) => setTimeout(r, 250));
    }
    setLit(-1);
    setShowWhole(true);
    await speak(w.word, 0.8);
  };

  const markRead = () => {
    if (!done.has(i)) {
      addStars(1);
      setDone(new Set(done).add(i));
    }
    setParty((p) => p + 1);
    setTimeout(() => go(1), 900);
  };

  return (
    <>
      <Celebration trigger={party} />
      <PageHeader who="puffer" title="קוֹרְאִים מִלִּים 🧩">
        כל צבע הוא הברה. קוראים הברה-הברה, ואז את כל המילה ביחד.
      </PageHeader>

      <div className="card word-stage">
        <div className="word-emoji">{w.emoji}</div>
        <div className="syllables">
          {w.syllables.map((s, k) => (
            <button
              key={k}
              className={"syllable" + (k === lit ? " lit" : "")}
              style={{ border: "none", cursor: "pointer" }}
              onClick={() => speak(s, 0.6)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="whole-word" style={{ visibility: showWhole ? "visible" : "hidden" }}>{w.word}</div>
        <div className="row" style={{ justifyContent: "center" }}>
          <button className="btn btn-teal" onClick={readBySyllable}>🐢 הֲבָרָה הֲבָרָה</button>
          <button className="btn" onClick={() => { setShowWhole(true); speak(w.word); }}>🔊 כָּל הַמִּלָּה</button>
          <button className="btn btn-green" onClick={markRead}>✅ קָרָאתִי!</button>
        </div>
        <div className="row" style={{ justifyContent: "center", marginTop: 18 }}>
          <button className="btn btn-sm" onClick={() => go(-1)}>→ הקודמת</button>
          <span className="muted">{i + 1} / {WORDS.length}</span>
          <button className="btn btn-sm" onClick={() => go(1)}>הבאה ←</button>
        </div>
        <div className="dots" aria-hidden>
          {WORDS.map((_, k) => <span key={k} className={k === i ? "on" : done.has(k) ? "done" : ""} />)}
        </div>
      </div>
    </>
  );
}
