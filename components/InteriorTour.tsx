"use client";

import { useEffect, useRef, useState } from "react";
import { INTERIOR_TOUR } from "@/lib/data/site";
import { Icon } from "./Icons";

type Tab = "spacer" | (typeof INTERIOR_TOUR)[number]["key"];

export default function InteriorTour() {
  const [tab, setTab] = useState<Tab>("spacer");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (tab === "spacer") v.play().catch(() => {});
    else v.pause();
  }, [tab]);

  const active = INTERIOR_TOUR.find((r) => r.key === tab);

  return (
    <section id="wnetrza" className="bg-pine-deep py-20 text-paper sm:py-28">
      <div className="container-x">
        <header className="max-w-2xl" data-reveal="up">
          <p className="eyebrow !text-brass-light">03 — Wnętrza</p>
          <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-paper">
            Wejdź do środka. <span className="italic text-brass-light">Wirtualny spacer.</span>
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-paper/70">
            Otwarta strefa dzienna z kominkiem, kuchnia z wyspą i panoramiczne okna z widokiem na las. Przełączaj
            pomieszczenia lub odtwórz płynne przejście przez apartament.
          </p>
        </header>

        <div className="mt-10" data-reveal="up">
          {/* tabs */}
          <div className="mb-5 flex flex-wrap gap-2">
            <TabButton active={tab === "spacer"} onClick={() => setTab("spacer")}>
              <Icon.arrow width={15} height={15} /> Spacer wideo
            </TabButton>
            {INTERIOR_TOUR.map((r) => (
              <TabButton key={r.key} active={tab === r.key} onClick={() => setTab(r.key)}>
                {r.label}
              </TabButton>
            ))}
          </div>

          {/* stage */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-black/40 sm:aspect-[16/9]">
            <video
              ref={videoRef}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${tab === "spacer" ? "opacity-100" : "opacity-0"}`}
              poster="/video/poster-walkthrough.webp"
              muted
              loop
              playsInline
              preload="none"
            >
              <source src="/video/walkthrough.mp4" type="video/mp4" />
            </video>

            {INTERIOR_TOUR.map((r) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={r.key}
                src={r.src}
                alt={`${r.label} — apartament Plażowa Park`}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${tab === r.key ? "opacity-100" : "opacity-0"}`}
                loading="lazy"
              />
            ))}

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 sm:p-7">
              <p className="font-display text-2xl text-paper">
                {tab === "spacer" ? "Przejście przez apartament" : active?.label}
              </p>
              <p className="mt-1 max-w-lg text-sm text-paper/75">
                {tab === "spacer" ? "Płynne, kinowe ujęcie strefy dziennej z widokiem na las." : active?.note}
              </p>
            </div>

            <span className="absolute right-4 top-4 rounded-full bg-black/35 px-3 py-1 text-[0.7rem] font-medium text-paper/85 backdrop-blur-sm">
              Wizualizacja
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
        active ? "border-brass-light bg-brass-light text-pine-deep" : "border-paper/20 text-paper/80 hover:border-paper/50"
      }`}
    >
      {children}
    </button>
  );
}
