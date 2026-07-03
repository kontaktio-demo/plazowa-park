import type { SVGProps, FC } from "react";

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type P = SVGProps<SVGSVGElement>;

export const Icon = {
  heat: (p: P) => (
    <svg {...base} {...p}><path d="M12 3c1.5 2.5-.5 4 0 6 .4 1.6 2 2.3 2 4a4 4 0 1 1-6.5-3.1C9 8 12 7 12 3Z" /></svg>
  ),
  floor: (p: P) => (
    <svg {...base} {...p}><path d="M3 20h18M6 20V9m4 11V9m4 11V9m4 11V9M4 9h16l-2-5H6L4 9Z" /></svg>
  ),
  air: (p: P) => (
    <svg {...base} {...p}><path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h9a2.5 2.5 0 1 1-2.5 2.5" /></svg>
  ),
  solar: (p: P) => (
    <svg {...base} {...p}><path d="M12 2v2m0 16v2M4 12H2m20 0h-2M5 5 4 4m15 1 1-1M5 19l-1 1m15-1 1 1M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" /></svg>
  ),
  window: (p: P) => (
    <svg {...base} {...p}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M12 3v18M4 12h16" /></svg>
  ),
  brick: (p: P) => (
    <svg {...base} {...p}><path d="M3 7h18M3 12h18M3 17h18M7 7v5m5-5v5m5-5v5M4.5 12v5m5-5v5m5-5v5m5-5v5" /></svg>
  ),
  garden: (p: P) => (
    <svg {...base} {...p}><path d="M12 21c0-4 0-6 0-9m0 0c-3 0-5-2-5-5 3 0 5 2 5 5Zm0 0c0-3 2-5 5-5 0 3-2 5-5 5ZM4 21h16" /></svg>
  ),
  car: (p: P) => (
    <svg {...base} {...p}><path d="M4 16v2m16-2v2M5 16h14l-1.2-4.5A2 2 0 0 0 15.9 10H8.1a2 2 0 0 0-1.9 1.5L5 16Zm0 0a2 2 0 0 1-1-1.7V13a2 2 0 0 1 2-2m11 5a2 2 0 0 0 2-1.7V13a2 2 0 0 0-2-2M7.5 16v.5m9-.5v.5" /></svg>
  ),
  phone: (p: P) => (
    <svg {...base} {...p}><path d="M4.5 4.5c-.6 0-1 .4-1 1C3.5 13 11 20.5 18.5 20.5c.6 0 1-.4 1-1v-3l-3.5-1.5-1.7 1.7c-2.2-1-4.2-3-5.2-5.2L10.8 9 9.5 5.5 6.5 4.5h-2Z" /></svg>
  ),
  mail: (p: P) => (
    <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></svg>
  ),
  pin: (p: P) => (
    <svg {...base} {...p}><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
  ),
  arrow: (p: P) => (
    <svg {...base} {...p}><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
  ),
  arrowDown: (p: P) => (
    <svg {...base} {...p}><path d="M12 5v14m-6-6 6 6 6-6" /></svg>
  ),
  close: (p: P) => (
    <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
  ),
  check: (p: P) => (
    <svg {...base} {...p}><path d="m4 12 5 5L20 6" /></svg>
  ),
  plus: (p: P) => (
    <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
  ),
  ruler: (p: P) => (
    <svg {...base} {...p}><rect x="3" y="8" width="18" height="8" rx="1" /><path d="M7 8v3m4-3v4m4-4v3" /></svg>
  ),
  bed: (p: P) => (
    <svg {...base} {...p}><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 14h18M3 18v2m18-2v2M7 10V8a1 1 0 0 1 1-1h3v3" /></svg>
  ),
  tree: (p: P) => (
    <svg {...base} {...p}><path d="M12 22v-5m0 0 4-3h-2.5L16 11h-2l2-3h-1.6L12 4 9.6 8H8l2 3H8l2.5 3H8l4 3Z" /></svg>
  ),
  wave: (p: P) => (
    <svg {...base} {...p}><path d="M3 8c1.5 0 1.5-1.5 3-1.5S7.5 8 9 8s1.5-1.5 3-1.5S13.5 8 15 8s1.5-1.5 3-1.5S19.5 8 21 8M3 13c1.5 0 1.5-1.5 3-1.5S7.5 13 9 13s1.5-1.5 3-1.5S13.5 13 15 13s1.5-1.5 3-1.5S19.5 13 21 13M3 18c1.5 0 1.5-1.5 3-1.5S7.5 18 9 18s1.5-1.5 3-1.5S13.5 18 15 18s1.5-1.5 3-1.5S19.5 18 21 18" /></svg>
  ),
  whatsapp: (p: P) => (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.86 9.86 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm5.8 14.06c-.24.68-1.42 1.32-1.95 1.36-.5.05-.97.24-3.28-.7-2.77-1.1-4.53-3.96-4.67-4.15-.14-.19-1.12-1.49-1.12-2.84 0-1.35.71-2.02.96-2.29.25-.27.55-.34.73-.34.18 0 .37 0 .53.01.17.01.4-.06.62.48.24.55.81 1.9.88 2.04.07.14.12.3.02.48-.1.19-.14.3-.28.47-.14.16-.3.36-.42.49-.14.14-.29.29-.12.57.17.28.74 1.22 1.59 1.98 1.1.98 2.02 1.28 2.3 1.42.28.14.45.12.61-.07.16-.19.7-.82.89-1.1.18-.28.37-.23.62-.14.25.09 1.6.76 1.87.9.28.14.46.21.53.32.07.12.07.66-.17 1.34Z" /></svg>
  ),
};

export const FeatureIcon = ({ name, ...p }: { name: string } & P) => {
  const C = (Icon as Record<string, FC<P>>)[name] ?? Icon.check;
  return <C {...p} />;
};
