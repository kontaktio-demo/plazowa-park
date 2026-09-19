import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UNITS } from "@/lib/data/units";
import { unitSlug, unitBySlug } from "@/lib/slug";
import { pln, plnShort, area, rooms, STATUS_META, odmien } from "@/lib/format";
import { ctaPytanie, lokaleSlowo, schemaAvailability, unitMetaDescription } from "@/lib/unitCopy";
import { ODMIANA, unitKind, unitLabel, unitFloors, unitPlace, garageArea, livingArea } from "@/lib/unitType";
import { SITE } from "@/lib/data/site";
import { PLAN } from "@/lib/data/plan";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import TrackUnitView from "@/components/TrackUnitView";
import PlanLokalu from "@/components/estate/PlanLokalu";
import ZoomShots from "@/components/ZoomShots";
import { Icon } from "@/components/Icons";

export function generateStaticParams() {
  return UNITS.map((u) => ({ slug: unitSlug(u.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const u = unitBySlug(slug);
  if (!u) return { title: "Nie znaleziono mieszkania ani domu" };
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
  // Render jest wspólny dla wszystkich lokali, a ogrody różnią się trzykrotnie,
  // więc podpis nie może sugerować, że to ogród akurat tego mieszkania albo domu.
  {
    src: "/renders/zycie.webp",
    alt: "Wizualizacja poglądowa: rodzina w prywatnym ogrodzie przy strefie wypoczynku",
    caption: "Ogród i strefa wypoczynku - wizualizacja poglądowa",
  },
  {
    src: PLAN.src,
    alt: "Plan osiedla Plażowa Park z numerami budynków, lokali i ogródków oraz metrażami ogródków",
    caption: "Plan zagospodarowania osiedla",
    fit: "contain" as const,
  },
];

const wielkaLitera = (t: string) => `${t[0].toUpperCase()}${t.slice(1)}`;

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
  const budynek = unitPlace(u).house;
  const wBudynku = UNITS.filter((x) => unitPlace(x).house === budynek);
  const wolne = wBudynku.filter((x) => x.status === "available");
  const wolneWBudynku = wolne.length;
  // Podpowiadamy wyłącznie to, co realnie można kupić, i sortujemy po różnicy ceny,
  // a nie po kolejności w danych dewelopera: wcześniej pierwsze z brzegu bywały
  // lokale sprzedane.
  const rel = UNITS.filter((x) => x.id !== u.id && x.status === "available")
    .sort((a, b) => Math.abs(a.price - u.price) - Math.abs(b.price - u.price))
    .slice(0, 3);
  const pomieszczenia = floors.flatMap((f) => f.pomieszczenia);
  const nazwanePokoje = pomieszczenia.filter((p) => /^(salon|sypialnia|pokój)/.test(p.nazwa)).length;
  const doAdaptacji = pomieszczenia.filter((p) => p.nazwa === "pralnia" || p.nazwa === "garderoba");
  const sumaRzutu = Math.round(floors.reduce((a, f) => a + f.suma, 0) * 100) / 100;
  // Przy sprzedanym lokalu formularz dostaje rodzaj, nie numer: pytanie dotyczy
  // podobnej nieruchomości, a nie tej jednej.
  const inquireHref = `/?lokal=${encodeURIComponent(u.status === "sold" ? o.mianownik[0].toUpperCase() + o.mianownik.slice(1) : label)}#kontakt`;

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
          numberOfRooms: u.rooms,
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
                {s.label} · budynek {budynek}
              </p>
              <h1 className="t-display-l mt-5">{label}</h1>
              <p className="t-label fg-muted mt-6">Cena</p>
              <div className="t-display-m num mt-1">{pln(u.price)}</div>
              <div className="t-meta-sm fg-muted num mt-2">{plnShort(u.pricePerM)}/m²</div>

              <PlanLokalu unit={u} className="mt-8 max-w-sm" />

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


              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  href={inquireHref}
                  data-track="book_viewing"
                  data-miejsce="strona-lokalu"
                  data-lokal={u.name}
                  className="btn btn-sun flex-1"
                >
                  {ctaPytanie(u)} <Icon.arrow width={18} height={18} />
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
              <p className="card t-body fg-muted mt-7 p-4 text-sm">
                W budynku <strong className="fg font-medium">{budynek}</strong>: {wBudynku.length}{" "}
                {lokaleSlowo(kind, wBudynku.length)}, w tym {wolneWBudynku}{" "}
                {odmien(wolneWBudynku, [kind === "dom" ? "dostępny" : "dostępne", "dostępne", "dostępnych"])}
                {wolne.length > 0 && <>, od {plnShort(Math.min(...wolne.map((x) => x.price)))}</>}.
              </p>
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
                  {nazwanePokoje < u.rooms && doAdaptacji.length > 0 && (
                    <div>
                      <dt className="t-label">Liczba pokoi</dt>
                      <dd className="t-body fg-muted mt-1.5 text-pretty">
                        Do liczby pokoi deweloper wlicza także pomieszczenia opisane na rzucie jako{" "}
                        {doAdaptacji.map((p) => p.nazwa).join(" i ")}; ich metraż jest zbliżony do sypialni. Nazwy z
                        rzutu nie przesądzają o sposobie użytkowania.
                      </dd>
                    </div>
                  )}
                  {sumaRzutu !== u.area && (
                    <div>
                      <dt className="t-label">Powierzchnia na rzucie</dt>
                      <dd className="t-body fg-muted mt-1.5 text-pretty">
                        Pomieszczenia z rzutu sumują się do <span className="num">{area(sumaRzutu)}</span> i różnią się
                        o <span className="num">{area(Math.abs(sumaRzutu - u.area))}</span> od metrażu w cenniku
                        dewelopera. Wiążącą powierzchnię potwierdza biuro sprzedaży.
                      </dd>
                    </div>
                  )}
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

              {u.planUrl ? (
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
              ) : (
                <p className="t-meta fg-muted mt-8">Rzut {o.dopelniacz} w PDF wydaje biuro sprzedaży.</p>
              )}
            </section>
          )}

          <p className="t-body fg-muted bd mt-16 border-t pt-12 text-pretty">
            Osiedle leży przy {SITE.address.street} w {SITE.address.city}.{" "}
            <Link href="/lokalizacja" className="link-underline fg-accent">
              Zobacz lokalizację i dojazd
            </Link>
            .
          </p>

          <div className="bd mt-16 border-t pt-12">
            <h2 className="t-display-m">Zobacz też</h2>
            {u.status !== "available" && (
              <p className="t-body fg-muted mt-4 text-pretty">
                {wielkaLitera(o.wskazujacy)} jest niedostępn{kind === "dom" ? "y" : "e"}. Zobacz dostępne w podobnej cenie:
              </p>
            )}
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
