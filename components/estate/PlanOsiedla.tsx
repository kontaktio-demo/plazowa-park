"use client";

import Image from "next/image";
import { useState } from "react";
import { UNITS, type Unit } from "@/lib/data/units";
import { NA_PLANIE, PLAN } from "@/lib/data/plan";
import { area, plnShort, STATUS_META } from "@/lib/format";
import { unitLabel, unitPlace } from "@/lib/unitType";
import { BLUR } from "@/lib/blur";
import Lightbox from "../Lightbox";

const OPIS =
  "Plan zagospodarowania osiedla Plażowa Park: dziesięć budynków po obu stronach drogi wewnętrznej, przy każdym mieszkaniu i domu ogródek";

const PRESENT = (["available", "reserved", "sold"] as const).filter((k) => UNITS.some((u) => u.status === k));

const proc = (v: number, calosc: number) => `${(v / calosc) * 100}%`;

// Wolne lokale zostają bez nakładki, bo to prawie cała oferta, a kropki przy każdym
// zasłaniały oznaczenia lokali wypalone w planie. Kolor dostają tylko wyjątki, a
// sprzedane dodatkowo ukośne kreskowanie: sam odcień ginął na telefonie i w druku.
const tlo = (status: Unit["status"]) => {
  if (status === "available") return undefined;
  const kolor = STATUS_META[status].color;
  const wypelnienie = `color-mix(in srgb, ${kolor} ${status === "sold" ? 38 : 30}%, transparent)`;
  if (status !== "sold") return wypelnienie;
  const kreska = `color-mix(in srgb, ${kolor} 62%, transparent)`;
  return `repeating-linear-gradient(45deg, ${kreska} 0 2px, transparent 2px 7px), ${wypelnienie}`;
};

/**
 * Plan zagospodarowania dewelopera z klikalnym każdym mieszkaniem i domem. Numery
 * budynków i lokali są wypalone w samym planie, więc nakładka niczego nie podpisuje
 * drugi raz: zaznacza status i otwiera szczegóły.
 */
export default function PlanOsiedla({ onOpen }: { onOpen: (u: Unit) => void }) {
  const [wskazany, setWskazany] = useState<Unit | null>(null);

  return (
    <div className="min-w-0">
      <div className="bd relative w-full overflow-hidden border bg-sand-50" style={{ aspectRatio: `${PLAN.w} / ${PLAN.h}` }}>
        <Image
          src={PLAN.src}
          alt={OPIS}
          fill
          sizes="(max-width: 1024px) 100vw, 640px"
          placeholder="blur"
          blurDataURL={BLUR.plan}
          className="object-cover"
        />
        {UNITS.map((u) => {
          const p = NA_PLANIE[u.name];
          if (!p) return null;
          const [x, y, w, h] = p.r;
          const s = STATUS_META[u.status];
          return (
            <button
              key={u.id}
              type="button"
              data-track="klik_plan"
              data-miejsce="plan-osiedla"
              data-lokal={u.name}
              aria-label={`${unitLabel(u)}, budynek ${unitPlace(u).house}, ${area(u.area)}, ${plnShort(u.price)}, ${s.label.toLowerCase()}`}
              onClick={() => onOpen(u)}
              onPointerEnter={() => setWskazany(u)}
              onMouseLeave={() => setWskazany(null)}
              onFocus={() => setWskazany(u)}
              onBlur={() => setWskazany(null)}
              className="absolute outline-offset-0 transition-colors hover:bg-sun/35 hover:outline-2 hover:outline-clay-900 focus-visible:bg-sun/35"
              style={{
                left: proc(x, PLAN.w),
                top: proc(y, PLAN.h),
                width: proc(w, PLAN.w),
                height: proc(h, PLAN.h),
                background: tlo(u.status),
              }}
            />
          );
        })}
      </div>

      {/* Odczyt spod kursora zamiast dymka: dymek zasłaniałby sąsiednie lokale.
          Tylko od `lg`, bo najechania nie ma na dotyku, a instrukcja stoi teraz
          w kolumnie obok planu i pod nią na wąskim ekranie. Wysokość zarezerwowana,
          żeby pojawienie się odczytu nie przesuwało tabeli. */}
      <div className="mt-4 hidden min-h-11 items-center lg:flex">
        <p className="t-meta-sm min-w-0">
          {wskazany && (
            <>
              <span className="font-medium">{unitLabel(wskazany)}</span>
              <span className="fg-muted num">
                {" "}
                · budynek {unitPlace(wskazany).house} · {area(wskazany.area)} ·{" "}
                <span className="whitespace-nowrap">{plnShort(wskazany.price)}</span>
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

/** Legenda statusów planu. Stoi w kolumnie obok planu, nie pod nim. */
export function LegendaPlanu() {
  return (
    <ul className="t-meta-sm fg-muted flex flex-wrap items-center gap-x-5 gap-y-2">
      {PRESENT.map((k) => (
        <li key={k} className="flex items-center gap-2">
          <span className="bd size-3.5 border" style={{ background: tlo(k) }} />
          {STATUS_META[k].label}
        </li>
      ))}
    </ul>
  );
}

/** Na telefonie numery ogródków i lokali wypalone w planie mają kilka pikseli. */
export function PowiekszPlan() {
  const [powiekszony, setPowiekszony] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setPowiekszony(true)}
        className="link-underline fg-accent t-meta-sm w-fit py-1"
      >
        Powiększ plan
      </button>
      {powiekszony && (
        <Lightbox
          shots={[{ src: PLAN.src, alt: OPIS, caption: "Plan zagospodarowania osiedla", fit: "contain" }]}
          index={0}
          onIndex={() => {}}
          onClose={() => setPowiekszony(false)}
        />
      )}
    </>
  );
}
