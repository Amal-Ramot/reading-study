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
  return (
    <div className="island">
      <svg className="scene" viewBox="0 0 400 300" aria-hidden>
        <ellipse cx="200" cy="262" rx="220" ry="60" fill="#3bb4e8" />
        <path d="M0 250 Q50 236 100 250 T200 250 T300 250 T400 250" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" opacity=".7" />
        <ellipse cx="200" cy="232" rx="150" ry="42" fill="#ffd98a" stroke="#e8b85a" strokeWidth="3" />
        <ellipse cx="170" cy="222" rx="60" ry="10" fill="#ffe7b0" />
        {/* דקל */}
        <path d="M232 222 Q226 160 250 96" fill="none" stroke="#a0662f" strokeWidth="13" strokeLinecap="round" />
        <path d="M232 222 Q226 160 250 96" fill="none" stroke="#c9884a" strokeWidth="5" strokeDasharray="6 9" strokeLinecap="round" />
        <g fill="#2fbf71" stroke="#1d8a4f" strokeWidth="3" strokeLinejoin="round">
          <path d="M250 96 Q210 70 172 92 Q212 84 250 100 Z" />
          <path d="M250 96 Q290 66 330 90 Q290 82 250 100 Z" />
          <path d="M250 96 Q232 50 196 46 Q232 66 248 100 Z" />
          <path d="M250 96 Q276 52 312 52 Q276 70 252 100 Z" />
          <path d="M250 96 Q262 120 250 150 Q246 122 248 100 Z" />
        </g>
        <circle cx="244" cy="104" r="7" fill="#8a5a2b" />
        <circle cx="256" cy="106" r="7" fill="#8a5a2b" />
        {/* צדפים */}
        <text x="120" y="248" fontSize="18">🐚</text>
        <text x="300" y="244" fontSize="16">⭐</text>
      </svg>
      <Character id="turtle" className="ch bob" size={110} style={{ left: "8%", top: "52%" }} />
      <Character id="crab" className="ch bob" size={96} style={{ left: "62%", top: "58%", animationDelay: ".4s" }} />
      <Character id="octopus" className="ch bob" size={100} style={{ left: "6%", top: "16%", animationDelay: ".8s" }} />
      <Character id="puffer" className="ch bob" size={90} style={{ left: "74%", top: "8%", animationDelay: "1.2s" }} />
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
