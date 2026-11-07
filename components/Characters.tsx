// דמויות מקוריות של "אי הקוראים" – מצוירות ב-SVG
import type { CSSProperties } from "react";

export type CharacterId = "crab" | "octopus" | "puffer" | "turtle";
export type Mood = "happy" | "cheer";

type Props = { mood?: Mood; size?: number; style?: CSSProperties; className?: string };

export const CHARACTERS: Record<CharacterId, { name: string; color: string; role: string }> = {
  crab: { name: "פִּינְצִ'י הַסַּרְטָן", color: "#ff6b4a", role: "אוֹתִיּוֹת" },
  octopus: { name: "תּוּמִי הַתְּמָנוּן", color: "#8b5cf6", role: "נִקּוּד" },
  puffer: { name: "בּוּעִי הַדָּג", color: "#f5b400", role: "מִלִּים וּמִשְׂחָקִים" },
  turtle: { name: "צְבִי הַצָּב", color: "#22a55b", role: "סִפּוּרִים" },
};

function Eyes({ x1, x2, y, r = 9, mood }: { x1: number; x2: number; y: number; r?: number; mood: Mood }) {
  if (mood === "cheer") {
    // עיניים שמחות – קשתות
    return (
      <g fill="none" stroke="#2b2d42" strokeWidth="3.5" strokeLinecap="round">
        <path d={`M${x1 - r * 0.7} ${y + 2} q${r * 0.7} ${-r} ${r * 1.4} 0`} />
        <path d={`M${x2 - r * 0.7} ${y + 2} q${r * 0.7} ${-r} ${r * 1.4} 0`} />
      </g>
    );
  }
  return (
    <g>
      <circle cx={x1} cy={y} r={r} fill="white" stroke="#2b2d42" strokeWidth="2.5" />
      <circle cx={x2} cy={y} r={r} fill="white" stroke="#2b2d42" strokeWidth="2.5" />
      <circle cx={x1 - 1.5} cy={y + 1} r={r * 0.48} fill="#2b2d42" />
      <circle cx={x2 - 1.5} cy={y + 1} r={r * 0.48} fill="#2b2d42" />
      <circle cx={x1 - 3} cy={y - 2} r={r * 0.18} fill="white" />
      <circle cx={x2 - 3} cy={y - 2} r={r * 0.18} fill="white" />
    </g>
  );
}

function Mouth({ cx, y, w = 14, mood }: { cx: number; y: number; w?: number; mood: Mood }) {
  return mood === "cheer" ? (
    <path d={`M${cx - w} ${y} q${w} ${w * 1.3} ${w * 2} 0 z`} fill="#7a2335" stroke="#2b2d42" strokeWidth="2.5" strokeLinejoin="round" />
  ) : (
    <path d={`M${cx - w * 0.8} ${y} q${w * 0.8} ${w * 0.8} ${w * 1.6} 0`} fill="none" stroke="#2b2d42" strokeWidth="3" strokeLinecap="round" />
  );
}

