"use client";

import { useEffect } from "react";

export default function SiteMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.add("motion-ready");

    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: Lenis }, gsapMod, stMod] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      const gsap = gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      let lenis: import("lenis").default | undefined;

      if (!reduce) {
        lenis = new Lenis({
          // lerp mode = continuous per-frame interpolation toward target.
          // Stays buttery-smooth at any wheel speed (unlike duration mode,
          // which restarts a fixed-length tween on every wheel event).
          lerp: 0.09,
          smoothWheel: true,
          wheelMultiplier: 1,
          syncTouch: false, // native scroll on touch = best perf + feel on mobile
        });
        // @ts-expect-error expose for anchor scrolling
        window.__lenis = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis!.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      }

      // Scroll reveals via IntersectionObserver. This is reliable on iOS Safari,
      // where scroll-event / ScrollTrigger driven reveals could fail to fire
      // during native touch scrolling and leave every below-fold section stuck
      // at opacity:0 (blank sections). CSS handles the transition (see
      // [data-reveal] in globals.css).
      const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
      const revealAll = () => items.forEach((el) => el.classList.add("is-in"));
      let io: IntersectionObserver | undefined;
      let revealTimer = 0;
      if (reduce || typeof IntersectionObserver === "undefined") {
        revealAll();
      } else {
        io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                e.target.classList.add("is-in");
                io!.unobserve(e.target);
              }
            }
          },
          { rootMargin: "0px 0px -8% 0px", threshold: 0.01 }
        );
        items.forEach((el) => io!.observe(el));
        // Safety net: content must never stay hidden if the observer misbehaves.
        revealTimer = window.setTimeout(revealAll, 3500);
      }

      // smooth anchor scrolling
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
        if (!a) return;
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        history.replaceState(null, "", id);
        if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -70, duration: 1.2 });
        else (target as HTMLElement).scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      };
      document.addEventListener("click", onClick);

      cleanup = () => {
        document.removeEventListener("click", onClick);
        io?.disconnect();
        clearTimeout(revealTimer);
        ScrollTrigger.getAll().forEach((t) => t.kill());
        lenis?.destroy();
      };
    })();

    return () => cleanup?.();
  }, []);

  return null;
}
