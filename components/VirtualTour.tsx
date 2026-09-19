"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import tour from "@/lib/data/tour360.json";
import wnetrza from "@/lib/data/tour-wnetrza.json";
import { sectionEyebrow } from "@/lib/sections";
import { BLUR } from "@/lib/blur";
import { track } from "@/lib/track";
import WaveEdge from "./WaveEdge";
import type { Tour } from "./TourStage";

// Panorama razem z Marzipano (88 KB) wchodzi dopiero po kliknięciu w spacer.
// Wcześniej biblioteka jechała z resztą strony, także do osób, które spaceru
// nigdy nie uruchomiły.
const TourStage = dynamic(() => import("./TourStage"), { ssr: false });

const OSIEDLE = tour as Tour;
const WNETRZA = wnetrza as Record<string, Tour>;

/** Deweloper ma osobny spacer po wnętrzu dla każdego z sześciu typów lokalu. */
const TYPY = Object.keys(WNETRZA).sort();

export default function VirtualTour() {
  const [tryb, setTryb] = useState<"osiedle" | "wnetrze">("wnetrze");
  const [typ, setTyp] = useState(TYPY[0] ?? "1A");
  const [active, setActive] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const aktywny = tryb === "osiedle" ? OSIEDLE : (WNETRZA[typ] ?? OSIEDLE);

  // Focus wraca na przycisk, ktorym otwarto spacer. Nie przez ref: ten przycisk
  // znika na czas spaceru, a po zamknieciu wraca jako nowy wezel.
  const zamknij = useCallback((skad: "osiedle" | "wnetrze") => {
    setActive(false);
    requestAnimationFrame(() => wrapRef.current?.querySelector<HTMLElement>(`[data-start="${skad}"]`)?.focus());
  }, []);

  return (
    <section id="spacer" ref={wrapRef} className="band band-abyss relative min-h-svh w-full overflow-hidden">
      <WaveEdge from="var(--color-sand-200)" />

      {active ? (
        <TourStage
          aktywny={aktywny}
          tryb={tryb}
          typ={typ}
          typy={TYPY}
          onTyp={setTyp}
          onZamknij={() => zamknij(tryb)}
          wrapRef={wrapRef}
        />
      ) : (
        <>
          <Image
            src="/renders/tour-poster.webp"
            alt="Budynek osiedla Plażowa Park o zmierzchu w sosnowym lesie"
            fill
            sizes="(max-width: 767px) 200vw, 100vw"
            quality={75}
            placeholder="blur"
            blurDataURL={BLUR.tour}
            className="object-cover object-[center_38%]"
          />
          {/* Płaska warstwa bg-abyss/55 na całym kadrze schodziła renderowi
              ze średniej luminancji 75 do 38. Zamiast niej scrim wyłącznie pod
              kolumną tekstu plus wąski pas przy dolnej krawędzi. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(62%_46%_at_50%_50%,color-mix(in_srgb,var(--color-abyss)_74%,transparent)_0%,transparent_100%)]"
          />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-[30%] bg-linear-to-t from-abyss/75 to-transparent" />

          <div className="wrap relative flex min-h-svh flex-col items-center justify-center py-20 text-center sm:py-24">
            <p className="eyebrow [text-shadow:0_1px_14px_var(--color-abyss)]">{sectionEyebrow("spacer")}</p>
            <h2 className="t-display-l mt-6 max-w-3xl text-balance [text-shadow:0_2px_26px_var(--color-abyss)]">
              Wejdź do środka <span className="fg-accent">zanim powstanie</span>
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                data-start="wnetrze"
                onClick={() => {
                  setTryb("wnetrze");
                  setActive(true);
                  track("view_360", { tryb: "wnetrze", typ });
                }}
                className="btn btn-sun px-8 py-5 text-base"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5.5v13l11-6.5z" /></svg>
                Spacer po wnętrzu
              </button>
              <button
                type="button"
                data-start="osiedle"
                onClick={() => {
                  setTryb("osiedle");
                  setActive(true);
                  track("view_360", { tryb: "osiedle" });
                }}
                className="btn btn-ghost border-sand-50/40 px-8 py-5 text-base"
              >
                Spacer po osiedlu
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
