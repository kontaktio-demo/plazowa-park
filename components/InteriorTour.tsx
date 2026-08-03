import Image from "next/image";
import { INTERIORS } from "@/lib/data/site";

export default function InteriorTour() {
  const [feature, ...rest] = INTERIORS;
  return (
    <section id="wnetrza" className="bg-pine-deep py-20 text-paper sm:py-28">
      <div className="container-x">
        <header className="max-w-2xl" data-reveal="up">
          <p className="eyebrow !text-brass-light">03 - Wnętrza</p>
          <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-paper">
            Przestrzeń dla <span className="italic text-brass-light">całej rodziny.</span>
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-paper/70">
            Otwarta strefa dzienna z kuchnią i schodami na piętro, cicha sypialnia z widokiem na las oraz
            prywatny ogród z tarasem. Poddasze, zawarte w cenie, zaadaptujesz według własnego pomysłu.
          </p>
        </header>

        <div className="mt-10 grid gap-4" data-reveal="up">
          {/* feature - real developer render */}
          <figure className="relative aspect-[16/10] overflow-hidden rounded-[16px] sm:aspect-[16/8]">
            <Image
              src={feature.src}
              alt={`${feature.label}, apartament Plażowa Park`}
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-5 sm:p-7">
              <p className="font-display text-2xl text-paper">{feature.label}</p>
              <p className="mt-1 max-w-lg text-sm text-paper/75">{feature.note}</p>
            </figcaption>
          </figure>

          {/* rest */}
          <div className="grid gap-4 sm:grid-cols-2">
            {rest.map((r) => (
              <figure key={r.src} className="relative aspect-[16/11] overflow-hidden rounded-[16px]">
                <Image
                  src={r.src}
                  alt={`${r.label}, apartament Plażowa Park`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-5">
                  <p className="font-display text-xl text-paper">{r.label}</p>
                  <p className="mt-1 text-sm text-paper/75">{r.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <p className="mt-5 text-xs text-paper/45">Wizualizacje dewelopera. Materiały poglądowe. Rzeczywisty wygląd może się różnić.</p>
      </div>
    </section>
  );
}
