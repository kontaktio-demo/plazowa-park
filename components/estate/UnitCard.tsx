"use client";

import Image from "next/image";
import Link from "next/link";
import type { Unit } from "@/lib/data/units";
import { plnShort, area, STATUS_META } from "@/lib/format";
import { unitSlug } from "@/lib/slug";
import { selectUnit } from "@/lib/selectUnit";
import { planImage, unitPlace } from "@/lib/unitType";
import UnitPosition from "./UnitPosition";
import { Icon } from "../Icons";

/**
 * Na telefonie karta jest poziomym wierszem katalogu - dwadzieścia lokali da się
 * wtedy przejrzeć kciukiem zamiast przewijać dziewięć ekranów. Od `sm` w górę
 * wraca układ pionowy z dużym rzutem.
 */
export default function UnitCard({ unit, onOpen }: { unit: Unit; onOpen: (u: Unit) => void }) {
  const s = STATUS_META[unit.status];
  const place = unitPlace(unit);

  return (
    <article className="card card-hover flex h-full flex-row overflow-hidden sm:flex-col">
      <Link
        href={`/mieszkania-i-domy/${unitSlug(unit.name)}`}
        className="relative block w-[38%] flex-none self-stretch overflow-hidden bg-sand-50 sm:aspect-4/3 sm:w-full"
        aria-label={`Zobacz mieszkanie ${unit.name}`}
      >
        <Image
          src={planImage(unit)}
          alt={`Rzut mieszkania ${unit.name}, typ ${place.type}`}
          fill
          sizes="(max-width: 640px) 40vw, (max-width: 1280px) 50vw, 30vw"
          className="object-contain p-3 sm:p-5"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col p-3.5 sm:p-5">
        {/* status zawsze nad tytułem: każda karta ma identyczne wiersze, więc
            metryki i ceny stoją w jednej linii w całym rzędzie */}
        <span className="t-meta-sm fg-muted flex items-center gap-1.5">
          <span className="status-dot" style={{ background: s.color }} />
          {s.label}
        </span>
        <h3 className="t-title mt-1.5 text-[1.15rem] sm:text-[1.375rem]">
          <Link href={`/mieszkania-i-domy/${unitSlug(unit.name)}`} className="hover:text-(--band-accent)">
            Mieszkanie {unit.name}
          </Link>
        </h3>

        <UnitPosition unit={unit} className="mt-3 max-w-40 sm:mt-4 sm:max-w-none" />

        {/* hairline między kolumnami, żeby etykiety nie czytały się jako jeden ciąg */}
        <dl className="mt-3 grid grid-cols-2 gap-x-5 gap-y-3 sm:mt-5 sm:gap-y-4 [&>*:nth-child(even)]:border-l [&>*:nth-child(even)]:border-(--band-line) [&>*:nth-child(even)]:pl-5">
          <Spec label="Powierzchnia" value={area(unit.area)} />
          <Spec label="Ogród" value={area(unit.garden)} />
          {/* na telefonie liczba pokoi i budynek są już w modalu i na stronie lokalu */}
          <Spec label="Pokoje" value={String(unit.rooms)} className="hidden sm:block" />
          <Spec label="Budynek" value={unit.buildingLabel} className="hidden sm:block" />
        </dl>

        <div className="bd mt-auto flex items-end justify-between gap-3 border-t pt-3 sm:pt-4">
          <div className="min-w-0">
            <div className="t-display-m num text-[1.4rem] leading-none sm:text-[clamp(1.75rem,2.5vw,2.5rem)]">
              {plnShort(unit.price)}
            </div>
            <div className="t-meta-sm fg-muted num mt-1.5 sm:mt-2">{plnShort(unit.pricePerM)}/m²</div>
          </div>
        </div>

        {/* Wyrozniony jest podglad lokalu, nie zapytanie: zapytanie przewija na
            formularz na koncu strony, wiec jako dominujaca akcja karty wygladalo
            jak wyrzucenie uzytkownika z listy. */}
        <div className="mt-3 flex gap-2.5 sm:mt-4">
          <button onClick={() => onOpen(unit)} className="btn btn-solid btn-sm flex-1">
            Szczegóły
          </button>
          <button onClick={() => selectUnit(`Mieszkanie ${unit.name}`)} className="btn btn-ghost btn-sm flex-1">
            Zapytaj <Icon.arrow width={16} height={16} className="hidden sm:block" />
          </button>
        </div>
      </div>
    </article>
  );
}

function Spec({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="t-meta-sm fg-muted">{label}</dt>
      <dd className="mt-1 font-medium wrap-break-word">{value}</dd>
    </div>
  );
}
