// Single source of truth. Every fact below is verified against plazowa-park.pl
// (homepage) and the developer's official SenseVR/Qupto configurator (unit data),
// plus public registries (MF Biała Lista) for the developer. No invented figures.

export const SITE = {
  name: "Plażowa Park",
  url: "https://plazowa-park.pl",
  locale: "pl-PL",
  address: {
    street: "ul. Plażowa 5 i 7",
    city: "Głowno",
    postal: "95-015",
    region: "łódzkie",
    county: "powiat zgierski",
    country: "PL",
  },
  geo: { lat: 51.9593, lng: 19.7255 }, // ul. Plażowa, Głowno (ULDK parcel 102001_1.0011.209/1)
  phone: { display: "515 488 951", tel: "+48515488951" },
  email: "biuro@plazowa-park.pl",
  // Fanpage osiedla. Uwaga: facebook.com/plazowapark to inna inwestycja (Międzywodzie).
  facebook: "https://www.facebook.com/profile.php?id=61577832736826",
} as const;

export const DEVELOPER = {
  name: "KS Prestige Development Sp. z o.o.",
  street: "ul. Mikołaja Kopernika 30A",
  city: "Głowno",
  postal: "95-015",
  krs: "0001031916",
  nip: "7331366052",
  regon: "525091200",
  statusVat: "Czynny", // MF Biała Lista, zweryfikowano wg NIP
  kapital: "10 000 zł", // odpis KRS, dział 1: wysokość kapitału zakładowego
} as const;

// Serwis prowadzi i danymi osobowymi administruje inna spółka z tej samej grupy.
// Dane z odpisu KRS i Białej Listy MF, zweryfikowane wg NIP.
export const OPERATOR = {
  name: "KS Prestige Sp. z o.o.",
  street: "ul. Mikołaja Kopernika 30A",
  city: "Głowno",
  postal: "95-015",
  krs: "0000817877",
  nip: "7331362953",
  regon: "385038850",
} as const;

// Data ostatniej zmiany treści każdego dokumentu prawnego. Czyta ją nagłówek strony
// i sitemapa, żeby obie nie mogły się rozjechać.
export const LEGAL_UPDATED = {
  prywatnosc: "2026-09-08",
  cookies: "2026-09-08",
  regulamin: "2026-09-16",
} as const;

export const dataPl = (iso: string) =>
  new Date(iso).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });

// Cztery wejścia zamiast siedmiu. Oferta ma jedno miejsce (#mieszkania-i-domy),
// a spacer 360, cennik i osiedle były osobnymi drogami do tych samych lokali.
export type NavItem = { label: string; href: string };
export const NAV: NavItem[] = [
  { label: "Mieszkania i domy", href: "#mieszkania-i-domy" },
  { label: "Standard", href: "#standard" },
  { label: "Okolica", href: "#okolica" },
  { label: "Kontakt", href: "#kontakt" },
];

// Punkty w okolicy - wyłącznie te wymienione na plazowa-park.pl. Odległości są
// jakościowe, bo strona dewelopera nie podaje żadnych metrów; twarde kilometry
// dla dojazdu siedzą osobno w DOJAZD i są zweryfikowane routingiem.
export const POI = [
  {
    name: "Zalew Mrożyczka",
    desc: "30 hektarów wody z piaszczystą plażą, molo i strzeżonym kąpieliskiem. Latem miejsce wypoczynku nad wodą, poza sezonem sceneria spacerów i biegania wokół zbiornika.",
    dist: "przy osiedlu",
    cat: "natura",
  },
  {
    name: "Central Wake Park",
    desc: "Najważniejsze miejsce na wakeboardowej mapie Polski, w bezpośrednim sąsiedztwie osiedla. Ściąga nad Mrożyczkę amatorów sportów wodnych z całego regionu.",
    dist: "w sąsiedztwie",
    cat: "sport",
  },
  {
    name: "Ponad 100-letni las",
    desc: "Sosnowy drzewostan otaczający inwestycję. Daje cień w upalne dni, wycisza osiedle i przez cały rok trzyma powietrze czystym.",
    dist: "wokół osiedla",
    cat: "natura",
  },
  {
    name: "Ścieżki rowerowe",
    desc: "Trasy rekreacyjne wokół zalewu i w lesie, do których wjeżdża się wprost z osiedla, bez odcinka po ruchliwej drodze.",
    dist: "przy osiedlu",
    cat: "sport",
  },
  {
    name: "Wydmy śródlądowe",
    desc: "Unikalny w województwie łódzkim zespół wydm śródlądowych, jedna z przyrodniczych osobliwości okolic Głowna.",
    dist: "w okolicy",
    cat: "natura",
  },
  {
    name: "Restauracje, szkoły, przychodnie",
    desc: "Codzienne zaplecze Głowna: szkoły i przedszkola, przychodnie, sklepy i restauracje w krótkim dystansie od osiedla.",
    dist: "krótki dystans",
    cat: "usługi",
  },
] as const;

