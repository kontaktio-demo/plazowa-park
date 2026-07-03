"use client";

import Script from "next/script";
import { useEffect } from "react";
import { track } from "@/lib/track";

const GA = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const tel = el?.closest?.('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (tel) track("contact_call", { phone: tel.getAttribute("href")?.replace("tel:", "") || "" });
      const wa = el?.closest?.('a[href*="wa.me"], a[href^="mailto:"]') as HTMLAnchorElement | null;
      if (wa) track("contact_click", { href: wa.getAttribute("href") || "" });
      const dt = el?.closest?.("[data-track]") as HTMLElement | null;
      if (dt) track(dt.getAttribute("data-track") || "cta_click");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!GA) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
