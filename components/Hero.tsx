import Image from "next/image";
import { INVESTMENT } from "@/lib/data/units";
import { plnShort } from "@/lib/format";
import { Icon } from "./Icons";
import CountUp from "./CountUp";

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden bg-pine-deep">
      <div className="absolute inset-0">
        <Image
          src="/renders/hero.webp"
          alt="Apartamenty Plażowa Park w sosnowym lesie nad Zalewem Mrożyczka w Głownie"
          fill
          priority
          sizes="100vw"
          className="kenburns object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pine-deep/55 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-deep/94 via-pine-deep/35 to-transparent" />
      </div>

      <div className="container-x relative flex min-h-[100svh] flex-col justify-end pb-16 pt-[var(--nav-h)]">
        <div className="max-w-2xl">
          <p className="hero-in eyebrow !text-brass-light" style={{ animationDelay: "0.08s" }}>
            Nowa inwestycja · Głowno
          </p>
          <h1 className="hero-in mt-4 text-[clamp(2.1rem,5.4vw,4.6rem)] font-semibold leading-[1.02] text-paper" style={{ animationDelay: "0.18s" }}>
            Apartamenty nad<br />Zalewem Mrożyczka
          </h1>
          <p className="hero-in mt-5 max-w-xl text-pretty text-lg leading-relaxed text-paper/85" style={{ animationDelay: "0.3s" }}>
            Plażowa Park to kameralne osiedle {INVESTMENT.totalUnits} apartamentów z prywatnym ogrodem i tarasem,
            w otoczeniu ponad 100-letniego lasu, tuż przy plaży i Central Wake Park w Głownie.
          </p>

          <div className="hero-in mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.42s" }}>
            <a href="#lokale" className="btn btn-brass">
              Wybierz apartament <Icon.arrow width={18} height={18} />
            </a>
            <a href="#kontakt" className="btn btn-light">Umów prezentację</a>
          </div>

          <dl className="hero-in mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-paper/15 pt-6" style={{ animationDelay: "0.54s" }}>
            {[
              { v: <CountUp to={INVESTMENT.totalUnits} />, l: "apartamentów" },
              { v: <CountUp to={INVESTMENT.buildingsCount} />, l: "budynków" },
              { v: "82-133", l: "m² powierzchni" },
              { v: `od ${plnShort(INVESTMENT.priceMin)}`, l: "cena" },
            ].map((f) => (
              <div key={f.l}>
                <dt className="font-display text-2xl font-semibold text-paper num">{f.v}</dt>
                <dd className="mt-0.5 text-xs uppercase tracking-[0.14em] text-paper/60">{f.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <a href="#osiedle" className="absolute bottom-6 right-6 hidden flex-col items-center gap-2 text-paper/60 hover:text-paper md:flex">
          <span className="text-[0.65rem] uppercase tracking-[0.2em] [writing-mode:vertical-rl]">Przewiń</span>
          <Icon.arrowDown width={18} height={18} className="scroll-cue" />
        </a>
      </div>
    </section>
  );
}
