"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { flushTrack, track } from "@/lib/track";
import { useConsent } from "@/lib/consent";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

const GA = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  const zgoda = useConsent();
  const sciezka = usePathname();

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
        // przy CTA i rzutach na stronie lokalu doklejamy, o które mieszkanie chodzi
        const lokal = dt.getAttribute("data-lokal");
        track(dt.getAttribute("data-track") || "cta_click", {
          sekcja,
          etykieta,
          ...(lokal ? { unit: lokal } : {}),
        });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Zdarzenia z pierwszych chwil wizyty czekają w kolejce, dopóki skrypt Google nie
  // wstanie. onReady komponentu Script nie odpala się dla skryptu wstawianego treścią,
  // więc czekamy na samo gtag. Kiedy jest funkcją, cały blok inicjujący ma już za sobą
  // wywołanie config, czyli zaległe zdarzenia mają dokąd trafić.
  useEffect(() => {
    if (zgoda !== "all") return;
    let id = 0;
    let prob = 0;
    const sprobuj = () => {
      if (typeof window.gtag === "function") return flushTrack();
      if (prob++ > 80) return;
      id = window.setTimeout(sprobuj, 125);
    };
    sprobuj();
    return () => window.clearTimeout(id);
  }, [zgoda]);

  // Zasięg sekcji. Wbudowany pomiar przewijania w GA4 zgłasza tylko próg 90%, a na tej
  // stronie potrzebna jest odpowiedź na inne pytanie: do którego miejsca ludzie docierają,
  // zanim zawrócą. Dziesięć sekcji daje gotowy lejek od hero do formularza. Zdarzenie
  // pada raz na sekcję i na wejście, bo interesuje nas zasięg, nie liczba przewinięć.
  useEffect(() => {
    const sekcje = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    if (!sekcje.length) return;
    const obs = new IntersectionObserver(
      (wpisy) => {
        for (const w of wpisy) {
          if (!w.isIntersecting) continue;
          obs.unobserve(w.target);
          track("sekcja_widoczna", { sekcja: w.target.id });
        }
      },
      // sekcja bywa wyższa niż ekran, więc progu ułamkowego nigdy by nie osiągnęła
      { rootMargin: "0px 0px -35% 0px" }
    );
    sekcje.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [sciezka]);

  return (
    <>
      {/* Google Analytics zapisuje pliki cookie, więc rusza dopiero po zgodzie.
          Bez anonymize_ip: w GA4 to relikt po poprzedniej wersji, który nic nie zmienia
          (adres IP jest skracany zawsze), a doklejał się jako parametr do każdego
          zdarzenia i zaśmiecał raporty. */}
      {zgoda === "all" && GA && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA}');`}
          </Script>
        </>
      )}
      {/* Analityka Vercela niczego nie zapisuje ani nie odczytuje z urządzenia - nie ma
          plików cookie ani pamięci lokalnej - więc nie podlega obowiązkowi zgody i liczy
          cały ruch. To jedyne źródło, które mówi, ilu ludzi w ogóle weszło na stronę:
          bez niego nie wiadomo, czy niska liczba w GA to mały ruch, czy sama odmowa zgody. */}
      <VercelAnalytics />
    </>
  );
}
