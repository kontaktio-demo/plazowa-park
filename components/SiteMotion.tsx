"use client";

import { useEffect } from "react";

export default function SiteMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.add("motion-ready");

    // --- warstwa natychmiastowa: odsłanianie treści i skoki do kotwic ---
    // Reveal chodzi na IntersectionObserverze, bo na iOS Safari zdarzenia scrolla
    // potrafią nie odpalić w trakcie natywnego przewijania i sekcje zostają puste.
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
      // zabezpieczenie: treść nie może zostać ukryta, jeśli obserwator zawiedzie
      revealTimer = window.setTimeout(revealAll, 3500);
    }

    let lenis: import("lenis").default | undefined;
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

    // --- warstwa odroczona: Lenis + GSAP to ~200 KB, nie mogą konkurować z LCP ---
    let disposed = false;
    let killScroll: (() => void) | undefined;

    const whenIdle = () =>
      new Promise<void>((res) => {
        const w = window as Window & {
          requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
        };
        if (w.requestIdleCallback) w.requestIdleCallback(() => res(), { timeout: 2500 });
        else setTimeout(res, 400);
      });

    (async () => {
      await whenIdle();
      if (disposed) return;

      const [{ default: Lenis }, gsapMod, stMod] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;
      const gsap = gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      if (!reduce) {
        lenis = new Lenis({
          // tryb lerp: ciągła interpolacja do celu, płynna przy każdej prędkości kółka
          lerp: 0.09,
          smoothWheel: true,
          wheelMultiplier: 1,
          syncTouch: false, // natywny scroll na dotyku = najlepsza płynność na telefonie
        });
        // @ts-expect-error udostępnione do skoków po kotwicach
        window.__lenis = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis!.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        // delikatny parallax tła hero; obraz jest powiększony o 8%, więc
        // przesunięcie nigdy nie odsłania krawędzi
        const layer = document.querySelector<HTMLElement>("[data-parallax]");
        const host = layer?.parentElement;
        if (layer && host) {
          gsap.to(layer, {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: host, start: "top top", end: "bottom top", scrub: true },
          });
        }
      }

      killScroll = () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
        lenis?.destroy();
      };
    })();

    return () => {
      disposed = true;
      document.removeEventListener("click", onClick);
      io?.disconnect();
      clearTimeout(revealTimer);
      killScroll?.();
    };
  }, []);

  return null;
}
