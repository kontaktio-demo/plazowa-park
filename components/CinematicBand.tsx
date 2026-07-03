"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icons";

export default function CinematicBand() {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    if (m.matches) return;
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative flex min-h-[85svh] items-center overflow-hidden bg-pine-deep">
      <div className="absolute inset-0">
        {!reduce ? (
          <video ref={ref} className="h-full w-full object-cover" poster="/video/poster-daynight.webp" muted loop playsInline preload="none">
            <source src="/video/daynight.mp4" type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/renders/facade-night.webp" alt="Apartament Plażowa Park o zmierzchu" className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-pine-deep/90 via-pine-deep/40 to-pine-deep/70" />
      </div>

      <div className="container-x relative">
        <div className="max-w-3xl" data-reveal="up">
          <p className="eyebrow !text-brass-light">Od świtu do zmierzchu</p>
          <h2 className="mt-5 text-balance text-[clamp(2.2rem,5.2vw,4.4rem)] leading-[1.02] text-paper">
            Dom, który <span className="italic text-brass-light">żyje światłem.</span>
          </h2>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-paper/80">
            Rankiem las budzi się za panoramicznym oknem, wieczorem wnętrze rozlewa ciepłe światło na taras.
            Zobacz, jak apartament zmienia się wraz z porą dnia.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#kontakt" className="btn btn-brass">Umów prezentację <Icon.arrow width={18} height={18} /></a>
            <a href="#lokale" className="btn btn-light">Zobacz lokale</a>
          </div>
        </div>
      </div>
    </section>
  );
}
