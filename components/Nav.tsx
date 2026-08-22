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
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`band band-abyss fixed inset-x-0 top-0 z-60 transition-[background-color,backdrop-filter,box-shadow] duration-200 ${
          scrolled || open
            ? "bg-abyss/85 shadow-[0_1px_0_var(--color-lake-700)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="wrap flex h-(--nav-h) items-center gap-5">
          <a href="#top" aria-label="Plażowa Park - strona główna" className="flex flex-none items-center gap-3">
            <LogoMark width={26} height={26} className="text-lake-300" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[1.2rem] font-semibold tracking-tight">
                Plażowa Park
              </span>
              <span className="t-meta-sm mt-1.5 hidden text-lake-300/80 sm:block">Głowno · Zalew Mrożyczka</span>
            </span>
          </a>

          <nav className="hidden flex-1 items-center justify-center gap-x-7 xl:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="link-underline t-meta whitespace-nowrap hover:text-lake-300">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex flex-none items-center gap-3">
            <a
              href={`tel:${SITE.phone.tel}`}
              className="hidden items-center gap-2 text-sm font-medium hover:text-lake-300 xl:mr-4 xl:flex"
            >
              <Icon.phone width={17} height={17} className="text-lake-300" />
              <span className="num">{SITE.phone.display}</span>
            </a>
            <a href="#lokale" data-track="book_viewing" className="btn btn-sun btn-sm hidden sm:inline-flex">
              Sprawdź dostępność
              <span className="num ml-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-ink/15 px-1.5 text-[0.75rem] font-semibold">
                {INVESTMENT.available}
              </span>
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Zamknij menu" : "Otwórz menu"}
              aria-expanded={open}
              className="bd-strong flex h-11 w-11 flex-none items-center justify-center border xl:hidden"
            >
              {open ? (
                <Icon.close width={20} height={20} />
              ) : (
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round">
                  <path d="M3 7h18M3 12h18M3 17h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* pełnoekranowe menu - poza headerem, żeby backdrop-filter nie uwięził pozycji fixed */}
      <div
        className={`band band-abyss fixed inset-0 z-55 transition-opacity duration-300 xl:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Zamknij menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 h-full w-full cursor-default"
        />
        <nav className="wrap relative flex h-full flex-col pt-[calc(var(--nav-h)+24px)] pb-8">
          <ul className="flex flex-col">
            {NAV.map((n, i) => (
              <li
                key={n.href}
                className="bd border-b transition-[opacity,transform] duration-300"
                style={{
                  transitionDelay: open ? `${80 + i * 40}ms` : "0ms",
                  opacity: open ? 1 : 0,
                  transform: open ? "none" : "translateY(10px)",
                }}
              >
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className="t-display-m flex items-center justify-between py-4"
                >
                  {n.label}
                  <Icon.arrow width={20} height={20} className="text-lake-300" />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3 pt-8">
            <a href="#lokale" data-track="book_viewing" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className="btn btn-sun">
              Sprawdź dostępność ({INVESTMENT.available})
            </a>
            <a href={`tel:${SITE.phone.tel}`} tabIndex={open ? 0 : -1} className="btn btn-ghost">
              <Icon.phone width={17} height={17} /> {SITE.phone.display}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
