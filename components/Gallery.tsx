"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GALLERY } from "@/lib/data/site";
import { Icon } from "./Icons";

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  const move = useCallback(
    (dir: number) => setOpen((i) => (i === null ? i : (i + dir + GALLERY.length) % GALLERY.length)),
    []
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, move]);

  const scrollByCards = (dir: number) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 700), behavior: "smooth" });
  };

  // drag to scroll (desktop)
  const onDown = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = { down: true, startX: e.pageX, startScroll: el.scrollLeft, moved: false };
  };
  const onMove = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.pageX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
  };
  const onUp = () => (drag.current.down = false);

  return (
    <section id="galeria" className="overflow-hidden bg-paper-2 py-20 sm:py-28">
      <div className="container-x flex flex-wrap items-end justify-between gap-6">
        <header data-reveal="up">
          <p className="eyebrow">Galeria</p>
          <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-pine">
            Zobacz <span className="italic text-brass-deep">Plażowa Park.</span>
          </h2>
        </header>
        <div className="hidden items-center gap-2 md:flex">
          <button onClick={() => scrollByCards(-1)} aria-label="Poprzednie" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-pine transition hover:border-pine hover:bg-pine hover:text-paper">
            <Icon.arrow width={18} height={18} className="rotate-180" />
          </button>
          <button onClick={() => scrollByCards(1)} aria-label="Następne" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-pine transition hover:border-pine hover:bg-pine hover:text-paper">
            <Icon.arrow width={18} height={18} />
          </button>
        </div>
      </div>

      {/* filmstrip */}
      <div
        ref={trackRef}
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        style={{ paddingInline: "clamp(1.25rem, 4vw, 3.5rem)", cursor: drag.current.down ? "grabbing" : "grab" }}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
      >
        {GALLERY.map((g, i) => (
          <button
            key={g.src}
            onClick={() => { if (!drag.current.moved) setOpen(i); }}
            className="group relative h-[clamp(300px,52vh,480px)] flex-none snap-start overflow-hidden rounded-[16px] bg-sand"
            aria-label={g.alt}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.src}
              alt={g.alt}
              draggable={false}
              className="h-full w-auto max-w-none select-none object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              loading="lazy"
            />
            <span className="pointer-events-none absolute inset-0 bg-pine-deep/0 transition-colors duration-500 group-hover:bg-pine-deep/10" />
          </button>
        ))}
      </div>

      {/* lightbox */}
      {open !== null && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-pine-deep/92 backdrop-blur-sm" onClick={() => setOpen(null)}>
          <button className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-paper/25 text-paper hover:bg-paper/10" aria-label="Zamknij">
            <Icon.close width={20} height={20} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); move(-1); }} className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-paper/25 text-paper hover:bg-paper/10 sm:left-6" aria-label="Poprzednie">
            <Icon.arrow width={20} height={20} className="rotate-180" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={GALLERY[open].src} alt={GALLERY[open].alt} className="max-h-[86svh] max-w-[92vw] rounded-[12px] object-contain" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); move(1); }} className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-paper/25 text-paper hover:bg-paper/10 sm:right-6" aria-label="Następne">
            <Icon.arrow width={20} height={20} />
          </button>
        </div>
      )}
    </section>
  );
}
