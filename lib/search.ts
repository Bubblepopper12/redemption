import { resources, type NeedKey, type Resource } from "./resources";
import { milesBetween, walking } from "./geo";
import { CITIES, MAX_MILES, type City } from "./cities";
import { openStatus } from "./hours";

export type Hit = { r: Resource; miles: number; minutes: number; num: number };
export type Section = { need: NeedKey; hits: Hit[]; total: number };
/** Places in another city are only shown when they are this close (straight line). */
const NEARBY_MILES = 15;

export type Filters = { maxMiles?: number; mealsOnly?: boolean; openNow?: boolean };

export function perSectionCount(needCount: number): number {
  if (needCount <= 1) return 6;
  if (needCount === 2) return 4;
  return 3;
}

export function timeZoneFor(r: Resource) {
  return r.city === "el-paso" ? "America/Denver" : "America/Chicago";
}

/** The covered city closest to a point, or null if none is within reach. */
export function nearestCity(from: { lat: number; lng: number } | null): City | null {
  if (!from) return null;
  let best: City | null = null;
  let bestMiles = Infinity;
  for (const c of CITIES) {
    const m = milesBetween(from, c.center);
    if (m < bestMiles) {
      best = c;
      bestMiles = m;
    }
  }
  return bestMiles <= MAX_MILES ? best : null;
}

/**
 * For each need, find the closest places (within reach). A place that helps
 * with two needs keeps the same pin number in both lists, so the map and list always match.
 */
export function buildSections(
  needs: NeedKey[],
  from: { lat: number; lng: number } | null,
  opts: { expanded?: Set<NeedKey>; filters?: Filters; now?: Date } = {},
): Section[] {
  const numbers = new Map<string, number>();
  let next = 1;
  const f = opts.filters ?? {};
  // Stay in the person's own city (plus anything close by), so someone in
  // Dallas is not sent to Fort Worth.
  const city = nearestCity(from);
  const nearby = (r: Resource) => !from || r.city === city?.id || milesBetween(from, r) <= NEARBY_MILES;

  return needs.map((need) => {
    const all = !from
      ? []
      : resources
          .filter((r) => r.helpsWith.includes(need))
          .filter(nearby)
          .filter((r) => !f.mealsOnly || r.servesMeals || r.category === "food" || (r.helpsWith.includes("food") && r.category !== "church"))
          .filter((r) => !f.openNow || !opts.now || openStatus(r.open, opts.now, timeZoneFor(r))?.open === true)
          .map((r) => ({ r, ...walking(from, r) }))
          .filter((h) => (f.maxMiles ? h.miles <= f.maxMiles : h.miles / 1.25 <= MAX_MILES))
          .sort((a, b) => a.miles - b.miles);
    const limit = opts.expanded?.has(need) ? all.length : perSectionCount(needs.length);
    const hits = all.slice(0, limit).map((h) => {
      if (!numbers.has(h.r.id)) numbers.set(h.r.id, next++);
      return { ...h, num: numbers.get(h.r.id)! };
    });
    return { need, hits, total: all.length };
  });
}

/** One list with each place once, in pin-number order. */
export function uniqueHits(sections: Section[]): Hit[] {
  const seen = new Map<string, Hit>();
  for (const s of sections) for (const h of s.hits) if (!seen.has(h.r.id)) seen.set(h.r.id, h);
  return [...seen.values()].sort((a, b) => a.num - b.num);
}
