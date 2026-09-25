export type Place = { lat: number; lng: number; label: string; approximate: boolean };

/** Straight-line distance in miles. */
export function milesBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Walking estimate. Streets are not straight lines, so we add 25% to the
 * straight-line distance and assume a relaxed pace of 3 miles per hour.
 */
export function walking(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const miles = milesBetween(a, b) * 1.25;
  const minutes = Math.max(1, Math.round((miles / 3) * 60));
  return { miles, minutes };
}

/** "0.8 miles · 16 min walk", or "12 miles away" when it is too far to walk. */
export function formatWalk(miles: number, minutes: number, lang: "en" | "es"): string {
  const m = miles < 0.1 ? "0.1" : miles < 10 ? miles.toFixed(1) : Math.round(miles).toString();
  if (miles > 4) return lang === "es" ? `${m} millas · lejos para caminar` : `${m} miles · far to walk`;
  const time = minutes >= 60 ? `${Math.floor(minutes / 60)} h ${minutes % 60} min` : `${minutes} min`;
  return lang === "es" ? `${m} millas · ${time} a pie` : `${m} miles · ${time} walk`;
}

/** Rough box around Texas, used to check "Use my location". */
export function inTexas(lat: number, lng: number) {
  return lat > 25.8 && lat < 36.6 && lng > -106.7 && lng < -93.5;
}

let zipCache: Record<string, [number, number, string]> | null = null;

/** Looks up the center of a Texas ZIP code. The list is only downloaded when someone types a ZIP. */
export async function lookupZip(zip: string): Promise<{ lat: number; lng: number; city: string } | null> {
  if (!zipCache) {
    const res = await fetch("/tx-zips.json");
    if (!res.ok) throw new Error("zip list unavailable");
    zipCache = await res.json();
  }
  const hit = zipCache![zip];
  return hit ? { lat: hit[0], lng: hit[1], city: hit[2] } : null;
}

export const TEXAS_CENTER = { lat: 31.0, lng: -99.0 };
