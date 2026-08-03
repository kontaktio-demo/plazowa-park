import Image from "next/image";
import { Icon } from "./Icons";

const points = [
  { t: "Kameralne, bezpieczne osiedle", d: "Zaledwie 20 apartamentów w cichym, zielonym otoczeniu." },
  { t: "Las i woda tuż za progiem", d: "Ponad 100-letni las i Zalew Mrożyczka w zasięgu spaceru." },
  { t: "Przestrzeń dla dzieci", d: "Prywatny ogród i taras przy każdym apartamencie." },
];

export default function Lifestyle() {
  return (
    <section className="bg-sand py-20 sm:py-28">
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <figure className="overflow-hidden rounded-[18px] shadow-[var(--shadow-soft)]" data-reveal="up">
            <Image
              src="/lifestyle/rodzina.webp"
              alt="Rodzina spacerująca po trawie przed domem w otoczeniu sosnowego lasu"
              width={928}
              height={1152}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="h-auto w-full"
            />
          </figure>

          <div data-reveal="up">
            <p className="eyebrow">Życie w Plażowa Park</p>
            <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-pine">
              Dom, w którym rośnie <span className="italic text-brass-deep">rodzina.</span>
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-muted">
              Tu dzieci bawią się w ogrodzie, a las i woda zaczynają się tuż za progiem. Plażowa Park to spokojne,
              kameralne osiedle, w którym codziennie jest blisko do natury i do siebie nawzajem.
            </p>

            <ul className="mt-8 grid gap-4">
              {points.map((p) => (
                <li key={p.t} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-pine/8 text-pine">
                    <Icon.check width={18} height={18} />
                  </span>
                  <div>
                    <h3 className="font-medium text-ink">{p.t}</h3>
                    <p className="mt-0.5 text-sm leading-snug text-muted">{p.d}</p>
                  </div>
                </li>
              ))}
            </ul>

            <a href="#lokale" className="btn btn-primary mt-9">
              Wybierz apartament <Icon.arrow width={18} height={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
