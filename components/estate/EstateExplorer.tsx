"use client";

import { useEffect, useMemo, useState } from "react";
import { UNITS, BUILDINGS, INVESTMENT, type Unit } from "@/lib/data/units";
import { plnShort } from "@/lib/format";
import { nazwaGrupy, OFERTA, unitKind, type UnitKind } from "@/lib/unitType";
import { sectionEyebrow } from "@/lib/sections";
import { lokaleSlowo } from "@/lib/unitCopy";
import CountUp from "../CountUp";
import PlanOsiedla from "./PlanOsiedla";
import UnitCard from "./UnitCard";
import UnitModal from "./UnitModal";
import SortMenu, { type SortKey } from "./SortMenu";
import { SELECT_BUILDING_EVENT } from "@/lib/selectUnit";
import { track } from "@/lib/track";

const PREVIEW = 6;

// w raporcie ma stać nazwa, którą klientka zrozumie, a nie klucz z kodu
const OPIS_SORTOWANIA: Record<SortKey, string> = {
  "price-asc": "cena rosnąco",
  "price-desc": "cena malejąco",
  "area-asc": "metraż od najmniejszego",
  "area-desc": "metraż od największego",
};

const etykietaBudynku = (id: number) => nazwaGrupy(BUILDINGS.find((b) => b.stageId === id)?.label ?? String(id));

