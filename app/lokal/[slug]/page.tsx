import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UNITS, BUILDINGS } from "@/lib/data/units";
import { unitSlug, unitBySlug } from "@/lib/slug";
import { pln, plnShort, area, rooms, STATUS_META } from "@/lib/format";
import { SITE } from "@/lib/data/site";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import { Icon } from "@/components/Icons";

export function generateStaticParams() {
  return UNITS.map((u) => ({ slug: unitSlug(u.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const u = unitBySlug(slug);
  if (!u) return { title: "Lokal nie znaleziony" };
  const desc = `${area(u.area)}, ${rooms(u.rooms)}, prywatny ogród ${area(u.garden)} i taras. ${STATUS_META[u.status].label}. Cena ${plnShort(u.price)}. Osiedle Plażowa Park w Głownie, nad Zalewem Mrożyczka.`;
  return {
    title: `Apartament ${u.name} - ${area(u.area)} z ogrodem`,
    description: desc,
    alternates: { canonical: `/lokal/${slug}` },
    openGraph: { title: `Apartament ${u.name} - Plażowa Park Głowno`, description: desc, images: ["/og.jpg"] },
  };
}

const galleryImgs = [
  { src: "/interiors/living.webp", alt: "Salon apartamentu" },
  { src: "/interiors/kitchen.webp", alt: "Kuchnia apartamentu" },
  { src: "/interiors/bedroom.webp", alt: "Sypialnia apartamentu" },
  { src: "/interiors/bathroom.webp", alt: "Łazienka apartamentu" },
];

export default async function UnitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const u = unitBySlug(slug);
  if (!u) notFound();

  const s = STATUS_META[u.status];
  const building = BUILDINGS.find((b) => b.stageId === u.stageId);
  const sameBuilding = UNITS.filter((x) => x.stageId === u.stageId && x.id !== u.id);
  const others = UNITS.filter((x) => x.stageId !== u.stageId && x.id !== u.id);
  const rel = [...sameBuilding, ...others].slice(0, 3);
  const inquireHref = `/?lokal=${encodeURIComponent(`Apartament ${u.name}`)}#kontakt`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name: `Apartament ${u.name} - Plażowa Park`,
    url: `${SITE.url}/lokal/${slug}`,
    numberOfRoomsTotal: u.rooms,
    floorSize: { "@type": "QuantitativeValue", value: u.area, unitCode: "MTK" },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      postalCode: SITE.address.postal,
      addressRegion: SITE.address.region,
      addressCountry: "PL",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "PLN",
      price: u.price,
      availability: u.status === "available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      seller: { "@id": `${SITE.url}/#developer` },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader />
      <main className="bg-paper">
        <div className="container-x py-8 sm:py-12">
          <nav className="flex items-center gap-2 text-sm text-muted" aria-label="breadcrumb">
            <Link href="/" className="hover:text-pine">Strona główna</Link>
            <span>/</span>
            <Link href="/#lokale" className="hover:text-pine">Wybierz dom</Link>
            <span>/</span>
            <span className="text-ink">Apartament {u.name}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* left: visual */}
            <div>
              <div className="relative overflow-hidden rounded-[16px] border border-ink/10 bg-sand">
                {u.viewThumb && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/unit-views/${u.viewThumb}`} alt={`Rzut i położenie apartamentu ${u.name} w budynku ${u.buildingLabel}`} className="aspect-[4/3] w-full object-contain p-8" />
                )}
                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold text-ink-soft">
                  <span className="status-dot" style={{ background: s.color }} /> {s.label}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-3">
                {galleryImgs.map((g) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={g.src} src={g.src} alt={`${g.alt} - Plażowa Park`} className="aspect-square w-full rounded-[10px] object-cover" loading="lazy" />
                ))}
              </div>
              <p className="mt-3 text-xs text-faint">Wizualizacje wnętrz poglądowe. Rzut lokalu wg konfiguratora dewelopera.</p>
            </div>

            {/* right: details */}
            <div>
              <p className="eyebrow">Budynek {u.buildingLabel}</p>
              <h1 className="mt-4 font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-none text-pine">Apartament {u.name}</h1>
              <div className="mt-5 font-display text-4xl text-ink num">{pln(u.price)}</div>
              <div className="mt-1 text-sm text-muted num">{plnShort(u.pricePerM)}/m²</div>

              <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
                {[
                  { l: "Powierzchnia", v: area(u.area), icon: "ruler" },
                  { l: "Ogród prywatny", v: area(u.garden), icon: "garden" },
                  { l: "Liczba pokoi", v: rooms(u.rooms), icon: "bed" },
                  { l: "Kondygnacje", v: `${u.floors}`, icon: "window" },
                ].map((sp) => (
                  <div key={sp.l} className="flex items-center gap-3 border-t border-ink/8 pt-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-pine/8 text-pine">
                      <Icon.check width={0} height={0} className="hidden" />
                      {sp.icon === "ruler" && <Icon.ruler width={18} height={18} />}
                      {sp.icon === "garden" && <Icon.garden width={18} height={18} />}
                      {sp.icon === "bed" && <Icon.bed width={18} height={18} />}
                      {sp.icon === "window" && <Icon.window width={18} height={18} />}
                    </span>
                    <span>
                      <span className="block text-[0.7rem] uppercase tracking-[0.1em] text-faint">{sp.l}</span>
                      <span className="font-medium text-ink num">{sp.v}</span>
                    </span>
                  </div>
                ))}
              </dl>

              <p className="mt-7 text-pretty leading-relaxed text-muted">
                Apartament {u.name} w budynku {u.buildingLabel} osiedla Plażowa Park w Głownie. Prywatny ogród i taras
                z panoramicznymi oknami, adaptowalne poddasze w cenie, dwa miejsca postojowe. Standard: pompa ciepła,
                ogrzewanie podłogowe i rekuperacja. Kilka kroków od Zalewu Mrożyczka i 100-letniego lasu.
              </p>

              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
                <Link href={inquireHref} className="btn btn-primary flex-1">Zapytaj o ten apartament <Icon.arrow width={18} height={18} /></Link>
                <a href={`tel:${SITE.phone.tel}`} className="btn btn-ghost"><Icon.phone width={16} height={16} /> {SITE.phone.display}</a>
              </div>
              {u.planUrl && (
                <a href={u.planUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm text-brass-deep hover:text-pine">
                  <Icon.arrow width={15} height={15} /> Pobierz rzut lokalu (PDF)
                </a>
              )}
              {building && (
                <p className="mt-6 rounded-[12px] border border-ink/10 bg-paper-2 p-4 text-sm text-muted">
                  W budynku <strong className="text-ink">{u.buildingLabel}</strong>: {building.count} lokali, dostępnych {building.available}, od {plnShort(building.priceFrom)}.
                </p>
              )}
            </div>
          </div>

          {/* related */}
          <div className="mt-16 border-t border-ink/10 pt-10">
            <h2 className="font-display text-2xl text-pine">Zobacz też</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {rel.map((r) => (
                <Link key={r.id} href={`/lokal/${unitSlug(r.name)}`} className="card group p-5 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-xl text-pine">Apartament {r.name}</span>
                    <span className="chip">{rooms(r.rooms)}</span>
                  </div>
                  <div className="mt-3 text-sm text-muted num">{area(r.area)} · ogród {area(r.garden)}</div>
                  <div className="mt-2 font-display text-xl text-ink num">{plnShort(r.price)}</div>
                </Link>
              ))}
            </div>
            <Link href="/#lokale" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-brass-deep hover:text-pine">
              <Icon.arrow width={16} height={16} className="rotate-180" /> Wróć do wszystkich lokali
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
