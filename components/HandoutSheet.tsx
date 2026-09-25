"use client";

import { useLayoutEffect, useRef } from "react";
import { handoutSheet } from "@/lib/handout-strings";
import { compassIndex, type Place } from "@/lib/geo";
import { localized, phoneLabel, type Resource } from "@/lib/resources";
import type { City } from "@/lib/cities";
import type { Devotional } from "@/lib/devotionals";
import type { Hit } from "@/lib/search";
import { shortUrl } from "@/lib/site-url";
import { LogoMark } from "./Logo";
import { QrCode } from "./QrCode";

export type HandoutData = {
  from: Place;
  spot: string;
  library: Omit<Hit, "num"> | null;
  places: Omit<Hit, "num">[];
  city: City | null;
  devotional: Devotional | null;
  siteUrl: string;
};

/**
 * One printed handout. "full" fills a letter page; "half" is half a page,
 * so two fit on one sheet and can be cut apart. Sizes are in inches so the
 * preview on screen matches the paper exactly. No map: plain words and big
 * print are easier to follow and cheaper to print.
 */
export function HandoutSheet({ data, lang, size }: { data: HandoutData; lang: "en" | "es"; size: "full" | "half" }) {
  const s = handoutSheet[lang];
  const { from, library, places, city, devotional } = data;
  const url = shortUrl(data.siteUrl);
  const spot = data.spot.trim() || s.here;
  const half = size === "half";
  const sheet = useFitToPaper([data, lang, size]);

  const walkTime = (min: number) => (min >= 60 ? `${Math.floor(min / 60)} h ${min % 60} min` : `${min} min`);
  const directions = library
    ? `${s.from(s.miles(library.miles), s.dirs[compassIndex(from, library.r)], spot)} · ${library.miles > 4 ? s.farWalk : s.walk(walkTime(library.minutes))}`
    : "";
  // "Call to confirm" is not a number anyone can dial, so leave it off paper.
  const phone = (r: Resource) => (/\d/.test(r.phone) ? phoneLabel(r.phone, lang) : "");

  const steps = (
    <ol className={`grid list-decimal pl-[1.2em] ${half ? "gap-[0.05in] text-[8.5pt]" : "gap-[0.1in] text-[11pt]"} leading-snug`}>
      <li>
        {library ? (
          <>
            {s.step1}
            <span className={`mt-[0.03in] block rounded-[0.06in] border border-black ${half ? "p-[0.04in]" : "p-[0.08in]"}`}>
              <strong className={half ? "" : "text-[12pt]"}>{library.r.name}</strong>
              <br />
              {library.r.address}
              <br />
              {directions}.
              <br />
              {s.hours}: {localized(library.r, "hours", lang)}
            </span>
          </>
        ) : (
          s.stepNoLibrary
        )}
      </li>
      <li>{s.step2}</li>
      <li>
        {s.step3} <strong className="whitespace-nowrap">{url}</strong>.{!half && <> {s.step3b}</>}
      </li>
    </ol>
  );

  const placeList = places.length > 0 && (
    <div>
      <p className={`font-bold ${half ? "text-[9pt]" : "text-[13pt]"}`}>{s.nearTitle}</p>
      <ul className={`mt-[0.04in] grid ${half ? "gap-[0.04in] text-[7.5pt]" : "grid-cols-2 gap-x-[0.25in] gap-y-[0.06in] text-[9.5pt]"} leading-snug`}>
        {places.map((p) => (
          <li key={p.r.id} className="border-t border-black pt-[0.04in]">
            <strong className={half ? "" : "text-[10.5pt]"}>{p.r.name}</strong>
            <br />
            {p.r.address}
            {phone(p.r) && <> · <span className="whitespace-nowrap">{phone(p.r)}</span></>}
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
    <div className={`rounded-[0.08in] border-2 border-black ${half ? "p-[0.06in] text-[7.5pt]" : "p-[0.12in] text-[10pt]"} leading-snug`}>
      <p className={`font-extrabold ${half ? "text-[9pt]" : "text-[14pt]"}`}>2-1-1</p>
      <p>{s.call211}</p>
      <p className="mt-[0.03in]">
        {s.crisis}
        {city ? ` ${city.crisis.name}: ${city.crisis.phone}.` : ""}
      </p>
      <p className="font-bold">{s.emergency}</p>
    </div>
  );

  const devotionBox = devotional && (
    <div className={`rounded-[0.08in] bg-[#fff5e3] ${half ? "p-[0.06in] text-[7.5pt]" : "p-[0.14in] text-[10pt]"} leading-snug`}>
      {!half && (
        <p className="text-[8.5pt] font-bold uppercase tracking-wider">
          {s.hopeTitle}: {devotional.title[lang]}
        </p>
      )}
      <p className={`font-serif italic ${half ? "" : "mt-[0.05in] text-[11pt]"}`}>
        “{devotional.verse[lang]}” <span className="not-italic">— {devotional.verse.ref[lang]}</span>
      </p>
      {!half && <p className="mt-[0.05in]">{devotional.reflection[lang]}</p>}
      <p className={half ? "mt-[0.03in]" : "mt-[0.05in]"}>
        <strong>{s.prayer}:</strong> {devotional.prayer[lang]}
      </p>
    </div>
  );

  const qr = (
    <div className="flex flex-col items-center gap-[0.04in] text-center">
      <QrCode url={data.siteUrl} label={`QR code for ${url}`} className={half ? "h-[1.05in] w-[1.05in]" : "h-[1.7in] w-[1.7in]"} />
      <p className={`font-mono font-bold ${half ? "text-[7.5pt]" : "text-[10pt]"} break-all`}>{url}</p>
      {!half && <p className="text-[9pt]">{s.scan}</p>}
    </div>
  );

  const header = (
    <div className={`flex items-center justify-between gap-[0.15in] border-b-2 border-black ${half ? "pb-[0.05in]" : "pb-[0.08in]"}`}>
      <div className="flex items-center gap-[0.08in]">
        <LogoMark className={half ? "h-[0.4in] w-[0.4in]" : "h-[0.52in] w-[0.52in]"} />
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
      <article ref={sheet} lang={lang} style={paperSize(7.6, 4.85)} className="flex flex-col overflow-hidden bg-white p-[0.18in] text-black">
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
    <article ref={sheet} lang={lang} style={paperSize(7.6, 10)} className="flex flex-col overflow-hidden bg-white px-[0.25in] py-[0.22in] text-black">
      {header}
      <p className="mt-[0.1in] rounded-[0.08in] border border-black px-[0.12in] py-[0.08in] text-[10.5pt] leading-snug">{s.who}</p>
      <div className="mt-[0.12in] grid grid-cols-[1fr_1.9in] items-start gap-[0.25in]">
        <div>
          <p className="mb-[0.06in] text-[14pt] font-bold">{s.howTitle}</p>
          {steps}
        </div>
        <div className="pt-[0.1in]">{qr}</div>
      </div>
      <div className="mt-[0.14in]">{placeList}</div>
      <div className="mt-auto grid grid-cols-[2.3in_1fr] gap-[0.15in] pt-[0.12in]">
        {helpBox}
        {devotionBox ?? <div />}
      </div>
      <p className="mt-[0.08in] text-center font-serif text-[9pt] italic">{s.footer}</p>
    </article>
  );
}

/**
 * The sheet is laid out in a box 1/fit bigger and then zoomed by fit, so it always
 * lands on paper at exactly width × height inches. fit starts at 1 (normal size).
 */
function paperSize(width: number, height: number): React.CSSProperties {
  return {
    width: `calc(${width}in / var(--fit, 1))`,
    height: `calc(${height}in / var(--fit, 1))`,
    zoom: "var(--fit, 1)",
  } as React.CSSProperties;
}

/**
 * If a long address or a Spanish translation makes the words run past the bottom
 * of the paper, shrink the whole sheet a little at a time until everything fits.
 */
function useFitToPaper(deps: unknown[]) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof CSS === "undefined" || !CSS.supports("zoom", "0.5")) return;
    const fit = () => {
      let z = 1;
      el.style.setProperty("--fit", "1");
      while (z > 0.7 && el.scrollHeight > el.clientHeight + 1) {
        z = Math.round((z - 0.02) * 100) / 100;
        el.style.setProperty("--fit", String(z));
      }
      el.dataset.fit = String(z);
    };
    fit();
    document.fonts?.ready.then(fit);
  }, deps);
  return ref;
}
