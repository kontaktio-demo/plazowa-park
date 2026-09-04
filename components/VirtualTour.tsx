"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import tour from "@/lib/data/tour360.json";
import wnetrza from "@/lib/data/tour-wnetrza.json";
import { UNITS } from "@/lib/data/units";
import { sectionEyebrow } from "@/lib/sections";
import { BLUR } from "@/lib/blur";
import { track } from "@/lib/track";
import WaveEdge from "./WaveEdge";

type SceneCfg = {
  id: string;
  name: string;
  faceSize: number;
  levels: { tileSize: number; size: number; fallbackOnly?: boolean }[];
  initialViewParameters: { yaw: number; pitch: number; fov: number };
};

type Tour = { base: string; scenes: SceneCfg[] };

const OSIEDLE = tour as Tour;
const WNETRZA = wnetrza as Record<string, Tour>;

/**
 * Deweloper ma osobny spacer po wnętrzu dla każdego z sześciu typów lokalu.
 * Podpisujemy je metrażem i liczbą pokoi, bo sam kod typu nic nabywcy nie mówi.
 */
const TYPY = Object.keys(WNETRZA)
  .sort()
  .map((typ) => {
    const u = UNITS.find((x) => {
      const reszta = x.name.split(".")[1] ?? "";
      return reszta.slice(0, -1) + reszta.slice(-1) === typ;
    });
    return {
      typ,
      opis: u ? `${Math.round(u.area)} m², ${u.rooms} pokoje` : "",
    };
  });

// nazwy scen przychodzą od dewelopera z niedomkniętymi spacjami i prefiksem
// [WIZ] przy ujęciach z aranżacją - prostujemy je, ale nic nie ukrywamy
const etykieta = (s: SceneCfg) => {
  const czysta = s.name.replace(/^\[WIZ\]\s*/, "").trim();
  return s.name.includes("[WIZ]") ? `${czysta} · aranżacja` : czysta;
};

export default function VirtualTour() {
  const [tryb, setTryb] = useState<"osiedle" | "wnetrze">("wnetrze");
  const [typ, setTyp] = useState(TYPY[0]?.typ ?? "1A");
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sceneObjsRef = useRef<any[]>([]);
  const indexRef = useRef(0);

  const aktywny = tryb === "osiedle" ? OSIEDLE : (WNETRZA[typ] ?? OSIEDLE);
  const SCENES = aktywny.scenes;

  useEffect(() => {
    if (!active || !stageRef.current) return;
    let disposed = false;

    (async () => {
      const mod = await import("marzipano");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Marzipano: any = (mod as any).default ?? mod;
      if (disposed || !stageRef.current) return;

      const viewer = new Marzipano.Viewer(stageRef.current, {
        controls: { mouseViewMode: "drag", scrollZoom: false },
        stage: { progressive: true },
      });
      viewerRef.current = viewer;

      sceneObjsRef.current = SCENES.map((data) => {
        const source = Marzipano.ImageUrlSource.fromString(
          `${aktywny.base}/tiles/${data.id}/{z}/{f}/{y}/{x}.jpg`,
          { cubeMapPreviewUrl: `${aktywny.base}/tiles/${data.id}/preview.jpg` }
        );
        const geometry = new Marzipano.CubeGeometry(data.levels);
        const limiter = Marzipano.RectilinearView.limit.traditional(data.faceSize, (100 * Math.PI) / 180);
        const view = new Marzipano.RectilinearView(data.initialViewParameters, limiter);
        const scene = viewer.createScene({ source, geometry, view, pinFirstLevel: true });
        return { scene, view };
      });

      indexRef.current = 0;
      setIndex(0);
      sceneObjsRef.current[0].scene.switchTo();
      setReady(true);
    })();

    return () => {
      disposed = true;
      try {
        viewerRef.current?.destroy();
      } catch {}
      viewerRef.current = null;
      sceneObjsRef.current = [];
    };
  }, [active, aktywny]);

  const goTo = useCallback((delta: number) => {
    const n = (indexRef.current + delta + SCENES.length) % SCENES.length;
    const obj = sceneObjsRef.current[n];
    if (!obj) return;
    indexRef.current = n;
    obj.view.setParameters(SCENES[n].initialViewParameters);
    obj.scene.switchTo({ transitionDuration: 900 });
    setIndex(n);
  }, [SCENES]);

  const zamknij = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    setActive(false);
    setReady(false);
  }, []);

  // bez tego spacer był pułapką: po wejściu nie było ani przycisku, ani skrótu
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") zamknij(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, zamknij]);

  const fullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  }, []);

  return (
    <section id="spacer" ref={wrapRef} className="band band-abyss relative min-h-svh w-full overflow-hidden">
      <WaveEdge from="var(--color-sand-200)" />

      {active ? (
        <>
          <div
            ref={stageRef}
            className="absolute inset-0 h-full w-full cursor-grab [&_canvas]:outline-none active:cursor-grabbing"
          />
          {!ready && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-sand-50/25 border-t-sand-50/80" />
            </div>
          )}
          <div className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}>
            <button
              type="button"
              onClick={fullscreen}
              aria-label="Pełny ekran"
              className="pointer-events-auto absolute right-5 top-[calc(var(--nav-h)+16px)] flex h-11 w-11 items-center justify-center border border-sand-50/25 bg-abyss/40 backdrop-blur-md transition-colors hover:border-clay-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            </button>

            <button
              type="button"
              onClick={zamknij}
              aria-label="Zakończ spacer"
              className="pointer-events-auto absolute right-5 top-[calc(var(--nav-h)+72px)] flex h-11 w-11 items-center justify-center border border-sand-50/25 bg-abyss/40 backdrop-blur-md transition-colors hover:border-clay-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {tryb === "wnetrze" && (
              <div className="pointer-events-auto absolute inset-x-0 top-[calc(var(--nav-h)+16px)] flex justify-center px-5">
                <div className="no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto border border-sand-50/20 bg-abyss/55 p-1 backdrop-blur-md">
                  {TYPY.map((t) => (
                    <button
                      key={t.typ}
                      type="button"
                      onClick={() => setTyp(t.typ)}
                      aria-pressed={typ === t.typ}
                      className={`flex-none px-3 py-2 text-sm transition-colors ${
                        typ === t.typ ? "bg-sun text-ink" : "hover:text-clay-300"
                      }`}
                    >
                      {t.typ}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pointer-events-auto absolute inset-x-0 bottom-6 flex justify-center px-5">
              <div className="flex items-center gap-1 border border-sand-50/20 bg-abyss/55 p-1 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => goTo(-1)}
                  aria-label="Poprzednie ujęcie"
                  className="flex h-11 w-11 items-center justify-center transition-colors hover:text-clay-300"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <div className="min-w-[10rem] px-3 text-center sm:min-w-[14rem]">
                  <div className="truncate text-sm font-medium">{etykieta(SCENES[index])}</div>
                  <div className="t-meta-sm fg-muted num mt-1">
                    {index + 1} / {SCENES.length}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => goTo(1)}
                  aria-label="Następne ujęcie"
                  className="flex h-11 w-11 items-center justify-center transition-colors hover:text-clay-300"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
                </button>
              </div>
            </div>
          </div>
        </>
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
                onClick={() => {
                  setTryb("wnetrze");
                  setActive(true);
                  track("view_360");
                }}
                className="btn btn-sun px-8 py-5 text-base"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5.5v13l11-6.5z" /></svg>
                Spacer po wnętrzu
              </button>
              <button
                type="button"
                onClick={() => {
                  setTryb("osiedle");
                  setActive(true);
                  track("view_360");
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
