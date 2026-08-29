"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/data/site";
import { Icon } from "./Icons";

/**
 * Pasek pojawia się po opuszczeniu hero i znika w sekcji kontaktu, żeby nie
 * dublował formularza. Treść inna niż w headerze: header zaprasza do listy
 * lokali, pasek prowadzi wprost do zapytania.
 */
export default function StickyCta() {
  const [show, setShow] = useState(false);

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

  return (
    <div
      className={`fixed inset-x-3 bottom-0 z-50 flex gap-2.5 pb-[calc(12px+env(safe-area-inset-bottom))] transition-[opacity,transform] duration-300 lg:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <a
        href={`tel:${SITE.phone.tel}`}
        className="btn btn-ghost flex-none border-sand-50/30 bg-abyss/90 px-4 text-sand-50 backdrop-blur-md"
        aria-label="Zadzwoń"
      >
        <Icon.phone width={18} height={18} />
      </a>
      <a href="#kontakt" data-track="book_viewing" className="btn btn-sun flex-1">
        Zapytaj o mieszkanie
      </a>
    </div>
  );
}