// Punkty na planie poglądowym okolicy (public/map/okolica-3d.webp). Współrzędne
// w procentach szerokości i wysokości obrazu, odczytane z samego planu.
// Opisujemy wyłącznie to, co deweloper sam na tym planie podpisał.
export const MAPA_PUNKTY = [
  { x: 84, y: 55, name: "Plażowa Park", desc: "Osiedle: dziesięć budynków, 16 mieszkań i 4 domy przy ul. Plażowej.", tu: true },
  { x: 45, y: 41, name: "Zalew Mrożyczka", desc: "Trzydzieści hektarów wody z piaszczystą plażą i strzeżonym kąpieliskiem." },
  { x: 72, y: 45, name: "Central Wake Park", desc: "Najważniejsze miejsce na wakeboardowej mapie Polski, w sąsiedztwie osiedla." },
  { x: 28, y: 64, name: "Plaża i molo", desc: "Piaszczysta plaża z molo po zachodniej stronie zalewu." },
  { x: 15, y: 47, name: "Przystań", desc: "Przystań przy zachodnim brzegu zbiornika." },
  { x: 62, y: 58, name: "Park linowy", desc: "Park linowy przy brzegu zalewu. Status na bieżący sezon potwierdza operator obiektu." },
  { x: 40, y: 82, name: "Wydmy śródlądowe", desc: "Unikalny w województwie łódzkim zespół wydm śródlądowych." },
] as const;

// Odległości zweryfikowane routingiem (OSRM) i w OpenStreetMap. Podajemy
// kilometry, nie minuty: czas zależy od korków i szybko robi się nieprawdą.
export const DOJAZD = [
  { name: "Centrum Łodzi", value: "32 km", note: "drogą krajową 14 przez Stryków" },
  { name: "Stryków", value: "11 km", note: "miasto z węzłem autostrad A1 i A2" },
  { name: "Stacja kolejowa Głowno", value: "4 km", note: "połączenia regionalne" },
  { name: "Warszawa", value: "104 km", note: "trasą przez A2" },
] as const;

// Sześć rzeczy, które nabywca dostaje w cenie. Rekuperacja, fotowoltaika
// i wykończenie pod klucz są dodatkowo płatne, więc stoją osobno, w jednej linijce
// pod siatką - jako kafelki czytały się jak część standardu.
export const STANDARD = [
  { title: "Pompy ciepła", desc: "Ekonomiczne, ekologiczne źródło ogrzewania w standardzie osiedla.", icon: "heat" },
  { title: "Ogrzewanie podłogowe", desc: "Równomierne ciepło i swoboda aranżacji bez widocznych grzejników.", icon: "floor" },
  { title: "Panoramiczne okna", desc: "Przeszklenia od podłogi do sufitu z widokiem na las.", icon: "window" },
  { title: "Prywatny ogród i taras", desc: "Własna zielona przestrzeń przy każdym mieszkaniu i domu.", icon: "garden" },
  { title: "2 miejsca postojowe", desc: "Dwa miejsca do każdego mieszkania i domu; cztery domy mają własny garaż.", icon: "car" },
  { title: "Poddasze w cenie", desc: "Zawarte w cenie i poza metrażem, gotowe do adaptacji według własnego pomysłu.", icon: "ruler" },
] as const;

export const STANDARD_DOPLATA =
  "Za dopłatą, na etapie budowy: rekuperacja, fotowoltaika, wykończenie pod klucz.";

