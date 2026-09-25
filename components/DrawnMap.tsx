import { milesBetween, type Place } from "@/lib/geo";
import { CITIES } from "@/lib/cities";

const REFERENCE_IDS = ["aus-downtown", "aus-ut", "hou-downtown", "hou-tmc", "dal-downtown", "dal-fair-park", "sa-downtown", "sa-medical-center", "fw-downtown", "ep-downtown", "ep-utep"];
const LANDMARKS = CITIES.flatMap((c) => c.landmarks);

export type MapPin = { id: string; num: number; lat: number; lng: number };

/**
 * A simple drawn map that needs no internet. It is used on the printed
 * Help Sheet, and on screen whenever the online map cannot load.
 */
export function DrawnMap({
  pins,
  from,
  lang,
  youLabel,
  variant = "print",
}: {
  pins: MapPin[];
  from: Place | null;
  lang: "en" | "es";
  youLabel: string;
  variant?: "print" | "screen";
}) {
  const screen = variant === "screen";
  const W = 360;
  const H = screen ? 300 : 260;
  const pad = 26;
  const pinFill = screen ? "#1a4f8b" : "#000";
  const pts = pins.map((p) => ({ lat: p.lat, lng: p.lng }));
  if (from) pts.push({ lat: from.lat, lng: from.lng });
  if (pts.length === 0) return null;

  let minLat = Math.min(...pts.map((p) => p.lat));
  let maxLat = Math.max(...pts.map((p) => p.lat));
  let minLng = Math.min(...pts.map((p) => p.lng));
  let maxLng = Math.max(...pts.map((p) => p.lng));
  // Make sure a tiny area still shows some space around it.
  const minSpan = 0.01;
  if (maxLat - minLat < minSpan) {
    minLat -= minSpan / 2;
    maxLat += minSpan / 2;
  }
  if (maxLng - minLng < minSpan) {
    minLng -= minSpan / 2;
    maxLng += minSpan / 2;
  }

  // Keep real proportions (a mile is a mile in both directions).
  const kx = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  const spanX = (maxLng - minLng) * kx;
  const spanY = maxLat - minLat;
  const scale = Math.min((W - pad * 2) / spanX, (H - pad * 2) / spanY);
  const offX = (W - spanX * scale) / 2;
  const offY = (H - spanY * scale) / 2;
  const x = (lng: number) => offX + (lng - minLng) * kx * scale;
  const y = (lat: number) => H - (offY + (lat - minLat) * scale);

  // Scale bar: 1 mile (0.5 when zoomed in, 5 when zoomed out).
  const oneMilePx = x(minLng + 1 / (69.17 * kx)) - x(minLng);
  const barMiles = oneMilePx > 140 ? 0.5 : oneMilePx < 25 ? 5 : 1;
  const barPx = oneMilePx * barMiles;

  // Spread out pins that would sit on top of each other, with a line to the real spot.
  const taken: { x: number; y: number }[] = from
    ? [
        { x: x(from.lng), y: y(from.lat) },
        { x: x(from.lng) - 12, y: y(from.lat) + 19 },
        { x: x(from.lng) + 12, y: y(from.lat) + 19 },
      ]
    : [];
  const placed = pins.map((p) => {
    const tx = x(p.lng);
    const ty = y(p.lat);
    let px = tx;
    let py = ty;
    for (let step = 0; step < 40 && taken.some((o) => Math.hypot(o.x - px, o.y - py) < 20); step++) {
      const angle = step * 1.1 - Math.PI / 2;
      const dist = 22 + step * 2.2;
      px = Math.min(W - 12, Math.max(12, tx + Math.cos(angle) * dist));
      py = Math.min(H - 24, Math.max(12, ty + Math.sin(angle) * dist));
    }
    taken.push({ x: px, y: py });
    return { ...p, tx, ty, px, py };
  });

  const inside = (lat: number, lng: number) => lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
  const refs = LANDMARKS.filter((l) => REFERENCE_IDS.includes(l.id) && inside(l.lat, l.lng)).filter(
    (l) => pts.every((p) => milesBetween(p, l) > 0.5),
  );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={lang === "es" ? "Mapa sencillo" : "Simple map"}>
      <rect x="0.5" y="0.5" width={W - 1} height={H - 1} fill={screen ? "#fff5e3" : "#fff"} stroke={screen ? "#e6dccb" : "#000"} />
      {[1, 2, 3].map((i) => (
        <g key={i} stroke={screen ? "#efe3cd" : "#ddd"} strokeWidth="0.6">
          <line x1={(W / 4) * i} y1="0" x2={(W / 4) * i} y2={H} />
          <line x1="0" y1={(H / 4) * i} x2={W} y2={(H / 4) * i} />
        </g>
      ))}
      {refs.map((l) => (
        <g key={l.id}>
          <rect x={x(l.lng) - 2.5} y={y(l.lat) - 2.5} width="5" height="5" fill="#777" />
          <text
            x={x(l.lng) > W - 110 ? x(l.lng) - 5 : x(l.lng) + 5}
            y={y(l.lat) + 3}
            fontSize="9"
            fill="#444"
            textAnchor={x(l.lng) > W - 110 ? "end" : "start"}
          >
            {lang === "es" ? l.es.split(" (")[0] : l.en.split(" (")[0]}
          </text>
        </g>
      ))}
      {placed.map((p) => (
        <g key={p.id}>
          {(p.px !== p.tx || p.py !== p.ty) && <line x1={p.tx} y1={p.ty} x2={p.px} y2={p.py} stroke={pinFill} strokeWidth="1" />}
          {(p.px !== p.tx || p.py !== p.ty) && <circle cx={p.tx} cy={p.ty} r="2" fill={pinFill} />}
          <circle cx={p.px} cy={p.py} r="9" fill={pinFill} stroke="#fff" strokeWidth="1.5" />
          <text x={p.px} y={p.py + 3.5} fontSize="10" fontWeight="700" fill="#fff" textAnchor="middle">
            {p.num}
          </text>
        </g>
      ))}
      {from && (
        <g>
          <circle cx={x(from.lng)} cy={y(from.lat)} r="10" fill={screen ? "#f2a93b" : "#fff"} stroke={screen ? "#fff" : "#000"} strokeWidth="2.5" />
          <text x={x(from.lng)} y={y(from.lat) + 4} fontSize="12" fontWeight="700" textAnchor="middle">
            ★
          </text>
          <text x={x(from.lng)} y={y(from.lat) + 22} fontSize="10" fontWeight="700" textAnchor="middle" stroke="#fff" strokeWidth="3" paintOrder="stroke">
            {youLabel}
          </text>
        </g>
      )}
      {/* North arrow */}
      <g transform={`translate(${W - 20}, 22)`}>
        <path d="M0 -12 L6 6 L0 2 L-6 6 Z" fill="#000" />
        <text y="18" fontSize="10" fontWeight="700" textAnchor="middle">
          N
        </text>
      </g>
      {/* Scale bar */}
      <g transform={`translate(12, ${H - 14})`}>
        <line x1="0" y1="0" x2={barPx} y2="0" stroke="#000" strokeWidth="3" />
        <text x={barPx + 5} y="4" fontSize="9">
          {barMiles} {lang === "es" ? (barMiles === 1 ? "milla" : "millas") : barMiles === 1 ? "mile" : "miles"}
        </text>
      </g>
    </svg>
  );
}
