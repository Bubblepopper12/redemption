"use client";

import { Heart, Phone } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { FEATURED_VERSE } from "@/lib/verses";

export function Hero() {
  const { t, lang, helper } = useApp();
  if (helper) return null;
  return (
    <section className="dawn-glow print:hidden">
      <div className="mx-auto max-w-4xl px-4 pb-4 pt-10 text-center md:pt-16">
        <h1 className="font-serif text-4xl font-bold leading-tight text-ink md:text-6xl">
          {t.heroTitle}
          <span className="block text-primary">{t.heroTitle2}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-xl text-ink md:text-2xl">{t.heroText}</p>
        <p className="mx-auto mt-2 max-w-2xl text-lg font-semibold text-primary">{t.heroCities}</p>

        <figure className="mx-auto mt-8 max-w-2xl rounded-3xl bg-paper/80 px-6 py-5 shadow-sm ring-1 ring-line">
          <blockquote>
            <p className="font-serif text-xl italic leading-relaxed text-ink md:text-2xl">“{FEATURED_VERSE[lang]}”</p>
          </blockquote>
          <figcaption className="mt-2 font-semibold text-primary">— {FEATURED_VERSE.ref[lang]}</figcaption>
        </figure>

        <a
          href="tel:211"
          className="mx-auto mt-6 inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-primary bg-paper px-5 text-lg font-bold text-primary no-underline hover:bg-primary-soft"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          {t.heroNow}
        </a>

        <p className="mx-auto mt-4 flex max-w-2xl items-start justify-center gap-2 text-base text-muted">
          <Heart className="mt-1 h-5 w-5 shrink-0 text-sun" aria-hidden="true" />
          {t.freeForAll}
        </p>
      </div>
    </section>
  );
}
