"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { UNITS, INVESTMENT, type Unit } from "@/lib/data/units";
import { plnShort, area, STATUS_META } from "@/lib/format";
import { unitSlug } from "@/lib/slug";
import { OFERTA, garageArea, unitKind, unitLabel, unitPlace, type UnitKind } from "@/lib/unitType";
import { sectionEyebrow } from "@/lib/sections";
import { track } from "@/lib/track";
import PlanOsiedla from "./PlanOsiedla";
import SortMenu, { type SortKey } from "./SortMenu";

/** Numeracja dewelopera sama układa lokale budynkami: 1.1A, 1.1B, 2.2A, 2.2B, 3.3A... */
const LOKALE = [...UNITS].sort((a, b) => a.name.localeCompare(b.name, "pl", { numeric: true }));

const KOLUMNY = ["Mieszkanie lub dom", "Rodzaj", "Budynek", "Powierzchnia", "Pokoje", "Ogród", "Cena", "Cena za m²", "Status"];

// w raporcie ma stać nazwa, którą klientka zrozumie, a nie klucz z kodu
const OPIS_SORTOWANIA: Record<SortKey, string> = {
  "price-asc": "cena rosnąco",
  "area-desc": "metraż malejąco",
};

const wierszId = (u: Unit) => `lokal-${unitSlug(u.name)}`;

/**
 * Jedyne miejsce z danymi lokali na stronie głównej: plan osiedla i jedna lista.
 * Wcześniej te same dwadzieścia lokali stało w trzech sekcjach (karty budynków,
 * siatka kart z filtrami, tabela cennika), każda z własnymi filtrami i własnym
 * sposobem wejścia w szczegóły.
 */
