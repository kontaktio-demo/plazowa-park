"use client";

import Image from "next/image";
import { BUILDINGS, INVESTMENT } from "@/lib/data/units";
import { plnShort, STATUS_META } from "@/lib/format";
import { buildingUnits, unitKind } from "@/lib/unitType";
import { lokaleSlowo, OFERTA_TEKST } from "@/lib/unitCopy";
import { selectBuilding } from "@/lib/selectUnit";
import { sectionEyebrow } from "@/lib/sections";

/**
 * Sześć budynków, każdy własnym kadrem z dollhouse'u dewelopera. Wcześniej stały
 * tu rysowane sylwetki elewacji: płaskie, cztery z sześciu identyczne i bez ani
 * jednego drzewa, mimo że sekcja nazywa się "Osiedle ukryte w lesie".
 * Kadry generuje scripts/osiedle-kadry.mjs - dla każdego budynku wybiera klatkę
 * obrotu, na której stoi najbliżej widza. Klik filtruje listę lokali niżej.
 */
const status = (available: number, count: number) =>
  available === 0 ? "sold" : available < count ? "reserved" : "available";

// Budynek jest jednorodny: narożny mieści cztery mieszkania, środkowy dwa domy.
const skladBudynku = (stageId: number, count: number) =>
  `${count} ${lokaleSlowo(unitKind(buildingUnits(stageId)[0]), count)}`;

export default function Osiedle() {
  return (
    <section id="osiedle" className="band band-sand sec">
      <div className="wrap">
        <header className="mx-auto max-w-3xl text-center" data-reveal>
          <p className="eyebrow justify-center">{sectionEyebrow("osiedle")}</p>
          <h2 className="t-display-l mt-5 text-balance sm:mt-6">
            Osiedle ukryte <span className="fg-accent">w lesie</span>
          </h2>
          <p className="t-body-l fg-muted mx-auto mt-5 max-w-2xl text-pretty sm:mt-6">
            Osiedle to {OFERTA_TEKST} w {INVESTMENT.buildingsCount} budynkach. Narożne mieszczą po
            cztery mieszkania, środkowe po dwa domy z garażem. Do każdego lokalu należy prywatny
            ogród, taras, dwa miejsca postojowe i poddasze w cenie.
          </p>
        </header>

        <div
          className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          data-reveal="stagger"
        >
          {BUILDINGS.map((b, i) => {
            const s = status(b.available, b.count);
            return (
              <button
                key={b.stageId}
                type="button"
                onClick={() => selectBuilding(b.stageId)}
                aria-label={`Budynek ${b.label}: ${skladBudynku(b.stageId, b.count)}, wolne: ${b.available}, od ${plnShort(b.priceFrom)}. Pokaż na liście`}
                className="group bd overflow-hidden border text-left transition-colors hover:border-clay-600"
                style={{ transitionDelay: `${Math.min(i, 6) * 60}ms` }}
              >
                <span className="relative block aspect-4/3 overflow-hidden bg-sand-200">
                  <Image
                    src={`/osiedle/b${b.stageId}.webp`}
                    alt={`Budynek ${b.label} osiedla Plażowa Park wśród drzew`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="bd absolute left-3 top-3 flex items-center gap-1.5 border bg-sand-50/95 px-2 py-1">
                    <span className="status-dot" style={{ background: STATUS_META[s].color }} />
                    <span className="t-meta-sm">Budynek {b.label}</span>
                  </span>
                </span>

                <span className="flex items-end justify-between gap-4 p-4 sm:p-5">
                  <span>
                    <span className="block font-medium">
                      {skladBudynku(b.stageId, b.count)} ·{" "}
                      {b.areaFrom.toLocaleString("pl-PL")}-{b.areaTo.toLocaleString("pl-PL")} m²
                    </span>
                    <span className="t-meta-sm fg-muted mt-1 block">Wolne: {b.available}</span>
                  </span>
                  <span className="t-meta-sm fg-accent num flex-none">od {plnShort(b.priceFrom)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
