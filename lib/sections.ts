/** Etykiety nad nagłówkami sekcji - jedno źródło, żeby nie rozjechały się z treścią. */
const ETYKIETY: Record<string, string> = {
  osiedle: "Osiedle",
  "mieszkania-i-domy": "Mieszkania i domy",
  galeria: "Galeria",
  spacer: "Spacer 360",
  standard: "Standard",
  zycie: "Życie",
  okolica: "Okolica",
  deweloper: "Deweloper",
  faq: "Pytania",
  kontakt: "Kontakt",
};

export const sectionEyebrow = (id: string): string => ETYKIETY[id] ?? "";
