"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { useApp } from "@/lib/app-context";
import type { Place } from "@/lib/geo";
import { DrawnMap } from "./DrawnMap";

export type Pin = { id: string; num: number; lat: number; lng: number; name: string; address: string };

/**
 * Free OpenStreetMap map. Leaflet is loaded only when a map is shown,
 * so the rest of the site stays fast on slow computers.
 *
 * If the map pictures cannot load (no internet, a blocked network, a slow
 * library computer), we quietly switch to a simple drawn map instead, so
 * people never see error pictures.
 */
export function ResultsMap({
  pins,
  from,
  className = "h-80",
  label,
  fitAll = false,
}: {
  pins: Pin[];
  from: Place | null;
  className?: string;
  label: string;
  /** Zoom out to show every pin, even far-away ones. */
  fitAll?: boolean;
}) {
  const { t, lang } = useApp();
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const leaflet = useRef<typeof import("leaflet") | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    let errors = 0;
    let timer: number | undefined;

    import("leaflet")
      .then((mod) => {
        const L = (mod as unknown as { default?: typeof import("leaflet") }).default ?? mod;
        if (cancelled || !el.current || map.current) return;
        leaflet.current = L;
        map.current = L.map(el.current, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView([30.2672, -97.7431], 12);
        const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          // OpenStreetMap requires a Referer header. Only the site's address is sent, never the page or the person.
          referrerPolicy: "strict-origin-when-cross-origin",
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        });
        tiles.on("tileload", () => {
          loaded++;
        });
        tiles.on("tileerror", () => {
          errors++;
          if (errors >= 3 && loaded === 0) setFailed(true);
        });
        tiles.addTo(map.current);
        layer.current = L.layerGroup().addTo(map.current);
        draw();
        // Very slow or blocked connection: fall back after 10 seconds with no map pictures.
        timer = window.setTimeout(() => {
          if (loaded === 0) setFailed(true);
        }, 10000);
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins, from]);

  function draw() {
    const L = leaflet.current;
    if (!L || !map.current || !layer.current) return;
    layer.current.clearLayers();
    const points: [number, number][] = [];
    for (const p of pins) {
      const icon = L.divIcon({ className: "", html: `<span class="map-pin">${p.num}</span>`, iconSize: [34, 34], iconAnchor: [17, 17] });
      L.marker([p.lat, p.lng], { icon, title: `${p.num}. ${p.name}`, alt: `${p.num}. ${p.name}` })
        .bindPopup(`<strong>${p.num}. ${escapeHtml(p.name)}</strong><br>${escapeHtml(p.address)}`)
        .addTo(layer.current);
      points.push([p.lat, p.lng]);
    }
    if (from) {
      const icon = L.divIcon({ className: "", html: `<span class="map-pin map-pin-you">★</span>`, iconSize: [34, 34], iconAnchor: [17, 17] });
      L.marker([from.lat, from.lng], { icon, title: t.mapYou, alt: t.mapYou, zIndexOffset: 1000 }).addTo(layer.current);
      points.push([from.lat, from.lng]);
    }
    if (points.length > 1) map.current.fitBounds(points, { padding: [30, 30], maxZoom: fitAll ? 12 : 15 });
    else if (points.length === 1) map.current.setView(points[0], 14);
  }

  return (
    <div data-noread>
      {failed && (
        <div className={`w-full overflow-hidden rounded-3xl border-2 border-line bg-dawn-soft ${className} flex items-center justify-center`}>
          <div className="h-full w-full max-w-3xl p-2">
            <DrawnMap
              pins={pins.map((p) => ({ id: p.id, num: p.num, lat: p.lat, lng: p.lng }))}
              from={from}
              lang={lang}
              youLabel={t.mapYou}
              variant="screen"
            />
          </div>
        </div>
      )}
      <div
        ref={el}
        role="region"
        aria-label={label}
        className={`w-full overflow-hidden rounded-3xl border-2 border-line bg-sky ${className} ${failed ? "hidden" : ""}`}
      />
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
