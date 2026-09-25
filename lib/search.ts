import { resources, type NeedKey, type Resource } from "./resources";
import { AUSTIN_CENTER, walking } from "./geo";

export type Hit = { r: Resource; miles: number; minutes: number; num: number };
export type Section = { need: NeedKey; hits: Hit[]; total: number };
export type Filters = { maxMiles?: number; mealsOnly?: boolean };

export function perSectionCount(needCount: number): number {
  if (needCount <= 1) return 6;
  if (needCount === 2) return 4;
  return 3;
}

/**
 * For each need, find the closest places. A place that helps with two needs
 * keeps the same pin number in both lists, so the map and list always match.
 */
export function buildSections(
  needs: NeedKey[],
  from: { lat: number; lng: number } | null,
  opts: { expanded?: Set<NeedKey>; filters?: Filters } = {},
): Section[] {
  const origin = from ?? AUSTIN_CENTER;
  const numbers = new Map<string, number>();
  let next = 1;

  return needs.map((need) => {
    const all = resources
      .filter((r) => r.helpsWith.includes(need))
      .filter((r) => !opts.filters?.mealsOnly || r.servesMeals || r.category === "food" || r.id === "sunrise-hub")
      .map((r) => ({ r, ...walking(origin, r) }))
      .filter((h) => !opts.filters?.maxMiles || h.miles <= opts.filters.maxMiles)
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
