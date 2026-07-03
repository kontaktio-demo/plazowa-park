import { STANDARD } from "@/lib/data/site";
import { FeatureIcon } from "./Icons";

export default function Standard() {
  return (
    <section id="standard" className="bg-paper py-20 sm:py-28">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <header className="lg:sticky lg:top-28 lg:self-start" data-reveal="up">
            <p className="eyebrow">04 — Standard i technologia</p>
            <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-pine">
              Zbudowane, by <span className="italic text-brass-deep">mieszkało się dobrze.</span>
            </h2>
            <p className="mt-5 max-w-md text-pretty leading-relaxed text-muted">
              Energooszczędne technologie i materiały premium w standardzie. Poddasze zawarte w cenie — gotowe do
              adaptacji według Twojego pomysłu.
            </p>
          </header>

          <div className="grid gap-px overflow-hidden rounded-[16px] border border-ink/10 bg-ink/10 sm:grid-cols-2" data-reveal="up">
            {STANDARD.map((f) => (
              <div key={f.title} className="bg-paper p-6 transition-colors hover:bg-paper-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pine/8 text-pine">
                  <FeatureIcon name={f.icon} width={24} height={24} />
                </span>
                <h3 className="mt-4 font-display text-xl text-pine">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

