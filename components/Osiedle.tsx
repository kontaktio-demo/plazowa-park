"use client";

import { useState } from "react";
import { BUILDINGS, INVESTMENT } from "@/lib/data/units";
import { plnShort } from "@/lib/format";
import { selectBuilding } from "@/lib/selectUnit";
import { sectionEyebrow } from "@/lib/sections";

/**
 * Sześć budynków rysowanych sylwetką elewacji. Liczba segmentów w bryle to realna
 * liczba lokali w budynku, więc od razu widać różnicę między narożnym (cztery
 * apartamenty) a środkowym (dwa większe). Klik filtruje listę lokali niżej.
 */
function Elevation({ units, active }: { units: number; active: boolean }) {
  const seg = 120 / units;
  const wall = active ? "var(--color-lake-500)" : "var(--color-lake-700)";

  return (
    <svg viewBox="0 0 140 112" className="h-auto w-full" fill="none" aria-hidden>
      {/* dach dwuspadowy z okapem, sygnatura architektury osiedla */}
      <path
        d="M70 10 136 50 130 50 70 16 10 50 4 50Z"
        fill={active ? "var(--color-lake-700)" : "var(--color-lake-900)"}
      />
      <path d="M70 16 130 50H10Z" fill={active ? "var(--color-lake-900)" : "var(--color-ink)"} fillOpacity={active ? 1 : 0.82} />

      {/* okno połaciowe: poddasze jest w cenie i nie wlicza się do metrażu */}
      <rect x="62" y="30" width="16" height="9" rx="1" fill="var(--color-sun)" fillOpacity="0.85" />

      {/* bryła */}
      <rect x="10" y="50" width="120" height="52" fill="var(--color-sand-50)" stroke={wall} strokeWidth="1.25" />

      {/* podziały na lokale i przeszklenia */}
      {Array.from({ length: units }, (_, i) => {
        const x = 10 + i * seg;
        const inset = seg * 0.18;
        return (
          <g key={i}>
            {i > 0 && <path d={`M${x} 50V102`} stroke={wall} strokeWidth="1.25" strokeOpacity="0.55" />}
            <rect x={x + inset} y={58} width={seg - inset * 2} height={11} fill={wall} fillOpacity="0.3" />
            <rect x={x + inset} y={76} width={seg - inset * 2} height={26} fill={wall} fillOpacity="0.45" />
          </g>
        );
      })}

      {/* linia gruntu */}
      <path d="M0 102h140" stroke={wall} strokeWidth="1.25" strokeOpacity="0.5" />
    </svg>
  );
}

export default function Osiedle() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section id="osiedle" className="band band-sand sec">
      <div className="wrap">
        <header className="mx-auto max-w-3xl text-center" data-reveal>
          <p className="eyebrow justify-center">{sectionEyebrow("osiedle")}</p>
          <h2 className="t-display-l mt-5 text-balance sm:mt-6">
            Osiedle ukryte <span className="fg-accent">w lesie</span>
          </h2>
          <p className="t-body-l fg-muted mx-auto mt-5 max-w-2xl text-pretty sm:mt-6">
            Sześć budynków i zaledwie {INVESTMENT.totalUnits} apartamentów. Narożne mieszczą po cztery lokale,
            środkowe po dwa większe. Do każdego należy prywatny ogród, taras, dwa miejsca postojowe
            i poddasze w cenie.
          </p>
        </header>

        <div
          className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-5"
          data-reveal="stagger"
        >
          {BUILDINGS.map((b, i) => {
            const active = hover === b.stageId;
            return (
              <button
                key={b.stageId}
                type="button"
                onClick={() => selectBuilding(b.stageId)}
                onPointerEnter={() => setHover(b.stageId)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(b.stageId)}
                onBlur={() => setHover(null)}
                aria-label={`Budynek ${b.label}: ${b.count} lokali, ${b.available} dostępnych, od ${plnShort(b.priceFrom)}. Pokaż na liście`}
                className="group text-left"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="block transition-transform duration-200 group-hover:-translate-y-1">
                  <Elevation units={b.count} active={active} />
                </span>
                <p className="t-meta-sm fg-muted mt-4 normal-case">Budynek {b.label}</p>
                <p className="mt-1 font-medium">
                  {b.count} {b.count >= 2 && b.count <= 4 ? "lokale" : "lokali"}
                </p>
                <p className="t-meta-sm fg-accent num mt-1.5">od {plnShort(b.priceFrom)}</p>
              </button>
            );
          })}
        </div>

        <p className="t-meta-sm fg-muted mt-12 text-center">
          <span className="mr-2 inline-block h-2 w-2 translate-y-px bg-sun" aria-hidden />
          Okno połaciowe oznacza poddasze zawarte w cenie, nieliczone do metrażu
        </p>
      </div>
    </section>
  );
}
