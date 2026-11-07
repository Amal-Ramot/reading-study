"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProgress } from "./ProgressProvider";

export const NAV = [
  { href: "/letters", label: "אוֹתִיּוֹת", icon: "🔤" },
  { href: "/nikud", label: "מַסְלוּל נִקּוּד", icon: "🎵" },
  { href: "/words", label: "מִלִּים", icon: "🧩" },
  { href: "/stories", label: "סִפּוּרִים", icon: "📖" },
  { href: "/game", label: "מִשְׂחָק", icon: "🎮" },
  { href: "/check", label: "בְּדִיקַת קְרִיאָה", icon: "🎤" },
];

export function Header() {
  const pathname = usePathname();
  const { stars } = useProgress();
  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="דף הבית">
          <span className="brand-logo">אָ</span>
          <span className="brand-text">קוֹרְאִים בְּכֵיף</span>
        </Link>
        <nav className="nav" aria-label="ניווט ראשי">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={"nav-link" + (pathname === n.href ? " active" : "")}
            >
              <span aria-hidden>{n.icon}</span> {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/report" className="stars" title="הכוכבים שלי ודוח התקדמות">
          ⭐ <b>{stars}</b>
        </Link>
      </div>
    </header>
  );
}
