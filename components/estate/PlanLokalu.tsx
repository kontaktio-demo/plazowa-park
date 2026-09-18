import Image from "next/image";
import type { Unit } from "@/lib/data/units";
import { NA_PLANIE, PLAN } from "@/lib/data/plan";
import { STATUS_META } from "@/lib/format";
import { unitKind, unitPlace } from "@/lib/unitType";
import { SIZES_KADRU } from "@/lib/wczytaj";

// wycinek planu w pikselach pliku: tyle, żeby zmieścił się budynek, sąsiedni
// budynek i ogródki, a numery z planu dało się jeszcze przeczytać
const KADR = { w: 440, h: 330 };

const proc = (v: number, calosc: number) => `${(v / calosc) * 100}%`;
const zakres = (v: number, max: number) => Math.min(Math.max(v, 0), max);

/** Mieszkanie albo dom zaznaczony na wycinku planu zagospodarowania. */
export default function PlanLokalu({ unit, className = "" }: { unit: Unit; className?: string }) {
  const p = NA_PLANIE[unit.name];
  if (!p) return null;
  const [x, y, w, h] = p.r;
  const x0 = zakres(x + w / 2 - KADR.w / 2, PLAN.w - KADR.w);
  const y0 = zakres(y + h / 2 - KADR.h / 2, PLAN.h - KADR.h);
  const { house, type } = unitPlace(unit);
  // wolny lokal wyróżnia bursztyn marki; zieleń statusu zlewałaby się z trawnikami
  const kolor = unit.status === "available" ? "var(--color-sun)" : STATUS_META[unit.status].color;

  return (
    <figure className={className}>
      <div className="bd relative w-full overflow-hidden border bg-sand-50" style={{ aspectRatio: `${KADR.w} / ${KADR.h}` }}>
        <div
          className="absolute"
          style={{
            left: `-${proc(x0, KADR.w)}`,
            top: `-${proc(y0, KADR.h)}`,
            width: proc(PLAN.w, KADR.w),
            height: proc(PLAN.h, KADR.h),
          }}
        >
          <Image src={PLAN.src} alt="" fill sizes={SIZES_KADRU} className="object-cover" />
          {/* kolor wyróżnienia idzie za statusem, żeby sprzedany lokal nie wyglądał
              na wolny w oknie, którego nagłówek mówi "Sprzedano" */}
          <span
            aria-hidden
            className="absolute outline-3 -outline-offset-3"
            style={{
              left: proc(x, PLAN.w),
              top: proc(y, PLAN.h),
              width: proc(w, PLAN.w),
              height: proc(h, PLAN.h),
              background: `color-mix(in srgb, ${kolor} 34%, transparent)`,
              outlineColor: kolor,
            }}
          />
        </div>
      </div>
      <figcaption className="mt-2">
        <span className="t-label block">
          Budynek {house}, lokal {type}
        </span>
        <span className="t-meta-sm fg-muted mt-1 block">
          Na planie osiedla {unitKind(unit) === "dom" ? "dom" : "mieszkanie"} ma ogródek nr {p.ogrodek}
        </span>
      </figcaption>
    </figure>
  );
}
