"use client";

import { useCallback, useEffect, useState } from "react";
import { GALLERY } from "@/lib/data/site";
import { Icon } from "./Icons";

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

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

  return (
    <section id="galeria" className="bg-paper-2 py-20 sm:py-28">
      <div className="container-x">
        <header className="flex flex-wrap items-end justify-between gap-4" data-reveal="up">
          <div className="max-w-2xl">
            <p className="eyebrow">Galeria</p>
            <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-pine">
              Wizualizacje i <span className="italic text-brass-deep">okolica.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm text-muted">
            Wizualizacje architektoniczne i zdjęcia okolicy. Materiały poglądowe — rzeczywisty wygląd może się różnić.
          </p>
        </header>

        <div className="mt-10 grid auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[240px] md:grid-cols-4" data-reveal="fade">
          {GALLERY.map((g, i) => (
            <button
              key={g.src}
              onClick={() => setOpen(i)}
              className={`group relative overflow-hidden rounded-[12px] bg-sand ${
                g.span === "wide" ? "col-span-2" : ""
              } ${g.span === "tall" ? "row-span-2" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.src}
                alt={g.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                loading="lazy"
              />
              <span className="absolute inset-0 bg-pine-deep/0 transition-colors duration-500 group-hover:bg-pine-deep/20" />
              {g.tag && (
                <span className="absolute bottom-3 left-3 rounded-full bg-paper/85 px-2.5 py-1 text-[0.68rem] font-semibold text-pine backdrop-blur-sm">
                  {g.tag}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* lightbox */}
      {open !== null && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-pine-deep/90 backdrop-blur-sm" onClick={() => setOpen(null)}>
          <button className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-paper/25 text-paper hover:bg-paper/10" aria-label="Zamknij">
            <Icon.close width={20} height={20} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); move(-1); }}
            className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full border border-paper/25 text-paper hover:bg-paper/10 sm:left-6"
            aria-label="Poprzednie"
          >
            <Icon.arrow width={20} height={20} className="rotate-180" />
          </button>
          <figure className="max-h-[86svh] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY[open].src} alt={GALLERY[open].alt} className="max-h-[80svh] w-auto rounded-[12px] object-contain" />
            <figcaption className="mt-3 text-center text-sm text-paper/75">{GALLERY[open].alt}</figcaption>
          </figure>
          <button
            onClick={(e) => { e.stopPropagation(); move(1); }}
            className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full border border-paper/25 text-paper hover:bg-paper/10 sm:right-6"
            aria-label="Następne"
          >
            <Icon.arrow width={20} height={20} />
          </button>
        </div>
      )}
    </section>
  );
}
