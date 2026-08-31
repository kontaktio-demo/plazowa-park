"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Shot = { src: string; alt: string; caption?: string };

const MAX = 5;
const MIN = 1;

export default function Lightbox({
  shots,
  index,
  onIndex,
  onClose,
}: {
  shots: Shot[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const [z, setZ] = useState({ s: 1, x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ dist: number; s: number; x: number; y: number; cx: number; cy: number } | null>(null);
  const pan = useRef<{ x: number; y: number; tx: number; ty: number; moved: boolean } | null>(null);

  const reset = useCallback(() => setZ({ s: 1, x: 0, y: 0 }), []);
  const go = useCallback(
    (d: number) => {
      reset();
      onIndex((index + d + shots.length) % shots.length);
    },
    [index, shots.length, onIndex, reset]
  );

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "0") reset();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose, go, reset]);

  // zoom trzyma punkt pod kursorem w miejscu - inaczej przy większym powiększeniu
  // obraz ucieka spod myszy i nie da się celować
  const zoomAt = useCallback((factor: number, cx: number, cy: number) => {
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = cx - r.left - r.width / 2;
    const py = cy - r.top - r.height / 2;
    setZ((v) => {
      const s = Math.min(MAX, Math.max(MIN, v.s * factor));
      const k = s / v.s;
      if (s === MIN) return { s, x: 0, y: 0 };
      return { s, x: px - (px - v.x) * k, y: py - (py - v.y) * k };
    });
  }, []);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    zoomAt(e.deltaY < 0 ? 1.18 : 1 / 1.18, e.clientX, e.clientY);
  };

  const onDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        s: z.s,
        x: z.x,
        y: z.y,
        cx: (a.x + b.x) / 2,
        cy: (a.y + b.y) / 2,
      };
      pan.current = null;
    } else if (pointers.current.size === 1) {
      pan.current = { x: e.clientX, y: e.clientY, tx: z.x, ty: z.y, moved: false };
    }
  };

  const onMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && gesture.current) {
      const [a, b] = [...pointers.current.values()];
      const g = gesture.current;
      const s = Math.min(MAX, Math.max(MIN, (g.s * Math.hypot(a.x - b.x, a.y - b.y)) / g.dist));
      const el = boxRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = g.cx - r.left - r.width / 2;
      const py = g.cy - r.top - r.height / 2;
      const k = s / g.s;
      setZ(s === MIN ? { s, x: 0, y: 0 } : { s, x: px - (px - g.x) * k, y: py - (py - g.y) * k });
      return;
    }

    const p = pan.current;
    if (!p) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) p.moved = true;
    if (z.s > 1) setZ((v) => ({ ...v, x: p.tx + dx, y: p.ty + dy }));
  };

  const onUp = (e: React.PointerEvent) => {
    const p = pan.current;
    // przy powiększeniu 1x poziomy gest przerzuca zdjęcie
    if (p && z.s === 1 && pointers.current.size === 1) {
      const last = pointers.current.get(e.pointerId);
      const dx = last ? last.x - p.x : 0;
      if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
    }
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) gesture.current = null;
    if (pointers.current.size === 0) pan.current = null;
  };

  const shot = shots[index];

  return (
    <div
      className="band band-abyss fixed inset-0 z-90 flex flex-col bg-abyss/97 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label={shot.caption ?? shot.alt}
    >
      <div className="flex flex-none items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="t-meta-sm fg-muted min-w-0 truncate">
          <span className="num">
            {index + 1} / {shots.length}
          </span>
          {shot.caption ? <span className="fg ml-3">{shot.caption}</span> : null}
        </p>
        <div className="flex flex-none items-center gap-1">
          <Ctl label="Pomniejsz" onClick={() => zoomAt(1 / 1.4, innerWidth / 2, innerHeight / 2)} disabled={z.s <= MIN}>
            <path d="M5 12h14" />
          </Ctl>
          <span className="t-meta-sm fg-muted num w-12 text-center">{Math.round(z.s * 100)}%</span>
          <Ctl label="Powiększ" onClick={() => zoomAt(1.4, innerWidth / 2, innerHeight / 2)} disabled={z.s >= MAX}>
            <path d="M12 5v14M5 12h14" />
          </Ctl>
          <Ctl label="Zamknij" onClick={onClose}>
            <path d="M6 6l12 12M18 6L6 18" />
          </Ctl>
        </div>
      </div>

      <div
        ref={boxRef}
        onWheel={onWheel}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onDoubleClick={(e) => (z.s > 1 ? reset() : zoomAt(2.5, e.clientX, e.clientY))}
        className={`relative min-h-0 flex-1 touch-none select-none overflow-hidden ${
          z.s > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot.src}
          alt={shot.alt}
          draggable={false}
          className="absolute left-1/2 top-1/2 max-h-full max-w-full object-contain"
          style={{
            transform: `translate(-50%, -50%) translate(${z.x}px, ${z.y}px) scale(${z.s})`,
            transition: pan.current || gesture.current ? "none" : "transform 160ms ease-out",
          }}
        />
      </div>

      {shots.length > 1 && (
        <div className="flex flex-none items-center justify-center gap-2 px-4 py-4">
          <Ctl label="Poprzednie" onClick={() => go(-1)}>
            <path d="M15 18l-6-6 6-6" />
          </Ctl>
          <div className="no-scrollbar flex max-w-[70vw] gap-2 overflow-x-auto px-1">
            {shots.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => {
                  reset();
                  onIndex(i);
                }}
                aria-label={s.caption ?? s.alt}
                aria-current={i === index}
                className={`h-12 w-16 flex-none overflow-hidden border transition-opacity ${
                  i === index ? "border-sun opacity-100" : "border-sand-50/20 opacity-55 hover:opacity-90"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt="" className="h-full w-full object-cover" draggable={false} />
              </button>
            ))}
          </div>
          <Ctl label="Następne" onClick={() => go(1)}>
            <path d="M9 6l6 6-6 6" />
          </Ctl>
        </div>
      )}
    </div>
  );
}

function Ctl({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 flex-none items-center justify-center border border-sand-50/20 transition-colors hover:border-clay-300 disabled:opacity-35"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}
