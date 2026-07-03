import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/data/site";
import SiteMotion from "@/components/SiteMotion";
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

const description =
  "20 apartamentów 82–133 m² w 100-letnim lesie przy Zalewie Mrożyczka w Głownie. Prywatny ogród, taras, pompy ciepła, 2 miejsca postojowe. Ceny od 633 000 zł. Sprawdź dostępność online.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Plażowa Park Głowno — nowe apartamenty nad Zalewem Mrożyczka",
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
    "mieszkania blisko Łodzi nad jeziorem",
    "KS Prestige Development",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: SITE.url,
    siteName: "Plażowa Park",
    title: "Plażowa Park Głowno — apartamenty nad Zalewem Mrożyczka",
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Plażowa Park — osiedle nad Zalewem Mrożyczka w Głownie" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plażowa Park Głowno — apartamenty nad Zalewem Mrożyczka",
    description,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  category: "real estate",
};

export const viewport: Viewport = {
  themeColor: "#f4f4f3",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${interTight.variable} ${inter.variable}`}>
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
