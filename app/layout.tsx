import type { Metadata, Viewport } from "next";
import { Newsreader, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/data/site";
import SiteMotion from "@/components/SiteMotion";
import CookieConsent from "@/components/CookieConsent";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";

// Nagłówki: editorialny szeryf. Wagi przypięte - krój zmienny ciągnąłby cały
// zakres 200-900 (128 kB na subset), a nagłówki używają wyłącznie 600.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
  weight: ["600"],
  display: "swap",
});

// Tekst, etykiety i liczby. Wcześniej etykiety szły monospaced JetBrains Mono -
// wygląd narzędzia deweloperskiego, do tego trzeci krój na ścieżce krytycznej.
const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});
const description =
  "Nowe mieszkania i domy 82-133 m² z ogrodem i tarasem nad Zalewem Mrożyczka w Głownie. Blisko lasu i Central Wake Park. Ceny od 633 000 zł. Sprawdź dostępne lokale.";

// Deploye preview i branchowe (VERCEL_ENV=preview) zostają poza indeksem;
// aliasem produkcyjnym *.vercel.app zajmuje się middleware (X-Robots-Tag).
const isPreview = process.env.VERCEL_ENV === "preview";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Mieszkania i domy nad Zalewem Mrożyczka w Głownie | Plażowa Park",
    template: "%s | Plażowa Park",
  },
  description,
  applicationName: "Plażowa Park",
  authors: [{ name: "KS Prestige Development" }],
  keywords: [
    "mieszkania i domy Głowno",
    "mieszkania na sprzedaż Głowno",
    "domy na sprzedaż Głowno",
    "nowe mieszkania nad Zalewem Mrożyczka",
    "domy nad wodą łódzkie",
    "Plażowa Park",
    "nowa inwestycja Głowno",
    "mieszkania z ogrodem i tarasem Głowno",
    "domy w lesie Głowno",
    "osiedle Głowno powiat zgierski",
    "nieruchomości nad zalewem łódzkie",
    "apartamenty Głowno",
    "KS Prestige Development",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: SITE.url,
    siteName: "Plażowa Park",
    title: "Plażowa Park - mieszkania i domy na sprzedaż w Głownie nad Zalewem Mrożyczka",
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Plażowa Park - osiedle nad Zalewem Mrożyczka w Głownie" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plażowa Park - mieszkania i domy na sprzedaż w Głownie nad Zalewem Mrożyczka",
    description,
    images: ["/og.jpg"],
  },
  robots: isPreview
    ? { index: false, follow: false }
    : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  category: "real estate",
  // Geo-targeting signals for local search (Głowno, woj. łódzkie PL-LD)
  other: {
    "geo.region": "PL-LD",
    "geo.placename": "Głowno",
    "geo.position": `${SITE.geo.lat};${SITE.geo.lng}`,
    ICBM: `${SITE.geo.lat}, ${SITE.geo.lng}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf8f4",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${newsreader.variable} ${instrument.variable}`}>
      <body>
        <JsonLd />
        <Analytics />
        <SiteMotion />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
