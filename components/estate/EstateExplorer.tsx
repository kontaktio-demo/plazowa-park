"use client";

import { useMemo, useState } from "react";
import { UNITS, BUILDINGS, INVESTMENT, type Unit } from "@/lib/data/units";
import { plnShort } from "@/lib/format";
import { sectionEyebrow } from "@/lib/sections";
import CountUp from "../CountUp";
import EstateMap from "./EstateMap";
import UnitCard from "./UnitCard";
import UnitModal from "./UnitModal";
import SortMenu, { type SortKey } from "./SortMenu";

const PREVIEW = 6;

export default function EstateExplorer() {
  const [building, setBuilding] = useState<number | null>(null);
  const [status, setStatus] = useState<"all" | "available">("all");
  const [roomsF, setRoomsF] = useState<"all" | 4 | 5>("all");
  const [sort, setSort] = useState<SortKey>("price-asc");
  const [modal, setModal] = useState<Unit | null>(null);
  const [expanded, setExpanded] = useState(false);

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

  // przy krotkiej liscie nie ma sensu chowac trzech kart za przyciskiem
  const preview = filtered.length <= PREVIEW + 3 ? filtered.length : PREVIEW;
  const visible = expanded ? filtered : filtered.slice(0, preview);
  const hidden = filtered.length - visible.length;
  const clear = () => {
    setBuilding(null);
    setStatus("all");
    setRoomsF("all");
  };

  const onMapSelect = (id: number | null) => {
    setBuilding(id);
    if (id) {
      setExpanded(true);
      setTimeout(() => document.getElementById("lista-lokali")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  };

  const buildingLabel = building ? BUILDINGS.find((b) => b.stageId === building)?.label : null;

  return (
    <section id="lokale" className="band band-sand-2 sec">
      <div className="wrap">
        <header className="max-w-4xl" data-reveal>
          <p className="eyebrow">{sectionEyebrow("lokale")}</p>
          <h2 className="t-display-l mt-6 text-balance">
            Dwadzieścia apartamentów, <span className="fg-accent">sześć rzutów</span>
          </h2>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[55fr_45fr] lg:gap-14 [&>*]:min-w-0" data-reveal>
          <EstateMap selected={building} onSelect={onMapSelect} />

          <div className="flex min-w-0 flex-col justify-between gap-9">
            <p className="t-body-l fg-muted max-w-xl text-pretty">
              Kliknij budynek na planie osiedla albo filtruj po metrażu i liczbie pokoi. Ceny i dostępność
              pochodzą z bieżącego konfiguratora dewelopera.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Kpi value={<CountUp to={INVESTMENT.available} />} label="dostępnych" />
              <Kpi value={<CountUp to={INVESTMENT.buildingsCount} />} label="budynków" />
              <Kpi value={plnShort(INVESTMENT.priceMin)} label="cena od" small />
            </div>

            <div className="min-w-0">
              <p className="t-meta-sm fg-muted">Budynki</p>
              <div className="no-scrollbar edge-fade -mx-1 mt-3 flex min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
                <button type="button" aria-pressed={building === null} onClick={() => setBuilding(null)} className="chip flex-none snap-start">
                  Wszystkie
                </button>
                {BUILDINGS.map((b) => (
                  <button
                    key={b.stageId}
                    type="button"
                    aria-pressed={building === b.stageId}
                    onClick={() => onMapSelect(building === b.stageId ? null : b.stageId)}
                    className="chip flex-none snap-start normal-case"
                    aria-label={`Budynek ${b.label}, ${b.available} dostępnych`}
                  >
                    Budynek {b.label}
                    <span className="num opacity-60">· {b.available}</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="t-body fg-muted max-w-md text-pretty">
              Budynki narożne (1 i 2, 4 i 5, 6 i 7, 9 i 10) mieszczą po cztery apartamenty 82-94 m² na dwóch
              kondygnacjach. Budynki środkowe (3, 8) to dwa największe lokale pięciopokojowe do 133 m².
              Poddasze jest w cenie i nie wlicza się do metrażu.
            </p>
          </div>
        </div>

        <div
          id="lista-lokali"
          className="bd mt-14 flex scroll-mt-28 flex-wrap items-center justify-between gap-4 border-y py-4"
          data-reveal
        >
          <div className="no-scrollbar edge-fade -mx-1 flex w-full min-w-0 snap-x gap-2 overflow-x-auto px-1 sm:mx-0 sm:w-auto sm:flex-wrap sm:overflow-visible">
            <button type="button" aria-pressed={status === "all"} onClick={() => setStatus("all")} className="chip flex-none snap-start">
              Wszystkie
            </button>
            <button type="button" aria-pressed={status === "available"} onClick={() => setStatus("available")} className="chip flex-none snap-start">
              Dostępne
            </button>
            <button type="button" aria-pressed={roomsF === 4} onClick={() => setRoomsF(roomsF === 4 ? "all" : 4)} className="chip flex-none snap-start">
              4 pokoje
            </button>
            <button type="button" aria-pressed={roomsF === 5} onClick={() => setRoomsF(roomsF === 5 ? "all" : 5)} className="chip flex-none snap-start">
              5 pokoi
            </button>
            {(building || status !== "all" || roomsF !== "all") && (
              <button type="button" onClick={clear} className="chip fg-accent flex-none snap-start border-transparent">
                Wyczyść
              </button>
            )}
          </div>

          <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
            <span className="t-meta-sm fg-muted">
              {buildingLabel ? `Budynek ${buildingLabel} · ` : ""}
              <span className="num fg">{filtered.length}</span> z {INVESTMENT.totalUnits}
            </span>
            <SortMenu value={sort} onChange={setSort} />
          </div>
        </div>

        {filtered.length > 0 ? (
          <>
            <div
              className="mt-8 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
              data-reveal="stagger"
            >
              {visible.map((u, i) => (
                <div key={u.id} className="h-full" style={{ transitionDelay: `${Math.min(i, 9) * 60}ms` }}>
                  <UnitCard unit={u} onOpen={setModal} />
                </div>
              ))}
            </div>
            {hidden > 0 && (
              <div className="mt-9 flex justify-center">
                <button type="button" onClick={() => setExpanded(true)} className="btn btn-ghost">
                  Pokaż wszystkie {filtered.length} apartamentów
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bd mt-8 border border-dashed p-12 text-center">
            <p className="fg-muted">Brak lokali dla wybranych filtrów.</p>
            <button type="button" onClick={clear} className="btn btn-ghost btn-sm mt-5">
              Wyczyść filtry
            </button>
          </div>
        )}
      </div>

      <UnitModal unit={modal} onClose={() => setModal(null)} />
    </section>
  );
}

function Kpi({ value, label, small }: { value: React.ReactNode; label: string; small?: boolean }) {
  return (
    <div className="card min-w-0 p-4">
      <div className={`num leading-none ${small ? "font-display text-lg font-semibold" : "t-display-m"}`}>{value}</div>
      <div className="t-meta-sm fg-muted mt-2.5">{label}</div>
    </div>
  );
}
