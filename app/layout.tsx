import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, Fraunces } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/data/site";
import SiteMotion from "@/components/SiteMotion";
import Preloader from "@/components/Preloader";
import CookieConsent from "@/components/CookieConsent";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Editorial serif-italic accent face (the sans + serif-italic contrast, award-site style)
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  style: ["italic", "normal"],
  display: "swap",
});

const description =
  "Plażowa Park to kameralna inwestycja w Głownie - 20 apartamentów na sprzedaż z prywatnym ogrodem i tarasem, w otoczeniu ponad 100-letniego lasu, tuż przy Zalewie Mrożyczka. Zobacz dostępne metraże i ceny od 633 000 zł.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Plażowa Park | Apartamenty na sprzedaż w Głownie nad Zalewem Mrożyczka",
    template: "%s | Plażowa Park",
  },
  description,
  applicationName: "Plażowa Park",
  authors: [{ name: "KS Prestige Development" }],
  keywords: [
    "apartamenty Głowno",
    "mieszkania na sprzedaż Głowno",
    "nowe mieszkania nad Zalewem Mrożyczka",
    "Plażowa Park",
    "domy Głowno",
    "nowa inwestycja Głowno",
    "apartamenty nad wodą łódzkie",
    "apartamenty w lesie Głowno",
    "mieszkania z ogrodem i tarasem Głowno",
    "osiedle Głowno powiat zgierski",
    "nieruchomości nad zalewem łódzkie",
    "apartamenty Central Wake Park",
    "KS Prestige Development",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: SITE.url,
    siteName: "Plażowa Park",
    title: "Plażowa Park - apartamenty na sprzedaż w Głownie nad Zalewem Mrożyczka",
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Plażowa Park - osiedle nad Zalewem Mrożyczka w Głownie" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plażowa Park - apartamenty na sprzedaż w Głownie nad Zalewem Mrożyczka",
    description,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
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
  themeColor: "#f4f4f3",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${interTight.variable} ${inter.variable} ${fraunces.variable}`}>
      <body>
        <JsonLd />
        <Analytics />
        <SiteMotion />
        {children}
        <Preloader />
        <CookieConsent />
      </body>
    </html>
  );
}