export function Crab({ mood = "happy", size = 120, style, className }: Props) {
  const up = mood === "cheer";
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={style} className={className} aria-hidden>
      <g stroke="#2b2d42" strokeWidth="2.5" strokeLinecap="round">
        {/* רגליים */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path d={`M30 ${84 + i * 6} l-14 ${6 + i * 3}`} />
            <path d={`M90 ${84 + i * 6} l14 ${6 + i * 3}`} />
          </g>
        ))}
        {/* זרועות וצבתות */}
        <path d={up ? "M30 72 Q14 54 16 32" : "M30 76 Q14 70 14 54"} fill="none" stroke="#e5482b" strokeWidth="7" />
        <path d={up ? "M90 72 Q106 54 104 32" : "M90 76 Q106 70 106 54"} fill="none" stroke="#e5482b" strokeWidth="7" />
        <g transform={up ? "translate(16 26)" : "translate(14 46)"}>
          <path d="M0 0 a13 13 0 1 1 6 12 l-6 -12 l10 -4" fill="#ff6b4a" />
        </g>
        <g transform={up ? "translate(104 26) scale(-1 1)" : "translate(106 46) scale(-1 1)"}>
          <path d="M0 0 a13 13 0 1 1 6 12 l-6 -12 l10 -4" fill="#ff6b4a" />
        </g>
        {/* גבעולי עיניים */}
        <path d="M48 62 L44 40 M72 62 L76 40" />
      </g>
      <ellipse cx="60" cy="80" rx="36" ry="22" fill="#ff6b4a" stroke="#2b2d42" strokeWidth="2.5" />
      <ellipse cx="60" cy="74" rx="22" ry="8" fill="#ff8f75" opacity=".7" />
      <Eyes x1={44} x2={76} y={36} r={9} mood={mood} />
      <circle cx="40" cy="86" r="5" fill="#ff9aa2" opacity=".8" />
      <circle cx="80" cy="86" r="5" fill="#ff9aa2" opacity=".8" />
      <Mouth cx={60} y={84} w={11} mood={mood} />
    </svg>
  );
}

export function Octopus({ mood = "happy", size = 120, style, className }: Props) {
  const up = mood === "cheer";
  const tentacles = [22, 38, 54, 66, 82, 98];
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={style} className={className} aria-hidden>
      <g fill="#8b5cf6" stroke="#2b2d42" strokeWidth="2.5" strokeLinejoin="round">
        {tentacles.map((x, i) => {
          const dir = x < 60 ? -1 : 1;
          const lift = up && (i === 0 || i === 5) ? -38 : 0;
          return (
            <path
              key={x}
              d={`M${x - 6} 70 C${x - 8} 92 ${x + dir * 10} ${100 + lift} ${x + dir * 14} ${108 + lift} C${x + dir * 6} ${104 + lift} ${x + 4} 92 ${x + 8} 70 Z`}
            />
          );
        })}
        <ellipse cx="60" cy="50" rx="36" ry="34" />
      </g>
      {/* בנדנה */}
      <path d="M26 38 Q60 18 94 38 L94 44 Q60 26 26 44 Z" fill="#ffc83d" stroke="#2b2d42" strokeWidth="2.5" />
      <circle cx="96" cy="42" r="5" fill="#ffc83d" stroke="#2b2d42" strokeWidth="2.5" />
      <ellipse cx="46" cy="28" rx="8" ry="4" fill="white" opacity=".35" />
      <Eyes x1={46} x2={74} y={54} r={9} mood={mood} />
      <circle cx="38" cy="68" r="5" fill="#ff9aa2" opacity=".8" />
      <circle cx="82" cy="68" r="5" fill="#ff9aa2" opacity=".8" />
      <Mouth cx={60} y={68} w={10} mood={mood} />
    </svg>
  );
}

