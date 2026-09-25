// Full browser check of the built site (the out/ folder).
//
//   npm run build
//   npm install --no-save playwright axe-core   (one time; needs a Chromium browser)
//   node tests/site-check.mjs
//
// It tests every page in English and Spanish, phone to desktop widths, every
// city and need, ZIP codes, "Use my location", printing, helper mode, the map
// (and its fallback), read aloud, privacy auto-clear, and an accessibility scan.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { extname, join } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = await import(process.env.PLAYWRIGHT_PATH ?? "playwright");
let axeSource = null;
try {
  axeSource = await readFile(process.env.AXE_PATH ?? require.resolve("axe-core/axe.min.js"), "utf8");
} catch {
  console.log("(axe-core not found: skipping the accessibility scan)");
}

// ---------- tiny static server for out/ ----------
const ROOT = new URL("../out/", import.meta.url).pathname;
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".txt": "text/plain", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
const server = createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = join(ROOT, path);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
  } catch {
    file = join(ROOT, "404.html");
    res.statusCode = 404;
  }
  try {
    const body = await readFile(file);
    res.setHeader("Content-Type", TYPES[extname(file)] ?? "application/octet-stream");
    res.end(body);
  } catch {
    res.statusCode = 404;
    res.end("not found");
  }
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}`;

// ---------- helpers ----------
let failures = 0;
let passes = 0;
function check(ok, label, detail = "") {
  if (ok) passes++;
  else failures++;
  console.log(`${ok ? "✓" : "✗"} ${label}${detail ? ` — ${detail}` : ""}`);
}
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
const browser = await chromium.launch();
const pageErrors = [];

async function newPage({ width = 1280, height = 900, tiles = "fail", geo, lang } = {}) {
  const context = await browser.newContext({
    viewport: { width, height },
    permissions: geo ? ["geolocation"] : [],
    geolocation: geo,
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => pageErrors.push(`${page.url()}: ${e.message}`));
  page.tileReferers = [];
  await page.route(/tile\.openstreetmap\.org/, (route) => {
    page.tileReferers.push(route.request().headers()["referer"] ?? "");
    return tiles === "ok" ? route.fulfill({ status: 200, contentType: "image/png", body: PNG }) : route.abort();
  });
  // Nothing else outside this site should ever be requested.
  page.outside = [];
  await page.route(/^https?:\/\/(?!localhost)/, (route) => {
    if (/tile\.openstreetmap\.org/.test(route.request().url())) return route.fallback();
    page.outside.push(route.request().url());
    return route.abort();
  });
  if (lang === "es") await page.addInitScript(() => sessionStorage.setItem("lang", "es"));
  return page;
}

async function axe(page, label) {
  if (!axeSource) return;
  await page.addScriptTag({ content: axeSource });
  const v = await page.evaluate(async () =>
    (await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa"] })).violations.map((x) => `${x.id} (${x.nodes.length})`),
  );
  check(v.length === 0, `accessibility: ${label}`, v.join(", "));
}

/** Words in these elements that got split across two lines (e.g. "Shower / s"). */
const splitWords = (page, selector) =>
  page.$$eval(selector, (els) => {
    const bad = [];
    for (const el of els) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        for (const m of node.textContent.matchAll(/\S+/g)) {
          const range = document.createRange();
          range.setStart(node, m.index);
          range.setEnd(node, m.index + m[0].length);
          const tops = new Set([...range.getClientRects()].map((r) => Math.round(r.top)));
          if (tops.size > 1) bad.push(m[0]);
        }
      }
    }
    return bad;
  });

/** Buttons whose words spill outside their own edges. */
const spilling = (page, selector) =>
  page.$$eval(selector, (els) =>
    els
      .filter((e) => {
        if (e.classList.contains("sr-only")) return false;
        const box = e.getBoundingClientRect();
        const walker = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          const range = document.createRange();
          range.selectNodeContents(node);
          for (const r of range.getClientRects()) if (r.width && (r.right > box.right + 1 || r.left < box.left - 1)) return true;
        }
        return false;
      })
      .map((e) => e.textContent.trim()),
  );

/** Waits up to 5 seconds for something to appear. */
const seen = (loc, ms = 5000) => loc.first().waitFor({ state: "visible", timeout: ms }).then(() => true, () => false);

async function pdfPages(page) {
  const pdf = await page.pdf({ format: "Letter" });
  return (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
}

const PAGES = ["/", "/map/", "/id/", "/connected/", "/more-help/", "/bible/", "/privacy/", "/flyer/", "/handout/"];

// ---------- 1. Every page, every width, both languages ----------
for (const lang of ["en", "es"]) {
  for (const width of [320, 375, 768, 1280]) {
    const page = await newPage({ width, lang });
    for (const path of PAGES) {
      await page.goto(BASE + path);
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      check(overflow <= 0, `no sideways scroll: ${path} at ${width}px (${lang})`, overflow > 0 ? `${overflow}px too wide` : "");
      if (width === 1280) await axe(page, `${path} (${lang})`);
      if (lang === "es" && width === 1280) {
        const htmlLang = await page.evaluate(() => document.documentElement.lang);
        check(htmlLang === "es", `html lang is es on ${path}`);
      }
    }
    await page.context().close();
  }
}

// ---------- 2. Home flow in every city, every need ----------
{
  const page = await newPage();
  const cities = await page.goto(BASE + "/").then(() =>
    page.$$eval("select optgroup", (groups) => groups.map((g) => ({ city: g.label, first: g.querySelector("option").value }))),
  );
  check(cities.length === 6, "six cities in the place picker", cities.map((c) => c.city).join(", "));
  const needs = ["Food", "Shelter", "Showers", "Get an ID", "Internet", "Church", "Medical", "Jobs", "Veterans", "Legal"];
  for (const { city, first } of cities) {
    await page.goto(BASE + "/");
    await page.locator("select").first().selectOption(first);
    for (const n of needs) await page.getByRole("button", { name: new RegExp(`^${n}`) }).click();
    await page.getByRole("button", { name: /Show me help/ }).first().click();
    await page.waitForSelector("h1:has-text('Help near you')");
    const counts = await page.$$eval("section[aria-labelledby^='sec-']", (secs) =>
      secs.map((s) => `${s.querySelector("h2").textContent.trim()}: ${s.querySelectorAll("article").length}`),
    );
    const empty = counts.filter((c) => c.endsWith(": 0"));
    const tips = await page.locator("section[aria-labelledby^='sec-'] .bg-sky").count();
    check(counts.length === 10, `${city}: all 10 needs shown`, counts.join(" · "));
    check(empty.length <= 2, `${city}: places found for most needs`, empty.length ? `none for ${empty.join(", ")} (tips still shown)` : "");
    check(tips === 10, `${city}: a helpful tip for every need`, `${tips} tips`);
    const cardCities = await page.$$eval("article h3", (h) => h.length);
    check(cardCities > 0, `${city}: result cards shown`);
    // Print: one page, even with every need picked.
    await page.emulateMedia({ media: "print" });
    const n = await pdfPages(page);
    check(n === 1, `${city}: Help Sheet prints on one page (10 needs)`, `${n} page(s)`);
    const sheetVisible = await seen(page.locator("section[aria-hidden='true']:has-text('My Help Sheet')"));
    check(sheetVisible, `${city}: Help Sheet visible when printing`);
    await page.emulateMedia({ media: "screen" });
  }
  await page.context().close();
}

// ---------- 3. Place is required; ZIP codes; location ----------
{
  const page = await newPage();
  await page.goto(BASE + "/");
  await page.getByRole("button", { name: /^Food/ }).click();
  await page.getByRole("button", { name: /Show me help/ }).first().click();
  check(await seen(page.getByText("First, tell us where you are")), "asks for a place before showing help");
  check((await page.getByRole("heading", { name: "Help near you" }).count()) === 0, "does not show results without a place");

  await page.fill("input[inputmode=numeric]", "77002");
  await page.getByRole("button", { name: "OK" }).click();
  check(await seen(page.getByText(/ZIP 77002 \(Houston\)/)), "ZIP 77002 is found as Houston");
  await page.getByRole("button", { name: /Change/ }).click();
  await page.fill("input[inputmode=numeric]", "10001");
  await page.getByRole("button", { name: "OK" }).click();
  check(await seen(page.getByText(/not a Texas ZIP code/)), "a New York ZIP is rejected kindly");
  await page.fill("input[inputmode=numeric]", "79936");
  await page.getByRole("button", { name: "OK" }).click();
  await page.getByRole("button", { name: /Show me help/ }).first().click();
  const epCard = await page.locator("article h3").first().textContent();
  check(/El Paso|Opportunity|Rescue|Kelly|Main Library/.test(epCard ?? ""), "El Paso ZIP shows El Paso places first", epCard ?? "");
  await page.context().close();

  // Far from any covered city (Amarillo): friendly 2-1-1 message, no wrong-city places.
  const far = await newPage();
  await far.goto(BASE + "/");
  await far.fill("input[inputmode=numeric]", "79101");
  await far.getByRole("button", { name: "OK" }).click();
  await far.getByRole("button", { name: /^Food/ }).click();
  await far.getByRole("button", { name: /Show me help/ }).first().click();
  check(await seen(far.getByText(/do not have places listed near you yet/)), "far-away ZIP gets the 2-1-1 message");
  check((await far.locator("article").count()) === 0, "far-away ZIP does not list places in other cities");
  await far.context().close();

  const inTx = await newPage({ geo: { latitude: 32.7767, longitude: -96.797 } });
  await inTx.goto(BASE + "/");
  await inTx.getByRole("button", { name: /Use my location/ }).click();
  check(await seen(inTx.getByText(/Near: Your location/)), "Use my location works inside Texas");
  await inTx.context().close();

  const outTx = await newPage({ geo: { latitude: 40.7128, longitude: -74.006 } });
  await outTx.goto(BASE + "/");
  await outTx.getByRole("button", { name: /Use my location/ }).click();
  check(await seen(outTx.getByText(/outside Texas/)), "a location outside Texas is caught");
  await outTx.context().close();

  const denied = await newPage();
  await denied.goto(BASE + "/");
  await denied.getByRole("button", { name: /Use my location/ }).click();
  await denied.waitForTimeout(500);
  check(await seen(denied.getByText(/could not get your location/)), "denied location shows a helpful message");
  await denied.context().close();
}

// ---------- 4. Back button, reload, clear, keyboard ----------
{
  const page = await newPage();
  await page.goto(BASE + "/");
  await page.locator("select").first().selectOption("aus-downtown");
  const food = page.getByRole("button", { name: /^Food/ });
  await food.focus();
  await page.keyboard.press("Space");
  check((await food.getAttribute("aria-pressed")) === "true", "keyboard Space picks a need");
  await page.fill("input[placeholder='First name']", "Maria");
  await page.getByRole("button", { name: /Show me help/ }).first().click();
  check(await seen(page.getByText("Hello, Maria")), "greets by first name");
  await page.goBack();
  check(await seen(page.getByText("What do you need today?")), "browser Back returns to the questions");
  await page.getByRole("button", { name: /Show me help/ }).first().click();
  await page.reload();
  await page.waitForFunction(() => !location.hash, null, { timeout: 5000 }).catch(() => {});
  check(!page.url().includes("#results"), "reload clears the #results address");
  check((await page.locator("input[placeholder='First name']").inputValue()) === "", "name is gone after reload (never stored)");
  const stored = await page.evaluate(() => JSON.stringify({ ...sessionStorage }) + JSON.stringify({ ...localStorage }) + document.cookie);
  check(!/Maria|aus-downtown|30\.26/.test(stored), "nothing personal in browser storage or cookies", stored);
  await page.context().close();
}

// ---------- 5. Privacy: auto-clear after 15 idle minutes ----------
{
  const page = await newPage();
  await page.clock.install();
  await page.goto(BASE + "/");
  await page.fill("input[placeholder='First name']", "Jo");
  await page.clock.fastForward("16:00");
  await page.waitForTimeout(200);
  check((await page.locator("input[placeholder='First name']").inputValue()) === "", "idle 15 minutes clears the name");
  check(await seen(page.getByText(/For your privacy, we cleared your info/)), "tells the person it was cleared");
  await page.context().close();
}

// ---------- 6. Spanish sticks while moving around ----------
{
  const page = await newPage();
  await page.goto(BASE + "/");
  await page.getByRole("button", { name: "Cambiar a español" }).click();
  await page.getByRole("link", { name: "Sacar una ID" }).click();
  await page.waitForURL(/\/id\/$/);
  check(await seen(page.getByRole("heading", { name: /Saque su identificación/ })), "Spanish carries to the next page");
  await page.reload();
  check(await seen(page.getByRole("heading", { name: /Saque su identificación/ })), "Spanish stays after reload (same tab)");
  await page.context().close();
}

// ---------- 7. Helper mode ----------
{
  const page = await newPage();
  await page.goto(BASE + "/");
  await page.getByRole("switch").click();
  await page.locator("select").first().selectOption("aus-downtown");
  await page.getByRole("button", { name: /^Food/ }).click();
  await page.getByRole("button", { name: /^Showers/ }).click();
  const before = await page.locator("article").count();
  check(before > 0, "helper mode shows results right away", `${before} places`);
  check(await seen(page.getByRole("button", { name: /Print My Help Sheet/ })), "helper mode print button always visible");
  await page.getByLabel("Distance").selectOption("1");
  const within1 = await page.locator("article").count();
  check(within1 <= before, "distance filter narrows results", `${before} → ${within1}`);
  await page.getByLabel("Distance").selectOption("");
  await page.getByLabel("Serves meals").check();
  const meals = await page.locator("article").count();
  check(meals <= before, "serves-meals filter works", `${before} → ${meals}`);
  await page.emulateMedia({ media: "print" });
  check((await pdfPages(page)) === 1, "helper mode prints one page");
  await page.context().close();
}

// ---------- 7b. Helper mode layout: numbered steps, no broken words ----------
for (const [width, lang] of [[1280, "en"], [1024, "en"], [768, "es"], [375, "en"], [320, "es"]]) {
  const page = await newPage({ width, lang });
  await page.goto(BASE + "/");
  await page.getByRole("switch").click();
  await page.waitForTimeout(200);
  const broken = await splitWords(page, "main button, main label");
  check(broken.length === 0, `helper mode: no words split across lines at ${width}px (${lang})`, broken.join(", "));
  const spill = await spilling(page, "main button, main select, main input");
  check(spill.length === 0, `helper mode: no text spilling out of buttons at ${width}px (${lang})`, spill.join(", "));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(overflow <= 0, `helper mode: no sideways scroll at ${width}px (${lang})`, `${overflow}px`);
  if (width === 1280) {
    const ok = page.getByRole("button", { name: "OK", exact: true });
    const zip = page.locator("input[inputmode=numeric]").first();
    const [okBox, zipBox] = [await ok.boundingBox(), await zip.boundingBox()];
    check(okBox && zipBox && Math.abs(okBox.y - zipBox.y) < 8 && okBox.height < 70, "helper mode: OK button sits beside the ZIP box on one line", JSON.stringify(okBox));
    check(await seen(page.getByText("Where are you?")), "helper mode shows numbered step 1 (where)");
    check(await seen(page.getByText("What do they need?")), "helper mode shows numbered step 2 (needs)");
    await axe(page, "helper mode");
    await page.getByRole("link", { name: "Make handouts" }).first().click();
    check(await seen(page.getByRole("heading", { name: "Make handouts" })), "helper mode links to Make handouts");
  }
  await page.context().close();
}

// ---------- 8. Open now badges use Texas time ----------
{
  const page = await newPage();
  await page.clock.setFixedTime(new Date("2026-09-29T15:00:00Z")); // Tue 10:00 am in Austin
  await page.goto(BASE + "/map/");
  await page.waitForTimeout(300);
  const central = page.locator("article", { hasText: "Austin Central Library" });
  check(/Open now · until 8 pm/.test(await central.textContent()), "Central Library is open Tuesday 10 am");
  const hospital = page.locator("article", { hasText: "Parkland Hospital" });
  check(/Open 24 hours/.test(await hospital.textContent()), "hospital ER shows open 24 hours");
  await page.context().close();
  const night = await newPage();
  await night.clock.setFixedTime(new Date("2026-09-27T08:00:00Z")); // Sun 3:00 am in Austin
  await night.goto(BASE + "/map/");
  await night.waitForTimeout(300);
  const lib = night.locator("article", { hasText: "Austin Central Library" });
  check(/Closed now · opens today at 12 pm/.test(await lib.textContent()), "Central Library at 3 am Sunday says opens today at 12 pm");
  await night.context().close();
}

// ---------- 9. Map: tiles, referer, fallback ----------
{
  const ok = await newPage({ tiles: "ok" });
  await ok.goto(BASE + "/map/");
  await ok.waitForTimeout(1500);
  check((await ok.locator(".leaflet-tile").count()) > 0, "online map loads map pictures");
  const refs = ok.tileReferers;
  check(refs.length > 0 && refs.every((r) => r.startsWith(BASE)), "map requests send the site address (OpenStreetMap requires it)", refs[0] ?? "none");
  check(refs.every((r) => !r.includes("/map/")), "map requests do not reveal which page the person is on");
  await ok.context().close();

  const blocked = await newPage({ tiles: "fail" });
  await blocked.goto(BASE + "/map/");
  await blocked.waitForTimeout(2500);
  check(await seen(blocked.locator("svg[aria-label='Simple map']").first()), "blocked map pictures switch to the simple drawn map");
  check(!(await blocked.locator(".leaflet-container").first().isVisible()), "broken map is hidden (no error pictures)");
  await blocked.context().close();
}

// ---------- 10. Map page filters ----------
{
  const page = await newPage();
  await page.goto(BASE + "/map/#church");
  await page.waitForTimeout(300);
  const cats = await page.$$eval("article p.mt-1 > span:first-child", (s) => [...new Set(s.map((x) => x.textContent.trim().split("·")[0].trim()))]);
  check(cats.length === 1 && cats[0] === "Church", "/map/#church shows only churches", cats.join(", "));
  await page.getByLabel("City:").selectOption("houston");
  const all = await page.locator("article").count();
  check(all > 0 && all < 10, "city filter narrows the list", `${all} churches in Houston`);
  await page.context().close();
}

// ---------- 11. Church list policy ----------
{
  const page = await newPage();
  await page.goto(BASE + "/map/#church");
  const text = await page.locator("main").textContent();
  await page.waitForTimeout(300);
  const churchNames = await page.$$eval("article h3", (h) => h.map((x) => x.textContent));
  for (const name of ["St. David's Episcopal", "First Baptist Church of Austin", "Central Presbyterian", "First United Methodist", "University Presbyterian Church", "Sunrise Community Church"]) {
    check(!churchNames.some((n) => n.includes(name)), `church list excludes ${name}`);
  }
  check(text.includes("Mosaic Church – North Austin Campus") && text.includes("Mosaic Church – South Austin Campus"), "Mosaic North and South are listed");
  await page.context().close();
}

// ---------- 12. ID guide by city ----------
{
  const page = await newPage();
  await page.goto(BASE + "/id/");
  await page.getByLabel("Which city are you in?").selectOption("houston");
  check(await seen(page.getByText("Houston Bureau of Vital Statistics").first()), "ID guide shows Houston's birth certificate office");
  check(await seen(page.getByText(/Free help with IDs in Houston/)), "ID guide shows Houston ID helpers");
  await page.emulateMedia({ media: "print" });
  const n = await pdfPages(page);
  check(n <= 5, "ID checklist prints in a few pages", `${n} pages`);
  await page.context().close();
}

// ---------- 13. Read aloud skips the map ----------
{
  const page = await newPage();
  await page.addInitScript(() => {
    window.__spoken = [];
    window.speechSynthesis.speak = (u) => window.__spoken.push(u.text);
    window.speechSynthesis.getVoices = () => [];
  });
  await page.goto(BASE + "/map/");
  await page.getByRole("button", { name: "Read aloud" }).click();
  const spoken = await page.evaluate(() => window.__spoken.join(" "));
  check(spoken.length > 100, "read aloud speaks the page");
  check(!/Leaflet|OpenStreetMap/.test(spoken), "read aloud skips the map");
  check(await seen(page.getByRole("button", { name: "Stop reading" })), "read aloud can be stopped");
  await page.context().close();
}

// ---------- 14. Flyer, 404 ----------
{
  const page = await newPage();
  await page.goto(BASE + "/flyer/");
  await page.waitForSelector("[role=img][aria-label^='QR code'] svg");
  check((await page.locator("[aria-label^='QR code']").getAttribute("aria-label")).includes("localhost"), "flyer QR code uses the site's real address");
  await page.emulateMedia({ media: "print" });
  check((await pdfPages(page)) === 1, "flyer prints on one page");
  await page.emulateMedia({ media: "screen" });
  await page.goto(BASE + "/no-such-page/");
  check(await seen(page.getByText("We could not find that page.")), "friendly page for a wrong address");
  check(page.outside.length === 0, "no requests to outside sites (besides map pictures)", page.outside.join(", "));
  await page.context().close();
}

// ---------- 15. Make handouts ----------
{
  const page = await newPage();
  await page.goto(BASE + "/handout/");
  const make = page.getByRole("button", { name: "Make my handout" });
  await make.click();
  check(await seen(page.getByText(/First, tell us where you will hand these out/)), "handouts: asks where first");
  check((await page.locator("article").count()) === 0, "handouts: no handout without a place");
  const broken = await splitWords(page, "main button, main label");
  check(broken.length === 0, "handouts: no words split across lines", broken.join(", "));
  const spill = await spilling(page, "main button, main label");
  check(spill.length === 0, "handouts: no text spilling out of buttons", spill.join(", "));

  // Up to 4 needs (3 are picked to start).
  await page.getByRole("button", { name: /^Get an ID/ }).click();
  await page.getByRole("button", { name: /^Jobs/ }).click();
  const picked = await page.locator("button[aria-pressed=true]").count();
  check(picked === 4, "handouts: no more than 4 needs", `${picked} picked`);
  await page.getByRole("button", { name: /^Get an ID/ }).click();

  await page.locator("select").first().selectOption("aus-downtown");
  await page.getByLabel("Name of this spot").fill("Republic Square Park");
  await page.getByRole("radio", { name: "English" }).check();
  await make.click();
  check(await seen(page.getByRole("heading", { name: "Your handout is ready" })), "handouts: preview opens");
  const sheet = page.locator("article").first();
  const text = await sheet.textContent();
  check(text.includes("Austin Central Library") && text.includes("710 W. Cesar Chavez"), "handouts: nearest library with its address", text.slice(0, 200));
  check(/About \d\.\d miles \w+ of Republic Square Park/.test(text), "handouts: directions from the spot they named");
  check(/Ask at the front desk to use a free computer/.test(text), "handouts: explains how to use a library computer");
  check(text.includes("localhost"), "handouts: shows the site address to type");
  check(/Redemption is a free Christian website/.test(text), "handouts: says who we are");
  check(/Rest for the tired/.test(text) && /Matthew 11:28/.test(text), "handouts: includes the devotional");
  check(/Trinity Center|ARCH|LifeWorks/.test(text), "handouts: lists help near the spot");
  check(/2-1-1/.test(text) && /988/.test(text), "handouts: 2-1-1 and crisis numbers");
  check(await seen(page.locator("article [role=img][aria-label^='QR code'] svg")), "handouts: QR code drawn");
  await axe(page, "handout preview");
  await page.emulateMedia({ media: "print" });
  check((await pdfPages(page)) === 1, "handouts: one full flyer prints on one page");
  check(!(await page.getByRole("button", { name: "Print handouts" }).isVisible()), "handouts: buttons hidden when printing");
  await page.emulateMedia({ media: "screen" });

  // Both languages, two per page.
  await page.getByRole("button", { name: "Change answers" }).click();
  check((await page.getByLabel("Name of this spot").inputValue()) === "Republic Square Park", "handouts: answers kept when changing them");
  await page.getByRole("radio", { name: /^Both/ }).check();
  await page.getByRole("radio", { name: /2 flyers per page/ }).check();
  await make.click();
  check((await page.locator("article").count()) === 2, "handouts: half size shows two flyers");
  const langs = await page.$$eval("article", (a) => a.map((x) => x.lang));
  check(langs.join() === "en,es", "handouts: one English and one Spanish", langs.join());
  check(await seen(page.getByText("Usted es amado. No está solo.")), "handouts: Spanish flyer is in Spanish");
  await page.emulateMedia({ media: "print" });
  check((await pdfPages(page)) === 1, "handouts: two half flyers fit on one page");
  await page.emulateMedia({ media: "screen" });

  // Both languages, full size = 2 pages; no devotional.
  await page.getByRole("button", { name: "Change answers" }).click();
  await page.getByRole("radio", { name: /1 big flyer/ }).check();
  await page.getByRole("combobox", { name: "Add a short devotional?" }).selectOption("none");
  await make.click();
  check(!(await page.getByText("A word of hope").isVisible()), "handouts: devotional can be left off");
  await page.emulateMedia({ media: "print" });
  check((await pdfPages(page)) === 2, "handouts: both languages full size prints 2 pages");
  await page.emulateMedia({ media: "screen" });

  // Nothing typed is stored.
  const stored = await page.evaluate(() => JSON.stringify({ ...sessionStorage }) + JSON.stringify({ ...localStorage }) + document.cookie);
  check(!/Republic|aus-downtown/.test(stored), "handouts: nothing typed is saved", stored);
  check(page.outside.length === 0, "handouts: no requests to outside sites", page.outside.join(", "));
  await page.context().close();
}
{
  // Other cities, far away, and phones.
  const page = await newPage({ width: 320 });
  await page.goto(BASE + "/handout/");
  await page.getByPlaceholder(/ZIP/).fill("77002");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await seen(page.getByText(/ZIP 77002 \(Houston\)/));
  await page.getByRole("button", { name: "Make my handout" }).click();
  check(await seen(page.getByText(/Houston Central Library/)), "handouts: Houston ZIP picks the Houston library");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(overflow <= 0, "handouts: preview fits a 320px phone", `${overflow}px`);
  await page.emulateMedia({ media: "print" });
  check((await pdfPages(page)) === 1, "handouts: prints one page from a phone");
  await page.emulateMedia({ media: "screen" });
  await page.getByRole("button", { name: "Change answers" }).click();
  await page.getByRole("button", { name: "Change", exact: true }).click();
  await page.getByPlaceholder(/ZIP/).fill("79101");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await seen(page.getByText(/ZIP 79101/));
  await page.getByRole("button", { name: "Make my handout" }).click();
  check(await seen(page.getByText(/Ask anyone where the closest public library is/)), "handouts: far from our cities, no far-off library is named");
  await page.context().close();
}
{
  const page = await newPage({ lang: "es" });
  await page.goto(BASE + "/handout/");
  check(await seen(page.getByRole("heading", { name: "Hacer volantes" })), "handouts page in Spanish");
  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(150);
    const broken = await splitWords(page, "main button, main label");
    check(broken.length === 0, `handouts: no words split at ${width}px (es)`, broken.join(", "));
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.locator("select").first().selectOption("aus-downtown");
  await page.getByRole("button", { name: "Hacer mi volante" }).click();
  const langs = await page.$$eval("article", (a) => a.map((x) => x.lang));
  check(langs.join() === "es", "handouts: Spanish site makes a Spanish flyer by default", langs.join());
  await page.context().close();
}

check(pageErrors.length === 0, "no JavaScript errors on any page", pageErrors.slice(0, 3).join(" | "));

await browser.close();
server.close();
console.log(`\n${passes} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
