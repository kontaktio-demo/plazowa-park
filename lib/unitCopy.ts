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
import { area, odmien, plnShort, rooms, STATUS_META } from "@/lib/format";
import { garageArea, ODMIANA, OFERTA, unitKind, unitLabel, unitPlace, type UnitKind } from "@/lib/unitType";

// ODMIANA niesie tylko liczbę pojedynczą, a zestawienia potrzebują mnogiej.
const MNOGA: Record<UnitKind, [string, string, string]> = {
  mieszkanie: ["mieszkanie", "mieszkania", "mieszkań"],
  dom: ["dom", "domy", "domów"],
};

const wielka = (t: string) => `${t[0].toUpperCase()}${t.slice(1)}`;

/** "mieszkań" dla 16, "domy" dla 4 - do liczb branych z OFERTA. */
export const lokaleSlowo = (kind: UnitKind, n: number) => odmien(n, MNOGA[kind]);

/** "16 mieszkań i 4 domy" - skład oferty liczony z danych, nie wpisany w tekst. */
export const OFERTA_TEKST = `${OFERTA.mieszkania} ${lokaleSlowo("mieszkanie", OFERTA.mieszkania)} i ${OFERTA.domy} ${lokaleSlowo("dom", OFERTA.domy)}`;

// Schema.org availability, full 3-state mapping (reserved -> PreOrder, not SoldOut).
export function schemaAvailability(status: Unit["status"]): string {
  return status === "available"
    ? "https://schema.org/InStock"
    : status === "reserved"
      ? "https://schema.org/PreOrder"
      : "https://schema.org/SoldOut";
}

// ~150-char meta/OG description, enriched with the unit's real numbers.
export function unitMetaDescription(u: Unit): string {
  const garaz = garageArea(u) ? `, garaż ${area(garageArea(u))}` : "";
  return `${unitLabel(u)}: ${area(u.area)}, ${rooms(u.rooms)}, ogród ${area(u.garden)}${garaz}, taras i poddasze w cenie. Cena ${plnShort(u.price)}. Plażowa Park, Głowno nad Zalewem Mrożyczka.`;
}

