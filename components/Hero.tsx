import Image from "next/image";
import { INVESTMENT } from "@/lib/data/units";
import { plnShort } from "@/lib/format";
import { BLUR } from "@/lib/blur";
import { Icon } from "./Icons";

const stats = [
  { v: String(INVESTMENT.totalUnits), l: "apartamentów" },
  { v: String(INVESTMENT.buildingsCount), l: "budynków" },
  { v: "82-133", l: "m² powierzchni" },
  { v: `od ${plnShort(INVESTMENT.priceMin)}`, l: "cena" },
];

export default function Hero() {
  return (
    <section id="top" className="band band-abyss relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0" data-parallax>
        <Image
          src="/renders/hero.webp"
          alt="Apartamenty Plażowa Park w sosnowym lesie nad Zalewem Mrożyczka w Głownie"
          fill
          priority
          quality={62}
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR.hero}
          className="scale-[1.08] object-cover object-[62%_center] sm:object-[70%_center]"
        />
      </div>
      {/* woda zbiera się od dołu i od lewej, żeby tekst siedział na spokojnym tle */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/55 to-transparent" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/30 to-transparent" />

      <div className="wrap relative flex min-h-[100svh] flex-col justify-end pb-[clamp(150px,18vh,176px)] pt-(--nav-h)">
        <div className="max-w-5xl">
          <p className="rise t-meta text-lake-300" style={{ animationDelay: "0ms" }}>
            Głowno · Zalew Mrożyczka
          </p>

          <h1 className="t-display-xl mt-4 sm:mt-6">
            <span className="rise-y block" style={{ animationDelay: "80ms" }}>
              Apartamenty nad
            </span>
            <span className="rise-y accent-italic block text-lake-300" style={{ animationDelay: "160ms" }}>
              Zalewem Mrożyczka
            </span>
          </h1>

          <p className="rise t-body-l fg-muted mt-5 max-w-xl text-pretty sm:mt-7" style={{ animationDelay: "280ms" }}>
            Kameralne osiedle {INVESTMENT.totalUnits} apartamentów z prywatnym ogrodem i tarasem, w ponad
            100-letnim lesie przy plaży i Central Wake Park.
          </p>

          <div className="rise mt-6 flex flex-wrap items-center gap-3 sm:mt-9" style={{ animationDelay: "380ms" }}>
            <a href="#lokale" className="btn btn-sun">
              Wybierz apartament <Icon.arrow width={18} height={18} />
            </a>
            <a href="#kontakt" data-track="book_viewing" className="btn btn-ghost border-sand-50/40">
              Umów prezentację
            </a>
          </div>

          <ul
            className="rise bd mt-7 grid grid-cols-2 gap-x-8 gap-y-4 border-t pt-5 sm:mt-11 sm:gap-y-7 sm:pt-8 sm:flex sm:flex-wrap sm:gap-0"
            style={{ animationDelay: "480ms" }}
          >
            {stats.map((s, i) => (
              <li key={s.l} className={i > 0 ? "sm:border-l sm:border-lake-700 sm:pl-8 sm:ml-8" : ""}>
                <span className="t-display-m num block leading-none">{s.v}</span>
                <span className="t-meta-sm fg-muted mt-2.5 block">{s.l}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          aria-hidden
          className="rise absolute bottom-[clamp(32px,5vh,52px)] left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
          style={{ animationDelay: "620ms" }}
        >
          <span className="t-meta-sm fg-muted">Przewiń</span>
          <span className="h-10 w-px bg-gradient-to-b from-lake-300/70 to-transparent" />
        </div>
      </div>
    </section>
  );
}
