import Link from "next/link";
import { NAV, SITE } from "@/lib/data/site";
import { Icon } from "./Icons";

export default function PageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <div className="container-x flex h-[var(--nav-h)] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pine text-paper">
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3 3 9v11a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1V9l-9-6Z" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1.35rem] tracking-tight text-pine">Plażowa Park</span>
            <span className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-brass-deep">Głowno · Zalew Mrożyczka</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.slice(0, 6).map((n) => (
            <Link key={n.href} href={`/${n.href}`} className="link-underline text-[0.92rem] font-medium text-ink-soft hover:text-pine">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={`tel:${SITE.phone.tel}`} className="hidden items-center gap-2 text-sm font-medium text-ink-soft hover:text-pine md:flex">
            <Icon.phone width={17} height={17} className="text-brass" />
            <span className="num">{SITE.phone.display}</span>
          </a>
          <Link href="/#lokale" className="btn btn-primary !py-2.5 !px-5 text-sm">Sprawdź dostępność</Link>
        </div>
      </div>
    </header>
  );
}
