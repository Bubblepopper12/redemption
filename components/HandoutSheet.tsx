"use client";

import { handoutSheet } from "@/lib/handout-strings";
import { compassIndex, type Place } from "@/lib/geo";
import { localized, phoneLabel } from "@/lib/resources";
import type { City } from "@/lib/cities";
import type { Devotional } from "@/lib/devotionals";
import type { Hit } from "@/lib/search";
import { shortUrl } from "@/lib/site-url";
import { DrawnMap } from "./DrawnMap";
import { LogoMark } from "./Logo";
import { QrCode } from "./QrCode";

export type HandoutData = {
  from: Place;
  spot: string;
  library: Omit<Hit, "num"> | null;
  places: Hit[];
  city: City | null;
  devotional: Devotional | null;
  siteUrl: string;
};

/**
 * One printed handout. "full" fills a letter page; "half" is half a page,
 * so two fit on one sheet and can be cut apart. Sizes are in inches so the
 * preview on screen matches the paper exactly.
 */
export function HandoutSheet({ data, lang, size }: { data: HandoutData; lang: "en" | "es"; size: "full" | "half" }) {
  const s = handoutSheet[lang];
  const { from, library, places, city, devotional } = data;
  const url = shortUrl(data.siteUrl);
  const spot = data.spot.trim() || s.here;
  const half = size === "half";

  const walkTime = (min: number) => (min >= 60 ? `${Math.floor(min / 60)} h ${min % 60} min` : `${min} min`);
  const directions = library
    ? `${s.from(s.miles(library.miles), s.dirs[compassIndex(from, library.r)], spot)} · ${library.miles > 4 ? s.farWalk : s.walk(walkTime(library.minutes))}`
    : "";
  const pins = [
    ...(library ? [{ id: library.r.id, num: 1, lat: library.r.lat, lng: library.r.lng }] : []),
    ...places.map((p) => ({ id: p.r.id, num: p.num, lat: p.r.lat, lng: p.r.lng })),
  ];

  const steps = (
    <ol className={`grid list-decimal pl-[1.1em] ${half ? "gap-[0.04in] text-[8pt]" : "gap-[0.07in] text-[10pt]"} leading-snug`}>
      <li>
        {library ? (
          <>
            {s.step1}{" "}
            <strong>
              {library.r.name}
              {!half && " (1)"}
            </strong>
            , {library.r.address}.
            <br />
            {directions}.
            {!half && (
              <>
                <br />
                {s.hours}: {localized(library.r, "hours", lang)}
              </>
            )}
          </>
        ) : (
          s.stepNoLibrary
        )}
      </li>
      <li>{s.step2}</li>
      <li>
        {s.step3} <strong className="whitespace-nowrap">{url}</strong>.{!half && <> {s.step3b}</>}
      </li>
      {!half && <li>{s.step4}</li>}
    </ol>
  );

  const placeList = places.length > 0 && (
    <div>
      <p className={`font-bold ${half ? "text-[9pt]" : "text-[12pt]"}`}>{s.nearTitle}</p>
      <ul className={`mt-[0.03in] grid ${half ? "gap-[0.04in] text-[7.5pt]" : "grid-cols-2 gap-x-[0.2in] gap-y-[0.06in] text-[8.5pt]"} leading-snug`}>
        {places.map((p) => (
          <li key={p.r.id} className="border-t border-black pt-[0.03in]">
            <strong>
              {!half && `${p.num}. `}
              {p.r.name}
            </strong>
            <br />
            {p.r.address} · {phoneLabel(p.r.phone, lang)}
            {!half && (
              <>
                <br />
                {localized(p.r, "hours", lang)}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  const helpBox = (
    <div className={`rounded-[0.08in] border-2 border-black ${half ? "p-[0.06in] text-[7.5pt]" : "p-[0.1in] text-[9.5pt]"} leading-snug`}>
      <p className={`font-extrabold ${half ? "text-[9pt]" : "text-[13pt]"}`}>2-1-1</p>
      <p>{s.call211}</p>
      <p className="mt-[0.03in]">
        {s.crisis}
        {city ? ` ${city.crisis.name}: ${city.crisis.phone}.` : ""}
      </p>
      <p className="font-bold">{s.emergency}</p>
    </div>
  );

  const devotionBox = devotional && (
    <div className={`rounded-[0.08in] bg-[#fff5e3] ${half ? "p-[0.06in] text-[7.5pt]" : "p-[0.12in] text-[9.5pt]"} leading-snug`}>
      {!half && (
        <p className="text-[8pt] font-bold uppercase tracking-wider">
          {s.hopeTitle}: {devotional.title[lang]}
        </p>
      )}
      <p className={`font-serif italic ${half ? "" : "mt-[0.05in] text-[10.5pt]"}`}>
        “{devotional.verse[lang]}” <span className="not-italic">— {devotional.verse.ref[lang]}</span>
      </p>
      {!half && <p className="mt-[0.05in]">{devotional.reflection[lang]}</p>}
      <p className={half ? "mt-[0.03in]" : "mt-[0.05in]"}>
        <strong>{s.prayer}:</strong> {devotional.prayer[lang]}
      </p>
    </div>
  );

  const qr = (
    <div className="flex flex-col items-center gap-[0.03in] text-center">
      <QrCode url={data.siteUrl} label={`QR code for ${url}`} className={half ? "h-[1.05in] w-[1.05in]" : "h-[1.35in] w-[1.35in]"} />
      <p className={`font-mono font-bold ${half ? "text-[7.5pt]" : "text-[9pt]"} break-all`}>{url}</p>
    </div>
  );

  const header = (
    <div className={`flex items-center justify-between gap-[0.15in] border-b-2 border-black ${half ? "pb-[0.05in]" : "pb-[0.08in]"}`}>
      <div className="flex items-center gap-[0.08in]">
        <LogoMark className={half ? "h-[0.4in] w-[0.4in]" : "h-[0.6in] w-[0.6in]"} />
        <div>
          <p className={`font-serif font-bold leading-none ${half ? "text-[15pt]" : "text-[22pt]"}`}>Redemption</p>
          <p className={half ? "text-[7.5pt]" : "text-[9pt]"}>{lang === "es" ? "Ayuda gratis en Texas" : "Free help in Texas"}</p>
        </div>
      </div>
      <p className={`text-right font-serif font-bold italic ${half ? "text-[10.5pt]" : "text-[15pt]"}`}>{s.headline}</p>
    </div>
  );

  if (half) {
    return (
      <article lang={lang} className="flex h-[4.85in] w-[7.6in] flex-col overflow-hidden bg-white p-[0.18in] text-black">
        {header}
        <div className="mt-[0.08in] grid flex-1 grid-cols-[1fr_2.3in] gap-[0.18in]">
          <div className="flex flex-col gap-[0.07in]">
            <p className="text-[8pt] leading-snug">{s.whoShort}</p>
            <p className="text-[10pt] font-bold">{s.howTitle}</p>
            {steps}
            {devotionBox}
          </div>
          <div className="flex flex-col gap-[0.07in]">
            {qr}
            {placeList}
            {helpBox}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article lang={lang} className="flex h-[10in] w-[7.6in] flex-col overflow-hidden bg-white p-[0.3in] text-black">
      {header}
      <p className="mt-[0.1in] rounded-[0.08in] border border-black p-[0.1in] text-[10pt] leading-snug">{s.who}</p>
      <div className="mt-[0.12in] grid grid-cols-[1fr_2.6in] gap-[0.2in]">
        <div>
          <p className="mb-[0.06in] text-[13pt] font-bold">{s.howTitle}</p>
          {steps}
        </div>
        <div className="flex flex-col gap-[0.08in]">
          {pins.length > 0 && (
            <DrawnMap pins={pins} from={from} lang={lang} youLabel={lang === "es" ? "Aquí" : "Here"} />
          )}
          {qr}
        </div>
      </div>
      <div className="mt-[0.12in]">{placeList}</div>
      <div className="mt-auto grid grid-cols-[2.4in_1fr] gap-[0.15in] pt-[0.12in]">
        {helpBox}
        {devotionBox ?? <div />}
      </div>
      <p className="mt-[0.08in] text-center font-serif text-[9pt] italic">{s.footer}</p>
    </article>
  );
}
