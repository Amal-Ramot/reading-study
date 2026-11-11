// רקע קבוע במראה ריאליסטי: שמיים, שמש זוהרת, עננים רכים, אופק, ים וחוף
function Cloud({ className }: { className: string }) {
  return (
    <svg className={"cloud " + className} viewBox="0 0 240 110">
      <defs>
        <radialGradient id="cl-g" cx=".45" cy=".25" r=".8">
          <stop offset="0" stopColor="#fff" /><stop offset=".7" stopColor="#f3f8fd" /><stop offset="1" stopColor="#c7d6e6" />
        </radialGradient>
        <filter id="cl-b" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <g filter="url(#cl-b)" fill="url(#cl-g)">
        <ellipse cx="70" cy="68" rx="48" ry="26" /><ellipse cx="118" cy="48" rx="46" ry="34" />
        <ellipse cx="166" cy="66" rx="50" ry="27" /><ellipse cx="120" cy="76" rx="84" ry="20" />
      </g>
    </svg>
  );
}

export function OceanBackdrop() {
  return (
    <div className="backdrop" aria-hidden>
      <div className="sun"><i /></div>
      <Cloud className="c1" />
      <Cloud className="c2" />
      <Cloud className="c3" />
      <svg className="sea" viewBox="0 0 1200 220" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sea-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3aa9d8" /><stop offset=".45" stopColor="#35c3d6" /><stop offset=".8" stopColor="#9eeadf" /><stop offset="1" stopColor="#e9fbf3" />
          </linearGradient>
          <linearGradient id="sea-sun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff7d6" stopOpacity=".75" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="20" width="1200" height="200" fill="url(#sea-g)" />
        <rect x="0" y="18" width="1200" height="5" fill="#fff" opacity=".45" />
        <g className="swell" fill="none" stroke="#fff" strokeLinecap="round">
          <path d="M-40 70 q60 -8 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0" strokeOpacity=".28" strokeWidth="2" />
          <path d="M-90 110 q80 -10 160 0 t160 0 t160 0 t160 0 t160 0 t160 0 t160 0 t160 0 t160 0" strokeOpacity=".35" strokeWidth="2.5" />
          <path d="M-60 152 q100 -14 200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0" strokeOpacity=".6" strokeWidth="4" />
        </g>
      </svg>
      <svg className="shore" viewBox="0 0 1200 90" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sand-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9b877" /><stop offset=".25" stopColor="#f1d9a2" /><stop offset="1" stopColor="#f8e8c2" />
          </linearGradient>
        </defs>
        <path d="M0 34 Q150 6 320 26 T640 22 T960 28 T1200 16 V90 H0Z" fill="#fff" opacity=".9" />
        <path d="M0 42 Q150 14 320 34 T640 30 T960 36 T1200 24 V90 H0Z" fill="url(#sand-g)" />
      </svg>
    </div>
  );
}
