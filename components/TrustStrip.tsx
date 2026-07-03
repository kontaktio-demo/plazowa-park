import { INVESTMENT } from "@/lib/data/units";

const items = [
  "Zalew Mrożyczka — 30+ ha",
  "100-letni las sosnowy",
  "Central Wake Park",
  "Plaża i molo w zasięgu spaceru",
  "~30 min do Łodzi",
  "Pompy ciepła i rekuperacja",
  "Prywatny ogród i taras",
  "Oddanie IV kw. 2026",
];

export default function TrustStrip() {
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden bg-pine py-3.5 text-paper">
      <div className="marquee-track flex w-max items-center gap-0 whitespace-nowrap">
        {loop.map((t, i) => (
          <span key={i} className="flex items-center">
            <span className="px-6 text-sm font-medium tracking-wide text-paper/85">{t}</span>
            <span className="text-brass-light">✦</span>
          </span>
        ))}
      </div>
      <span className="sr-only">
        Osiedle Plażowa Park — {INVESTMENT.totalUnits} apartamentów nad Zalewem Mrożyczka w Głownie.
      </span>
    </div>
  );
}
