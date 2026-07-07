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
  geo: { lat: 51.9593, lng: 19.7255 },
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
  regon: "525091200",
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
// Distances kept qualitative unless independently verified (Central Wake Park ≈ 284 m,
// Zalew ≈ 150 m, Łódź ok. 30 km) - no unverified precise figures.
export const POI = [
  { name: "Zalew Mrożyczka", desc: "Piaszczysta plaża, kąpielisko i molo", dist: "przy osiedlu", cat: "natura" },
  { name: "Central Wake Park", desc: "Wakeboard i sporty wodne nad zalewem", dist: "ok. 300 m", cat: "sport" },
  { name: "Park linowy", desc: "Wejście od ul. Plażowej", dist: "przy osiedlu", cat: "sport" },
  { name: "100-letni las", desc: "Sosnowy drzewostan otaczający osiedle", dist: "wokół osiedla", cat: "natura" },
  { name: "Komunikacja miejska", desc: "Przystanek autobusowy w okolicy", dist: "w pobliżu", cat: "dojazd" },
  { name: "Szkoły i przedszkola", desc: "Placówki edukacyjne w Głownie", dist: "w zasięgu spaceru", cat: "usługi" },
  { name: "Sklepy i usługi", desc: "Codzienne zakupy i przychodnia", dist: "w zasięgu spaceru", cat: "usługi" },
  { name: "Łódź", desc: "Autostradą A2 i drogą DK14 (ok. 30 km)", dist: "~30 min", cat: "dojazd" },
] as const;

export const STANDARD = [
  { title: "Pompy ciepła", desc: "Ekonomiczne, ekologiczne źródło ogrzewania dla każdego domu.", icon: "heat" },
  { title: "Ogrzewanie podłogowe", desc: "Równomierne ciepło i pełna swoboda aranżacji - bez grzejników.", icon: "floor" },
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

export const HARMONOGRAM = [
  { period: "I kw. 2025", title: "Rozpoczęcie budowy", state: "done" },
  { period: "III kw. 2025", title: "Stan surowy zamknięty", state: "done" },
  { period: "I kw. 2026", title: "Instalacje i elewacje", state: "done" },
  { period: "III kw. 2026", title: "Prace wykończeniowe", state: "current" },
  { period: "IV kw. 2026", title: "Odbiór i oddanie", state: "upcoming" },
] as const;

export const FAQ = [
  {
    q: "Ile apartamentów liczy osiedle Plażowa Park?",
    a: "Osiedle to 20 apartamentów w 6 budynkach, o powierzchni od 82,05 do 133,03 m². Budynki narożne mieszczą po cztery lokale, a środkowe po dwa większe, pięciopokojowe.",
  },
  {
    q: "Jakie są ceny i czy są dostępne lokale?",
    a: "Ceny zaczynają się od 633 000 zł. Aktualnie wszystkie lokale są w sprzedaży - bieżącą dostępność i ceny każdego apartamentu prezentujemy w sekcji 'Wybierz dom'. Dane potwierdzamy w biurze sprzedaży.",
  },
  {
    q: "Kiedy planowane jest oddanie inwestycji?",
    a: "Planowany termin oddania to IV kwartał 2026 roku.",
  },
  {
    q: "Co znajduje się w okolicy osiedla?",
    a: "Osiedle leży bezpośrednio przy Zalewie Mrożyczka i 100-letnim lesie sosnowym. W zasięgu spaceru są plaża, molo, Central Wake Park i park linowy, a w Głownie szkoły, przychodnia i sklepy. Do Łodzi dojedziesz w około 30 minut autostradą A2 i drogą DK14.",
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

// Gallery - real developer renders first, then interior visualisations + area photos.
export type GalleryItem = { src: string; alt: string; span?: "wide" | "tall"; tag?: string; ai?: boolean };
export const GALLERY: GalleryItem[] = [
  { src: "/renders/render-03b.webp", alt: "Wizualizacja budynku Plażowa Park - elewacja w sosnowym lesie" },
  { src: "/renders/render-07.webp", alt: "Otwarta strefa dzienna z jadalnią i kuchnią - apartament Plażowa Park" },
  { src: "/renders/render-08.webp", alt: "Sypialnia apartamentu Plażowa Park z widokiem na las" },
  { src: "/renders/render-024.webp", alt: "Prywatny ogród i taras apartamentu - Plażowa Park" },
  { src: "/renders/render-01b.webp", alt: "Wizualizacja budynku Plażowa Park o zachodzie słońca" },
  { src: "/interiors/kitchen.webp", alt: "Kuchnia z wyspą i widokiem na las - apartament Plażowa Park", ai: true },
  { src: "/interiors/bathroom.webp", alt: "Łazienka premium - apartament Plażowa Park", ai: true },
  { src: "/interiors/office.webp", alt: "Gabinet z panoramicznym oknem na las - Plażowa Park", ai: true },
  { src: "/area/plaza.webp", alt: "Plaża nad Zalewem Mrożyczka w Głownie" },
  { src: "/area/wakepark.webp", alt: "Central Wake Park nad Zalewem Mrożyczka" },
  { src: "/area/molo.webp", alt: "Molo i pomost nad Zalewem Mrożyczka" },
];

export const INTERIOR_TOUR = [
  { key: "salon", label: "Strefa dzienna", src: "/renders/render-07.webp", note: "Otwarty salon z jadalnią i kuchnią oraz schodami na piętro." },
  { key: "kuchnia", label: "Kuchnia", src: "/interiors/kitchen.webp", note: "Kuchnia z wyspą, płynnie połączona z salonem." },
  { key: "sypialnia", label: "Sypialnia", src: "/renders/render-08.webp", note: "Cicha sypialnia z dużym oknem na las." },
  { key: "gabinet", label: "Gabinet", src: "/interiors/office.webp", note: "Miejsce do pracy z widokiem na sosny." },
  { key: "lazienka", label: "Łazienka", src: "/interiors/bathroom.webp", note: "Łazienka w standardzie premium." },
  { key: "ogrod", label: "Ogród", src: "/renders/render-024.webp", note: "Prywatny ogród i taras w otoczeniu lasu." },
] as const;
