/**
 * Synchronizuje lib/data/units.ts z konfiguratorem dewelopera (SenseVR / Qupto,
 * inwestycja 214). Uruchomienie: node scripts/sync-units.mjs
 *
 * Ceny, metraze i rzuty zmieniaja sie rzadko, ale statusy sprzedazy zmieniaja sie
 * ciagle - to jedyne miejsce, w ktorym strona moze sie rozjechac z rzeczywistoscia.
 * Skrypt nadpisuje wylacznie dane; ukladu pliku i typow nie rusza.
 */
import { writeFile, readFile } from "node:fs/promises";

const API = "https://backend.quptos.sensevr.pl/api/0/investment/214";
const HEADERS = { "User-Agent": "Mozilla/5.0", Referer: "https://ksprestige-glowno-plazowa.sensevr.pl/" };

/** API zwraca `free` / `reserved` / `sold`; u nas `available` znaczy to samo co `free`. */
const STATUS = { free: "available", reserved: "reserved", sold: "sold" };

const money = (n) => Math.round(Number(n));
const m2 = (n) => Number(Number(n).toFixed(2));

const [unitsRes, invRes] = await Promise.all([
  fetch(`${API}/all_units?variants=false&show_hidden=false`, { headers: HEADERS }),
  fetch(API, { headers: HEADERS }),
]);
if (!unitsRes.ok || !invRes.ok) throw new Error(`API odpowiedzialo ${unitsRes.status}/${invRes.status}`);
const raw = await unitsRes.json();
const inv = await invRes.json();

// etykiety budynkow ("1 i 2", "3", ...) trzymamy w obecnym pliku - API ich nie zwraca
const current = await readFile("lib/data/units.ts", "utf8");
const prevUnits = JSON.parse(current.match(/export const UNITS: Unit\[\] = (\[[\s\S]*?\n\]);/)[1]);
const labelByStage = new Map(prevUnits.map((u) => [u.stageId, u.buildingLabel]));
const letterByStage = new Map(prevUnits.map((u) => [u.stageId, u.building]));

/**
 * API deklaruje adres rzutu dla kazdego lokalu, ale czesci plikow fizycznie nie ma
 * na CDN dewelopera. Bez tej weryfikacji przycisk "Rzut PDF" prowadzilby w 404.
 */
async function planIfExists(url) {
  if (!url) return null;
  try {
    const r = await fetch(url, { method: "HEAD", headers: HEADERS });
    return r.ok ? url : null;
  } catch {
    return null;
  }
}

const plans = new Map(
  await Promise.all(raw.map(async (u) => [u.id, await planIfExists(u.unitplan_url)]))
);

const units = raw
  .map((u) => ({
    id: String(u.id),
    name: String(u.display_name).trim(),
    projectNumber: String(u.project_number ?? u.display_name).trim(),
    stageId: u.stage_id,
    building: letterByStage.get(u.stage_id) ?? "",
    buildingLabel: labelByStage.get(u.stage_id) ?? "",
    area: m2(u.area),
    garden: m2(u.total_area),
    rooms: u.room_count,
    floors: u.floor_count,
    price: money(u.cost),
    pricePerM: money(u.cost_per_unit_area),
    status: STATUS[u.sales_status] ?? "available",
    planUrl: plans.get(u.id) ?? null,
    viewThumb: u.thumbnail_url ? String(u.thumbnail_url).split("/").pop() : null,
  }))
  .sort((a, b) => a.stageId - b.stageId || a.name.localeCompare(b.name, "pl", { numeric: true }));

const stages = [...new Set(units.map((u) => u.stageId))];
const buildings = stages.map((stageId) => {
  const list = units.filter((u) => u.stageId === stageId);
  return {
    stageId,
    letter: list[0].building,
    label: list[0].buildingLabel,
    count: list.length,
    available: list.filter((u) => u.status === "available").length,
    priceFrom: Math.min(...list.map((u) => u.price)),
    areaFrom: Math.min(...list.map((u) => u.area)),
    areaTo: Math.max(...list.map((u) => u.area)),
    roomsFrom: Math.min(...list.map((u) => u.rooms)),
    roomsTo: Math.max(...list.map((u) => u.rooms)),
    unitIds: list.map((u) => u.id),
  };
});

const investment = {
  totalUnits: units.length,
  available: units.filter((u) => u.status === "available").length,
  buildingsCount: buildings.length,
  priceMin: Math.min(...units.map((u) => u.price)),
  priceMax: Math.max(...units.map((u) => u.price)),
  areaMin: Math.min(...units.map((u) => u.area)),
  areaMax: Math.max(...units.map((u) => u.area)),
  roomsMin: Math.min(...units.map((u) => u.rooms)),
  roomsMax: Math.max(...units.map((u) => u.rooms)),
};

const head = current.slice(0, current.indexOf("export const UNITS"));
const body =
  `export const UNITS: Unit[] = ${JSON.stringify(units, null, 2)};\n\n` +
  `export const BUILDINGS: Building[] = ${JSON.stringify(buildings, null, 2)};\n\n` +
  `export const INVESTMENT = ${JSON.stringify(investment, null, 2)} as const;\n`;
await writeFile("lib/data/units.ts", head + body, "utf8");

const byStatus = units.reduce((a, u) => ({ ...a, [u.status]: (a[u.status] || 0) + 1 }), {});
console.log(`spacer 360 wg API: ${inv.virtual_walkthrough_url ?? "brak"}`);
console.log(`lokali: ${units.length}, ${JSON.stringify(byStatus)}`);
console.log(`ceny: ${investment.priceMin.toLocaleString("pl-PL")} - ${investment.priceMax.toLocaleString("pl-PL")} zl`);
const missing = units.filter((u) => !u.planUrl).map((u) => u.name);
if (missing.length) console.log(`UWAGA: brak rzutu PDF na CDN dewelopera dla: ${missing.join(", ")}`);
