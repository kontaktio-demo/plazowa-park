import { SITE, DEVELOPER, OPERATOR, FAQ } from "@/lib/data/site";
import { INVESTMENT, UNITS } from "@/lib/data/units";

const availabilityUrl = (s: string) =>
  s === "available"
    ? "https://schema.org/InStock"
    : s === "reserved"
      ? "https://schema.org/PreOrder"
      : "https://schema.org/SoldOut";

const address = {
  "@type": "PostalAddress",
  streetAddress: SITE.address.street,
  addressLocality: SITE.address.city,
  postalCode: SITE.address.postal,
  addressRegion: SITE.address.region,
  addressCountry: "PL",
};
const geo = { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Graph({ nodes }: { nodes: any[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }),
      }}
    />
  );
}

/**
 * Tożsamość firmy i serwisu - jedyne węzły, które mają sens na każdej podstronie.
 * Reszta grafu siedzi na stronie głównej, bo FAQ i lista lokali muszą odpowiadać
 * treści widocznej na danej stronie; inaczej Google traktuje to jako naruszenie
 * wytycznych dla danych strukturalnych.
 */
export default function SiteJsonLd() {
  return (
    <Graph
      nodes={[
        {
          "@type": ["Organization", "RealEstateAgent"],
          "@id": `${SITE.url}/#developer`,
          name: DEVELOPER.name,
          url: SITE.url,
          logo: `${SITE.url}/brand/logo-orig.png`,
          image: `${SITE.url}/og.jpg`,
          telephone: SITE.phone.tel,
          email: SITE.email,
          taxID: DEVELOPER.nip,
          address: {
            "@type": "PostalAddress",
            streetAddress: DEVELOPER.street,
            addressLocality: DEVELOPER.city,
            postalCode: DEVELOPER.postal,
            addressCountry: "PL",
          },
          identifier: [
            { "@type": "PropertyValue", propertyID: "KRS", value: DEVELOPER.krs },
            { "@type": "PropertyValue", propertyID: "NIP", value: DEVELOPER.nip },
          ],
        },
        {
          "@type": "Organization",
          "@id": `${SITE.url}/#operator`,
          name: OPERATOR.name,
          url: SITE.url,
          taxID: OPERATOR.nip,
          address: {
            "@type": "PostalAddress",
            streetAddress: OPERATOR.street,
            addressLocality: OPERATOR.city,
            postalCode: OPERATOR.postal,
            addressCountry: "PL",
          },
          identifier: [
            { "@type": "PropertyValue", propertyID: "KRS", value: OPERATOR.krs },
            { "@type": "PropertyValue", propertyID: "NIP", value: OPERATOR.nip },
          ],
        },
        {
          "@type": "WebSite",
          "@id": `${SITE.url}/#website`,
          url: SITE.url,
          name: "Plażowa Park",
          inLanguage: "pl-PL",
          publisher: { "@id": `${SITE.url}/#operator` },
        },
        {
          "@type": "LocalBusiness",
          "@id": `${SITE.url}/#salesoffice`,
          name: "Biuro sprzedaży Plażowa Park",
          image: `${SITE.url}/og.jpg`,
          telephone: SITE.phone.tel,
          email: SITE.email,
          priceRange: `${INVESTMENT.priceMin}-${INVESTMENT.priceMax} PLN`,
          address,
          geo,
          parentOrganization: { "@id": `${SITE.url}/#developer` },
        },
      ]}
    />
  );
}

/** Graf strony głównej: osiedle, oferta zbiorcza, FAQ i lista lokali. */
export function HomeJsonLd() {
  return (
    <Graph
      nodes={[
        {
          "@type": "ApartmentComplex",
          "@id": `${SITE.url}/#osiedle`,
          name: "Plażowa Park",
          description:
            "Osiedle 20 mieszkań i domów 82-133 m² z prywatnymi ogrodami nad Zalewem Mrożyczka w Głownie.",
          url: SITE.url,
          numberOfAccommodationUnits: INVESTMENT.totalUnits,
          address,
          geo,
        },
        {
          "@type": "RealEstateListing",
          name: "Plażowa Park - mieszkania i domy nad Zalewem Mrożyczka",
          url: `${SITE.url}/`,
          inLanguage: "pl-PL",
          about: { "@type": "Residence", name: "Plażowa Park", address, geo },
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "PLN",
            lowPrice: INVESTMENT.priceMin,
            highPrice: INVESTMENT.priceMax,
            offerCount: INVESTMENT.available,
            availability: "https://schema.org/InStock",
            seller: { "@id": `${SITE.url}/#developer` },
          },
        },
        {
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
        {
          "@type": "ItemList",
          name: "Mieszkania i domy - Plażowa Park",
          numberOfItems: UNITS.length,
          itemListElement: UNITS.map((u, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Apartment",
              name: `Mieszkanie ${u.name}`,
              numberOfRoomsTotal: u.rooms,
              floorSize: { "@type": "QuantitativeValue", value: u.area, unitCode: "MTK" },
              offers: {
                "@type": "Offer",
                priceCurrency: "PLN",
                price: u.price,
                availability: availabilityUrl(u.status),
                seller: { "@id": `${SITE.url}/#developer` },
              },
            },
          })),
        },
      ]}
    />
  );
}
