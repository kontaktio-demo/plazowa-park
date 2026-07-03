type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Fire a GA4 event if analytics is loaded; safe no-op otherwise.
export function track(event: string, params: GtagParams = {}) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, params);
  } catch {
    /* ignore */
  }
}
