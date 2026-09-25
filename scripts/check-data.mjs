// Checks data/austin-resources.json before every build.
// If something is wrong, it prints a plain-English message and stops the build,
// so a typo can never reach the live site.
import { readFileSync } from "node:fs";

const FILE = new URL("../data/austin-resources.json", import.meta.url);
const CATEGORIES = ["library", "shelter", "day-center", "food", "church", "clinic", "id-office", "jobs", "veterans", "legal"];
const NEEDS = ["food", "shelter", "showers", "id", "internet", "church", "medical", "jobs", "veterans", "legal"];
const REQUIRED = ["id", "name", "category", "helpsWith", "address", "lat", "lng", "hours", "phone", "lastVerified"];

let data;
try {
  data = JSON.parse(readFileSync(FILE, "utf8"));
} catch (err) {
  console.error("\n✗ data/austin-resources.json is not valid JSON.");
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
  if (r.category && !CATEGORIES.includes(r.category)) {
    problems.push(`${where}: category "${r.category}" must be one of: ${CATEGORIES.join(", ")}.`);
  }
  for (const need of r.helpsWith ?? []) {
    if (!NEEDS.includes(need)) problems.push(`${where}: helpsWith "${need}" must be one of: ${NEEDS.join(", ")}.`);
  }
  // Austin area box. Catches swapped or mistyped coordinates.
  if (typeof r.lat !== "number" || r.lat < 29.9 || r.lat > 30.7) problems.push(`${where}: lat ${r.lat} is not in the Austin area (should be about 30.1 to 30.5).`);
  if (typeof r.lng !== "number" || r.lng < -98.2 || r.lng > -97.4) problems.push(`${where}: lng ${r.lng} is not in the Austin area (should be about -97.9 to -97.6, with a minus sign).`);
  if (r.lastVerified && !/^\d{4}-\d{2}-\d{2}$/.test(r.lastVerified)) problems.push(`${where}: lastVerified must look like 2026-09-25.`);
}

if (problems.length) {
  console.error(`\n✗ Found ${problems.length} problem(s) in data/austin-resources.json:\n`);
  for (const p of problems) console.error("  • " + p);
  console.error("");
  process.exit(1);
}
console.log(`✓ data/austin-resources.json looks good (${data.resources.length} locations).`);
