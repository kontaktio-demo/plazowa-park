import { POI, SITE } from "@/lib/data/site";
import MapLibreMap from "./MapLibreMap";
import { Icon } from "./Icons";

const catColor: Record<string, string> = {
  natura: "var(--color-available)",
  sport: "var(--color-lake)",
  dojazd: "var(--color-brass)",
  usługi: "var(--color-muted)",
};

export default function Okolica() {
  return (
    <section id="okolica" className="bg-paper py-20 sm:py-28">
      <div className="container-x">
        <header className="max-w-2xl" data-reveal="up">
          <p className="eyebrow">05 — Okolica</p>
          <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-pine">
            Wszystko, co ważne, <span className="italic text-brass-deep">w zasięgu spaceru.</span>
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted">
            Osiedle leży bezpośrednio przy Zalewie Mrożyczka i 100-letnim lesie. Poniżej rzeczywiste zdjęcia
            satelitarne z lokalizacją inwestycji oraz najważniejsze punkty w okolicy.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_1fr]" data-reveal="up">
          <div className="min-h-[420px]">
            <MapLibreMap />
            <p className="mt-2 text-xs text-faint">
              Zdjęcia satelitarne © Esri, Maxar. Lokalizacja poglądowa — dokładny obrys działki potwierdza geodeta.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
            {POI.map((p) => (
              <li key={p.name} className="flex items-start gap-3 rounded-[12px] border border-ink/8 bg-paper-2 p-3.5">
                <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full" style={{ background: `color-mix(in srgb, ${catColor[p.cat]} 15%, transparent)`, color: catColor[p.cat] }}>
                  <Icon.pin width={17} height={17} />
                </span>
                <div className="min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-medium text-ink">{p.name}</span>
                    <span className="whitespace-nowrap text-xs font-semibold text-brass-deep num">{p.dist}</span>
                  </div>
                  <p className="mt-0.5 text-sm leading-snug text-muted">{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* showcase: wakepark video + location illustration */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2" data-reveal="fade">
          <figure className="relative overflow-hidden rounded-[16px] bg-pine-deep">
            <video
              className="aspect-[16/10] w-full object-cover"
              poster="/video/poster-lake.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
            >
              <source src="/video/lake-molo.mp4" type="video/mp4" />
            </video>
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-5 text-paper">
              <p className="font-display text-xl">Central Wake Park</p>
              <p className="mt-0.5 text-sm text-paper/75">Wakeboard i sporty wodne u progu osiedla.</p>
            </figcaption>
          </figure>

          <figure className="relative overflow-hidden rounded-[16px] border border-ink/10 bg-[#f0ecdf]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/map/mapka.webp"
              alt="Plan okolicy: Zalew Mrożyczka, plaża, molo, Central Wake Park i osiedle Plażowa Park"
              className="aspect-[16/10] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="absolute bottom-4 left-4 rounded-[12px] bg-paper/90 px-3.5 py-2 backdrop-blur-sm">
              <p className="font-display text-lg text-pine">Nad Zalewem Mrożyczka</p>
              <p className="text-sm text-muted">{SITE.address.street}, {SITE.address.city}</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
