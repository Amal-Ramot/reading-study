import Link from "next/link";

const PATH = [
  { href: "/letters", icon: "🔤", title: "אוֹתִיּוֹת", desc: "מכירים את 22 האותיות, השם והצליל של כל אחת", bg: "var(--c-coral-soft)" },
  { href: "/nikud", icon: "🎵", title: "מַסְלוּל נִקּוּד", desc: "צליל אחד בכל פעם: מכירים, שומעים, קוראים ומתאימים", bg: "var(--c-yellow-soft)" },
  { href: "/words", icon: "🧩", title: "מִלִּים", desc: "קוראים מילה הברה אחר הברה", bg: "var(--c-purple-soft)" },
  { href: "/stories", icon: "📖", title: "סִפּוּרִים", desc: "סיפורים קצרים עם ניקוד מלא", bg: "var(--c-teal-soft)" },
  { href: "/game", icon: "🎮", title: "מִשְׂחָק", desc: "מתאימים תמונה למילה ומוצאים אותיות", bg: "var(--c-green-soft)" },
  { href: "/check", icon: "🎤", title: "בְּדִיקַת קְרִיאָה", desc: "קוראים בקול – והמחשב בודק אם קראנו נכון", bg: "#ffe3f0" },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <h1 className="read">בּוֹאוּ נִלְמַד לִקְרֹא! 📚</h1>
          <p>
            מסלול לימוד קריאה לכיתה א&apos;: מאותיות, דרך ניקוד והברות, ועד מילים וסיפורים.
            בכל שלב אפשר להקשיב, לתרגל ולקרוא בקול.
          </p>
          <div className="row">
            <Link href="/letters" className="btn btn-primary btn-lg">מַתְחִילִים ←</Link>
            <Link href="/check" className="btn btn-lg">🎤 בדיקת קריאה</Link>
          </div>
        </div>
        <div className="hero-art read" aria-hidden>
          <span style={{ color: "var(--c-coral)" }}>אָ</span>
          <span style={{ color: "var(--c-teal)" }}>בּ</span>
          <span style={{ color: "var(--c-purple)" }}>גִּ</span>
          <span style={{ color: "var(--c-green)" }}>דּוּ</span>
          <span style={{ color: "var(--c-yellow-dark)" }}>הֵ</span>
          <span style={{ color: "var(--c-coral)" }}>שׁ</span>
        </div>
      </section>

      <h2 className="section-title">מַסְלוּל הַלְּמִידָה</h2>
      <div className="tiles">
        {PATH.map((p, i) => (
          <Link key={p.href} href={p.href} className="tile" style={{ background: p.bg }}>
            <span className="tile-step">שלב {i + 1}</span>
            <div className="tile-icon">{p.icon}</div>
            <h3 className="read">{p.title}</h3>
            <p>{p.desc}</p>
          </Link>
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
