import { SITE } from "@/lib/data/site";
import { INVESTMENT } from "@/lib/data/units";
import { plnShort } from "@/lib/format";
import { Icon } from "./Icons";

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden bg-pine-deep">
      {/* real developer render - faithful, no invented layout */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/renders/render-01b.webp"
          alt="Apartamenty Plażowa Park w sosnowym lesie o zachodzie słońca - Głowno"
          className="h-full w-full object-cover object-[center_56%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pine-deep/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-deep/92 via-pine-deep/25 to-transparent" />
      </div>

      <div className="container-x relative flex min-h-[100svh] flex-col justify-end pb-14 pt-[var(--nav-h)]">
        <div className="max-w-2xl">
          <p className="hero-in eyebrow !text-brass-light" style={{ animationDelay: "0.08s" }}>
            Nowa inwestycja · Głowno
          </p>
          <h1 className="hero-in mt-4 text-[clamp(2rem,5vw,4.3rem)] font-semibold leading-[1.03] text-paper" style={{ animationDelay: "0.18s" }}>
            Apartamenty nad<br />Zalewem Mrożyczka
          </h1>
          <p className="hero-in mt-5 max-w-lg text-pretty leading-relaxed text-paper/80" style={{ animationDelay: "0.3s" }}>
            Kameralne osiedle {INVESTMENT.totalUnits} apartamentów z prywatnym ogrodem - przy plaży i 100-letnim
            lesie. Oddanie {SITE.handoverDate}.
          </p>

          <div className="hero-in mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.42s" }}>
            <a href="#lokale" className="btn btn-brass">
              Sprawdź dostępność <Icon.arrow width={18} height={18} />
            </a>
            <a href="#kontakt" className="btn btn-light">Umów prezentację</a>
          </div>

          <p className="hero-in mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-paper/70" style={{ animationDelay: "0.54s" }}>
            <span className="num">{INVESTMENT.totalUnits} apartamentów</span>
            <span className="text-brass-light">·</span>
            <span className="num">82-133 m²</span>
            <span className="text-brass-light">·</span>
            <span className="num">od {plnShort(INVESTMENT.priceMin)}</span>
          </p>
        </div>

        <a href="#osiedle" className="absolute bottom-6 right-6 hidden flex-col items-center gap-2 text-paper/60 hover:text-paper md:flex">
          <span className="text-[0.65rem] uppercase tracking-[0.2em] [writing-mode:vertical-rl]">Przewiń</span>
          <Icon.arrowDown width={18} height={18} className="scroll-cue" />
        </a>
      </div>
    </section>
  );
}
