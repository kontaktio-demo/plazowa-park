"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { flushTrack, track } from "@/lib/track";
import { useConsent } from "@/lib/consent";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

const GA = process.env.NEXT_PUBLIC_GA_ID;

// Bez miejsca kliknięcia nie wiadomo, które CTA realnie konwertuje. Część z nich nie leży
// w żadnej sekcji z id - pasek mobilny i menu mobilne są poza headerem, modal i podstrony
// też - więc samo drzewo DOM dawało pustą wartość. Jawny atrybut ma pierwszeństwo, reszta
// to zapas, a na końcu i tak pada konkretna nazwa zamiast pustki.
function miejsceKliku(el: HTMLElement) {
  return (
    el.getAttribute("data-miejsce") ||
    el.closest("section")?.id ||
    (el.closest("header") ? "nawigacja" : el.closest("footer") ? "stopka" : "inne")
  );
}

export default function Analytics() {
  const zgoda = useConsent();
  const sciezka = usePathname();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const tel = el?.closest?.('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (tel) track("click_to_call", { phone: tel.getAttribute("href")?.replace("tel:", "") || "" });
      const mail = el?.closest?.('a[href^="mailto:"]') as HTMLAnchorElement | null;
      // Bez adresu: jest jeden na całej stronie, a gtag i tak podmienia go na "(redacted)".
      // Wartość niesie dopiero miejsce kliknięcia - stopka czy sekcja kontaktu.
      if (mail) track("click_to_email", { sekcja: miejsceKliku(mail) });
      const dt = el?.closest?.("[data-track]") as HTMLElement | null;
      if (dt) {
        // innerText, nie textContent: sąsiadujące spany blokowe skleiłyby się bez spacji
        // ("FacebookFanpage osiedla"). Licznik dostępnych lokali też klei się do tekstu
        // przycisku - "Sprawdź dostępność18" w nagłówku, "Sprawdź dostępność (18)"
        // w menu mobilnym - a w raporcie ma zostać sama nazwa przycisku.
        const etykieta = (dt.getAttribute("aria-label") || dt.innerText || "")
          .replace(/\s+/g, " ")
          .trim()
          .replace(/\s*\(?\d+\)?$/, "")
          .slice(0, 60);
        // przy CTA i rzutach na stronie lokalu doklejamy, o które mieszkanie chodzi
        const lokal = dt.getAttribute("data-lokal");
        track(dt.getAttribute("data-track") || "cta_click", {
          sekcja: miejsceKliku(dt),
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
  // zanim zawrócą. Sekcje dają gotowy lejek od hero do formularza. Zdarzenie
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
