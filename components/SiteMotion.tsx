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
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.6,
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
          start: "top 88%",
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.95,
              ease: "power3.out",
              stagger: 0.08,
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
