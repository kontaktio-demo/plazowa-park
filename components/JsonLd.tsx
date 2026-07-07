import { SITE, DEVELOPER, FAQ } from "@/lib/data/site";
import { INVESTMENT, UNITS } from "@/lib/data/units";

const availabilityUrl = (s: string) =>
  s === "available"
    ? "https://schema.org/InStock"
    : s === "reserved"
      ? "https://schema.org/PreOrder"
      : "https://schema.org/SoldOut";

export default function JsonLd() {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#developer`,
      name: DEVELOPER.name,
      url: SITE.url,
      telephone: SITE.phone.tel,
      email: SITE.email,
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
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: "Plażowa Park",
      inLanguage: "pl-PL",
      publisher: { "@id": `${SITE.url}/#developer` },
    },
    {
      "@type": "RealEstateListing",
      name: "Plażowa Park - apartamenty nad Zalewem Mrożyczka",
      url: `${SITE.url}/`,
      inLanguage: "pl-PL",
      datePosted: "2026-01-01",
      about: {
        "@type": "Residence",
        name: "Plażowa Park",
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.address.street,
          addressLocality: SITE.address.city,
          postalCode: SITE.address.postal,
          addressRegion: SITE.address.region,
          addressCountry: "PL",
        },
        geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
      },
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
      "@type": "LocalBusiness",
      "@id": `${SITE.url}/#salesoffice`,
      name: "Biuro sprzedaży Plażowa Park",
      image: `${SITE.url}/og.jpg`,
      telephone: SITE.phone.tel,
      email: SITE.email,
      priceRange: `${INVESTMENT.priceMin}-${INVESTMENT.priceMax} PLN`,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.city,
        postalCode: SITE.address.postal,
        addressRegion: SITE.address.region,
        addressCountry: "PL",
      },
      geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
      parentOrganization: { "@id": `${SITE.url}/#developer` },
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
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Wybierz dom", item: `${SITE.url}/#lokale` },
        { "@type": "ListItem", position: 3, name: "Kontakt", item: `${SITE.url}/#kontakt` },
      ],
    },
    {
      "@type": "ItemList",
      name: "Apartamenty - Plażowa Park",
      numberOfItems: UNITS.length,
      itemListElement: UNITS.map((u, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Apartment",
          name: `Apartament ${u.name}`,
          numberOfRoomsTotal: u.rooms,
          floorSize: { "@type": "QuantitativeValue", value: u.area, unitCode: "MTK" },
          numberOfBathroomsTotal: 1,
          petsAllowed: true,
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
  ];

  const json = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
