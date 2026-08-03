"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "./Icons";

const TOUR_URL = "https://quptos-web-data.sensevr.pl/ver_2_3/C1/I214/invest_tour360/v1/app-files/index.html";

export default function VirtualTour() {
  const [active, setActive] = useState(false);

  return (
    <section id="spacer" className="bg-pine-deep py-20 text-paper sm:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between" data-reveal="up">
          <div className="max-w-2xl">
            <p className="eyebrow !text-brass-light">03 - Spacer 360</p>
            <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-paper">
              Zwiedź osiedle <span className="italic text-brass-light">w 360 stopni.</span>
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-paper/70">
              Przejdź się uliczkami Plażowa Park, zajrzyj między domy i zobacz ogrody oraz otoczenie. To
              autentyczny spacer 360 stopni przygotowany przez dewelopera.
            </p>
          </div>
          <a
            href={TOUR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-none items-center gap-2 text-sm font-medium text-brass-light hover:text-paper"
          >
            Otwórz w pełnym oknie <Icon.arrow width={16} height={16} />
          </a>
        </div>

        <div className="mt-10 overflow-hidden rounded-[18px] border border-paper/12 bg-black/30 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]" data-reveal="up">
          <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
            {active ? (
              <iframe
                src={TOUR_URL}
                title="Wirtualny spacer 360 stopni po osiedlu Plażowa Park"
                className="absolute inset-0 h-full w-full"
                allow="fullscreen; accelerometer; gyroscope"
                loading="lazy"
              />
            ) : (
              <button
                type="button"
                onClick={() => setActive(true)}
                aria-label="Rozpocznij wirtualny spacer 360 stopni"
                className="group absolute inset-0 h-full w-full"
              >
                <Image
                  src="/renders/tour-poster.webp"
                  alt="Osiedle Plażowa Park - podgląd wirtualnego spaceru 360 stopni"
                  fill
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25" />
                <span className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold tracking-wide text-paper backdrop-blur-sm">
                  360 stopni
                </span>
                <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper/95 text-pine-deep shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5.5v13l11-6.5z" /></svg>
                  </span>
                  <span className="rounded-full bg-black/45 px-4 py-1.5 text-sm font-medium text-paper backdrop-blur-sm">
                    Rozpocznij spacer
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
        <p className="mt-5 text-xs text-paper/45">
          Wirtualny spacer stanu dewelopera (SenseVR). Materiał poglądowy prezentujący osiedle i najbliższe otoczenie.
        </p>
      </div>
    </section>
  );
}
