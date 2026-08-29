/**
 *  Sześć kadrów budynków wyciętych z dollhouse'u dewelopera.
 *
 *  Sekcja "Osiedle" pokazywała wcześniej rysowane sylwetki elewacji - płaskie,
 *  cztery z sześciu identyczne i bez jednego drzewa, mimo nagłówka "osiedle
 *  ukryte w lesie". Zamiast tego bierzemy prawdziwy render.
 *
 *  Dla każdego budynku wybieramy tę klatkę obrotu, na której jego obrys ma
 *  największą powierzchnię - czyli tę, na której budynek stoi najbliżej widza
 *  i nie jest zasłonięty przez sąsiedni. Kadr liczymy z obrysu, nie ręcznie.
 *
 *  Źródło: paczka img_exterior_day_offline_webp_preview (12 klatek 2048 px)
 *  plus svg_preview z tego samego manifestu invest_dollhouse/v2.
 *  Uruchamianie: node scripts/osiedle-kadry.mjs <katalog-ze-zrodlem>
 *  Katalog musi zawierać podkatalogi img/ i svg/.
 */
import sharp from "sharp";
import { readdir, readFile, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const SRC = process.argv[2];
if (!SRC) throw new Error("podaj katalog ze zrodlem (img/ + svg/)");

const OUT = "public/osiedle";
const RATIO = 4 / 3;
const WIDTH = 1000;

const imgDir = join(SRC, "img");
const svgDir = join(SRC, "svg");
const frames = (await readdir(imgDir)).filter((f) => f.endsWith(".webp")).sort();
const svgs = (await readdir(svgDir)).filter((f) => f.endsWith(".json")).sort();
if (frames.length !== svgs.length) throw new Error(`${frames.length} klatek, ${svgs.length} obrysow`);

const parse = (d) => {
  const nums = d.replace(/\n/g, " ").match(/-?\d+(?:\.\d+)?/g).map(Number);
  const pts = [];
  let x = nums[0];
  let y = nums[1];
  pts.push([x, y]);
  for (let i = 2; i + 1 < nums.length; i += 2) {
    x += nums[i];
    y += nums[i + 1];
    pts.push([x, y]);
  }
  return pts;
};

const area = (pts) => {
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    a += pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
  }
  return Math.abs(a) / 2;
};

const meta = JSON.parse(await readFile(join(svgDir, svgs[0]), "utf8"));
const SCALE = Number(meta.transform.match(/scale\(([-\d.]+)/)[1]);
const PT = meta.height_pt;

// dla kazdego budynku: klatka o najwiekszym obrysie plus prostokat kadru
const best = new Map();
for (let i = 0; i < svgs.length; i++) {
  const svg = JSON.parse(await readFile(join(svgDir, svgs[i]), "utf8"));
  for (const p of svg.paths) {
    const raw = parse(p.d);
    const a = area(raw);
    const prev = best.get(p.unit_id);
    if (prev && prev.a >= a) continue;
    const norm = raw.map(([px, py]) => [(px * SCALE) / PT, (PT - py * SCALE) / PT]);
    const xs = norm.map((q) => q[0]);
    const ys = norm.map((q) => q[1]);
    best.set(p.unit_id, {
      a,
      frame: i,
      box: { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) },
    });
  }
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const { width: W } = await sharp(await readFile(join(imgDir, frames[0]))).metadata();

for (const [id, b] of [...best].sort((p, q) => Number(p[0]) - Number(q[0]))) {
  // kadr szerszy niż sam budynek, żeby weszły drzewa i kawałek otoczenia
  const padX = (b.box.x1 - b.box.x0) * 0.34;
  const padY = (b.box.y1 - b.box.y0) * 0.3;
  let x0 = (b.box.x0 - padX) * W;
  let x1 = (b.box.x1 + padX) * W;
  let y0 = (b.box.y0 - padY) * W;
  let y1 = (b.box.y1 + padY) * W;

  // dociągamy do 4:3 wokół środka kadru
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  let w = Math.max(x1 - x0, (y1 - y0) * RATIO);
  let h = w / RATIO;
  w = Math.min(w, W);
  h = Math.min(h, W);
  x0 = Math.round(Math.min(Math.max(cx - w / 2, 0), W - w));
  y0 = Math.round(Math.min(Math.max(cy - h / 2, 0), W - h));

  const out = join(OUT, `b${id}.webp`);
  await sharp(await readFile(join(imgDir, frames[b.frame])))
    .extract({ left: x0, top: y0, width: Math.round(w), height: Math.round(h) })
    .resize(WIDTH, Math.round(WIDTH / RATIO))
    .webp({ quality: 76, effort: 6 })
    .toFile(out);
  console.log(`budynek ${id}: klatka ${b.frame}, kadr ${Math.round(w)}x${Math.round(h)} -> ${out}`);
}