export default function EstateExplorer() {
  const [building, setBuilding] = useState<number | null>(null);
  const [status, setStatus] = useState<"all" | "available">("all");
  const [kind, setKind] = useState<"all" | UnitKind>("all");
  const [sort, setSort] = useState<SortKey>("price-asc");
  const [modal, setModal] = useState<Unit | null>(null);
  const [expanded, setExpanded] = useState(false);

  // klik w budynek w sekcji Osiedle ustawia filtr tutaj
  useEffect(() => {
    const onPick = (e: Event) => {
      const id = (e as CustomEvent<number>).detail;
      setBuilding(id);
      setExpanded(true);
      track("uzyj_filtra", { sekcja: "osiedle", etykieta: etykietaBudynku(id) });
    };
    window.addEventListener(SELECT_BUILDING_EVENT, onPick);
    return () => window.removeEventListener(SELECT_BUILDING_EVENT, onPick);
  }, []);

  // Filtry mówią, czego ludzie szukają: mieszkania, domu czy najtańszego lokalu.
  // Etykieta idzie w istniejącym wymiarze, żeby nie mnożyć wymiarów niestandardowych w GA4.
  const uzytoFiltra = (etykieta: string) => track("uzyj_filtra", { sekcja: "mieszkania-i-domy", etykieta });

  const wybierzRodzaj = (k: UnitKind) => {
    const v = kind === k ? "all" : k;
    setKind(v);
    uzytoFiltra(`typ: ${v === "all" ? "wszystkie" : v}`);
  };

  const filtered = useMemo(() => {
    let list = UNITS.slice();
    if (building) list = list.filter((u) => u.stageId === building);
    if (status === "available") list = list.filter((u) => u.status === "available");
    if (kind !== "all") list = list.filter((u) => unitKind(u) === kind);
    list.sort((a, b) =>
      sort === "price-asc"
        ? a.price - b.price
        : sort === "price-desc"
          ? b.price - a.price
          : sort === "area-asc"
            ? a.area - b.area
            : b.area - a.area
    );
    return list;
  }, [building, status, kind, sort]);

  // przy krotkiej liscie nie ma sensu chowac trzech kart za przyciskiem
  // Po odfiltrowaniu samych domow przycisk ma mowic "domow", a nie "lokali".
  const rodzaje = new Set(filtered.map(unitKind));
  const rzeczownikListy =
    rodzaje.size === 1
      ? lokaleSlowo([...rodzaje][0], filtered.length)
      : `${lokaleSlowo("mieszkanie", 5)} i ${lokaleSlowo("dom", 5)}`;

  const preview = filtered.length <= PREVIEW + 3 ? filtered.length : PREVIEW;
  const visible = expanded ? filtered : filtered.slice(0, preview);
  const hidden = filtered.length - visible.length;
  const clear = () => {
    setBuilding(null);
    setStatus("all");
    setKind("all");
    uzytoFiltra("wyczyszczone");
  };

  const wybierzBudynek = (id: number | null) => {
    setBuilding(id);
    uzytoFiltra(id ? etykietaBudynku(id) : "budynki: wszystkie");
    if (id) {
      setExpanded(true);
      setTimeout(() => document.getElementById("lista-lokali")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  };

  return (
    <section id="mieszkania-i-domy" className="band band-sand-2 sec">
      <div className="wrap">
        <header className="max-w-4xl" data-reveal>
          <p className="eyebrow">{sectionEyebrow("mieszkania-i-domy")}</p>
          <h2 className="t-display-l mt-6 text-balance">
            <span className="num">{OFERTA.mieszkania}</span> mieszkań i <span className="num">{OFERTA.domy}</span> domy,{" "}
            <span className="fg-accent">każdy z ogrodem</span>
          </h2>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[55fr_45fr] lg:gap-14 [&>*]:min-w-0" data-reveal>
          <PlanOsiedla selected={building} onOpen={setModal} />

          <div className="flex min-w-0 flex-col justify-between gap-9">
            <p className="t-body-l fg-muted max-w-xl text-pretty">
              Wybierz budynki, mieszkania albo domy i ustaw kolejność według ceny lub metrażu. Każdy lokal
              na planie otwiera jego rzuty i cenę.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Kpi
                value={
                  <>
                    <CountUp to={OFERTA.mieszkaniaDostepne} />
                    <span className="fg-muted"> z {OFERTA.mieszkania}</span>
                  </>
                }
                label="mieszkań dostępnych"
              />
              <Kpi
                value={
                  <>
                    <CountUp to={OFERTA.domyDostepne} />
                    <span className="fg-muted"> z {OFERTA.domy}</span>
                  </>
                }
                label="domów dostępnych"
              />
              <Kpi value={<CountUp to={INVESTMENT.buildingsCount} />} label="budynków" />
              <Kpi value={plnShort(OFERTA.cenaOd)} label="cena od" small />
            </div>

            <div className="min-w-0">
              <p className="t-meta-sm fg-muted">Budynki</p>
              <div className="no-scrollbar edge-fade -mx-1 mt-3 flex min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
                <button type="button" aria-pressed={building === null} aria-label="Wszystkie budynki" onClick={() => wybierzBudynek(null)} className="chip flex-none snap-start">
                  Wszystkie
                </button>
                {/* "2 z 4", a nie samo "2": obok stoją chipy rodzaju z liczbą wszystkich
                    lokali, więc goła liczba dostępnych czytała się jako komplet */}
                {BUILDINGS.map((b) => (
                  <button
                    key={b.stageId}
                    type="button"
                    aria-pressed={building === b.stageId}
                    onClick={() => wybierzBudynek(building === b.stageId ? null : b.stageId)}
                    className="chip flex-none snap-start"
                    aria-label={`${nazwaGrupy(b.label)}, ${b.available} z ${b.count} dostępnych`}
                  >
                    {nazwaGrupy(b.label)}
                    <span className="num">· {b.available} z {b.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="t-body fg-muted max-w-md text-pretty">
              Budynki 1, 2, 4, 5, 6, 7, 9 i 10 mają po dwa mieszkania 82-94 m² na dwóch kondygnacjach.
              Budynki środkowe (3 i 8) to domy: po dwa pięciopokojowe do 133 m², każdy z garażem
              w bryle. Poddasze jest w cenie i nie wlicza się do metrażu.
            </p>
          </div>
        </div>

        <div
          id="lista-lokali"
          tabIndex={-1}
          className="bd mt-14 flex scroll-mt-28 flex-wrap items-center justify-between gap-4 border-y py-4"
          data-reveal
        >
          <div className="no-scrollbar edge-fade -mx-1 flex w-full min-w-0 snap-x gap-2 overflow-x-auto px-1 sm:mx-0 sm:w-auto sm:flex-wrap sm:overflow-visible">
            <button type="button" aria-pressed={status === "all"} aria-label="Wszystkie statusy" onClick={() => { setStatus("all"); uzytoFiltra("status: wszystkie"); }} className="chip flex-none snap-start">
              Wszystkie
            </button>
            <button type="button" aria-pressed={status === "available"} onClick={() => { setStatus("available"); uzytoFiltra("status: dostępne"); }} className="chip flex-none snap-start">
              Dostępne
            </button>
            {/* kreska rozdziela dwie niezależne grupy: status i rodzaj. Bez niej
                wciśnięte naraz "Wszystkie" i "Domy" wyglądały na sprzeczne, a
                "Wszystkie" obiecywało pełną listę */}
            <span aria-hidden className="bd my-2 flex-none self-stretch border-l" />
            <button
              type="button"
              aria-pressed={kind === "mieszkanie"}
              aria-label={`Mieszkania, ${OFERTA.mieszkania} w ofercie`}
              onClick={() => wybierzRodzaj("mieszkanie")}
              className="chip flex-none snap-start"
            >
              Mieszkania <span className="num">· {OFERTA.mieszkania}</span>
            </button>
            <button
              type="button"
              aria-pressed={kind === "dom"}
              aria-label={`Domy, ${OFERTA.domy} w ofercie`}
              onClick={() => wybierzRodzaj("dom")}
              className="chip flex-none snap-start"
            >
              Domy <span className="num">· {OFERTA.domy}</span>
            </button>
            {(building || status !== "all" || kind !== "all") && (
              <button type="button" onClick={clear} className="chip fg-accent flex-none snap-start border-transparent">
                Wyczyść
              </button>
            )}
          </div>

          <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
            <span className="t-meta-sm fg-muted">
              {building ? `${etykietaBudynku(building)} · ` : ""}
              <span className="num fg">{filtered.length}</span> z {INVESTMENT.totalUnits}
            </span>
            <SortMenu value={sort} onChange={(v) => { setSort(v); uzytoFiltra(`sortowanie: ${OPIS_SORTOWANIA[v]}`); }} />
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
                <button
                  type="button"
                  onClick={() => {
                    setExpanded(true);
                    track("pokaz_wszystkie", { sekcja: "mieszkania-i-domy", etykieta: String(filtered.length) });
                  }}
                  className="btn btn-ghost"
                >
                  Pokaż wszystkie {filtered.length} {rzeczownikListy}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bd mt-8 border border-dashed p-12 text-center">
            <p className="fg-muted">Nic nie pasuje do wybranych filtrów.</p>
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
