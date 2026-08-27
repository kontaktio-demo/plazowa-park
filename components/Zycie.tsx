import Image from "next/image";
import SectionHeader from "./SectionHeader";
import { BLUR } from "@/lib/blur";
import { Icon } from "./Icons";

const points = [
  { t: "Kameralne osiedle", d: "Zaledwie 20 apartamentów w cichym, zielonym otoczeniu." },
  { t: "Las i woda za progiem", d: "Ponad 100-letni las i Zalew Mrożyczka w zasięgu spaceru." },
  { t: "Przestrzeń dla dzieci", d: "Prywatny ogród i taras przy każdym apartamencie." },
];

export default function Zycie() {
  return (
    <section id="zycie" className="band band-deep sec overflow-hidden">
      <div className="wrap">
        <div className="grid items-center gap-8 lg:grid-cols-[60fr_40fr] lg:gap-0">
          <figure className="relative aspect-16/10 w-full sm:aspect-7/5 lg:aspect-3/2" data-reveal>
            <Image
              src="/renders/zycie.webp"
              alt="Taras i prywatny ogród apartamentu Plażowa Park w porannym świetle"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              placeholder="blur"
              blurDataURL={BLUR.zycie}
              className="object-cover"
            />
          </figure>

          <div className="bd relative z-10 border bg-deep p-6 sm:p-9 lg:-ml-16" data-reveal>
            <SectionHeader
              id="zycie"
              title={
                <>
                  Dom nad wodą <span className="fg-accent">na co dzień</span>
                </>
              }
            />
            <p className="t-body fg-muted mt-6 text-pretty">
              Dzieci bawią się we własnym ogrodzie, a las i Zalew Mrożyczka zaczynają się tuż za progiem. Kameralne
              osiedle dla tych, którzy cenią bliskość natury i codzienny komfort.
            </p>

            <ul className="mt-8 flex flex-col">
              {points.map((p) => (
                <li key={p.t} className="bd flex items-start gap-4 border-t py-4">
                  <Icon.check width={18} height={18} className="mt-1 flex-none text-lake-300" />
                  <div>
                    <h3 className="font-medium">{p.t}</h3>
                    <p className="t-body fg-muted mt-0.5">{p.d}</p>
                  </div>
                </li>
              ))}
            </ul>

            <a href="#mieszkania-i-domy" className="btn btn-ghost mt-8">
              Wybierz apartament <Icon.arrow width={18} height={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
