/**
 *  Buduje obrotowy plan osiedla z materiału dewelopera (SenseVR "dollhouse").
 *
 *  Źródło: 120 klatek pełnego obrotu + obrys każdego budynku i punkt etykiety
 *  osobno dla każdej klatki. Bierzemy co trzecią klatkę (krok 9 stopni), bo
 *  120 klatek to 5 MB, a przy przeciąganiu myszą różnicy nie widać.
 *
 *  Obrysy przychodzą jako ścieżki SVG po kilkaset punktów - po uproszczeniu
 *  Douglasem-Peuckerem zostaje ~15 punktów na budynek, czyli 30 KB na komplet
 *  zamiast 600 KB.
 *
 *  Uruchamianie: node scripts/dollhouse.mjs [katalog-ze-zrodlem]
 *  Bez argumentu pobiera paczki z CDN dewelopera.
 */
import sharp from "sharp";
import { mkdir, readFile, writeFile, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const CDN = "https://quptos-web-data.sensevr.pl/ver_2_3/C1/I214/invest_dollhouse/v2";
const STEP = 3;
const EPS = 2;
const OUT_IMG = "public/dollhouse";
const OUT_JSON = "lib/data/estate-orbit.json";

// Klatka źródłowa jest kwadratem, ale osiedle zajmuje w niej tylko pas
// od 30% do 88% wysokości - reszta to pusta płaszczyzna. Docinamy do 3:2,
// żeby plan wypełnił kafel zamiast pływać w marginesie. Obrysy przeliczamy
// tym samym przekształceniem, inaczej rozjadą się z obrazem.
const CROP_TOP = 0.25;
const CROP_H = 2 / 3;

// etykiety budynków - jedyne źródło to units.ts, żeby numeracja się nie rozjechała
async function buildingLabels() {
  const src = await readFile("lib/data/units.ts", "utf8");
  const out = new Map();
  for (const m of src.matchAll(/"stageId":\s*(\d+),\s*\n\s*"letter":\s*"([^"]+)",\s*\n\s*"label":\s*"([^"]+)"/g)) {
    out.set(m[1], { letter: m[2], label: m[3] });
  }
  return out;
}

const remapY = (y) => ((y / 1000 - CROP_TOP) / CROP_H) * 1000;

function parsePath(d) {
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
}

function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0];
  const [bx, by] = pts[pts.length - 1];
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy);
  let maxD = -1;
  let idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d =
      len < 1e-9
        ? Math.hypot(pts[i][0] - ax, pts[i][1] - ay)
        : Math.abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / len;
    if (d > maxD) {
      maxD = d;
      idx = i;
    }
  }
  if (maxD <= eps) return [pts[0], pts[pts.length - 1]];
  return [...rdp(pts.slice(0, idx + 1), eps).slice(0, -1), ...rdp(pts.slice(idx), eps)];
}

// pierścienia nie da się uprościć wprost: pierwszy i ostatni punkt się pokrywają,
// więc prosta bazowa ma zerową długość. Tniemy go w punkcie najdalszym od startu.
function simplifyRing(ring, eps) {
  let pts = ring;
  const f = pts[0];
  const l = pts[pts.length - 1];
  if (Math.hypot(f[0] - l[0], f[1] - l[1]) < 1e-6) pts = pts.slice(0, -1);
  if (pts.length < 4) return pts;
  let far = 1;
  let fd = -1;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1]);
    if (d > fd) {
      fd = d;
      far = i;
    }
  }
  const a = rdp(pts.slice(0, far + 1), eps);
  const b = rdp(pts.slice(far).concat([pts[0]]), eps);
  return a.slice(0, -1).concat(b.slice(0, -1));
}

