/**
 * Jednorazowy pipeline assetów. Wynik jest commitowany, więc build nie zależy
 * od tego skryptu. Uruchomienie: node scripts/assets.mjs
 *
 * Robi cztery rzeczy:
 *  1. tnie sekwencję obrotu ze 120 klatek do 24 (desktop) i 6 (mobile),
 *  2. przepisuje rzuty lokali z 2048px JPEG na WebP w realnie potrzebnym rozmiarze,
 *  3. wycina kadr "życie" z renderu hero (taras, ogród, ciepłe światło, bez ludzi),
 *  4. generuje placeholdery blur do lib/blur.ts.
 */
import sharp from "sharp";
import { readdir, unlink, writeFile, readFile, rename, rmdir, stat } from "node:fs/promises";
import { join } from "node:path";

const PUB = "public";
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const sizeOf = async (p) => (await stat(p)).size;
/** Windows blokuje plik, dopóki sharp trzyma go otwartego - czytamy do bufora. */
const load = async (p) => sharp(await readFile(p));

async function orbit() {
  const dir = join(PUB, "orbit");
  const src = (await readdir(dir)).filter((f) => /^f\d{3}\.webp$/.test(f)).sort();
  if (!src.length) return console.log("orbit: brak klatek źródłowych, pomijam");

  const pick = (count) =>
    Array.from({ length: count }, (_, i) => src[Math.round((i * src.length) / count) % src.length]);

  let total = 0;
  const desk = pick(24);
  for (let i = 0; i < desk.length; i++) {
    const out = join(dir, `d${String(i + 1).padStart(2, "0")}.webp`);
    await (await load(join(dir, desk[i]))).resize(1100, 1100).webp({ quality: 45, effort: 6 }).toFile(out);
    total += await sizeOf(out);
  }

  let totalM = 0;
  const mob = pick(6);
  for (let i = 0; i < mob.length; i++) {
    const out = join(dir, `m${String(i + 1).padStart(2, "0")}.webp`);
    await (await load(join(dir, mob[i]))).resize(620, 620).webp({ quality: 48, effort: 6 }).toFile(out);
    totalM += await sizeOf(out);
  }

  for (const f of src) await unlink(join(dir, f));
  console.log(`orbit: 24 klatek desktop ${kb(total)} (${kb(total / 24)}/klatka), 6 mobile ${kb(totalM)}`);
}

/** Numer lokalu koduje typ: segment + strona. Sześć rzutów, sześć typów. */
const PLANS = {
  "L_0001_B1.jpg": "1A",
  "L_0002_B2.jpg": "1B",
  "L_0003_B3.jpg": "2A",
  "L_0004_B4.jpg": "2B",
  "L_0005_B5.jpg": "3A",
  "L_0006_B6.jpg": "3B",
};

async function plans() {
  const dir = join(PUB, "unit-views");
  let total = 0;
  const dims = {};
  for (const [file, type] of Object.entries(PLANS)) {
    const out = join(dir, `typ-${type}.webp`);
    // trim zdejmuje szeroki, pusty margines renderu - po nim kadr to sam rzut,
    // a jego proporcja niesie realny kształt lokalu (wąski i głęboki vs kwadratowy)
    const info = await (await load(join(dir, file)))
      .trim({ threshold: 18 })
      .resize(640, 640, { fit: "inside" })
      .webp({ quality: 80, effort: 6 })
      .toFile(out);
    dims[type] = `${info.width}x${info.height}`;
    total += await sizeOf(out);
    await unlink(join(dir, file));
  }
  console.log(`rzuty: 6 typów ${kb(total)} ${JSON.stringify(dims)}`);
}

async function renders() {
  // kadr do sekcji "Życie": taras, przeszklenia, prywatny trawnik, bez ludzi
  const zycie = join(PUB, "renders", "zycie.webp");
  await (await load(join(PUB, "renders", "hero.webp")))
    .extract({ left: 1000, top: 520, width: 1400, height: 820 })
    .resize(1400)
    .webp({ quality: 74, effort: 6 })
    .toFile(zycie);

  const heroTmp = join(PUB, "renders", "hero.tmp.webp");
  await (await load(join(PUB, "renders", "hero.webp"))).resize(2400).webp({ quality: 68, effort: 6 }).toFile(heroTmp);
  const tourTmp = join(PUB, "renders", "tour.tmp.webp");
  await (await load(join(PUB, "renders", "tour-poster.webp"))).resize(1376).webp({ quality: 70, effort: 6 }).toFile(tourTmp);

  await rename(heroTmp, join(PUB, "renders", "hero.webp"));
  await rename(tourTmp, join(PUB, "renders", "tour-poster.webp"));

  // stockowe zdjęcie rodziny wypada z projektu
  try {
    await unlink(join(PUB, "lifestyle", "rodzina.webp"));
    await rmdir(join(PUB, "lifestyle"));
  } catch {
    /* już usunięte */
  }

  console.log(
    `rendery: hero ${kb(await sizeOf(join(PUB, "renders", "hero.webp")))}, ` +
      `spacer ${kb(await sizeOf(join(PUB, "renders", "tour-poster.webp")))}, ` +
      `życie ${kb(await sizeOf(zycie))}`
  );
}

async function blur() {
  const targets = {
    hero: join(PUB, "renders", "hero.webp"),
    zycie: join(PUB, "renders", "zycie.webp"),
    tour: join(PUB, "renders", "tour-poster.webp"),
    estate: join(PUB, "map", "estate-frame.webp"),
  };
  const out = {};
  for (const [key, file] of Object.entries(targets)) {
    const buf = await (await load(file)).resize(14).webp({ quality: 28 }).toBuffer();
    out[key] = `data:image/webp;base64,${buf.toString("base64")}`;
  }
  const body =
    "// Wygenerowane przez scripts/assets.mjs - placeholdery blur dla next/image.\n" +
    "export const BLUR = " +
    JSON.stringify(out, null, 2) +
    " as const;\n";
  await writeFile("lib/blur.ts", body, "utf8");
  console.log(`blur: ${Object.keys(out).length} placeholderów`);
}

await orbit();
await plans();
await renders();
await blur();
