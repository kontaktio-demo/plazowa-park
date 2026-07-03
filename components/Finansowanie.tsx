import { FINANCE_STEPS, SITE } from "@/lib/data/site";
import { INVESTMENT } from "@/lib/data/units";
import { plnShort } from "@/lib/format";
import { Icon } from "./Icons";

export default function Finansowanie() {
  return (
    <section id="finansowanie" className="bg-paper-2 py-20 sm:py-28">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div data-reveal="up">
            <p className="eyebrow">06 — Finansowanie</p>
            <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-pine">
              Przejrzysty zakup, <span className="italic text-brass-deep">krok po kroku.</span>
            </h2>
            <div className="mt-8 rounded-[16px] border border-ink/10 bg-paper p-6">
              <p className="text-sm uppercase tracking-[0.14em] text-muted">Ceny od</p>
              <p className="mt-1 font-display text-5xl text-pine num">{plnShort(INVESTMENT.priceMin)}</p>
              <p className="mt-2 text-sm text-muted">
                {INVESTMENT.available} dostępnych apartamentów · do {plnShort(INVESTMENT.priceMax)} · oddanie {SITE.handoverDate}
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <a href="#kontakt" className="btn btn-primary !py-2.5 text-sm">
                  Zapytaj o cennik <Icon.arrow width={16} height={16} />
                </a>
                <a href="#kontakt" className="btn btn-ghost !py-2.5 text-sm">Kontakt z doradcą</a>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-[14px] border border-brass/25 bg-brass/8 p-4">
              <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brass text-white text-sm font-semibold">%</span>
              <p className="text-sm leading-relaxed text-ink-soft">
                <strong className="font-semibold">Promocja:</strong> 10% rabatu na zakupy w CBG przy zakupie apartamentu.
              </p>
            </div>
          </div>

          <ol className="relative space-y-2" data-reveal="up">
            {FINANCE_STEPS.map((s, i) => (
              <li key={s.step} className="relative flex gap-5 rounded-[14px] border border-ink/8 bg-paper p-5 transition-colors hover:border-pine/30">
                <span className="font-display text-4xl leading-none text-brass/45 num">{s.step}</span>
                <div>
                  <h3 className="font-display text-xl text-pine">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{s.desc}</p>
                </div>
                {i < FINANCE_STEPS.length - 1 && <span className="absolute -bottom-2 left-9 h-2 w-px bg-ink/15" />}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
