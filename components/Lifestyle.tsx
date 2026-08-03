import Image from "next/image";
import { Icon } from "./Icons";

const points = [
  { t: "Kameralne, bezpieczne osiedle", d: "Zaledwie 20 apartamentów w cichym, zielonym otoczeniu." },
  { t: "Las i woda tuż za progiem", d: "Ponad 100-letni las i Zalew Mrożyczka w zasięgu spaceru." },
  { t: "Przestrzeń dla dzieci", d: "Prywatny ogród i taras przy każdym apartamencie." },
];

export default function Lifestyle() {
  return (
    <section className="relative overflow-hidden bg-sand py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute right-[-4%] top-[-6%]">
          <div className="glow-drift h-[42vh] w-[42vh] rounded-full blur-[90px]" style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--color-brass) 16%, transparent), transparent 72%)" }} />
        </div>
      </div>
      <div className="container-x relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <figure className="overflow-hidden rounded-[18px] shadow-[var(--shadow-soft)]" data-reveal="scale">
            <Image
              src="/lifestyle/rodzina.webp"
              alt="Rodzina przed apartamentem Plażowa Park w sosnowym lesie nad Zalewem Mrożyczka w Głownie"
              width={928}
              height={1152}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="h-auto w-full"
            />
          </figure>

          <div data-reveal="right">
            <p className="eyebrow">Życie w Plażowa Park</p>
            <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-pine">
              Twoja rodzinna przestrzeń <span className="italic text-brass-deep">blisko natury.</span>
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-muted">
              W Plażowa Park dzieci bawią się we własnym ogrodzie, a las i Zalew Mrożyczka zaczynają się tuż za
              progiem. To spokojne, kameralne osiedle stworzone z myślą o rodzinach, które cenią bliskość natury
              i codzienny komfort.
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
