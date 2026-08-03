"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import tour from "@/lib/data/tour360.json";
import { Icon } from "./Icons";

type SceneCfg = {
  id: string;
  name: string;
  faceSize: number;
  levels: { tileSize: number; size: number; fallbackOnly?: boolean }[];
  initialViewParameters: { yaw: number; pitch: number; fov: number };
};

const SCENES = tour.scenes as SceneCfg[];

export default function VirtualTour() {
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [hint, setHint] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sceneObjsRef = useRef<any[]>([]);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!active || !stageRef.current) return;
    let disposed = false;

    (async () => {
      const mod = await import("marzipano");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Marzipano: any = (mod as any).default ?? mod;
      if (disposed || !stageRef.current) return;

      const viewer = new Marzipano.Viewer(stageRef.current, {
        controls: { mouseViewMode: "drag" },
        stage: { progressive: true },
      });
      viewerRef.current = viewer;

      sceneObjsRef.current = SCENES.map((data) => {
        const source = Marzipano.ImageUrlSource.fromString(
          `${tour.base}/tiles/${data.id}/{z}/{f}/{y}/{x}.jpg`,
          { cubeMapPreviewUrl: `${tour.base}/tiles/${data.id}/preview.jpg` }
        );
        const geometry = new Marzipano.CubeGeometry(data.levels);
        const limiter = Marzipano.RectilinearView.limit.traditional(data.faceSize, (100 * Math.PI) / 180);
        const view = new Marzipano.RectilinearView(data.initialViewParameters, limiter);
        const scene = viewer.createScene({ source, geometry, view, pinFirstLevel: true });
        return { scene, view };
      });

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
  }, [active]);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setHint(false), 4500);
    return () => clearTimeout(t);
  }, [ready]);

  const goTo = useCallback((delta: number) => {
    const n = (indexRef.current + delta + SCENES.length) % SCENES.length;
    const obj = sceneObjsRef.current[n];
    if (!obj) return;
    indexRef.current = n;
    // always present each scene at its intended framing
    obj.view.setParameters(SCENES[n].initialViewParameters);
    obj.scene.switchTo({ transitionDuration: 900 });
    setIndex(n);
    setHint(false);
  }, []);

  const fullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  }, []);

  return (
    <section id="spacer" className="relative overflow-hidden bg-pine-deep py-20 text-paper sm:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="deco-grid-dark absolute inset-0" />
        <div className="absolute left-[-6%] top-[18%]">
          <div className="glow-drift h-[36vh] w-[36vh] rounded-full blur-[90px]" style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--color-brass) 15%, transparent), transparent 70%)" }} />
        </div>
      </div>
      <div className="container-x relative z-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between" data-reveal="up">
          <div className="max-w-2xl">
            <p className="eyebrow !text-brass-light">03 - Spacer 360</p>
            <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-paper">
              Zwiedź osiedle <span className="italic text-brass-light">w 360 stopni.</span>
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-paper/70">
              Przejdź się uliczkami osiedla Plażowa Park, zajrzyj między budynki i zobacz ogrody oraz najbliższe
              otoczenie. Wirtualny spacer 360 stopni przygotował deweloper. To autentyczny widok inwestycji.
            </p>
          </div>
        </div>

        <div
          ref={wrapRef}
          className="group relative mt-10 overflow-hidden rounded-[18px] border border-paper/12 bg-black shadow-[0_30px_80px_-40px_rgba(0,0,0,0.85)]"
          data-reveal="up"
        >
          <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
            {active ? (
              <>
                <div ref={stageRef} onPointerDown={() => setHint(false)} className="absolute inset-0 h-full w-full cursor-grab [&_canvas]:outline-none active:cursor-grabbing" />

                {!ready && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black">
                    <span className="h-8 w-8 animate-spin rounded-full border-2 border-paper/25 border-t-paper/80" />
                  </div>
                )}

                {/* minimalist controls */}
                <div className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}>
                  <span className={`absolute left-1/2 top-6 -translate-x-1/2 rounded-full bg-black/40 px-4 py-1.5 text-xs font-medium text-paper backdrop-blur-md transition-opacity duration-700 ${hint ? "opacity-100" : "opacity-0"}`}>
                    Przeciągnij, aby się rozejrzeć
                  </span>
                  <button
                    type="button"
                    onClick={fullscreen}
                    aria-label="Pełny ekran"
                    className="pointer-events-auto absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-paper backdrop-blur-md transition hover:bg-black/55"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
                    </svg>
                  </button>

                  <div className="pointer-events-auto absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/40 p-1 pr-1.5 text-paper backdrop-blur-md">
                    <button
                      type="button"
                      onClick={() => goTo(-1)}
                      aria-label="Poprzednie ujęcie"
                      className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-paper/15"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <div className="min-w-[9.5rem] px-2 text-center sm:min-w-[12rem]">
                      <div className="truncate text-sm font-medium leading-tight">{SCENES[index].name}</div>
                      <div className="text-[0.65rem] uppercase tracking-[0.16em] text-paper/55 num">{index + 1} / {SCENES.length}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => goTo(1)}
                      aria-label="Następne ujęcie"
                      className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-paper/15"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setActive(true)}
                aria-label="Rozpocznij wirtualny spacer 360 stopni"
                className="group/btn absolute inset-0 h-full w-full text-left"
              >
                <Image
                  src="/renders/tour-poster.webp"
                  alt="Osiedle Plażowa Park w otoczeniu sosnowego lasu - podgląd wirtualnego spaceru 360 stopni"
                  fill
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  className="object-cover transition-transform duration-[1600ms] ease-out group-hover/btn:scale-[1.05]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/35" />
                <span className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold tracking-wide text-paper backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brass-light opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-brass-light" />
                  </span>
                  Wirtualny spacer 360 stopni
                </span>

                <span className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
                  <span className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-paper/95 text-pine-deep shadow-[0_12px_44px_-10px_rgba(0,0,0,0.65)] transition-transform duration-300 group-hover/btn:scale-110">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5.5v13l11-6.5z" /></svg>
                  </span>
                </span>

                <span className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                  <span className="block max-w-xl font-display text-[clamp(1.5rem,3vw,2.4rem)] font-semibold leading-tight text-paper">
                    Przejdź się osiedlem w otoczeniu lasu
                  </span>
                  <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-paper/85">
                    Rozpocznij spacer 360 stopni <Icon.arrow width={16} height={16} />
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
