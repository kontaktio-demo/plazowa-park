import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Strona nie znaleziona",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="band band-abyss flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p className="t-meta fg-accent">Błąd 404</p>
      <h1 className="t-display-l mt-6 max-w-2xl text-balance">
        Ta ścieżka <span className="fg-accent">nie prowadzi nad wodę</span>
      </h1>
      <p className="t-body-l fg-muted mx-auto mt-6 max-w-md text-pretty">
        Strona nie istnieje lub została przeniesiona. Wróć na stronę główną osiedla Plażowa Park.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-sun">
          Strona główna
        </Link>
        <Link href="/#kontakt" className="btn btn-ghost">
          Kontakt
        </Link>
      </div>
      <p className="t-meta-sm fg-muted num mt-10">
        {SITE.phone.display} · {SITE.email}
      </p>
    </main>
  );
}
