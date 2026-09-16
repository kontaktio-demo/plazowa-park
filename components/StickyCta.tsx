"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/data/site";
import { Icon } from "./Icons";
import { useConsent } from "@/lib/consent";

/**
 * Pasek pojawia się po opuszczeniu hero i znika w sekcji kontaktu, żeby nie
 * dublował formularza. Treść inna niż w headerze: header zaprasza do listy
 * lokali, pasek prowadzi wprost do zapytania. Na telefonie baner cookies zajmuje
 * ten sam dol ekranu, wiec do czasu decyzji pasek sie nie pokazuje - inaczej
 * przy pierwszej wizycie glowne CTA lezalo pod banerem i bylo nieklikalne.
 */
export default function StickyCta() {
  const [show, setShow] = useState(false);
  const zgoda = useConsent();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const kontakt = document.getElementById("kontakt");
      const limit = kontakt ? kontakt.offsetTop - window.innerHeight * 0.5 : Number.POSITIVE_INFINITY;
      setShow(y > window.innerHeight * 0.9 && y < limit);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // W spacerze 360 pasek staje przy dolnej krawedzi dokladnie tam, gdzie sterowanie
  // ujeciami, wiec na czas spaceru znika. Spacer sygnalizuje sie atrybutem na body,
  // zeby te dwa komponenty nie musialy o sobie wiedziec.
  const [spacer, setSpacer] = useState(false);
  useEffect(() => {
    const sprawdz = () => setSpacer(document.body.dataset.spacer === "1");
    sprawdz();
    const mo = new MutationObserver(sprawdz);
    mo.observe(document.body, { attributes: true, attributeFilter: ["data-spacer"] });
    return () => mo.disconnect();
  }, []);

  return (
    <div
      // visibility w przejściu, bo samo opacity-0 zostawia oba linki w kolejności Tab
      // jako przystanki bez widocznego focusu
      className={`fixed inset-x-3 bottom-0 z-50 flex gap-2.5 pb-[calc(12px+env(safe-area-inset-bottom))] transition-[opacity,transform,visibility] duration-300 lg:hidden ${
        show && zgoda && !spacer ? "translate-y-0 opacity-100" : "invisible pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <a
        href={`tel:${SITE.phone.tel}`}
        className="btn btn-ghost flex-none border-sand-50/30 bg-abyss/90 px-4 text-sand-50 backdrop-blur-md"
        aria-label="Zadzwoń"
      >
        <Icon.phone width={18} height={18} />
      </a>
      <a href="#kontakt" data-track="book_viewing" data-miejsce="pasek-mobilny" className="btn btn-sun flex-1">
        Zapytaj o mieszkanie lub dom
      </a>
    </div>
  );
}
