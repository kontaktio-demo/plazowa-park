import Image from "next/image";
import { STANDARD } from "@/lib/data/site";
import { BLUR } from "@/lib/blur";
import SectionHeader from "./SectionHeader";
import { FeatureIcon } from "./Icons";

export default function Standard() {
  return (
    <section id="standard" className="band band-sand sec">
      <div className="wrap">
        <SectionHeader
          id="standard"
          title={
            <>
              Energooszczędna technologia <span className="fg-accent">w standardzie</span>
            </>
          }
          lead="Apartamenty powstają z materiałów wysokiej jakości, z pompą ciepła i ogrzewaniem podłogowym w cenie. Poddasze jest zawarte w cenie i gotowe do adaptacji według własnego pomysłu."
          className="max-w-3xl"
        />

        <div className="mt-10 grid items-start gap-8 lg:mt-14 lg:grid-cols-[minmax(0,52fr)_minmax(0,48fr)] lg:gap-14" data-reveal>
          <div className="t-body fg-muted space-y-4 text-pretty">
            <p>
              Wszystkie budynki powstają w tej samej technologii. Ogrzewa je pompa ciepła współpracująca
              z ogrzewaniem podłogowym rozprowadzonym po całym lokalu - bez grzejników, więc ściany zostają
              wolne pod aranżację. Rekuperację i fotowoltaikę montujemy na życzenie, na etapie budowy,
              kiedy instalacje da się poprowadzić bez kucia.
            </p>
            <p>
              Elewacje łączą tynk najwyższej klasy z elastyczną cegłą, a dach wykonany jest z blachy na rąbek
              stojący. Przeszklenia sięgają od podłogi do sufitu i otwierają salon na prywatny ogród
              i taras. Każde mieszkanie ma własne, niezależne wejście, dwa miejsca postojowe, a cztery
              lokale w osiedlu - własny garaż.
            </p>
            <p>
              Poddasze jest zawarte w cenie nieruchomości i nie wlicza się do metrażu, więc powierzchnia
              użytkowa lokalu jest w praktyce większa niż liczba w cenniku. Wykończenie pod klucz i zmiany
              w projekcie ustalamy indywidualnie, zanim ruszą prace wykończeniowe.
            </p>
            <p className="t-meta-sm">
              Pełne parametry techniczne - moce urządzeń, współczynniki przenikania i przekroje przegród -
              zawiera prospekt informacyjny inwestycji, który udostępnia biuro sprzedaży.
            </p>
          </div>

          <figure className="bd relative aspect-4/3 overflow-hidden border lg:aspect-3/4">
            <Image
              src="/galeria/elewacja-ogrodowa.webp"
              alt="Elewacja ogrodowa z tarasami, elastyczną cegłą i dachem z blachy na rąbek stojący"
              fill
              sizes="(max-width: 1024px) 100vw, 46vw"
              placeholder="blur"
              blurDataURL={BLUR["gal-elewacja-ogrodowa"]}
              className="object-cover"
            />
          </figure>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-7 sm:gap-x-6 sm:gap-y-10 lg:mt-16 lg:grid-cols-5 lg:gap-x-8" data-reveal="stagger">
          {STANDARD.map((f, i) => (
            <div key={f.title} style={{ transitionDelay: `${Math.min(i, 8) * 60}ms` }}>
              <div className="flex items-center gap-3">
                <span className="glyph-box">
                  <FeatureIcon name={f.icon} width={22} height={22} />
                </span>
                {"optional" in f && f.optional && (
                  <span className="t-meta-sm fg-muted bd border px-2 py-1">Opcja</span>
                )}
              </div>
              <h3 className="t-title mt-4 text-balance sm:mt-5">{f.title}</h3>
              <p className="t-body fg-muted mt-2 text-pretty">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
