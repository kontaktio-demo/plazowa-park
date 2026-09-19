import type { Unit } from "./data/units";
import { unitKind, unitPlace } from "./unitType";

/**
 * Jeden model sortowania dla listy: kolumna plus kierunek. Nagłówki tabeli i menu
 * sortowania sterują tym samym stanem, a stan idzie do adresu jako `sort=cena-asc`,
 * więc link do widoku da się wysłać komuś dalej.
 */
export type Kolumna = "budynek" | "metraz" | "ogrod" | "cena" | "cenam2";
type Kierunek = "asc" | "desc";
export type Sort = { k: Kolumna; d: Kierunek };

export const NAZWA_KOLUMNY: Record<Kolumna, string> = {
  budynek: "Budynek",
  metraz: "Metraż",
  ogrod: "Ogród",
  cena: "Cena",
  cenam2: "Cena za m²",
};

const WARTOSC: Record<Kolumna, (u: Unit) => number> = {
  budynek: (u) => Number(unitPlace(u).house),
  metraz: (u) => u.area,
  ogrod: (u) => u.garden,
  cena: (u) => u.price,
  cenam2: (u) => u.pricePerM,
};

export const DOMYSLNY_SORT: Sort = { k: "cena", d: "asc" };

/** Sześć gotowych ustawień w menu. Nagłówki kolumn dają też pozostałe kombinacje. */
export const PRESETY: Sort[] = [
  { k: "cena", d: "asc" },
  { k: "cena", d: "desc" },
  { k: "metraz", d: "asc" },
  { k: "metraz", d: "desc" },
  { k: "ogrod", d: "desc" },
  { k: "cenam2", d: "asc" },
];

export const sortDoUrl = (s: Sort) => `${s.k}-${s.d}`;

export function sortZUrl(v: string | null): Sort {
  const [k, d] = (v ?? "").split("-");
  if (k in NAZWA_KOLUMNY && (d === "asc" || d === "desc")) return { k: k as Kolumna, d };
  return DOMYSLNY_SORT;
}

export const etykietaSortu = (s: Sort) => `${NAZWA_KOLUMNY[s.k]} ${s.d === "asc" ? "rosnąco" : "malejąco"}`;

/** Kolejność w tabeli. Przy remisie decyduje numeracja dewelopera, żeby lista nie skakała. */
export function posortuj(lista: Unit[], s: Sort): Unit[] {
  const kier = s.d === "asc" ? 1 : -1;
  return [...lista].sort(
    (a, b) =>
      (WARTOSC[s.k](a) - WARTOSC[s.k](b)) * kier || a.name.localeCompare(b.name, "pl", { numeric: true })
  );
}

export type Rodzaj = "wszystkie" | "mieszkania" | "domy";

export function przefiltruj(lista: Unit[], rodzaj: Rodzaj, tylkoDostepne: boolean): Unit[] {
  return lista.filter(
    (u) =>
      (rodzaj === "wszystkie" || (rodzaj === "domy" ? unitKind(u) === "dom" : unitKind(u) === "mieszkanie")) &&
      (!tylkoDostepne || u.status === "available")
  );
}
