import Image from "next/image";
import { INVESTMENT } from "@/lib/data/units";
import { plnShort } from "@/lib/format";
import { BLUR } from "@/lib/blur";
import { Icon } from "./Icons";

const stats = [
  { v: String(INVESTMENT.totalUnits), l: "domów" },
  { v: String(INVESTMENT.buildingsCount), l: "budynków" },
  { v: "82-133", l: "m² powierzchni" },
  { v: `od ${plnShort(INVESTMENT.priceMin)}`, l: "cena" },
];

export default function Hero() {
  return (
    <section id="top" className="band band-abyss relative min-h-svh w-full overflow-hidden">
      <div className="absolute inset-0" data-parallax>
        <Image
          src="/renders/hero.webp"
          alt="Dom Plażowa Park w sosnowym lesie, rodzina na ścieżce prowadzącej do wejścia"
          fill
          priority
          quality={62}
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR.hero}
          className="ken-burns object-cover object-[62%_center] sm:object-center"
        />
      </div>
      {/* Scrim tylko pod kolumną tekstu. Wcześniej dwie pełnoekranowe nakładki
          dawały w strefie H1 ok. 90% krycia granatu i kasowały całe złote światło
          renderu - to było dosłownie to, co klient nazwał "za czarna i nie żyje".
          Czytelność bierzemy z cienia tekstu, nie z przyciemniania zdjęcia. */}
      {/* na wąskim ekranie skos zjadałby cały kadr, więc tam scrim jest pionowy */}
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-[linear-gradient(100deg,var(--color-abyss)_0%,color-mix(in_srgb,var(--color-abyss)_58%,transparent)_34%,transparent_66%)] sm:block"
      />
      {/* delikatny cień pod paskiem nawigacji - na jasnym niebie białe menu
          traciło czytelność */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-abyss/60 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[82%] bg-linear-to-t from-abyss/96 via-abyss/50 to-transparent sm:h-[42%] sm:via-transparent sm:from-abyss/78" />

      <div className="wrap relative flex min-h-svh flex-col justify-end pb-[clamp(150px,18vh,176px)] pt-(--nav-h)">
        <div className="max-w-5xl">
          <h1 className="t-display-xl [text-shadow:0_2px_28px_var(--color-abyss)]">
            <span className="rise-y block" style={{ animationDelay: "0ms" }}>
              Domy nad
            </span>
            <span className="rise-y block text-sun" style={{ animationDelay: "90ms" }}>
              Zalewem Mrożyczka
            </span>
          </h1>

          {/* nad rozjaśnionym renderem przygaszony wariant tekstu gubił czytelność */}
          <p className="rise-y t-body-l mt-5 max-w-xl text-pretty text-sand-50/90 [text-shadow:0_1px_18px_var(--color-abyss)] sm:mt-7" style={{ animationDelay: "200ms" }}>
            Kameralne osiedle {INVESTMENT.totalUnits} domów z prywatnym ogrodem i tarasem, w ponad
            100-letnim lesie przy plaży i Central Wake Park.
          </p>

          <div className="rise-y mt-6 flex flex-wrap items-center gap-3 sm:mt-9" style={{ animationDelay: "300ms" }}>
            <a href="#mieszkania-i-domy" className="btn btn-sun">
              Wybierz swój dom <Icon.arrow width={18} height={18} />
            </a>
            <a href="#kontakt" data-track="book_viewing" className="btn btn-ghost border-sand-50/40">
              Umów prezentację
            </a>
          </div>

          <ul
            className="rise-y bd mt-7 grid grid-cols-2 gap-x-8 gap-y-4 border-t pt-5 sm:mt-11 sm:gap-y-7 sm:pt-8 sm:flex sm:flex-wrap sm:gap-0"
            style={{ animationDelay: "400ms" }}
          >
            {stats.map((s, i) => (
              <li key={s.l} className={i > 0 ? "sm:border-l sm:border-clay-700 sm:pl-8 sm:ml-8" : ""}>
                <span className="t-display-m num block leading-none whitespace-nowrap text-[1.55rem] sm:text-[unset]">{s.v}</span>
                <span className="t-meta-sm fg-muted mt-2.5 block">{s.l}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          aria-hidden
          className="rise-y absolute bottom-[clamp(32px,5vh,52px)] left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
          style={{ animationDelay: "540ms" }}
        >
          <span className="t-meta-sm fg-muted">Przewiń</span>
          <span className="h-10 w-px bg-linear-to-b from-clay-300/70 to-transparent" />
        </div>
      </div>
    </section>
  );
}
