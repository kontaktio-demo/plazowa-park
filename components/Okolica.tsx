import Image from "next/image";
import { POI, SITE } from "@/lib/data/site";
import MapLibreMap from "./MapLibreMap";
import { Icon } from "./Icons";

const catColor: Record<string, string> = {
  natura: "var(--color-available)",
  sport: "var(--color-lake)",
  dojazd: "var(--color-brass)",
  usługi: "var(--color-muted)",
};

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${SITE.geo.lat},${SITE.geo.lng}`;

export default function Okolica() {
  return (
    <section id="okolica" className="bg-paper py-20 sm:py-28">
      <div className="container-x">
        <header className="max-w-2xl" data-reveal="up">
          <p className="eyebrow">05 - Okolica</p>
          <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-pine">
            Spokojna okolica <span className="italic text-brass-deep">nad Zalewem Mrożyczka.</span>
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted">
            Osiedle Plażowa Park leży bezpośrednio przy Zalewie Mrożyczka i w otoczeniu ponad 100-letniego lasu.
            Plaża, przystań, Central Wake Park i ścieżki rowerowe są w zasięgu spaceru, a codzienne usługi
            w Głownie w kilka minut.
          </p>
        </header>

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]" data-reveal="up">
          <figure className="relative overflow-hidden rounded-[16px] border border-ink/10 bg-[#eef0ee]">
            <Image
              src="/map/mapka-3D.webp"
              alt="Plan okolicy: Plażowa Park nad Zalewem Mrożyczka, Central Wake Park, przystań, plaża i molo"
              width={2400}
              height={1792}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="h-auto w-full"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/55 to-transparent p-4 text-xs text-paper/90">
              <span>Orientacyjny plan okolicy. Materiał dewelopera.</span>
            </figcaption>
          </figure>

          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
            {POI.map((p) => (
              <li key={p.name} className="flex items-start gap-3 rounded-[12px] border border-ink/8 bg-paper-2 p-3.5">
                <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full" style={{ background: `color-mix(in srgb, ${catColor[p.cat]} 15%, transparent)`, color: catColor[p.cat] }}>
                  <Icon.pin width={17} height={17} />
                </span>
                <div className="min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-medium text-ink">{p.name}</span>
                    <span className="whitespace-nowrap text-xs font-semibold text-brass-deep">{p.dist}</span>
                  </div>
                  <p className="mt-0.5 text-sm leading-snug text-muted">{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 grid gap-3" data-reveal="fade">
          <div className="h-[340px]">
            <MapLibreMap />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-faint">
            <span>Zdjęcia satelitarne Esri, Maxar. Lokalizacja poglądowa. Dokładny obrys działki potwierdza geodeta.</span>
            <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-brass-deep hover:text-pine">
              Zobacz w Google Maps <Icon.arrow width={14} height={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
