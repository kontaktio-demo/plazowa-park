import Image from "next/image";
import { STANDARD, STANDARD_DOPLATA } from "@/lib/data/site";
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
          className="max-w-3xl"
        />

        <div className="mt-10 grid items-start gap-8 lg:mt-14 lg:grid-cols-[minmax(0,52fr)_minmax(0,48fr)] lg:gap-14" data-reveal>
          <div className="t-body fg-muted space-y-4 text-pretty">
            <p>
              Osiedle powstaje w technologii energooszczędnej: pompa ciepła i ogrzewanie podłogowe są
              w standardzie, a poddasze jest w cenie i poza metrażem. Elewacje łączą tynk najwyższej klasy,
              elastyczną cegłę i blachę na rąbek. Każde mieszkanie i każdy dom ma własne, niezależne wejście.
            </p>
            <p className="t-meta-sm">
              Szczegółowe parametry techniczne zawiera prospekt informacyjny inwestycji, który udostępnia
              biuro sprzedaży.
            </p>
          </div>

          <figure className="bd relative aspect-4/3 overflow-hidden border lg:aspect-3/4">
            <Image
              src="/galeria/taras-ogrod.webp"
              alt="Taras i ogród od strony południowej: nasadzenia, hamak i sosnowy las za trawnikiem"
              fill
              sizes="(max-width: 1024px) 100vw, 46vw"
              placeholder="blur"
              blurDataURL={BLUR["gal-taras-ogrod"]}
              className="object-cover"
            />
          </figure>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-7 sm:gap-x-6 sm:gap-y-10 lg:mt-16 lg:grid-cols-3 lg:gap-x-8" data-reveal="stagger">
          {STANDARD.map((f, i) => (
            <div key={f.title} style={{ transitionDelay: `${Math.min(i, 8) * 60}ms` }}>
              <span className="glyph-box">
                <FeatureIcon name={f.icon} width={22} height={22} />
              </span>
              <h3 className="t-title mt-4 text-balance sm:mt-5">{f.title}</h3>
              <p className="t-body fg-muted mt-2 text-pretty">{f.desc}</p>
            </div>
          ))}
        </div>

        <p className="t-body fg-muted mt-10 text-pretty" data-reveal>
          {STANDARD_DOPLATA}
        </p>
      </div>
    </section>
  );
}
