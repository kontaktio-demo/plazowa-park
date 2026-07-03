// Single source of truth for site content. Facts verified from the developer's
// SenseVR configurator (investment 214), plazowa-park.pl and public registries.

export const SITE = {
  name: "Plażowa Park",
  tagline: "Apartamenty nad Zalewem Mrożyczka",
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
  geo: { lat: 51.9605, lng: 19.7185 },
  phone: { display: "515 488 951", tel: "+48515488951" },
  email: "biuro@plazowa-park.pl",
  handoverDate: "IV kwartał 2026",
} as const;

export const DEVELOPER = {
  name: "KS Prestige Development Sp. z o.o.",
  street: "ul. Mikołaja Kopernika 30A",
  city: "Głowno",
  postal: "95-015",
  krs: "0001031916",
  nip: "7331366052",
  ceo: "Jakub Kwiatkowski",
} as const;

export type NavItem = { label: string; href: string };
export const NAV: NavItem[] = [
  { label: "Osiedle", href: "#osiedle" },
  { label: "Wybierz dom", href: "#lokale" },
  { label: "Wnętrza", href: "#wnetrza" },
  { label: "Standard", href: "#standard" },
  { label: "Okolica", href: "#okolica" },
  { label: "Finansowanie", href: "#finansowanie" },
  { label: "Kontakt", href: "#kontakt" },
];

// Signature selling points near Zalew Mrożyczka
export const POI = [
  { name: "Zalew Mrożyczka", desc: "Ponad 30 ha, strzeżone kąpielisko, molo i altana", dist: "przy osiedlu", cat: "natura" },
  { name: "Plaża i wydmy", desc: "Piasek ze śródlądowych wydm, wodny plac zabaw", dist: "5 min", cat: "natura" },
  { name: "Central Wake Park", desc: "Wakeboardowa mapa Polski — sporty wodne", dist: "300 m", cat: "sport" },
  { name: "Park linowy", desc: "Dwie trasy, wejście od ul. Plażowej", dist: "5 min", cat: "sport" },
  { name: "100-letni las", desc: "Sosnowy drzewostan otaczający osiedle", dist: "0 m", cat: "natura" },
  { name: "Przystanek Sosnowa / Kopernika", desc: "Komunikacja miejska", dist: "100 m", cat: "dojazd" },
  { name: "Szkoły i przedszkola", desc: "13 placówek edukacyjnych w okolicy", dist: "200 m", cat: "usługi" },
  { name: "Przychodnia Remedium", desc: "Opieka medyczna", dist: "200 m", cat: "usługi" },
  { name: "Sklepy i usługi", desc: "Codzienne zakupy w zasięgu spaceru", dist: "200 m", cat: "usługi" },
  { name: "Łódź", desc: "Dojazd autostradą A2 i DK14", dist: "~30 min", cat: "dojazd" },
] as const;

export const STANDARD = [
  { title: "Pompy ciepła", desc: "Ekonomiczne, ekologiczne źródło ogrzewania dla każdego domu.", icon: "heat" },
  { title: "Ogrzewanie podłogowe", desc: "Równomierne ciepło i pełna swoboda aranżacji — bez grzejników.", icon: "floor" },
  { title: "Rekuperacja", desc: "Stały dopływ świeżego powietrza z odzyskiem ciepła.", icon: "air" },
  { title: "Fotowoltaika (opcja)", desc: "Możliwość obniżenia rachunków dzięki własnej energii.", icon: "solar" },
  { title: "Panoramiczne okna", desc: "Przeszklenia od podłogi do sufitu z widokiem na las.", icon: "window" },
  { title: "Materiały premium", desc: "Elastyczna cegła, tynk premium i blacha na rąbek stojący.", icon: "brick" },
  { title: "Prywatny ogród i taras", desc: "Własna zielona przestrzeń przy każdym apartamencie.", icon: "garden" },
  { title: "2 miejsca postojowe", desc: "Dwa miejsca na lokal; wybrane domy z garażem.", icon: "car" },
] as const;

export const FINANCE_STEPS = [
  { step: "01", title: "Rezerwacja", desc: "Wybór lokalu i podpisanie umowy rezerwacyjnej." },
  { step: "02", title: "Umowa deweloperska", desc: "Akt notarialny i wpłata zgodnie z harmonogramem." },
  { step: "03", title: "Etapy budowy", desc: "Transze powiązane z postępem prac na osiedlu." },
  { step: "04", title: "Odbiór i akt", desc: "Odbiór techniczny i przeniesienie własności, IV kw. 2026." },
] as const;

