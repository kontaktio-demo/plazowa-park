"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { UNITS } from "@/lib/data/units";
import { plnShort, area, STATUS_META } from "@/lib/format";
import { unitSlug } from "@/lib/slug";
import { selectUnit } from "@/lib/selectUnit";
import { unitKind, unitLabel, garageArea } from "@/lib/unitType";
import SectionHeader from "../SectionHeader";

/** Numeracja dewelopera sama układa lokale budynkami: 1.1A, 1.1B, 2.2A, 2.2B, 3.3A... */
const LOKALE = [...UNITS].sort((a, b) => a.name.localeCompare(b.name, "pl", { numeric: true }));

const KOLUMNY = ["Lokal", "Rodzaj", "Budynek", "Powierzchnia", "Pokoje", "Ogród", "Cena", "Cena za m²", "Status"];

/**
 * Jedno zestawienie wszystkich lokali. Ta sama tabela obsługuje oba układy: od `lg`
 * to zwykła tabela z nagłówkami, niżej wiersze rozkładają się na karty, a etykieta
 * każdej komórki wraca jako tekst obok wartości. Dzięki temu nie ma drugiego
 * kompletu znaczników ani poziomego przewijania na telefonie.
 */
export default function Cennik() {
  return (
    <section id="cennik" className="band band-sand sec">
      <div className="wrap">
        <SectionHeader
          id="cennik"
          title={
            <>
              Ceny <span className="fg-accent">wszystkich lokali</span>
            </>
          }
          lead={`Metraż, ogród, cena i status każdego z ${UNITS.length} lokali w jednym zestawieniu.`}
        />

        <div className="mt-10 sm:mt-12" data-reveal>
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Cennik i dostępność lokali w osiedlu Plażowa Park</caption>
            <thead className="hidden lg:table-header-group">
              <tr className="bd border-y">
                {KOLUMNY.map((k) => (
                  <th key={k} scope="col" className="t-label py-3 pr-4 font-medium">
                    {k}
                  </th>
                ))}
                <th scope="col" className="py-3">
                  <span className="sr-only">Zapytanie o lokal</span>
                </th>
              </tr>
            </thead>
            <tbody className="block lg:table-row-group">
              {LOKALE.map((u) => {
                const s = STATUS_META[u.status];
                const garaz = garageArea(u);
                return (
                  <tr
                    key={u.id}
                    className="card bd mb-4 block p-4 lg:mb-0 lg:table-row lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0"
                  >
                    <th
                      scope="row"
                      className="bd block pb-2 text-left font-normal lg:table-cell lg:border-b lg:pt-3 lg:pr-4 lg:pb-3"
                    >
                      <Link
                        href={`/mieszkania-i-domy/${unitSlug(u.name)}`}
                        className="t-title hover:text-(--band-accent) lg:text-base"
                      >
                        {unitLabel(u)}
                      </Link>
                    </th>
                    <Komorka label="Rodzaj">{unitKind(u) === "dom" ? "Dom" : "Mieszkanie"}</Komorka>
                    <Komorka label="Budynek">{u.buildingLabel}</Komorka>
                    <Komorka label="Powierzchnia">
                      <span className="num">{area(u.area)}</span>
                      {garaz > 0 && (
                        <span className="t-meta-sm fg-muted num block">w tym garaż {area(garaz)}</span>
                      )}
                    </Komorka>
                    <Komorka label="Pokoje">{u.rooms}</Komorka>
                    <Komorka label="Ogród">
                      <span className="num">{area(u.garden)}</span>
                    </Komorka>
                    <Komorka label="Cena">
                      <span className="num font-medium">{plnShort(u.price)}</span>
                    </Komorka>
                    <Komorka label="Cena za m²">
                      <span className="num">{plnShort(u.pricePerM)}</span>
                    </Komorka>
                    <Komorka label="Status">
                      <span className="inline-flex items-center gap-2">
                        <span className="status-dot" style={{ background: s.color }} />
                        {s.label}
                      </span>
                    </Komorka>
                    <td className="bd block pt-3 lg:table-cell lg:border-b lg:py-3">
                      <button
                        type="button"
                        data-track="book_viewing"
                        data-miejsce="cennik"
                        data-lokal={u.name}
                        onClick={() => selectUnit(unitLabel(u))}
                        className="btn btn-ghost btn-sm w-full lg:w-auto"
                      >
                        Zapytaj
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p className="t-meta fg-muted mt-8 max-w-2xl text-pretty">
            Ceny brutto (z VAT). Cenę każdego lokalu aktualizujemy przy każdej zmianie u dewelopera.{" "}
            <a href="/ceny-ofertowe.csv" className="link-underline fg-accent">
              Dane w formacie otwartym (CSV)
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

function Komorka({ label, children }: { label: string; children: ReactNode }) {
  return (
    <td className="bd flex items-baseline justify-between gap-4 border-t py-2.5 lg:table-cell lg:border-t-0 lg:border-b lg:py-3 lg:pr-4 lg:text-sm">
      <span className="t-label fg-muted lg:hidden">{label}</span>
      <span className="text-right lg:text-left">{children}</span>
    </td>
  );
}
