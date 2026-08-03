"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "osiedle", n: "01", label: "Osiedle" },
  { id: "lokale", n: "02", label: "Apartamenty" },
  { id: "spacer", n: "03", label: "Spacer 360" },
  { id: "standard", n: "04", label: "Standard" },
  { id: "okolica", n: "05", label: "Okolica" },
  { id: "deweloper", n: "07", label: "Deweloper" },
  { id: "kontakt", n: "08", label: "Kontakt" },
];

const MARQUEE = "Plażowa Park — Głowno — Zalew Mrożyczka — 20 apartamentów w sercu lasu — ";

export default function SideRails() {
  const [idx, setIdx] = useState(0);
  const pctRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const idxRef = useRef(0);
  const scheduled = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      scheduled.current = false;
      const max = root.scrollHeight - root.clientHeight;
      const y = window.scrollY || root.scrollTop;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      if (pctRef.current) pctRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      const mid = y + root.clientHeight * 0.45;
      let cur = 0;
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= mid) cur = i;
      }
      if (cur !== idxRef.current) {
        idxRef.current = cur;
        setIdx(cur);
      }
    };
    const onScroll = () => {
      if (!scheduled.current) {
        scheduled.current = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    let clockId = 0;
    let fmt: Intl.DateTimeFormat | null = null;
    try {
      fmt = new Intl.DateTimeFormat("pl-PL", { timeZone: "Europe/Warsaw", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {}
    const tickClock = () => {
      if (clockRef.current && fmt) clockRef.current.textContent = fmt.format(new Date());
    };
    tickClock();
    clockId = window.setInterval(tickClock, 1000);
    const onVis = () => {
      window.clearInterval(clockId);
      if (!document.hidden) {
        tickClock();
        clockId = window.setInterval(tickClock, 1000);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearInterval(clockId);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 hidden mix-blend-difference [@media(min-width:1440px)]:block"
    >
      {/* LEFT — continuous vertical wordmark + live % */}
      <div className="absolute bottom-0 left-0 top-[var(--nav-h)] flex w-[52px] flex-col items-center py-8">
        <div className="flex flex-1 items-center overflow-hidden">
          <div className="marquee-y flex flex-col [animation-duration:48s]">
            <span className="whitespace-nowrap text-[0.56rem] uppercase tracking-[0.32em] text-white/70 [writing-mode:vertical-rl]">
              {MARQUEE.repeat(3)}
            </span>
            <span className="whitespace-nowrap text-[0.56rem] uppercase tracking-[0.32em] text-white/70 [writing-mode:vertical-rl]">
              {MARQUEE.repeat(3)}
            </span>
          </div>
        </div>
        <span className="mt-4 flex items-center text-[0.6rem] tracking-[0.14em] text-white/80 num">
          <span ref={pctRef}>000</span>
          <span className="caret-blink ml-0.5 inline-block h-[0.95em] w-[2px] bg-white/80" />
        </span>
      </div>

      {/* RIGHT — instrument: section index + drawn progress + ruler + clock */}
      <div className="absolute bottom-0 right-0 top-[var(--nav-h)] flex w-[52px] flex-col items-center justify-center gap-4 text-white/85">
        <span className="accent-serif text-[1.55rem] leading-none text-white/90">{SECTIONS[idx].n}</span>
        <span className="text-[0.55rem] uppercase tracking-[0.26em] text-white/55 [writing-mode:vertical-rl]">
          {SECTIONS[idx].label}
        </span>
        <div className="relative my-2 flex h-[32vh] w-full justify-center">
          <div className="relative w-px bg-white/20">
            <div className="absolute inset-x-0 top-0 h-full origin-top bg-white/85" style={{ transform: "scaleY(var(--progress, 0))" }} />
          </div>
          <div className="absolute inset-y-0 flex flex-col justify-between">
            {SECTIONS.map((s, i) => (
              <span key={s.id} className={`h-px transition-all duration-300 ${i === idx ? "w-3.5 bg-white" : "w-1.5 bg-white/40"}`} />
            ))}
          </div>
        </div>
        <span ref={clockRef} className="num text-[0.55rem] tracking-[0.1em] text-white/65 [writing-mode:vertical-rl]">
          --:--:--
        </span>
      </div>
    </div>
  );
}
