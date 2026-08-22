"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Unit } from "@/lib/data/units";
import { plnShort, area, rooms, STATUS_META } from "@/lib/format";
import { SITE } from "@/lib/data/site";
import { unitSlug } from "@/lib/slug";
import { selectUnit } from "@/lib/selectUnit";
import { planImage, unitPlace } from "@/lib/unitType";
import UnitPosition from "./UnitPosition";
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
  const place = unitPlace(unit);

  const specs = [
    { l: "Powierzchnia", v: area(unit.area) },
    { l: "Ogród prywatny", v: area(unit.garden) },
    { l: "Liczba pokoi", v: rooms(unit.rooms) },
    { l: "Kondygnacje", v: String(unit.floors) },
    { l: "Budynek", v: unit.buildingLabel },
    { l: "Cena za m²", v: plnShort(unit.pricePerM) },
  ];

  return (
    <div
      className="fixed inset-0 z-80 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Apartament ${unit.name}`}
    >
      <button type="button" aria-label="Zamknij" onClick={onClose} className="absolute inset-0 bg-abyss/70 backdrop-blur-sm" />
      <div className="band band-sand relative z-10 max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-t-[12px] sm:rounded-[12px]">
        <div className="grid sm:grid-cols-2">
          <div className="relative aspect-4/3 bg-lake-900 sm:aspect-auto sm:min-h-[420px]">
            <Image
              src={planImage(unit)}
              alt={`Rzut poglądowy apartamentu ${unit.name}, typ ${place.type}`}
              fill
              sizes="(max-width: 640px) 100vw, 384px"
              className="object-contain p-6"
            />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="t-meta-sm fg-muted flex items-center gap-2">
                  <span className="status-dot" style={{ background: s.color }} />
                  {s.label} · budynek {unit.buildingLabel}
                </p>
                <h3 className="t-display-m mt-3">Apartament {unit.name}</h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Zamknij"
                className="bd-strong flex h-11 w-11 flex-none items-center justify-center border"
              >
                <Icon.close width={18} height={18} />
              </button>
            </div>

            <div className="t-display-m num mt-5">{plnShort(unit.price)}</div>

            <UnitPosition unit={unit} className="mt-6 max-w-[13rem]" />

            <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4">
              {specs.map((sp) => (
                <div key={sp.l} className="bd min-w-0 border-t pt-3">
                  <dt className="t-meta-sm fg-muted">{sp.l}</dt>
                  <dd className="mt-1 font-medium">{sp.v}</dd>
                </div>
              ))}
            </dl>

            <p className="t-body fg-muted mt-6 text-pretty">
              Apartament z prywatnym ogrodem i tarasem, panoramicznymi oknami i adaptowalnym poddaszem w cenie.
              Standard: pompa ciepła, ogrzewanie podłogowe, dwa miejsca postojowe.
            </p>

            <div className="mt-7 flex flex-col gap-2.5">
              <button
                data-track="book_viewing"
                onClick={() => {
                  selectUnit(`Apartament ${unit.name}`);
                  onClose();
                }}
                className="btn btn-sun"
              >
                Zapytaj o ten apartament <Icon.arrow width={18} height={18} />
              </button>
              <div className="flex gap-2.5">
                <a href={`tel:${SITE.phone.tel}`} className="btn btn-ghost btn-sm flex-1">
                  <Icon.phone width={16} height={16} /> Zadzwoń
                </a>
                {unit.planUrl && (
                  <a href={unit.planUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm flex-1">
                    Rzut PDF
                  </a>
                )}
              </div>
            </div>

            <Link href={`/lokal/${unitSlug(unit.name)}`} className="link-underline t-meta fg-accent mt-5 inline-flex items-center gap-2">
              Pełna strona lokalu <Icon.arrow width={15} height={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
