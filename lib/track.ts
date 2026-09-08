type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Skrypt Google ładuje się dopiero po zgodzie i asynchronicznie, więc zdarzenia
 * z pierwszej sekundy wizyty trafiały w niezdefiniowane `gtag` i ginęły bez śladu.
 * Dotyczyło to akurat najważniejszych: wejścia na stronę lokalu i pierwszych sekcji.
 * Kolejka trzyma je do czasu, aż analityka wstanie; limit chroni pamięć, gdy zgody nie ma.
 */
const kolejka: [string, GtagParams][] = [];
const LIMIT = 60;

function wyslij(event: string, params: GtagParams) {
  try {
    window.gtag?.("event", event, params);
  } catch {
    /* ignore */
  }
}

export function track(event: string, params: GtagParams = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") {
    if (kolejka.length < LIMIT) kolejka.push([event, params]);
    return;
  }
  wyslij(event, params);
}

// wywoływane raz, gdy skrypt GA4 jest skonfigurowany
export function flushTrack() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  for (const [event, params] of kolejka.splice(0, kolejka.length)) wyslij(event, params);
}
