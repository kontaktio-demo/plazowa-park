"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/data/site";
import { INVESTMENT } from "@/lib/data/units";
import { plnShort } from "@/lib/format";
import { Icon } from "./Icons";

const facts = [
  { k: `${INVESTMENT.totalUnits}`, l: "apartamentów" },
  { k: `${INVESTMENT.buildingsCount}`, l: "budynków" },
  { k: "82–133", l: "m² powierzchni" },
  { k: `od ${plnShort(INVESTMENT.priceMin)}`, l: "cena startowa" },
];

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    if (!m.matches) videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden bg-pine-deep">
      {/* background media */}
      <div className="absolute inset-0">
        {!reduce ? (
          <video
            ref={videoRef}
            className="hero-fade h-full w-full object-cover"
            poster="/renders/hero-poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/video/hero-house.mp4" type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/renders/hero-poster.webp" alt="Apartament Plażowa Park w sosnowym lesie o zmierzchu" className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-pine-deep/92 via-pine-deep/45 to-pine-deep/70" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_40%,rgba(18,35,24,0.55)_100%)]" />
      </div>

      {/* content */}
      <div className="container-x relative flex min-h-[100svh] flex-col justify-end pb-16 pt-[calc(var(--nav-h)+2rem)]">
        <div className="max-w-4xl">
          <p className="hero-in eyebrow !text-brass-light" style={{ animationDelay: "0.1s" }}>
            Nowa inwestycja · Głowno · woj. łódzkie
          </p>
          <h1
            className="hero-in mt-5 text-balance text-[clamp(2.05rem,6.2vw,5.8rem)] leading-[1.0] text-paper"
            style={{ animationDelay: "0.22s" }}
          >
            Apartamenty nad Zalewem Mrożyczka,
            <span className="mt-1 block italic text-brass-light">w 100-letnim lesie.</span>
          </h1>
          <p
            className="hero-in mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-paper/85"
            style={{ animationDelay: "0.34s" }}
          >
            Kameralne osiedle {INVESTMENT.totalUnits} apartamentów z prywatnym ogrodem i tarasem, bezpośrednio przy
            plaży, molo i Central Wake Park. Głowno — {SITE.handoverDate}.
          </p>

          <div className="hero-in mt-9 flex flex-wrap items-center gap-3.5" style={{ animationDelay: "0.46s" }}>
            <a href="#lokale" className="btn btn-brass">
              Sprawdź dostępność
              <Icon.arrow width={18} height={18} />
            </a>
            <a href="#kontakt" className="btn btn-light">
              Umów prezentację
            </a>
            <a href={`tel:${SITE.phone.tel}`} className="hidden items-center gap-2 pl-3 text-sm font-medium text-paper/80 hover:text-paper sm:flex">
              <Icon.phone width={17} height={17} className="text-brass-light" />
              <span className="num">{SITE.phone.display}</span>
            </a>
          </div>

          {/* facts */}
          <dl className="hero-in mt-12 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-6 border-t border-paper/15 pt-7 sm:grid-cols-4" style={{ animationDelay: "0.6s" }}>
            {facts.map((f) => (
              <div key={f.l}>
                <dt className="font-display text-[1.7rem] leading-none text-paper num">{f.k}</dt>
                <dd className="mt-1.5 text-xs uppercase tracking-[0.14em] text-paper/60">{f.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* scroll cue */}
        <a href="#osiedle" className="absolute bottom-6 right-6 hidden flex-col items-center gap-2 text-paper/60 hover:text-paper md:flex">
          <span className="text-[0.65rem] uppercase tracking-[0.2em] [writing-mode:vertical-rl]">Przewiń</span>
          <Icon.arrowDown width={18} height={18} className="scroll-cue" />
        </a>
      </div>
    </section>
  );
}
