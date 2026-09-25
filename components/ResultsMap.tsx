"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { useApp } from "@/lib/app-context";
import type { Place } from "@/lib/geo";

export type Pin = { num: number; lat: number; lng: number; name: string; address: string };

/**
 * Free OpenStreetMap map. Leaflet is loaded only when a map is shown,
 * so the rest of the site stays fast on slow computers.
 */
export function ResultsMap({
  pins,
  from,
  className = "h-80",
  label,
}: {
  pins: Pin[];
  from: Place | null;
  className?: string;
  label: string;
}) {
  const { t } = useApp();
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const leaflet = useRef<typeof import("leaflet") | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((mod) => {
      const L = (mod as unknown as { default?: typeof import("leaflet") }).default ?? mod;
      if (cancelled || !el.current || map.current) return;
      leaflet.current = L;
      map.current = L.map(el.current, { scrollWheelZoom: false, zoomControl: true }).setView([30.2672, -97.7431], 12);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map.current);
      layer.current = L.layerGroup().addTo(map.current);
      draw();
    });
    return () => {
      cancelled = true;
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
    if (points.length > 1) map.current.fitBounds(points, { padding: [30, 30], maxZoom: 15 });
    else if (points.length === 1) map.current.setView(points[0], 15);
  }

  return (
    <div
      ref={el}
      role="region"
      aria-label={label}
      className={`w-full overflow-hidden rounded-3xl border-2 border-line bg-sky ${className}`}
    />
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
