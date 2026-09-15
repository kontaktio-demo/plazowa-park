import type { MetadataRoute } from "next";
import { OFERTA_TEKST } from "@/lib/unitCopy";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Plażowa Park - mieszkania i domy nad Zalewem Mrożyczka",
    short_name: "Plażowa Park",
    description: `${OFERTA_TEKST} 82-133 m² w 100-letnim lesie przy Zalewie Mrożyczka w Głownie. Ceny od 633 000 zł.`,
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f4",
    theme_color: "#faf8f4",
    lang: "pl-PL",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
  };
}
