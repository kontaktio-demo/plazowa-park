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
      <header className="band band-sand bd border-b">
        <div className="wrap flex h-(--nav-h) items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark width={22} height={22} className="fg-accent" />
            <span className="font-display text-lg font-semibold">Plażowa Park</span>
          </Link>
          <Link href="/" className="btn btn-ghost btn-sm">
            <Icon.arrow width={16} height={16} className="rotate-180" /> Strona główna
          </Link>
        </div>
      </header>

      <main className="band band-sand sec">
        <div className="wrap-narrow">
          <p className="eyebrow">Dokumenty</p>
          <h1 className="t-display-l mt-6 text-balance">{title}</h1>
          <p className="t-meta-sm fg-muted mt-4">Ostatnia aktualizacja: {updated}</p>
          <div className="legal mt-10">{children}</div>
        </div>
      </main>

      <Footer />
    </>
  );
}
