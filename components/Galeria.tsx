"use client";

import Image from "next/image";
import { useState } from "react";
import { GALLERY, KATEGORIE, shotSrc, type Kategoria } from "@/lib/data/gallery";
import { BLUR } from "@/lib/blur";
import SectionHeader from "./SectionHeader";
import Lightbox from "./Lightbox";

type Otwarte = { cat: Kategoria; index: number } | null;

export default function Galeria() {
  const [cat, setCat] = useState<Kategoria>(KATEGORIE[0].id);
  const [open, setOpen] = useState<Otwarte>(null);

  const grupa = (id: Kategoria) => GALLERY.filter((g) => g.cat === id);
  const shots = open
    ? grupa(open.cat).map((g) => ({ src: shotSrc(g.file), alt: g.alt, caption: g.caption }))
    : [];

  return (
    <section id="galeria" className="band band-sand sec">
      <div className="wrap">
        <SectionHeader
          id="galeria"
          title={
            <>
              Tak będzie wyglądać <span className="fg-accent">Plażowa Park</span>
            </>
          }
          lead="Wizualizacje wnętrz - z poddaszem po adaptacji - oraz elewacji i tarasów. Kliknij dowolne zdjęcie, żeby powiększyć i obejrzeć szczegóły."
          className="max-w-2xl"
        />

        {/* dwie zakładki zamiast jednej długiej siatki: wnętrza to osobne pytanie
            kupującego i nie mogą ginąć między elewacjami */}
        <div className="mt-8 flex flex-wrap gap-2" data-reveal>
          {KATEGORIE.map((k) => (
            <button
              key={k.id}
              type="button"
              aria-pressed={cat === k.id}
              onClick={() => setCat(k.id)}
              className="chip"
            >
              {k.label}
              <span className="num opacity-60">· {grupa(k.id).length}</span>
            </button>
          ))}
        </div>

        {/* obie siatki zostają w HTML - nieaktywna jest tylko ukryta, więc kadry
            wnętrz są widoczne dla wyszukiwarek, a leniwe ładowanie i tak nie
            pobiera obrazów spoza ekranu */}
        {KATEGORIE.map((k) => (
          <div
            key={k.id}
            hidden={cat !== k.id}
            className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
            data-reveal="stagger"
          >
            {grupa(k.id).map((g, i) => (
              <button
                key={g.file}
                type="button"
                onClick={() => setOpen({ cat: k.id, index: i })}
                style={{ transitionDelay: `${Math.min(i, 8) * 60}ms` }}
                className={`bd group relative overflow-hidden border ${
                  i === 0 ? "col-span-2 row-span-2 aspect-square lg:aspect-auto" : "aspect-4/3"
                }`}
                aria-label={`Powiększ: ${g.caption}`}
              >
                <Image
                  src={shotSrc(g.file)}
                  alt={g.alt}
                  fill
                  sizes={i === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 50vw, 25vw"}
                  placeholder="blur"
                  blurDataURL={BLUR[`gal-${g.file}` as keyof typeof BLUR] ?? BLUR.zycie}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-linear-to-t from-abyss/85 to-transparent p-3 pt-10 text-left sm:p-4 sm:pt-14">
                  <span className="t-meta-sm text-sand-50 normal-case">{g.caption}</span>
                  <span className="flex h-7 w-7 flex-none items-center justify-center border border-sand-50/35 text-sand-50 opacity-0 transition-opacity group-hover:opacity-100">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M11 8v6M8 11h6" />
                      <circle cx="11" cy="11" r="7" />
                      <path d="M20 20l-4-4" />
                    </svg>
                  </span>
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {open && (
        <Lightbox
          shots={shots}
          index={open.index}
          onIndex={(i) => setOpen({ cat: open.cat, index: i })}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
