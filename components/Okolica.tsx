import Image from "next/image";
import Link from "next/link";
import { DOJAZD, POI, SITE } from "@/lib/data/site";
import SectionHeader from "./SectionHeader";
import MapLibreMap from "./MapLibreMap";
import WaveEdge from "./WaveEdge";
import { Icon } from "./Icons";

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${SITE.geo.lat},${SITE.geo.lng}`;

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
          lead="Osiedle leży bezpośrednio przy Zalewie Mrożyczka, w otoczeniu ponad 100-letniego lasu. Plaża, przystań, Central Wake Park i ścieżki rowerowe są w zasięgu spaceru."
          className="max-w-2xl"
        />

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14" data-reveal>
          <div className="t-body fg-muted space-y-4 text-pretty">
            <p>
              Zalew Mrożyczka to ponad trzydzieści hektarów wody z piaszczystą plażą, molo i strzeżonym
              kąpieliskiem. Latem to naturalne miejsce wypoczynku dla całego Głowna, a poza sezonem sceneria
              spacerów i biegania wokół zbiornika. Tuż obok działa Central Wake Park, jedno z najważniejszych
              miejsc na wakeboardowej mapie Polski.
            </p>
            <p>
              Osiedle otacza ponad 100-letni sosnowy las, a sieć ścieżek rowerowych łączy je z brzegiem zalewu
              i okolicznymi atrakcjami. W pobliżu leży też unikalny w skali kraju zespół wydm śródlądowych.
              Codzienne zaplecze - szkoły, przedszkola, przychodnie, sklepy i restauracje - zostaje w Głownie,
              w krótkim dystansie od osiedla.
            </p>
          </div>

          <ul className="bd grid grid-cols-2 gap-x-6 border-t sm:grid-cols-4 lg:grid-cols-2">
            {DOJAZD.map((d) => (
              <li key={d.name} className="bd border-b py-4">
                <span className="t-display-m num block leading-none">{d.value}</span>
                <span className="mt-2 block font-medium">{d.name}</span>
                <span className="t-meta-sm fg-muted mt-1 block normal-case">{d.note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mapa poglądowa dewelopera: jednym obrazem tłumaczy, co gdzie leży wokół
            zalewu. Zdjęcie satelitarne niżej pokazuje ten sam teren naprawdę. */}
        <figure className="bd mt-12 overflow-hidden border bg-sand-200 sm:mt-16" data-reveal>
          <div className="relative aspect-4/3 w-full sm:aspect-3/2 lg:aspect-video">
            <Image
              src="/map/okolica-3d.webp"
              alt="Plan okolicy: Zalew Mrożyczka, plaża i molo, przystań, Central Wake Park, park linowy, wydmy i położenie osiedla Plażowa Park"
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
          <figcaption className="t-meta-sm fg-muted border-t border-(--band-line) px-4 py-3 normal-case">
            Plan poglądowy okolicy Zalewu Mrożyczka
          </figcaption>
        </figure>

        <div className="bd mt-6 h-80 overflow-hidden border sm:h-115" data-reveal>
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

        <Link href="/lokalizacja" className="link-underline t-meta fg-accent mt-10 inline-flex items-center gap-2">
          Lokalizacja i dojazd <Icon.arrow width={15} height={15} />
        </Link>
      </div>
    </section>
  );
}
