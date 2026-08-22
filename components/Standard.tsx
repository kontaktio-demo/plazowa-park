import { STANDARD } from "@/lib/data/site";
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

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-7 sm:gap-x-6 sm:gap-y-10 lg:mt-14 lg:grid-cols-5 lg:gap-x-8" data-reveal="stagger">
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
