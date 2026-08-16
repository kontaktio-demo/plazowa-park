"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeader from "./SectionHeader";

const DESKTOP = { count: 24, path: (i: number) => `/orbit/d${String(i + 1).padStart(2, "0")}.webp` };
const MOBILE = { count: 6, path: (i: number) => `/orbit/m${String(i + 1).padStart(2, "0")}.webp` };

/** Podpisy podmieniają się w trakcie obrotu, więc kolumna tekstu nie stoi martwa. */
const CAPTIONS = [
  "Sześć budynków w zaciszu lasu",
  "Dwadzieścia apartamentów, nie więcej",
  "Prywatny ogród i taras przy każdym",
];

type Mode = "pinned" | "flow" | "still";

export default function EstateOrbit() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const frame = useRef(0);
  const [mode, setMode] = useState<Mode | null>(null);
  const [caption, setCaption] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 900px)").matches;
    const set = small ? MOBILE : DESKTOP;
    const next: Mode = reduce ? "still" : small ? "flow" : "pinned";
    setMode(next);

    let killed = false;
    let cleanup: (() => void) | undefined;

    const draw = (index: number) => {
      const canvas = canvasRef.current;
      const img = imgs.current[index];
      if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
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

    // pierwsze trzy klatki od razu, reszta po nich - sekwencja nie blokuje LCP
    const loadFrame = (i: number) =>
      new Promise<void>((res) => {
        const img = new window.Image();
        img.decoding = "async";
        img.src = set.path(i);
        imgs.current[i] = img;
        const done = () => {
          img.decode?.().catch(() => {});
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
          { rootMargin: "120% 0px" }
        );
        io.observe(el);
      });

    (async () => {
      await nearViewport();
      if (killed) return;
      await Promise.all([0, 1, 2].slice(0, set.count).map(loadFrame));
      if (killed) return;
      draw(0);
      if (next === "still") return;
      for (let i = 3; i < set.count; i++) {
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
        scrub: 0.6,
        onUpdate: (self) => {
          const idx = Math.min(set.count - 1, Math.round(self.progress * (set.count - 1)));
          if (idx !== frame.current) {
            frame.current = idx;
            draw(idx);
          }
          const c = Math.min(CAPTIONS.length - 1, Math.floor(self.progress * CAPTIONS.length));
          setCaption(c);
        },
      });
      const onResize = () => draw(frame.current);
      window.addEventListener("resize", onResize, { passive: true });
      cleanup = () => {
        st.kill();
        window.removeEventListener("resize", onResize);
      };
    })();

    return () => {
      killed = true;
      cleanup?.();
    };
  }, []);

  const pinned = mode === "pinned";

  return (
    <section
      ref={sectionRef}
      id="osiedle"
      className="band band-sand relative"
      style={pinned ? { height: "250vh" } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-[100svh] items-center overflow-hidden" : "sec"}>
        <div className="wrap grid w-full items-center gap-10 lg:grid-cols-[0.4fr_0.6fr] lg:gap-16">
          <SectionHeader
            id="osiedle"
            title={
              <>
                Osiedle ukryte <span className="fg-accent">w lesie</span>
              </>
            }
            lead="Sześć budynków i zaledwie 20 apartamentów. Budynki narożne mieszczą po cztery apartamenty, środkowe po dwa większe. Do każdego należy prywatny ogród, taras i dwa miejsca postojowe."
          >
            <div className="bd mt-8 h-12 border-t pt-5">
              <p key={caption} className="t-meta fg-accent animate-[riseIn_300ms_ease-out]">
                {CAPTIONS[caption]}
              </p>
            </div>
          </SectionHeader>

          <div className="relative" data-reveal>
            <div className="relative aspect-square w-full">
              <canvas
                ref={canvasRef}
                role="img"
                aria-label="Osiedle Plażowa Park z lotu ptaka, widok obracany przewijaniem"
                className="h-full w-full mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
