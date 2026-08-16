/**
 * Schemat okolicy w systemie marki. Układ (zalew, przystań, plaża z molo,
 * wakepark, park linowy, wydmy, Plac Wolności, osiedle po wschodniej stronie)
 * odwzorowuje plan okolicy dewelopera przeniesiony z rzutu izometrycznego na
 * widok z góry. Etykiety są HTML-em nad SVG, więc zostają czytelne na telefonie.
 */

const W = 1000;
const H = 460;

/** Obrys zalewu: wąski koniec od zachodu, zatoka z plażą od południowego zachodu. */
const LAKE =
  "M236 196c14-40 64-68 130-80 58-10 120-8 168 6 32 9 46 24 70 28 36 6 64 28 70 60 6 34-14 64-54 86-46 26-112 40-176 38-58-2-114-14-152-34-30-16-48-42-56-72Z";

const LABELS: { t: string; x: number; y: number; to?: [number, number]; onWater?: boolean }[] = [
  { t: "Plac Wolności", x: 39, y: 9, to: [40, 13] },
  { t: "Przystań", x: 11, y: 41, to: [23, 43] },
  { t: "Zalew Mrożyczka", x: 45, y: 48, onWater: true },
  { t: "Central Wake Park", x: 70, y: 24, to: [66, 40] },
  { t: "Plaża i molo", x: 14, y: 70, to: [27, 64] },
  { t: "Park Linowy", x: 47, y: 76, to: [50, 82] },
  { t: "Wydmy", x: 19, y: 90, to: [30, 90] },
];

const ESTATE = { x: 79, y: 48 };

export default function AreaMap({ className = "" }: { className?: string }) {
  const px = (p: number) => (p / 100) * W;
  const py = (p: number) => (p / 100) * H;

  return (
    <div
      className={`relative w-full bg-sand-200 ${className}`}
      role="img"
      aria-label="Plan okolicy: osiedle Plażowa Park po wschodniej stronie Zalewu Mrożyczka, w sąsiedztwie Central Wake Park, przystani, plaży z molo, parku linowego i wydm"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" fill="none" aria-hidden>
        <defs>
          <pattern id="las" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.3" fill="var(--color-sand-500)" fillOpacity="0.55" />
            <circle cx="9" cy="9" r="1.3" fill="var(--color-sand-500)" fillOpacity="0.35" />
          </pattern>
        </defs>

        {/* las: pas kropek okalający wodę, rysowany jako szeroki obrys obrysu zalewu */}
        <g stroke="url(#las)" fill="none">
          <path d={LAKE} strokeWidth="64" transform="translate(455 222) scale(1.16) translate(-455 -222)" />
          <path
            d="M700 120c86-14 168-10 214 12 14 46 12 200-6 250-58 20-140 22-198 6"
            strokeWidth="90"
          />
          <path d="M300 372c120-16 260-14 344 6" strokeWidth="44" />
        </g>

        {/* drogi: zamknięty pierścień wokół zalewu plus zjazd na osiedle */}
        <g stroke="var(--color-sand-500)" strokeWidth="2.5" strokeOpacity="0.6" strokeLinecap="round">
          <path d="M92 122C300 72 560 54 762 44" />
          <path d="M762 44c46 106 82 246 122 386" />
          <path d="M152 332c150 70 410 94 732 98" />
          <path d="M92 122c6 80 26 152 60 210" />
          <path d="M848 238 790 226" />
        </g>

        {/* woda */}
        <path d={LAKE} fill="var(--color-lake-700)" />
        <path
          d="M318 396c76-18 158-22 236-12 66 8 128 24 176 44-52 18-132 16-208 2-72-14-146-24-206-20-28 2-32-8-2-14Z"
          fill="var(--color-lake-700)"
          fillOpacity="0.8"
        />
        {/* zmarszczki: ten sam motyw co znak marki i skala głębokości */}
        <g stroke="var(--color-lake-500)" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round">
          <path d="M318 170q22-11 44 0t44 0 44 0" />
          <path d="M352 236q22-11 44 0t44 0 44 0 44 0" />
          <path d="M420 288q22-11 44 0t44 0" />
        </g>

        {/* plaża i molo */}
        <path d="M242 252c14 28 36 48 62 60-24 12-56 2-70-22-8-14-4-30 8-38Z" fill="var(--color-sand-500)" />
        <path d="M276 300 326 266" stroke="var(--color-sand-500)" strokeWidth="6" strokeLinecap="round" />

        {/* odnośniki etykiet do punktów w terenie */}
        <g stroke="var(--color-sand-500)" strokeWidth="1" strokeOpacity="0.85">
          {LABELS.filter((l) => l.to).map((l) => (
            <g key={l.t}>
              <path d={`M${px(l.x)} ${py(l.y)} L${px(l.to![0])} ${py(l.to![1])}`} />
              <circle cx={px(l.to![0])} cy={py(l.to![1])} r="2.5" fill="var(--color-sand-500)" stroke="none" />
            </g>
          ))}
        </g>

        {/* osiedle: element systemu, nie pinezka */}
        <g transform={`translate(${px(ESTATE.x)} ${py(ESTATE.y)})`}>
          <circle r="30" stroke="var(--color-sun)" strokeOpacity="0.2" strokeWidth="1.5" />
          <circle r="18" stroke="var(--color-sun)" strokeOpacity="0.5" strokeWidth="1.5" />
          <circle r="7" fill="var(--color-sun)" />
        </g>
      </svg>

      {LABELS.map((l) => (
        <span
          key={l.t}
          className={`t-meta-sm absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-sand-200 px-1 text-[clamp(8px,1.9vw,11px)] ${
            l.onWater ? "bg-transparent text-sand-50" : "text-ink-muted"
          }`}
          style={{ left: `${l.x}%`, top: `${l.y}%` }}
        >
          {l.t}
        </span>
      ))}
      <span
        className="t-meta-sm absolute -translate-x-1/2 whitespace-nowrap text-[clamp(8px,1.9vw,11px)] font-medium text-ink"
        style={{ left: `${ESTATE.x}%`, top: `calc(${ESTATE.y}% + 7%)` }}
      >
        Plażowa Park
      </span>
    </div>
  );
}
