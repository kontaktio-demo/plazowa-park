import { getImageProps } from "next/image";
import type { Unit } from "./data/units";
import { PLAN } from "./data/plan";
import { planImage, unitFloors } from "./unitType";

export const SIZES_RZUTU = "(max-width: 640px) 100vw, 384px";
export const SIZES_KADRU = "1024px";

const wczytane = new Set<string>();

// Ten sam srcset i sizes co <Image> w oknie, więc przeglądarka wybiera ten sam plik,
// a okno otwiera się z obrazem już w pamięci podręcznej i zdekodowanym.
function wczytaj(src: string, sizes: string) {
  if (wczytane.has(src)) return;
  wczytane.add(src);
  const { props } = getImageProps({ src, alt: "", fill: true, sizes });
  const img = new window.Image();
  img.sizes = sizes;
  if (props.srcSet) img.srcset = props.srcSet;
  img.src = props.src;
  img.decode().catch(() => {});
}

/** Obrazy okna mieszkania albo domu, zanim ktoś w nie kliknie: najechanie, focus, dotyk. */
export function wczytajLokal(unit: Unit) {
  const kondygnacje = unitFloors(unit);
  if (kondygnacje.length) kondygnacje.forEach((k) => wczytaj(k.render, SIZES_RZUTU));
  else wczytaj(planImage(unit), SIZES_RZUTU);
  wczytaj(PLAN.src, SIZES_KADRU);
}
