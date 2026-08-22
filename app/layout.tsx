import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/data/site";
import SiteMotion from "@/components/SiteMotion";
import CookieConsent from "@/components/CookieConsent";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";

// Inter Tight w nagłówkach - twardy, wąski grotesk z pierwszej wersji strony.
// Pinujemy wagi: zmienny krój ciągnąłby cały zakres 100-900, a używamy 600.
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "latin-ext"],
  weight: ["600"],
  display: "swap",
});

// 400 i 500 wystarczaja: waga 600 wystepuje wylacznie na nagłówkach, a te sa
// skladane Inter Tight, nie Interem
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
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
    <html lang="pl" className={`${interTight.variable} ${inter.variable} ${jetbrains.variable}`}>
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
