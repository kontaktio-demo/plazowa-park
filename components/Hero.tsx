import Image from "next/image";
import { plnShort } from "@/lib/format";
import { OFERTA } from "@/lib/unitType";
import { lokaleSlowo, OFERTA_TEKST } from "@/lib/unitCopy";
import { BLUR } from "@/lib/blur";
import { Icon } from "./Icons";

const stats = [
  { v: String(OFERTA.mieszkania), l: lokaleSlowo("mieszkanie", OFERTA.mieszkania) },
  { v: String(OFERTA.domy), l: lokaleSlowo("dom", OFERTA.domy) },
  { v: "82-133", l: "m² powierzchni" },
  { v: `od ${plnShort(OFERTA.cenaOd)}`, l: "cena" },
];

export default function Hero() {
  return (
    <section id="top" className="band band-abyss relative min-h-svh w-full overflow-hidden">
      <div className="absolute inset-0" data-parallax>
        <Image
          src="/renders/hero.webp"
          alt="Budynek osiedla Plażowa Park w sosnowym lesie, rodzina na ścieżce prowadzącej do wejścia"
          fill
          preload
          quality={80}
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR.hero}
          className="ken-burns object-cover object-[62%_center] sm:object-center"
        />
      </div>
      {/* Scrim tylko pod kolumną tekstu. Wcześniej dwie pełnoekranowe nakładki
          dawały w strefie H1 ok. 90% krycia granatu i kasowały całe złote światło
          renderu - to było dosłownie to, co klient nazwał "za czarna i nie żyje".
          Od 640 px skos wystarcza: prawa połowa kadru zostaje nietknięta. */}
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-[linear-gradient(100deg,var(--color-abyss)_0%,color-mix(in_srgb,var(--color-abyss)_58%,transparent)_34%,transparent_66%)] sm:block"
      />
      {/* Poniżej 640 px kolumna tekstu zajmuje całą szerokość, więc skos nie ma
          czego ominąć - scrim musi być pionowy. Bursztynowa linia H1 ma wobec
          bieli chmur tylko 2,13:1, więc dopiero 70% granatu daje jej 3:1
          (zmierzone na pikselach renderu). Górne 160 px zostaje czyste, żeby
          niebo i światło nie zgasły. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0,color-mix(in_srgb,var(--color-abyss)_70%,transparent)_160px,color-mix(in_srgb,var(--color-abyss)_70%,transparent)_100%)] sm:hidden"
      />
      {/* delikatny cień pod paskiem nawigacji - na jasnym niebie białe menu
          traciło czytelność */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-abyss/60 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[82%] bg-linear-to-t from-abyss/96 via-abyss/50 to-transparent sm:h-[42%] sm:via-transparent sm:from-abyss/78" />

      <div className="wrap relative flex min-h-svh flex-col justify-end pb-[clamp(150px,18vh,176px)] pt-(--nav-h)">
        <div className="max-w-5xl">
          {/* Nagłówek musi objąć mieszkania i domy, ale na telefonie nie może urosnąć
              o kolejny wiersz - to on wyznacza LCP i spycha CTA poniżej pierwszego
              ekranu. Stąd mniejszy stopień do 640 px, wyżej clamp z .t-display-xl. */}
          <h1 className="t-display-xl max-sm:text-[2.35rem] [text-shadow:0_2px_28px_var(--color-abyss)]">
            <span className="rise-y block" style={{ animationDelay: "0ms" }}>
              Mieszkania i domy
            </span>{" "}
            <span className="rise-y block text-sun" style={{ animationDelay: "90ms" }}>
              nad Zalewem Mrożyczka
            </span>
          </h1>

          {/* nad rozjaśnionym renderem przygaszony wariant tekstu gubił czytelność */}
          <p className="rise-y t-body-l mt-5 max-w-xl text-pretty text-sand-50/90 [text-shadow:0_1px_18px_var(--color-abyss)] sm:mt-7" style={{ animationDelay: "200ms" }}>
            Kameralne osiedle w ponad 100-letnim lesie przy plaży i Central Wake Park:{" "}
            {OFERTA_TEKST} z prywatnym ogrodem i tarasem.
          </p>

          <div className="rise-y mt-6 flex flex-wrap items-center gap-3 sm:mt-9" style={{ animationDelay: "300ms" }}>
            <a href="#mieszkania-i-domy" className="btn btn-sun">
              Zobacz mieszkania i domy <Icon.arrow width={18} height={18} />
            </a>
            <a href="#kontakt" data-track="book_viewing" data-miejsce="hero" className="btn btn-ghost border-sand-50/40">
              Umów prezentację
            </a>
          </div>

          <ul
            className="rise-y bd mt-7 grid grid-cols-2 gap-x-8 gap-y-4 border-t pt-5 sm:mt-11 sm:gap-y-7 sm:pt-8 sm:flex sm:flex-wrap sm:gap-0"
            style={{ animationDelay: "400ms" }}
          >
            {stats.map((s, i) => (
              <li key={s.l} className={i > 0 ? "sm:border-l sm:border-clay-700 sm:pl-8 sm:ml-8" : ""}>
                <span className="t-display-m num block leading-none whitespace-nowrap max-sm:text-[1.55rem]">{s.v}</span>
                <span className="t-label fg-muted mt-2.5 block">{s.l}</span>
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
