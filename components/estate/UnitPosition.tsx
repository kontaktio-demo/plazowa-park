import type { Unit } from "@/lib/data/units";
import { buildingUnits, unitPlace } from "@/lib/unitType";

/**
 * Pozycja lokalu w budynku, rysowana z realnej numeracji dewelopera. Podpis mówi
 * o budynku, a nie o segmencie bryły: "Dom 4" znaczyło tu czwarty segment, więc
 * po rozdzieleniu mieszkań i domów czytałoby się jako rodzaj lokalu.
 */
export default function UnitPosition({ unit, className = "" }: { unit: Unit; className?: string }) {
  const units = buildingUnits(unit.stageId);
  const houses = [...new Set(units.map((u) => u.name.split(".")[0]))];
  const place = unitPlace(unit);

  return (
    <div className={className}>
      <div className="flex items-stretch gap-1.5" aria-hidden>
        {houses.map((h) => (
          <div key={h} className="flex flex-1 gap-px">
            {units
              .filter((u) => u.name.startsWith(`${h}.`))
              .map((u) => (
                <span
                  key={u.id}
                  className={`h-4 flex-1 border ${
                    u.id === unit.id ? "border-sun bg-sun" : "border-sun/40"
                  }`}
                />
              ))}
          </div>
        ))}
      </div>
      <p className="t-label mt-2">
        Budynek {unit.buildingLabel} · strona {place.side}
      </p>
      <p className="t-meta-sm fg-muted mt-1">Wypełniony kwadrat to ten lokal, obrys to sąsiedzi.</p>
    </div>
  );
}
