import type { ReactNode } from "react";
import { sectionEyebrow } from "@/lib/sections";

export default function SectionHeader({
  id,
  title,
  lead,
  className = "",
  children,
}: {
  id: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header className={className} data-reveal>
      <p className="eyebrow">{sectionEyebrow(id)}</p>
      <h2 className="t-display-l mt-5 text-balance sm:mt-6">{title}</h2>
      {lead && <p className="t-body-l fg-muted mt-5 max-w-xl text-pretty sm:mt-6">{lead}</p>}
      {children}
    </header>
  );
}