// Trzy etapy w kolejności, w jakiej przechodzi je nabywca. Bez kwot i terminów:
// opłatę rezerwacyjną, harmonogram transz i daty potwierdza prospekt informacyjny.
export const KROKI_ZAKUPU = [
  { title: "Wybór i oględziny", desc: "Wybierasz mieszkanie albo dom z aktualnej listy dostępności i cen, a potem oglądasz osiedle i wybraną nieruchomość z biurem sprzedaży." },
  { title: "Umowa rezerwacyjna", desc: "Wybrana nieruchomość zostaje czasowo wyłączona z oferty na warunkach zapisanych w umowie." },
  { title: "Umowa deweloperska i przeniesienie własności", desc: "Akt notarialny, wpłaty na rachunek powierniczy zgodnie z harmonogramem, a po odbiorze technicznym przeniesienie własności z wpisem do księgi wieczystej." },
] as const;

// Partnerzy wymienieni przez dewelopera. MWW Mieszkanie prowadzi sprzedaż osiedla
// (numer telefonu na stronie to numer biura), CBG Głowno to skład budowlany z Głowna.
export const PARTNERZY = [
  {
    name: "MWW Mieszkanie",
    role: "Biuro sprzedaży osiedla",
    url: "https://mwwmieszkanie.pl",
    logo: "/brand/mww-mieszkanie.webp",
    width: 320,
    height: 310,
  },
  {
    name: "CBG Głowno",
    role: "Skład budowlany w Głownie",
    url: "https://cbgglowno.pl",
    logo: "/brand/cbg-glowno.webp",
    width: 420,
    height: 196,
  },
] as const;

export const RABAT_CBG =
  "Kupującym mieszkanie albo dom w Plażowa Park przysługuje 10% rabatu na zakupy w Centrum Budowlanym Głowno. Warunki rabatu potwierdza biuro sprzedaży.";

// Sześć pytań, na które nie odpowiada wprost żadna sekcja strony. Pytania o liczbę
// lokali, lokalizację, dojazd i standard zniknęły, bo powtarzały treść sekcji
// Mieszkania i domy, Okolica i Standard oraz podstrony /lokalizacja.
export const FAQ = [
  {
    q: "Czy poddasze jest wliczone w cenę?",
    a: "Tak. Każde mieszkanie i każdy dom ma parter, piętro oraz poddasze. Poddasze jest zawarte w cenie nieruchomości i nie jest wliczone w metraż, więc możesz je zaadaptować według własnego pomysłu.",
  },
  {
    q: "Jakie są ceny i czy są dostępne mieszkania i domy?",
    a: "Ceny zaczynają się od 633 000 zł. Cenę, cenę za m² i status każdego mieszkania i domu podajemy w zestawieniu w sekcji Mieszkania i domy oraz na jego podstronie.",
  },
  {
    q: "Czy do mieszkania albo domu należy ogród i miejsce postojowe?",
    a: "Tak. Każde mieszkanie i każdy dom ma prywatny ogród i taras z panoramicznymi oknami oraz dwa miejsca postojowe; cztery domy w budynkach środkowych mają dodatkowo własny garaż.",
  },
  {
    q: "Jak wygląda proces zakupu?",
    a: "Pięć kroków. Wybierasz mieszkanie albo dom z aktualnej listy dostępności i cen, umawiasz się na oględziny osiedla i wybranej nieruchomości, podpisujesz umowę rezerwacyjną, która czasowo wyłącza ją z oferty, następnie umowę deweloperską u notariusza z harmonogramem wpłat na rachunek powierniczy, a po odbiorze technicznym umowę przeniesienia własności, również aktem notarialnym, z wpisem do księgi wieczystej.",
  },
  {
    q: "Czy nabywcy mają zniżki u partnerów inwestycji?",
    a: "Tak. Kupującym mieszkanie albo dom w Plażowa Park przysługuje 10% rabatu na zakupy w Centrum Budowlanym Głowno, czyli w składzie budowlanym przy ul. Kopernika 30A. Warunki rabatu potwierdza biuro sprzedaży.",
  },
  {
    q: "Kto jest deweloperem inwestycji?",
    a: "Inwestorem i deweloperem jest KS Prestige Development Sp. z o.o. z siedzibą w Głownie (KRS 0001031916, NIP 7331366052). Sprzedaż prowadzi biuro MWW Mieszkanie.",
  },
] as const;
