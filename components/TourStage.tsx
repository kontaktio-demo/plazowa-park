"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { track } from "@/lib/track";

export type SceneCfg = {
  id: string;
  name: string;
  faceSize: number;
  levels: { tileSize: number; size: number; fallbackOnly?: boolean }[];
  initialViewParameters: { yaw: number; pitch: number; fov: number };
};

export type Tour = { base: string; scenes: SceneCfg[] };

// nazwy scen przychodzą od dewelopera z niedomkniętymi spacjami i prefiksem
// [WIZ] przy ujęciach z aranżacją - prostujemy je, ale nic nie ukrywamy
const etykieta = (s: SceneCfg) => {
  const czysta = s.name.replace(/^\[WIZ\]\s*/, "").trim();
  return s.name.includes("[WIZ]") ? `${czysta} · aranżacja` : czysta;
};

/**
 * Sam widok spaceru: panorama, sterowanie ujęciami i pełny ekran. Stoi w osobnym
 * pliku, bo Marzipano waży 88 KB i ładowało się razem ze stroną, choć spacer
 * uruchamia ułamek odwiedzających. Rodzic wciąga ten komponent przez next/dynamic
 * dopiero po kliknięciu "Spacer po...".
 */
export default function TourStage({
  aktywny,
  tryb,
  typ,
  typy,
  onTyp,
  onZamknij,
  wrapRef,
}: {
  aktywny: Tour;
  tryb: "osiedle" | "wnetrze";
  typ: string;
  typy: string[];
  onTyp: (t: string) => void;
  onZamknij: () => void;
  wrapRef: RefObject<HTMLDivElement | null>;
}) {
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const zamknijRef = useRef<HTMLButtonElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sceneObjsRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scenaRef = useRef<((i: number) => any) | null>(null);
  const indexRef = useRef(0);

  const SCENES = aktywny.scenes;

  useEffect(() => {
    if (!stageRef.current) return;
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

      sceneObjsRef.current = [];
      /**
       * Scena powstaje dopiero, gdy jest potrzebna. Wczesniej tworzylismy od razu
       * komplet, a kazda scena ma podglad panoramy, wiec samo wejscie w spacer po
       * wnetrzu sciagalo 17 podgladow naraz - ponad megabajt, zanim ktokolwiek
       * przeszedl do drugiego ujecia.
       */
      scenaRef.current = (i: number) => {
        const gotowa = sceneObjsRef.current[i];
        if (gotowa) return gotowa;
        const data = SCENES[i];
        const source = Marzipano.ImageUrlSource.fromString(
          `${aktywny.base}/tiles/${data.id}/{z}/{f}/{y}/{x}.jpg`,
          { cubeMapPreviewUrl: `${aktywny.base}/tiles/${data.id}/preview.jpg` }
        );
        const geometry = new Marzipano.CubeGeometry(data.levels);
        const limiter = Marzipano.RectilinearView.limit.traditional(data.faceSize, (100 * Math.PI) / 180);
        const view = new Marzipano.RectilinearView(data.initialViewParameters, limiter);
        const obj = { scene: viewer.createScene({ source, geometry, view, pinFirstLevel: true }), view };
        sceneObjsRef.current[i] = obj;
        return obj;
      };

      indexRef.current = 0;
      setIndex(0);
      scenaRef.current(0).scene.switchTo();
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
  }, [aktywny, SCENES]);

  const goTo = useCallback(
    (delta: number) => {
      const n = (indexRef.current + delta + SCENES.length) % SCENES.length;
      const obj = scenaRef.current?.(n);
      if (!obj) return;
      indexRef.current = n;
      obj.view.setParameters(SCENES[n].initialViewParameters);
      obj.scene.switchTo({ transitionDuration: 900 });
      setIndex(n);
    },
    [SCENES]
  );

  const zamknij = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    onZamknij();
  }, [onZamknij]);

  /**
   * Nakladka ze sterowaniem jest pozycjonowana wzgledem sekcji, wiec dopoki sekcja
   * nie stoi rowno z ekranem, pasek z nazwa ujecia i strzalkami wypada pod dolna
   * krawedzia. Po uruchomieniu spaceru zrownujemy sekcje z ekranem i przenosimy
   * focus na kontrolki, zeby spacer nie byl pulapka dla klawiatury.
   */
  useEffect(() => {
    // mobilny pasek CTA stoi przy dolnej krawedzi i zaslanialby sterowanie ujeciami
    document.body.dataset.spacer = "1";
    const sekcja = wrapRef.current;
    if (sekcja) {
      // nie scrollIntoView: sekcje maja scroll-margin-top pod belke nawigacji
      // (globals.css), wiec zostawiloby 88 px luki i zepchnelo pasek sterowania
      // pod dolna krawedz ekranu
      window.scrollTo({ top: sekcja.getBoundingClientRect().top + window.scrollY, behavior: "auto" });
    }
    zamknijRef.current?.focus({ preventScroll: true });
    return () => {
      delete document.body.dataset.spacer;
    };
  }, [wrapRef]);

  // bez tego spacer był pułapką: po wejściu nie było ani przycisku, ani skrótu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") zamknij();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zamknij]);

  const fullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  }, [wrapRef]);

  return (
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
          ref={zamknijRef}
          onClick={zamknij}
          aria-label="Zakończ spacer"
          className="pointer-events-auto absolute right-5 top-[calc(var(--nav-h)+72px)] flex h-11 w-11 items-center justify-center border border-sand-50/25 bg-abyss/40 backdrop-blur-md transition-colors hover:border-clay-300"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {tryb === "wnetrze" && (
          <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--nav-h)+16px)] flex justify-center px-5">
            {/* klikalny jest sam pasek, nie cala szerokosc wiersza - inaczej przezroczysty
                kontener lezal na przycisku pelnego ekranu i zjadal jego klikniecia */}
            <div className="no-scrollbar pointer-events-auto flex max-w-full items-center gap-1 overflow-x-auto border border-sand-50/20 bg-abyss/55 p-1 backdrop-blur-md">
              {typy.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    onTyp(t);
                    track("zmiana_ukladu", { typ: t });
                  }}
                  aria-pressed={typ === t}
                  className={`flex-none px-3 py-2 text-sm transition-colors ${
                    typ === t ? "bg-sun text-ink" : "hover:text-clay-300"
                  }`}
                >
                  {t}
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
  );
}
