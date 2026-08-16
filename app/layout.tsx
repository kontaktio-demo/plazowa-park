import type { Metadata, Viewport } from "next";
import { Fraunces, Schibsted_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/data/site";
import SiteMotion from "@/components/SiteMotion";
import CookieConsent from "@/components/CookieConsent";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";

// bez osi SOFT/WONK/opsz - nigdzie ich nie ustawiamy, a same osie kosztują setki KB
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  display: "swap",
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// mono obsługuje wyłącznie drobne etykiety, więc nie wchodzi na ścieżkę krytyczną
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

const description =
  "Nowe apartamenty 82-133 m² z ogrodem i tarasem nad Zalewem Mrożyczka w Głownie. Blisko lasu i Central Wake Park. Ceny od 633 000 zł. Sprawdź dostępne lokale.";

// Preview/branch deploys (VERCEL_ENV=preview) stay out of the index; the
// production alias *.vercel.app is handled by middleware (X-Robots-Tag).
const isPreview = process.env.VERCEL_ENV === "preview";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Apartamenty nad Zalewem Mrożyczka w Głownie | Plażowa Park",
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
  themeColor: "#06171b",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${fraunces.variable} ${schibsted.variable} ${jetbrains.variable}`}>
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
