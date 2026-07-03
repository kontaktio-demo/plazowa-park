"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { to: 30, prefix: "", suffix: "+ ha", label: "Zalew Mrożyczka" },
  { to: 100, prefix: "", suffix: " lat", label: "sosnowy las" },
  { to: 30, prefix: "~", suffix: " min", label: "do Łodzi (A2/DK14)" },
  { to: 13, prefix: "", suffix: "", label: "placówek edukacyjnych" },
  { to: 200, prefix: "", suffix: " m", label: "do szkół i sklepów" },
  { to: 2026, prefix: "", suffix: "", label: "oddanie · IV kwartał", raw: true },
];

function useCountUp(to: number, run: boolean, raw = false) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    let raf = 0;
    const dur = 1400;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, run]);
  return raw ? String(n) : new Intl.NumberFormat("pl-PL").format(n);
}

function Stat({ s, run }: { s: (typeof STATS)[number]; run: boolean }) {
  const n = useCountUp(s.to, run, s.raw);
  return (
    <div className="text-center">
      <div className="font-display text-[clamp(2.4rem,5vw,3.8rem)] leading-none text-paper num">
        {s.prefix}
        {n}
        <span className="text-brass-light">{s.suffix}</span>
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.14em] text-paper/55">{s.label}</div>
    </div>
  );
}

export default function StatsBand() {
  const ref = useRef<HTMLElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-pine py-16 text-paper sm:py-20">
      <div className="container-x">
        <div className="flex justify-center" data-reveal="fade">
          <p className="eyebrow !text-brass-light">Życie w liczbach</p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {STATS.map((s) => (
            <Stat key={s.label} s={s} run={run} />
          ))}
        </div>
      </div>
    </section>
  );
}
