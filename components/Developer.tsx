import { DEVELOPER, SITE, FINANCE_STEPS } from "@/lib/data/site";
import { sectionEyebrow } from "@/lib/sections";
import { Icon } from "./Icons";

// Trzy sprawdzalne fakty. Wczesniej byly tu dwa twierdzenia bez pokrycia:
// zgodnosc z ustawa deweloperska (nie potwierdzona zadnym zrodlem - nie wiadomo,
// czy jest rachunek powierniczy i skladki na DFG) oraz dziennik budowy jako
// rzekoma usluga dla nabywcy, podczas gdy to dokument urzedowy, a strona nie
// pokazuje ani jednego zdjecia z budowy.
const trust = [
  { title: "Umowa u notariusza", desc: "Przeniesienie własności w formie aktu notarialnego." },
  { title: "Deweloper z Głowna", desc: "Spółka z siedzibą w Głownie, dane rejestrowe poniżej." },
  { title: "Standard premium w cenie", desc: "Pompy ciepła, ogrzewanie podłogowe i materiały najwyższej jakości." },
];

const registry = [
  { label: "KRS", value: DEVELOPER.krs },
  { label: "NIP", value: DEVELOPER.nip },
  { label: "REGON", value: DEVELOPER.regon },
  { label: "Status VAT", value: DEVELOPER.statusVat },
  { label: "Kapitał zakładowy", value: DEVELOPER.kapital },
];

export default function Developer() {
  return (
    <section id="deweloper" className="band band-sand-2 sec">
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

        {/* FINANCE_STEPS leżały w danych i nie były nigdzie renderowane, a to
            pierwsze pytanie kupującego z rynku pierwotnego: co się dzieje po
            kliknięciu "Zapytaj". */}
        <div className="bd mx-auto mt-12 max-w-[720px] border-t pt-8 sm:mt-16" data-reveal="stagger">
          <p className="t-meta-sm fg-muted">Jak przebiega zakup</p>
          <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {FINANCE_STEPS.map((s, i) => (
              <li key={s.step} style={{ transitionDelay: `${i * 60}ms` }}>
                <span className="t-meta-sm fg-accent num">{s.step}</span>
                <h3 className="t-title mt-2">{s.title}</h3>
                <p className="t-body fg-muted mt-1.5 text-pretty">{s.desc}</p>
              </li>
            ))}
          </ol>
          <p className="t-meta-sm fg-muted mt-7">
            Harmonogram transz, prospekt informacyjny i wzór umowy deweloperskiej udostępnia biuro sprzedaży.
          </p>
        </div>
      </div>
    </section>
  );
}
