# Redemption

**Every person has worth. Every person can be redeemed.**

Redemption is a free, Christian, faith-based website that helps people experiencing homelessness in **Austin, Texas** find food, shelter, showers, IDs, phones, churches, medical care, jobs, veterans services, and legal help.

It is built for public library computers, shelter computers, and volunteers helping someone on their phone. Pages are big, simple, and fast, and there is a **Print My Help Sheet** button so people can take their results with them on paper.

Help is open to everyone. Faith is never a condition of getting help.

---

## What is on the site

| Page | What it does |
| --- | --- |
| `/` Find Help | Mission, Bible verse, optional first name, location picker, "What do you need today?" buttons, then a map and list of the closest places, plus **Print My Help Sheet**. |
| `/map/` | Map and full list of every place, with type filters. `/map/#church` opens with churches picked (the same works for `#library`, `#food`, and the other types). |
| `/id/` | Get Your ID checklist: birth certificate → Social Security card → Texas ID → passport, with costs, fee waivers, official sources, and the nearest offices. |
| `/connected/` | Lifeline phone program, library card sign-up, free Wi-Fi and computers. |
| `/more-help/` | 2-1-1, shelter intake, SNAP and Medicaid, meal trucks, jobs, veterans, legal aid, crisis lines. |
| `/bible/` | The **Free Bible** page (linked in the header): read or listen free online, or get a paper Bible from a church. |
| `/flyer/` | A printable one-page flyer with the web address, a QR code, and 2-1-1, to hand out at shelters and churches. |
| `/privacy/` | Plain-language privacy promise. |

Every page has:

- **English / Español** button
- **Read aloud** button (uses the browser's built-in voice)
- **Helper mode** switch for volunteers and caseworkers: a compact screen with quick filters (distance, serves meals), instant results, and the print button always visible
- A **Verse of the day** and the 2-1-1 number in the footer

## Privacy

- No accounts, no login, no cookies, no analytics, no ads.
- The first name is only shown on screen. It is never saved or sent anywhere.
- Location comes only from what the person chooses (ZIP code, a landmark from a list, or "Use my location"). It is used in the browser to measure distance and is never saved or sent to us.
- The only things remembered are the language and Helper mode, and only until the browser tab is closed (`sessionStorage`).
- There is no server and no database. The site is plain files.
- Map images load from OpenStreetMap's tile servers, like any site with a map.
- "Clear my info" wipes everything on a shared computer.

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

### Set your web address

The Help Sheet and the flyer's QR code use `https://redemption.com` by default. If your address is different, add this **environment variable** in Vercel or Netlify, then deploy again:

```
NEXT_PUBLIC_SITE_URL=https://your-address.org
```

You also have to own the domain (for example `redemption.com`) and connect it in the Vercel or Netlify **Domains** settings.

---

## How to add or update a location

All locations live in one file: **`data/austin-resources.json`**. You do not need to know how to program.

### The easy way (on the GitHub website)

1. Open `data/austin-resources.json` on GitHub.
2. Click the **pencil** icon (Edit this file).
3. Find a place to change, or copy an existing entry to add a new one (see the template below).
4. Scroll down, write a short note like "Update Micah 6 hours", and click **Commit changes**.
5. Vercel or Netlify rebuilds the site in a few minutes. If there is a mistake in the file, the build stops and tells you what is wrong in plain English. The live site stays as it was until you fix it.

### Template for a new place

Copy this, paste it into the `"resources"` list, and fill it in. Each entry is wrapped in `{ }` and separated from the next one by a comma.

```json
{
  "id": "short-unique-name",
  "name": "Name of the Place",
  "category": "food",
  "helpsWith": ["food"],
  "address": "123 Example St., Austin, TX 78701",
  "lat": 30.2672,
  "lng": -97.7431,
  "coordsApproximate": true,
  "hours": "Mon–Fri 9 am–5 pm",
  "phone": "512-555-0100",
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
| `id` | Yes | A short name with no spaces, different from every other entry. Example: `micah6`. |
| `name` | Yes | The place's name. |
| `category` | Yes | The kind of place. One of: `library`, `shelter`, `day-center`, `food`, `church`, `clinic`, `id-office`, `jobs`, `veterans`, `legal`. |
| `helpsWith` | Yes | Which "What do you need today?" buttons should show this place. Any of: `food`, `shelter`, `showers`, `id`, `internet`, `church`, `medical`, `jobs`, `veterans`, `legal`. |
| `address` | Yes | Full street address with ZIP code. |
| `lat`, `lng` | Yes | Map position. Austin is about `30.1` to `30.5` for `lat` and `-97.9` to `-97.6` for `lng` (keep the minus sign). Easy way: in Google Maps, right-click the building. The first number is `lat`, the second is `lng`. Or run `npm run geocode` (below). |
| `coordsApproximate` | No | `true` if the pin is only close, `false` if it is exact. |
| `hours` | Yes | Short and simple. If you cannot confirm the hours, write `Call to confirm`. |
| `serviceTimes` | Churches | Worship times, for example `Sun 9 am and 11 am`. |
| `servesMeals` | Churches | `true` only if you have confirmed the church serves meals. |
| `phone` | Yes | Like `512-555-0100`. If there is no confirmed number, write `Call to confirm`. |
| `website` | No | The place's own web page. |
| `notes` | No | One or two short sentences at a 5th-grade reading level. |
| `bring` | No | What to bring (ID, papers, a bag). |
| `es` | No | Spanish versions of `hours`, `notes`, `bring`, and `serviceTimes`. If it is missing, the English text is shown. |
| `lastVerified` | Yes | The date you checked the information, like `2026-09-25`. |
| `source` | No | The web page where you checked it, so the next person can check again. |

### Rules for accurate information

- **Never guess** an address, phone number, or hours. If you cannot confirm something, leave it out or write `Call to confirm`.
- Check the place's own website, a government website, or call them.
- Update `lastVerified` every time you check an entry, even if nothing changed.
- Try to recheck every entry at least every 3 months. Hours change often.

### Check your work

```bash
npm run check-data
```

This finds missing fields, typos in categories, repeated ids, and map positions outside Austin.

### Fix map pins automatically

Many pins in the starter data are close but not exact (they are marked `"coordsApproximate": true`). On a computer with normal internet, run:

```bash
npm run geocode             # shows how far each pin is from its address
npm run geocode -- --write  # saves the exact positions
```

This uses OpenStreetMap's free Nominatim service. Look at the map afterward to double-check.

---

## About the starter data

- **47 locations**: 9 public libraries, 4 shelters, 2 day centers, 5 food pantries and kitchens, 6 clinics, 5 ID offices, 13 churches (including Mosaic Church's North and South Austin campuses), plus a job center, the VA clinic, and a legal aid office.
- Every entry was researched on **September 25, 2026** by searching the place's own website or an official government site, and each entry lists that `source`. The build environment could not open those pages directly (only search results), so before launch, a volunteer should call each place or open its `source` page to reconfirm the details, then update `lastVerified`.
- Where hours or phone numbers could not be confirmed, the entry says **Call to confirm**.
- Places that were closed when checked (Willie Mae Kirk Branch Library, which is being renovated) were left out.
- The Texas DPS office addresses come from the DPS office locator listings. DPS offices are by appointment only, and the phone listed is the DPS customer service line.
- Caritas of Austin's kitchen was closed for repairs, with an announced reopening on **October 8, 2026**. Update that entry after it reopens.
- The ID guide's fee waiver rules were checked against Texas DSHS, Texas DPS, the Texas statutes, and the Texas Legislature's record for HB 505 (2025), which did not pass.

## Tech

- [Next.js](https://nextjs.org/) with static export (`output: "export"`), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- Maps: [Leaflet](https://leafletjs.com/) with [OpenStreetMap](https://www.openstreetmap.org/copyright) tiles (no API keys). Leaflet loads only on pages that show a map.
- QR code: made when the site is built with the [`qrcode`](https://www.npmjs.com/package/qrcode) package.
- Distances are measured in the browser: straight-line distance plus 25% for streets, at a walking pace of 3 miles per hour.
- ZIP code centers come from the U.S. ZIP code data in the `zipcodes` package and are built into the page.

## Scripture

English verses are from the World English Bible (public domain) and the King James Version (public domain in the U.S.). Spanish verses are from the Reina-Valera 1960 © Sociedades Bíblicas en América Latina, 1960; renewed © Sociedades Bíblicas Unidas, 1988. Used by permission. Short quotations are used within the publisher's quotation guidelines.