export default function EstateExplorer() {
  const [kind, setKind] = useState<"all" | UnitKind>("all");
  const [tylkoDostepne, setTylkoDostepne] = useState(false);
  const [sort, setSort] = useState<SortKey>("price-asc");
  const [podswietlony, setPodswietlony] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const uzytoFiltra = (etykieta: string) => track("uzyj_filtra", { sekcja: "mieszkania-i-domy", etykieta });

  const lista = useMemo(() => {
    const out = LOKALE.filter(
      (u) => (kind === "all" || unitKind(u) === kind) && (!tylkoDostepne || u.status === "available")
    );
    out.sort((a, b) => (sort === "price-asc" ? a.price - b.price : b.area - a.area));
    return out;
  }, [kind, tylkoDostepne, sort]);

  const wybierzRodzaj = (k: "all" | UnitKind) => {
    setKind(k);
    uzytoFiltra(`typ: ${k === "all" ? "wszystkie" : k}`);
  };

  // Klik w lokal na planie prowadzi do jego wiersza, a nie do osobnego okna.
  // Filtry, które mogłyby ten wiersz ukryć, wracają do stanu wyjściowego.
  const pokazWTabeli = (u: Unit) => {
    setKind("all");
    setTylkoDostepne(false);
    setPodswietlony(u.name);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPodswietlony(null), 4000);
    requestAnimationFrame(() => {
      const wiersz = document.getElementById(wierszId(u));
      wiersz?.scrollIntoView({ behavior: "smooth", block: "center" });
      wiersz?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    });
  };

  return (
    <section id="mieszkania-i-domy" className="band band-sand-2 sec">
      <div className="wrap">
        <header className="max-w-3xl" data-reveal>
          <p className="eyebrow">{sectionEyebrow("mieszkania-i-domy")}</p>
          <h2 className="t-display-l mt-6 text-balance">
            <span className="num">{OFERTA.mieszkania}</span> mieszkań i <span className="num">{OFERTA.domy}</span> domy,{" "}
            <span className="fg-accent">każdy z ogrodem</span>
          </h2>
          <p className="t-body-l fg-muted mt-6 text-pretty">
            Osiedle to {OFERTA.mieszkania} mieszkań i {OFERTA.domy} domy w {INVESTMENT.buildingsCount} budynkach, każde
            z prywatnym ogrodem, tarasem i dwoma miejscami postojowymi. Osiem budynków ma po dwa mieszkania, dwa
            środkowe po dwa domy z garażem.
          </p>
        </header>

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-[55fr_45fr] lg:gap-14 [&>*]:min-w-0" data-reveal>
          <PlanOsiedla onOpen={pokazWTabeli} />

          <div className="flex min-w-0 flex-col justify-center gap-8">
            {/* Liczby renderuje serwer, bez animacji od zera: przed uruchomieniem
                skryptów strona pokazywała "0 z 16 dostępnych" */}
            <div className="grid grid-cols-3 gap-3">
              <Kpi value={String(INVESTMENT.available)} label="dostępnych" />
              <Kpi value={String(INVESTMENT.totalUnits)} label="wszystkich" />
              <Kpi value={plnShort(OFERTA.cenaOd)} label="cena od" small />
            </div>
            <p className="t-body fg-muted max-w-md text-pretty">
              Kliknij mieszkanie albo dom na planie, żeby zobaczyć jego wiersz w zestawieniu. Z wiersza wejdziesz na
              stronę lokalu z rzutami obu kondygnacji.
            </p>
          </div>
        </div>

        <div
          id="lista-lokali"
          tabIndex={-1}
          className="bd mt-12 flex scroll-mt-28 flex-wrap items-center justify-between gap-4 border-y py-4"
          data-reveal
        >
          <div className="no-scrollbar edge-fade -mx-1 flex w-full min-w-0 snap-x gap-2 overflow-x-auto px-1 sm:mx-0 sm:w-auto sm:flex-wrap sm:overflow-visible">
            <button type="button" aria-pressed={kind === "all"} onClick={() => wybierzRodzaj("all")} className="chip flex-none snap-start">
              Wszystkie
            </button>
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
            {/* kreska rozdziela dwie niezależne grupy: rodzaj i dostępność */}
            <span aria-hidden className="bd my-2 flex-none self-stretch border-l" />
            <button
              type="button"
              aria-pressed={tylkoDostepne}
              onClick={() => {
                const v = !tylkoDostepne;
                setTylkoDostepne(v);
                uzytoFiltra(`status: ${v ? "tylko dostępne" : "wszystkie"}`);
              }}
              className="chip flex-none snap-start"
            >
              Tylko dostępne
            </button>
          </div>

          <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
            <span className="t-meta-sm fg-muted">
              <span className="num fg">{lista.length}</span> z {INVESTMENT.totalUnits}
            </span>
            <SortMenu value={sort} onChange={(v) => { setSort(v); uzytoFiltra(`sortowanie: ${OPIS_SORTOWANIA[v]}`); }} />
          </div>
        </div>

        {/* Jedna lista w dwóch układach: od `lg` zwykła tabela, niżej wiersze
            rozkładają się na karty, a etykieta komórki wraca jako tekst obok wartości. */}
        <div className="mt-8" data-reveal>
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Zestawienie mieszkań i domów: metraż, ogród, cena i status</caption>
            <thead className="hidden lg:table-header-group">
              <tr className="bd border-y">
                {KOLUMNY.map((k) => (
                  <th key={k} scope="col" className="t-label py-3 pr-4 font-medium">
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="block lg:table-row-group">
              {lista.map((u) => {
                const s = STATUS_META[u.status];
                const garaz = garageArea(u);
                const wybrany = podswietlony === u.name;
                return (
                  <tr
                    key={u.id}
                    id={wierszId(u)}
                    className={`card bd mb-4 block scroll-mt-28 p-4 transition-colors lg:mb-0 lg:table-row lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 ${
                      wybrany ? "bg-sun/20 lg:[&>*]:bg-sun/20" : ""
                    }`}
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
                    <Komorka label="Budynek">{unitPlace(u).house}</Komorka>
                    <Komorka label="Powierzchnia">
                      <span className="num">{area(u.area)}</span>
                      {garaz > 0 && <span className="t-meta-sm fg-muted num block">w tym garaż {area(garaz)}</span>}
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
                  </tr>
                );
              })}
            </tbody>
          </table>

          {lista.length === 0 && (
            <p className="bd fg-muted border border-dashed p-12 text-center">Nic nie pasuje do wybranych filtrów.</p>
          )}

          <p className="t-meta fg-muted mt-8 max-w-2xl text-pretty">
            Ceny brutto (z VAT). Cenę każdego mieszkania i domu aktualizujemy przy każdej zmianie u dewelopera.{" "}
            <a href="/ceny-ofertowe.csv" rel="nofollow" className="link-underline fg-accent">
              Dane w formacie otwartym (CSV)
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

function Kpi({ value, label, small }: { value: string; label: string; small?: boolean }) {
  return (
    <div className="card min-w-0 p-4">
      <div className={`num leading-none ${small ? "font-display text-lg font-semibold" : "t-display-m"}`}>{value}</div>
      <div className="t-meta-sm fg-muted mt-2.5">{label}</div>
    </div>
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
