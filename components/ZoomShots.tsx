"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox, { type Shot } from "./Lightbox";

/**
 * Rzut i wizualizacje lokalu z powiększaniem. Klient chciał móc przybliżać
 * widoki - rzut w kaflu jest za mały, żeby sprawdzić, czy kanapa się zmieści.
 */
export default function ZoomShots({
  shots,
  plan,
}: {
  shots: Shot[];
  /** true = pierwszy kadr to rzut: pokazujemy go w całości na ciemnym tle */
  plan?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const [main, ...rest] = shots;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(0)}
        aria-label={`Powiększ: ${main.caption ?? main.alt}`}
        className={`group relative block aspect-4/3 w-full overflow-hidden ${plan ? "bg-sand-50" : ""}`}
      >
        <Image
          src={main.src}
          alt={main.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className={plan ? "object-contain p-8" : "object-cover"}
          priority
        />
        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-sand-50/35 bg-abyss/45 text-sand-50 backdrop-blur-sm transition-colors group-hover:border-sun">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M11 8v6M8 11h6" />
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
        </span>
      </button>

      {rest.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {rest.map((g, i) => (
            <button
              key={g.src}
              type="button"
              onClick={() => setOpen(i + 1)}
              aria-label={`Powiększ: ${g.caption ?? g.alt}`}
              className="relative aspect-4/3 overflow-hidden"
            >
              <Image src={g.src} alt={g.alt} fill sizes="(max-width: 1024px) 33vw, 200px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {open !== null && (
        <Lightbox shots={shots} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </div>
  );
}
