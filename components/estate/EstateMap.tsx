"use client";

import { useState } from "react";
import estateMap from "@/lib/data/estate-map.json";

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
    <div className="relative aspect-square w-full overflow-hidden rounded-[16px] border border-ink/10 bg-[#f3efe6] shadow-[var(--shadow-soft)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.frame}
        alt="Interaktywny plan osiedla Plażowa Park - sześć budynków"
        className="absolute inset-0 h-full w-full object-cover"
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
                  fill: active ? "var(--color-available)" : "#122318",
                  fillOpacity: active ? 0.34 : 0,
                  stroke: active ? "var(--color-pine-deep)" : "transparent",
                  strokeWidth: 1.6,
                  transition: "fill-opacity 0.3s ease, stroke 0.3s ease",
                }}
                vectorEffect="non-scaling-stroke"
                pointerEvents="all"
              />
            );
          })}
        </g>
      </svg>

      {/* centroid pins */}
      {data.buildings.map((b) => {
        if (!b.centroid) return null;
        const active = selected === b.stageId || hover === b.stageId;
        return (
          <button
            key={b.stageId}
            onMouseEnter={() => setHover(b.stageId)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onSelect(selected === b.stageId ? null : b.stageId)}
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${b.centroid.x * 100}%`, top: `${b.centroid.y * 100}%` }}
            aria-label={`Budynek ${b.label}`}
          >
            <span
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.72rem] font-semibold shadow-sm backdrop-blur-sm transition-all ${
                active
                  ? "border-pine bg-pine text-paper scale-105"
                  : "border-ink/10 bg-paper/90 text-pine"
              }`}
            >
              <span className="status-dot" style={{ background: "var(--color-available)" }} />
              {b.label}
            </span>
          </button>
        );
      })}

      {/* legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-full border border-ink/10 bg-paper/85 px-3 py-1.5 text-[0.7rem] text-ink-soft backdrop-blur-sm">
        <span className="flex items-center gap-1.5">
          <span className="status-dot" style={{ background: "var(--color-available)" }} /> Dostępny
        </span>
        <span className="flex items-center gap-1.5">
          <span className="status-dot" style={{ background: "var(--color-reserved)" }} /> Rezerwacja
        </span>
        <span className="flex items-center gap-1.5">
          <span className="status-dot" style={{ background: "var(--color-sold)" }} /> Sprzedany
        </span>
      </div>
    </div>
  );
}
