/**
 * Plan zagospodarowania terenu (PZT) od dewelopera. To on rozstrzyga o numeracji:
 * dziesięć budynków, w każdym dwa lokale, a lokal `5.2A` to "lokal 2A" w budynku 5.
 * Oryginał leży w .pzt-src/. Na stronie stoi jego ilustracja z podpisami, którą
 * buduje scripts/plan-osiedla.py, z zachowaną geometrią oryginału.
 *
 * `w` i `h` to układ współrzędnych PZT przyciętego z białego marginesu u góry, nie
 * rozmiar pliku ilustracji (ma te same proporcje, większą rozdzielczość). Prostokąty
 * są w tym układzie: [x, y, szerokość, wysokość], odczytane z obrysu ścian na planie.
 * Numer ogródka i jego metraż też pochodzą z PZT i zgadzają się z polem `garden`
 * w danych dewelopera.
 */
export const PLAN = { src: "/osiedle/plan-osiedla.webp", w: 1307, h: 1377 } as const;

export type NaPlanie = { r: readonly [number, number, number, number]; ogrodek: number };

export const NA_PLANIE: Record<string, NaPlanie> = {
  "1.1A": { r: [256, 1046, 121, 113], ogrodek: 1 },
  "1.1B": { r: [377, 1046, 121, 113], ogrodek: 2 },
  "2.2A": { r: [256, 928, 121, 112], ogrodek: 3 },
  "2.2B": { r: [377, 928, 121, 112], ogrodek: 4 },
  "3.3A": { r: [319, 679, 198, 109], ogrodek: 5 },
  "3.3B": { r: [319, 575, 198, 104], ogrodek: 6 },
  "4.1A": { r: [255, 321, 122, 113], ogrodek: 7 },
  "4.1B": { r: [377, 321, 121, 113], ogrodek: 8 },
  "5.2A": { r: [256, 203, 121, 112], ogrodek: 9 },
  "5.2B": { r: [377, 203, 120, 112], ogrodek: 10 },
  "6.1B": { r: [824, 203, 121, 114], ogrodek: 11 },
  "6.1A": { r: [945, 203, 121, 114], ogrodek: 12 },
  "7.2B": { r: [824, 323, 121, 111], ogrodek: 13 },
  "7.2A": { r: [945, 323, 121, 111], ogrodek: 14 },
  "8.3A": { r: [803, 576, 200, 106], ogrodek: 15 },
  "8.3B": { r: [803, 682, 200, 106], ogrodek: 16 },
  "9.1B": { r: [824, 928, 121, 114], ogrodek: 17 },
  "9.1A": { r: [945, 928, 121, 114], ogrodek: 18 },
  "10.2B": { r: [824, 1048, 121, 111], ogrodek: 19 },
  "10.2A": { r: [945, 1048, 121, 111], ogrodek: 20 },
};
