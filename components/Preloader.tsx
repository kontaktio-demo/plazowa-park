"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<"idle" | "run" | "out" | "done">("idle");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("pp-intro") === "1";
    } catch {}
    if (reduce || seen) {
      setPhase("done");
      return;
    }
    try {
      sessionStorage.setItem("pp-intro", "1");
    } catch {}
    setPhase("run");
    document.documentElement.style.overflow = "hidden";

    const DUR = 1050;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DUR);
      const eased = 1 - Math.pow(1 - p, 3);
      setPct(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        document.documentElement.style.overflow = "";
        setPhase("out");
        setTimeout(() => setPhase("done"), 900);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[200] flex flex-col bg-paper text-ink transition-transform duration-[900ms] [transition-timing-function:var(--ease-out-expo)] ${
        phase === "out" ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container-x flex items-center justify-between pt-8">
        <span className="text-[0.7rem] uppercase tracking-[0.24em] text-muted">Głowno · Zalew Mrożyczka</span>
        <span className="h-2 w-2 animate-ping rounded-full bg-brass" />
      </div>

      <div className="flex flex-1 items-center justify-center px-6">
        <h1 className="text-center font-display text-[clamp(3rem,12vw,10rem)] font-semibold leading-[0.92] text-pine">
          <span className="[display:inline-block] overflow-hidden pb-[0.08em]">
            <span className="word-up" style={{ animationDelay: "0.05s" }}>Plażowa</span>
          </span>{" "}
          <span className="[display:inline-block] overflow-hidden pb-[0.08em]">
            <span className="accent-serif word-up text-brass-deep" style={{ animationDelay: "0.16s" }}>Park</span>
          </span>
        </h1>
      </div>

      <div className="container-x flex items-end justify-between pb-7">
        <span className="max-w-xs text-sm leading-snug text-muted">Apartamenty nad Zalewem Mrożyczka w Głownie</span>
        <span className="flex items-end font-display text-[clamp(2.2rem,7vw,5rem)] font-semibold leading-[0.8] text-ink num">
          {pct}
          <span className="ml-0.5 text-[0.5em] text-muted">%</span>
          <span className="caret-blink ml-1 mb-[0.12em] inline-block h-[0.62em] w-[3px] bg-brass" />
        </span>
      </div>
      <div className="h-[2px] w-full bg-ink/8">
        <div className="h-full bg-brass transition-[width] duration-100 ease-linear" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
