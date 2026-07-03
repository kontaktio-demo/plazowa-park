"use client";

import { useMemo, useRef, useState } from "react";
import { UNITS, BUILDINGS, INVESTMENT, type Unit } from "@/lib/data/units";
import { plnShort, area } from "@/lib/format";
import EstateMap from "./EstateMap";
import UnitCard from "./UnitCard";
import UnitModal from "./UnitModal";

type Sort = "price-asc" | "price-desc" | "area-desc";

export default function EstateExplorer() {
  const [building, setBuilding] = useState<number | null>(null);
  const [status, setStatus] = useState<"all" | "available">("all");
  const [roomsF, setRoomsF] = useState<"all" | 4 | 5>("all");
  const [sort, setSort] = useState<Sort>("price-asc");
  const [modal, setModal] = useState<Unit | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let list = UNITS.slice();
    if (building) list = list.filter((u) => u.stageId === building);
    if (status === "available") list = list.filter((u) => u.status === "available");
    if (roomsF !== "all") list = list.filter((u) => u.rooms === roomsF);
    list.sort((a, b) =>
      sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : b.area - a.area
    );
    return list;
  }, [building, status, roomsF, sort]);

  const onMapSelect = (id: number | null) => {
    setBuilding(id);
    if (id) setTimeout(() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const buildingLabel = building ? BUILDINGS.find((b) => b.stageId === building)?.label : null;

  return (
    <section id="lokale" className="bg-paper-2 py-20 sm:py-28">
      <div className="container-x">
        <header className="max-w-2xl" data-reveal="up">
          <p className="eyebrow">02 — Wybierz dom</p>
          <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-pine">
            Dwadzieścia apartamentów. <span className="italic text-brass-deep">Wybierz swój.</span>
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted">
            Kliknij budynek na planie osiedla lub filtruj lokale według metrażu i liczby pokoi. Ceny i statusy
            pochodzą z bieżącego konfiguratora dewelopera.
          </p>
        </header>

        {/* map + summary */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_1fr]" data-reveal="up">
          <EstateMap selected={building} onSelect={onMapSelect} />

          <div className="flex flex-col justify-center">
            <div className="grid grid-cols-3 gap-4">
              <Kpi n={`${INVESTMENT.available}`} l="dostępnych" />
              <Kpi n={`${INVESTMENT.buildingsCount}`} l="budynków" />
              <Kpi n={`od ${plnShort(INVESTMENT.priceMin)}`} l="cena" small />
            </div>

            <p className="mt-7 text-sm font-medium uppercase tracking-[0.14em] text-faint">Budynki</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <BuildingChip active={building === null} onClick={() => setBuilding(null)}>
                Wszystkie
              </BuildingChip>
              {BUILDINGS.map((b) => (
                <BuildingChip key={b.stageId} active={building === b.stageId} onClick={() => onMapSelect(b.stageId)}>
                  {b.label}
                  <span className="ml-1.5 text-brass-deep num">{b.available}</span>
                </BuildingChip>
              ))}
            </div>

            <p className="mt-7 max-w-md text-sm leading-relaxed text-muted">
              Budynki narożne (1&nbsp;i&nbsp;2, 4&nbsp;i&nbsp;5, 6&nbsp;i&nbsp;7, 9&nbsp;i&nbsp;10) mieszczą po cztery
              apartamenty 82–94&nbsp;m². Budynki środkowe (3, 8) to dwa największe lokale pięciopokojowe do 133&nbsp;m².
            </p>
          </div>
        </div>

        {/* filter bar */}
        <div ref={gridRef} className="mt-14 flex scroll-mt-24 flex-wrap items-center justify-between gap-4 border-y border-ink/10 py-4" data-reveal="fade">
          <div className="flex flex-wrap items-center gap-2">
            <Toggle active={status === "all"} onClick={() => setStatus("all")}>Wszystkie</Toggle>
            <Toggle active={status === "available"} onClick={() => setStatus("available")}>Dostępne</Toggle>
            <span className="mx-1 h-5 w-px bg-ink/10" />
            <Toggle active={roomsF === "all"} onClick={() => setRoomsF("all")}>Pokoje: wszystkie</Toggle>
            <Toggle active={roomsF === 4} onClick={() => setRoomsF(4)}>4 pok.</Toggle>
            <Toggle active={roomsF === 5} onClick={() => setRoomsF(5)}>5 pok.</Toggle>
            {(building || status !== "all" || roomsF !== "all") && (
              <button
                onClick={() => { setBuilding(null); setStatus("all"); setRoomsF("all"); }}
                className="ml-1 text-sm text-brass-deep underline underline-offset-2 hover:text-pine"
              >
                Wyczyść
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">
              {buildingLabel ? `Budynek ${buildingLabel} · ` : ""}
              <span className="num font-medium text-ink">{filtered.length}</span> z {INVESTMENT.totalUnits}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-full border border-ink/15 bg-paper px-4 py-2 text-sm text-ink-soft focus:border-pine focus:outline-none"
              aria-label="Sortowanie"
            >
              <option value="price-asc">Cena: rosnąco</option>
              <option value="price-desc">Cena: malejąco</option>
              <option value="area-desc">Metraż: największe</option>
            </select>
          </div>
        </div>

        {/* grid */}
        {filtered.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((u) => (
              <UnitCard key={u.id} unit={u} onOpen={setModal} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[16px] border border-dashed border-ink/15 p-14 text-center text-muted">
            Brak lokali dla wybranych filtrów.{" "}
            <button onClick={() => { setBuilding(null); setStatus("all"); setRoomsF("all"); }} className="text-brass-deep underline">
              Wyczyść filtry
            </button>
          </div>
        )}

        <p className="mt-6 text-xs text-faint">
          Powierzchnia „Ogród” wg konfiguratora dewelopera (pole total_area). Ceny i dostępność potwierdzamy w biurze
          sprzedaży — dane mają charakter poglądowy i nie stanowią oferty w rozumieniu art. 66 Kodeksu cywilnego.
        </p>
      </div>

      <UnitModal unit={modal} onClose={() => setModal(null)} />
    </section>
  );
}

function Kpi({ n, l, small }: { n: string; l: string; small?: boolean }) {
  return (
    <div className="rounded-[14px] border border-ink/10 bg-paper p-4">
      <div className={`font-display text-pine num ${small ? "text-lg" : "text-3xl"}`}>{n}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.12em] text-muted">{l}</div>
    </div>
  );
}

function BuildingChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
        active ? "border-pine bg-pine text-paper" : "border-ink/15 bg-paper text-ink-soft hover:border-pine"
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
        active ? "bg-pine text-paper" : "text-ink-soft hover:bg-sand"
      }`}
    >
      {children}
    </button>
  );
}
