import Link from "next/link";
import { CHARACTERS, Character, CharacterId } from "@/components/Characters";

const PATH: { href: string; who: CharacterId; title: string; desc: string; bg: string }[] = [
  { href: "/letters", who: "crab", title: "אוֹתִיּוֹת", desc: "פינצ'י הסרטן מכיר את כל 22 האותיות", bg: "var(--c-coral-soft)" },
  { href: "/nikud", who: "octopus", title: "מַסְלוּל נִקּוּד", desc: "תומי התמנון מלמד צליל אחד בכל פעם", bg: "var(--c-purple-soft)" },
  { href: "/words", who: "puffer", title: "מִלִּים", desc: "בועי הדג קורא הברה אחר הברה", bg: "var(--c-yellow-soft)" },
  { href: "/stories", who: "turtle", title: "סִפּוּרִים", desc: "צבי הצב קורא לאט ובכיף", bg: "var(--c-green-soft)" },
  { href: "/game", who: "puffer", title: "מִשְׂחָק", desc: "מתאימים תמונה למילה ומוצאים אותיות", bg: "var(--c-teal-soft)" },
  { href: "/check", who: "octopus", title: "בְּדִיקַת קְרִיאָה", desc: "קוראים בקול – והמחשב בודק", bg: "#ffe3f0" },
];

