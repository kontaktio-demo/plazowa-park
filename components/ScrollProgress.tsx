"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const scheduled = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    const write = () => {
      scheduled.current = false;
      const max = root.scrollHeight - root.clientHeight;
      const y = window.scrollY || root.scrollTop;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      root.style.setProperty("--progress", `${p}`);
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!scheduled.current) {
        scheduled.current = true;
        requestAnimationFrame(write);
      }
    };
    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[65] h-[3px] bg-transparent" aria-hidden>
      <div ref={barRef} className="h-full origin-left bg-gradient-to-r from-brass to-brass-light" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
