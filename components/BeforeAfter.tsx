"use client";

import { useCallback, useRef, useState } from "react";

export default function BeforeAfter() {
  const [pos, setPos] = useState(52);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(2, Math.min(98, p)));
  }, []);

  return (
    <section className="bg-paper py-20 sm:py-28">
      <div className="container-x">
        <header className="max-w-2xl" data-reveal="up">
          <p className="eyebrow">Dzień i noc</p>
          <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-pine">
            Ten sam dom, <span className="italic text-brass-deep">o każdej porze.</span>
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted">
            Przeciągnij suwak, aby zobaczyć apartament w świetle dnia i o zmierzchu, gdy przez panoramiczne okna
            rozlewa się ciepłe światło wnętrza.
          </p>
        </header>

        <div
          ref={ref}
          data-reveal="up"
          className="relative mt-10 aspect-[3/2] w-full cursor-ew-resize select-none overflow-hidden rounded-[18px] border border-ink/10 shadow-[var(--shadow-lift)]"
          onMouseDown={(e) => { dragging.current = true; setFromClientX(e.clientX); }}
          onMouseMove={(e) => dragging.current && setFromClientX(e.clientX)}
          onMouseUp={() => (dragging.current = false)}
          onMouseLeave={() => (dragging.current = false)}
          onTouchStart={(e) => setFromClientX(e.touches[0].clientX)}
          onTouchMove={(e) => setFromClientX(e.touches[0].clientX)}
        >
          {/* night (base) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/renders/facade-night.webp" alt="Apartament Plażowa Park o zmierzchu" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
          <span className="absolute bottom-4 right-4 rounded-full bg-pine-deep/70 px-3 py-1 text-xs font-medium text-paper backdrop-blur-sm">Noc</span>

          {/* day (clipped from the right) */}
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/renders/exterior-golden.webp"
              alt="Apartament Plażowa Park o zachodzie słońca"
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            <span className="absolute bottom-4 left-4 rounded-full bg-paper/85 px-3 py-1 text-xs font-medium text-pine backdrop-blur-sm">Dzień</span>
          </div>

          {/* handle */}
          <div className="absolute inset-y-0 z-10 w-0.5 bg-paper/90" style={{ left: `${pos}%` }}>
            <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-paper shadow-[var(--shadow-lift)]">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-pine">
                <path d="M9 7 4 12l5 5M15 7l5 5-5 5" />
              </svg>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-faint">Wizualizacje poglądowe · na podstawie renderów inwestycji.</p>
      </div>
    </section>
  );
}
