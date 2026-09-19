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

        {/* Kadr idzie przez całą szerokość, a nie w kolumnie obok tekstu. Po skróceniu
            opisu do jednego akapitu pionowe zdjęcie było trzy razy wyższe od kolumny
            z tekstem i zostawiało obok siebie puste pół ekranu. */}
        <div className="mt-8 max-w-3xl lg:mt-10" data-reveal>
          <p className="t-body fg-muted text-pretty">
            Osiedle powstaje w technologii energooszczędnej: pompa ciepła i ogrzewanie podłogowe są
            w standardzie, a poddasze jest w cenie i poza metrażem. Elewacje łączą tynk najwyższej klasy,
            elastyczną cegłę i blachę na rąbek. Każde mieszkanie i każdy dom ma własne, niezależne wejście.
          </p>
          <p className="t-meta-sm fg-muted mt-4 text-pretty">
            Szczegółowe parametry techniczne zawiera prospekt informacyjny inwestycji, który udostępnia
            biuro sprzedaży.
          </p>
        </div>

        <figure className="bd relative mt-10 aspect-16/10 overflow-hidden border sm:aspect-21/9 lg:mt-12" data-reveal>
          <Image
            src="/galeria/taras-ogrod.webp"
            alt="Taras i ogród od strony południowej: nasadzenia, hamak i sosnowy las za trawnikiem"
            fill
            sizes="(max-width: 1280px) 100vw, 1216px"
            placeholder="blur"
            blurDataURL={BLUR["gal-taras-ogrod"]}
            className="object-cover object-bottom"
          />
        </figure>

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-7 sm:gap-x-6 sm:gap-y-10 lg:mt-14 lg:grid-cols-3 lg:gap-x-8" data-reveal="stagger">
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
