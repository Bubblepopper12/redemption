# Redemption

**Every person has worth. Every person can be redeemed.**

Redemption is a free, Christian, faith-based website that helps people experiencing homelessness in **Texas** find food, shelter, showers, IDs, phones, churches, clinics and hospitals, jobs, veterans services, and legal help.

It now covers **Austin, Houston, Dallas, San Antonio, Fort Worth, and El Paso** (101 places), with statewide help (2-1-1, SNAP, Medicaid, Lifeline, legal aid, the VA) for everyone else.

It is built for public library computers, shelter computers, and volunteers helping someone on their phone. Pages are big, simple, and fast, and there is a **Print My Help Sheet** button so people can take their results with them on paper.

Help is open to everyone. Faith is never a condition of getting help.

---

## What is on the site

| Page | What it does |
| --- | --- |
| `/` Find Help | Mission, Bible verse, optional first name, where you are (pick your city and a place, a Texas ZIP code, or "Use my location"), "What do you need today?" buttons, then a map and list of the closest places, a tip for each need, and **Print My Help Sheet**. |
| `/map/` | Map and full list of every place, with city and type filters. `/map/#church` opens with churches picked (also `#library`, `#food`, `#hospital`, and the other types). |
| `/id/` | Get Your ID checklist: birth certificate → Social Security card → Texas ID → passport. Costs, fee waivers with official sources, and the offices in the city you pick. |
| `/connected/` | Lifeline phone program, library cards, free Wi-Fi and computers in each city. |
| `/more-help/` | 2-1-1, how to ask for a shelter bed in each city, SNAP and Medicaid, help paying for a doctor or hospital, jobs that are hiring, veterans, legal aid, and crisis lines. |
| `/bible/` | The **Free Bible** page (linked in the header): read or listen free online, or get a paper Bible from a church. |
| `/handout/` Make Handouts | For volunteers, churches, and outreach teams. Answer five questions (where you will hand them out, what help to list, language, size, and a devotional) and print flyers to pass out. Each flyer gives walking directions to the closest public library (for a free computer), steps for using Redemption there, the web address and a QR code, the closest help for the needs picked, 2-1-1 and crisis lines, who we are, and a short devotional with a prayer. English, Spanish, or one of each; one big flyer per page or two per page to cut in half. |
| `/flyer/` | A simple one-page flyer with the web address, a QR code, and 2-1-1, to post at shelters and churches. |
| `/privacy/` | Plain-language privacy promise. |

Every page has:

