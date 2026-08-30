"use client";

import { useEffect, useRef, useState } from "react";

export type SortKey = "price-asc" | "price-desc" | "area-desc";

const OPTIONS: { key: SortKey; label: string }[] = [
  { key: "price-asc", label: "Cena rosnąco" },
  { key: "price-desc", label: "Cena malejąco" },
  { key: "area-desc", label: "Metraż od największego" },
];

/**
 * Wzorzec combobox z listą: rola `option` musi być bezpośrednim dzieckiem
 * `listbox`, więc lista jest divem, a nie ul/li. Focus zostaje na przycisku,
 * a aktywna pozycja jest wskazywana przez aria-activedescendant.
 */
export default function SortMenu({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, OPTIONS.findIndex((o) => o.key === value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const choose = (i: number) => {
    onChange(OPTIONS[i].key);
    setActive(i);
    setOpen(false);
    btnRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "Tab") {
      setOpen(false);
      return;
    }
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % OPTIONS.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + OPTIONS.length) % OPTIONS.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(active);
    }
  };

  const current = OPTIONS.find((o) => o.key === value) ?? OPTIONS[0];

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={btnRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="sortowanie-lista"
        aria-activedescendant={open ? `sortowanie-opcja-${active}` : undefined}
        aria-label={`Sortowanie: ${current.label}`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="bd-strong t-meta flex min-h-11 items-center gap-2.5 rounded-[12px] border px-4 py-2.5"
      >
        {current.label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`fg-accent transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        id="sortowanie-lista"
        role="listbox"
        aria-label="Sortowanie"
        className={`bd-strong bg-surface absolute right-0 z-30 mt-2 min-w-full origin-top overflow-hidden rounded-[12px] border transition-[opacity,transform] duration-150 ${
          open ? "pointer-events-auto scale-y-100 opacity-100" : "pointer-events-none scale-y-95 opacity-0"
        }`}
      >
        {OPTIONS.map((o, i) => (
          <div
            key={o.key}
            id={`sortowanie-opcja-${i}`}
            role="option"
            aria-selected={o.key === value}
            onClick={() => choose(i)}
            onPointerEnter={() => setActive(i)}
            className={`t-meta flex min-h-11 cursor-pointer items-center gap-2 whitespace-nowrap px-4 py-3 ${
              i === active ? "bg-clay-600 text-sand-50" : ""
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${o.key === value ? "bg-sun" : "bg-transparent"}`} />
            {o.label}
          </div>
        ))}
      </div>
    </div>
  );
}