function IslandScene() {
  const frond = (rot: number, len: number, droop: number, key: string) => (
    <g key={key} transform={`translate(252 92) rotate(${rot})`}>
      <path d={`M0 0 Q${len * 0.5} ${-18 - droop} ${len} ${droop} Q${len * 0.5} ${-2 - droop * 0.4} 0 6Z`} fill="url(#is-leaf)" stroke="#0d5a2c" strokeWidth=".8" />
      <path d={`M0 2 Q${len * 0.5} ${-11 - droop * 0.7} ${len} ${droop}`} fill="none" stroke="#b9f0a8" strokeOpacity=".55" strokeWidth="1.2" />
      {Array.from({ length: 7 }, (_, i) => {
        const t = (i + 1) / 8, x = len * t, y = (-11 - droop * 0.7) * 2 * t * (1 - t) + droop * t * t + 2 * (1 - t);
        return <path key={i} d={`M${x} ${y} l${6} ${7 + i}`} stroke="#0d5a2c" strokeOpacity=".35" strokeWidth="1" />;
      })}
    </g>
  );
  return (
    <div className="island" aria-hidden>
      <svg viewBox="0 0 400 300" className="scene">
        <defs>
          <linearGradient id="is-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7fe3ee" /><stop offset=".35" stopColor="#25b3d6" /><stop offset="1" stopColor="#0b5f9e" />
          </linearGradient>
          <radialGradient id="is-shallow" cx=".5" cy=".5" r=".5">
            <stop offset=".55" stopColor="#b8f5ee" stopOpacity=".95" /><stop offset=".8" stopColor="#6fe0e0" stopOpacity=".6" /><stop offset="1" stopColor="#25b3d6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="is-sand" cx=".42" cy=".3" r=".75">
            <stop offset="0" stopColor="#fff3cf" /><stop offset=".6" stopColor="#f3d290" /><stop offset="1" stopColor="#c99a55" />
          </radialGradient>
          <linearGradient id="is-trunk" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5c3716" /><stop offset=".45" stopColor="#b98250" /><stop offset="1" stopColor="#6b411c" />
          </linearGradient>
          <linearGradient id="is-leaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1f8f45" /><stop offset=".5" stopColor="#3fc46a" /><stop offset="1" stopColor="#0f6a33" />
          </linearGradient>
          <radialGradient id="is-coco" cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#b98250" /><stop offset="1" stopColor="#4a2a10" />
          </radialGradient>
          <filter id="is-blur"><feGaussianBlur stdDeviation="4" /></filter>
          <filter id="is-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="4" />
            <feColorMatrix values="0 0 0 0 .45  0 0 0 0 .3  0 0 0 0 .1  0 0 0 .5 -.12" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <clipPath id="is-clip"><rect x="0" y="0" width="400" height="300" rx="28" /></clipPath>
        </defs>
        <g clipPath="url(#is-clip)">
          {/* ים עם עומק ונצנוצים */}
          <path d="M0 196 Q100 186 200 194 T400 190 V300 H0Z" fill="url(#is-sea)" />
          <g stroke="#fff" strokeLinecap="round" opacity=".55">
            <path d="M24 262 q14 -5 28 0" strokeWidth="2" fill="none" /><path d="M318 268 q16 -5 32 0" strokeWidth="2" fill="none" />
            <path d="M70 284 q10 -4 20 0" strokeWidth="1.5" fill="none" /><path d="M250 284 q12 -4 24 0" strokeWidth="1.5" fill="none" />
            <path d="M350 214 q10 -3 20 0" strokeWidth="1.5" fill="none" /><path d="M20 216 q10 -3 20 0" strokeWidth="1.5" fill="none" />
          </g>
          {/* מים רדודים וקצף סביב האי */}
          <ellipse cx="200" cy="232" rx="188" ry="52" fill="url(#is-shallow)" />
          <ellipse cx="200" cy="236" rx="158" ry="36" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="3" strokeDasharray="40 9 22 7 60 12" />
          {/* חול */}
          <ellipse cx="200" cy="246" rx="150" ry="14" fill="#7a5a2a" opacity=".35" filter="url(#is-blur)" />
          <ellipse cx="200" cy="230" rx="150" ry="36" fill="url(#is-sand)" />
          <ellipse cx="200" cy="230" rx="150" ry="36" fill="#000" filter="url(#is-grain)" opacity=".5" />
          <ellipse cx="170" cy="218" rx="70" ry="10" fill="#fff" opacity=".28" filter="url(#is-blur)" />
          {/* צל הדקל */}
          <ellipse cx="286" cy="236" rx="46" ry="7" fill="#5a3b12" opacity=".3" filter="url(#is-blur)" />
          {/* גזע */}
          <path d="M224 226 Q224 160 246 94 L258 97 Q240 162 242 226Z" fill="url(#is-trunk)" />
          {Array.from({ length: 11 }, (_, i) => {
            const t = i / 11, y = 218 - t * 118, x = 224 + t * t * 22 + t * 2;
            return <path key={i} d={`M${x} ${y} q8 4 ${17 - t * 5} 0`} fill="none" stroke="#3d2209" strokeOpacity=".55" strokeWidth="1.4" />;
          })}
          {/* כפות דקל */}
          {frond(200, 92, 26, "a")}
          {frond(-20, 96, 26, "b")}
          {frond(232, 78, 10, "c")}
          {frond(-52, 80, 10, "d")}
          {frond(170, 70, 34, "e")}
          {frond(12, 72, 34, "f")}
          {frond(-88, 56, 4, "g")}
          <circle cx="246" cy="102" r="7.5" fill="url(#is-coco)" /><circle cx="258" cy="104" r="7.5" fill="url(#is-coco)" /><circle cx="252" cy="110" r="7" fill="url(#is-coco)" />
          {/* צדף וכוכב ים */}
          <g transform="translate(124 244)">
            <path d="M0 0 C-10 -14 10 -18 14 -6 C16 2 6 6 0 0Z" fill="#ffe3d3" stroke="#c98f7a" strokeWidth=".8" />
            <path d="M1 -1 L3 -13 M2 -1 L9 -11 M2 0 L13 -5" stroke="#c98f7a" strokeWidth=".8" />
          </g>
          <g transform="translate(306 242) rotate(12)">
            <path d="M0 -10 L3 -3 L10 -3 L4.5 1.5 L6.5 9 L0 4.5 L-6.5 9 L-4.5 1.5 L-10 -3 L-3 -3Z" fill="#ff8a5c" stroke="#b9471f" strokeWidth=".8" strokeLinejoin="round" />
            <circle cx="0" cy="0" r="1" fill="#ffd2b8" /><circle cx="0" cy="-5" r=".8" fill="#ffd2b8" /><circle cx="4" cy="-1" r=".8" fill="#ffd2b8" /><circle cx="-4" cy="-1" r=".8" fill="#ffd2b8" />
          </g>
        </g>
      </svg>
      <Character id="turtle" className="ch bob" size={110} style={{ left: "8%", top: "50%" }} />
      <Character id="crab" className="ch bob" size={96} style={{ left: "58%", top: "56%", animationDelay: ".4s" }} />
      <Character id="octopus" className="ch bob" size={100} style={{ left: "6%", top: "10%", animationDelay: ".8s" }} />
      <Character id="puffer" className="ch bob" size={90} style={{ left: "76%", top: "6%", animationDelay: "1.2s" }} />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <h1 className="read">בְּרוּכִים הַבָּאִים לְאִי הַקּוֹרְאִים! 🏝️</h1>
          <p>
            על האי גרים ארבעה חברים שאוהבים לקרוא. הם ילוו אתכם מאותיות, דרך ניקוד והברות, ועד מילים וסיפורים.
            בכל שלב אפשר להקשיב, לתרגל ולקרוא בקול.
          </p>
          <div className="row">
            <Link href="/nikud" className="btn btn-primary btn-lg">מַתְחִילִים ←</Link>
            <Link href="/check" className="btn btn-lg">🎤 בדיקת קריאה</Link>
          </div>
        </div>
        <IslandScene />
      </section>

      <h2 className="section-title read">לְאָן מַפְלִיגִים הַיּוֹם?</h2>
      <div className="tiles">
        {PATH.map((p, i) => (
          <Link key={p.href} href={p.href} className="tile" style={{ background: p.bg }}>
            <span className="tile-step">שלב {i + 1}</span>
            <div className="tile-char"><Character id={p.who} size={84} /></div>
            <h3 className="read">{p.title}</h3>
            <p>{p.desc}</p>
          </Link>
        ))}
      </div>

      <h2 className="section-title read">הַחֲבֵרִים מֵהָאִי</h2>
      <div className="cast">
        {(Object.keys(CHARACTERS) as CharacterId[]).map((id) => (
          <div key={id} className="cast-card">
            <Character id={id} mood="cheer" size={110} />
            <h3 className="read">{CHARACTERS[id].name}</h3>
            <p className="read">אַחְרָאִי עַל: {CHARACTERS[id].role}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">טִיפִּים לַהוֹרִים וְלַמּוֹרִים</h2>
      <div className="card">
        <ul style={{ margin: 0, paddingInlineStart: 22 }}>
          <li>מומלץ לתרגל 10–15 דקות ביום, ולעצור כשעדיין כיף.</li>
          <li>קוראים <b>הברה אחר הברה</b> – ורק אחר כך מחברים למילה שלמה.</li>
          <li>בדיקת הקריאה בקול עובדת הכי טוב בדפדפן Chrome או Edge, בסביבה שקטה.</li>
          <li>בדף <Link href="/report" style={{ textDecoration: "underline" }}>דוח ההתקדמות</Link> רואים אילו אותיות צריך לתרגל עוד.</li>
        </ul>
      </div>
    </>
  );
}
