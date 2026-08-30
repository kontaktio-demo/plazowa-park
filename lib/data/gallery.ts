// Wizualizacje inwestycji. Architektura, rzuty i plan osiedla pochodzą od
// dewelopera (plazowa-park.pl); kadry pokazujące aranżację i zieleń powstały
// na ich podstawie, w celach poglądowych - tak też opisuje to regulamin.
// Podpisy opisują wyłącznie to, co realnie widać na kadrze.
export type Kategoria = "osiedle" | "wnetrza";
export type Shot = { file: string; alt: string; caption: string; cat: Kategoria };

export const KATEGORIE: { id: Kategoria; label: string }[] = [
  { id: "wnetrza", label: "Wnętrza" },
  { id: "osiedle", label: "Osiedle" },
];

export const GALLERY: Shot[] = [
  {
    file: "taras-ogrod",
    alt: "Taras i prywatny ogród od strony południowej, nasadzenia, hamak między sosnami",
    caption: "Taras i ogród od południa",
    cat: "osiedle",
  },
  {
    file: "elewacja-frontowa",
    alt: "Elewacja frontowa budynku Plażowa Park o zmierzchu, podświetlone okna i podjazd",
    caption: "Elewacja frontowa o zmierzchu",
    cat: "osiedle",
  },
  {
    file: "wejscia-podjazd",
    alt: "Wejścia do lokali pod zadaszeniem i podjazd z kostki brukowej",
    caption: "Wejścia do lokali i podjazd",
    cat: "osiedle",
  },
  {
    file: "szczyt-od-lasu",
    alt: "Szczyt budynku z cegłą elewacyjną i tynkiem, widziany od strony lasu",
    caption: "Szczyt budynku od strony lasu",
    cat: "osiedle",
  },
  {
    file: "balkony",
    alt: "Elewacja z balkonami i szklanymi balustradami, miejsca postojowe pod wiatą",
    caption: "Balkony i miejsca postojowe",
    cat: "osiedle",
  },
  {
    file: "elewacja-ogrodowa",
    alt: "Elewacja ogrodowa z tarasami i blachą na rąbek",
    caption: "Elewacja ogrodowa z tarasami",
    cat: "osiedle",
  },
  {
    file: "salon-rodzina",
    alt: "Salon z aneksem kuchennym i schodami na piętro, rodzina przy stole",
    caption: "Salon z aneksem i schodami",
    cat: "wnetrza",
  },
  {
    file: "poddasze",
    alt: "Zaadaptowane poddasze z oknami połaciowymi, kanapą, biurkiem i zabudową w ściance kolankowej",
    caption: "Poddasze po adaptacji",
    cat: "wnetrza",
  },
  {
    file: "sypialnia",
    alt: "Sypialnia z panoramicznym oknem i widokiem na sosnowy las",
    caption: "Sypialnia z widokiem na las",
    cat: "wnetrza",
  },
  {
    file: "kuchnia-jadalnia",
    alt: "Kuchnia z wyspą i jadalnia przy przeszkleniu wychodzącym na ogród",
    caption: "Kuchnia z wyspą i jadalnia",
    cat: "wnetrza",
  },
  {
    file: "pokoj-dzieciecy",
    alt: "Pokój dziecięcy z otwartymi półkami, namiotem do zabawy i oknem na las",
    caption: "Pokój dziecięcy",
    cat: "wnetrza",
  },
];

export const shotSrc = (file: string) => `/galeria/${file}.webp`;
