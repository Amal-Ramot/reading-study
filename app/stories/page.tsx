"use client";

import { useRef, useState } from "react";
import { STORIES } from "@/lib/data";
import { speak, stopSpeaking } from "@/lib/speech";
import { useProgress } from "@/components/ProgressProvider";
import { Celebration } from "@/components/Celebration";

const cleanWord = (w: string) => w.replace(/[.,!?:]/g, "");

export default function StoriesPage() {
  const [sid, setSid] = useState(STORIES[0].id);
  const [size, setSize] = useState(42);
  const [lit, setLit] = useState<string | null>(null);
  const [reading, setReading] = useState(false);
  const [party, setParty] = useState(0);
  const stopRef = useRef(false);
  const { addStars } = useProgress();
  const story = STORIES.find((s) => s.id === sid)!;

  const readAll = async () => {
    stopRef.current = false;
    setReading(true);
    for (let si = 0; si < story.sentences.length; si++) {
      const words = story.sentences[si].split(" ");
      for (let wi = 0; wi < words.length; wi++) {
        if (stopRef.current) break;
        setLit(`${si}-${wi}`);
        await speak(cleanWord(words[wi]), 0.75);
      }
      if (stopRef.current) break;
      await new Promise((r) => setTimeout(r, 350));
    }
    setLit(null);
    setReading(false);
  };

  const stop = () => {
    stopRef.current = true;
    stopSpeaking();
  };

  return (
    <>
      <Celebration trigger={party} />
      <h1 className="page-title read">סִפּוּרִים קְטַנִּים 📖</h1>
      <p className="page-sub">לוחצים על מילה כדי לשמוע אותה, או על &quot;הקרא לי&quot; כדי לעקוב אחרי הקריאה.</p>

      <div className="tabs">
        {STORIES.map((s) => (
          <button key={s.id} className={"chip read" + (s.id === sid ? " active" : "")} style={{ fontSize: 20 }} onClick={() => { stop(); setSid(s.id); }}>
            {s.emoji} {s.title}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
          <h2 className="read" style={{ margin: 0, fontSize: 32 }}>{story.emoji} {story.title}</h2>
          <div className="row">
            <button className="btn btn-sm" onClick={() => setSize(Math.max(28, size - 6))} aria-label="הקטנת טקסט">א-</button>
            <button className="btn btn-sm" onClick={() => setSize(Math.min(72, size + 6))} aria-label="הגדלת טקסט">א+</button>
          </div>
        </div>
        <div className="story-text" style={{ fontSize: size }}>
          {story.sentences.map((sent, si) => (
            <p key={si} className="story-sentence">
              {sent.split(" ").map((w, wi) => (
                <span
                  key={wi}
                  className={"story-word" + (lit === `${si}-${wi}` ? " lit" : "")}
                  onClick={() => { setLit(`${si}-${wi}`); speak(cleanWord(w), 0.75).then(() => setLit(null)); }}
                >
                  {w}
                </span>
              ))}
            </p>
          ))}
        </div>
        <div className="row" style={{ marginTop: 16 }}>
          {reading ? (
            <button className="btn btn-red" onClick={stop}>⏹ עֲצֹר</button>
          ) : (
            <button className="btn btn-teal" onClick={readAll}>🔊 הַקְרֵא לִי</button>
          )}
          <button className="btn btn-green" onClick={() => { addStars(2); setParty((p) => p + 1); }}>
            ✅ קָרָאתִי אֶת הַסִּפּוּר! (+2 ⭐)
          </button>
        </div>
      </div>
    </>
  );
}
