// Looks up exact map coordinates for each address using OpenStreetMap's free
// Nominatim service, and shows how far each current pin is from that spot.
//
//   npm run geocode            -> just shows the differences
//   npm run geocode -- --write -> also saves the new coordinates
//
// Only entries marked "coordsApproximate": true are checked (add --all to check every entry).
// Nominatim asks for no more than 1 request per second, so this takes about a minute.
import { readFileSync, writeFileSync } from "node:fs";

const FILE = new URL("../data/austin-resources.json", import.meta.url);
const write = process.argv.includes("--write");
const all = process.argv.includes("--all");
const data = JSON.parse(readFileSync(FILE, "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function miles(a, b) {
  const R = 3958.8, rad = (d) => (d * Math.PI) / 180;
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

let changed = 0;
for (const r of data.resources) {
  if (!all && !r.coordsApproximate) continue;
  // Drop suite / floor / building parts, which confuse the lookup.
  const q = r.address.replace(/,?\s*(Suite|Ste\.?|#|Building|Bldg\.?|\d+(st|nd|rd|th) Floor)[^,]*/gi, "");
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "redemption-resource-geocoder/1.0 (volunteer maintained)" } });
    const [hit] = await res.json();
    if (!hit) {
      console.log(`?  ${r.name}: address not found. Check it by hand.`);
    } else {
      const next = { lat: +(+hit.lat).toFixed(5), lng: +(+hit.lon).toFixed(5) };
      const off = miles(r, next);
      console.log(`${off > 0.15 ? "!" : "✓"}  ${r.name}: pin is ${off.toFixed(2)} mi from the address`);
      if (write) {
        r.lat = next.lat;
        r.lng = next.lng;
        r.coordsApproximate = false;
        changed++;
      }
    }
  } catch (err) {
    console.log(`x  ${r.name}: lookup failed (${err.message})`);
  }
  await sleep(1100);
}

if (write) {
  writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
  console.log(`\nSaved ${changed} updated location(s). Open the map to double-check them.`);
} else {
  console.log("\nNothing was saved. Run `npm run geocode -- --write` to save.");
}