export function Puffer({ mood = "happy", size = 120, style, className }: Props) {
  const spikes = Array.from({ length: 14 }, (_, i) => (i / 14) * Math.PI * 2);
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={style} className={className} aria-hidden>
      {/* זנב */}
      <path d="M92 60 L114 44 Q108 60 114 76 Z" fill="#ffd166" stroke="#2b2d42" strokeWidth="2.5" strokeLinejoin="round" />
      <g fill="#ffd166" stroke="#2b2d42" strokeWidth="2" strokeLinejoin="round">
        {spikes.map((a, i) => {
          const x = 56 + Math.cos(a) * 38, y = 60 + Math.sin(a) * 38;
          const x2 = 56 + Math.cos(a) * 47, y2 = 60 + Math.sin(a) * 47;
          const px = Math.cos(a + Math.PI / 2) * 4, py = Math.sin(a + Math.PI / 2) * 4;
          return <path key={i} d={`M${x + px} ${y + py} L${x2} ${y2} L${x - px} ${y - py} Z`} />;
        })}
      </g>
      <circle cx="56" cy="60" r="38" fill="#ffc83d" stroke="#2b2d42" strokeWidth="2.5" />
      <path d="M26 72 Q56 100 86 72 Q56 90 26 72" fill="#fff1c9" />
      <ellipse cx="40" cy="38" rx="9" ry="5" fill="white" opacity=".5" />
      {/* סנפיר */}
      <path d={mood === "cheer" ? "M74 66 q16 -20 22 -8 q-8 6 -22 8" : "M74 70 q16 4 18 14 q-12 0 -18 -14"} fill="#ffb020" stroke="#2b2d42" strokeWidth="2.5" />
      <Eyes x1={42} x2={66} y={52} r={10} mood={mood} />
      <circle cx="34" cy="68" r="5" fill="#ff9aa2" opacity=".8" />
      {mood === "cheer" ? (
        <Mouth cx={54} y={72} w={9} mood="cheer" />
      ) : (
        <ellipse cx="54" cy="76" rx="5" ry="6" fill="#7a2335" stroke="#2b2d42" strokeWidth="2.5" />
      )}
    </svg>
  );
}

export function Turtle({ mood = "happy", size = 120, style, className }: Props) {
  const up = mood === "cheer";
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={style} className={className} aria-hidden>
      <g fill="#8fd694" stroke="#2b2d42" strokeWidth="2.5">
        {/* רגליים */}
        <ellipse cx="32" cy="96" rx="10" ry="8" />
        <ellipse cx="80" cy="96" rx="10" ry="8" />
        <path d={up ? "M22 70 q-14 -10 -10 -26 q10 4 16 18" : "M22 82 q-14 2 -16 -6 q8 -6 18 -2"} />
        {/* ראש */}
        <circle cx="96" cy={up ? 46 : 58} r="20" />
      </g>
      {/* שריון */}
      <path d="M14 90 Q14 44 56 42 Q98 44 98 90 Z" fill="#22a55b" stroke="#2b2d42" strokeWidth="2.5" strokeLinejoin="round" />
      <g fill="none" stroke="#167a42" strokeWidth="2.5">
        <path d="M42 54 l14 -6 l14 6 l0 16 l-14 6 l-14 -6 z" />
        <path d="M42 54 L28 64 M70 54 L84 64 M42 70 L30 86 M70 70 L82 86 M56 76 L56 90" />
      </g>
      <path d="M12 90 H100" stroke="#2b2d42" strokeWidth="2.5" strokeLinecap="round" />
      {/* משקפיים – הצב אוהב לקרוא */}
      <g transform={`translate(0 ${up ? -12 : 0})`}>
        <Eyes x1={90} x2={106} y={54} r={6.5} mood={mood} />
        <g fill="none" stroke="#2b2d42" strokeWidth="2">
          <circle cx="90" cy="54" r="9" />
          <circle cx="106" cy="54" r="9" />
          <path d="M99 54 h-0" />
        </g>
        <Mouth cx={98} y={66} w={7} mood={mood} />
      </g>
    </svg>
  );
}

export function Character({ id, ...rest }: Props & { id: CharacterId }) {
  if (id === "crab") return <Crab {...rest} />;
  if (id === "octopus") return <Octopus {...rest} />;
  if (id === "puffer") return <Puffer {...rest} />;
  return <Turtle {...rest} />;
}

/** כותרת עמוד עם דמות מדריכה ובועת דיבור */
export function PageHeader({ who, title, children }: { who: CharacterId; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="page-header">
      <div className="guide-char bob">
        <Character id={who} size={124} />
        <span className="guide-name read">{CHARACTERS[who].name}</span>
      </div>
      <div className="guide-text">
        <h1 className="page-title read">{title}</h1>
        {children && <div className="bubble">{children}</div>}
      </div>
    </div>
  );
}
