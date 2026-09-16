"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox, { type Shot } from "./Lightbox";

/**
 * Kadry lokalu z powiększaniem. Klient chciał móc przybliżać widoki - rzut
 * w kaflu jest za mały, żeby sprawdzić, czy kanapa się zmieści.
 *
 * `priority` dostaje tylko ta galeria, która jest LCP strony. To prop tego
 * komponentu, nie Next - na <Image> idzie jako `preload`, bo `priority` jest
 * w Next 16 wycofane.
 */
export default function ZoomShots({ shots, priority }: { shots: Shot[]; priority?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const [main, ...rest] = shots;

  return (
    <div>
      <Tile shot={main} priority={priority} onClick={() => setOpen(0)} />

      {rest.length > 0 && (
        <ul className={`mt-3 grid gap-3 ${rest.length > 2 ? "grid-cols-3" : "grid-cols-2"}`}>
          {rest.map((g, i) => (
            <li key={g.src}>
              <Tile shot={g} small onClick={() => setOpen(i + 1)} />
              {g.caption && <span className="t-meta-sm fg-muted mt-2 block text-pretty">{g.caption}</span>}
            </li>
          ))}
        </ul>
      )}

      {open !== null && <Lightbox shots={shots} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Tile({
  shot,
  small,
  priority,
  onClick,
}: {
  shot: Shot;
  small?: boolean;
  priority?: boolean;
  onClick: () => void;
}) {
  const contain = shot.fit === "contain";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Powiększ: ${shot.caption ?? shot.alt}`}
      className={`group relative block aspect-4/3 w-full overflow-hidden ${contain ? "bd bg-surface border" : ""}`}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        sizes={small ? "(max-width: 1024px) 33vw, 220px" : "(max-width: 1024px) 100vw, 50vw"}
        className={contain ? "object-contain" : "object-cover"}
        preload={priority}
      />
      {!small && (
        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-sand-50/35 bg-abyss/45 text-sand-50 backdrop-blur-sm transition-colors group-hover:border-sun">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M11 8v6M8 11h6" />
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
        </span>
      )}
    </button>
  );
}
