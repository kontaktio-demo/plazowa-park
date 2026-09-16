import type { MetadataRoute } from "next";
import { LEGAL_UPDATED, SITE } from "@/lib/data/site";
import { UNITS } from "@/lib/data/units";
import { ostatniaZmianaCeny } from "@/lib/cennik";
import { unitSlug } from "@/lib/slug";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  // lastmod z historii cen, a nie z daty builda: inaczej każde wdrożenie ogłasza
  // zmianę wszystkich podstron, także gdy nie ruszyliśmy ani jednej treści
  const zmianaLokalu = (nazwa: string) => new Date(ostatniaZmianaCeny(nazwa));
  const ostatniaZmiana = new Date(
    Math.max(...UNITS.map((u) => zmianaLokalu(u.name).getTime())),
  );

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: ostatniaZmiana, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/lokalizacja`, lastModified: ostatniaZmiana, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/polityka-prywatnosci`, lastModified: new Date(LEGAL_UPDATED.prywatnosc), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/polityka-cookies`, lastModified: new Date(LEGAL_UPDATED.cookies), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/regulamin`, lastModified: new Date(LEGAL_UPDATED.regulamin), changeFrequency: "yearly", priority: 0.3 },
  ];

  const unitPages: MetadataRoute.Sitemap = UNITS.map((u) => ({
    url: `${base}/mieszkania-i-domy/${unitSlug(u.name)}`,
    lastModified: zmianaLokalu(u.name),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...unitPages];
}
