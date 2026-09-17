/**
 * Jednorazowy pipeline assetów. Wynik jest commitowany, więc build nie zależy
 * od tego skryptu. Uruchomienie: node scripts/assets.mjs
 *
 * Robi trzy rzeczy:
 *  1. przepisuje rzuty lokali z 2048px JPEG na WebP w realnie potrzebnym rozmiarze,
 *  2. wycina kadr "życie" z renderu hero (taras, ogród, ciepłe światło, bez ludzi),
 *  3. generuje placeholdery blur do lib/blur.ts.
 */
import sharp from "sharp";
import { readdir, unlink, writeFile, readFile, rename, rmdir, stat, access } from "node:fs/promises";
import { join } from "node:path";

const PUB = "public";
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const sizeOf = async (p) => (await stat(p)).size;
/** Windows blokuje plik, dopóki sharp trzyma go otwartego - czytamy do bufora. */
const load = async (p) => sharp(await readFile(p));

async function renders() {
  try {
    await access(join(PUB, "lifestyle", "rodzina.webp"));
  } catch {
    return console.log("rendery: juz przetworzone, pomijam");
  }
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
    plan: join(PUB, "osiedle", "plan-osiedla.webp"),
  };
  // każdy render z galerii dostaje własny placeholder - inaczej siatka mruga
  // jednym kolorem dla siedmiu różnych zdjęć
  for (const g of await readdir(join(PUB, "galeria"))) {
    targets[`gal-${g.replace(/.webp$/, "")}`] = join(PUB, "galeria", g);
  }

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

await renders();
await blur();
