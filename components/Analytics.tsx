"use client";

import Script from "next/script";
import { useEffect } from "react";
import { track } from "@/lib/track";
import { useConsent } from "@/lib/consent";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

const GA = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  const zgoda = useConsent();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const tel = el?.closest?.('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (tel) track("click_to_call", { phone: tel.getAttribute("href")?.replace("tel:", "") || "" });
      const mail = el?.closest?.('a[href^="mailto:"]') as HTMLAnchorElement | null;
      if (mail) track("click_to_email", { href: mail.getAttribute("href") || "" });
      const wa = el?.closest?.('a[href*="wa.me"]') as HTMLAnchorElement | null;
      if (wa) track("click_whatsapp", { href: wa.getAttribute("href") || "" });
      const dt = el?.closest?.("[data-track]") as HTMLElement | null;
      if (dt) {
        // Bez sekcji i etykiety nie wiadomo, które z dziewięciu CTA realnie konwertuje.
        // Cztery z nich nie leżą w żadnej sekcji z id - pasek mobilny i menu mobilne są
        // poza headerem, modal i podstrony też - więc samo drzewo DOM dawało pustą
        // wartość. Jawny atrybut ma pierwszeństwo, reszta to zapas, a na końcu i tak
        // pada konkretna nazwa zamiast pustki.
        const sekcja =
          dt.getAttribute("data-miejsce") ||
          dt.closest("section")?.id ||
          (dt.closest("header") ? "nawigacja" : dt.closest("footer") ? "stopka" : "inne");
        // licznik dostępnych lokali klei się do tekstu przycisku ("Sprawdź dostępność18")
        const etykieta = (dt.getAttribute("aria-label") || dt.textContent || "")
          .replace(/\s+/g, " ")
          .replace(/\s*\d+$/, "")
          .trim()
          .slice(0, 60);
        track(dt.getAttribute("data-track") || "cta_click", { sekcja, etykieta });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Bez zgody na analitykę nie ładujemy niczego - polityka cookies to obiecuje.
  // Dotyczy obu narzędzi: Google Analytics i bezcookiowej analityki Vercela.
  if (zgoda !== "all") return null;
  return (
    <>
      {GA && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      <VercelAnalytics />
    </>
  );
}
