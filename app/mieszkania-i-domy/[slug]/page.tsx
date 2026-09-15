import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UNITS, BUILDINGS } from "@/lib/data/units";
import { unitSlug, unitBySlug } from "@/lib/slug";
import { pln, plnShort, area, rooms, STATUS_META, odmien } from "@/lib/format";
import { schemaAvailability, unitDescription, unitMetaDescription } from "@/lib/unitCopy";
import { ODMIANA, unitKind, unitLabel, unitFloors, garageArea, livingArea } from "@/lib/unitType";
import { SITE } from "@/lib/data/site";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import TrackUnitView from "@/components/TrackUnitView";
import UnitPosition from "@/components/estate/UnitPosition";
import ZoomShots from "@/components/ZoomShots";
import { Icon } from "@/components/Icons";

export function generateStaticParams() {
  return UNITS.map((u) => ({ slug: unitSlug(u.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const u = unitBySlug(slug);
  if (!u) return { title: "Lokal nie znaleziony" };
  const label = unitLabel(u);
  const desc = unitMetaDescription(u);
  const ogTitle = `${label} - Plażowa Park Głowno`;
  return {
    title: `${label} - ${area(u.area)} z prywatnym ogrodem`,
    description: desc,
    alternates: { canonical: `/mieszkania-i-domy/${slug}` },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      url: `${SITE.url}/mieszkania-i-domy/${slug}`,
      siteName: "Plażowa Park",
      title: ogTitle,
      description: desc,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${label} - Plażowa Park w Głownie` }],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description: desc, images: ["/og.jpg"] },
  };
}

const galleryImgs = [
  { src: "/renders/tour-poster.webp", alt: "Budynek osiedla Plażowa Park o zmierzchu w sosnowym lesie", caption: "Budynek o zmierzchu" },
  { src: "/renders/zycie.webp", alt: "Rodzina w prywatnym ogrodzie przy strefie wypoczynku", caption: "Ogród i strefa wypoczynku" },
  { src: "/dollhouse/f00.webp", alt: "Plan osiedla Plażowa Park z lotu ptaka", caption: "Plan osiedla" },
];

// Wykaz dewelopera jest pisany małymi literami, a "Wc" wyglądałoby na błąd.
const nazwaPomieszczenia = (n: string) => (n === "wc" ? "WC" : `${n[0].toUpperCase()}${n.slice(1)}`);

export default async function UnitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const u = unitBySlug(slug);
  if (!u) notFound();

  const s = STATUS_META[u.status];
  const kind = unitKind(u);
  const o = ODMIANA[kind];
  const label = unitLabel(u);
  const floors = unitFloors(u);
  const garage = garageArea(u);
  const building = BUILDINGS.find((b) => b.stageId === u.stageId);
  const sameBuilding = UNITS.filter((x) => x.stageId === u.stageId && x.id !== u.id);
  const others = UNITS.filter((x) => x.stageId !== u.stageId && x.id !== u.id);
  const rel = [...sameBuilding, ...others].slice(0, 3);
  const inquireHref = `/?lokal=${encodeURIComponent(label)}#kontakt`;
  const paras = unitDescription(u);

  const unitUrl = `${SITE.url}/mieszkania-i-domy/${slug}`;
  const metaDesc = unitMetaDescription(u);
  const address = {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    postalCode: SITE.address.postal,
    addressRegion: SITE.address.region,
    addressCountry: "PL",
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateListing",
        name: `${label} - Plażowa Park Głowno`,
        url: unitUrl,
        description: metaDesc,
        image: `${SITE.url}/og.jpg`,
        mainEntity: {
          "@type": kind === "dom" ? "SingleFamilyResidence" : "Apartment",
          name: label,
          numberOfRoomsTotal: u.rooms,
          floorSize: { "@type": "QuantitativeValue", value: u.area, unitCode: "MTK" },
          address,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "PLN",
          price: u.price,
          availability: schemaAvailability(u.status),
          url: unitUrl,
          seller: { "@id": `${SITE.url}/#developer` },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Strona główna", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "Mieszkania i domy", item: `${SITE.url}/#mieszkania-i-domy` },
          { "@type": "ListItem", position: 3, name: label, item: unitUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TrackUnitView unit={u.name} price={u.price} status={u.status} />
      <PageHeader />
      <main className="band band-sand">
        <div className="wrap py-10 sm:py-14">
          <nav className="t-meta-sm fg-muted flex flex-wrap items-center gap-2" aria-label="breadcrumb">
            <Link href="/" className="hover:text-clay-600">
              Strona główna
            </Link>
            <span aria-hidden>/</span>
            <Link href="/#mieszkania-i-domy" className="hover:text-clay-600">
              Mieszkania i domy
            </Link>
            <span aria-hidden>/</span>
            <span className="fg">{label}</span>
          </nav>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div>
              <ZoomShots priority shots={galleryImgs} />
            </div>

            <div>
              <p className="t-meta-sm fg-muted flex items-center gap-2">
                <span className="status-dot" style={{ background: s.color }} />
                {s.label} · budynek {u.buildingLabel}
              </p>
              <h1 className="t-display-l mt-5">{label}</h1>
              <p className="t-label fg-muted mt-6">Cena</p>
              <div className="t-display-m num mt-1">{pln(u.price)}</div>
              <div className="t-meta-sm fg-muted num mt-2">{plnShort(u.pricePerM)}/m²</div>

              <UnitPosition unit={u} className="mt-8 max-w-52" />

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
                {[
                  {
                    l: "Powierzchnia",
                    v: garage ? `${area(u.area)} (w tym garaż ${area(garage)})` : area(u.area),
                  },
                  ...(garage ? [{ l: "Powierzchnia mieszkalna", v: area(livingArea(u)) }] : []),
                  { l: "Ogród prywatny", v: area(u.garden) },
                  { l: "Liczba pokoi", v: rooms(u.rooms) },
                  {
                    l: "Kondygnacje",
                    v: floors.length
                      ? `${u.floors} (${floors.map((f) => f.nazwa.toLowerCase()).join(" i ")})`
                      : String(u.floors),
                  },
                ].map((sp) => (
                  <div key={sp.l} className="bd min-w-0 border-t pt-3">
                    <dt className="t-label fg-muted">{sp.l}</dt>
                    <dd className="mt-1.5 font-medium">{sp.v}</dd>
                  </div>
                ))}
              </dl>

              <p className="t-body fg-muted mt-8 text-pretty">{paras[0]}</p>

              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  href={inquireHref}
                  data-track="book_viewing"
                  data-miejsce="strona-lokalu"
                  data-lokal={u.name}
                  className="btn btn-sun flex-1"
                >
                  Zapytaj o {o.wskazujacy} <Icon.arrow width={18} height={18} />
                </Link>
                <a href={`tel:${SITE.phone.tel}`} className="btn btn-ghost">
                  <Icon.phone width={16} height={16} /> {SITE.phone.display}
                </a>
              </div>
              {floors.length > 0 && (
                <a href="#rzuty" className="link-underline t-meta fg-accent mt-5 inline-flex items-center gap-2">
                  Zobacz rzuty i wykaz pomieszczeń <Icon.arrowDown width={15} height={15} />
                </a>
              )}
              {building && (
                <p className="card t-body fg-muted mt-7 p-4 text-sm">
                  W budynku <strong className="fg font-medium">{u.buildingLabel}</strong>:{" "}
                  {building.count} {odmien(building.count, ["lokal", "lokale", "lokali"])}, w tym {building.available}{" "}
                  {odmien(building.available, ["dostępny", "dostępne", "dostępnych"])}, od {plnShort(building.priceFrom)}.
                </p>
              )}
            </div>
          </div>

          {floors.length > 0 && (
            <section id="rzuty" className="bd mt-16 border-t pt-12">
              <h2 className="t-display-m">
                Rzuty {o.dopelniacz} {u.name}
              </h2>
              <p className="t-body fg-muted mt-4 max-w-3xl text-pretty">
                Obie kondygnacje: widok izometryczny, który od razu pokazuje układ, oraz rysunek techniczny z wymiarami.
                Kliknij dowolny obraz, żeby go powiększyć.
              </p>

              <div className="mt-10 grid gap-12 lg:grid-cols-2">
                {floors.map((f) => (
                  <div key={f.nazwa}>
                    <h3 className="t-title mb-4">{f.nazwa}</h3>
                    <ZoomShots
                      shots={[
                        {
                          src: f.render,
                          alt: `${label}, ${f.nazwa.toLowerCase()}: widok izometryczny rzutu`,
                          caption: `${f.nazwa} - widok izometryczny`,
                          fit: "contain",
                        },
                        {
                          src: f.techniczny,
                          alt: `${label}, ${f.nazwa.toLowerCase()}: rysunek techniczny rzutu z wymiarami`,
                          caption: `${f.nazwa} - rysunek techniczny z wymiarami`,
                          fit: "contain",
                        },
                      ]}
                    />
                    <dl className="mt-6">
                      {f.pomieszczenia.map((p) => (
                        <div key={p.nazwa} className="bd flex items-baseline justify-between gap-4 border-t py-2.5">
                          <dt className="t-body min-w-0">{nazwaPomieszczenia(p.nazwa)}</dt>
                          <dd className="t-body fg-muted num flex-none">{area(p.m2)}</dd>
                        </div>
                      ))}
                      <div className="bd-strong flex items-baseline justify-between gap-4 border-t py-3">
                        <dt className="t-label">Razem {f.nazwa.toLowerCase()}</dt>
                        <dd className="t-label num flex-none">{area(f.suma)}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>

              <div className="card mt-12 p-5 sm:p-7">
                <h3 className="t-title">Co jeszcze warto wiedzieć</h3>
                <dl className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <dt className="t-label">Poddasze</dt>
                    <dd className="t-body fg-muted mt-1.5 text-pretty">
                      Jest w cenie {o.dopelniacz}, ale poza metrażem i deweloper nie rysuje go na rzutach. Metraż{" "}
                      <span className="num">{area(u.area)}</span> obejmuje parter i piętro.
                    </dd>
                  </div>
                  <div>
                    <dt className="t-label">Miejsca postojowe</dt>
                    <dd className="t-body fg-muted mt-1.5 text-pretty">
                      Do {o.dopelniacz} należą dwa miejsca postojowe.
                    </dd>
                  </div>
                  {garage > 0 && (
                    <div>
                      <dt className="t-label">Garaż</dt>
                      <dd className="t-body fg-muted mt-1.5 text-pretty">
                        Garaż <span className="num">{area(garage)}</span> jest w bryle {o.dopelniacz} i wlicza się do
                        metrażu. Bez niego powierzchnia mieszkalna to <span className="num">{area(livingArea(u))}</span>.
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {u.planUrl && (
                <a
                  href={u.planUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="pobranie_rzutu"
                  data-miejsce="strona-lokalu"
                  data-lokal={u.name}
                  className="link-underline t-meta fg-accent mt-8 inline-flex items-center gap-2"
                >
                  Pobierz rzut {o.dopelniacz} w PDF <Icon.arrow width={15} height={15} />
                </a>
              )}
            </section>
          )}

          <section className="bd mt-16 border-t pt-12">
            <h2 className="t-display-m">
              O {o.miejscownik} {u.name}
            </h2>
            <div className="t-body fg-muted mt-6 max-w-3xl space-y-4 text-pretty">
              {paras.slice(1).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <Link href="/lokalizacja" className="link-underline t-meta fg-accent mt-7 inline-flex items-center gap-2">
              Lokalizacja osiedla i dojazd <Icon.arrow width={15} height={15} />
            </Link>
          </section>

          <div className="bd mt-16 border-t pt-12">
            <h2 className="t-display-m">Zobacz też</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {rel.map((r) => (
                <Link key={r.id} href={`/mieszkania-i-domy/${unitSlug(r.name)}`} className="card card-hover p-5">
                  <span className="t-title block">{unitLabel(r)}</span>
                  <span className="t-meta-sm fg-muted num mt-3 block">
                    {area(r.area)} · ogród {area(r.garden)}
                  </span>
                  <span className="t-display-m num mt-3 block">{plnShort(r.price)}</span>
                </Link>
              ))}
            </div>
            <Link href="/#mieszkania-i-domy" className="link-underline t-meta fg-accent mt-8 inline-flex items-center gap-2">
              <Icon.arrow width={16} height={16} className="rotate-180" /> Wszystkie mieszkania i domy
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
