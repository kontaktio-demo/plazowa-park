import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UNITS, BUILDINGS } from "@/lib/data/units";
import { unitSlug, unitBySlug } from "@/lib/slug";
import { pln, plnShort, area, rooms, STATUS_META } from "@/lib/format";
import { schemaAvailability, unitDescription, unitMetaDescription } from "@/lib/unitCopy";
import { planImage, unitPlace } from "@/lib/unitType";
import { SITE } from "@/lib/data/site";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import TrackUnitView from "@/components/TrackUnitView";
import UnitPosition from "@/components/estate/UnitPosition";
import { Icon } from "@/components/Icons";

export function generateStaticParams() {
  return UNITS.map((u) => ({ slug: unitSlug(u.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const u = unitBySlug(slug);
  if (!u) return { title: "Lokal nie znaleziony" };
  const desc = unitMetaDescription(u);
  const ogTitle = `Mieszkanie ${u.name} - Plażowa Park Głowno`;
  return {
    title: `Mieszkanie ${u.name} - ${area(u.area)} z ogrodem i tarasem`,
    description: desc,
    alternates: { canonical: `/mieszkania-i-domy/${slug}` },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      url: `${SITE.url}/mieszkania-i-domy/${slug}`,
      siteName: "Plażowa Park",
      title: ogTitle,
      description: desc,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `Mieszkanie ${u.name} - Plażowa Park w Głownie` }],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description: desc, images: ["/og.jpg"] },
  };
}

const galleryImgs = [
  { src: "/renders/tour-poster.webp", alt: "Budynek osiedla Plażowa Park o zmierzchu w sosnowym lesie" },
  { src: "/renders/zycie.webp", alt: "Taras i prywatny ogród apartamentu Plażowa Park" },
  { src: "/map/estate-frame.webp", alt: "Plan osiedla Plażowa Park z lotu ptaka" },
];

export default async function UnitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const u = unitBySlug(slug);
  if (!u) notFound();

  const s = STATUS_META[u.status];
  const place = unitPlace(u);
  const building = BUILDINGS.find((b) => b.stageId === u.stageId);
  const sameBuilding = UNITS.filter((x) => x.stageId === u.stageId && x.id !== u.id);
  const others = UNITS.filter((x) => x.stageId !== u.stageId && x.id !== u.id);
  const rel = [...sameBuilding, ...others].slice(0, 3);
  const inquireHref = `/?lokal=${encodeURIComponent(`Apartament ${u.name}`)}#kontakt`;
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
        name: `Apartament ${u.name} - Plażowa Park Głowno`,
        url: unitUrl,
        description: metaDesc,
        image: `${SITE.url}/og.jpg`,
        datePosted: "2026-01-01",
        mainEntity: {
          "@type": "Apartment",
          name: `Apartament ${u.name}`,
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
          { "@type": "ListItem", position: 3, name: `Apartament ${u.name}`, item: unitUrl },
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
            <Link href="/" className="hover:text-lake-700">
              Strona główna
            </Link>
            <span aria-hidden>/</span>
            <Link href="/#mieszkania-i-domy" className="hover:text-lake-700">
              Mieszkania i domy
            </Link>
            <span aria-hidden>/</span>
            <span className="fg">Apartament {u.name}</span>
          </nav>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div>
              <div className="relative aspect-4/3 overflow-hidden bg-lake-900">
                <Image
                  src={planImage(u)}
                  alt={`Rzut poglądowy apartamentu ${u.name}, typ ${place.type}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain p-8"
                  priority
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {galleryImgs.map((g) => (
                  <div key={g.src} className="relative aspect-4/3 overflow-hidden">
                    <Image src={g.src} alt={g.alt} fill sizes="(max-width: 1024px) 33vw, 200px" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="t-meta-sm fg-muted flex items-center gap-2">
                <span className="status-dot" style={{ background: s.color }} />
                {s.label} · budynek {u.buildingLabel}
              </p>
              <h1 className="t-display-l mt-5">Apartament {u.name}</h1>
              <div className="t-display-m num mt-6">{pln(u.price)}</div>
              <div className="t-meta-sm fg-muted num mt-2">{plnShort(u.pricePerM)}/m²</div>

              <UnitPosition unit={u} className="mt-8 max-w-52" />

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
                {[
                  { l: "Powierzchnia", v: area(u.area) },
                  { l: "Ogród prywatny", v: area(u.garden) },
                  { l: "Liczba pokoi", v: rooms(u.rooms) },
                  { l: "Kondygnacje", v: String(u.floors) },
                ].map((sp) => (
                  <div key={sp.l} className="bd min-w-0 border-t pt-3">
                    <dt className="t-meta-sm fg-muted">{sp.l}</dt>
                    <dd className="mt-1.5 font-medium">{sp.v}</dd>
                  </div>
                ))}
              </dl>

              <p className="t-body fg-muted mt-8 text-pretty">{paras[0]}</p>

              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
                <Link href={inquireHref} data-track="book_viewing" className="btn btn-sun flex-1">
                  Zapytaj o ten apartament <Icon.arrow width={18} height={18} />
                </Link>
                <a href={`tel:${SITE.phone.tel}`} className="btn btn-ghost">
                  <Icon.phone width={16} height={16} /> {SITE.phone.display}
                </a>
              </div>
              {u.planUrl && (
                <a
                  href={u.planUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline t-meta fg-accent mt-5 inline-flex items-center gap-2"
                >
                  Pobierz rzut lokalu (PDF) <Icon.arrow width={15} height={15} />
                </a>
              )}
              {building && (
                <p className="card t-body fg-muted mt-7 p-4 text-sm">
                  W budynku <strong className="fg font-medium">{u.buildingLabel}</strong>: {building.count} lokali,
                  dostępnych {building.available}, od {plnShort(building.priceFrom)}.
                </p>
              )}
            </div>
          </div>

          <section className="bd mt-16 border-t pt-12">
            <h2 className="t-display-m">O apartamencie {u.name}</h2>
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
                  <span className="t-title block">Apartament {r.name}</span>
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
