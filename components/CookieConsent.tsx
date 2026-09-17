"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CONSENT_EVENT, clearConsent, readConsent, saveConsent } from "@/lib/consent";

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const akceptuj = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let t = 0;
    if (!readConsent()) t = window.setTimeout(() => setShow(true), 800);
    // Po wycofaniu zgody w polityce cookies baner wraca od razu i zabiera focus -
    // inaczej klik w "Zmień decyzję" nie daje żadnego sygnału, bo baner siada
    // w rogu ekranu, często poza polem widzenia.
    const onZmiana = () => {
      const brak = !readConsent();
      setShow(brak);
      if (brak) requestAnimationFrame(() => akceptuj.current?.focus());
    };
    window.addEventListener(CONSENT_EVENT, onZmiana);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(CONSENT_EVENT, onZmiana);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Zgoda na cookies"
      // menu mobilne wycisza resztę strony (lib/wycisz.ts), baner ma zostać klikalny
      data-nad-menu
      className="fixed inset-x-0 bottom-0 z-70 p-3 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-xl sm:p-0"
    >
      <div className="band band-abyss flex flex-col gap-4 border border-clay-700 p-4 sm:flex-row sm:items-center sm:gap-6 sm:py-3.5 sm:pl-5 sm:pr-4">
        <p className="t-body fg-muted text-sm text-pretty">
          Za Twoją zgodą włączamy statystyki, które używają plików cookie. Twoją decyzję zapisujemy w pamięci
          przeglądarki.{" "}
          <Link href="/polityka-cookies" className="link-underline fg-accent">
            Polityka cookies
          </Link>
        </p>
        <div className="flex flex-none gap-2.5">
          <button ref={akceptuj} onClick={() => saveConsent("all")} className="btn btn-sun btn-sm flex-1 sm:flex-none">
            Akceptuję
          </button>
          <button onClick={() => saveConsent("essential")} className="btn btn-ghost btn-sm flex-1 sm:flex-none">
            Tylko niezbędne
          </button>
        </div>
      </div>
    </div>
  );
}

/** Punkt wycofania zgody w polityce cookies - kasuje decyzję i przywraca baner. */
export function ZmienZgode() {
  return (
    <button type="button" onClick={clearConsent} className="btn btn-solid btn-sm">
      Zmień decyzję o cookies
    </button>
  );
}
