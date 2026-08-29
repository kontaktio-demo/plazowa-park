// Wizualizacje dewelopera z plazowa-park.pl. Podpisy opisują wyłącznie to, co
// realnie widać na renderze - żadnych obietnic, których nie potwierdza obraz.
export type Shot = { file: string; alt: string; caption: string };

export const GALLERY: Shot[] = [
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
    file: "salon",
    alt: "Salon z aneksem kuchennym, jadalnią i schodami na piętro",
    caption: "Salon i schody na piętro",
  },
  {
    file: "balkony",
    alt: "Elewacja z balkonami i szklanymi balustradami, miejsca postojowe pod wiatą",
    caption: "Balkony i miejsca postojowe",
  },
  {
    file: "taras",
    alt: "Taras ze szklaną balustradą wzdłuż elewacji, w tle sosnowy las",
    caption: "Taras ze szklaną balustradą",
  },
  {
    file: "szczyt-od-lasu",
    alt: "Szczyt budynku z cegłą elewacyjną i tynkiem, widziany od strony lasu",
    caption: "Szczyt budynku od strony lasu",
  },
  {
    file: "elewacja-ogrodowa",
    alt: "Elewacja ogrodowa z tarasami i blachą na rąbek",
    caption: "Elewacja ogrodowa z tarasami",
  },
];

export const shotSrc = (file: string) => `/galeria/${file}.webp`;
