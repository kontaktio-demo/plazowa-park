export const SELECT_UNIT_EVENT = "pp:select-unit";

export function selectUnit(unitName: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SELECT_UNIT_EVENT, { detail: unitName }));
  const el = document.getElementById("kontakt");
  // @ts-expect-error lenis global set in SiteMotion
  const lenis = window.__lenis;
  if (el && lenis) lenis.scrollTo(el, { offset: -70, duration: 1.2 });
  else el?.scrollIntoView({ behavior: "smooth", block: "start" });
}
