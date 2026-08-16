"use client";

import { useEffect, useRef, useState } from "react";
import { SECTIONS } from "@/lib/sections";

/**
 * Skala głębokości - pionowa oś przy prawej krawędzi, czytana jak łata wodowskazowa.
 * Podziałka nie jest dekoracją: każdy znacznik stoi na realnej głębokości swojej
 * sekcji w dokumencie, a linia powierzchni wody pokazuje bieżącą pozycję scrolla.
 * Nad linią oś jest zanurzona, pod nią sucha.
 */
export default function DepthRail() {
  const [marks, setMarks] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);
  const [dark, setDark] = useState(true);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const floodRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef(0);
  const darkRef = useRef(true);

  useEffect(() => {
    const root = document.documentElement;
    let max = 1;
    let vh = root.clientHeight;
    let tops: number[] = [];

    const measure = () => {
      max = Math.max(1, root.scrollHeight - root.clientHeight);
      vh = root.clientHeight;
      tops = SECTIONS.map((s) => {
        const el = document.getElementById(s.id);
        return el ? el.offsetTop : Number.POSITIVE_INFINITY;
      });
      setMarks(tops.map((t) => (Number.isFinite(t) ? Math.min(1, Math.max(0, t / max)) : -1)));
    };

    let scheduled = false;
    const update = () => {
      scheduled = false;
      const y = window.scrollY || root.scrollTop;
      const p = Math.min(1, Math.max(0, y / max));
      if (surfaceRef.current) surfaceRef.current.style.transform = `translate3d(0, ${p * 100}%, 0)`;
      if (floodRef.current) floodRef.current.style.transform = `scaleY(${p})`;

      const mid = y + vh * 0.45;
      let cur = -1;
      for (let i = 0; i < tops.length; i++) if (tops[i] <= mid) cur = i;
      const safe = Math.max(0, cur);
      if (safe !== idxRef.current) {
        idxRef.current = safe;
        setIdx(safe);
      }
      const isDark = cur < 0 ? true : SECTIONS[safe].dark;
      if (isDark !== darkRef.current) {
        darkRef.current = isDark;
        setDark(isDark);
      }
    };
    const onScroll = () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(update);
      }
    };
    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("load", onResize);
    const settle = window.setTimeout(onResize, 700);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      window.clearTimeout(settle);
    };
  }, []);

  const axis = dark ? "bg-lake-500/35" : "bg-ink/15";
  const tick = dark ? "bg-lake-300/40" : "bg-ink/22";
  const tickOn = dark ? "bg-lake-300" : "bg-lake-700";
  const muted = dark ? "text-sand-50/45" : "text-ink/40";
  const accent = dark ? "text-lake-300" : "text-lake-700";
  const flood = dark ? "from-lake-300/28 to-lake-500/8" : "from-lake-700/22 to-lake-500/6";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-0 z-40 hidden w-20 [@media(min-width:1280px)]:block"
      style={{ top: "calc(var(--nav-h) + 28px)", bottom: "28px" }}
    >
      <div className="relative h-full">
        <div className={`absolute left-6 top-0 h-full w-px transition-colors duration-500 ${axis}`} />
        <div
          ref={floodRef}
          className={`absolute left-[22px] top-0 h-full w-[3px] origin-top bg-gradient-to-b transition-colors duration-500 ${flood}`}
          style={{ transform: "scaleY(0)" }}
        />

        {marks.map((m, i) =>
          m < 0 ? null : (
            <div key={SECTIONS[i].id} className="absolute left-0 w-full" style={{ top: `${m * 100}%` }}>
              <span
                className={`absolute right-[calc(100%-24px)] h-px transition-all duration-300 ${
                  i === idx ? `w-4 ${tickOn}` : `w-2 ${tick}`
                }`}
              />
              <span
                className={`t-meta-sm absolute left-8 -translate-y-1/2 tabular-nums transition-colors duration-300 ${
                  i === idx ? accent : muted
                }`}
              >
                {SECTIONS[i].n}
              </span>
            </div>
          )
        )}

        <div ref={surfaceRef} className="absolute inset-x-0 top-0 will-change-transform">
          <div className="relative -translate-y-1/2">
            <div className={`h-3 overflow-hidden transition-colors duration-500 ${accent}`}>
              <svg className="water-drift h-3 w-40" viewBox="0 0 160 12" fill="none" preserveAspectRatio="none">
                <path
                  d="M0 6 C 5 2.6, 15 2.6, 20 6 S 35 9.4, 40 6 S 55 2.6, 60 6 S 75 9.4, 80 6 S 95 2.6, 100 6 S 115 9.4, 120 6 S 135 2.6, 140 6 S 155 9.4, 160 6"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
              </svg>
            </div>
            <span className={`t-meta-sm absolute left-[54px] top-3 whitespace-nowrap [writing-mode:vertical-rl] transition-colors duration-500 ${muted}`}>
              {SECTIONS[idx].label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
