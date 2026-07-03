"use client";

import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/data/site";
import { INVESTMENT } from "@/lib/data/units";
import { Icon } from "./Icons";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const solid = scrolled || open;
  const light = !solid;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] transition-[background,box-shadow,backdrop-filter] duration-500 ${
        solid
          ? "bg-paper/85 shadow-[0_1px_0_rgba(23,23,15,0.08)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-[var(--nav-h)] items-center justify-between gap-4">
        <a href="#top" aria-label="Plażowa Park — strona główna" className="group flex items-center gap-2.5">
          <Logo light={light} />
          <span className="flex flex-col leading-none">
            <span className={`font-display text-[1.35rem] tracking-tight ${light ? "text-paper" : "text-pine"}`}>Plażowa Park</span>
            <span className={`mt-1 text-[0.62rem] font-medium uppercase tracking-[0.22em] ${light ? "text-brass-light" : "text-brass-deep"}`}>
              Głowno · Zalew Mrożyczka
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={`link-underline text-[0.92rem] font-medium ${light ? "text-paper/85 hover:text-paper" : "text-ink-soft hover:text-pine"}`}>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={`tel:${SITE.phone.tel}`} className={`hidden items-center gap-2 text-sm font-medium md:flex ${light ? "text-paper/85 hover:text-paper" : "text-ink-soft hover:text-pine"}`}>
            <Icon.phone width={17} height={17} className={light ? "text-brass-light" : "text-brass"} />
            <span className="num">{SITE.phone.display}</span>
          </a>
          <a href="#lokale" className="hidden btn btn-primary !py-2.5 !px-5 text-sm sm:inline-flex">
            Sprawdź dostępność
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-paper/25 px-1.5 text-[0.7rem] num">
              {INVESTMENT.available}
            </span>
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={open}
            className={`flex h-11 w-11 items-center justify-center rounded-full border lg:hidden ${light ? "border-paper/30 text-paper" : "border-ink/15 text-pine"}`}
          >
            {open ? <Icon.close width={20} height={20} /> : (
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                <path d="M3 7h18M3 12h18M3 17h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <div
        className={`grid overflow-hidden bg-paper/95 backdrop-blur-md transition-[grid-template-rows] duration-500 lg:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <nav className="container-x flex flex-col gap-1 py-4">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-ink/8 py-3.5 font-display text-2xl text-pine"
              >
                {n.label}
                <Icon.arrow width={18} height={18} className="text-brass" />
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2.5">
              <a href="#lokale" onClick={() => setOpen(false)} className="btn btn-primary">
                Sprawdź dostępność ({INVESTMENT.available})
              </a>
              <a href={`tel:${SITE.phone.tel}`} className="btn btn-ghost">
                <Icon.phone width={17} height={17} /> {SITE.phone.display}
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Logo({ light }: { light: boolean }) {
  return (
    <span className={`flex h-10 w-10 items-center justify-center rounded-full ${light ? "bg-paper/15 text-paper backdrop-blur-sm" : "bg-pine text-paper"}`}>
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 3 9v11a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1V9l-9-6Z" />
        <path d="M3.5 15c1.2 0 1.2-1 2.4-1s1.2 1 2.4 1" opacity="0.6" />
      </svg>
    </span>
  );
}
