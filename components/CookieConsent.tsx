"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "pp-cookie-consent-v1";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let t = 0;
    try {
      if (!localStorage.getItem(KEY)) t = window.setTimeout(() => setShow(true), 800);
    } catch {
      /* ignore */
    }
    return () => window.clearTimeout(t);
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
    <div className="fixed inset-x-0 bottom-0 z-70 p-3 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-xl sm:p-0">
      <div className="band band-abyss flex flex-col gap-4 border border-clay-700 p-4 sm:flex-row sm:items-center sm:gap-6 sm:py-3.5 sm:pl-5 sm:pr-4">
        <p className="t-body fg-muted text-sm text-pretty">
          Używamy cookies, aby strona działała i abyśmy mogli analizować ruch.{" "}
          <Link href="/polityka-cookies" className="link-underline fg-accent">
            Polityka cookies
          </Link>
        </p>
        <div className="flex flex-none gap-2.5">
          <button onClick={() => decide("all")} className="btn btn-sun btn-sm flex-1 sm:flex-none">
            Akceptuję
          </button>
          <button onClick={() => decide("essential")} className="btn btn-ghost btn-sm flex-1 sm:flex-none">
            Tylko niezbędne
          </button>
        </div>
      </div>
    </div>
  );
}
