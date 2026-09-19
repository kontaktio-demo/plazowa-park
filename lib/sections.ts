/** Etykiety nad nagłówkami sekcji - jedno źródło, żeby nie rozjechały się z treścią. */
const ETYKIETY: Record<string, string> = {
  "mieszkania-i-domy": "Mieszkania i domy",
  spacer: "Spacer 360",
  standard: "Standard",
  okolica: "Okolica",
  deweloper: "Deweloper",
  faq: "Pytania",
  kontakt: "Kontakt",
};

export const sectionEyebrow = (id: string): string => ETYKIETY[id] ?? "";
