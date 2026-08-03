import Image from "next/image";
import { POI } from "@/lib/data/site";
import MapLibreMap from "./MapLibreMap";
import { Icon } from "./Icons";

const catColor: Record<string, string> = {
  natura: "var(--color-available)",
  sport: "var(--color-lake)",
  dojazd: "var(--color-brass)",
  usługi: "var(--color-muted)",
};

const photos = [
  { src: "/area/plaza.webp", label: "Plaża nad Zalewem Mrożyczka" },
  { src: "/area/wakepark.webp", label: "Central Wake Park" },
  { src: "/area/molo.webp", label: "Molo i pomost" },
];

export default function Okolica() {
  return (
    <section id="okolica" className="bg-paper py-20 sm:py-28">
      <div className="container-x">
        <header className="max-w-2xl" data-reveal="up">
          <p className="eyebrow">05 - Okolica</p>
          <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-pine">
            Nad wodą, <span className="italic text-brass-deep">w sercu lasu.</span>
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted">
            Osiedle leży bezpośrednio przy Zalewie Mrożyczka i w ponad 100-letnim lesie. Poniżej rzeczywiste
            zdjęcia satelitarne z lokalizacją inwestycji oraz najważniejsze punkty w sąsiedztwie.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_1fr]" data-reveal="up">
          <div className="min-h-[420px]">
            <MapLibreMap />
            <p className="mt-2 text-xs text-faint">
              Zdjęcia satelitarne © Esri, Maxar. Lokalizacja poglądowa. Dokładny obrys działki potwierdza geodeta.
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
                    <span className="whitespace-nowrap text-xs font-semibold text-brass-deep">{p.dist}</span>
                  </div>
                  <p className="mt-0.5 text-sm leading-snug text-muted">{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* real photographs of the surroundings - consistent photographic style */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3" data-reveal="fade">
          {photos.map((p) => (
            <figure key={p.src} className="relative aspect-[4/3] overflow-hidden rounded-[14px]">
              <Image
                src={p.src}
                alt={`${p.label} w Głownie`}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4 text-sm font-medium text-paper">
                {p.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
