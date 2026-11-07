"use client";

import { useEffect, useState } from "react";

const BITS = ["⭐", "🎉", "✨", "🌟", "🎈"];

/** פרץ של כוכבים קטן בכל פעם ש-trigger משתנה */
export function Celebration({ trigger }: { trigger: number }) {
  const [items, setItems] = useState<{ id: number; x: number; e: string; d: number }[]>([]);
  useEffect(() => {
    if (!trigger) return;
    const batch = Array.from({ length: 14 }, (_, i) => ({
      id: trigger * 100 + i,
      x: Math.random() * 100,
      e: BITS[i % BITS.length],
      d: Math.random() * 0.4,
    }));
    setItems(batch);
    const t = setTimeout(() => setItems([]), 1600);
    return () => clearTimeout(t);
  }, [trigger]);
  return (
    <div className="celebration" aria-hidden>
      {items.map((it) => (
        <span key={it.id} style={{ left: `${it.x}%`, animationDelay: `${it.d}s` }}>
          {it.e}
        </span>
      ))}
    </div>
  );
}