// Structurally varied, attribute-driven prose (~260-330 words, 5 paragraphs).
export function unitDescription(u: Unit): string[] {
  const kind = unitKind(u);
  const o = ODMIANA[kind];
  const dom = kind === "dom";
  const L = unitLabel(u);
  const A = area(u.area);
  const G = area(u.garden);
  const R = rooms(u.rooms);
  const P = plnShort(u.price);
  const PM = plnShort(u.pricePerM);
  const bl = unitPlace(u).house;
  const status = STATUS_META[u.status].label.toLowerCase();
  // W domach garaż siedzi w metrażu lokalu, więc podajemy go wprost przy powierzchni.
  const pow = dom ? `${A} razem z garażem ${area(garageArea(u))}` : A;
  const postoj = dom ? "dwa miejsca postojowe i garaż" : "dwa miejsca postojowe";

  const introV = [
    `${L} to ${R} o powierzchni ${pow} w kameralnym osiedlu Plażowa Park w Głownie.`,
    `${A}, ${R} i własny ogród ${G} - tak w skrócie prezentuje się ${o.mianownik} ${u.name} w Plażowa Park w Głownie.`,
    `W ${dom ? "środkowym budynku" : "budynku"} ${bl} osiedla Plażowa Park w Głownie znajduje się ${o.mianownik} ${u.name} o powierzchni ${pow} (${R}).`,
    `${L} (${A}, ${R}) otwiera się na prywatny ogród ${G} i taras z panoramicznymi oknami.`,
  ];

  const buildingV = dom
    ? [
        `To jeden z dwóch domów w środkowym budynku ${bl}, z garażem wpisanym w bryłę.`,
        `Środkowy budynek ${bl} mieści dwa pięciopokojowe domy z garażem - największe w osiedlu.`,
        `To jeden z zaledwie ${OFERTA.domy} domów w osiedlu; w środkowym budynku ${bl} stoją tylko dwa domy.`,
      ]
    : [
        `Budynek ${bl} mieści tylko dwa mieszkania, co zapewnia kameralność i prywatność.`,
        `To jedno z zaledwie dwóch mieszkań w budynku ${bl}, z minimalną liczbą sąsiadów.`,
        `Kameralny budynek ${bl} to jedynie dwa mieszkania - spokój i prywatność na co dzień.`,
      ];

  // Metraż ogrodu pochodzi z pola API `total_area`. Nazwa pola jest myląca
  // ("Powierzchnia całkowita" w słowniku konfiguratora), ale wartości są
  // prawidłowe: wszystkie 17 dostępnych rzutów PDF dewelopera podaje
  // "OGRÓD <x> m²" dokładnie równe temu polu.
  const gardenV =
    u.garden > 100
      ? [
          `Prywatny ogród ${G} to rzadkość przy ${o.miejscownik} tej wielkości - dość miejsca na strefę wypoczynku, zabawę dzieci i własne nasadzenia.`,
          `Do ${o.dopelniacz} należy wyjątkowo duży, prywatny ogród ${G} oraz taras z panoramicznymi oknami.`,
        ]
      : u.garden >= 70
        ? [
            `Prywatny ogród ${G} i taras z panoramicznymi oknami dają komfortową przestrzeń na wypoczynek na świeżym powietrzu.`,
            `Własny ogród ${G} oraz taras tworzą wygodną, zieloną strefę tuż przy wejściu.`,
          ]
        : [
            `Kameralny ogród ${G} i taras z panoramicznymi oknami tworzą prywatną, zieloną strefę przy wejściu.`,
            `Do ${o.dopelniacz} należy przytulny ogród ${G} z tarasem - zieleń na wyłączność.`,
          ];

  const standardV = [
    `Układ na ${u.floors} kondygnacjach uzupełnia poddasze w cenie, które zaadaptujesz na sypialnię, gabinet lub pokój do zabawy. Ogrzewanie zapewniają pompa ciepła i instalacja podłogowa, a rekuperacja i fotowoltaika są opcją dodatkowo płatną; do ${o.dopelniacz} należą ${postoj}.`,
    `Do dyspozycji masz ${u.floors} kondygnacje oraz adaptowalne poddasze wliczone w cenę - idealne na dodatkowy pokój lub domowe biuro. Standard jest energooszczędny: pompa ciepła i ogrzewanie podłogowe, a rekuperacja oraz fotowoltaika pozostają opcją dodatkowo płatną. Parkowanie rozwiązują ${postoj}.`,
    `Rozkład na ${u.floors} kondygnacjach dopełnia poddasze w cenie. Elewacja z elastycznej cegły, tynku najwyższej klasy i blachy na rąbek idzie w parze z pompą ciepła i ogrzewaniem podłogowym; w komplecie ${postoj}.`,
  ];

  const locLead = [
    `Największym atutem ${o.dopelniacz} ${u.name} jest lokalizacja.`,
    `To, co wyróżnia ten adres, to okolica.`,
    `O wartości ${o.dopelniacz} ${u.name} decyduje też sąsiedztwo.`,
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
    `Plażowa Park to kameralne osiedle w sosnowym lesie: ${OFERTA_TEKST} z prywatnymi ogrodami. Cisza lasu i sąsiedztwo wody sprawiają, że ${o.mianownik} sprawdzi się i na co dzień, i na weekendy poza Łodzią.`,
    `${OFERTA_TEKST}, prywatne ogrody i cisza sosnowego lasu - Plażowa Park łączy spokój z rekreacją nad wodą w zasięgu aglomeracji łódzkiej. Kameralna skala osiedla to mało sąsiadów i bezpieczne otoczenie dla dzieci.`,
    `Osiedle liczy ${OFERTA_TEKST} z prywatnymi ogrodami, w otoczeniu ponad 100-letniego lasu i tuż przy Zalewie Mrożyczka. To propozycja zarówno na stałe mieszkanie blisko natury, jak i na drugi dom nad wodą niedaleko Łodzi, z pełnym zapleczem rekreacyjnym za progiem.`,
  ];

  const valueV = [
    `Poddasze jest wliczone w cenę, ale nie w metraż, więc realnie zyskujesz przestrzeń ponad ${A} do własnej aranżacji. Ogród i taras stają się przedłużeniem salonu wiosną i latem, a rozkład na ${u.floors} kondygnacjach oddziela strefę dzienną od prywatnej.`,
    `W cenie ${P} otrzymujesz nie tylko ${A} i ${R}, ale też adaptowalne poddasze poza metrażem oraz prywatny ogród ${G}, a ${postoj} rozwiązują codzienny problem parkowania.`,
    `Przy cenie ${PM}/m² ${o.mianownik} ${u.name} łączy prywatny ogród, taras i poddasze w cenie z energooszczędnym standardem, dzięki czemu koszty utrzymania pozostają niskie. To połączenie metrażu ${A}, zieleni na wyłączność i dojazdu do centrum Łodzi w granicach 32 km.`,
  ];

  const cta =
    u.status === "available"
      ? `Umów prezentację, aby zobaczyć ${o.wskazujacy} i poznać warunki zakupu.`
      : u.status === "reserved"
        ? `${wielka(o.wskazujacy)} ma już rezerwację - zapytaj o dostępność podobnych.`
        : `Nie ma już ${o.dopelniacz} ${u.name} w ofercie - sprawdź pozostałe mieszkania i domy w osiedlu.`;
  const closeV = [
    `Cena ${o.dopelniacz} ${u.name}: ${P} (${PM}/m²), status: ${status}. Poddasze poza metrażem i prywatny ogród realnie podnoszą wartość tej oferty. ${cta}`,
    `${P} (${PM}/m²) - tyle kosztuje ${o.mianownik} ${u.name}, status: ${status}. ${cta}`,
    `${L} wyceniono na ${P}, czyli ${PM}/m² (status: ${status}). W tej cenie mieści się poddasze do adaptacji oraz ${postoj}. ${cta}`,
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
