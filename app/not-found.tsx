import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Strona nie znaleziona",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="grain relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-pine-deep px-6 text-center text-paper">
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,rgba(200,167,104,0.18),transparent_60%)]" />
      <div className="relative">
        <p className="eyebrow !text-brass-light justify-center" style={{ display: "inline-flex" }}>
          Błąd 404
        </p>
        <h1 className="mt-5 font-display text-[clamp(3rem,10vw,7rem)] leading-none text-paper">
          Zabłądziłeś <span className="block italic text-brass-light">w lesie.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-pretty leading-relaxed text-paper/75">
          Ta strona nie istnieje lub została przeniesiona. Wróć na stronę główną osiedla Plażowa Park.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-brass">Strona główna</Link>
          <Link href="/#kontakt" className="btn btn-light">Kontakt</Link>
        </div>
        <p className="mt-8 text-sm text-paper/50 num">{SITE.phone.display} · {SITE.email}</p>
      </div>
    </main>
  );
}
