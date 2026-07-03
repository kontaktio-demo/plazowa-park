"use client";

import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/data/site";
import { INVESTMENT } from "@/lib/data/units";
import { Icon } from "./Icons";
import { LogoMark } from "./Logo";

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
    <>
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
            <span className={`font-display text-[1.3rem] font-semibold tracking-tight ${light ? "text-paper" : "text-pine"}`}>Plażowa Park</span>
            <span className={`mt-1 text-[0.62rem] font-medium uppercase tracking-[0.22em] ${light ? "text-brass-light" : "text-brass-deep"}`}>
              Głowno · Zalew Mrożyczka
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-x-6 xl:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={`link-underline whitespace-nowrap text-[0.9rem] font-medium ${light ? "text-paper/85 hover:text-paper" : "text-ink-soft hover:text-pine"}`}>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <a href={`tel:${SITE.phone.tel}`} className={`hidden items-center gap-2 whitespace-nowrap text-sm font-medium xl:flex ${light ? "text-paper/85 hover:text-paper" : "text-ink-soft hover:text-pine"}`}>
            <Icon.phone width={17} height={17} className={light ? "text-brass-light" : "text-brass"} />
            <span className="num whitespace-nowrap">{SITE.phone.display}</span>
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
            className={`flex h-11 w-11 flex-none items-center justify-center rounded-full border xl:hidden ${light ? "border-paper/30 text-paper" : "border-ink/15 text-pine"}`}
          >
            {open ? <Icon.close width={20} height={20} /> : (
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                <path d="M3 7h18M3 12h18M3 17h18" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>

      {/* mobile / tablet menu — full-screen overlay (outside header so `fixed` is not trapped by its backdrop-filter) */}
      <div
        className={`fixed inset-x-0 bottom-0 top-[var(--nav-h)] z-[55] bg-paper transition-[opacity,transform] duration-300 xl:hidden ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav className="container-x flex h-full flex-col overflow-y-auto py-6">
          <div className="flex flex-col">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-ink/8 py-4 font-display text-[1.7rem] font-semibold text-pine"
              >
                {n.label}
                <Icon.arrow width={20} height={20} className="text-brass" />
              </a>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-2.5 pt-8">
            <a href="#lokale" onClick={() => setOpen(false)} className="btn btn-primary">
              Sprawdź dostępność ({INVESTMENT.available})
            </a>
            <a href={`tel:${SITE.phone.tel}`} className="btn btn-ghost">
              <Icon.phone width={17} height={17} /> {SITE.phone.display}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}

function Logo({ light }: { light: boolean }) {
  return (
    <span className={`flex h-10 w-10 items-center justify-center rounded-[11px] ${light ? "bg-paper/15 text-paper backdrop-blur-sm" : "bg-pine text-paper"}`}>
      <LogoMark width={22} height={22} />
    </span>
  );
}
