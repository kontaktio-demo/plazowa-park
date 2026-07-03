import { Icon } from "./Icons";

const highlights = [
  { icon: "wave", title: "Woda za progiem", desc: "Strzeżone kąpielisko, molo, sporty wodne i wakeboard." },
  { icon: "tree", title: "Stuletni las", desc: "Sosnowy drzewostan i cisza zamiast miejskiego zgiełku." },
  { icon: "pin", title: "Blisko wszystkiego", desc: "Szkoły, przychodnia i sklepy w zasięgu spaceru." },
];

export default function Lifestyle() {
  return (
    <section className="bg-paper py-20 sm:py-28">
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div data-reveal="up">
            <p className="eyebrow">Miejsce</p>
            <h2 className="mt-5 text-[clamp(2rem,4.6vw,3.6rem)] text-pine">
              Życie nad wodą, <span className="italic text-brass-deep">w cieniu stuletnich sosen.</span>
            </h2>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted">
              Plażowa Park powstaje w wyjątkowym miejscu — tam, gdzie kończy się miasto, a zaczyna las i woda.
              Zalew Mrożyczka z piaszczystą plażą, molo i Central Wake Park są tuż obok. To codzienność, w której
              spacer brzegiem jeziora zastępuje korki, a widok z okna to sosnowy las.
            </p>
            <div className="mt-9 grid gap-6 sm:grid-cols-3">
              {highlights.map((h) => (
                <div key={h.title}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pine/8 text-pine">
                    <Icon.check width={0} height={0} className="hidden" />
                    <IconByName name={h.icon} />
                  </span>
                  <h3 className="mt-3.5 font-display text-lg text-pine">{h.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <figure data-reveal="up" className="relative">
            <div className="grain relative overflow-hidden rounded-[18px] shadow-[var(--shadow-lift)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/renders/aerial-golden.webp"
                alt="Osiedle Plażowa Park w sosnowym lesie nad Zalewem Mrożyczka o zachodzie słońca"
                className="aspect-[4/5] w-full object-cover sm:aspect-[3/4]"
                loading="lazy"
              />
            </div>
            <figcaption className="absolute -bottom-5 left-5 right-5 rounded-[14px] border border-ink/10 bg-paper/95 p-4 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:left-auto sm:right-6 sm:max-w-[15rem]">
              <p className="font-display text-lg text-pine">Bezpośrednio przy Zalewie</p>
              <p className="mt-1 text-sm text-muted">Sosnowy las, plaża i sporty wodne w zasięgu spaceru.</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function IconByName({ name }: { name: string }) {
  if (name === "wave") return <Icon.wave width={22} height={22} />;
  if (name === "tree") return <Icon.tree width={22} height={22} />;
  return <Icon.pin width={22} height={22} />;
}
