// רקע קבוע: שמש, עננים וגלים
export function OceanBackdrop() {
  return (
    <div className="backdrop" aria-hidden>
      <svg className="sun" viewBox="0 0 100 100">
        <g stroke="#ffb703" strokeWidth="5" strokeLinecap="round">
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return <line key={i} x1={50 + Math.cos(a) * 34} y1={50 + Math.sin(a) * 34} x2={50 + Math.cos(a) * 46} y2={50 + Math.sin(a) * 46} />;
          })}
        </g>
        <circle cx="50" cy="50" r="26" fill="#ffd166" stroke="#ffb703" strokeWidth="4" />
      </svg>
      <svg className="cloud c1" viewBox="0 0 120 50"><path d="M20 45 a18 18 0 0 1 4 -35 a24 24 0 0 1 44 -4 a20 20 0 0 1 32 22 a12 12 0 0 1 0 17 z" fill="white" /></svg>
      <svg className="cloud c2" viewBox="0 0 120 50"><path d="M20 45 a18 18 0 0 1 4 -35 a24 24 0 0 1 44 -4 a20 20 0 0 1 32 22 a12 12 0 0 1 0 17 z" fill="white" /></svg>
      <svg className="waves" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0 60 Q75 20 150 60 T300 60 T450 60 T600 60 T750 60 T900 60 T1050 60 T1200 60 V120 H0 Z" fill="#7fd3f7" opacity=".55" />
        <path d="M0 80 Q75 50 150 80 T300 80 T450 80 T600 80 T750 80 T900 80 T1050 80 T1200 80 V120 H0 Z" fill="#3bb4e8" opacity=".55" />
      </svg>
    </div>
  );
}
