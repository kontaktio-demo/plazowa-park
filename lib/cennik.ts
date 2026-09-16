import historia from "./data/historia-cen.json";
import { DEVELOPER, SITE } from "./data/site";
import { UNITS, type Unit } from "./data/units";
import { unitKind } from "./unitType";

/**
 * Cennik w układzie wzorcowego pliku Ministerstwa Cyfryzacji (58 kolumn, średnik,
 * UTF-8) oraz manifest XML dla harvestera dane.gov.pl. Wszystko liczone z
 * `lib/data/units.ts` i `lib/data/historia-cen.json`, więc plik na stronie nadąża
 * za panelem dewelopera bez ręcznej pracy.
 *
 * Moduł jest czysty (żadnego I/O), żeby dało się go sprawdzić bez budowania aplikacji.
 */

export type Wpis = { od: string; cena: number; cenaM2: number };

const LOKALE = historia.lokale as Record<string, Wpis[]>;

/** Pierwszy dzień, na który mamy cennik. Wcześniejszych cen deweloper nam nie przekazał. */
export const START = historia.start;

/** Znak umowny portalu: "wypełnienie pozycji jest niemożliwe lub niecelowe". */
const BRAK = "X";

const KOLUMNY = [
  "Nazwa dewelopera",
  "Forma prawna dewelopera",
  "Nr KRS",
  "Nr wpisu do CEiDG",
  "Nr NIP",
  "Nr REGON",
  "Nr telefonu",
  "Adres poczty elektronicznej",
  "Nr faxu",
  "Adres strony internetowej dewelopera",
  "Województwo adresu siedziby/głównego miejsca wykonywania działalności gospodarczej dewelopera",
  "Powiat adresu siedziby/głównego miejsca wykonywania działalności gospodarczej dewelopera ",
  "Gmina adresu siedziby/głównego miejsca wykonywania działalności gospodarczej dewelopera",
  "Miejscowość adresu siedziby/głównego miejsca wykonywania działalności gospodarczej dewelopera",
  "Ulica adresu siedziby/głównego miejsca wykonywania działalności gospodarczej dewelopera",
  "Nr nieruchomości adresu siedziby/głównego miejsca wykonywania działalności gospodarczej dewelopera",
  "Nr lokalu adresu siedziby/głównego miejsca wykonywania działalności gospodarczej dewelopera",
  "Kod pocztowy adresu siedziby/głównego miejsca wykonywania działalności gospodarczej dewelopera",
  "Województwo adresu lokalu, w którym prowadzona jest sprzedaż",
  "Powiat adresu lokalu, w którym prowadzona jest sprzedaż",
  "Gmina adresu lokalu, w którym prowadzona jest sprzedaż",
  "Miejscowość adresu lokalu, w którym prowadzona jest sprzedaż",
  "Ulica adresu lokalu, w którym prowadzona jest sprzedaż",
  "Nr nieruchomości adresu lokalu, w którym prowadzona jest sprzedaż",
  "Nr lokalu adresu lokalu, w którym prowadzona jest sprzedaż",
  "Kod pocztowy adresu lokalu, w którym prowadzona jest sprzedaż",
  "Dodatkowe lokalizacje, w których prowadzona jest sprzedaż",
  "Sposób kontaktu nabywcy z deweloperem",
  "Województwo lokalizacji przedsięwzięcia deweloperskiego lub zadania inwestycyjnego",
  "Powiat lokalizacji przedsięwzięcia deweloperskiego lub zadania inwestycyjnego",
  "Gmina lokalizacji przedsięwzięcia deweloperskiego lub zadania inwestycyjnego",
  "Miejscowość lokalizacji przedsięwzięcia deweloperskiego lub zadania inwestycyjnego",
  "Ulica lokalizacji przedsięwzięcia deweloperskiego lub zadania inwestycyjnego",
  "Nr nieruchomości lokalizacji przedsięwzięcia deweloperskiego lub zadania inwestycyjnego",
  "Kod pocztowy lokalizacji przedsięwzięcia deweloperskiego lub zadania inwestycyjnego",
  "Rodzaj nieruchomości: lokal mieszkalny, dom jednorodzinny ",
  "Nr lokalu lub domu jednorodzinnego nadany przez dewelopera",
  "Cena m 2 powierzchni użytkowej lokalu mieszkalnego / domu jednorodzinnego [zł]",
  "Data od której cena obowiązuje cena m 2 powierzchni użytkowej lokalu mieszkalnego / domu jednorodzinnego",
  "Cena lokalu mieszkalnego lub domu jednorodzinnego będących przedmiotem umowy stanowiąca iloczyn ceny m2 oraz powierzchni [zł]",
  "Data od której cena obowiązuje cena lokalu mieszkalnego lub domu jednorodzinnego będących przedmiotem umowy stanowiąca iloczyn ceny m2 oraz powierzchni",
  "Cena lokalu mieszkalnego lub domu jednorodzinnego uwzględniająca cenę lokalu stanowiącą iloczyn powierzchni oraz metrażu i innych składowych ceny, o których mowa w art. 19a ust. 1 pkt 1), 2) lub 3) [zł]",
  "Data od której obowiązuje cena lokalu mieszkalnego lub domu jednorodzinnego uwzględniająca cenę lokalu stanowiącą iloczyn powierzchni oraz metrażu i innych składowych ceny, o których mowa w art. 19a ust. 1 pkt 1), 2) lub 3)",
  "Rodzaj części nieruchomości będących przedmiotem umowy",
  "Oznaczenie części nieruchomości nadane przez dewelopera",
  "Cena części nieruchomości, będących przedmiotem umowy [zł]",
  "Data od której obowiązuje cena części nieruchomości, będących przedmiotem umowy",
  "Rodzaj pomieszczeń przynależnych, o których mowa w art. 2 ust. 4 ustawy z dnia 24 czerwca 1994 r. o własności lokali",
  "Oznaczenie pomieszczeń przynależnych, o których mowa w art. 2 ust. 4 ustawy z dnia 24 czerwca 1994 r. o własności lokali",
  "Wyszczególnienie cen pomieszczeń przynależnych, o których mowa w art. 2 ust. 4 ustawy z dnia 24 czerwca 1994 r. o własności lokali [zł]",
  "Data od której obowiązuje cena wyszczególnionych pomieszczeń przynależnych, o których mowa w art. 2 ust. 4 ustawy z dnia 24 czerwca 1994 r. o własności lokali",
  "Wyszczególnienie praw niezbędnych do korzystania z lokalu mieszkalnego lub domu jednorodzinnego",
  "Wartość praw niezbędnych do korzystania z lokalu mieszkalnego lub domu jednorodzinnego [zł]",
  "Data od której obowiązuje cena wartości praw niezbędnych do korzystania z lokalu mieszkalnego lub domu jednorodzinnego",
  "Wyszczególnienie rodzajów innych świadczeń pieniężnych, które nabywca zobowiązany jest spełnić na rzecz dewelopera w wykonaniu umowy przenoszącej własność",
  "Wartość innych świadczeń pieniężnych, które nabywca zobowiązany jest spełnić na rzecz dewelopera w wykonaniu umowy przenoszącej własność [zł]",
  "Data od której obowiązuje cena wartości innych świadczeń pieniężnych, które nabywca zobowiązany jest spełnić na rzecz dewelopera w wykonaniu umowy przenoszącej własność",
  "Adres strony internetowej, pod którym dostępny jest prospekt informacyjny",
];

