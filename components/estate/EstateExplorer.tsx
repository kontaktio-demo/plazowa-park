"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { UNITS, INVESTMENT, type Unit } from "@/lib/data/units";
import { plnShort, area, STATUS_META } from "@/lib/format";
import { unitSlug } from "@/lib/slug";
import { OFERTA, garageArea, unitKind, unitLabel, unitPlace } from "@/lib/unitType";
import { sectionEyebrow } from "@/lib/sections";
import { track } from "@/lib/track";
import {
  etykietaSortu,
  NAZWA_KOLUMNY,
  posortuj,
  PRESETY,
  przefiltruj,
  sortDoUrl,
  sortZUrl,
  type Kolumna,
  type Rodzaj,
} from "@/lib/sortowanie";
import { useStanListy } from "@/lib/stanListy";
import PlanOsiedla from "./PlanOsiedla";
import SortMenu from "./SortMenu";

const wierszId = (u: Unit) => `lokal-${unitSlug(u.name)}`;

const ZAJETE = UNITS.filter((u) => u.status !== "available").length;

const OPCJE_SORTU = PRESETY.map((s) => ({ key: sortDoUrl(s), label: etykietaSortu(s) }));

// kolumny, które da się sortować klikiem w nagłówek
const KOLUMNY: { l: string; k?: Kolumna }[] = [
  { l: "Mieszkanie lub dom" },
  { l: "Rodzaj" },
  { l: "Budynek", k: "budynek" },
  { l: "Powierzchnia", k: "metraz" },
  { l: "Pokoje" },
  { l: "Ogród", k: "ogrod" },
  { l: "Cena", k: "cena" },
  { l: "Cena za m²", k: "cenam2" },
  { l: "Status" },
];

/**
 * Jedyne miejsce z danymi lokali na stronie głównej: plan osiedla i jedna lista.
 * Filtry i sortowanie siedzą w adresie (lib/stanListy.ts), więc widok da się
 * podlinkować, a wejście bez parametrów pokazuje to, po co ludzie tu przychodzą:
 * lokale, które realnie można kupić.
 */
