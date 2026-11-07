"use client";

import Link from "next/link";
import { LETTERS, WORDS } from "@/lib/data";
import { masteryLevel, useProgress } from "@/components/ProgressProvider";
import { PageHeader } from "@/components/Characters";

const LABEL = ["לא נבדק", "צריך תרגול", "בדרך", "שולט!"];

export default function ReportPage() {
  const { letters, words, stars, reset } = useProgress();
  const levels = LETTERS.map((l) => masteryLevel(letters[l.char]));
  const mastered = levels.filter((x) => x === 3).length;
  const weak = LETTERS.filter((_, i) => levels[i] === 1);

  return (
    <>
      <PageHeader who="turtle" title="דּוּחַ הִתְקַדְּמוּת 📊">
        התוצאות מבדיקת הקריאה בקול. אות נחשבת &quot;שולט&quot; אחרי 2 קריאות נכונות ברצף.
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 24 }}>
        <div className="tile" style={{ background: "var(--c-yellow-soft)" }}><div className="tile-icon">⭐</div><h3>{stars} כוכבים</h3><p>שנאספו בכל הפעילויות</p></div>
        <div className="tile" style={{ background: "var(--c-green-soft)" }}><div className="tile-icon">🔤</div><h3>{mastered} / {LETTERS.length}</h3><p>אותיות שהילד/ה שולט/ת בהן</p></div>
        <div className="tile" style={{ background: "var(--c-red-soft)" }}><div className="tile-icon">🎯</div><h3>{weak.length} לתרגול</h3><p>{weak.length ? weak.map((l) => l.char).join(" · ") : "אין כרגע 🎉"}</p></div>
      </div>

      <div className="card">
        <h2 style={{ margin: 0 }}>אוֹתִיּוֹת</h2>
        <div className="legend">
          {LABEL.map((t, i) => (
            <span key={i}><i style={{ background: ["var(--line)", "var(--c-red)", "var(--c-yellow)", "var(--c-green)"][i] }} />{t}</span>
          ))}
        </div>
        <div className="report-grid">
          {LETTERS.map((l, i) => {
            const s = letters[l.char];
            return (
              <Link key={l.char} href={`/check?letter=${encodeURIComponent(l.char)}`} className={`report-cell lvl-${levels[i]}`} title="לבדיקת האות">
                <div className="read">{l.char}</div>
                <small>{s ? `${s.correct}/${s.attempts} נכון` : "—"}</small>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h2 style={{ marginTop: 0 }}>מִלִּים</h2>
        <div className="report-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
          {WORDS.map((w) => {
            const s = words[w.word];
            return (
              <div key={w.word} className={`report-cell lvl-${masteryLevel(s)}`}>
                <div className="read" style={{ fontSize: 32 }}>{w.word}</div>
                <small>{s ? `${s.correct}/${s.attempts} נכון` : "—"}</small>
              </div>
            );
          })}
        </div>
      </div>

      <div className="row" style={{ marginTop: 20 }}>
        <Link href="/check" className="btn btn-primary">🎤 לבדיקת קריאה</Link>
        <button className="btn" onClick={() => { if (confirm("לאפס את כל ההתקדמות?")) reset(); }}>🗑️ איפוס התקדמות</button>
      </div>
    </>
  );
}
