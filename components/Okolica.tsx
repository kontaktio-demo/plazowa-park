import Link from "next/link";
import { POI, SITE } from "@/lib/data/site";
import SectionHeader from "./SectionHeader";
import MapLibreMap from "./MapLibreMap";
import WaveEdge from "./WaveEdge";
import { Icon } from "./Icons";

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${SITE.geo.lat},${SITE.geo.lng}`;

export default function Okolica() {
  return (
    <section id="okolica" className="band band-sand sec relative">
      <WaveEdge from="var(--color-deep)" />

      <div className="wrap">
        <SectionHeader
          id="okolica"
          title={
            <>
              Trzydzieści hektarów wody <span className="fg-accent">za płotem</span>
            </>
          }
          lead="Osiedle leży bezpośrednio przy Zalewie Mrożyczka, w otoczeniu ponad 100-letniego lasu. Plaża, przystań, Central Wake Park i ścieżki rowerowe są w zasięgu spaceru."
          className="max-w-2xl"
        >
          <Link href="/lokalizacja" className="link-underline t-meta fg-accent mt-7 inline-flex items-center gap-2">
            Lokalizacja i dojazd <Icon.arrow width={15} height={15} />
          </Link>
        </SectionHeader>

        {/* prawdziwe zdjęcie satelitarne zamiast rysowanego planu: zalew, las
            i położenie osiedla widać takie, jakie są */}
        <div className="bd mt-10 h-[340px] overflow-hidden border sm:mt-14 sm:h-[520px]" data-reveal>
          <MapLibreMap zoom={14} />
        </div>
        <div className="t-meta-sm fg-muted mt-4 flex flex-wrap items-center justify-between gap-3">
          <span>
            {SITE.address.street}, {SITE.address.postal} {SITE.address.city}
          </span>
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline fg-accent inline-flex items-center gap-1.5"
          >
            Otwórz w Google Maps <Icon.arrow width={13} height={13} />
          </a>
        </div>

        <ul className="bd mt-12 grid border-t sm:mt-16 lg:grid-cols-2 lg:gap-x-16" data-reveal>
          {POI.map((p) => (
            <li key={p.name} className="bd flex items-baseline justify-between gap-5 border-b py-4 sm:py-5">
              <div className="min-w-0">
                <h3 className="font-medium">{p.name}</h3>
                <p className="t-body fg-muted mt-1 text-pretty">{p.desc}</p>
              </div>
              <span className="t-meta-sm fg-accent flex-none">{p.dist}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
