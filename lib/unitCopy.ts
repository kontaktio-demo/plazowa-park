// Per-unit SEO copy generated deterministically from REAL unit attributes
// (metraż, ogród, pokoje, kondygnacje, cena, budynek). No invented facts:
// every sentence is driven by data in lib/data/units.ts or verified osiedle
// features. Variation (corner/middle building, garden tier, rotated location
// emphasis by unit seed, status) keeps all 20 descriptions genuinely unique
// and above the ~250-word threshold, avoiding thin/duplicate content.

import type { Unit } from "@/lib/data/units";
import { area, plnShort, rooms, STATUS_META } from "@/lib/format";

// Schema.org availability with the full 3-state mapping (matches JsonLd.tsx).
export function schemaAvailability(status: Unit["status"]): string {
  return status === "available"
    ? "https://schema.org/InStock"
    : status === "reserved"
      ? "https://schema.org/PreOrder"
      : "https://schema.org/SoldOut";
}

// Corner buildings house four apartments (label like "1 i 2"); middle buildings
// (labels "3", "8") hold the two largest 5-room units.
export function isCornerBuilding(u: Unit): boolean {
  return u.buildingLabel.includes(" i ");
}

// ~150-char meta/OG description, enriched with the unit's real numbers.
export function unitMetaDescription(u: Unit): string {
  return `Apartament ${u.name}: ${area(u.area)}, ${rooms(u.rooms)}, ogród ${area(
    u.garden
  )}, taras i poddasze w cenie. Cena ${plnShort(u.price)}. Plażowa Park, Głowno nad Zalewem Mrożyczka.`;
}

// 5 paragraphs of unique, attribute-driven prose (~260-320 words).
export function unitDescription(u: Unit): string[] {
  const corner = isCornerBuilding(u);
  const seed = u.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const A = area(u.area);
  const G = area(u.garden);
  const R = rooms(u.rooms);
  const P = plnShort(u.price);
  const PM = plnShort(u.pricePerM);
  const status = STATUS_META[u.status].label.toLowerCase();

  const buildingLine = corner
    ? `Mieści się w narożnym budynku ${u.buildingLabel}, w którym znajdują się zaledwie cztery apartamenty, co zapewnia wyjątkową kameralność i prywatność.`
    : `To jeden z dwóch największych, pięciopokojowych apartamentów w środkowym budynku ${u.buildingLabel} osiedla.`;

  const gardenLine =
    u.garden > 100
      ? `Prywatny ogród o powierzchni ${G} to rzadkość w zabudowie wielorodzinnej - wystarczająco dużo miejsca na strefę wypoczynku, zabawę dzieci i własne nasadzenia.`
      : u.garden >= 70
        ? `Do apartamentu należy prywatny ogród ${G} oraz taras z panoramicznymi oknami - komfortowa przestrzeń na wypoczynek na świeżym powietrzu.`
        : `Kameralny ogród ${G} i taras z panoramicznymi oknami tworzą prywatną, zieloną strefę tuż przy wejściu.`;

  const pool = [
    "Zalew Mrożyczka z piaszczystą plażą i strzeżonym kąpieliskiem leży w zasięgu spaceru od osiedla.",
    "Ponad 100-letni sosnowy las otacza inwestycję, dając cień i czyste powietrze przez cały rok.",
    "W sąsiedztwie działa Central Wake Park, jeden z najważniejszych ośrodków wakeboardingu w Polsce.",
    "Ścieżki rowerowe wokół zalewu i w lesie zachęcają do codziennej rekreacji tuż za progiem.",
    "Do centrum Łodzi dojedziesz w około 30 minut - samochodem przez węzeł autostrady A1 w Strykowie lub koleją aglomeracyjną ŁKA ze stacji Głowno.",
    "Restauracje, szkoły i przychodnie w Głownie znajdują się w krótkim dystansie od osiedla.",
  ];
  const loc: string[] = [];
  for (let i = 0; i < 3; i++) loc.push(pool[(seed + i) % pool.length]);

  const closing =
    u.status === "available"
      ? "Skontaktuj się z biurem sprzedaży, aby umówić prezentację i poznać szczegóły oraz warunki zakupu."
      : u.status === "reserved"
        ? "Apartament jest obecnie zarezerwowany - zapytaj o dostępność podobnych lokali w tym samym budynku."
        : "Ten apartament został sprzedany - sprawdź pozostałe dostępne lokale w osiedlu Plażowa Park.";

  return [
    `Apartament ${u.name} oferuje ${R} na powierzchni ${A} w kameralnym osiedlu Plażowa Park w Głownie. ${buildingLine} ${gardenLine}`,
    `Układ obejmuje ${u.floors} kondygnacje, a w cenie zawarte jest adaptowalne poddasze, które urządzisz według własnego pomysłu - jako dodatkową sypialnię, domowy gabinet lub przestrzeń rekreacyjną. Apartament powstaje w energooszczędnym standardzie: pompa ciepła i ogrzewanie podłogowe w cenie, z opcją rekuperacji i fotowoltaiki, a do lokalu przypisane są dwa miejsca postojowe. Elewacja z tynku najwyższej klasy i elastycznej cegły oraz dach z blachy na rąbek stojący nadają budynkom nowoczesny, trwały charakter.`,
    `Największym atutem apartamentu ${u.name} jest jednak lokalizacja. ${loc.join(" ")}`,
    `Plażowa Park to kameralna inwestycja zaledwie 20 apartamentów, stworzona z myślą o rodzinach, które cenią bliskość natury i codzienny komfort. Prywatny ogród, taras i cisza sosnowego lasu sprawiają, że to miejsce sprawdzi się zarówno na całoroczne mieszkanie, jak i na apartament rekreacyjny nad wodą w zasięgu Łodzi.`,
    `Cena apartamentu ${u.name} to ${P} (${PM}/m²), a jego aktualny status to: ${status}. ${closing}`,
  ];
}
