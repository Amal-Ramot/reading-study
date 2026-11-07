"use client";

import { useEffect, useState } from "react";
import { Character, CharacterId } from "./Characters";

const BITS = ["⭐", "🫧", "🐚", "🌟", "✨"];
const CHEERS = ["כָּל הַכָּבוֹד!", "יוֹפִי!", "מְצֻיָּן!", "אַלּוּף!"];
const WHO: CharacterId[] = ["crab", "octopus", "puffer", "turtle"];

/** חגיגה קטנה: בועות וכוכבים, ודמות קופצת מהגלים */
export function Celebration({ trigger }: { trigger: number }) {
  const [items, setItems] = useState<{ id: number; x: number; e: string; d: number }[]>([]);
  const [hero, setHero] = useState<{ who: CharacterId; text: string; key: number } | null>(null);
  useEffect(() => {
    if (!trigger) return;
    setItems(
      Array.from({ length: 14 }, (_, i) => ({
        id: trigger * 100 + i,
        x: Math.random() * 100,
        e: BITS[i % BITS.length],
        d: Math.random() * 0.4,
      })),
    );
    setHero({ who: WHO[trigger % WHO.length], text: CHEERS[trigger % CHEERS.length], key: trigger });
    const t = setTimeout(() => { setItems([]); setHero(null); }, 1600);
    return () => clearTimeout(t);
  }, [trigger]);
  return (
    <div className="celebration" aria-hidden>
      {items.map((it) => (
        <span key={it.id} style={{ left: `${it.x}%`, animationDelay: `${it.d}s` }}>{it.e}</span>
      ))}
      {hero && (
        <div className="cheer-hero" key={hero.key}>
          <div className="bubble read">{hero.text}</div>
          <Character id={hero.who} mood="cheer" size={150} />
        </div>
      )}
    </div>
  );
}
