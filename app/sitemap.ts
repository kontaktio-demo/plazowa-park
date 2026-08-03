import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data/site";
import { UNITS } from "@/lib/data/units";
import { unitSlug } from "@/lib/slug";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date("2026-08-03");

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/lokalizacja`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/polityka-prywatnosci`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/polityka-cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/regulamin`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const unitPages: MetadataRoute.Sitemap = UNITS.map((u) => ({
    url: `${base}/lokal/${unitSlug(u.name)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...unitPages];
}
