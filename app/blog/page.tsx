import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/lib/data/blog";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Blog - życie w Głownie nad Zalewem Mrożyczka",
  description:
    "Poradnik o życiu w Głownie: dojazd do Łodzi, Zalew Mrożyczka, koszty domu z pompą ciepła i zakup mieszkania. Blog inwestycji Plażowa Park.",
  alternates: { canonical: "/blog" },
};

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));

export default function BlogIndex() {
  return (
    <>
      <PageHeader />
      <main className="bg-paper">
        <div className="container-x py-14 sm:py-20">
          <p className="eyebrow">Blog</p>
          <h1 className="mt-4 max-w-2xl font-display text-[clamp(2.4rem,5.5vw,4rem)] leading-tight text-pine">
            Życie w Głownie, <span className="italic text-brass-deep">nad wodą i w lesie.</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty leading-relaxed text-muted">
            Praktyczne poradniki o okolicy, dojazdach, technologii i zakupie apartamentu w Plażowa Park.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {POSTS.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col overflow-hidden rounded-[16px] border border-ink/10 bg-paper transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                <div className="aspect-[16/10] overflow-hidden bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.cover} alt={p.coverAlt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" loading="lazy" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-xs text-faint">
                    <span>{fmtDate(p.date)}</span><span>·</span><span>{p.readMin} min czytania</span>
                  </div>
                  <h2 className="mt-2 font-display text-xl text-pine">{p.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brass-deep group-hover:text-pine">
                    Czytaj <Icon.arrow width={15} height={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
