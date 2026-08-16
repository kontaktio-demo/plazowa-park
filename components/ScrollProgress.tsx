"use client";

import { useEffect, useRef } from "react";

/** Cienki pasek postępu pod headerem - jedyny wskaźnik pozycji na stronie. */
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
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, y / max))})`;
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
    <div
      className="fixed inset-x-0 z-65 h-0.5"
      style={{ top: "var(--nav-h)" }}
      aria-hidden
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-lake-500 to-lake-300"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
