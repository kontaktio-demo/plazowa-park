import { DEVELOPER, SITE } from "@/lib/data/site";
import { sectionEyebrow } from "@/lib/sections";
import { Icon } from "./Icons";

const trust = [
  { title: "Umowa u notariusza", desc: "Bezpieczeństwo transakcji zgodne z ustawą deweloperską." },
  { title: "Dziennik budowy", desc: "Bieżąca dokumentacja postępu prac na osiedlu." },
  { title: "Standard premium w cenie", desc: "Pompy ciepła, ogrzewanie podłogowe i materiały najwyższej jakości." },
];

const registry = [
  { label: "KRS", value: DEVELOPER.krs },
  { label: "NIP", value: DEVELOPER.nip },
  { label: "REGON", value: DEVELOPER.regon },
  { label: "Status VAT", value: DEVELOPER.statusVat },
];

export default function Developer() {
  return (
    <section id="deweloper" className="band band-lake sec">
      <div className="wrap">
        <header className="mx-auto max-w-[720px] text-center" data-reveal>
          <p className="eyebrow">{sectionEyebrow("deweloper")}</p>
          <h2 className="t-display-l mt-6 text-balance">
            Lokalny deweloper <span className="fg-accent">z Głowna</span>
          </h2>
          <p className="t-body-l fg-muted mt-6 text-pretty">
            Inwestorem i deweloperem osiedla Plażowa Park jest {DEVELOPER.name} z Głowna. Stawiamy na kameralną,
            energooszczędną zabudowę w zgodzie z naturą, w wyjątkowej lokalizacji nad Zalewem Mrożyczka.
          </p>
        </header>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-6" data-reveal="stagger">
          {trust.map((t, i) => (
            <div key={t.title} className="card p-5 sm:p-6" style={{ transitionDelay: `${i * 60}ms` }}>
              <span className="glyph-box">
                <Icon.check width={20} height={20} />
              </span>
              <h3 className="t-title mt-5">{t.title}</h3>
              <p className="t-body fg-muted mt-2 text-pretty">{t.desc}</p>
            </div>
          ))}
        </div>

        <div className="bd mx-auto mt-10 max-w-[720px] border-t pt-8 sm:mt-14" data-reveal>
          <p className="t-meta-sm fg-muted">Dane rejestrowe</p>
          <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
            {registry.map((r) => (
              <div key={r.label} className="min-w-0">
                <dt className="t-meta-sm fg-muted">{r.label}</dt>
                <dd className="num mt-1.5 font-medium wrap-break-word">{r.value}</dd>
              </div>
            ))}
          </dl>
          <p className="t-body fg-muted mt-6">
            {DEVELOPER.name}, {DEVELOPER.street}, {DEVELOPER.postal} {DEVELOPER.city}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`tel:${SITE.phone.tel}`} className="btn btn-ghost btn-sm">
              <Icon.phone width={16} height={16} /> {SITE.phone.display}
            </a>
            <a href="#kontakt" data-track="book_viewing" className="btn btn-sun btn-sm">
              Umów spotkanie
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
