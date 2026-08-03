"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "osiedle", n: "01", label: "Osiedle", dark: false },
  { id: "lokale", n: "02", label: "Apartamenty", dark: false },
  { id: "spacer", n: "03", label: "Spacer 360", dark: true },
  { id: "standard", n: "04", label: "Standard", dark: false },
  { id: "okolica", n: "05", label: "Okolica", dark: false },
  { id: "deweloper", n: "07", label: "Deweloper", dark: true },
  { id: "kontakt", n: "08", label: "Kontakt", dark: false },
];

export default function SideRails() {
  const [idx, setIdx] = useState(0);
  const [dark, setDark] = useState(true);
  const clockRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef(0);
  const darkRef = useRef(true);

  useEffect(() => {
    const root = document.documentElement;
    let max = 1;
    let vh = root.clientHeight;
    let tops: number[] = [];
    let osiedleTop = Number.POSITIVE_INFINITY;

    const measure = () => {
      max = Math.max(1, root.scrollHeight - root.clientHeight);
      vh = root.clientHeight;
      tops = SECTIONS.map((s) => {
        const el = document.getElementById(s.id);
        return el ? el.offsetTop : Number.POSITIVE_INFINITY;
      });
      osiedleTop = tops[0] ?? Number.POSITIVE_INFINITY;
    };

    let scheduled = false;
    const update = () => {
      scheduled = false;
      const y = window.scrollY || root.scrollTop;
      const p = Math.min(1, Math.max(0, y / max));
      if (lineRef.current) lineRef.current.style.transform = `scaleY(${p})`;
      const mid = y + vh * 0.5;
      let cur = 0;
      for (let i = 0; i < tops.length; i++) {
        if (tops[i] <= mid) cur = i;
      }
      if (cur !== idxRef.current) {
        idxRef.current = cur;
        setIdx(cur);
      }
      const isDark = mid < osiedleTop ? true : SECTIONS[cur].dark;
      if (isDark !== darkRef.current) {
        darkRef.current = isDark;
        setDark(isDark);
      }
    };
    const onScroll = () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(update);
      }
    };
    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("load", onResize);
    const remeasure = window.setTimeout(onResize, 600);

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
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      window.clearTimeout(remeasure);
      window.clearInterval(clockId);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const cMuted = dark ? "text-white/55" : "text-ink/45";
  const lineBg = dark ? "bg-white/20" : "bg-ink/15";
  const lineFill = dark ? "bg-white/80" : "bg-ink/70";
  const tick = dark ? "bg-white/40" : "bg-ink/35";
  const tickActive = dark ? "bg-white" : "bg-ink";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 hidden [@media(min-width:1440px)]:block">
      <div
        className={`absolute bottom-0 right-0 top-[var(--nav-h)] flex w-[52px] flex-col items-center justify-center gap-4 transition-colors duration-500 ${
          dark ? "text-white/90" : "text-ink/85"
        }`}
      >
        <span className="accent-serif text-[1.55rem] leading-none">{SECTIONS[idx].n}</span>
        <span className={`text-[0.55rem] uppercase tracking-[0.26em] [writing-mode:vertical-rl] ${cMuted}`}>
          {SECTIONS[idx].label}
        </span>
        <div className="relative my-2 flex h-[32vh] w-full justify-center">
          <div className={`relative w-px ${lineBg}`}>
            <div ref={lineRef} className={`absolute inset-x-0 top-0 h-full origin-top ${lineFill}`} style={{ transform: "scaleY(0)" }} />
          </div>
          <div className="absolute inset-y-0 flex flex-col justify-between">
            {SECTIONS.map((s, i) => (
              <span key={s.id} className={`h-px transition-all duration-300 ${i === idx ? `w-3.5 ${tickActive}` : `w-1.5 ${tick}`}`} />
            ))}
          </div>
        </div>
        <span ref={clockRef} className={`num text-[0.55rem] tracking-[0.1em] [writing-mode:vertical-rl] ${cMuted}`}>
          --:--:--
        </span>
      </div>
    </div>
  );
}
