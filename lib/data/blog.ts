export type Block = { h2: string } | { p: string } | { ul: string[] };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  coverAlt: string;
  date: string; // ISO
  readMin: number;
  keywords: string[];
  body: Block[];
}

export const POSTS: Post[] = [
  {
    slug: "czy-warto-kupic-mieszkanie-w-glownie",
    title: "Czy warto kupić mieszkanie w Głownie?",
    excerpt:
      "Głowno łączy spokój małego miasta z bliskością Łodzi i wyjątkową przyrodą Zalewu Mrożyczka. Sprawdź, dla kogo to dobry adres.",
    cover: "/renders/aerial-golden.webp",
    coverAlt: "Osiedle Plażowa Park w Głownie nad Zalewem Mrożyczka z lotu ptaka",
    date: "2026-05-12",
    readMin: 4,
    keywords: ["czy warto kupić mieszkanie w Głownie", "mieszkania Głowno", "nieruchomości Głowno"],
    body: [
      { p: "Głowno to miasto w powiecie zgierskim, w województwie łódzkim, które w ostatnich latach coraz częściej pojawia się na mapie osób szukających spokojnego miejsca do życia w rozsądnej odległości od dużego miasta. Dla wielu kupujących kluczowe są trzy rzeczy: cena, dojazd i jakość otoczenia — i pod każdym z tych względów Głowno wypada zaskakująco dobrze." },
      { h2: "Ceny nieruchomości i wartość" },
      { p: "W porównaniu z Łodzią czy jej najbliższymi przedmieściami, ceny w Głownie pozostają atrakcyjne, a za podobny budżet można kupić większy metraż z własnym ogrodem. Nowe inwestycje, takie jak Plażowa Park, oferują apartamenty od 82 do 133 m² z prywatnym ogrodem i tarasem — format trudny do znalezienia w mieście w tej cenie." },
      { h2: "Bliskość natury" },
      { p: "Największym atutem lokalizacji jest sąsiedztwo Zalewu Mrożyczka — ponad 30-hektarowego zbiornika z piaszczystą plażą, molo i Central Wake Park — oraz 100-letniego lasu sosnowego. To codzienny dostęp do rekreacji, którego nie zapewni żadne miejskie osiedle." },
      { h2: "Dla kogo?" },
      { ul: ["Rodzin szukających przestrzeni, ogrodu i ciszy blisko natury", "Osób pracujących w Łodzi, które cenią krótki dojazd i spokój po pracy", "Kupujących pod inwestycję lub drugi dom w otoczeniu jeziora i lasu"] },
      { p: "Jeśli szukasz miejsca, w którym spacer brzegiem jeziora zastępuje korki, a widok z okna to las — Głowno jest odpowiedzią wartą rozważenia." },
    ],
  },
  {
    slug: "zycie-nad-zalewem-mrozyczka",
    title: "Życie nad Zalewem Mrożyczka — co oferuje okolica",
    excerpt:
      "Plaża, molo, sporty wodne i sosnowy las tuż za progiem. Przewodnik po atrakcjach Zalewu Mrożyczka w Głownie.",
    cover: "/area/plaza.webp",
    coverAlt: "Plaża nad Zalewem Mrożyczka w Głownie",
    date: "2026-05-28",
    readMin: 3,
    keywords: ["Zalew Mrożyczka", "życie nad Zalewem Mrożyczka", "Central Wake Park"],
    body: [
      { p: "Zalew Mrożyczka to serce rekreacyjne Głowna — ponad 30 hektarów wody na rzece Mrodze, otoczone lasem i piaszczystą plażą. To miejsce, wokół którego toczy się letnie życie miasta." },
      { h2: "Plaża i kąpielisko" },
      { p: "Piaszczysta plaża — z piaskiem pochodzącym ze śródlądowych wydm — oraz strzeżone kąpielisko przyciągają rodziny przez cały sezon. Na miejscu znajdziesz molo i pomost widokowy, altanę koncertową, wodny plac zabaw z dmuchańcami oraz boiska do siatkówki plażowej." },
      { h2: "Sporty wodne i Central Wake Park" },
      { p: "Central Wake Park to jeden z ważniejszych punktów na wakeboardowej mapie Polski. Do tego wypożyczalnia kajaków i rowerów wodnych oraz park linowy z dwiema trasami — aktywności starczy na całe wakacje bez wyjeżdżania z miasta." },
      { h2: "Las i spacery" },
      { p: "Osiedle Plażowa Park powstaje bezpośrednio przy 100-letnim lesie sosnowym, z promenadą pieszo-rowerową wzdłuż brzegu. To codzienny dostęp do ciszy, cienia i świeżego powietrza." },
    ],
  },
  {
    slug: "dojazd-z-glowna-do-lodzi",
    title: "Dojazd z Głowna do Łodzi — ile zajmuje i jak dojechać",
    excerpt:
      "Około 30 minut samochodem autostradą A2 i DK14. Sprawdź, jak wygląda codzienny dojazd z Głowna do Łodzi.",
    cover: "/renders/exterior-golden.webp",
    coverAlt: "Apartament Plażowa Park o zachodzie słońca — dojazd do Łodzi w 30 minut",
    date: "2026-06-08",
    readMin: 3,
    keywords: ["dojazd z Głowna do Łodzi", "Głowno Łódź odległość", "Głowno komunikacja"],
    body: [
      { p: "Jednym z częstszych pytań osób rozważających zakup w Głownie jest wygoda dojazdu do Łodzi. Dobra wiadomość: mimo kameralnego charakteru miasta, komunikacja z aglomeracją łódzką jest szybka i wygodna." },
      { h2: "Samochodem" },
      { p: "Odległość z Głowna do Łodzi to około 17 km w linii prostej i nieco ponad 30 km trasą drogową. Dojazd autostradą A2 oraz drogą krajową DK14 zajmuje zwykle około 30 minut — porównywalnie z przejazdem przez samo miasto w godzinach szczytu." },
      { h2: "Komunikacja i codzienność" },
      { p: "W samym Głownie przystanek komunikacji miejskiej (Sosnowa / Kopernika) znajduje się około 100 metrów od osiedla Plażowa Park. W okolicy działa 13 placówek edukacyjnych, przychodnia oraz sklepy — większość codziennych spraw załatwisz bez wsiadania do auta." },
      { h2: "Podsumowanie" },
      { ul: ["~30 min samochodem do Łodzi (A2 + DK14)", "Przystanek ~100 m od osiedla", "Szkoły, przychodnia i sklepy w zasięgu spaceru"] },
    ],
  },
  {
    slug: "koszty-utrzymania-domu-z-pompa-ciepla",
    title: "Koszty utrzymania domu z pompą ciepła",
    excerpt:
      "Pompa ciepła, ogrzewanie podłogowe i rekuperacja obniżają rachunki i podnoszą komfort. Wyjaśniamy, jak to działa.",
    cover: "/interiors/living.webp",
    coverAlt: "Salon apartamentu Plażowa Park z ogrzewaniem podłogowym",
    date: "2026-06-20",
    readMin: 4,
    keywords: ["koszty utrzymania domu z pompą ciepła", "pompa ciepła", "dom energooszczędny"],
    body: [
      { p: "Technologia grzewcza ma dziś ogromny wpływ na miesięczne koszty utrzymania nieruchomości. Apartamenty w Plażowa Park projektowane są jako energooszczędne — w oparciu o pompy ciepła, ogrzewanie podłogowe i rekuperację." },
      { h2: "Dlaczego pompa ciepła?" },
      { p: "Pompa ciepła pobiera energię z otoczenia i oddaje ją do domu z wysoką sprawnością — na każdą jednostkę energii elektrycznej dostarcza kilka jednostek ciepła. W praktyce oznacza to niższe rachunki niż w przypadku ogrzewania gazowego czy elektrycznego, przy jednoczesnym braku emisji spalin na miejscu." },
      { h2: "Ogrzewanie podłogowe i rekuperacja" },
      { p: "Ogrzewanie podłogowe równomiernie rozprowadza ciepło przy niższej temperaturze zasilania, co dobrze współpracuje z pompą ciepła. Rekuperacja z odzyskiem ciepła zapewnia stały dopływ świeżego powietrza bez strat energii — to komfort i oszczędność jednocześnie." },
      { h2: "Fotowoltaika jako opcja" },
      { p: "Uzupełnieniem może być instalacja fotowoltaiczna, która pozwala produkować własną energię i dodatkowo obniżyć koszty zasilania pompy ciepła. W efekcie dobrze zaprojektowany dom energooszczędny bywa znacznie tańszy w utrzymaniu niż starsze budownictwo." },
      { p: "Dokładne koszty zależą od metrażu, trybu użytkowania i taryf — po szczegóły zapraszamy do biura sprzedaży." },
    ],
  },
  {
    slug: "poddasze-w-cenie-jak-zaadaptowac-przestrzen",
    title: "Poddasze w cenie — jak zaadaptować dodatkową przestrzeń",
    excerpt:
      "W Plażowa Park poddasze jest zawarte w cenie apartamentu. Podpowiadamy, jak wykorzystać ten metraż.",
    cover: "/interiors/office.webp",
    coverAlt: "Zaadaptowane poddasze jako gabinet — apartament Plażowa Park",
    date: "2026-06-30",
    readMin: 3,
    keywords: ["poddasze w cenie", "adaptacja poddasza", "apartament z poddaszem Głowno"],
    body: [
      { p: "Jednym z wyróżników apartamentów w Plażowa Park jest poddasze zawarte w cenie nieruchomości. To dodatkowa przestrzeń, którą możesz zaaranżować według własnych potrzeb — bez dopłaty za sam metraż poddasza." },
      { h2: "Pomysły na adaptację" },
      { ul: ["Domowy gabinet lub pracownia z widokiem na las", "Dodatkowa sypialnia lub pokój gościnny", "Strefa relaksu, biblioteka albo mała siłownia", "Przestronna garderoba i schowki"] },
      { h2: "O czym pamiętać" },
      { p: "Poddasze nie jest wliczone w podstawowy metraż mieszkania, ale realnie powiększa przestrzeń użytkową. Warto zaplanować jego funkcję już na etapie wykończenia — na przykład rozprowadzenie instalacji pod konkretne przeznaczenie pomieszczenia." },
      { p: "Możliwość personalizacji „pod klucz” na etapie budowy sprawia, że apartament można dopasować do stylu życia jeszcze przed odbiorem. Szczegóły ustalisz indywidualnie w biurze sprzedaży." },
    ],
  },
];

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);
