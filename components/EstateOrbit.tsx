"use client";

import { useEffect, useRef, useState } from "react";

const FRAMES = 120;
const framePath = (i: number) => `/orbit/f${String(i + 1).padStart(3, "0")}.webp`;

export default function EstateOrbit() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const current = useRef(0);
  const [ready, setReady] = useState(0);
  const [mode, setMode] = useState<"seq" | "static" | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 900px)").matches;
    if (reduce || small) {
      setMode("static");
      return;
    }
    setMode("seq");

    let killed = false;
    let st: { kill: () => void } | undefined;

    const draw = (index: number) => {
      const canvas = canvasRef.current;
      const img = imgs.current[index];
      if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      // cover fit (square source)
      const s = img.naturalWidth;
      const scale = Math.max(w / s, h / s);
      const dw = s * scale;
      const dh = s * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2 - h * 0.02, dw, dh);
    };

    // preload frames — deferred until the section is near the viewport (perf)
    let loaded = 0;
    let preloadStarted = false;
    const startPreload = () => {
      if (preloadStarted) return;
      preloadStarted = true;
      for (let i = 0; i < FRAMES; i++) {
        const img = new Image();
        img.decoding = "async";
        img.src = framePath(i);
        img.onload = () => {
          loaded++;
          setReady(loaded);
          if (i === 0) draw(0);
        };
        imgs.current[i] = img;
      }
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          startPreload();
          io.disconnect();
        }
      },
      { rootMargin: "200% 0px 200% 0px" }
    );
    if (sectionRef.current) io.observe(sectionRef.current);
    else startPreload();

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);
      const state = { f: 0 };
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const idx = Math.min(FRAMES - 1, Math.round(self.progress * (FRAMES - 1)));
          if (idx !== state.f) {
            state.f = idx;
            current.current = idx;
            draw(idx);
          }
        },
      });
      st = trigger;
      const onResize = () => draw(current.current);
      window.addEventListener("resize", onResize);
      draw(0);
      st = { kill: () => { trigger.kill(); window.removeEventListener("resize", onResize); } };
    })();

    return () => {
      killed = true;
      st?.kill();
      io.disconnect();
    };
  }, []);

  const pct = Math.round((ready / FRAMES) * 100);

  return (
    <section id="osiedle" ref={sectionRef} className="relative bg-paper" style={{ height: mode === "seq" ? "360vh" : "auto" }}>
      <div className={`${mode === "seq" ? "sticky top-0 h-[100svh]" : "py-20 sm:py-28"} flex flex-col justify-center overflow-hidden`}>
        <div className="container-x">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.5fr]">
            <div data-reveal="up" className="max-w-md">
              <p className="eyebrow">01 — Osiedle</p>
              <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-pine">
                Sześć&nbsp;budynków. <span className="italic text-brass-deep">Dwadzieścia&nbsp;domów.</span>
              </h2>
              <p className="mt-5 text-pretty leading-relaxed text-muted">
                Kameralny układ w zaciszu lasu. Budynki narożne mieszczą po cztery apartamenty, środkowe — po dwa
                największe. Każdy z prywatnym ogrodem, tarasem i dwoma miejscami postojowymi.
              </p>
              {mode === "seq" && (
                <p className="mt-7 inline-flex items-center gap-2 text-sm text-brass-deep">
                  <span className="scroll-cue">↓</span> Przewiń, aby obrócić osiedle
                </p>
              )}
            </div>

            <div className="relative">
              <div className="relative aspect-square w-full overflow-hidden rounded-[16px]">
                {mode === "static" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/map/estate-frame.webp" alt="Osiedle Plażowa Park z lotu ptaka — sześć budynków w sosnowym lesie" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <canvas ref={canvasRef} className="h-full w-full" />
                    {pct < 100 && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-4 mx-auto w-40">
                        <div className="h-[3px] w-full overflow-hidden rounded-full bg-ink/10">
                          <div className="h-full bg-brass transition-[width] duration-300" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <p className="mt-3 text-center text-xs text-faint">
                Wizualizacja poglądowa układu osiedla. Model 3D · KS Prestige Development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

