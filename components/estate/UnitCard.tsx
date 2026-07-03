"use client";

import type { Unit } from "@/lib/data/units";
import { plnShort, area, rooms, STATUS_META } from "@/lib/format";
import { selectUnit } from "@/lib/selectUnit";
import { Icon } from "../Icons";

export default function UnitCard({ unit, onOpen }: { unit: Unit; onOpen: (u: Unit) => void }) {
  const s = STATUS_META[unit.status];
  return (
    <article className="card group flex flex-col overflow-hidden transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
      <button
        onClick={() => onOpen(unit)}
        className="relative aspect-[5/4] w-full overflow-hidden bg-sand text-left"
        aria-label={`Podgląd — apartament ${unit.name}`}
      >
        {unit.viewThumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/unit-views/${unit.viewThumb}`}
            alt={`Położenie apartamentu ${unit.name} w budynku ${unit.buildingLabel}`}
            className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : null}
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-paper/90 px-2.5 py-1 text-[0.72rem] font-semibold text-ink-soft backdrop-blur-sm">
          <span className="status-dot" style={{ background: s.color }} />
          {s.label}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-pine px-2.5 py-1 text-[0.72rem] font-medium text-paper">
          Budynek {unit.buildingLabel}
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl text-pine">Apartament {unit.name}</h3>
          <span className="chip">{rooms(unit.rooms)}</span>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <Spec label="Powierzchnia" value={area(unit.area)} />
          <Spec label="Ogród" value={area(unit.garden)} />
          <Spec label="Kondygnacje" value={`${unit.floors}`} />
        </dl>

        <div className="mt-5 flex items-end justify-between border-t border-ink/8 pt-4">
          <div>
            <div className="font-display text-2xl text-ink num">{plnShort(unit.price)}</div>
            <div className="mt-0.5 text-xs text-muted num">{plnShort(unit.pricePerM)}/m²</div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={() => onOpen(unit)} className="btn btn-ghost flex-1 !py-2.5 text-sm">
            Szczegóły
          </button>
          <button
            onClick={() => selectUnit(`Apartament ${unit.name}`)}
            className="btn btn-primary flex-1 !py-2.5 text-sm"
          >
            Zapytaj <Icon.arrow width={16} height={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.7rem] uppercase tracking-[0.1em] text-faint">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink num">{value}</dd>
    </div>
  );
}
