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

    // Elementy, które wchodzą do drzewa później, nie były obserwowane, a CSS trzyma
    // je na zerowej przezroczystości. Tak znikała cała lista lokali po wejściu
    // w kombinację filtrów bez wyników: siatka odmontowywała się i wracała jako nowy
    // węzeł, którego nikt już nie odsłaniał.
    const obserwuj = (el: HTMLElement) => {
      if (reduce || !io) el.classList.add("is-in");
      else io.observe(el);
    };
    const mo = new MutationObserver((zmiany) => {
      for (const z of zmiany) {
        for (const n of z.addedNodes) {
          if (!(n instanceof HTMLElement)) continue;
          if (n.matches("[data-reveal]")) obserwuj(n);
          n.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach(obserwuj);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

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

      const { default: Lenis } = await import("lenis");
      if (disposed) return;

      let klatka = 0;
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
        const tick = (czas: number) => {
          lenis!.raf(czas);
          klatka = requestAnimationFrame(tick);
        };
        klatka = requestAnimationFrame(tick);

        // Delikatny parallax tła hero; obraz jest powiększony o 8%, więc przesunięcie
        // nigdy nie odsłania krawędzi. Wcześniej robił to GSAP ze ScrollTriggerem:
        // 111 KB biblioteki na jedną interpolację, którą liczy ten jeden wiersz.
        const layer = document.querySelector<HTMLElement>("[data-parallax]");
        const host = layer?.parentElement;
        if (layer && host) {
          const parallax = () => {
            const r = host.getBoundingClientRect();
            const postep = Math.min(1, Math.max(0, -r.top / (r.height || 1)));
            layer.style.transform = `translateY(${(postep * 8).toFixed(3)}%)`;
          };
          parallax();
          lenis.on("scroll", parallax);
        }
      }

      killScroll = () => {
        cancelAnimationFrame(klatka);
        lenis?.destroy();
      };
    })();

    return () => {
      disposed = true;
      document.removeEventListener("click", onClick);
      io?.disconnect();
      mo.disconnect();
      clearTimeout(revealTimer);
      killScroll?.();
    };
  }, []);

  return null;
}
