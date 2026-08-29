// Per-unit SEO copy generated deterministically from REAL unit attributes
// (metraż, ogród, pokoje, kondygnacje, cena, budynek). No invented facts.
//
// Uniqueness is STRUCTURAL, not just numeric: every slot (intro, building,
// garden, standard, location, osiedle, closing) has several phrasing variants
// picked by the unit's seed with distinct offsets, the location paragraph
// rotates a different subset of sentences per unit, and the paragraph ORDER
// itself is one of three arrangements. Two units therefore differ in skeleton,
// not only in the numbers swapped in - avoiding boilerplate/spun-content signals.

import type { Unit } from "@/lib/data/units";
import { UNITS } from "@/lib/data/units";
import { area, plnShort, rooms, STATUS_META } from "@/lib/format";

// Schema.org availability, full 3-state mapping (reserved -> PreOrder, not SoldOut).
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
  return `Mieszkanie ${u.name}: ${area(u.area)}, ${rooms(u.rooms)}, ogród ${area(u.garden)}, taras i poddasze w cenie. Cena ${plnShort(u.price)}. Plażowa Park, Głowno nad Zalewem Mrożyczka.`;
}

// Structurally varied, attribute-driven prose (~260-330 words, 5 paragraphs).
export function unitDescription(u: Unit): string[] {
  const corner = isCornerBuilding(u);
  const A = area(u.area);
  const G = area(u.garden);
  const R = rooms(u.rooms);
  const P = plnShort(u.price);
  const PM = plnShort(u.pricePerM);
  const bl = u.buildingLabel;
  const status = STATUS_META[u.status].label.toLowerCase();

  const introV = [
    `Mieszkanie ${u.name} to ${R} o powierzchni ${A} w kameralnym osiedlu Plażowa Park w Głownie.`,
    `${A}, ${R} i własny ogród ${G} - tak w skrócie prezentuje się mieszkanie ${u.name} w Plażowa Park w Głownie.`,
    `W ${corner ? "narożnym" : "środkowym"} budynku ${bl} osiedla Plażowa Park w Głownie znajduje się mieszkanie ${u.name} o powierzchni ${A} (${R}).`,
    `Mieszkanie ${u.name} (${A}, ${R}) otwiera się na prywatny ogród ${G} i taras z panoramicznymi oknami.`,
  ];

  const buildingV = corner
    ? [
        `Narożny budynek ${bl} mieści tylko cztery mieszkania, co zapewnia kameralność i prywatność.`,
        `To jeden z zaledwie czterech lokali w narożnym budynku ${bl}, z minimalną liczbą sąsiadów.`,
        `Kameralny, narożny budynek ${bl} to jedynie cztery mieszkania - spokój i prywatność na co dzień.`,
      ]
    : [
        `To jedno z dwóch największych, pięciopokojowych mieszkań w środkowym budynku ${bl}.`,
        `Środkowy budynek ${bl} mieści dwa najbardziej przestronne, pięciopokojowe lokale.`,
        `Należy do dwóch największych, pięciopokojowych mieszkań w środkowym budynku ${bl}.`,
      ];

  // Metraż ogrodu pochodzi z pola API `total_area`. Nazwa pola jest myląca
  // ("Powierzchnia całkowita" w słowniku konfiguratora), ale wartości są
  // prawidłowe: wszystkie 17 dostępnych rzutów PDF dewelopera podaje
  // "OGRÓD <x> m²" dokładnie równe temu polu.
  const gardenV =
    u.garden > 100
      ? [
          `Prywatny ogród ${G} to rzadkość przy mieszkaniu tej wielkości - dość miejsca na strefę wypoczynku, zabawę dzieci i własne nasadzenia.`,
          `Do lokalu należy wyjątkowo duży, prywatny ogród ${G} oraz taras z panoramicznymi oknami.`,
        ]
      : u.garden >= 70
        ? [
            `Prywatny ogród ${G} i taras z panoramicznymi oknami dają komfortową przestrzeń na wypoczynek na świeżym powietrzu.`,
            `Własny ogród ${G} oraz taras tworzą wygodną, zieloną strefę tuż przy wejściu.`,
          ]
        : [
            `Kameralny ogród ${G} i taras z panoramicznymi oknami tworzą prywatną, zieloną strefę przy wejściu.`,
            `Do mieszkania należy przytulny ogród ${G} z tarasem - zieleń na wyłączność.`,
          ];

  const standardV = [
    `Układ na ${u.floors} kondygnacjach uzupełnia poddasze w cenie, które zaadaptujesz na sypialnię, gabinet lub pokój do zabawy. Ogrzewanie zapewniają pompa ciepła i instalacja podłogowa, a rekuperacja i fotowoltaika pozostają opcją na etapie budowy; do lokalu należą dwa miejsca postojowe.`,
    `Do dyspozycji masz ${u.floors} kondygnacje oraz adaptowalne poddasze wliczone w cenę - idealne na dodatkowy pokój lub domowe biuro. Standard jest energooszczędny: pompa ciepła, ogrzewanie podłogowe i dwa miejsca postojowe, a rekuperacja oraz fotowoltaika pozostają opcją.`,
    `Rozkład na ${u.floors} kondygnacjach dopełnia poddasze w cenie. Elewacja z elastycznej cegły, tynku najwyższej klasy i blachy na rąbek idzie w parze z pompą ciepła i ogrzewaniem podłogowym; w komplecie dwa miejsca postojowe.`,
  ];

  const locLead = [
    `Największym atutem mieszkania ${u.name} jest lokalizacja.`,
    `To, co wyróżnia ten adres, to okolica.`,
    `O wartości mieszkania ${u.name} decyduje też sąsiedztwo.`,
  ];
  const locPool = [
    "Zalew Mrożyczka z piaszczystą plażą i strzeżonym kąpieliskiem leży w zasięgu spaceru od osiedla.",
    "Ponad 100-letni sosnowy las otacza inwestycję, dając cień i czyste powietrze przez cały rok.",
    "W sąsiedztwie działa Central Wake Park, jeden z najważniejszych ośrodków wakeboardingu w Polsce.",
    "Ścieżki rowerowe wokół zalewu i w lesie zachęcają do codziennej rekreacji tuż za progiem.",
    "Do centrum Łodzi jest około 32 km drogą krajową 14 przez Stryków, a Stryków z węzłem autostradowym leży 11 km od osiedla.",
    "Restauracje, szkoły i przychodnie w Głownie znajdują się w krótkim dystansie od osiedla.",
  ];
  // Independent dispersion: each slot is driven by a DIFFERENT real attribute
  // mixed with the unit index, so two units almost never share the full
  // skeleton (not just the numbers). idx guarantees consecutive units differ.
  const idx = Math.max(0, UNITS.findIndex((x) => x.id === u.id));
  const ai = Math.round(u.area);
  const gi = Math.round(u.garden);
  const pi = Math.round(u.price / 1000);

  const locStart = (idx + gi) % locPool.length;
  const loc = [0, 1, 2, 3].map((i) => locPool[(locStart + i) % locPool.length]);
  const locationPara = `${locLead[(idx + ai) % locLead.length]} ${loc.join(" ")}`;

  const osiedleV = [
    `Plażowa Park to kameralne osiedle zaledwie 20 domów, stworzone dla rodzin ceniących bliskość natury i codzienny komfort. Prywatne ogrody, cisza sosnowego lasu i sąsiedztwo wody sprawiają, że lokal sprawdzi się i na całoroczne mieszkanie, i na dom rekreacyjny w zasięgu Łodzi.`,
    `Zaledwie 20 domów, prywatne ogrody i cisza sosnowego lasu - Plażowa Park łączy spokój z rekreacją nad wodą w zasięgu aglomeracji łódzkiej. Kameralna skala osiedla to mało sąsiadów i bezpieczne otoczenie dla dzieci.`,
    `Osiedle liczy tylko 20 domów z prywatnymi ogrodami, w otoczeniu ponad 100-letniego lasu i tuż przy Zalewie Mrożyczka. To propozycja zarówno na stałe mieszkanie blisko natury, jak i na drugi dom nad wodą niedaleko Łodzi, z pełnym zapleczem rekreacyjnym za progiem.`,
  ];

  const valueV = [
    `Poddasze jest wliczone w cenę, ale nie w metraż, więc realnie zyskujesz przestrzeń ponad ${A} do własnej aranżacji. Ogród i taras stają się przedłużeniem salonu wiosną i latem, a ${R} rozłożone na ${u.floors} kondygnacjach daje wygodny podział na strefę dzienną i prywatną.`,
    `W cenie ${P} otrzymujesz nie tylko ${A} i ${R}, ale też adaptowalne poddasze poza metrażem oraz prywatny ogród ${G} - to wymierna wartość względem mieszkań bez własnej zieleni, a dwa miejsca postojowe rozwiązują codzienny problem parkowania.`,
    `Przy cenie ${PM}/m² mieszkanie ${u.name} łączy prywatny ogród, taras i poddasze w cenie z energooszczędnym standardem, dzięki czemu koszty utrzymania pozostają niskie. To rzadkie połączenie metrażu ${A}, zieleni na wyłączność i dojazdu do centrum Łodzi w granicach 32 km.`,
  ];

  const cta =
    u.status === "available"
      ? "Umów prezentację, aby zobaczyć lokal i poznać warunki zakupu."
      : u.status === "reserved"
        ? "Lokal jest obecnie zarezerwowany - zapytaj o dostępność podobnych mieszkań."
        : "Ten lokal został sprzedany - sprawdź pozostałe dostępne mieszkania w osiedlu.";
  const closeV = [
    `Cena mieszkania ${u.name}: ${P} (${PM}/m²), status: ${status}. Poddasze poza metrażem i prywatny ogród realnie podnoszą wartość tej oferty. ${cta}`,
    `${P} (${PM}/m²) - tyle kosztuje mieszkanie ${u.name} (status: ${status}). To konkurencyjna stawka jak na mieszkanie z własnym ogrodem nad wodą w regionie łódzkim. ${cta}`,
    `Mieszkanie ${u.name} wyceniono na ${P}, czyli ${PM}/m² (status: ${status}). W tej cenie mieści się poddasze do adaptacji oraz dwa miejsca postojowe. ${cta}`,
  ];

  const pIntro = `${introV[(idx + ai) % introV.length]} ${buildingV[(idx + pi) % buildingV.length]} ${gardenV[(idx + gi) % gardenV.length]}`;
  const pStandard = standardV[(idx + u.floors) % standardV.length];
  const pOsiedle = osiedleV[(idx + u.rooms) % osiedleV.length];
  const pClose = closeV[(idx + pi) % closeV.length];
  const pValue = valueV[(idx + u.rooms + ai) % valueV.length];

  // Vary the order of the four middle paragraphs so the skeleton differs per
  // unit; intro stays first (used as the lead) and close stays last.
  const arrangement = (idx + ai + gi) % 3;
  if (arrangement === 0) return [pIntro, pStandard, pValue, locationPara, pOsiedle, pClose];
  if (arrangement === 1) return [pIntro, locationPara, pStandard, pOsiedle, pValue, pClose];
  return [pIntro, pOsiedle, locationPara, pValue, pStandard, pClose];
}
