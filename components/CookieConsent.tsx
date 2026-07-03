"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "pp-cookie-consent-v1";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* ignore */
    }
  }, []);

  const decide = (value: "all" | "essential") => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ value, ts: Date.now() }));
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[70] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-w-[26rem]">
      <div className="card grain relative overflow-hidden p-5 shadow-[var(--shadow-lift)]">
        <p className="font-display text-lg text-pine">Szanujemy Twoją prywatność</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Używamy plików cookie, aby strona działała poprawnie i aby analizować ruch. Szczegóły znajdziesz w{" "}
          <Link href="/polityka-cookies" className="link-underline text-ink-soft">
            Polityce cookies
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <button onClick={() => decide("all")} className="btn btn-primary !px-5 !py-2.5 text-sm">
            Akceptuję wszystkie
          </button>
          <button onClick={() => decide("essential")} className="btn btn-ghost !px-5 !py-2.5 text-sm">
            Tylko niezbędne
          </button>
        </div>
      </div>
    </div>
  );
}
