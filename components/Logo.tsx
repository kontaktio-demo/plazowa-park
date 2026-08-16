import type { SVGProps } from "react";

/** Znak Plażowa Park: asymetryczna połać dachu (sygnatura architektury osiedla)
 *  nad dwiema zmarszczkami wody (Zalew Mrożyczka). Monochromatyczny, currentColor. */
export function LogoMark({ strokeWidth = 1.4, ...props }: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M3.4 13.1 14.2 4.8 20.6 9.2" />
      <path d="M3.3 17.5q2.7-2 5.4 0t5.4 0 5.4 0" />
      <path d="M3.3 20.6q2.7-2 5.4 0t5.4 0 5.4 0" opacity="0.4" />
    </svg>
  );
}
