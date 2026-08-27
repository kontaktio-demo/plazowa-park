import Link from "next/link";
import { NAV, SITE } from "@/lib/data/site";
import { Icon } from "./Icons";
import { LogoMark } from "./Logo";

export default function PageHeader() {
  return (
    <header className="band band-abyss sticky top-0 z-50 border-b border-lake-700">
      <div className="wrap flex h-(--nav-h) items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark width={24} height={24} className="text-lake-300" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1.15rem] font-semibold tracking-tight">Plażowa Park</span>
            <span className="t-meta-sm mt-1.5 text-lake-300/80">Głowno · Zalew Mrożyczka</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={`/${n.href}`} className="link-underline t-meta hover:text-lake-300">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={`tel:${SITE.phone.tel}`} className="hidden items-center gap-2 text-sm font-medium hover:text-lake-300 md:flex">
            <Icon.phone width={17} height={17} className="text-lake-300" />
            <span className="num">{SITE.phone.display}</span>
          </a>
          <Link href="/#mieszkania-i-domy" className="btn btn-sun btn-sm">
            Sprawdź dostępność
          </Link>
        </div>
      </div>
    </header>
  );
}
