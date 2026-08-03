"use client";

import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { SITE } from "@/lib/data/site";

const SAT = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

export default function MapLibreMap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("maplibre-gl").Map | undefined;
    let cancelled = false;
    let started = false;

    const start = async () => {
      if (started || cancelled || !ref.current) return;
      started = true;
      const maplibregl = (await import("maplibre-gl")).default;
      if (cancelled || !ref.current) return;

      map = new maplibregl.Map({
        container: ref.current,
        style: {
          version: 8,
          sources: {
            sat: { type: "raster", tiles: [SAT], tileSize: 256, maxzoom: 19, attribution: "Esri, Maxar" },
          },
          layers: [{ id: "sat", type: "raster", source: "sat" }],
        },
        center: [SITE.geo.lng, SITE.geo.lat],
        zoom: 15,
        attributionControl: { compact: true },
        cooperativeGestures: true,
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

      const el = document.createElement("div");
      el.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-6px)">
        <div style="background:#9d8760;color:#fff;font:600 12px/1 Inter,sans-serif;padding:6px 10px;border-radius:999px;white-space:nowrap;box-shadow:0 6px 16px rgba(0,0,0,.35)">Plażowa Park</div>
        <div style="width:2px;height:14px;background:#9d8760"></div>
        <div style="width:12px;height:12px;border-radius:999px;background:#9d8760;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>
      </div>`;
      new maplibregl.Marker({ element: el }).setLngLat([SITE.geo.lng, SITE.geo.lat]).addTo(map);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: "300px 0px" }
    );
    if (ref.current) io.observe(ref.current);

    return () => {
      cancelled = true;
      io.disconnect();
      map?.remove();
    };
  }, []);

  return (
    <div className="relative h-full min-h-[320px] w-full overflow-hidden rounded-[16px] border border-ink/10">
      <div ref={ref} className="h-full w-full" />
      <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-paper/90 px-3 py-1 text-xs font-medium text-ink-soft backdrop-blur-sm">
        Zdjęcia satelitarne
      </span>
    </div>
  );
}
