"use client";

import { useEffect, useState } from "react";
import { PRACTICE_CONSONANTS, VOWELS, shuffle } from "@/lib/data";
import { speak } from "@/lib/speech";
import { PageHeader } from "@/components/Characters";

function makeTrain(vowelIds: string[]) {
  const vs = VOWELS.filter((v) => vowelIds.includes(v.id));
  return Array.from({ length: 6 }, () => {
    const v = vs[Math.floor(Math.random() * vs.length)];
    const c = shuffle(PRACTICE_CONSONANTS)[0];
    return v.build(c);
  });
}

export default function VowelsPage() {
  const [consonant, setConsonant] = useState("מ");
  const [trainVowels, setTrainVowels] = useState<string[]>(["kamatz", "patach"]);
  const [train, setTrain] = useState<string[]>([]);
  const [lit, setLit] = useState(-1);

  // אקראיות רק בצד הלקוח, כדי שלא תהיה אי-התאמה מול הרינדור בשרת
  useEffect(() => setTrain(makeTrain(["kamatz", "patach"])), []);

  const toggleVowel = (id: string) => {
    const next = trainVowels.includes(id) ? trainVowels.filter((x) => x !== id) : [...trainVowels, id];
    if (next.length === 0) return;
    setTrainVowels(next);
    setTrain(makeTrain(next));
  };

  const readTrain = async () => {
    for (let i = 0; i < train.length; i++) {
      setLit(i);
      await speak(train[i], 0.7);
    }
    setLit(-1);
  };

  return (
    <>
      <PageHeader who="octopus" title="הַנִּקּוּד 🎵">
        אות + סימן ניקוד = הברה. בוחרים אות ולוחצים על הברה כדי לשמוע אותה.
      </PageHeader>

      <div className="card">
        <div className="row" style={{ marginBottom: 18 }}>
          <b>בַּחֲרוּ אוֹת:</b>
          {PRACTICE_CONSONANTS.map((c) => (
            <button key={c} className={"chip read" + (c === consonant ? " active" : "")} style={{ fontSize: 24 }} onClick={() => setConsonant(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="vowel-grid">
          {VOWELS.map((v) => {
            const syl = v.build(consonant);
            return (
              <button key={v.id} className="vowel-card" style={{ borderColor: v.color }} onClick={() => speak(syl, 0.7)}>
                <div className="syl" style={{ color: v.color }}>{syl}</div>
                <div className="vname read">{v.name}</div>
                <div className="muted read">🔊 {v.sound}</div>
              </button>
            );
          })}
        </div>
      </div>

      <h2 className="section-title">🚂 רַכֶּבֶת הֲבָרוֹת – קוֹרְאִים בְּרֶצֶף</h2>
      <div className="card">
        <div className="row" style={{ marginBottom: 10 }}>
          <b>תנועות לתרגול:</b>
          {VOWELS.map((v) => (
            <button key={v.id} className={"chip read" + (trainVowels.includes(v.id) ? " active" : "")} onClick={() => toggleVowel(v.id)}>
              {v.name}
            </button>
          ))}
        </div>
        <p className="muted" style={{ margin: "4px 0" }}>קראו את ההברות מימין לשמאל. אפשר ללחוץ על הברה כדי לשמוע.</p>
        <div className="syllable-train">
          {train.map((s, i) => (
            <button key={i} className={i === lit ? "lit" : ""} onClick={() => speak(s, 0.7)}>{s}</button>
          ))}
        </div>
        <div className="row" style={{ justifyContent: "center" }}>
          <button className="btn btn-teal" onClick={readTrain}>🔊 הַקְרֵא לִי</button>
          <button className="btn" onClick={() => setTrain(makeTrain(trainVowels))}>🔀 רַכֶּבֶת חֲדָשָׁה</button>
        </div>
      </div>
    </>
  );
}
