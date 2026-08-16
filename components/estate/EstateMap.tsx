"use client";

import Image from "next/image";
import { useState } from "react";
import estateMap from "@/lib/data/estate-map.json";
import { STATUS_META } from "@/lib/format";
import { BLUR } from "@/lib/blur";

type MapBuilding = {
  stageId: number;
  letter: string;
  label: string;
  d: string;
  centroid: { x: number; y: number } | null;
  available: number;
  count: number;
};

const data = estateMap as unknown as {
  frame: string;
  width_pt: number;
  height_pt: number;
  transform: string;
  buildings: MapBuilding[];
};

export default function EstateMap({
  selected,
  onSelect,
}: {
  selected: number | null;
  onSelect: (stageId: number | null) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="min-w-0">
      <div className="bd relative aspect-square w-full overflow-hidden border bg-sand-50">
        <Image
          src={data.frame}
          alt="Interaktywny plan osiedla Plażowa Park - sześć budynków"
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          placeholder="blur"
          blurDataURL={BLUR.estate}
          className="object-cover mix-blend-multiply"
          draggable={false}
        />

        <svg
          viewBox={`0 0 ${data.width_pt} ${data.height_pt}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
          role="group"
          aria-label="Klikalny plan budynków"
        >
          <g transform={data.transform}>
            {data.buildings.map((b) => {
              const active = selected === b.stageId || hover === b.stageId;
              return (
                <path
                  key={b.stageId}
                  d={b.d}
                  tabIndex={0}
                  role="button"
                  aria-label={`Budynek ${b.label}, ${b.available} z ${b.count} dostępnych`}
                  onMouseEnter={() => setHover(b.stageId)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(b.stageId)}
                  onBlur={() => setHover(null)}
                  onClick={() => onSelect(selected === b.stageId ? null : b.stageId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(selected === b.stageId ? null : b.stageId);
                    }
                  }}
                  style={{
                    cursor: "pointer",
                    fill: "var(--color-lake-500)",
                    fillOpacity: active ? 0.42 : 0,
                    stroke: active ? "var(--color-lake-900)" : "transparent",
                    strokeWidth: 1.6,
                    transition: "fill-opacity 200ms ease, stroke 200ms ease",
                  }}
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="all"
                />
              );
            })}
          </g>
        </svg>

        {data.buildings.map((b) => {
          if (!b.centroid) return null;
          const active = selected === b.stageId || hover === b.stageId;
          return (
            <button
              key={b.stageId}
              onMouseEnter={() => setHover(b.stageId)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect(selected === b.stageId ? null : b.stageId)}
              className="absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${b.centroid.x * 100}%`, top: `${b.centroid.y * 100}%` }}
              aria-label={`Budynek ${b.label}, ${b.available} z ${b.count} dostępnych`}
            >
              <span
                className={`t-meta-sm flex items-center gap-1.5 whitespace-nowrap border px-2 py-1.5 normal-case transition-colors ${
                  active
                    ? "border-lake-900 bg-lake-900 text-sand-50"
                    : "border-ink/15 bg-sand-50/95 text-ink"
                }`}
              >
                <span className="status-dot" style={{ background: STATUS_META.available.color }} />
                {b.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* legenda pod mapą, nie na niej - na telefonie nie zasłania planu */}
      <ul className="t-meta-sm fg-muted mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        {(["available", "reserved", "sold"] as const).map((k) => (
          <li key={k} className="flex items-center gap-2">
            <span className="status-dot" style={{ background: STATUS_META[k].color }} />
            {STATUS_META[k].label}
          </li>
        ))}
      </ul>
    </div>
  );
}
