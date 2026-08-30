// Wizualizacje inwestycji. Architektura, rzuty i plan osiedla pochodzą od
// dewelopera (plazowa-park.pl); kadry pokazujące aranżację i zieleń powstały
// na ich podstawie, w celach poglądowych - tak też opisuje to regulamin.
// Podpisy opisują wyłącznie to, co realnie widać na kadrze.
export type Shot = { file: string; alt: string; caption: string };

export const GALLERY: Shot[] = [
  {
    file: "taras-ogrod",
    alt: "Taras i prywatny ogród od strony południowej, nasadzenia, hamak między sosnami",
    caption: "Taras i ogród od południa",
  },
  {
    file: "salon-rodzina",
    alt: "Salon z aneksem kuchennym i schodami na piętro, rodzina przy stole",
    caption: "Salon z aneksem i schodami",
  },
  {
    file: "elewacja-frontowa",
    alt: "Elewacja frontowa budynku Plażowa Park o zmierzchu, podświetlone okna i podjazd",
    caption: "Elewacja frontowa o zmierzchu",
  },
  {
    file: "wejscia-podjazd",
    alt: "Wejścia do lokali pod zadaszeniem i podjazd z kostki brukowej",
    caption: "Wejścia do lokali i podjazd",
  },
  {
    file: "szczyt-od-lasu",
    alt: "Szczyt budynku z cegłą elewacyjną i tynkiem, widziany od strony lasu",
    caption: "Szczyt budynku od strony lasu",
  },
  {
    file: "balkony",
    alt: "Elewacja z balkonami i szklanymi balustradami, miejsca postojowe pod wiatą",
    caption: "Balkony i miejsca postojowe",
  },
  {
    file: "elewacja-ogrodowa",
    alt: "Elewacja ogrodowa z tarasami i blachą na rąbek",
    caption: "Elewacja ogrodowa z tarasami",
  },
];

export const shotSrc = (file: string) => `/galeria/${file}.webp`;
