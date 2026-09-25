// Checks data/texas-resources.json before every build.
// If something is wrong, it prints a plain-English message and stops the build,
// so a typo can never reach the live site.
import { readFileSync } from "node:fs";

const FILE = new URL("../data/texas-resources.json", import.meta.url);
const CITIES = ["austin", "houston", "dallas", "san-antonio", "fort-worth", "el-paso"];
const CATEGORIES = ["library", "shelter", "day-center", "food", "church", "clinic", "hospital", "id-office", "jobs", "veterans", "legal"];
const NEEDS = ["food", "shelter", "showers", "id", "internet", "church", "medical", "jobs", "veterans", "legal"];
const REQUIRED = ["id", "city", "name", "category", "helpsWith", "address", "lat", "lng", "hours", "phone", "lastVerified"];
const TIME = /^([01]\d|2[0-3]):[0-5]\d$|^24:00$/;

let data;
try {
  data = JSON.parse(readFileSync(FILE, "utf8"));
} catch (err) {
  console.error("\n✗ data/texas-resources.json is not valid JSON.");
  console.error("  Look for a missing comma, quote, or bracket near:", err.message, "\n");
  process.exit(1);
}

const problems = [];
const ids = new Set();

for (const [i, r] of (data.resources ?? []).entries()) {
  const where = `Entry #${i + 1} (${r.name ?? r.id ?? "no name"})`;
  for (const key of REQUIRED) {
    if (r[key] === undefined || r[key] === "") problems.push(`${where}: missing "${key}".`);
  }
  if (ids.has(r.id)) problems.push(`${where}: id "${r.id}" is used twice. Each id must be different.`);
  ids.add(r.id);
  if (r.city && !CITIES.includes(r.city)) {
    problems.push(`${where}: city "${r.city}" must be one of: ${CITIES.join(", ")}. (New city? Add it to lib/cities.ts first.)`);
  }
  if (r.category && !CATEGORIES.includes(r.category)) {
    problems.push(`${where}: category "${r.category}" must be one of: ${CATEGORIES.join(", ")}.`);
  }
  for (const need of r.helpsWith ?? []) {
    if (!NEEDS.includes(need)) problems.push(`${where}: helpsWith "${need}" must be one of: ${NEEDS.join(", ")}.`);
  }
  // Texas box. Catches swapped or mistyped coordinates.
  if (typeof r.lat !== "number" || r.lat < 25.8 || r.lat > 36.6) problems.push(`${where}: lat ${r.lat} is not in Texas (should be about 25.8 to 36.5).`);
  if (typeof r.lng !== "number" || r.lng < -106.7 || r.lng > -93.5) problems.push(`${where}: lng ${r.lng} is not in Texas (should be about -106.6 to -93.5, with a minus sign).`);
  if (r.lastVerified && !/^\d{4}-\d{2}-\d{2}$/.test(r.lastVerified)) problems.push(`${where}: lastVerified must look like 2026-09-25.`);
  if (r.idStep !== undefined && ![1, 2, 3, 4].includes(r.idStep)) problems.push(`${where}: idStep must be 1, 2, 3, or 4.`);
  for (const s of r.open ?? []) {
    const okDays = Array.isArray(s.days) && s.days.length > 0 && s.days.every((d) => Number.isInteger(d) && d >= 0 && d <= 6);
    if (!okDays) problems.push(`${where}: each "open" entry needs "days" like [1,2,3,4,5] (0 = Sunday, 6 = Saturday).`);
    if (!TIME.test(s.from ?? "") || !TIME.test(s.to ?? "") || s.from >= s.to) {
      problems.push(`${where}: "open" times must look like "09:00" to "17:00" (24-hour clock, and "to" after "from").`);
    }
  }
}

if (problems.length) {
  console.error(`\n✗ Found ${problems.length} problem(s) in data/texas-resources.json:\n`);
  for (const p of problems) console.error("  • " + p);
  console.error("");
  process.exit(1);
}
console.log(`✓ data/texas-resources.json looks good (${data.resources.length} locations).`);
