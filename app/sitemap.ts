import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date("2026-07-03");
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/polityka-prywatnosci`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/polityka-cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/regulamin`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
