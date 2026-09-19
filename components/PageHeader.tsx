import Link from "next/link";
import { NAV, SITE } from "@/lib/data/site";
import { INVESTMENT } from "@/lib/data/units";
import { Icon } from "./Icons";
import { LogoMark } from "./Logo";

export default function PageHeader({ aktywna }: { aktywna?: string }) {
  return (
    <header className="band band-sand bd sticky top-0 z-50 border-b bg-sand-50/94 backdrop-blur-md">
      <div className="wrap flex h-(--nav-h) items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark width={25} height={29} className="fg-accent" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1.15rem] font-semibold tracking-tight">Plażowa Park</span>
            <span className="t-meta-sm fg-muted mt-1.5">Głowno · Zalew Mrożyczka</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={`/${n.href}`}
              aria-current={n.href === `#${aktywna}` ? "true" : undefined}
              className={`link-underline t-meta hover:text-(--band-accent) ${n.href === `#${aktywna}` ? "fg-accent" : ""}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={`tel:${SITE.phone.tel}`} className="hidden items-center gap-2 text-sm font-medium hover:text-(--band-accent) md:flex">
            <Icon.phone width={17} height={17} className="fg-accent" />
            <span className="num">{SITE.phone.display}</span>
          </a>
          <Link href="/#mieszkania-i-domy" data-track="book_viewing" data-miejsce="nawigacja" className="btn btn-sun btn-sm">
            Sprawdź dostępność
            <span className="num ml-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-ink/15 px-1.5 text-[0.75rem] font-medium">
              {INVESTMENT.available}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
