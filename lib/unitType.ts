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

/** Wszystkie lokale budynku w kolejności numeracji dewelopera. */
export function buildingUnits(stageId: number): Unit[] {
  return UNITS.filter((u) => u.stageId === stageId).sort((a, b) => a.name.localeCompare(b.name, "pl", { numeric: true }));
}
