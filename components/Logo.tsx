import type { SVGProps } from "react";

/**
 * Znak Plażowa Park: pięć sosen nad kreską. To oryginalne logo osiedla, używane
 * przez dewelopera na starej stronie, w materiałach drukowanych i na Facebooku.
 * Rysunek odtworzony z oryginału (public/brand/logo-orig.png) przez pomiar
 * położenia pni i gałęzi, dlatego jest wektorem i bierze kolor z currentColor,
 * zamiast być kolejnym plikiem rastrowym w dwóch wersjach kolorystycznych.
 *
 * Układ współrzędnych: kreska u dołu ma pełną szerokość viewBoxa, oś symetrii
 * przechodzi przez środkowy pień (x = 89,5).
 */
// Gałęzie mają jedno nachylenie (2:1). Trzy łączą pień zewnętrzny ze środkowym,
// dwie wychodzą poza obrys i kończą się wolnym końcem - jak w oryginale.
const GALEZIE = [
  [54.5, 68.5, 72.5, 106.5],
  [39, 84, 54.5, 115],
  [54.5, 102, 72.5, 138],
  [45, 123, 54.5, 142],
  [54.5, 133, 72.5, 169],
] as const;

const PNIE = [
  [54.5, 46],
  [72.5, 25],
  [89.5, 5],
  [106.5, 25],
  [124, 46],
] as const;

/**
 * Domyślna grubość kreski jest większa niż w oryginale (4 na 179 szerokości), bo
 * znak stoi w interfejsie przy 26-32 px. Przy wiernych proporcjach kreska miałaby
 * tam ułamek piksela i znak bladł obok tekstu nawigacji.
 */
export function LogoMark({ strokeWidth = 6, ...props }: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 179 204"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="butt"
      aria-hidden
      {...props}
    >
      {PNIE.map(([x, y]) => (
        <path key={x} d={`M${x} ${y}V195`} />
      ))}
      {GALEZIE.map(([x1, y1, x2, y2]) => (
        <g key={y1}>
          <path d={`M${x1} ${y1} ${x2} ${y2}`} />
          <path d={`M${179 - x1} ${y1} ${179 - x2} ${y2}`} />
        </g>
      ))}
      <path d="M0 201h179" />
    </svg>
  );
}
