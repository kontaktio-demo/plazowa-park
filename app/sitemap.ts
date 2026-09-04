import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data/site";
import { UNITS } from "@/lib/data/units";
import { unitSlug } from "@/lib/slug";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  // data budowania: sitemapa odswieza sie z kazdym deployem zamiast zastygac w przeszlosci
  const now = new Date();
  // dokumenty prawne nosza wlasna date aktualizacji i nie zmieniaja sie
  // z kazdym wdrozeniem
  const LEGAL_UPDATED = new Date("2026-08-31");

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/lokalizacja`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/polityka-prywatnosci`, lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/polityka-cookies`, lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/regulamin`, lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
  ];

  const unitPages: MetadataRoute.Sitemap = UNITS.map((u) => ({
    url: `${base}/mieszkania-i-domy/${unitSlug(u.name)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...unitPages];
}
