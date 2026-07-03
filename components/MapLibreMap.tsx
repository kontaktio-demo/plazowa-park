"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { SITE } from "@/lib/data/site";

const SAT = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const CARTO = [
  "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
];

export default function MapLibreMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [layer, setLayer] = useState<"sat" | "mapa">("sat");
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);

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
            base: { type: "raster", tiles: CARTO, tileSize: 256, attribution: "© CARTO © OpenStreetMap" },
            sat: { type: "raster", tiles: [SAT], tileSize: 256, maxzoom: 19, attribution: "© Esri, Maxar" },
          },
          layers: [
            { id: "base", type: "raster", source: "base" },
            { id: "sat", type: "raster", source: "sat", layout: { visibility: "visible" } },
          ],
        },
        center: [SITE.geo.lng, SITE.geo.lat],
        zoom: 14.4,
        attributionControl: { compact: true },
        cooperativeGestures: true,
      });
      mapRef.current = map;
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

      const el = document.createElement("div");
      el.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-6px)">
        <div style="background:#9d8760;color:#fff;font:600 12px/1 Inter,sans-serif;padding:6px 10px;border-radius:999px;white-space:nowrap;box-shadow:0 6px 16px rgba(0,0,0,.35)">Plażowa Park</div>
        <div style="width:2px;height:14px;background:#9d8760"></div>
        <div style="width:12px;height:12px;border-radius:999px;background:#9d8760;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>
      </div>`;
      new maplibregl.Marker({ element: el }).setLngLat([SITE.geo.lng, SITE.geo.lat]).addTo(map);

      const lakeEl = document.createElement("div");
      lakeEl.innerHTML = `<div style="background:rgba(92,111,120,.92);color:#fff;font:600 11px/1 Inter,sans-serif;padding:5px 9px;border-radius:999px;white-space:nowrap;box-shadow:0 4px 10px rgba(0,0,0,.3)">Zalew Mrożyczka</div>`;
      new maplibregl.Marker({ element: lakeEl }).setLngLat([19.7197, 51.9614]).addTo(map);
    };

    // init only when the map scrolls near the viewport
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

  const toggle = (l: "sat" | "mapa") => {
    setLayer(l);
    mapRef.current?.setLayoutProperty("sat", "visibility", l === "sat" ? "visible" : "none");
  };

  return (
    <div className="relative h-full min-h-[360px] w-full overflow-hidden rounded-[16px] border border-ink/10">
      <div ref={ref} className="h-full w-full" />
      <div className="absolute left-3 top-3 z-10 flex gap-1 rounded-full border border-ink/10 bg-paper/90 p-1 backdrop-blur-sm">
        <button onClick={() => toggle("sat")} className={`rounded-full px-3 py-1 text-xs font-medium transition ${layer === "sat" ? "bg-pine text-paper" : "text-ink-soft"}`}>Satelita</button>
        <button onClick={() => toggle("mapa")} className={`rounded-full px-3 py-1 text-xs font-medium transition ${layer === "mapa" ? "bg-pine text-paper" : "text-ink-soft"}`}>Mapa</button>
      </div>
    </div>
  );
}
