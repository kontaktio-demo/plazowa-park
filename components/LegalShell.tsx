import Link from "next/link";
import Footer from "./Footer";
import { Icon } from "./Icons";
import { LogoMark } from "./Logo";

export default function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-ink/10 bg-paper/90 backdrop-blur-md">
        <div className="container-x flex h-[var(--nav-h)] items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-pine text-paper">
              <LogoMark width={19} height={19} />
            </span>
            <span className="font-display text-xl font-semibold text-pine">Plażowa Park</span>
          </Link>
          <Link href="/" className="btn btn-ghost !py-2.5 text-sm">
            <Icon.arrow width={16} height={16} className="rotate-180" /> Strona główna
          </Link>
        </div>
      </header>

      <main className="bg-paper py-16 sm:py-24">
        <div className="container-narrow">
          <p className="eyebrow">Dokumenty</p>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-tight text-pine">{title}</h1>
          <p className="mt-3 text-sm text-faint">Ostatnia aktualizacja: {updated}</p>
          <div className="legal mt-10">{children}</div>
        </div>
      </main>

      <Footer />
    </>
  );
}
