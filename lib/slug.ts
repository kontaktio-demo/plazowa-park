import { UNITS, type Unit } from "@/lib/data/units";

export const unitSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function unitBySlug(slug: string): Unit | undefined {
  return UNITS.find((u) => unitSlug(u.name) === slug);
}
