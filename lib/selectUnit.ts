export const SELECT_UNIT_EVENT = "pp:select-unit";
export const SELECT_BUILDING_EVENT = "pp:select-building";

/**
 * Samo przewinięcie zostawiało użytkownika klawiatury na przycisku kilka tysięcy
 * pikseli nad ekranem - pierwszy Tab cofał stronę tam, skąd wyszedł. Focus idzie
 * za przewinięciem tylko przy obsłudze klawiaturą: po kliknięciu myszą albo
 * dotknięciu przeniesienie go do pola wywołałoby klawiaturę ekranową w trakcie
 * animacji przewijania.
 */
function goTo(id: string, cel: string) {
  const klawiatura = document.activeElement?.matches(":focus-visible") ?? false;
  const el = document.getElementById(id);
  // @ts-expect-error lenis global set in SiteMotion
  const lenis = window.__lenis;
  if (el && lenis) lenis.scrollTo(el, { offset: -70, duration: 1.2 });
  else el?.scrollIntoView({ behavior: "smooth", block: "start" });
  // klatka zwłoki, bo modal lokalu zamyka się w tym samym kliknięciu i do czasu
  // jego zniknięcia cała strona pod nim jest inert, czyli nie przyjmuje focusu
  if (klawiatura) requestAnimationFrame(() => document.querySelector<HTMLElement>(cel)?.focus({ preventScroll: true }));
}

export function selectUnit(unitName: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SELECT_UNIT_EVENT, { detail: unitName }));
  goTo("kontakt", '#kontakt input[name="unit"]');
}

/** Klik w budynek w sekcji Osiedle filtruje listę lokali niżej. */
export function selectBuilding(stageId: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SELECT_BUILDING_EVENT, { detail: stageId }));
  goTo("lista-lokali", "#lista-lokali");
}
