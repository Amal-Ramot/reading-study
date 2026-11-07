"use client";

import { useState } from "react";
import Link from "next/link";
import { LETTERS } from "@/lib/data";
import { SpeakButton } from "@/components/SpeakButton";
import { masteryLevel, useProgress } from "@/components/ProgressProvider";

const DOT = ["transparent", "var(--c-red)", "var(--c-yellow)", "var(--c-green)"];

export default function LettersPage() {
  const [sel, setSel] = useState(0);
  const { letters } = useProgress();
  const l = LETTERS[sel];

  return (
    <>
      <h1 className="page-title read">הָאוֹתִיּוֹת שֶׁלִּי 🔤</h1>
      <p className="page-sub">לוחצים על אות כדי לראות אותה בגדול, לשמוע את השם שלה ומילה שמתחילה בה.</p>

      <div className="card letter-detail">
        <div className="letter-big">{l.char}</div>
        <div className="letter-info">
          <h2 className="read">
            הָאוֹת {l.name}
            {l.final && <span className="muted" style={{ fontSize: 22 }}> · סוֹפִית: <span className="read" style={{ fontSize: 34 }}>{l.final}</span></span>}
          </h2>
          <div className="example">
            <span>{l.emoji}</span>
            <span className="read">
              <span className="first-letter">{l.word.match(/^.[֑-ׇ]*/)?.[0]}</span>
              {l.word.replace(/^.[֑-ׇ]*/, "")}
            </span>
          </div>
          <div className="row">
            <SpeakButton text={l.name} label="שֵׁם הָאוֹת" />
            <SpeakButton text={l.word} label="מִלָּה" />
            <Link href={`/check?letter=${encodeURIComponent(l.char)}`} className="btn btn-primary">🎤 אני אקרא!</Link>
          </div>
          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn btn-sm" onClick={() => setSel((sel - 1 + LETTERS.length) % LETTERS.length)}>→ הקודמת</button>
            <button className="btn btn-sm" onClick={() => setSel((sel + 1) % LETTERS.length)}>הבאה ←</button>
          </div>
        </div>
      </div>

      <div className="letters-grid">
        {LETTERS.map((x, i) => {
          const lvl = masteryLevel(letters[x.char]);
          return (
            <button
              key={x.char}
              className={"letter-card" + (i === sel ? " selected" : "")}
              onClick={() => setSel(i)}
              aria-label={`האות ${x.name}`}
            >
              {lvl > 0 && <span className="mastery-dot" style={{ background: DOT[lvl] }} />}
              {x.char}
              <small>{x.emoji}</small>
            </button>
          );
        })}
      </div>
    </>
  );
}
