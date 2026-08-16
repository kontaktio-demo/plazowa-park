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

      // marker w systemie marki: pierścień i punkt, nie pinezka
      const el = document.createElement("div");
      el.style.cssText = "position:relative;width:44px;height:44px";
      const ring = document.createElement("span");
      ring.style.cssText = "position:absolute;inset:0;border:1.5px solid var(--color-sun);opacity:.45;border-radius:999px";
      const dot = document.createElement("span");
      dot.style.cssText = "position:absolute;inset:13px;background:var(--color-sun);border-radius:999px";
      el.append(ring, dot);
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
    <div className="relative h-full w-full">
      {/* zdjęcie satelitarne przygaszone, żeby nie kłóciło się z paletą sekcji */}
      <div ref={ref} className="h-full w-full [filter:saturate(0.85)_contrast(1.05)]" />
      <span className="t-meta-sm absolute left-3 top-3 z-10 bg-sand-50/90 px-2.5 py-1.5 text-ink backdrop-blur-sm">
        Zdjęcia satelitarne
      </span>
    </div>
  );
}
