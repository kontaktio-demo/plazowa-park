// Single source of truth. Every fact below is verified against plazowa-park.pl
// (homepage) and the developer's official SenseVR/Qupto configurator (unit data),
// plus public registries (MF Biała Lista) for the developer. No invented figures.

export const SITE = {
  name: "Plażowa Park",
  tagline: "Luksusowe osiedle domów blisko natury",
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

export type NavItem = { label: string; href: string };
export const NAV: NavItem[] = [
  { label: "Osiedle", href: "#osiedle" },
  { label: "Mieszkania i domy", href: "#mieszkania-i-domy" },
  { label: "Galeria", href: "#galeria" },
  { label: "Spacer 360", href: "#spacer" },
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

// Odległości zweryfikowane routingiem (OSRM) i w OpenStreetMap. Podajemy
// kilometry, nie minuty: czas zależy od korków i szybko robi się nieprawdą.
export const DOJAZD = [
  { name: "Centrum Łodzi", value: "32 km", note: "drogą krajową 14 przez Stryków" },
  { name: "Stryków", value: "11 km", note: "miasto z węzłem autostrad A1 i A2" },
  { name: "Stacja kolejowa Głowno", value: "4 km", note: "połączenia regionalne" },
  { name: "Warszawa", value: "104 km", note: "trasą przez A2" },
] as const;

// Standard: heat pumps + underfloor heating are standard; recuperation and
// photovoltaics are optional (installed on request during construction).
// `optional: true` znaczy montaż na życzenie na etapie budowy. Wcześniej ta sama
// informacja siedziała w nawiasie w tytule; teraz jest osobnym polem i tagiem w UI.
export const STANDARD = [
  { title: "Pompy ciepła", desc: "Ekonomiczne, ekologiczne źródło ogrzewania w standardzie osiedla.", icon: "heat" },
  { title: "Ogrzewanie podłogowe", desc: "Równomierne ciepło i swoboda aranżacji bez widocznych grzejników.", icon: "floor" },
  { title: "Rekuperacja", desc: "Wentylacja z odzyskiem ciepła, montaż na etapie budowy.", icon: "air", optional: true },
  { title: "Fotowoltaika", desc: "Własna energia i niższe rachunki, montaż na życzenie.", icon: "solar", optional: true },
  { title: "Panoramiczne okna", desc: "Przeszklenia od podłogi do sufitu z widokiem na las.", icon: "window" },
  { title: "Materiały premium", desc: "Elastyczna cegła, tynk najwyższej klasy i blacha na rąbek.", icon: "brick" },
  { title: "Prywatny ogród i taras", desc: "Własna zielona przestrzeń przy każdym mieszkaniu.", icon: "garden" },
  { title: "2 miejsca postojowe", desc: "Dwa miejsca na lokal; cztery lokale z własnym garażem.", icon: "car" },
  { title: "Prywatne wejście", desc: "Każde mieszkanie ma własne, niezależne wejście.", icon: "door" },
  { title: "Wykończenie pod klucz", desc: "Personalizacja projektu i wykończenia na etapie budowy.", icon: "pencil", optional: true },
] as const;

export const FINANCE_STEPS = [
  { step: "01", title: "Rezerwacja", desc: "Wybór mieszkania i podpisanie umowy rezerwacyjnej." },
  { step: "02", title: "Umowa deweloperska", desc: "Akt notarialny i wpłaty zgodne z harmonogramem." },
  { step: "03", title: "Etapy budowy", desc: "Transze powiązane z postępem prac na osiedlu." },
  { step: "04", title: "Odbiór i akt", desc: "Odbiór techniczny i przeniesienie własności." },
] as const;

export const FAQ = [
  {
    q: "Ile mieszkań liczy osiedle Plażowa Park?",
    a: "Osiedle to 20 domów w 6 budynkach, o powierzchni od 82 do 133 m². Budynki narożne mieszczą po cztery mieszkania, a środkowe po dwa większe.",
  },
  {
    q: "Jakie są ceny i czy są dostępne mieszkania?",
    a: "Ceny zaczynają się od 633 000 zł. Bieżącą dostępność i cenę każdego mieszkania prezentujemy w sekcji Mieszkania i domy; wiążące dane potwierdza biuro sprzedaży.",
  },
  {
    q: "Czy poddasze jest wliczone w cenę?",
    a: "Tak. Każde mieszkanie ma parter, piętro oraz poddasze. Poddasze jest zawarte w cenie nieruchomości i nie jest wliczone w metraż, więc możesz je zaadaptować według własnego pomysłu.",
  },
  {
    q: "Co znajduje się w okolicy osiedla?",
    a: "Osiedle leży bezpośrednio przy Zalewie Mrożyczka (30-hektarowym zbiorniku z plażą i kąpieliskiem) oraz w ponad 100-letnim lesie. W sąsiedztwie jest Central Wake Park i ścieżki rowerowe, a restauracje, szkoły i przychodnie są w krótkim dystansie.",
  },
  {
    q: "Jaki jest standard wykończenia i technologia?",
    a: "Mieszkania powstają w oparciu o pompy ciepła i ogrzewanie podłogowe, z opcją rekuperacji i fotowoltaiki. Standard obejmuje panoramiczne okna oraz elewację z tynku najwyższej klasy, elastycznej cegły i blachy na rąbek. Możliwa jest personalizacja wykończenia pod klucz.",
  },
  {
    q: "Czy do mieszkania należy ogród i miejsce postojowe?",
    a: "Tak. Każde mieszkanie ma prywatny ogród i taras z panoramicznymi oknami oraz dwa miejsca postojowe; cztery lokale dysponują własnym garażem.",
  },
  {
    q: "Kto jest deweloperem inwestycji?",
    a: "Inwestorem i deweloperem jest KS Prestige Development Sp. z o.o. z siedzibą w Głownie (KRS 0001031916, NIP 7331366052).",
  },
] as const;
