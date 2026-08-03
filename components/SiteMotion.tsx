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

      // scroll reveals
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (reduce) {
        items.forEach((el) => el.classList.add("is-in"));
      } else {
        ScrollTrigger.batch(items, {
          start: "top 86%",
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 1.05,
              ease: "power4.out",
              stagger: 0.1,
              overwrite: true,
            }),
        });
        // ensure any already-visible items reveal on load
        ScrollTrigger.refresh();
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
        ScrollTrigger.getAll().forEach((t) => t.kill());
        lenis?.destroy();
      };
    })();

    return () => cleanup?.();
  }, []);

  return null;
}
