import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { POI, SITE } from "@/lib/data/site";
import { INVESTMENT } from "@/lib/data/units";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import MapLibreMap from "@/components/MapLibreMap";
import { Icon } from "@/components/Icons";

const description =
  "Plażowa Park leży nad Zalewem Mrożyczka w Głownie: plaża, sosnowy las i Central Wake Park. Do Łodzi 30 minut autostradą A1 i koleją ŁKA. Zobacz okolicę i mapę.";

export const metadata: Metadata = {
  title: "Lokalizacja nad Zalewem Mrożyczka w Głownie",
  description,
  alternates: { canonical: "/lokalizacja" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: `${SITE.url}/lokalizacja`,
    siteName: "Plażowa Park",
    title: "Lokalizacja Plażowa Park - nad Zalewem Mrożyczka w Głownie",
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Lokalizacja Plażowa Park nad Zalewem Mrożyczka w Głownie" }],
  },
  twitter: { card: "summary_large_image", title: "Lokalizacja Plażowa Park - Głowno", description, images: ["/og.jpg"] },
};

const catColor: Record<string, string> = {
  natura: "var(--color-available)",
  sport: "var(--color-lake)",
  usługi: "var(--color-muted)",
};

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${SITE.geo.lat},${SITE.geo.lng}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Place",
      name: "Plażowa Park - lokalizacja nad Zalewem Mrożyczka",
      description,
      url: `${SITE.url}/lokalizacja`,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.city,
        postalCode: SITE.address.postal,
        addressRegion: SITE.address.region,
        addressCountry: "PL",
      },
      geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
      hasMap: mapsHref,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Lokalizacja", item: `${SITE.url}/lokalizacja` },
      ],
    },
  ],
};

export default function LokalizacjaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader />
      <main className="bg-paper">
        <div className="container-x py-8 sm:py-12">
          <nav className="flex items-center gap-2 text-sm text-muted" aria-label="breadcrumb">
            <Link href="/" className="hover:text-pine">Strona główna</Link>
            <span>/</span>
            <span className="text-ink">Lokalizacja</span>
          </nav>

          <header className="mt-8 max-w-3xl">
            <p className="eyebrow">Lokalizacja</p>
            <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-tight text-pine">
              Lokalizacja Plażowa Park - nad Zalewem Mrożyczka w Głownie
            </h1>
            <div className="mt-6 space-y-4 text-pretty leading-relaxed text-muted">
              <p>
                Plażowa Park powstaje w Głownie, bezpośrednio w sąsiedztwie Zalewu Mrożyczka - ponad
                30-hektarowego zbiornika z piaszczystą plażą, molo i strzeżonym kąpieliskiem. Tuż obok działa
                Central Wake Park, jeden z największych wyciągów do wakeboardingu w Polsce. Osiedle otacza
                sosnowy las, a woda i zieleń są na wyciągnięcie ręki przez cały rok.
              </p>
              <p>
                To lokalizacja, która łączy spokój i rekreację z wygodnym dojazdem do aglomeracji łódzkiej.
                Do centrum Łodzi dojedziesz w około 30 minut - samochodem przez węzeł autostrady A1 w Strykowie
                lub pociągiem Łódzkiej Kolei Aglomeracyjnej ze stacji Głowno. Do Warszawy trasa zajmuje około
                godziny.
              </p>
              <p>
                Plażowa Park to propozycja zarówno na całoroczne mieszkanie blisko natury, jak i na apartament
                rekreacyjny nad wodą w zasięgu Łodzi.
              </p>
            </div>
          </header>

          <figure className="mt-10 overflow-hidden rounded-[16px] border border-ink/10 bg-[#eef0ee]">
            <Image
              src="/map/mapka-3D.webp"
              alt="Plan okolicy Plażowa Park w Głownie: Zalew Mrożyczka, Central Wake Park, przystań, plaża i molo"
              width={2400}
              height={1792}
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="h-auto w-full"
            />
          </figure>

          {/* thematic subsections (local long-tail) */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <section>
              <h2 className="font-display text-xl text-pine">Nad Zalewem Mrożyczka</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Piaszczysta plaża, strzeżone kąpielisko i przystań są w zasięgu spaceru od osiedla. Latem to
                miejsce wypoczynku nad wodą, a przez cały rok - spacerów i sportów wodnych.
              </p>
            </section>
            <section>
              <h2 className="font-display text-xl text-pine">Las i rekreacja</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Ponad 100-letni sosnowy las otacza inwestycję, dając cień, ciszę i czyste powietrze. Ścieżki
                rowerowe wokół zalewu i w lesie zachęcają do aktywności tuż za progiem.
              </p>
            </section>
            <section>
              <h2 className="font-display text-xl text-pine">Dojazd do Łodzi i Warszawy</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Około 30 minut do centrum Łodzi - autostradą A1 przez węzeł Stryków lub koleją aglomeracyjną
                ŁKA ze stacji Głowno. Do Warszawy dojedziesz w około godzinę.
              </p>
            </section>
          </div>

          {/* POI list */}
          <div className="mt-12">
            <h2 className="font-display text-2xl text-pine">Co znajdziesz w okolicy</h2>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {POI.map((p) => (
                <li key={p.name} className="flex items-start gap-3 rounded-[12px] border border-ink/8 bg-paper-2 p-3.5">
                  <span
                    className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full"
                    style={{ background: `color-mix(in srgb, ${catColor[p.cat] || "var(--color-muted)"} 15%, transparent)`, color: catColor[p.cat] || "var(--color-muted)" }}
                  >
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

          {/* interactive map */}
          <div className="mt-10 grid gap-3">
            <div className="h-[380px]">
              <MapLibreMap />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-faint">
              <span>{SITE.address.street}, {SITE.address.postal} {SITE.address.city} ({SITE.address.region})</span>
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-brass-deep hover:text-pine">
                Zobacz w Google Maps <Icon.arrow width={14} height={14} />
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-14 flex flex-col gap-3 rounded-[16px] border border-ink/10 bg-paper-2 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-pretty leading-relaxed text-ink-soft">
              W tej lokalizacji powstaje {INVESTMENT.totalUnits} apartamentów z prywatnym ogrodem, od {" "}
              <span className="num">{INVESTMENT.priceMin.toLocaleString("pl-PL")}</span> zł.
            </p>
            <div className="flex flex-none flex-col gap-2.5 sm:flex-row">
              <Link href="/#lokale" data-track="book_viewing" className="btn btn-primary">
                Zobacz apartamenty <Icon.arrow width={18} height={18} />
              </Link>
              <Link href="/#kontakt" data-track="book_viewing" className="btn btn-ghost">Umów prezentację</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
