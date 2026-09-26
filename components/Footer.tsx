"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { DAILY_VERSES, verseOfTheDay, type Verse } from "@/lib/verses";

export function Footer() {
  const { t, lang } = useApp();
  // Picked after the page loads so it always matches today's date on this computer.
  const [verse, setVerse] = useState<Verse>(DAILY_VERSES[0]);
  useEffect(() => setVerse(verseOfTheDay()), []);

  return (
    <footer className="mt-16 border-t border-line bg-paper print:hidden">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
        <section aria-labelledby="votd" className="rounded-3xl bg-dawn-soft p-6">
          <h2 id="votd" className="text-sm font-bold uppercase tracking-wider text-muted">
            {t.footerVerse}
          </h2>
          <blockquote className="mt-3">
            <p className="font-serif text-xl leading-relaxed text-ink">“{verse[lang]}”</p>
            <footer className="mt-2 font-semibold text-primary">— {verse.ref[lang]}</footer>
          </blockquote>
        </section>

        <section className="flex flex-col justify-center gap-3">
          <a
            href="tel:211"
            className="inline-flex items-center gap-3 self-start rounded-2xl bg-primary px-6 py-4 text-xl font-bold text-white no-underline hover:bg-primary-dark"
          >
            <Phone className="h-6 w-6" aria-hidden="true" />
            {t.footer211}
          </a>
          <p className="text-base text-muted">{t.footer211b}</p>
          <p className="text-base font-semibold text-alert">{t.footerEmergency}</p>
        </section>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>{t.footerPrivacy}</p>
          <p className="flex gap-4">
            <Link href="/privacy/">{t.footerLinks.privacy}</Link>
            <Link href="/handout/">{t.footerLinks.flyer}</Link>
          </p>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-8 text-xs leading-relaxed text-muted">
          <p className="mb-1">{t.footerMade}</p>
          <p>{t.verseNotice}</p>
        </div>
      </div>
    </footer>
  );
}
