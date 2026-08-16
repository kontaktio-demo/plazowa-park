import type { Unit } from "@/lib/data/units";
import { buildingUnits, unitPlace } from "@/lib/unitType";

/**
 * Pozycja lokalu w bryle. Rysowana z realnej numeracji dewelopera: budynek dzieli
 * się na domy, dom na strony A i B. Dwie karty tego samego typu rzutu dostają
 * dzięki temu inny obrazek, bo faktycznie stoją gdzie indziej.
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
                    u.id === unit.id ? "border-sun bg-sun" : "border-lake-500/40"
                  }`}
                />
              ))}
          </div>
        ))}
      </div>
      <p className="t-meta-sm fg-muted mt-2">
        Dom {place.house} · strona {place.side}
      </p>
    </div>
  );
}
