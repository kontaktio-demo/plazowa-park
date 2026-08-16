/** Jedno źródło numeracji sekcji. Eyebrow, skala głębokości i nawigacja czytają
 *  tę listę, więc numer przy nagłówku nie może rozejść się z numerem na railu. */
export type Section = {
  n: string;
  id: string;
  label: string;
  /** ciemne pasmo - skala głębokości przełącza na nim kolory */
  dark: boolean;
};

export const SECTIONS: Section[] = [
  { n: "01", id: "osiedle", label: "Osiedle", dark: false },
  { n: "02", id: "lokale", label: "Apartamenty", dark: false },
  { n: "03", id: "spacer", label: "Spacer 360", dark: true },
  { n: "04", id: "standard", label: "Standard", dark: false },
  { n: "05", id: "zycie", label: "Życie", dark: true },
  { n: "06", id: "okolica", label: "Okolica", dark: false },
  { n: "07", id: "deweloper", label: "Deweloper", dark: true },
  { n: "08", id: "faq", label: "Pytania", dark: false },
  { n: "09", id: "kontakt", label: "Kontakt", dark: true },
];

export function sectionEyebrow(id: string): string {
  const s = SECTIONS.find((x) => x.id === id);
  return s ? `${s.n} / ${s.label}` : "";
}
