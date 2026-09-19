// Teksty o lokalu liczone z realnych danych (metraż, ogród, pokoje, cena). Bez
// wymyślonych faktów.
//
// Podstrony miały wcześniej dodatkowo blok "O mieszkaniu X": pięć akapitów
// składanych z wariantów zdań, powielonych w dwudziestu odsłonach. Mówiły to samo,
// co tabela parametrów obok i sekcje strony głównej, więc zniknęły razem
// z generatorem.

import type { Unit } from "@/lib/data/units";
import { area, odmien, plnShort, rooms } from "@/lib/format";
import { garageArea, ODMIANA, OFERTA, unitKind, unitLabel, type UnitKind } from "@/lib/unitType";

// ODMIANA niesie tylko liczbę pojedynczą, a zestawienia potrzebują mnogiej.
const MNOGA: Record<UnitKind, [string, string, string]> = {
  mieszkanie: ["mieszkanie", "mieszkania", "mieszkań"],
  dom: ["dom", "domy", "domów"],
};

/** "mieszkań" dla 16, "domy" dla 4 - do liczb branych z OFERTA. */
export const lokaleSlowo = (kind: UnitKind, n: number) => odmien(n, MNOGA[kind]);

/** "16 mieszkań i 4 domy" - skład oferty liczony z danych, nie wpisany w tekst. */
export const OFERTA_TEKST = `${OFERTA.mieszkania} ${lokaleSlowo("mieszkanie", OFERTA.mieszkania)} i ${OFERTA.domy} ${lokaleSlowo("dom", OFERTA.domy)}`;

// Schema.org availability, full 3-state mapping (reserved -> PreOrder, not SoldOut).
/** Przy sprzedanym lokalu pytanie "o ten dom" brzmi jak oferta czegoś, czego nie ma. */
export function ctaPytanie(u: Unit): string {
  const o = ODMIANA[unitKind(u)];
  return u.status === "sold" ? `Zapytaj o podobne ${o.mianownik}` : `Zapytaj o ${o.wskazujacy}`;
}

export function schemaAvailability(status: Unit["status"]): string {
  return status === "available"
    ? "https://schema.org/InStock"
    : status === "reserved"
      ? "https://schema.org/PreOrder"
      : "https://schema.org/SoldOut";
}

// ~150-char meta/OG description, enriched with the unit's real numbers.
//
// Przy lokalu sprzedanym albo zarezerwowanym opis nie podaje ceny ofertowej ani
// "w cenie": w wynikach wyszukiwania czytało się to jak zaproszenie do kupna
// czegoś, czego nie ma. Liczby zostają, bo to nadal opis tej nieruchomości.
export function unitMetaDescription(u: Unit): string {
  const garaz = garageArea(u) ? `, garaż ${area(garageArea(u))}` : "";
  const podstawa = `${unitLabel(u)}: ${area(u.area)}, ${rooms(u.rooms)}, ogród ${area(u.garden)}${garaz}`;
  const ogon = "Plażowa Park, Głowno nad Zalewem Mrożyczka.";
  if (u.status === "sold") return `${podstawa}. Ten lokal jest już sprzedany - sprawdź dostępne mieszkania i domy. ${ogon}`;
  if (u.status === "reserved") return `${podstawa}. Ten lokal jest zarezerwowany - sprawdź dostępne mieszkania i domy. ${ogon}`;
  return `${podstawa}, taras i poddasze w cenie. Cena ${plnShort(u.price)}. ${ogon}`;
}
