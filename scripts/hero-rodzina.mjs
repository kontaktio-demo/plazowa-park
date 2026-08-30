/**
 * Podmiana rodziny na renderze hero.
 *
 * W oryginale od dewelopera postacie mają zepsutą anatomię - dziecku wyrasta
 * z głowy czerwony kształt, a dłonie rodziców zlewają się w jedną plamę - i są
 * wyraźnie bardziej rozmyte niż architektura. Bryła budynku musi zostać
 * nietknięta, więc nie da się przepuścić całego kadru przez generator: każdy
 * model przekomponowuje scenę. Stąd ta operacja:
 *
 *   1. tło po starych postaciach łatamy materiałem z tego samego kadru
 *      (pas elewacji i kwiatów z lewej, żwir z dołu),
 *   2. wklejamy wycięte sylwetki w skali i na linii gruntu oryginału,
 *   3. dokładamy miękkie cienie kontaktowe, bo wycinanie tła je zabrało.
 *
 * Wejście: .hero-src/ (oryginał dewelopera i wycięta rodzina, poza repozytorium).
 * Wyjście: public/renders/hero.webp
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";

const BAZA = ".hero-src/hero-base.webp";
const WYCINKA = ".hero-src/rodzina.png";
const WYJSCIE = "public/renders/hero.webp";

// zmierzone na oryginale: sylwetki, linia stóp i pasy tła
// prawa krawędź trzyma się sylwetki matki - dalej zaczyna się podejście
// do wejścia i łata zamalowywałaby stopień betonowym pasem kwiatów
const STARE = { x1: 1758, y1: 762, x2: 1928, y2: 950 };
const SZEW = 926; // granica pasa kwiatów i żwiru
const DAWCA_GORA = { left: 1578, top: 738, width: 192, height: 192 };
const DAWCA_ZWIR = { left: 1742, top: 950, width: 200, height: 48 };

// sylwetki w wycince: [chłopiec z ojcem, matka]
const POSTACIE = [
  { crop: { left: 37, top: 43, width: 1094, height: 1632 }, w: 116, h: 173, x: 1761, y: 770 },
  { crop: { left: 1431, top: 67, width: 527, height: 1568 }, w: 54, h: 161, x: 1875, y: 776 },
];

const zanik = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

const hero = sharp(BAZA);
const { width: W, height: H } = await hero.metadata();
const plotno = await hero.raw().toBuffer();

const wklejPas = async (dawca, doX, doY, maska) => {
  const { data, info } = await sharp(BAZA).extract(dawca).raw().toBuffer({ resolveWithObject: true });
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const dx = doX + x, dy = doY + y;
      if (dx < 0 || dy < 0 || dx >= W || dy >= H) continue;
      const a = maska(dx, dy);
      if (a <= 0) continue;
      const s = (y * info.width + x) * 3;
      const d = (dy * W + dx) * 3;
      for (let k = 0; k < 3; k++) plotno[d + k] = Math.round(plotno[d + k] * (1 - a) + data[s + k] * a);
    }
  }
};

// 1. elewacja i pas kwiatów - łata z lewej strony kadru
await wklejPas(DAWCA_GORA, STARE.x1 - 4, DAWCA_GORA.top, (x, y) => {
  const brzeg = Math.min(x - (STARE.x1 - 4), STARE.x2 + 6 - x, y - DAWCA_GORA.top) / 7;
  return zanik(brzeg) * zanik((SZEW + 4 - y) / 8);
});

// 2. żwir - łata z tego samego fragmentu ścieżki, przesunięta w górę
await wklejPas(DAWCA_ZWIR, STARE.x1 - 6, SZEW - 6, (x, y) => {
  const brzeg = Math.min(x - (STARE.x1 - 6), STARE.x2 + 8 - x) / 8;
  return zanik(brzeg) * zanik((y - (SZEW - 8)) / 8) * zanik((STARE.y2 + 10 - y) / 8);
});

// 3. cienie kontaktowe pod stopami - wycinanie tła zabrało oryginalne
const cienie = POSTACIE.map((p) => {
  const cx = p.x + p.w * 0.5 + 3;
  const cy = p.y + p.h - 2;
  return `<ellipse cx="${cx}" cy="${cy}" rx="${p.w * 0.42}" ry="${Math.max(3, p.h * 0.035)}" fill="rgba(26,20,14,0.42)"/>`;
}).join("");
const warstwaCieni = await sharp(
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${cienie}</svg>`)
).blur(3).raw().toBuffer({ resolveWithObject: true });

const nakladka = (data, info, offX, offY) => {
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const a = data[(y * info.width + x) * 4 + 3] / 255;
      if (a <= 0.004) continue;
      const dx = offX + x, dy = offY + y;
      if (dx < 0 || dy < 0 || dx >= W || dy >= H) continue;
      const s = (y * info.width + x) * 4;
      const d = (dy * W + dx) * 3;
      for (let k = 0; k < 3; k++) plotno[d + k] = Math.round(plotno[d + k] * (1 - a) + data[s + k] * a);
    }
  }
};
nakladka(warstwaCieni.data, warstwaCieni.info, 0, 0);

// 4. sylwetki
for (const p of POSTACIE) {
  const { data, info } = await sharp(WYCINKA)
    .extract(p.crop)
    .resize(p.w, p.h, { kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  nakladka(data, info, p.x, p.y);
}

await sharp(plotno, { raw: { width: W, height: H, channels: 3 } })
  .webp({ quality: 92, effort: 6 })
  .toFile(WYJSCIE);

console.log(`${WYJSCIE}: ${W}x${H}, ${Math.round(readFileSync(WYJSCIE).length / 1024)} kB`);
