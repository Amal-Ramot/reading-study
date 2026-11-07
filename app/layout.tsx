import type { Metadata, Viewport } from "next";
import { Rubik, Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/components/ProgressProvider";
import { Header } from "@/components/Header";

const rubik = Rubik({ subsets: ["hebrew", "latin"], variable: "--font-ui", weight: ["400", "500", "700", "800"] });
const noto = Noto_Sans_Hebrew({ subsets: ["hebrew"], variable: "--font-read", weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "קוראים בכיף – לימוד קריאה לכיתה א'",
  description: "אותיות, ניקוד, מילים, סיפורים ובדיקת קריאה בקול – לילדי כיתה א'",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFF6E9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} ${noto.variable}`}>
      <body>
        <ProgressProvider>
          <Header />
          <main className="main">{children}</main>
          <footer className="footer">נבנה באהבה לקוראים הצעירים 💛</footer>
        </ProgressProvider>
      </body>
    </html>
  );
}
