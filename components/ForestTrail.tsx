"use client";

import { useEffect, useRef } from "react";

const PATH =
  "M 10 730 C 170 696, 262 766, 448 734 C 648 700, 726 774, 946 738 C 1146 704, 1236 640, 1410 666";

const END = { x: 1410, y: 648 };

const TREES = [
  { x: 150, y: 766, s: 0.85, at: 0.1 },
  { x: 356, y: 784, s: 1.0, at: 0.26 },
  { x: 545, y: 766, s: 0.8, at: 0.42 },
  { x: 1362, y: 704, s: 0.75, at: 0.9 },
];

function pine(x: number, y: number, s: number) {
  const w = 15 * s;
  const h = 30 * s;
  return `M ${x} ${y - h} L ${x + w} ${y} L ${x - w} ${y} Z`;
}

export default function ForestTrail({ className }: { className?: string }) {
  const rootRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const pinRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const root = rootRef.current;
    if (!path || !root) return;

    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    const trees = Array.from(root.querySelectorAll<SVGGElement>(".trail-tree"));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      path.style.strokeDashoffset = "0";
      trees.forEach((t) => (t.style.opacity = "1"));
      if (pinRef.current) pinRef.current.style.opacity = "1";
      if (markerRef.current) markerRef.current.style.opacity = "0";
      return;
    }
    path.style.strokeDashoffset = `${len}`;

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
      const section = path.closest("section") ?? path;
      st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.9,
        onUpdate: (self) => {
          const p = self.progress;
          path.style.strokeDashoffset = `${len * (1 - p)}`;
          if (markerRef.current) {
            const pt = path.getPointAtLength(len * Math.min(p, 0.999));
            markerRef.current.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
            markerRef.current.style.opacity = p > 0.015 && p < 0.99 ? "1" : "0";
          }
          trees.forEach((t) => {
            const at = parseFloat(t.dataset.at || "0");
            const o = Math.max(0, Math.min(1, (p - at) / 0.05));
            t.style.opacity = `${o}`;
            t.style.transform = `translateY(${(1 - o) * 12}px)`;
          });
          if (pinRef.current) {
            const o = Math.max(0, Math.min(1, (p - 0.82) / 0.08));
            pinRef.current.style.opacity = `${o}`;
            pinRef.current.style.transform = `translateY(${(1 - o) * 14}px)`;
          }
        },
      });
    })();

    return () => {
      killed = true;
      st?.kill();
    };
  }, []);

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 1440 810"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-hidden
    >
      {/* faint full route (the trail that exists) */}
      <path d={PATH} stroke="var(--color-brass)" strokeWidth={1.4} strokeLinecap="round" strokeDasharray="1 9" opacity={0.28} vectorEffect="non-scaling-stroke" />
      {/* trees rising in as the walk progresses */}
      {TREES.map((t, i) => (
        <g key={i} className="trail-tree" data-at={t.at} style={{ opacity: 0, transformOrigin: `${t.x}px ${t.y}px`, transition: "none" }}>
          <path d={pine(t.x, t.y, t.s)} stroke="var(--color-brass-deep)" strokeWidth={1.3} strokeLinejoin="round" opacity={0.5} vectorEffect="non-scaling-stroke" />
          <line x1={t.x} y1={t.y} x2={t.x} y2={t.y + 7 * t.s} stroke="var(--color-brass-deep)" strokeWidth={1.3} opacity={0.5} vectorEffect="non-scaling-stroke" />
        </g>
      ))}
      {/* the drawn walk */}
      <path ref={pathRef} d={PATH} stroke="var(--color-brass)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ opacity: 0.85 }} />
      {/* destination pin (the estate) */}
      <g ref={pinRef} style={{ opacity: 0, transformOrigin: `${END.x}px ${END.y}px` }}>
        <line x1={END.x} y1={END.y - 22} x2={END.x} y2={END.y} stroke="var(--color-brass-deep)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        <circle cx={END.x} cy={END.y - 30} r={8} fill="none" stroke="var(--color-brass-deep)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        <circle cx={END.x} cy={END.y - 30} r={2.6} fill="var(--color-brass-deep)" />
      </g>
      {/* travelling marker */}
      <g ref={markerRef} style={{ opacity: 0 }}>
        <circle r={9} fill="var(--color-brass)" opacity={0.22} />
        <circle r={4} fill="var(--color-brass)" />
      </g>
    </svg>
  );
}
