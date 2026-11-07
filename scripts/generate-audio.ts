/**
 * מייצר קבצי MP3 בקול של Google Translate לכל הטקסטים בתרגול הניקוד.
 * הרצה: npm run audio
 * קבצים קיימים לא מורדים שוב. הפלט: public/audio/*.mp3 ו-lib/audioManifest.json
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { nikudSpeechTexts } from "../lib/nikud";

const OUT_DIR = join(process.cwd(), "public", "audio");
const MANIFEST = join(process.cwd(), "lib", "audioManifest.json");
const MAX = 180; // מגבלת אורך לבקשה אחת

const key = (t: string) => t.normalize("NFC");
const fileFor = (t: string) => createHash("sha1").update(key(t)).digest("hex").slice(0, 12) + ".mp3";

function chunks(text: string): string[] {
  if (text.length <= MAX) return [text];
  const parts = text.split(/(?<=[.!?–])\s+/);
  const res: string[] = [];
  let cur = "";
  for (const p of parts) {
    if ((cur + " " + p).trim().length > MAX && cur) { res.push(cur); cur = p; }
    else cur = (cur + " " + p).trim();
  }
  if (cur) res.push(cur);
  return res;
}

async function fetchTts(text: string): Promise<Buffer> {
  const url = "https://translate.google.com/translate_tts?ie=UTF-8&tl=iw&client=tw-ob&q=" + encodeURIComponent(text);
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
  }
  throw new Error("TTS failed for: " + text);
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const manifest: Record<string, string> = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
  const texts = nikudSpeechTexts();
  let made = 0;
  for (const t of texts) {
    const f = fileFor(t);
    manifest[key(t)] = f;
    const path = join(OUT_DIR, f);
    if (existsSync(path)) continue;
    const bufs: Buffer[] = [];
    for (const c of chunks(t)) {
      bufs.push(await fetchTts(c)); // קבצי MP3 אפשר פשוט לשרשר
      await new Promise((r) => setTimeout(r, 250));
    }
    writeFileSync(path, Buffer.concat(bufs));
    made++;
    process.stdout.write(".");
  }
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(MANIFEST, JSON.stringify(sorted, null, 1) + "\n");
  console.log(`\n${texts.length} texts, ${made} new files`);
}

main().catch((e) => { console.error(e); process.exit(1); });
