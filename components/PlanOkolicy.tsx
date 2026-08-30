"use client";

import Image from "next/image";
import { useState } from "react";
import { MAPA_PUNKTY } from "@/lib/data/site";

/**
 * Plan poglądowy okolicy od dewelopera z klikalnymi punktami. Sam obraz jest
 * statyczny, więc pozycje są odczytane z niego raz i zapisane w procentach -
 * dzięki temu działają przy każdej szerokości kontenera.
 */
export default function PlanOkolicy() {
  const [aktywny, setAktywny] = useState<number | null>(null);

  return (
    <figure className="bd overflow-hidden border bg-sand-200" data-reveal>
      {/* proporcja kontenera musi byc dokladnie taka jak obrazu (1800x1344),
          inaczej object-cover przycina kadr i punkty rozjezdzaja sie z mapa */}
      <div className="relative aspect-[1800/1344] w-full">
        <Image
          src="/map/okolica-3d.webp"
          alt="Plan okolicy: Zalew Mrożyczka, plaża i molo, przystań, Central Wake Park, park linowy, wydmy i położenie osiedla Plażowa Park"
          fill
          sizes="(max-width: 1280px) 100vw, 1200px"
          className="object-cover"
        />

        {MAPA_PUNKTY.map((p, i) => {
          const otwarty = aktywny === i;
          // dymek przy prawej krawędzi otwieramy w lewo, żeby nie wychodził poza kadr
          const doLewej = p.x > 62;
          return (
            <div key={p.name} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
              <button
                type="button"
                aria-expanded={otwarty}
                aria-label={`${p.name}: ${p.desc}`}
                onClick={() => setAktywny(otwarty ? null : i)}
                onMouseEnter={() => setAktywny(i)}
                onMouseLeave={() => setAktywny((v) => (v === i ? null : v))}
                onFocus={() => setAktywny(i)}
                onBlur={() => setAktywny((v) => (v === i ? null : v))}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-transform duration-200 ${
                    "tu" in p && p.tu
                      ? "border-sand-50 bg-sun shadow-[0_2px_10px_rgba(28,23,20,.45)]"
                      : "border-sand-50 bg-clay-900 shadow-[0_2px_8px_rgba(28,23,20,.35)]"
                  } ${otwarty ? "scale-125" : "hover:scale-110"}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-sand-50" />
                </span>
              </button>

              {otwarty && (
                <div
                  role="tooltip"
                  className={`bd pointer-events-none absolute bottom-4 z-10 w-56 border bg-sand-50/97 p-3 shadow-[0_8px_28px_-8px_rgba(28,23,20,.35)] backdrop-blur-sm ${
                    doLewej ? "right-3" : "left-3"
                  }`}
                >
                  <p className="t-meta-sm fg-accent normal-case">{p.name}</p>
                  <p className="t-body fg-muted mt-1 text-pretty">{p.desc}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <figcaption className="t-meta-sm fg-muted border-t border-(--band-line) px-4 py-3 normal-case">
        Plan poglądowy okolicy Zalewu Mrożyczka. Najedź na punkt albo go dotknij, żeby zobaczyć opis.
      </figcaption>
    </figure>
  );
}
