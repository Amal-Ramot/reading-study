import type { NextConfig } from "next";

// ב-GitHub Pages האתר יושב תחת /<שם-המאגר>, למשל /reading-study.
// ה-workflow מעביר את הנתיב דרך BASE_PATH; בהרצה מקומית הוא ריק.
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export", // בנייה לאתר סטטי (תיקיית out/) – מתאים ל-GitHub Pages
  trailingSlash: true, // /letters/ -> letters/index.html
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
