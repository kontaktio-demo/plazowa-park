import Link from "next/link";
import { NAV, SITE, DEVELOPER, OPERATOR } from "@/lib/data/site";
import { OFERTA_TEKST } from "@/lib/unitCopy";
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
      {/* Odstęp u dołu asymetryczny: pod ostatnim wierszem nic już nie ma, więc
          80 px symetrycznego oddechu było pustą przestrzenią na końcu strony.
          Pasek CTA z telefonu znika przed stopką, nie trzeba pod niego rezerwować miejsca. */}
      <div className="wrap pt-14 pb-8 sm:pt-16 sm:pb-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-12">
          <div>
            <p className="flex items-center gap-3">
              <LogoMark width={28} height={32} className="text-clay-300" />
              <span className="font-display text-2xl font-semibold">Plażowa Park</span>
            </p>
            <p className="t-meta-sm mt-3 text-clay-300/80">Głowno · Zalew Mrożyczka</p>
            <p className="t-body fg-muted mt-6 max-w-xs text-pretty">
              Kameralne osiedle w lesie, bezpośrednio przy Zalewie Mrożyczka w Głownie:{" "}
              {OFERTA_TEKST} z prywatnym ogrodem.
            </p>
            <Link href="/#mieszkania-i-domy" className="btn btn-ghost btn-sm mt-6">
              Zobacz mieszkania i domy <Icon.arrow width={16} height={16} />
            </Link>
          </div>

          <nav>
            <p className="t-meta-sm fg-muted">Nawigacja</p>
            <ul className="mt-5 flex flex-col gap-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={`/${n.href}`} className="link-underline text-sm hover:text-clay-300">
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
                <a href={`tel:${SITE.phone.tel}`} className="link-underline num hover:text-clay-300">
                  {SITE.phone.display}
                </a>
              </li>
              <li className="wrap-break-word">
                <a href={`mailto:${SITE.email}`} className="link-underline hover:text-clay-300">
                  {SITE.email}
                </a>
              </li>
              <li className="fg-muted">
                {SITE.address.street}
                <br />
                {SITE.address.postal} {SITE.address.city}
              </li>
              <li>
                <a
                  href={SITE.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="klik_facebook"
                  data-miejsce="stopka"
                  className="link-underline inline-flex items-center gap-2 hover:text-clay-300"
                >
                  <Icon.facebook width={16} height={16} />
                  Facebook
                </a>
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
            Wizualizacje i plan osiedla mają charakter poglądowy i nie stanowią oferty w rozumieniu
            art. 66 Kodeksu cywilnego. Podane ceny są aktualnymi cenami ofertowymi brutto i aktualizujemy
            je przy każdej zmianie. Dostępność mieszkań i domów potwierdza biuro sprzedaży.
          </p>
          <div className="t-meta-sm fg-muted mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {/* Bez roku: strony są statyczne, więc każdy wpisany rok zastygnie na dacie builda. */}
              <p>© {DEVELOPER.name}</p>
              <p className="mt-1">Serwis prowadzi {OPERATOR.name}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {legal.map((l) => (
                <a key={l.href} href={l.href} className="link-underline hover:text-clay-300">
                  {l.label}
                </a>
              ))}
              <a
                href="https://kontaktio.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline hover:text-clay-300"
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
