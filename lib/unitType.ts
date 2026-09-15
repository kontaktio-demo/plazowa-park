import { UNITS, type Unit } from "./data/units";
import { RZUTY, type Kondygnacja } from "./data/rzuty";

/**
 * Numer lokalu dewelopera koduje realną pozycję w bryle: `4.1A` to dom 4,
 * segment 1, strona A. Segment + strona dają sześć powtarzalnych typów
 * (1A, 1B, 2A, 2B, 3A, 3B) - dokładnie tyle, ile jest rzutów. Zamiast udawać,
 * że każdy z 20 lokali ma własny rzut, podpisujemy typ i pokazujemy pozycję.
 */
export type UnitPlace = {
  /** numer domu w osiedlu, np. "4" */
  house: string;
  /** segment bryły: 1, 2 (budynek narożny) albo 3 (budynek środkowy) */
  segment: string;
  /** strona segmentu: A albo B */
  side: string;
  /** kod typu rzutu, np. "1A" */
  type: string;
};

export function unitPlace(unit: Unit): UnitPlace {
  const [house = "", rest = ""] = unit.name.split(".");
  const segment = rest.slice(0, -1);
  const side = rest.slice(-1);
  return { house, segment, side, type: `${segment}${side}` };
}

export type UnitKind = "mieszkanie" | "dom";

/**
 * Budynki środkowe (segment 3) to cztery domy: pięć pokoi, garaż w bryle i dwa
 * razy większy metraż niż lokale w budynkach narożnych. Deweloper nazywa w API
 * wszystkie dwadzieścia lokali "flat", więc rodzaj wyprowadzamy tak samo jak
 * garaż - z numeru lokalu, a nie z pola, którego w danych nie ma.
 */
export function unitKind(unit: Unit): UnitKind {
  return unitPlace(unit).segment === "3" ? "dom" : "mieszkanie";
}

/** Formy, których potrzebują teksty: "Dom 3.3A", "Zapytaj o ten dom", "O domu". */
export const ODMIANA: Record<UnitKind, { mianownik: string; dopelniacz: string; miejscownik: string; wskazujacy: string }> = {
  mieszkanie: { mianownik: "mieszkanie", dopelniacz: "mieszkania", miejscownik: "mieszkaniu", wskazujacy: "to mieszkanie" },
  dom: { mianownik: "dom", dopelniacz: "domu", miejscownik: "domu", wskazujacy: "ten dom" },
};

/** "Mieszkanie 2.2B" albo "Dom 3.3A" - używane też jako wpis w formularzu kontaktu. */
export function unitLabel(unit: Unit): string {
  const n = ODMIANA[unitKind(unit)].mianownik;
  return `${n[0].toUpperCase()}${n.slice(1)} ${unit.name}`;
}

const policz = (kind: UnitKind) => UNITS.filter((u) => unitKind(u) === kind);

/** Liczby do nagłówków i statystyk - z danych, nie wpisane w tekst. */
export const OFERTA = {
  mieszkania: policz("mieszkanie").length,
  domy: policz("dom").length,
  mieszkaniaDostepne: policz("mieszkanie").filter((u) => u.status === "available").length,
  domyDostepne: policz("dom").filter((u) => u.status === "available").length,
} as const;

/** Podgląd lokalu na listach: izometryczny render parteru. */
export function planImage(unit: Unit): string {
  return `/rzuty/typ-${unitPlace(unit).type}-parter-render.webp`;
}

export type RzutKondygnacji = Kondygnacja & { render: string; techniczny: string };

/**
 * Obie kondygnacje lokalu: render izometryczny, rysunek techniczny i wykaz
 * pomieszczeń. Strona pokazywała wcześniej sam parter i odsyłała po resztę do PDF.
 */
export function unitFloors(unit: Unit): RzutKondygnacji[] {
  const typ = unitPlace(unit).type;
  return (RZUTY[typ] ?? []).map((k) => {
    const plik = k.nazwa === "Parter" ? "parter" : "pietro";
    return {
      ...k,
      render: `/rzuty/typ-${typ}-${plik}-render.webp`,
      techniczny: `/rzuty/typ-${typ}-${plik}-techniczny.webp`,
    };
  });
}

/**
 * Lokale w segmencie 3 (budynki środkowe) mają garaż wliczony w metraż. Wynika
 * to wprost z rzutów dewelopera: w 8.3A.pdf i 3.3B.pdf pozycja "garaż 17.61"
 * stoi w wykazie pomieszczeń parteru, a suma pozycji daje deklarowane 133,03
 * i 127,28 m². Bez rozbicia strona pokazywałaby garaż jako powierzchnię
 * mieszkalną i liczyła od niej cenę za metr.
 *
 * Pole nie może wejść do units.ts, bo ten plik jest generowany z API dewelopera.
 */
const GARAZ_M2 = 17.61;

export function garageArea(unit: Unit): number {
  return unitPlace(unit).segment === "3" ? GARAZ_M2 : 0;
}

/** Powierzchnia bez garażu, czyli ta, w której faktycznie się mieszka. */
export function livingArea(unit: Unit): number {
  return Math.round((unit.area - garageArea(unit)) * 100) / 100;
}

/** Wszystkie lokale budynku w kolejności numeracji dewelopera. */
export function buildingUnits(stageId: number): Unit[] {
  return UNITS.filter((u) => u.stageId === stageId).sort((a, b) => a.name.localeCompare(b.name, "pl", { numeric: true }));
}
