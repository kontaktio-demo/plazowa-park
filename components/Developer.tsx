import { DEVELOPER, SITE } from "@/lib/data/site";
import { Icon } from "./Icons";

const trust = [
  { title: "Umowa deweloperska u notariusza", desc: "Bezpieczeństwo transakcji zgodne z ustawą deweloperską." },
  { title: "Dziennik i postęp budowy", desc: "Bieżąca dokumentacja etapów prac na osiedlu." },
  { title: "Standard premium w cenie", desc: "Pompy ciepła, rekuperacja i materiały najwyższej jakości." },
];

export default function Developer() {
  return (
    <section id="deweloper" className="bg-pine py-20 text-paper sm:py-28">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-reveal="up">
            <p className="eyebrow !text-brass-light">07 — Deweloper</p>
            <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-paper">
              Budujemy z myślą <span className="italic text-brass-light">o pokoleniach.</span>
            </h2>
            <p className="mt-6 max-w-xl text-pretty leading-relaxed text-paper/75">
              {DEVELOPER.name} to lokalny deweloper z Głowna, tworzący kameralne osiedla w zgodzie z naturą.
              Plażowa Park łączy energooszczędne technologie z wyjątkową lokalizacją nad Zalewem Mrożyczka.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-paper/15 pt-6 text-sm">
              <Info label="Spółka" value={DEVELOPER.name} />
              <Info label="Prezes zarządu" value={DEVELOPER.ceo} />
              <Info label="KRS" value={DEVELOPER.krs} />
              <Info label="NIP" value={DEVELOPER.nip} />
              <Info label="REGON" value={DEVELOPER.regon} />
              <Info label="Siedziba" value={`${DEVELOPER.street}, ${DEVELOPER.postal} ${DEVELOPER.city}`} wide />
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`tel:${SITE.phone.tel}`} className="btn btn-brass !py-2.5 text-sm">
                <Icon.phone width={16} height={16} /> {SITE.phone.display}
              </a>
              <a href="#kontakt" className="btn btn-light !py-2.5 text-sm">Umów spotkanie</a>
            </div>
          </div>

          <div className="grid gap-4 self-center" data-reveal="up">
            {trust.map((t) => (
              <div key={t.title} className="flex items-start gap-4 rounded-[14px] border border-paper/12 bg-paper/5 p-5">
                <span className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brass-light text-pine-deep">
                  <Icon.check width={20} height={20} />
                </span>
                <div>
                  <h3 className="font-display text-xl text-paper">{t.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-paper/70">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <dt className="text-[0.7rem] uppercase tracking-[0.14em] text-paper/50">{label}</dt>
      <dd className="mt-1 font-medium text-paper num">{value}</dd>
    </div>
  );
}
