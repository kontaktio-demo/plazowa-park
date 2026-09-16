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

/**
 * Zapas na czas wizyty. W prywatnym oknie i przy zablokowanych danych witryny
 * zapis rzuca wyjątkiem - bez tej kopii "Akceptuję" chowało baner, ale analityka
 * nigdy nie ruszała, a mobilny pasek CTA nie pokazywał się do końca wizyty.
 */
let wSesji: Zgoda = null;

export function readConsent(): Zgoda {
  try {
    const raw = localStorage.getItem(KEY);
    const v = raw ? (JSON.parse(raw) as { value?: string }).value : null;
    if (v === "all" || v === "essential") return v;
  } catch {
    /* prywatne okno albo zablokowane dane witryny */
  }
  return wSesji;
}

export function saveConsent(value: Exclude<Zgoda, null>) {
  wSesji = value;
  try {
    localStorage.setItem(KEY, JSON.stringify({ value, ts: Date.now() }));
  } catch {
    /* prywatne okno albo zablokowane dane witryny */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/** RODO art. 7 ust. 3: wycofanie zgody ma być tak samo łatwe jak jej udzielenie. */
export function clearConsent() {
  wSesji = null;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* prywatne okno albo zablokowane dane witryny */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
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
