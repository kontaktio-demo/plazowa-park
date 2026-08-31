// Wizualizacje inwestycji. Pole `zrodlo` rozdziela materiał dewelopera od kadrów
// przygotowanych na jego podstawie - deweloper ma wyłącznie zmierzchowe rendery
// elewacji, więc kadry z zielenią, ludźmi i wnętrzami powstały z jego renderów
// użytych jako referencja obrazu. Rozróżnienie jest widoczne dla użytkownika
// w nocie nad siatką, nie tylko w regulaminie.
// Podpisy opisują wyłącznie to, co realnie widać na kadrze.
export type Kategoria = "osiedle" | "wnetrza";
export type Zrodlo = "deweloper" | "na-podstawie";
export type Shot = { file: string; alt: string; caption: string; cat: Kategoria; zrodlo: Zrodlo };

export const KATEGORIE: { id: Kategoria; label: string; nota: string }[] = [
  {
    id: "wnetrza",
    label: "Wnętrza",
    nota: "Aranżacje poglądowe, przygotowane na podstawie renderu dewelopera. Meble i wyposażenie nie wchodzą w zakres sprzedaży, wykończenie pod klucz jest opcją, a poddasze wydajemy do adaptacji.",
  },
  {
    id: "osiedle",
    label: "Osiedle",
    nota: "Wizualizacje dewelopera; kadr tarasu przygotowany na ich podstawie. Zieleń i zagospodarowanie otoczenia są poglądowe.",
  },
];

export const GALLERY: Shot[] = [
  {
    file: "taras-ogrod",
    alt: "Taras i prywatny ogród od strony południowej, nasadzenia, hamak między sosnami",
    caption: "Taras i ogród od południa",
    cat: "osiedle",
    zrodlo: "na-podstawie",
  },
  {
    file: "elewacja-frontowa",
    alt: "Elewacja frontowa budynku Plażowa Park o zmierzchu, podświetlone okna i podjazd",
    caption: "Elewacja frontowa o zmierzchu",
    cat: "osiedle",
    zrodlo: "deweloper",
  },
  {
    file: "wejscia-podjazd",
    alt: "Wejścia do lokali pod zadaszeniem i podjazd z kostki brukowej",
    caption: "Wejścia do lokali i podjazd",
    cat: "osiedle",
    zrodlo: "deweloper",
  },
  {
    file: "szczyt-od-lasu",
    alt: "Szczyt budynku z cegłą elewacyjną i tynkiem, widziany od strony lasu",
    caption: "Szczyt budynku od strony lasu",
    cat: "osiedle",
    zrodlo: "deweloper",
  },
  {
    file: "balkony",
    alt: "Elewacja z balkonami i szklanymi balustradami, miejsca postojowe pod wiatą",
    caption: "Balkony i miejsca postojowe",
    cat: "osiedle",
    zrodlo: "deweloper",
  },
  {
    file: "elewacja-ogrodowa",
    alt: "Elewacja ogrodowa z tarasami i blachą na rąbek",
    caption: "Elewacja ogrodowa z tarasami",
    cat: "osiedle",
    zrodlo: "deweloper",
  },
  {
    file: "salon-rodzina",
    alt: "Salon z aneksem kuchennym i schodami na piętro, rodzina przy stole",
    caption: "Salon z aneksem i schodami",
    cat: "wnetrza",
    zrodlo: "na-podstawie",
  },
  {
    file: "poddasze",
    alt: "Zaadaptowane poddasze z oknami połaciowymi, kanapą, biurkiem i zabudową w ściance kolankowej",
    caption: "Poddasze po adaptacji",
    cat: "wnetrza",
    zrodlo: "na-podstawie",
  },
  {
    file: "sypialnia",
    alt: "Sypialnia z panoramicznym oknem i widokiem na sosnowy las",
    caption: "Sypialnia z widokiem na las",
    cat: "wnetrza",
    zrodlo: "na-podstawie",
  },
  {
    file: "kuchnia-jadalnia",
    alt: "Kuchnia z wyspą i jadalnia przy przeszkleniu wychodzącym na ogród",
    caption: "Kuchnia z wyspą i jadalnia",
    cat: "wnetrza",
    zrodlo: "na-podstawie",
  },
  {
    file: "pokoj-dzieciecy",
    alt: "Pokój dziecięcy z otwartymi półkami, namiotem do zabawy i oknem na las",
    caption: "Pokój dziecięcy",
    cat: "wnetrza",
    zrodlo: "na-podstawie",
  },
];

export const shotSrc = (file: string) => `/galeria/${file}.webp`;
