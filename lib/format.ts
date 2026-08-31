export const plnFmt = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 0,
});

export function pln(v: number): string {
  return plnFmt.format(v).replace(/ /g, " ");
}

export function plnShort(v: number): string {
  // 633000 -> "633 000 zł"
  return `${new Intl.NumberFormat("pl-PL").format(v)} zł`;
}

export function area(v: number): string {
  return `${new Intl.NumberFormat("pl-PL", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(v)} m²`;
}

/** Polska odmiana przez liczbe: [1, 2-4, 5+]. */
export function odmien(n: number, formy: [string, string, string]): string {
  const d = n % 10;
  const s = n % 100;
  if (n === 1) return formy[0];
  if (d >= 2 && d <= 4 && (s < 12 || s > 14)) return formy[1];
  return formy[2];
}

export function rooms(n: number): string {
  if (n === 1) return "1 pokój";
  if (n >= 2 && n <= 4) return `${n} pokoje`;
  return `${n} pokoi`;
}

export const STATUS_META = {
  available: { label: "Dostępny", color: "var(--color-ok)" },
  reserved: { label: "Rezerwacja", color: "var(--color-hold)" },
  sold: { label: "Sprzedany", color: "var(--color-gone)" },
} as const;
