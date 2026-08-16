"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeader from "./SectionHeader";

const DESKTOP = { count: 48, path: (i: number) => `/orbit/v2/d${String(i + 1).padStart(2, "0")}.webp` };
const MOBILE = { count: 12, path: (i: number) => `/orbit/v2/m${String(i + 1).padStart(2, "0")}.webp` };

/** Podpisy podmieniają się w trakcie obrotu, więc kolumna tekstu nie stoi martwa. */
const CAPTIONS = [
  "Sześć budynków w zaciszu lasu",
  "Dwadzieścia apartamentów, nie więcej",
  "Prywatny ogród i taras przy każdym",
];

/** Ile pikseli przeciągnięcia przypada na jedną klatkę. */
const DRAG_PX_PER_FRAME = 9;

type Mode = "pinned" | "flow" | "still";

export default function EstateOrbit() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const shown = useRef(-1);
  const scrollFrame = useRef(0);
  const dragOffset = useRef(0);
  const [mode, setMode] = useState<Mode | null>(null);
  const [caption, setCaption] = useState(0);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 900px)").matches;
    const set = small ? MOBILE : DESKTOP;
    const next: Mode = reduce ? "still" : small ? "flow" : "pinned";
    setMode(next);

    let killed = false;
    let cleanup: (() => void) | undefined;

    const paint = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const idx = ((Math.round(scrollFrame.current + dragOffset.current) % set.count) + set.count) % set.count;
      const img = imgs.current[idx];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      if (idx === shown.current && canvas.width) return;
      shown.current = idx;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const s = img.naturalWidth;
      const scale = Math.max(w / s, h / s);
      const d = s * scale;
      ctx.drawImage(img, (w - d) / 2, (h - d) / 2, d, d);
    };

    const loadFrame = (i: number) =>
      new Promise<void>((res) => {
        const img = new window.Image();
        img.decoding = "async";
        img.src = set.path(i);
        imgs.current[i] = img;
        const done = () => {
          img.decode?.().catch(() => {});
          setLoaded((n) => n + 1);
          res();
        };
        if (img.complete) done();
        else img.onload = done;
        img.onerror = () => res();
      });

    // sekwencja rusza dopiero, gdy sekcja zbliża się do ekranu - inaczej
    // konkuruje o pasmo z obrazem hero i psuje LCP
    const nearViewport = () =>
      new Promise<void>((res) => {
        const el = sectionRef.current;
        if (!el || typeof IntersectionObserver === "undefined") return res();
        const io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              io.disconnect();
              res();
            }
          },
          { rootMargin: "150% 0px" }
        );
        io.observe(el);
      });

    (async () => {
      await nearViewport();
      if (killed) return;
      await loadFrame(0);
      if (killed) return;
      paint();
      if (next === "still") return;

      // reszta klatek po kolei, żeby obrót stawał się płynny w miarę ładowania
      for (let i = 1; i < set.count; i++) {
        if (killed) return;
        await loadFrame(i);
      }
      if (killed) return;

      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (killed || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: next === "pinned" ? "top top" : "top bottom",
        end: next === "pinned" ? "bottom bottom" : "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          scrollFrame.current = self.progress * (set.count - 1);
          paint();
          setCaption(Math.min(CAPTIONS.length - 1, Math.floor(self.progress * CAPTIONS.length)));
        },
      });

      // przeciąganie kręci osiedlem niezależnie od scrolla
      const canvas = canvasRef.current;
      let dragging = false;
      let lastX = 0;
      const onDown = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
        canvas?.setPointerCapture(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        dragOffset.current -= (e.clientX - lastX) / DRAG_PX_PER_FRAME;
        lastX = e.clientX;
        paint();
      };
      const onUp = (e: PointerEvent) => {
        dragging = false;
        try {
          canvas?.releasePointerCapture(e.pointerId);
        } catch {}
      };
      canvas?.addEventListener("pointerdown", onDown);
      canvas?.addEventListener("pointermove", onMove);
      canvas?.addEventListener("pointerup", onUp);
      canvas?.addEventListener("pointercancel", onUp);

      const onResize = () => {
        shown.current = -1;
        paint();
      };
      window.addEventListener("resize", onResize, { passive: true });

      cleanup = () => {
        st.kill();
        window.removeEventListener("resize", onResize);
        canvas?.removeEventListener("pointerdown", onDown);
        canvas?.removeEventListener("pointermove", onMove);
        canvas?.removeEventListener("pointerup", onUp);
        canvas?.removeEventListener("pointercancel", onUp);
      };
    })();

    return () => {
      killed = true;
      cleanup?.();
    };
  }, []);

  const pinned = mode === "pinned";
  const total = mode === "flow" ? MOBILE.count : DESKTOP.count;
  const ready = loaded >= total;

  return (
    <section
      ref={sectionRef}
      id="osiedle"
      className="band band-sand relative"
      style={pinned ? { height: "260vh" } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-svh items-center overflow-hidden" : "sec"}>
        <div className="wrap grid w-full items-center gap-8 lg:grid-cols-[0.36fr_0.64fr] lg:gap-12">
          <SectionHeader
            id="osiedle"
            title={
              <>
                Osiedle ukryte <span className="fg-accent">w lesie</span>
              </>
            }
            lead="Sześć budynków i zaledwie 20 apartamentów. Budynki narożne mieszczą po cztery apartamenty, środkowe po dwa większe. Do każdego należy prywatny ogród, taras i dwa miejsca postojowe."
          >
            <div className="bd mt-7 h-12 border-t pt-5">
              <p key={caption} className="t-meta fg-accent animate-[riseIn_300ms_ease-out]">
                {CAPTIONS[caption]}
              </p>
            </div>
          </SectionHeader>

          <div className="relative">
            <div className="relative aspect-square w-full lg:-mr-[6%]">
              <canvas
                ref={canvasRef}
                role="img"
                aria-label="Osiedle Plażowa Park z lotu ptaka, widok obracany przewijaniem i przeciąganiem"
                className="h-full w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
              />
            </div>
            {mode !== "still" && (
              <p className="t-meta-sm fg-muted absolute inset-x-0 bottom-0 text-center transition-opacity duration-500" style={{ opacity: ready ? 1 : 0 }}>
                Przeciągnij, aby obrócić
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
