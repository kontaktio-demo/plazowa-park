import Image from "next/image";
import { DEVELOPER, KROKI_ZAKUPU, PARTNERZY, RABAT_CBG } from "@/lib/data/site";
import { sectionEyebrow } from "@/lib/sections";
import { Icon } from "./Icons";

// Dwa sprawdzalne fakty. Trzecia karta mówiła o przeniesieniu własności aktem
// notarialnym, czyli dokładnie to samo, co ostatni krok zakupu niżej.
const trust = [
  { title: "Deweloper z Głowna", desc: "Spółka z siedzibą w Głownie; komplet danych rejestrowych jest w stopce." },
  { title: "Standard premium w cenie", desc: "Pompy ciepła, ogrzewanie podłogowe i materiały najwyższej jakości." },
];

const ostatniKrok = KROKI_ZAKUPU.length - 1;

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

        <div
          className="mx-auto mt-10 grid max-w-[720px] gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:max-w-[1040px]"
          data-reveal="stagger"
        >
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

        <div className="bd mx-auto mt-12 max-w-[720px] border-t pt-8 sm:mt-16 lg:max-w-[1040px]" data-reveal>
          <h3 className="t-title">Jak przebiega zakup</h3>
          <ol className="mt-7 lg:grid lg:grid-cols-3 lg:gap-6">
            {KROKI_ZAKUPU.map((k, i) => (
              <li key={k.title} className="relative pb-7 pl-8 last:pb-0 lg:pt-7 lg:pb-0 lg:pl-0">
                {i < ostatniKrok && (
                  <span
                    aria-hidden
                    className="bd-strong absolute top-5 bottom-0 left-[5px] border-l lg:top-[5px] lg:-right-6 lg:bottom-auto lg:left-0 lg:border-l-0 lg:border-t"
                  />
                )}
                <span aria-hidden className="fg-accent absolute top-2 left-0 size-[11px] rounded-full bg-current lg:top-0" />
                <h4 className="leading-snug">{k.title}</h4>
                <p className="t-body fg-muted mt-1.5 text-pretty">{k.desc}</p>
              </li>
            ))}
          </ol>
          <p className="t-body fg-muted mt-8 text-pretty">
            Harmonogram transz, prospekt informacyjny i wzór umowy deweloperskiej udostępnia biuro sprzedaży.
          </p>
        </div>

        <div className="bd mx-auto mt-12 max-w-[720px] border-t pt-8 sm:mt-16 lg:max-w-[1040px]" data-reveal>
          <h3 className="t-title">Partnerzy inwestycji</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6">
            {PARTNERZY.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={p.name}
                data-track="klik_partner"
                data-miejsce="deweloper"
                className="card card-hover flex items-center gap-4 p-4 sm:gap-5 sm:p-5"
              >
                <Image src={p.logo} alt="" width={p.width} height={p.height} className="h-12 w-auto flex-none sm:h-14" />
                <span className="min-w-0">
                  <span className="block font-medium">{p.name}</span>
                  <span className="t-body fg-muted mt-0.5 block text-pretty">{p.role}</span>
                </span>
              </a>
            ))}
          </div>
          {/* Rabat jest korzyścią u partnera, nie obniżką ceny lokalu - stąd zwykły
              akapit obok logotypów, bez wyróżnienia i z dala od jakiejkolwiek ceny. */}
          <p className="t-body fg-muted mt-6 text-pretty">{RABAT_CBG}</p>
        </div>
      </div>
    </section>
  );
}
