"use client";

import { useEffect, useRef } from "react";

const PATH =
  "M -80 762 C 220 720, 348 812, 604 762 C 862 712, 946 812, 1224 742 C 1364 710, 1404 668, 1560 690";

export default function BrushTrail({ className }: { className?: string }) {
  const maskRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const mask = maskRef.current;
    if (!mask) return;
    const len = mask.getTotalLength();
    mask.style.strokeDasharray = `${len}`;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      mask.style.strokeDashoffset = "0";
      return;
    }
    mask.style.strokeDashoffset = `${len}`;

    let killed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let st: any;
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);
      const section = mask.closest("section") ?? mask;
      st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.9,
        onUpdate: (self) => {
          // reveal by animating the mask stroke only; the textured+filtered
          // trail beneath is rendered once (cheap during scroll)
          mask.style.strokeDashoffset = `${len * (1 - self.progress)}`;
        },
      });
    })();

    return () => {
      killed = true;
      st?.kill();
    };
  }, []);

  return (
    <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <pattern id="ppTrailTex" patternUnits="userSpaceOnUse" width="560" height="560" patternTransform="rotate(6)">
          <image href="/textures/forest-path.webp" x="0" y="0" width="560" height="560" preserveAspectRatio="xMidYMid slice" />
        </pattern>
        <filter id="ppBrush" x="-10%" y="-45%" width="120%" height="190%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011 0.022" numOctaves="2" seed="9" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="30" xChannelSelector="R" yChannelSelector="G" />
          <feDropShadow dx="0" dy="7" stdDeviation="9" floodColor="#1a1b1d" floodOpacity="0.16" />
        </filter>
        <mask id="ppReveal" maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="810">
          <path ref={maskRef} d={PATH} fill="none" stroke="#fff" strokeWidth={150} strokeLinecap="round" strokeLinejoin="round" />
        </mask>
      </defs>
      <g mask="url(#ppReveal)">
        <path
          d={PATH}
          fill="none"
          stroke="url(#ppTrailTex)"
          strokeWidth={70}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ppBrush)"
        />
      </g>
    </svg>
  );
}
