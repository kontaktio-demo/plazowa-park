"use client";

import { useEffect } from "react";
import type { Unit } from "@/lib/data/units";
import { plnShort, area, rooms, STATUS_META } from "@/lib/format";
import { SITE } from "@/lib/data/site";
import { selectUnit } from "@/lib/selectUnit";
import { Icon } from "../Icons";

export default function UnitModal({ unit, onClose }: { unit: Unit | null; onClose: () => void }) {
  useEffect(() => {
    if (!unit) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [unit, onClose]);

  if (!unit) return null;
  const s = STATUS_META[unit.status];

  const specs = [
    { l: "Powierzchnia", v: area(unit.area) },
    { l: "Ogród prywatny", v: area(unit.garden) },
    { l: "Liczba pokoi", v: rooms(unit.rooms) },
    { l: "Kondygnacje", v: `${unit.floors}` },
    { l: "Budynek", v: unit.buildingLabel },
    { l: "Cena za m²", v: `${plnShort(unit.pricePerM)}` },
  ];

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={`Apartament ${unit.name}`}>
      <div className="absolute inset-0 bg-pine-deep/55 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-t-[20px] bg-paper shadow-[var(--shadow-lift)] sm:rounded-[18px]">
        <div className="grid sm:grid-cols-2">
          <div className="relative aspect-[4/3] bg-sand sm:aspect-auto">
            {unit.viewThumb && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/unit-views/${unit.viewThumb}`} alt={`Położenie apartamentu ${unit.name}`} className="h-full w-full object-contain p-6" />
            )}
            <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold text-ink-soft">
              <span className="status-dot" style={{ background: s.color }} /> {s.label}
            </span>
          </div>

          <div className="p-6 sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">Budynek {unit.buildingLabel}</p>
                <h3 className="mt-3 font-display text-3xl text-pine">Apartament {unit.name}</h3>
              </div>
              <button onClick={onClose} aria-label="Zamknij" className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-ink/12 text-ink hover:bg-sand">
                <Icon.close width={18} height={18} />
              </button>
            </div>

            <div className="mt-5 font-display text-3xl text-ink num">{plnShort(unit.price)}</div>

            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
              {specs.map((sp) => (
                <div key={sp.l} className="border-t border-ink/8 pt-2.5">
                  <dt className="text-[0.7rem] uppercase tracking-[0.1em] text-faint">{sp.l}</dt>
                  <dd className="mt-0.5 font-medium text-ink num">{sp.v}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 text-sm leading-relaxed text-muted">
              Apartament z prywatnym ogrodem i tarasem, panoramicznymi oknami i adaptowalnym poddaszem w cenie.
              Standard: pompa ciepła, ogrzewanie podłogowe, dwa miejsca postojowe.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button onClick={() => { selectUnit(`Apartament ${unit.name}`); onClose(); }} className="btn btn-primary">
                Zapytaj o ten apartament <Icon.arrow width={18} height={18} />
              </button>
              <div className="flex gap-2.5">
                <a href={`tel:${SITE.phone.tel}`} className="btn btn-ghost flex-1 !py-2.5 text-sm">
                  <Icon.phone width={16} height={16} /> Zadzwoń
                </a>
                {unit.planUrl && (
                  <a href={unit.planUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost flex-1 !py-2.5 text-sm">
                    Rzut PDF
                  </a>
                )}
              </div>
            </div>
            <p className="mt-4 text-xs text-faint">
              Dane wg konfiguratora dewelopera. Ceny i dostępność potwierdzamy w biurze sprzedaży.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
