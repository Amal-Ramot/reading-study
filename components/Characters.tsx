// דמויות מקוריות של "אי הקוראים" – מצוירות ב-SVG עם הצללה, נפח וברק (מראה תלת-ממדי)
import { useId, type CSSProperties } from "react";

export type CharacterId = "crab" | "octopus" | "puffer" | "turtle";
export type Mood = "happy" | "cheer";

type Props = { mood?: Mood; size?: number; style?: CSSProperties; className?: string };

export const CHARACTERS: Record<CharacterId, { name: string; color: string; role: string }> = {
  crab: { name: "פִּינְצִ'י הַסַּרְטָן", color: "#ff6b4a", role: "אוֹתִיּוֹת" },
  octopus: { name: "תּוּמִי הַתְּמָנוּן", color: "#8b5cf6", role: "נִקּוּד" },
  puffer: { name: "בּוּעִי הַדָּג", color: "#f5b400", role: "מִלִּים וּמִשְׂחָקִים" },
  turtle: { name: "צְבִי הַצָּב", color: "#22a55b", role: "סִפּוּרִים" },
};

/* ---------- אבני בניין משותפות: הצללה, נפח, עיניים מבריקות ---------- */

function Defs({ p, light, base, dark, iris }: { p: string; light: string; base: string; dark: string; iris: [string, string] }) {
  return (
    <defs>
      <radialGradient id={`${p}b`} cx=".34" cy=".26" r=".85">
        <stop offset="0" stopColor={light} />
        <stop offset=".5" stopColor={base} />
        <stop offset="1" stopColor={dark} />
      </radialGradient>
      <linearGradient id={`${p}l`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={base} />
        <stop offset="1" stopColor={dark} />
      </linearGradient>
      <radialGradient id={`${p}e`} cx=".4" cy=".35" r=".75">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset=".7" stopColor="#f1f4f8" />
        <stop offset="1" stopColor="#b9c3d1" />
      </radialGradient>
      <radialGradient id={`${p}i`} cx=".5" cy=".6" r=".6">
        <stop offset="0" stopColor={iris[0]} />
        <stop offset="1" stopColor={iris[1]} />
      </radialGradient>
      <linearGradient id={`${p}g`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".75" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <filter id={`${p}s`} x="-30%" y="-80%" width="160%" height="260%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id={`${p}f`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.6" />
      </filter>
    </defs>
  );
}

function Ground({ p, cx = 60, y = 108, rx = 40 }: { p: string; cx?: number; y?: number; rx?: number }) {
  return <ellipse cx={cx} cy={y} rx={rx} ry={5} fill="#1b2a41" opacity=".28" filter={`url(#${p}s)`} />;
}

function Eye({ p, cx, cy, r, lid, mood }: { p: string; cx: number; cy: number; r: number; lid: string; mood: Mood }) {
  const big = mood === "cheer" ? 1.08 : 1;
  return (
    <g>
      <circle cx={cx} cy={cy + r * 0.12} r={r * 1.05} fill="#000" opacity=".18" filter={`url(#${p}f)`} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${p}e)`} />
      <circle cx={cx - r * 0.08} cy={cy + r * 0.06} r={r * 0.62 * big} fill={`url(#${p}i)`} />
      <circle cx={cx - r * 0.08} cy={cy + r * 0.06} r={r * 0.62 * big} fill="none" stroke="#000" strokeOpacity=".35" strokeWidth={r * 0.08} />
      <circle cx={cx - r * 0.08} cy={cy + r * 0.06} r={r * 0.32 * big} fill="#0b0d14" />
      <circle cx={cx - r * 0.32} cy={cy - r * 0.26} r={r * 0.2} fill="#fff" />
      <circle cx={cx + r * 0.2} cy={cy + r * 0.3} r={r * 0.09} fill="#fff" opacity=".75" />
      {mood === "happy" && (
        <path d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} Q${cx} ${cy - r * 0.75} ${cx - r} ${cy}Z`} fill={lid} />
      )}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#000" strokeOpacity=".3" strokeWidth=".8" />
    </g>
  );
}

function Mouth({ cx, y, w = 12, mood, line }: { cx: number; y: number; w?: number; mood: Mood; line: string }) {
  if (mood === "cheer") {
    return (
      <g>
        <path d={`M${cx - w} ${y} Q${cx} ${y + w * 0.35} ${cx + w} ${y} Q${cx} ${y + w * 1.7} ${cx - w} ${y}Z`} fill="#4a1020" stroke={line} strokeWidth="1.2" strokeLinejoin="round" />
        <ellipse cx={cx} cy={y + w * 0.7} rx={w * 0.42} ry={w * 0.2} fill="#ff7d8e" />
      </g>
    );
  }
  return (
    <g fill="none" strokeLinecap="round">
      <path d={`M${cx - w * 0.85} ${y} Q${cx} ${y + w * 0.85} ${cx + w * 0.85} ${y}`} stroke={line} strokeWidth="2.4" />
      <path d={`M${cx - w * 0.5} ${y + w * 0.5} Q${cx} ${y + w * 0.75} ${cx + w * 0.5} ${y + w * 0.5}`} stroke="#fff" strokeOpacity=".35" strokeWidth="1" />
    </g>
  );
}

const uid = (raw: string) => raw.replace(/[^a-zA-Z0-9]/g, "");

export function Crab({ mood = "happy", size = 120, style, className }: Props) {
  const p = "c" + uid(useId());
  const up = mood === "cheer";
  const claw = "M0 4 C-10 -8 -2 -24 12 -22 C22 -20 26 -10 22 -2 L10 -8 L16 4 C10 10 4 10 0 4Z";
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={style} className={className} aria-hidden>
      <Defs p={p} light="#ffb199" base="#f0502f" dark="#9c1f10" iris={["#f7b23b", "#7a3b05"]} />
      <Ground p={p} />
      {/* רגליים – מפרקים עם ברק */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path d={`M30 ${82 + i * 6} l-10 ${2 + i * 2} l-6 ${10 + i}`} stroke="#9c1f10" strokeWidth="5" />
            <path d={`M90 ${82 + i * 6} l10 ${2 + i * 2} l6 ${10 + i}`} stroke="#9c1f10" strokeWidth="5" />
            <path d={`M29 ${81 + i * 6} l-9 ${2 + i * 2}`} stroke="#ff9d85" strokeWidth="1.4" />
            <path d={`M91 ${81 + i * 6} l9 ${2 + i * 2}`} stroke="#ff9d85" strokeWidth="1.4" />
          </g>
        ))}
        {/* זרועות */}
        <path d={up ? "M30 74 Q12 58 17 34" : "M30 78 Q12 74 14 56"} stroke="#b82a16" strokeWidth="8" />
        <path d={up ? "M90 74 Q108 58 103 34" : "M90 78 Q108 74 106 56"} stroke="#b82a16" strokeWidth="8" />
        <path d={up ? "M27 70 Q14 56 17 38" : "M27 76 Q15 72 15 60"} stroke="#ff9d85" strokeWidth="1.6" />
      </g>
      {/* צבתות */}
      <g transform={up ? "translate(8 34)" : "translate(5 56)"}>
        <path d={claw} fill={`url(#${p}b)`} stroke="#7a1509" strokeWidth=".8" />
        <path d="M2 -10 C4 -18 10 -19 14 -18" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <g transform={up ? "translate(112 34) scale(-1 1)" : "translate(115 56) scale(-1 1)"}>
        <path d={claw} fill={`url(#${p}b)`} stroke="#7a1509" strokeWidth=".8" />
        <path d="M2 -10 C4 -18 10 -19 14 -18" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      {/* גבעולי עיניים */}
      <path d="M48 64 L45 44 M72 64 L75 44" stroke={`url(#${p}l)`} strokeWidth="5" strokeLinecap="round" />
      {/* שריון */}
      <path d="M24 80 C24 60 42 56 60 56 C78 56 96 60 96 80 C96 96 80 102 60 102 C40 102 24 96 24 80Z" fill={`url(#${p}b)`} stroke="#7a1509" strokeWidth=".8" />
      <path d="M32 72 C38 62 50 60 60 60 C70 60 82 62 88 72 C76 66 44 66 32 72Z" fill={`url(#${p}g)`} opacity=".8" />
      <g fill="#7a1509" opacity=".35">
        <circle cx="40" cy="78" r="1.6" /><circle cx="47" cy="72" r="1.2" /><circle cx="80" cy="78" r="1.6" /><circle cx="73" cy="72" r="1.2" /><circle cx="60" cy="68" r="1.4" /><circle cx="54" cy="96" r="1.1" /><circle cx="68" cy="95" r="1.1" />
      </g>
      <path d="M30 88 Q60 100 90 88" fill="none" stroke="#7a1509" strokeOpacity=".35" strokeWidth="1.2" />
      <Eye p={p} cx={45} cy={38} r={9.5} lid="#e04a2b" mood={mood} />
      <Eye p={p} cx={75} cy={38} r={9.5} lid="#e04a2b" mood={mood} />
      <Mouth cx={60} y={82} w={10} mood={mood} line="#6b1208" />
    </svg>
  );
}

export function Octopus({ mood = "happy", size = 120, style, className }: Props) {
  const p = "o" + uid(useId());
  const up = mood === "cheer";
  const tentacles = [22, 38, 54, 66, 82, 98];
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={style} className={className} aria-hidden>
      <Defs p={p} light="#d4c2ff" base="#8454e8" dark="#3f1f8f" iris={["#58d6c9", "#0d5e63"]} />
      <Ground p={p} rx={44} y={110} />
      {tentacles.map((x, i) => {
        const dir = x < 60 ? -1 : 1;
        const lift = up && (i === 0 || i === 5) ? -40 : 0;
        const tx = x + dir * 14, ty = 108 + lift;
        return (
          <g key={x}>
            <path d={`M${x - 7} 68 C${x - 9} 92 ${x + dir * 9} ${100 + lift} ${tx} ${ty} C${x + dir * 6} ${105 + lift} ${x + 5} 92 ${x + 8} 68 Z`} fill={`url(#${p}l)`} stroke="#2e1570" strokeWidth=".8" />
            {/* כפתורי יניקה */}
            {[0.35, 0.55, 0.75].map((t) => (
              <circle key={t} cx={x + dir * 9 * t * t + 1} cy={70 + (30 + lift) * t} r={2 - t} fill="#f3d9ff" opacity=".8" />
            ))}
          </g>
        );
      })}
      {/* ראש */}
      <path d="M24 52 C24 28 40 14 60 14 C80 14 96 28 96 52 C96 70 84 82 60 82 C36 82 24 70 24 52Z" fill={`url(#${p}b)`} stroke="#2e1570" strokeWidth=".8" />
      <g fill="#3f1f8f" opacity=".3">
        <circle cx="78" cy="26" r="3" /><circle cx="86" cy="36" r="2" /><circle cx="70" cy="20" r="1.6" /><circle cx="34" cy="60" r="1.8" /><circle cx="88" cy="60" r="2.2" />
      </g>
      <ellipse cx="46" cy="26" rx="13" ry="6" fill={`url(#${p}g)`} transform="rotate(-24 46 26)" />
      {/* בנדנה */}
      <path d="M26 40 Q60 22 94 40 L95 47 Q60 30 25 47 Z" fill="#f6b21a" stroke="#a36a00" strokeWidth=".8" />
      <path d="M30 41 Q60 26 90 41" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.2" />
      <path d="M94 42 l10 -4 l-3 8 l7 5 l-12 -2Z" fill="#e09a00" stroke="#a36a00" strokeWidth=".8" />
      <Eye p={p} cx={46} cy={56} r={10} lid="#7a4be0" mood={mood} />
      <Eye p={p} cx={74} cy={56} r={10} lid="#7a4be0" mood={mood} />
      <ellipse cx="34" cy="68" rx="5" ry="3" fill="#ff7fa8" opacity=".45" filter={`url(#${p}f)`} />
      <ellipse cx="86" cy="68" rx="5" ry="3" fill="#ff7fa8" opacity=".45" filter={`url(#${p}f)`} />
      <Mouth cx={60} y={69} w={9} mood={mood} line="#2e1570" />
    </svg>
  );
}

export function Puffer({ mood = "happy", size = 120, style, className }: Props) {
  const p = "p" + uid(useId());
  const spikes = Array.from({ length: 18 }, (_, i) => (i / 18) * Math.PI * 2);
  const f = (n: number) => n.toFixed(2);
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={style} className={className} aria-hidden>
      <Defs p={p} light="#fff0a8" base="#f2b01e" dark="#9a5a06" iris={["#6fc3ff", "#134a8e"]} />
      <radialGradient id={`${p}belly`} cx=".5" cy=".3" r=".8">
        <stop offset="0" stopColor="#fffdf2" /><stop offset="1" stopColor="#e9d9a8" />
      </radialGradient>
      <Ground p={p} cx={58} y={110} rx={34} />
      {/* זנב שקוף למחצה עם קרני סנפיר */}
      <g>
        <path d="M90 60 C100 50 108 44 116 42 C110 54 110 66 116 78 C108 76 100 70 90 60Z" fill="#f7c948" opacity=".85" stroke="#9a5a06" strokeWidth=".8" />
        <path d="M94 60 L112 46 M95 60 L111 58 M94 60 L112 74" stroke="#9a5a06" strokeOpacity=".5" strokeWidth=".8" />
      </g>
      {/* קוצים */}
      <g fill="#fff3c4" stroke="#b9861a" strokeWidth=".7" strokeLinejoin="round">
        {spikes.map((a, i) => {
          const c = Math.cos(a), s = Math.sin(a), px = -s * 3.2, py = c * 3.2;
          return <path key={i} d={`M${f(56 + c * 36 + px)} ${f(60 + s * 36 + py)} L${f(56 + c * 46)} ${f(60 + s * 46)} L${f(56 + c * 36 - px)} ${f(60 + s * 36 - py)} Z`} />;
        })}
      </g>
      <circle cx="56" cy="60" r="38" fill={`url(#${p}b)`} stroke="#7d4a05" strokeWidth=".8" />
      {/* בטן בהירה */}
      <path d="M21 70 Q56 86 91 70 A38 38 0 0 1 21 70Z" fill={`url(#${p}belly)`} opacity=".95" />
      {/* כתמים על הגב */}
      <g fill="#8a4f05" opacity=".38">
        <circle cx="62" cy="30" r="3.4" /><circle cx="76" cy="38" r="2.6" /><circle cx="48" cy="28" r="2.2" /><circle cx="84" cy="50" r="2.4" /><circle cx="70" cy="46" r="1.6" /><circle cx="36" cy="34" r="1.8" />
      </g>
      {/* קוצים קטנים על הגוף */}
      <g fill="#fff6d6" opacity=".9">
        {[[40, 76], [56, 82], [72, 76], [30, 62], [84, 62], [50, 70], [64, 70]].map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x - 1.6} ${y} L${x} ${y - 4} L${x + 1.6} ${y}Z`} />
        ))}
      </g>
      <ellipse cx="40" cy="36" rx="14" ry="7" fill={`url(#${p}g)`} transform="rotate(-30 40 36)" />
      {/* סנפיר */}
      <g>
        <path d={mood === "cheer" ? "M76 66 C86 48 96 50 98 58 C92 64 84 66 76 66Z" : "M76 68 C88 68 94 76 94 86 C84 84 78 78 76 68Z"} fill="#f7a81c" opacity=".88" stroke="#9a5a06" strokeWidth=".8" />
      </g>
      <Eye p={p} cx={41} cy={52} r={10.5} lid="#eaa51a" mood={mood} />
      <Eye p={p} cx={66} cy={52} r={10.5} lid="#eaa51a" mood={mood} />
      <ellipse cx="30" cy="68" rx="5" ry="3" fill="#ff7f7f" opacity=".4" filter={`url(#${p}f)`} />
      {mood === "cheer" ? (
        <Mouth cx={53} y={70} w={9} mood="cheer" line="#7d4a05" />
      ) : (
        <g>
          <ellipse cx="53" cy="74" rx="6.5" ry="5.5" fill="#f7b9a0" stroke="#7d4a05" strokeWidth=".8" />
          <ellipse cx="53" cy="74.5" rx="3.6" ry="3" fill="#4a1020" />
        </g>
      )}
    </svg>
  );
}

export function Turtle({ mood = "happy", size = 120, style, className }: Props) {
  const p = "t" + uid(useId());
  const up = mood === "cheer";
  const hy = up ? -12 : 0;
  const skin = `url(#${p}skin)`;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={style} className={className} aria-hidden>
      <Defs p={p} light="#8fe0a0" base="#23934f" dark="#0b4a26" iris={["#c98a3a", "#5a2f0a"]} />
      <radialGradient id={`${p}skin`} cx=".35" cy=".28" r=".85">
        <stop offset="0" stopColor="#e3f2b4" /><stop offset=".55" stopColor="#a9cf78" /><stop offset="1" stopColor="#5d8a3c" />
      </radialGradient>
      <Ground p={p} cx={58} y={106} rx={46} />
      {/* זנב ורגליים */}
      <path d="M14 88 l-9 5 l10 2Z" fill={skin} stroke="#47692c" strokeWidth=".8" />
      <g fill={skin} stroke="#47692c" strokeWidth=".8">
        <path d="M22 90 h20 q2 12 -10 13 q-12 0 -10 -13Z" />
        <path d="M70 90 h20 q2 12 -10 13 q-12 0 -10 -13Z" />
        <path d={up ? "M24 70 C10 60 8 46 12 42 C22 46 28 56 32 66Z" : "M24 82 C10 86 4 80 4 74 C12 70 20 72 28 76Z"} />
      </g>
      <g fill="#47692c" opacity=".4">
        <circle cx="28" cy="97" r="1.3" /><circle cx="35" cy="99" r="1.1" /><circle cx="76" cy="97" r="1.3" /><circle cx="84" cy="99" r="1.1" />
      </g>
      {/* צוואר וראש */}
      <g transform={`translate(0 ${hy})`}>
        <path d="M84 74 C84 60 90 54 98 54 L104 76 C98 84 88 84 84 74Z" fill={skin} />
        <path d="M78 56 C78 44 87 37 98 37 C110 37 117 46 117 57 C117 69 109 76 98 76 C86 76 78 68 78 56Z" fill={skin} stroke="#47692c" strokeWidth=".8" />
        <g fill="#47692c" opacity=".35">
          <circle cx="86" cy="46" r="1.6" /><circle cx="92" cy="41" r="1.2" /><circle cx="84" cy="62" r="1.3" /><circle cx="110" cy="44" r="1.2" />
        </g>
        <ellipse cx="92" cy="43" rx="7" ry="3" fill={`url(#${p}g)`} transform="rotate(-20 92 43)" />
      </g>
      {/* שריון: שוליים, כיפה ולוחות */}
      <path d="M10 90 Q10 86 14 84 L98 84 Q102 86 102 90 Q102 94 96 94 L16 94 Q10 94 10 90Z" fill="#c9a86a" stroke="#6e5626" strokeWidth=".8" />
      <path d="M14 86 Q16 42 56 40 Q96 42 98 86 Z" fill={`url(#${p}b)`} stroke="#0b4a26" strokeWidth=".8" />
      <g stroke="#0b4a26" strokeOpacity=".55" strokeWidth="1.2" strokeLinejoin="round">
        <path d="M43 54 l13 -6 l13 6 l0 15 l-13 6 l-13 -6 z" fill="#37ad62" fillOpacity=".55" />
        <path d="M43 54 L27 62 L22 84 L34 86 L43 69Z" fill="#1c7f43" fillOpacity=".45" />
        <path d="M69 54 L85 62 L90 84 L78 86 L69 69Z" fill="#0f5e30" fillOpacity=".45" />
        <path d="M43 69 L34 86 L56 86 L56 75Z" fill="#23934f" fillOpacity=".4" />
        <path d="M69 69 L78 86 L56 86 L56 75Z" fill="#0f5e30" fillOpacity=".4" />
        <path d="M43 54 L36 46 M69 54 L76 46 M56 48 L56 41" fill="none" />
      </g>
      <path d="M24 66 Q30 46 54 43 Q36 50 30 68Z" fill="#fff" opacity=".35" />
      {/* פנים ומשקפיים – הצב אוהב לקרוא */}
      <g transform={`translate(0 ${hy})`}>
        <Eye p={p} cx={91} cy={54} r={6.6} lid="#a9cf78" mood={mood} />
        <Eye p={p} cx={107} cy={54} r={6.6} lid="#a9cf78" mood={mood} />
        <g fill="#bfe6ff" fillOpacity=".18" stroke="#3a2a1a" strokeWidth="1.8">
          <circle cx="91" cy="54" r="8.6" />
          <circle cx="107" cy="54" r="8.6" />
        </g>
        <path d="M82.5 52 L78 50" stroke="#3a2a1a" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M85 49 q3 -4 8 -3 M101 49 q3 -4 8 -3" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1" strokeLinecap="round" />
        <Mouth cx={100} y={66} w={6.5} mood={mood} line="#3d5a24" />
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
