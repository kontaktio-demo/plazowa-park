"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    let max = 1;
    let scheduled = false;

    const measure = () => {
      max = Math.max(1, root.scrollHeight - root.clientHeight);
    };
    const write = () => {
      scheduled = false;
      const y = window.scrollY || root.scrollTop;
      const p = Math.min(1, Math.max(0, y / max));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(write);
      }
    };
    const onResize = () => {
      measure();
      write();
    };

    measure();
    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("load", onResize);
    const t = window.setTimeout(onResize, 600);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[65] h-[3px]" aria-hidden>
      <div ref={barRef} className="h-full origin-left bg-gradient-to-r from-brass to-brass-light" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
