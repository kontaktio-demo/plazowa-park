import { NAV, SITE, DEVELOPER } from "@/lib/data/site";
import { Icon } from "./Icons";
import { LogoMark } from "./Logo";

const legal = [
  { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
  { label: "Polityka cookies", href: "/polityka-cookies" },
  { label: "Regulamin serwisu", href: "/regulamin" },
];

const registry = [
  { l: "KRS", v: DEVELOPER.krs },
  { l: "NIP", v: DEVELOPER.nip },
  { l: "REGON", v: DEVELOPER.regon },
];

export default function Footer() {
  return (
    <footer className="band band-abyss">
      <div className="wrap py-14 sm:py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-12">
          <div>
            <p className="flex items-center gap-3">
              <LogoMark width={26} height={26} className="text-lake-300" />
              <span className="font-display text-2xl font-semibold">Plażowa Park</span>
            </p>
            <p className="t-meta-sm mt-3 text-lake-300/80">Głowno · Zalew Mrożyczka</p>
            <p className="t-body fg-muted mt-6 max-w-xs text-pretty">
              Kameralne osiedle 20 apartamentów w lesie, bezpośrednio przy Zalewie Mrożyczka w Głownie.
            </p>
            <a href="#lokale" className="btn btn-ghost btn-sm mt-6">
              Wybierz apartament <Icon.arrow width={16} height={16} />
            </a>
          </div>

          <nav>
            <p className="t-meta-sm fg-muted">Nawigacja</p>
            <ul className="mt-5 flex flex-col gap-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={`/${n.href}`} className="link-underline text-sm hover:text-lake-300">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="t-meta-sm fg-muted">Kontakt</p>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              <li>
                <a href={`tel:${SITE.phone.tel}`} className="link-underline num hover:text-lake-300">
                  {SITE.phone.display}
                </a>
              </li>
              <li className="wrap-break-word">
                <a href={`mailto:${SITE.email}`} className="link-underline hover:text-lake-300">
                  {SITE.email}
                </a>
              </li>
              <li className="fg-muted">
                {SITE.address.street}
                <br />
                {SITE.address.postal} {SITE.address.city}
              </li>
            </ul>
          </div>

          <div>
            <p className="t-meta-sm fg-muted">Deweloper</p>
            <p className="mt-5 text-sm">{DEVELOPER.name}</p>
            <p className="t-body fg-muted mt-1 text-sm">
              {DEVELOPER.street}
              <br />
              {DEVELOPER.postal} {DEVELOPER.city}
            </p>
            <dl className="mt-4 flex flex-col gap-1.5">
              {registry.map((r) => (
                <div key={r.l} className="t-meta-sm fg-muted flex gap-2">
                  <dt>{r.l}</dt>
                  <dd className="num">{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="bd mt-10 border-t pt-6 sm:mt-14 sm:pt-7">
          <p className="t-body fg-muted max-w-3xl text-sm text-pretty">
            Wizualizacje i ceny mają charakter poglądowy i nie stanowią oferty w rozumieniu art. 66 Kodeksu
            cywilnego. Wiążące dane, ceny i dostępność potwierdza biuro sprzedaży.
          </p>
          <div className="t-meta-sm fg-muted mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 {DEVELOPER.name}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {legal.map((l) => (
                <a key={l.href} href={l.href} className="link-underline hover:text-lake-300">
                  {l.label}
                </a>
              ))}
              <a
                href="https://kontaktio.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline hover:text-lake-300"
              >
                Projekt i realizacja: Kontaktio
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
