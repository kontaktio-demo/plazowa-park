import Link from "next/link";
import { DOJAZD } from "@/lib/data/site";
import SectionHeader from "./SectionHeader";
import PlanOkolicy from "./PlanOkolicy";
import { Icon } from "./Icons";

export default function Okolica() {
  return (
    <section id="okolica" className="band band-sand sec relative">
      <div className="wrap">
        <SectionHeader
          id="okolica"
          title={
            <>
              Trzydzieści hektarów wody <span className="fg-accent">za płotem</span>
            </>
          }
          lead="Osiedle leży bezpośrednio przy Zalewie Mrożyczka: trzydzieści hektarów wody z piaszczystą plażą, molo i strzeżonym kąpieliskiem, w otoczeniu ponad 100-letniego lasu. Obok działa Central Wake Park, a ścieżki rowerowe zaczynają się przy osiedlu."
          className="max-w-2xl"
        />

        <ul className="bd mt-8 grid grid-cols-2 gap-x-6 border-t sm:grid-cols-4 lg:mt-10" data-reveal>
          {DOJAZD.map((d) => (
            <li key={d.name} className="bd border-b py-4">
              <span className="t-display-m num block leading-none">{d.value}</span>
              <span className="mt-2 block font-medium">{d.name}</span>
              <span className="t-meta-sm fg-muted mt-1 block">{d.note}</span>
            </li>
          ))}
        </ul>

        {/* Plan poglądowy dewelopera z klikalnymi punktami: jednym obrazem tłumaczy,
            co gdzie leży wokół zalewu. Zdjęcie satelitarne, lista atrakcji i dojazd
            w szczegółach są na podstronie /lokalizacja. */}
        <div className="mt-12 sm:mt-16">
          <PlanOkolicy />
        </div>

        <Link href="/lokalizacja" className="link-underline t-meta fg-accent mt-10 inline-flex items-center gap-2">
          Lokalizacja i dojazd <Icon.arrow width={15} height={15} />
        </Link>
      </div>
    </section>
  );
}
