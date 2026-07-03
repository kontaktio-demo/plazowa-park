import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, postBySlug } from "@/lib/data/blog";
import { SITE } from "@/lib/data/site";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import { Icon } from "@/components/Icons";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) return { title: "Artykuł nie znaleziony" };
  return {
    title: p.title,
    description: p.excerpt,
    keywords: p.keywords,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: "article", title: p.title, description: p.excerpt, images: [p.cover], publishedTime: p.date },
  };
}

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) notFound();

  const others = POSTS.filter((x) => x.slug !== p.slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    image: `${SITE.url}${p.cover}`,
    datePublished: p.date,
    dateModified: p.date,
    inLanguage: "pl-PL",
    author: { "@type": "Organization", name: "KS Prestige Development" },
    publisher: { "@id": `${SITE.url}/#developer` },
    mainEntityOfPage: `${SITE.url}/blog/${slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader />
      <main className="bg-paper">
        <article className="container-narrow py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-sm text-muted" aria-label="breadcrumb">
            <Link href="/" className="hover:text-pine">Strona główna</Link><span>/</span>
            <Link href="/blog" className="hover:text-pine">Blog</Link><span>/</span>
            <span className="text-ink">{p.title}</span>
          </nav>

          <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-brass-deep">
            <span>{fmtDate(p.date)}</span><span>·</span><span>{p.readMin} min czytania</span>
          </div>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-tight text-pine">{p.title}</h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">{p.excerpt}</p>

          <div className="mt-8 overflow-hidden rounded-[16px] border border-ink/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.cover} alt={p.coverAlt} className="aspect-[16/9] w-full object-cover" />
          </div>

          <div className="legal mt-10">
            {p.body.map((b, i) => {
              if ("h2" in b) return <h2 key={i}>{b.h2}</h2>;
              if ("ul" in b) return <ul key={i}>{b.ul.map((li, j) => <li key={j}>{li}</li>)}</ul>;
              return <p key={i}>{b.p}</p>;
            })}
          </div>

          <div className="mt-12 rounded-[16px] border border-ink/10 bg-pine p-7 text-paper">
            <h2 className="font-display text-2xl">Zainteresowała Cię inwestycja?</h2>
            <p className="mt-2 max-w-lg text-paper/75">Zobacz dostępne apartamenty Plażowa Park lub umów prezentację osiedla nad Zalewem Mrożyczka.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/#lokale" className="btn btn-brass !py-2.5 text-sm">Zobacz lokale <Icon.arrow width={16} height={16} /></Link>
              <Link href="/#kontakt" className="btn btn-light !py-2.5 text-sm">Umów prezentację</Link>
            </div>
          </div>

          <div className="mt-12 border-t border-ink/10 pt-8">
            <h2 className="font-display text-2xl text-pine">Przeczytaj także</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {others.map((o) => (
                <Link key={o.slug} href={`/blog/${o.slug}`} className="group flex gap-4 rounded-[12px] border border-ink/10 p-4 hover:border-pine/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.cover} alt={o.coverAlt} className="h-16 w-20 flex-none rounded-[8px] object-cover" loading="lazy" />
                  <span className="font-display text-lg leading-tight text-pine group-hover:text-brass-deep">{o.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
