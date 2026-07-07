import type { SVGProps } from "react";

/** Plażowa Park mark - asymmetric mono-pitch roofline (the estate's signature
 *  architecture) over two water ripples (Zalew Mrożyczka). Monochrome / currentColor. */
export function LogoMark({ strokeWidth = 1.7, ...props }: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M3.4 13.1 14.2 4.8 20.6 9.2" />
      <path d="M3.3 17.5q2.7-2 5.4 0t5.4 0 5.4 0" />
      <path d="M3.3 20.6q2.7-2 5.4 0t5.4 0 5.4 0" opacity="0.4" />
    </svg>
  );
}

/** Full brand lockup: badge mark + wordmark. */
export default function Logo({
  className = "",
  tone = "dark",
  sub = true,
}: {
  className?: string;
  tone?: "dark" | "light";
  sub?: boolean;
}) {
  const badge = tone === "light" ? "bg-paper/15 text-paper backdrop-blur-sm" : "bg-pine text-paper";
  const word = tone === "light" ? "text-paper" : "text-pine";
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className={`flex h-10 w-10 items-center justify-center rounded-[11px] ${badge}`}>
        <LogoMark width={22} height={22} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.3rem] font-semibold tracking-tight ${word}`}>Plażowa Park</span>
        {sub && (
          <span className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.24em] text-brass-deep">
            Głowno · Zalew Mrożyczka
          </span>
        )}
      </span>
    </span>
  );
}
