import { LANDMARKS, milesBetween, type Place } from "@/lib/geo";
import type { Hit } from "@/lib/search";

/**
 * A plain drawn map for the printed Help Sheet. It does not need the internet,
 * so it always prints, even if the online map did not load.
 */
export function PrintMap({ hits, from, lang, youLabel }: { hits: Hit[]; from: Place | null; lang: "en" | "es"; youLabel: string }) {
  const W = 360;
  const H = 260;
  const pad = 26;
  const pts = hits.map((h) => ({ lat: h.r.lat, lng: h.r.lng }));
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

  // Scale bar: 1 mile (or 0.5 mile when zoomed in).
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
  const placed = hits.map((h) => {
    const tx = x(h.r.lng);
    const ty = y(h.r.lat);
    let px = tx;
    let py = ty;
    for (let step = 0; step < 40 && taken.some((o) => Math.hypot(o.x - px, o.y - py) < 20); step++) {
      const angle = step * 1.1 - Math.PI / 2;
      const dist = 22 + step * 2.2;
      px = Math.min(W - 12, Math.max(12, tx + Math.cos(angle) * dist));
      py = Math.min(H - 24, Math.max(12, ty + Math.sin(angle) * dist));
    }
    taken.push({ x: px, y: py });
    return { id: h.r.id, num: h.num, tx, ty, px, py };
  });

  const inside = (lat: number, lng: number) => lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
  const refs = LANDMARKS.filter((l) => ["downtown", "capitol", "ut", "domain"].includes(l.id) && inside(l.lat, l.lng)).filter(
    (l) => pts.every((p) => milesBetween(p, l) > 0.25),
  );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Map">
      <rect x="0.5" y="0.5" width={W - 1} height={H - 1} fill="#fff" stroke="#000" />
      {[1, 2, 3].map((i) => (
        <g key={i} stroke="#ddd" strokeWidth="0.6">
          <line x1={(W / 4) * i} y1="0" x2={(W / 4) * i} y2={H} />
          <line x1="0" y1={(H / 4) * i} x2={W} y2={(H / 4) * i} />
        </g>
      ))}
      {refs.map((l) => (
        <g key={l.id}>
          <rect x={x(l.lng) - 2.5} y={y(l.lat) - 2.5} width="5" height="5" fill="#777" />
          <text x={x(l.lng) + 5} y={y(l.lat) + 3} fontSize="9" fill="#444">
            {lang === "es" ? l.es.split(" (")[0] : l.en.split(" (")[0]}
          </text>
        </g>
      ))}
      {placed.map((p) => (
        <g key={p.id}>
          {(p.px !== p.tx || p.py !== p.ty) && <line x1={p.tx} y1={p.ty} x2={p.px} y2={p.py} stroke="#000" strokeWidth="1" />}
          {(p.px !== p.tx || p.py !== p.ty) && <circle cx={p.tx} cy={p.ty} r="2" fill="#000" />}
          <circle cx={p.px} cy={p.py} r="9" fill="#000" stroke="#fff" strokeWidth="1.5" />
          <text x={p.px} y={p.py + 3.5} fontSize="10" fontWeight="700" fill="#fff" textAnchor="middle">
            {p.num}
          </text>
        </g>
      ))}
      {from && (
        <g>
          <circle cx={x(from.lng)} cy={y(from.lat)} r="10" fill="#fff" stroke="#000" strokeWidth="2.5" />
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