// `SITE.address` i `DEVELOPER.street` trzymają ulicę razem z numerem, a wzorzec ma
// na to dwie kolumny. Podział wpisany wprost, bo "ul. Plażowa 5 i 7" nie da się
// rozciąć regułą "ostatni wyraz to numer".
const POWIAT = SITE.address.county.replace("powiat ", "");
const SIEDZIBA = { ulica: "ul. Mikołaja Kopernika", nr: "30A" };
const INWESTYCJA = { ulica: "ul. Plażowa", nr: "5 i 7" };

/**
 * Kolumny, których deweloper jeszcze nie podał, wychodzą jako "X":
 * 19-27 adres biura sprzedaży, 44-51 części nieruchomości i pomieszczenia
 * przynależne, 52-57 prawa i inne świadczenia pieniężne, 58 adres prospektu.
 */
function wiersz(u: Unit, c: Wpis): (string | number)[] {
  return [
    DEVELOPER.name,
    "spółka z ograniczoną odpowiedzialnością",
    DEVELOPER.krs,
    BRAK,
    DEVELOPER.nip,
    DEVELOPER.regon,
    SITE.phone.tel.replace("+48", ""),
    SITE.email,
    BRAK,
    SITE.url,
    SITE.address.region,
    POWIAT,
    DEVELOPER.city,
    DEVELOPER.city,
    SIEDZIBA.ulica,
    SIEDZIBA.nr,
    BRAK,
    DEVELOPER.postal,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
    `telefon ${SITE.phone.tel}, e-mail ${SITE.email}, formularz na ${SITE.url}`,
    SITE.address.region,
    POWIAT,
    SITE.address.city,
    SITE.address.city,
    INWESTYCJA.ulica,
    INWESTYCJA.nr,
    SITE.address.postal,
    unitKind(u) === "dom" ? "Dom jednorodzinny" : "Lokal mieszkalny",
    u.name,
    c.cenaM2,
    c.od,
    c.cena,
    c.od,
    c.cena,
    c.od,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
    BRAK,
  ];
}

