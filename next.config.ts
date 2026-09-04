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
    return [
      {
        // Długi cache dla stabilnych assetów (klatki obrotu, rendery, rzuty
        // lokali, mapy) - powstają raz i praktycznie się nie zmieniają.
        source: "/:folder(dollhouse|osiedle|galeria|renders|unit-views|map|brand)/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
