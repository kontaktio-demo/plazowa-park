"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import orbit from "@/lib/data/estate-orbit.json";
import { BUILDINGS, UNITS } from "@/lib/data/units";
import { STATUS_META } from "@/lib/format";
import { BLUR } from "@/lib/blur";

type Orbit = {
  frames: string[];
  buildings: { stageId: number; letter: string; label: string }[];
  shapes: number[][][];
  anchors: ([number, number] | null)[][];
};

const data = orbit as Orbit;
const COUNT = data.frames.length;
const SRC = (i: number) => `/dollhouse/${data.frames[i]}`;

// ile pikseli przeciągnięcia na jedną klatkę - dobrane tak, żeby pełny obrót
// wypadał na mniej więcej półtorej szerokości planu
const DRAG_PER_FRAME = 16;

const stats = new Map(BUILDINGS.map((b) => [b.stageId, b]));


const PRESENT = (["available", "reserved", "sold"] as const).filter((k) =>
  UNITS.some((u) => u.status === k)
);

const buildingStatus = (available: number, count: number) =>
  available === 0 ? "sold" : available < count ? "reserved" : "available";
const wrap = (i: number) => ((i % COUNT) + COUNT) % COUNT;
const points = (flat: number[]) => {
  const out: string[] = [];
  for (let i = 0; i < flat.length; i += 2) out.push(`${flat[i]},${flat[i + 1]}`);
  return out.join(" ");
};

export default function EstateMap({
  selected,
  onSelect,
}: {
  selected: number | null;
  onSelect: (stageId: number | null) => void;
}) {
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(1);
  const boxRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; from: number; moved: boolean } | null>(null);
  const ready = loaded === COUNT;

  // klatki ciągniemy dopiero, gdy plan wjeżdża w ekran - 1,7 MB nie ma prawa
  // obciążać pierwszego wejścia na stronę
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        (async () => {
          for (let i = 1; i < COUNT && !cancelled; i++) {
            await new Promise<void>((done) => {
              const img = new window.Image();
              img.onload = img.onerror = () => done();
              img.src = SRC(i);
            });
            if (!cancelled) setLoaded((n) => n + 1);
          }
        })();
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  const spin = useCallback((delta: number) => setIndex((i) => wrap(i + delta)), []);

  const onDown = (e: React.PointerEvent) => {
    if (!ready) return;
    drag.current = { id: e.pointerId, x: e.clientX, from: index, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    setIndex(wrap(d.from - Math.round(dx / DRAG_PER_FRAME)));
  };

  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // klik w budynek nie może odpalić się na końcu przeciągania
  const pick = (stageId: number) => {
    if (drag.current?.moved) return;
    onSelect(selected === stageId ? null : stageId);
  };

  return (
    <div className="min-w-0">
      <div
        ref={boxRef}
        className={`bd relative aspect-3/2 w-full touch-pan-y overflow-hidden border bg-sand-50 ${
          ready ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <Image
          src={SRC(0)}
          alt="Plan osiedla Plażowa Park - sześć budynków wśród drzew"
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          placeholder="blur"
          blurDataURL={BLUR.estate}
          className="object-cover mix-blend-multiply"
          draggable={false}
        />
        {index !== 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={SRC(index)}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover mix-blend-multiply"
            draggable={false}
          />
        )}

        <svg
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          role="group"
          aria-label="Klikalny plan budynków"
        >
          {data.buildings.map((b, bi) => {
            const active = selected === b.stageId || hover === b.stageId;
            const s = stats.get(b.stageId);
            return (
              <polygon
                key={b.stageId}
                points={points(data.shapes[index][bi])}
                tabIndex={0}
                role="button"
                aria-label={`Budynek ${b.label}, ${s?.available ?? 0} z ${s?.count ?? 0} dostępnych`}
                onMouseEnter={() => setHover(b.stageId)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(b.stageId)}
                onBlur={() => setHover(null)}
                onClick={() => pick(b.stageId)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(selected === b.stageId ? null : b.stageId);
                  }
                }}
                style={{
                  cursor: "pointer",
                  fill: "var(--color-lake-500)",
                  fillOpacity: active ? 0.44 : 0.16,
                  stroke: active
                    ? "var(--color-lake-900)"
                    : "color-mix(in srgb, var(--color-lake-700) 45%, transparent)",
                  strokeWidth: 1.6,
                  transition: "fill-opacity 160ms ease, stroke 160ms ease",
                }}
                vectorEffect="non-scaling-stroke"
                pointerEvents="all"
              />
            );
          })}
        </svg>

        {data.buildings.map((b, bi) => {
          const a = data.anchors[index][bi];
          if (!a) return null;
          const active = selected === b.stageId || hover === b.stageId;
          const s = stats.get(b.stageId);
          return (
            <button
              key={b.stageId}
              type="button"
              onMouseEnter={() => setHover(b.stageId)}
              onMouseLeave={() => setHover(null)}
              onClick={() => pick(b.stageId)}
              className="absolute z-10 flex h-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${a[0] / 10}%`, top: `${a[1] / 10}%` }}
              aria-label={`Budynek ${b.label}, ${s?.available ?? 0} z ${s?.count ?? 0} dostępnych`}
              tabIndex={-1}
            >
              <span
                className={`t-meta-sm flex items-center gap-1.5 whitespace-nowrap border px-2 py-1 normal-case transition-colors ${
                  active
                    ? "border-lake-900 bg-lake-900 text-sand-50"
                    : "border-ink/15 bg-sand-50/95 text-ink"
                }`}
              >
                <span
                  className="status-dot"
                  style={{ background: STATUS_META[buildingStatus(s?.available ?? 0, s?.count ?? 0)].color }}
                />
                {b.label}
              </span>
            </button>
          );
        })}

        {!ready && (
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-ink/10">
            <div
              className="h-full bg-lake-700 transition-[width] duration-200"
              style={{ width: `${(loaded / COUNT) * 100}%` }}
            />
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <ul className="t-meta-sm fg-muted flex flex-wrap items-center gap-x-6 gap-y-2">
          {PRESENT.map((k) => (
            <li key={k} className="flex items-center gap-2">
              <span className="status-dot" style={{ background: STATUS_META[k].color }} />
              {STATUS_META[k].label}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <span className="t-meta-sm fg-muted hidden sm:inline">
            {ready ? "Przeciągnij, aby obrócić" : "Wczytywanie obrotu"}
          </span>
          <button
            type="button"
            onClick={() => spin(-2)}
            disabled={!ready}
            aria-label="Obróć plan w lewo"
            className="bd flex h-10 w-10 items-center justify-center border transition-colors hover:border-lake-700 disabled:opacity-40"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 14L4 9l5-5" />
              <path d="M4 9h11a5 5 0 0 1 0 10h-1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => spin(2)}
            disabled={!ready}
            aria-label="Obróć plan w prawo"
            className="bd flex h-10 w-10 items-center justify-center border transition-colors hover:border-lake-700 disabled:opacity-40"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 14l5-5-5-5" />
              <path d="M20 9H9a5 5 0 0 0 0 10h1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
