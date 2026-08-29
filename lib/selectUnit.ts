export const SELECT_UNIT_EVENT = "pp:select-unit";
export const SELECT_BUILDING_EVENT = "pp:select-building";

function goTo(id: string) {
  const el = document.getElementById(id);
  // @ts-expect-error lenis global set in SiteMotion
  const lenis = window.__lenis;
  if (el && lenis) lenis.scrollTo(el, { offset: -70, duration: 1.2 });
  else el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function selectUnit(unitName: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SELECT_UNIT_EVENT, { detail: unitName }));
  goTo("kontakt");
}

/** Klik w budynek w sekcji Osiedle filtruje listę lokali niżej. */
export function selectBuilding(stageId: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SELECT_BUILDING_EVENT, { detail: stageId }));
  goTo("lista-lokali");
}
