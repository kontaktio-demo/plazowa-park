import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920, 2400],
    // bez tej listy Next ignoruje `quality` na <Image> i wraca do 75
    qualities: [62, 68, 75, 80],
  },
  poweredByHeader: false,
  compress: true,
  // Adresy, ktore zyly na starej stronie WordPress pod ta domena i sa zaindeksowane.
  // Bez tego po przepieciu domeny wpadlyby na 404 i zabraly ze soba historie w wyszukiwarce.
  async redirects() {
    return [
      { source: "/privacy-policy", destination: "/polityka-prywatnosci", permanent: true },
      { source: "/strona-glowna", destination: "/", permanent: true },
      { source: "/global-styles", destination: "/", permanent: true },
      { source: "/feed", destination: "/", permanent: true },
      { source: "/comments/feed", destination: "/", permanent: true },
    ];
  },

  async headers() {
    const cacheGrafiki = [
      { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
    ];
    const bezIndeksu = [{ key: "X-Robots-Tag", value: "noindex" }];
    return [
      {
        // Długi cache dla stabilnych assetów (plan osiedla, rendery, rzuty
        // lokali, mapy) - powstają raz i praktycznie się nie zmieniają.
        source: "/:folder(osiedle|galeria|renders|rzuty|map|brand)/:path*",
        headers: cacheGrafiki,
      },
      // Obraz Open Graph leży poza tymi folderami, a zmienia się równie rzadko.
      { source: "/og.jpg", headers: cacheGrafiki },
      {
        // Pliki dla dane.gov.pl zostają publicznie dostępne, bo tego wymaga art. 19b
        // ustawy deweloperskiej, ale nie mają po co stać w wynikach wyszukiwania.
        // noindex nie blokuje pobierania, więc harvester portalu bierze je dalej.
        source: "/:plik(ceny-ofertowe\\.csv|dane-gov\\.xml|dane-gov\\.md5)",
        headers: bezIndeksu,
      },
      // Cennik na wskazany dzień to nowy adres każdej doby - bez tego w indeksie
      // narosłoby do tysiąca prawie identycznych plików, w dodatku linkowanych z portalu.
      { source: "/ceny-ofertowe/:plik", headers: bezIndeksu },
    ];
  },
};

export default nextConfig;