export const FAQ = [
  {
    q: "Ile apartamentów liczy osiedle Plażowa Park?",
    a: "Osiedle to 20 apartamentów w 6 budynkach, o powierzchni od 82,05 do 133,03 m². Budynki narożne mieszczą po cztery lokale, a środkowe po dwa większe, pięciopokojowe.",
  },
  {
    q: "Jakie są ceny i czy są dostępne lokale?",
    a: "Ceny zaczynają się od 633 000 zł. Aktualnie wszystkie lokale są w sprzedaży — bieżącą dostępność i ceny każdego apartamentu prezentujemy w sekcji „Wybierz dom”. Dane potwierdzamy w biurze sprzedaży.",
  },
  {
    q: "Kiedy planowane jest oddanie inwestycji?",
    a: "Planowany termin oddania to IV kwartał 2026 roku.",
  },
  {
    q: "Co znajduje się w okolicy osiedla?",
    a: "Osiedle leży bezpośrednio przy Zalewie Mrożyczka (ponad 30 ha) i 100-letnim lesie sosnowym. W zasięgu spaceru są plaża, molo, Central Wake Park, park linowy, szkoły, przychodnia i sklepy. Do Łodzi dojedziesz w około 30 minut autostradą A2 i DK14.",
  },
  {
    q: "Jaki jest standard wykończenia i technologia?",
    a: "Domy powstają w oparciu o pompy ciepła, ogrzewanie podłogowe i rekuperację, z opcją fotowoltaiki. Standard obejmuje panoramiczne okna, elewację z tynku premium i elastycznej cegły oraz dach z blachy na rąbek stojący. Poddasze jest zawarte w cenie i można je zaadaptować.",
  },
  {
    q: "Czy do apartamentu należy ogród i miejsce postojowe?",
    a: "Tak. Każdy apartament ma prywatny ogród i taras z panoramicznymi oknami oraz dwa miejsca postojowe; wybrane lokale dysponują własnym garażem.",
  },
  {
    q: "Kto jest deweloperem inwestycji?",
    a: "Inwestorem i deweloperem jest KS Prestige Development Sp. z o.o. z siedzibą w Głownie (KRS 0001031916, NIP 7331366052).",
  },
] as const;

// Curated gallery — mixes real developer renders with cinematic Higgsfield visuals
export type GalleryItem = { src: string; alt: string; span?: "wide" | "tall"; tag?: string; ai?: boolean };
export const GALLERY: GalleryItem[] = [
  { src: "/renders/exterior-golden.webp", alt: "Apartament narożny o zachodzie słońca — osiedle Plażowa Park w Głownie", span: "wide", tag: "Elewacja", ai: true },
  { src: "/interiors/living.webp", alt: "Salon z panoramicznymi oknami i widokiem na sosnowy las — Plażowa Park", tag: "Salon", ai: true },
  { src: "/interiors/kitchen.webp", alt: "Otwarta kuchnia z wyspą i widokiem na las — apartament Plażowa Park", tag: "Kuchnia", ai: true },
  { src: "/renders/aerial-golden.webp", alt: "Osiedle Plażowa Park z lotu ptaka w sosnowym lesie nad Zalewem Mrożyczka", span: "wide", tag: "Osiedle", ai: true },
  { src: "/interiors/bedroom.webp", alt: "Sypialnia z panoramicznym oknem na las — apartament Plażowa Park", tag: "Sypialnia", ai: true },
  { src: "/interiors/bathroom.webp", alt: "Łazienka premium z dużym prysznicem i wanną — Plażowa Park", tag: "Łazienka", ai: true },
  { src: "/renders/render-01b.webp", alt: "Wizualizacja apartamentu Plażowa Park — bryła budynku", tag: "Architektura" },
  { src: "/renders/render-03b.webp", alt: "Wizualizacja osiedla Plażowa Park w Głownie", tag: "Architektura" },
  { src: "/area/plaza.webp", alt: "Plaża nad Zalewem Mrożyczka w Głownie", span: "tall", tag: "Okolica" },
  { src: "/area/molo.webp", alt: "Molo i pomost nad Zalewem Mrożyczka", tag: "Okolica" },
  { src: "/area/wakepark.webp", alt: "Central Wake Park nad Zalewem Mrożyczka", tag: "Okolica" },
];

export const INTERIOR_TOUR = [
  { key: "salon", label: "Salon", src: "/interiors/living.webp", note: "Otwarta strefa dzienna z kominkiem i wyjściem na taras." },
  { key: "kuchnia", label: "Kuchnia", src: "/interiors/kitchen.webp", note: "Kuchnia z wyspą, płynnie połączona z salonem." },
  { key: "sypialnia", label: "Sypialnia", src: "/interiors/bedroom.webp", note: "Cicha sypialnia z panoramicznym oknem na las." },
  { key: "lazienka", label: "Łazienka", src: "/interiors/bathroom.webp", note: "Łazienka w standardzie premium, spa we własnym domu." },
] as const;
