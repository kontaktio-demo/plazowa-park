"use client";

import { useEffect, useState } from "react";

/**
 * Jedno źródło decyzji o cookies. Wcześniej klucz znał wyłącznie baner, a
 * Analytics ładował Google Analytics bezwarunkowo - przycisk "Tylko niezbędne"
 * nie robił nic, a polityka cookies obiecywała coś odwrotnego.
 */
const KEY = "pp-cookie-consent-v1";
export const CONSENT_EVENT = "pp:consent";

export type Zgoda = "all" | "essential" | null;

export function readConsent(): Zgoda {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = (JSON.parse(raw) as { value?: string }).value;
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(value: Exclude<Zgoda, null>) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ value, ts: Date.now() }));
  } catch {
    /* prywatne okno albo zablokowane dane witryny */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/** null dopóki użytkownik nie zdecydował; `undefined` przed pierwszym odczytem. */
export function useConsent(): Zgoda | undefined {
  const [zgoda, setZgoda] = useState<Zgoda | undefined>(undefined);

  useEffect(() => {
    setZgoda(readConsent());
    const onZmiana = (e: Event) => setZgoda((e as CustomEvent<Zgoda>).detail ?? readConsent());
    window.addEventListener(CONSENT_EVENT, onZmiana);
    return () => window.removeEventListener(CONSENT_EVENT, onZmiana);
  }, []);

  return zgoda;
}