- **English / Español** button
- **Read aloud** button (uses the browser's built-in voice)
- **Helper mode** switch for volunteers and caseworkers: one screen with numbered steps (1. Where are you? 2. What do they need? 3. Their first name), quick filters (distance, open now, serves meals), instant results, the print button always visible, and a shortcut to Make Handouts
- A **Verse of the day** and the 2-1-1 number in the footer

Other things that help:

- **Open now / Closed now** badges, always in Texas time (El Paso uses Mountain time).
- Results stay in the person's own city (plus anything within 15 miles), so nobody in Dallas is sent to Fort Worth. Far from any covered city? The page says so kindly and points to 2-1-1.
- If the online map can't load (a blocked or slow network), a simple drawn map appears instead of error pictures.
- On shared computers, the name and choices clear by themselves after 15 minutes of no use.

## Privacy

- No accounts, no login, no cookies, no analytics, no ads.
- The first name is only shown on screen. It is never saved or sent anywhere.
- Location comes only from what the person chooses. It is used in the browser to measure distance and is never saved or sent to us. For a ZIP code, the browser downloads the site's own list of Texas ZIP codes (`public/tx-zips.json`) and looks it up on the screen.
- The only things remembered are the language and Helper mode, and only until the browser tab is closed (`sessionStorage`).
- There is no server and no database. The site is plain files.
- Map images load from OpenStreetMap's tile servers. Browsers send only the site's address (not the page) as the Referer, which OpenStreetMap requires.

## Which churches are listed

The **Church** list includes churches whose denomination or statement of faith holds to historic, traditional Christian teaching, including on marriage and sexuality. Examples: Catholic, Southern Baptist, and non-denominational evangelical churches. Churches from denominations that officially affirm otherwise (for example the Episcopal Church, PC(USA), and the United Methodist Church) are not in the Church list.

Food pantries, day centers, and other services are listed for the help they give, whoever runs them. For example, Trinity Center (showers and ID help, at St. David's Episcopal) and the Micah 6 food pantry stay listed.

---

## Run it on your computer

You need [Node.js](https://nodejs.org/) version 20 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To build the finished site:

```bash
npm run build
```

This first checks the data file for mistakes, then writes the whole site into the `out/` folder. Anything that can host plain files can serve `out/`.

## Put it online for free

### Vercel

1. Put this project on GitHub.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, and click **Add New → Project**.
3. Pick this repository. Vercel detects Next.js. Click **Deploy**.

### Netlify

1. Go to [netlify.com](https://www.netlify.com), click **Add new site → Import an existing project**, and pick this repository.
2. The settings come from `netlify.toml` (build command `npm run build`, publish folder `out`). Click **Deploy**.

### The web address on the Help Sheet, flyer, and handouts

The Help Sheet, the flyer, and the handouts (and their QR codes) show the site's address. It is chosen like this:

1. `NEXT_PUBLIC_SITE_URL`, if you set it (for example `https://redemption.com`) in the Vercel or Netlify **Environment Variables** settings.
2. Otherwise, the production address Vercel or Netlify gives the project.
3. Otherwise, whatever address the page was opened from.

Only set `NEXT_PUBLIC_SITE_URL` to a domain you own and have connected in the **Domains** settings, so the QR code never sends people somewhere else.

---

## How to add or update a location

All locations live in one file: **`data/texas-resources.json`**. You do not need to know how to program.

### The easy way (on the GitHub website)

1. Open `data/texas-resources.json` on GitHub.
2. Click the **pencil** icon (Edit this file).
3. Find a place to change, or copy an existing entry to add a new one (see the template below).
4. Scroll down, write a short note like "Update Micah 6 hours", and click **Commit changes**.
5. Vercel or Netlify rebuilds the site in a few minutes. If there is a mistake in the file, the build stops and tells you what is wrong in plain English. The live site stays as it was until you fix it.

### Template for a new place

Copy this, paste it into the `"resources"` list, and fill it in. Each entry is wrapped in `{ }` and separated from the next one by a comma.

```json
{
  "id": "short-unique-name",
  "city": "houston",
  "name": "Name of the Place",
  "category": "food",
  "helpsWith": ["food"],
  "address": "123 Example St., Houston, TX 77002",
  "lat": 29.7589,
  "lng": -95.3677,
  "coordsApproximate": true,
  "hours": "Mon–Fri 9 am–5 pm",
  "open": [{ "days": [1, 2, 3, 4, 5], "from": "09:00", "to": "17:00" }],
  "phone": "713-555-0100",
  "website": "https://example.org",
  "notes": "One or two short sentences. What happens there?",
  "bring": "What should the person bring?",
  "es": {
    "hours": "Lun–Vie 9 am–5 pm",
    "notes": "Las mismas notas en español.",
    "bring": "Qué traer, en español."
  },
  "lastVerified": "2026-09-25",
  "source": "https://example.org/page-where-you-checked"
}
```

### What each field means

| Field | Required? | What to write |
| --- | --- | --- |
| `id` | Yes | A short name with no spaces, different from every other entry. Example: `hou-search`. |
| `city` | Yes | One of `austin`, `houston`, `dallas`, `san-antonio`, `fort-worth`, `el-paso`. (Adding a new city? See below.) |
| `name` | Yes | The place's name. |
| `category` | Yes | The kind of place. One of: `library`, `shelter`, `day-center`, `food`, `church`, `clinic`, `hospital`, `id-office`, `jobs`, `veterans`, `legal`. |
| `helpsWith` | Yes | Which "What do you need today?" buttons should show this place. Any of: `food`, `shelter`, `showers`, `id`, `internet`, `church`, `medical`, `jobs`, `veterans`, `legal`. |
| `address` | Yes | Full street address with ZIP code. |
| `lat`, `lng` | Yes | Map position. Easy way: in Google Maps, right-click the building. The first number is `lat`, the second is `lng` (keep the minus sign). Or run `npm run geocode` (below). |
| `coordsApproximate` | No | `true` if the pin is only close, `false` if it is exact. |
| `hours` | Yes | Short and simple, for people to read. If you cannot confirm the hours, write `Call to confirm`. |
| `open` | No | The same hours for the **Open now** badge. `days` uses 0 = Sunday … 6 = Saturday; times use a 24-hour clock (`"13:30"`). For 24 hours, use `"from": "00:00", "to": "24:00"` with all 7 days. **Leave it out if you are not sure.** |
| `serviceTimes` | Churches | Worship times, for example `Sun 9 am and 11 am`. |
| `servesMeals` | Churches | `true` only if you have confirmed the church serves meals. |
| `phone` | Yes | Like `512-555-0100`. If there is no confirmed number, write `Call to confirm`. |
| `website` | No | The place's own web page. |
| `notes` | No | One or two short sentences at a 5th-grade reading level. |
| `bring` | No | What to bring (ID, papers, a bag). |
| `idStep` | No | For ID offices: `1` birth certificates, `2` Social Security, `3` Texas ID (DPS), `4` passports. They then appear in the ID guide for that city. |
| `es` | No | Spanish versions of `hours`, `notes`, `bring`, and `serviceTimes`. If it is missing, the English text is shown. |
| `lastVerified` | Yes | The date you checked the information, like `2026-09-25`. |
| `source` | No | The web page where you checked it, so the next person can check again. |

### Adding a new city

1. Add the city to `lib/cities.ts`: its name, center point, how to ask for a shelter bed there, its 24-hour crisis line, a help-paying-for-care program, and a few landmarks for the place picker.
2. Add its id to the `CITIES` list in `scripts/check-data.mjs`.
3. Add its places to `data/texas-resources.json`.

### Rules for accurate information

- **Never guess** an address, phone number, or hours. If you cannot confirm something, leave it out or write `Call to confirm`.
- Check the place's own website, a government website, or call them.
- Update `lastVerified` every time you check an entry, even if nothing changed.
- Try to recheck every entry at least every 3 months. Hours change often.

### Check your work

```bash
npm run check-data
```

This finds missing fields, typos in cities and categories, repeated ids, bad "open" times, and map positions outside Texas.

### Fix map pins automatically

Most pins in the starter data are close but not exact (they are marked `"coordsApproximate": true`). On a computer with normal internet, run:

```bash
npm run geocode             # shows how far each pin is from its address
npm run geocode -- --write  # saves the exact positions
```

This uses OpenStreetMap's free Nominatim service. Look at the map afterward to double-check.

---

## About the starter data

- **101 places in 6 cities.** Austin 44, Houston 14, Dallas 12, San Antonio 10, Fort Worth 11, El Paso 10. They include 17 churches (including Mosaic Church's North and South Austin campuses), 14 libraries, 14 shelters, 8 day centers, 6 public hospitals, and more.
- Every entry was researched on **September 25, 2026** by searching the place's own website or an official government site, and each entry lists that `source`. The build environment could not open those pages directly (only search results), so before launch, a volunteer should call each place or open its `source` page to reconfirm the details, then update `lastVerified`.
- Where hours or phone numbers could not be confirmed, the entry says **Call to confirm**.
- Places that were closed when checked (for example Austin's Willie Mae Kirk Branch Library, which is being renovated) were left out.
- Texas DPS office addresses (Austin) come from DPS office listings; DPS offices are by appointment only. Other cities link to the official DPS office finder.
- Caritas of Austin's kitchen was closed for repairs, with an announced reopening on **October 8, 2026**. Update that entry after it reopens.
- The ID guide's fee waiver rules were checked against Texas DSHS, Texas DPS, the Texas statutes, and the Texas Legislature's record for HB 505 (2025), which did not pass.
- "Jobs that are hiring" change daily, so the site lists job centers (Workforce Solutions, Goodwill) and points to the state's free, live job board, WorkInTexas.com, instead of listing openings that would go out of date.

## Testing

`tests/site-check.mjs` opens the built site in a real browser and checks about 250 things: every page in English and Spanish at phone to desktop widths, every city and need, ZIP codes, "Use my location", printing (the Help Sheet stays on one page), helper mode (including that no button words get split or spill out), the handout maker (library directions, devotional, page counts for every size and language, and that nothing is cut off the paper in any city), open-now times, the map and its fallback, read aloud, privacy auto-clear, the church list, and an accessibility scan (WCAG 2 AA).

```bash
npm run build
npm install --no-save playwright axe-core
npx playwright install chromium   # one time
npm test
```

## Tech

- [Next.js](https://nextjs.org/) with static export (`output: "export"`), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- Maps: [Leaflet](https://leafletjs.com/) with [OpenStreetMap](https://www.openstreetmap.org/copyright) tiles (no API keys). Leaflet loads only on pages that show a map. If traffic grows a lot, OpenStreetMap asks sites to switch to another tile provider.
- QR code: made in the browser with the [`qrcode`](https://www.npmjs.com/package/qrcode) package, only on the flyer and handout pages.
- Handout wording is in `lib/handout-strings.ts`; the devotionals are in `lib/devotionals.ts` (keep them short, warm, and simple, and use verses from `lib/verses.ts`).
- Distances are measured in the browser: straight-line distance plus 25% for streets, at a walking pace of 3 miles per hour.
- Texas ZIP code centers come from the `zipcodes` package's U.S. ZIP data (BSD license), saved as `public/tx-zips.json`.

## Scripture

English verses are from the World English Bible (public domain) and the King James Version (public domain in the U.S.). Spanish verses are from the Reina-Valera 1960 © Sociedades Bíblicas en América Latina, 1960; renewed © Sociedades Bíblicas Unidas, 1988. Used by permission. Short quotations are used within the publisher's quotation guidelines.
