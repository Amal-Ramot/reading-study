"use client";

import { useState } from "react";
import { speak } from "@/lib/speech";

export function SpeakButton({
  text,
  label = "הַקְשֵׁב",
  size = "md",
}: {
  text: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className={`btn btn-speak btn-${size}` + (busy ? " pulsing" : "")}
      onClick={async (e) => {
        e.stopPropagation();
        setBusy(true);
        await speak(text);
        setBusy(false);
      }}
      aria-label={`${label}: ${text}`}
    >
      🔊 {size !== "sm" && label}
    </button>
  );
}
