"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/data/site";
import { Icon } from "./Icons";

export default function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nearBottom = y + window.innerHeight > document.body.scrollHeight - 700;
      setShow(y > window.innerHeight * 0.9 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-50 flex gap-2.5 transition-all duration-500 lg:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <a href={`tel:${SITE.phone.tel}`} className="btn btn-light flex-none !px-4 shadow-[var(--shadow-lift)]" aria-label="Zadzwoń">
        <Icon.phone width={18} height={18} />
      </a>
      <a href="#lokale" className="btn btn-primary flex-1 shadow-[var(--shadow-lift)]">
        Sprawdź dostępność
      </a>
    </div>
  );
}
