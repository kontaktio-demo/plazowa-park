/**
 *  Pobiera spacery 360 po WNĘTRZACH lokali z konfiguratora dewelopera.
 *
 *  Deweloper ma po jednym spacerze na każdy z sześciu typów lokalu, a nie na
 *  każdy z dwudziestu - wnętrze powtarza się w obrębie typu. Kod spaceru
 *  (`L_0001`...`L_0006`) siedzi już w danych lokali, w polu `viewThumb`
 *  ("L_0004_B4.jpg"), więc mapowanie typ -> spacer wyprowadzamy z units.ts
 *  zamiast wpisywać je na sztywno.
 *
 *  Sceny mają tę samą strukturę co spacer po osiedlu (Marzipano), więc
 *  obsługuje je ten sam komponent. Zapisujemy wyłącznie pola, których używa
 *  viewer - reszta pliku dewelopera to hotspoty i ustawienia jego interfejsu.
 *
 *  Uruchamianie: node scripts/tour-wnetrza.mjs
 */
import { readFile, writeFile } from "node:fs/promises";

const CDN = "https://quptos-web-data.sensevr.pl/ver_2_3/C1/I214/units/units_tour_360/v1";
const HEADERS = {
  "User-Agent": "Mozilla/5.0",
  Referer: "https://ksprestige-glowno-plazowa.sensevr.pl/",
};
const WYJSCIE = "lib/data/tour-wnetrza.json";

/** typ lokalu ("1A") -> kod spaceru ("L_0001"), wyprowadzone z danych lokali */
async function mapaTypow() {
  const src = await readFile("lib/data/units.ts", "utf8");
  const start = src.indexOf("[", src.indexOf("Unit[] = ") + 8);
  let g = 0, end = -1;
  for (let i = start; i < src.length; i++) {
    if (src[i] === "[") g++;
    else if (src[i] === "]" && --g === 0) { end = i; break; }
  }
  const units = JSON.parse(src.slice(start, end + 1));

  const mapa = new Map();
  for (const u of units) {
    const [, reszta = ""] = u.name.split(".");
    const typ = reszta.slice(0, -1) + reszta.slice(-1);
    const kod = String(u.viewThumb || "").split("_B")[0];
    if (!typ || !kod) continue;
    if (mapa.has(typ) && mapa.get(typ) !== kod) {
      throw new Error(`typ ${typ} wskazuje na dwa spacery: ${mapa.get(typ)} i ${kod}`);
    }
    mapa.set(typ, kod);
  }
  return mapa;
}

const mapa = await mapaTypow();
const out = {};

for (const [typ, kod] of [...mapa].sort()) {
  const url = `${CDN}/${kod}/app-files/data.js`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    console.log(`  ${typ} (${kod}): HTTP ${res.status} - pomijam`);
    continue;
  }
  const tekst = await res.text();
  const i = tekst.indexOf("{");
  const dane = JSON.parse(tekst.slice(i, tekst.lastIndexOf("}") + 1));

  out[typ] = {
    base: `${CDN}/${kod}/app-files`,
    scenes: dane.scenes.map((s) => ({
      id: s.id,
      name: s.name,
      faceSize: s.faceSize,
      levels: s.levels,
      initialViewParameters: s.initialViewParameters,
    })),
  };
  console.log(`  ${typ} (${kod}): ${out[typ].scenes.length} scen - ${out[typ].scenes.map((s) => s.name).join(", ")}`);
}

await writeFile(WYJSCIE, JSON.stringify(out, null, 2) + "\n", "utf8");
console.log(`\n${WYJSCIE}: ${Object.keys(out).length} typow`);