/** Cena obowiązująca danego dnia, czyli ostatnia zmiana nie późniejsza niż ten dzień. */
export function cenaNaDzien(nazwa: string, dzien: string): Wpis | null {
  const wpisy = LOKALE[nazwa] ?? [];
  let wynik: Wpis | null = null;
  for (const w of wpisy) if (w.od <= dzien) wynik = w;
  return wynik;
}

/** Dzień ostatniej zmiany ceny lokalu - sitemapa podaje go zamiast daty builda. */
export function ostatniaZmianaCeny(nazwa: string): string {
  return LOKALE[nazwa]?.at(-1)?.od ?? START;
}

/** Dzisiaj w strefie inwestycji, a nie w strefie serwera, na którym trasa się wykonała. */
export function dzisiaj(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Warsaw" }).format(new Date());
}

export function czyZnanyDzien(dzien: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dzien) && dzien >= START && dzien <= dzisiaj();
}

const pole = (v: string | number) => {
  const s = String(v);
  return /[";\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/**
 * BOM, bo bez niego Excel otwiera plik w kodowaniu systemowym i rozsypuje polskie
 * znaki. CRLF jak we wzorcu ministerstwa.
 */
export function cennikCsv(dzien: string): string {
  const wiersze = UNITS.map((u) => {
    const c = cenaNaDzien(u.name, dzien);
    return c ? wiersz(u, c) : null;
  }).filter((w): w is (string | number)[] => w !== null);

  return "﻿" + [KOLUMNY, ...wiersze].map((r) => r.map(pole).join(";")).join("\r\n") + "\r\n";
}

export const nazwaPliku = (dzien: string) =>
  `ceny-ofertowe-ks-prestige-development-plazowa-park-${dzien}.csv`;

/**
 * Harvester pobiera manifest codziennie i czyta wszystkie zasoby, więc lista dni
 * nie może rosnąć bez końca. Limit to 1000, bo tyle rekomenduje Ministerstwo
 * Cyfryzacji dla jednego pliku XML.
 *
 * Wartość ma znaczenie dla historii cen: zasoby, których nie ma już w manifeście,
 * portal usuwa, a nie archiwizuje ("Zbiory danych oraz dane na portalu, których
 * identyfikatory dostawcy nie znajdują się w pliku XML (...) są usuwane i nie będą
 * dostępne na portalu"). Przy 1000 dni pierwszy dzień wypadnie z manifestu około
 * 12 czerwca 2029; wcześniej trzeba wystąpić o drugie źródło danych.
 */
const LIMIT_DNI = 1000;

export function dniCennika(doDnia = dzisiaj()): string[] {
  const dni: string[] = [];
  const d = new Date(`${doDnia}T00:00:00Z`);
  while (dni.length < LIMIT_DNI) {
    const iso = d.toISOString().slice(0, 10);
    if (iso < START) break;
    dni.unshift(iso);
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return dni;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// SITE.address.city trzyma mianownik ("Głowno") i tak ma zostać w adresach; opisy
// dla portalu potrzebują miejscownika.
const MIASTO_MSC = "Głownie";

const USTAWA =
  "ustawy z dnia 20 maja 2021 r. o ochronie praw nabywcy lokalu mieszkalnego lub domu jednorodzinnego oraz Deweloperskim Funduszu Gwarancyjnym";
const USTAWA_EN =
  "Ustawy z dnia 20 maja 2021 r. o ochronie praw nabywcy lokalu mieszkalnego lub domu jednorodzinnego oraz Deweloperskim Funduszu Gwarancyjnym";

function zasob(dzien: string): string {
  return `    <resource status="published">
      <extIdent>plazowapark-ceny-ofertowe-${dzien}</extIdent>
      <url>${SITE.url}/ceny-ofertowe/${nazwaPliku(dzien)}</url>
      <title>
        <polish>${esc(`Ceny ofertowe mieszkań i domów dewelopera ${DEVELOPER.name} ${dzien}`)}</polish>
        <english>${esc(`Offer prices for developer's apartments and houses ${DEVELOPER.name} ${dzien}`)}</english>
      </title>
      <description>
        <polish>${esc(`Dane dotyczące cen ofertowych mieszkań i domów jednorodzinnych dewelopera ${DEVELOPER.name} w ramach osiedla ${SITE.name} w ${MIASTO_MSC}, udostępnione ${dzien} zgodnie z art. 19b ust. 1 ${USTAWA}.`)}</polish>
        <english>${esc(`Data on offer prices of apartments and houses of the developer ${DEVELOPER.name} made available ${dzien} in accordance with art. 19b ust. 1 ${USTAWA_EN}.`)}</english>
      </description>
      <availability>local</availability>
      <dataDate>${dzien}</dataDate>
      <specialSigns>
        <specialSign>X</specialSign>
      </specialSigns>
      <hasDynamicData>false</hasDynamicData>
      <hasHighValueData>true</hasHighValueData>
      <hasHighValueDataFromEuropeanCommissionList>false</hasHighValueDataFromEuropeanCommissionList>
      <hasResearchData>false</hasResearchData>
      <containsProtectedData>false</containsProtectedData>
    </resource>`;
}

export function manifestXml(doDnia = dzisiaj()): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<ns2:datasets xmlns:ns2="urn:otwarte-dane:harvester:1.13">
  <dataset status="published">
    <extIdent>plazowapark-ceny-ofertowe-zbior-0001</extIdent>
    <title>
      <polish>${esc(`Ceny ofertowe mieszkań i domów dewelopera ${DEVELOPER.name} - osiedle ${SITE.name}`)}</polish>
      <english>${esc(`Offer prices of apartments and houses of developer ${DEVELOPER.name} - ${SITE.name} estate`)}</english>
    </title>
    <description>
      <polish>${esc(`Zbiór danych zawiera informacje o cenach ofertowych mieszkań i domów jednorodzinnych dewelopera ${DEVELOPER.name} w ramach osiedla ${SITE.name} w ${MIASTO_MSC}, udostępniane zgodnie z art. 19b ust. 1 ${USTAWA}.`)}</polish>
      <english>${esc(`The dataset contains information on offer prices of apartments and houses of the developer ${DEVELOPER.name} made available in accordance with art. 19b ust. 1 ${USTAWA_EN}.`)}</english>
    </description>
    <url>${SITE.url}/#cennik</url>
    <updateFrequency>daily</updateFrequency>
    <categories>
      <category>ECON</category>
    </categories>
    <resources>
${dniCennika(doDnia).map(zasob).join("\n")}
    </resources>
    <tags>
      <tag lang="pl">Deweloper</tag>
    </tags>
    <hasDynamicData>false</hasDynamicData>
    <hasHighValueData>true</hasHighValueData>
    <hasHighValueDataFromEuropeanCommissionList>false</hasHighValueDataFromEuropeanCommissionList>
    <hasResearchData>false</hasResearchData>
  </dataset>
</ns2:datasets>
`;
}
