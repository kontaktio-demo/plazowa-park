import type { Metadata } from "next";
import Link from "next/link";
import { POI, SITE } from "@/lib/data/site";
import { INVESTMENT } from "@/lib/data/units";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import MapLibreMap from "@/components/MapLibreMap";
import { Icon } from "@/components/Icons";

const description =
  "Plażowa Park leży nad Zalewem Mrożyczka w Głownie: plaża, sosnowy las i Central Wake Park. Do centrum Łodzi około 32 km autostradą A1. Zobacz okolicę i mapę.";

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

const topics = [
  {
    h: "Nad Zalewem Mrożyczka",
    p: "Piaszczysta plaża, strzeżone kąpielisko i przystań są w zasięgu spaceru od osiedla. Latem to miejsce wypoczynku nad wodą, a przez cały rok spacerów i sportów wodnych.",
  },
  {
    h: "Las i rekreacja",
    p: "Ponad 100-letni sosnowy las otacza inwestycję, dając cień, ciszę i czyste powietrze. Ścieżki rowerowe wokół zalewu i w lesie zachęcają do aktywności tuż za progiem.",
  },
  {
    h: "Dojazd do Łodzi i Warszawy",
    p: "Do centrum Łodzi około 32 km, autostradą A1 przez węzeł Stryków oddalony o 11 km. Stacja kolejowa Głowno jest 3 km od osiedla. Do Warszawy około 104 km.",
  },
];

export default function LokalizacjaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader />
      <main className="band band-sand">
        <div className="wrap py-10 sm:py-14">
          <nav className="t-meta-sm fg-muted flex items-center gap-2" aria-label="breadcrumb">
            <Link href="/" className="hover:text-lake-700">
              Strona główna
            </Link>
            <span aria-hidden>/</span>
            <span className="fg">Lokalizacja</span>
          </nav>

          <header className="mt-10 max-w-3xl">
            <p className="eyebrow">Lokalizacja</p>
            <h1 className="t-display-l mt-6 text-balance">
              Lokalizacja Plażowa Park nad <span className="fg-accent">Zalewem Mrożyczka</span> w Głownie
            </h1>
            <div className="t-body-l fg-muted mt-7 space-y-4 text-pretty">
              <p>
                Plażowa Park powstaje w Głownie, bezpośrednio w sąsiedztwie Zalewu Mrożyczka, ponad
                30-hektarowego zbiornika z piaszczystą plażą, molo i strzeżonym kąpieliskiem. Tuż obok działa
                Central Wake Park, jeden z największych wyciągów do wakeboardingu w Polsce. Osiedle otacza
                sosnowy las, a woda i zieleń są na wyciągnięcie ręki przez cały rok.
              </p>
              <p>
                To lokalizacja, która łączy spokój i rekreację z wygodnym dojazdem do aglomeracji łódzkiej.
                Do centrum Łodzi jest około 32 km, a węzeł autostrady A1 w Strykowie leży 11 km od osiedla.
                Stacja kolejowa Głowno znajduje się 3 km dalej. Do Warszawy około 104 km.
              </p>
              <p>
                Plażowa Park to propozycja zarówno na całoroczne mieszkanie blisko natury, jak i na dom
                rekreacyjny nad wodą w zasięgu Łodzi.
              </p>
            </div>
          </header>
        </div>

        <div className="bd mt-4 h-[320px] overflow-hidden border sm:h-[520px]">
          <MapLibreMap zoom={14} />
        </div>

        <div className="wrap py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((t) => (
              <section key={t.h}>
                <h2 className="t-title">{t.h}</h2>
                <p className="t-body fg-muted mt-3 text-pretty">{t.p}</p>
              </section>
            ))}
          </div>

          <section className="mt-16 max-w-3xl">
            <h2 className="t-display-m">Dlaczego warto zamieszkać nad Zalewem Mrożyczka</h2>
            <div className="t-body fg-muted mt-6 space-y-4 text-pretty">
              <p>
                Głowno to spokojne miasto w powiecie zgierskim, w województwie łódzkim, które łączy kameralny
                charakter z pełnym zapleczem na co dzień: szkoły, przedszkola, przychodnie, sklepy i restauracje
                są w codziennym zasięgu. Dla rodzin oznacza to komfort życia z dala od wielkomiejskiego zgiełku,
                bez rezygnacji z wygód i dobrej komunikacji.
              </p>
              <p>
                Zalew Mrożyczka to ponad 30 hektarów wody z piaszczystą plażą, molo i strzeżonym kąpieliskiem,
                latem naturalne miejsce wypoczynku, a poza sezonem sceneria spacerów i joggingu wokół sosnowego
                lasu. Działający tuż obok Central Wake Park przyciąga miłośników wakeboardingu z całego regionu,
                a sieć ścieżek rowerowych łączy osiedle z okolicznymi atrakcjami i brzegiem zbiornika.
              </p>
              <p>
                Bliskość Łodzi, około 32 km autostradą A1 przez oddalony o 11 km węzeł Stryków, sprawia, że
                Plażowa Park to atrakcyjny adres nie tylko na całoroczne mieszkanie, ale też na dom
                rekreacyjny czy drugi dom nad wodą w zasięgu aglomeracji łódzkiej. Do Warszawy około 104 km.
              </p>
            </div>
          </section>

          <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="t-display-m">Co znajdziesz w okolicy</h2>
              <ul className="bd mt-8 border-t">
                {POI.map((p) => (
                  <li key={p.name} className="bd flex items-baseline justify-between gap-6 border-b py-5">
                    <div className="min-w-0">
                      <h3 className="font-medium">{p.name}</h3>
                      <p className="t-body fg-muted mt-1 text-pretty">{p.desc}</p>
                    </div>
                    <span className="t-meta-sm fg-accent flex-none">{p.dist}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:pt-20">
              <div className="bd h-[380px] overflow-hidden border sm:h-[460px]">
                <MapLibreMap zoom={16} />
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
                  Google Maps <Icon.arrow width={13} height={13} />
                </a>
              </div>
            </div>
          </div>

          <div className="card mt-16 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <p className="t-body-l fg-muted max-w-md text-pretty">
              W tej lokalizacji powstaje {INVESTMENT.totalUnits} domów z prywatnym ogrodem, od{" "}
              <span className="num fg font-medium">{INVESTMENT.priceMin.toLocaleString("pl-PL")} zł</span>.
            </p>
            <div className="flex flex-none flex-col gap-2.5 sm:flex-row">
              <Link href="/#mieszkania-i-domy" data-track="book_viewing" className="btn btn-sun">
                Zobacz mieszkania i domy <Icon.arrow width={18} height={18} />
              </Link>
              <Link href="/#kontakt" data-track="book_viewing" className="btn btn-ghost">
                Umów prezentację
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