async function fetchSource(dir) {
  await mkdir(dir, { recursive: true });
  const packs = [
    ["img_exterior_day_lite_webp.zip", "img"],
    ["svg.zip", "svg"],
    ["points.zip", "points"],
  ];
  for (const [zip, name] of packs) {
    const target = join(dir, name);
    if (existsSync(target)) {
      console.log(`${name}: juz pobrane`);
      continue;
    }
    const zipPath = join(dir, zip);
    console.log(`pobieram ${zip} ...`);
    await run("curl", ["-sL", "--max-time", "900", `${CDN}/${zip}`, "-o", zipPath]);
    await mkdir(target, { recursive: true });
    await run("unzip", ["-oq", zipPath, "-d", target]);
    await rm(zipPath);
  }
  return dir;
}

const srcDir = await fetchSource(process.argv[2] || ".dollhouse-src");

const imgDir = join(srcDir, "img");
const svgDir = join(srcDir, "svg");
const pointsDir = join(srcDir, "points");

const frames = (await readdir(imgDir)).filter((f) => f.endsWith(".webp")).sort();
const svgs = (await readdir(svgDir)).filter((f) => f.endsWith(".json")).sort();
const points = (await readdir(pointsDir)).filter((f) => f.endsWith(".json")).sort();

if (frames.length !== svgs.length || frames.length !== points.length) {
  throw new Error(`niezgodna liczba plikow: ${frames.length} klatek, ${svgs.length} obrysow, ${points.length} punktow`);
}

const labels = await buildingLabels();
const meta = JSON.parse(await readFile(join(svgDir, svgs[0]), "utf8"));
const SCALE = Number(meta.transform.match(/scale\(([-\d.]+)/)[1]);
const PT = meta.height_pt;

await rm(OUT_IMG, { recursive: true, force: true });
await mkdir(OUT_IMG, { recursive: true });

const order = [];
const shapes = [];
const anchors = [];
let ids = null;

for (let i = 0, n = 0; i < frames.length; i += STEP, n++) {
  const name = `f${String(n).padStart(2, "0")}.webp`;
  const src = sharp(await readFile(join(imgDir, frames[i])));
  const { width: fw, height: fh } = await src.metadata();
  await src
    .extract({
      left: 0,
      top: Math.round(fh * CROP_TOP),
      width: fw,
      height: Math.round(fh * CROP_H),
    })
    .webp({ quality: 74, effort: 6 })
    .toFile(join(OUT_IMG, name));
  order.push(name);

  const svg = JSON.parse(await readFile(join(svgDir, svgs[i]), "utf8"));
  if (!ids) ids = svg.paths.map((p) => p.unit_id);

  shapes.push(
    svg.paths.map((p) => {
      const norm = parsePath(p.d).map(([px, py]) => [
        ((px * SCALE) / PT) * 1000,
        ((PT - py * SCALE) / PT) * 1000,
      ]);
      return simplifyRing(norm, EPS).flatMap(([a, b]) => [Math.round(a), Math.round(remapY(b))]);
    })
  );

  const pt = JSON.parse(await readFile(join(pointsDir, points[i]), "utf8"));
  const byId = new Map(pt.points.map((p) => [p.id, p]));
  anchors.push(
    ids.map((id) => {
      const p = byId.get(id);
      return p
        ? [Math.round(p.point_normalized.x * 1000), Math.round(remapY(p.point_normalized.y * 1000))]
        : null;
    })
  );
}

const json = {
  frames: order,
  buildings: ids.map((id) => ({
    stageId: Number(id),
    letter: labels.get(id)?.letter ?? "",
    label: labels.get(id)?.label ?? "",
  })),
  shapes,
  anchors,
};

await writeFile(OUT_JSON, `${JSON.stringify(json)}\n`, "utf8");

const { stdout } = await run("du", ["-sk", OUT_IMG]);
console.log(
  `dollhouse: ${order.length} klatek (${stdout.split("\t")[0]} KB), ` +
    `${json.buildings.length} budynkow, JSON ${(JSON.stringify(json).length / 1024).toFixed(0)} KB`
);
console.log(`budynki: ${json.buildings.map((b) => `${b.stageId}=${b.label}`).join(", ")}`);
