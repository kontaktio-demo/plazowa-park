import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Plażowa Park - apartamenty nad Zalewem Mrożyczka",
    short_name: "Plażowa Park",
    description:
      "20 apartamentów 82-133 m² w 100-letnim lesie przy Zalewie Mrożyczka w Głownie. Ceny od 633 000 zł.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f4f2",
    theme_color: "#2b2e33",
    lang: "pl-PL",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
  };
}
