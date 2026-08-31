"use client";

import { useSyncExternalStore } from "react";

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

function subskrybuj(powiadom: () => void) {
  window.addEventListener(CONSENT_EVENT, powiadom);
  window.addEventListener("storage", powiadom);
  return () => {
    window.removeEventListener(CONSENT_EVENT, powiadom);
    window.removeEventListener("storage", powiadom);
  };
}

/**
 * null dopóki użytkownik nie zdecydował; `undefined` na serwerze i w hydracji.
 * Zgoda jest stanem spoza Reacta, więc czyta ją useSyncExternalStore - dzięki
 * temu decyzja z jednej karty dociera też do pozostałych.
 */
export function useConsent(): Zgoda | undefined {
  return useSyncExternalStore(
    subskrybuj,
    readConsent,
    () => undefined
  );
}