export default function EstateExplorer() {
  const [stan, ustaw] = useStanListy();
  const { rodzaj, tylkoDostepne, sort } = stan;
  const [podswietlony, setPodswietlony] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const uzytoFiltra = (etykieta: string) => track("uzyj_filtra", { sekcja: "mieszkania-i-domy", etykieta });

  const lista = useMemo(() => posortuj(przefiltruj(UNITS, rodzaj, tylkoDostepne), sort), [rodzaj, tylkoDostepne, sort]);

  const wybierzRodzaj = (r: Rodzaj) => {
    ustaw({ rodzaj: r });
    uzytoFiltra(`typ: ${r}`);
  };

  const przelaczDostepne = (v: boolean) => {
    ustaw({ tylkoDostepne: v });
    uzytoFiltra(`status: ${v ? "tylko dostępne" : "wszystkie"}`);
  };

  const ustawSort = (klucz: string) => {
    ustaw({ sort: sortZUrl(klucz) });
    uzytoFiltra(`sortowanie: ${etykietaSortu(sortZUrl(klucz))}`);
  };

  // drugi klik w ten sam nagłówek odwraca kierunek; nowa kolumna startuje od
  // kolejności, która przy niej ma sens (ceny i metraże od najmniejszych)
  const klikNaglowek = (k: Kolumna) => {
    const d = sort.k === k ? (sort.d === "asc" ? "desc" : "asc") : "asc";
    ustaw({ sort: { k, d } });
    uzytoFiltra(`sortowanie: ${etykietaSortu({ k, d })}`);
  };

  // Klik w lokal na planie prowadzi do jego wiersza, a nie do osobnego okna.
  // Filtry, które mogłyby ten wiersz ukryć, wracają do stanu wyjściowego.
  const pokazWTabeli = (u: Unit) => {
    if (rodzaj !== "wszystkie" || (tylkoDostepne && u.status !== "available")) {
      ustaw({ rodzaj: "wszystkie", tylkoDostepne: u.status === "available" && tylkoDostepne });
    }
    setPodswietlony(u.name);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPodswietlony(null), 4000);
    requestAnimationFrame(() => {
      const wiersz = document.getElementById(wierszId(u));
      wiersz?.scrollIntoView({ behavior: "smooth", block: "center" });
      wiersz?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    });
  };

  const kierunek = (k?: Kolumna) => (k && sort.k === k ? (sort.d === "asc" ? "ascending" : "descending") : undefined);

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
            <button type="button" aria-pressed={rodzaj === "wszystkie"} onClick={() => wybierzRodzaj("wszystkie")} className="chip flex-none snap-start">
              Wszystkie
            </button>
            <button
              type="button"
              aria-pressed={rodzaj === "mieszkania"}
              aria-label={`Mieszkania, ${OFERTA.mieszkania} w ofercie`}
              onClick={() => wybierzRodzaj("mieszkania")}
              className="chip flex-none snap-start"
            >
              Mieszkania <span className="num">· {OFERTA.mieszkania}</span>
            </button>
            <button
              type="button"
              aria-pressed={rodzaj === "domy"}
              aria-label={`Domy, ${OFERTA.domy} w ofercie`}
              onClick={() => wybierzRodzaj("domy")}
              className="chip flex-none snap-start"
            >
              Domy <span className="num">· {OFERTA.domy}</span>
            </button>
            {/* kreska rozdziela dwie niezależne grupy: rodzaj i dostępność */}
            <span aria-hidden className="bd my-2 flex-none self-stretch border-l" />
            <button
              type="button"
              aria-pressed={tylkoDostepne}
              onClick={() => przelaczDostepne(!tylkoDostepne)}
              className="chip flex-none snap-start"
            >
              Tylko dostępne
            </button>
          </div>

          <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
            <span className="t-meta-sm fg-muted">
              <span className="num fg">{lista.length}</span> z {INVESTMENT.totalUnits}
            </span>
            <SortMenu opcje={OPCJE_SORTU} value={sortDoUrl(sort)} etykieta={etykietaSortu(sort)} onChange={ustawSort} />
          </div>
        </div>

        {/* Co domyślny filtr chowa i jak go zdjąć - jednym zdaniem, bez szukania chipa */}
        <p className="t-meta-sm fg-muted mt-4">
          {tylkoDostepne ? (
            <>
              <span className="num">{ZAJETE}</span> z <span className="num">{INVESTMENT.totalUnits}</span> już
              sprzedanych lub zarezerwowanych{" "}
              <button type="button" onClick={() => przelaczDostepne(false)} className="link-underline fg-accent">
                pokaż wszystkie
              </button>
            </>
          ) : (
            <>
              Pokazujesz wszystkie <span className="num">{INVESTMENT.totalUnits}</span>{" "}
              <button type="button" onClick={() => przelaczDostepne(true)} className="link-underline fg-accent">
                pokaż tylko dostępne
              </button>
            </>
          )}
        </p>

        {/* Jedna lista w dwóch układach: od `lg` zwykła tabela, niżej wiersze
            rozkładają się na karty, a etykieta komórki wraca jako tekst obok wartości. */}
        <div className="mt-6" data-reveal>
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Zestawienie mieszkań i domów: metraż, ogród, cena i status</caption>
            <thead className="hidden lg:table-header-group">
              <tr className="bd border-y">
                {KOLUMNY.map((kol) => (
                  <th
                    key={kol.l}
                    scope="col"
                    aria-sort={kierunek(kol.k)}
                    className="t-label py-3 pr-4 font-medium"
                  >
                    {kol.k ? (
                      <button
                        type="button"
                        onClick={() => klikNaglowek(kol.k!)}
                        className="flex items-center gap-1.5 hover:text-(--band-accent)"
                        aria-label={`Sortuj: ${NAZWA_KOLUMNY[kol.k]} ${sort.k === kol.k && sort.d === "asc" ? "malejąco" : "rosnąco"}`}
                      >
                        {kol.l}
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                          className={`transition-[opacity,transform] ${
                            sort.k === kol.k ? "fg-accent opacity-100" : "opacity-0"
                          } ${sort.k === kol.k && sort.d === "desc" ? "rotate-180" : ""}`}
                        >
                          <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                      </button>
                    ) : (
                      kol.l
                    )}
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
