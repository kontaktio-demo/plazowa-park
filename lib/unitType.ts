import { UNITS, type Unit } from "./data/units";

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

/** Rzut typu, do którego należy lokal. Sześć rzutów obsługuje dwadzieścia lokali. */
export function planImage(unit: Unit): string {
  return `/unit-views/typ-${unitPlace(unit).type}.webp`;
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
