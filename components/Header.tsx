"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, HandHeart, Languages } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { LogoMark } from "./Logo";
import { ReadAloud } from "./ReadAloud";

const pill =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition-colors md:min-h-12 md:gap-2 md:px-4 md:text-base";

export function Header() {
  const { t, lang, setLang, helper, setHelper } = useApp();
  const path = usePathname();

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/map/", label: t.nav.map },
    { href: "/id/", label: t.nav.id },
    { href: "/connected/", label: t.nav.connected },
    { href: "/more-help/", label: t.nav.more },
    { href: "/handout/", label: t.nav.handout },
  ];

  return (
    <header className="border-b border-line bg-paper print:hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:text-white"
      >
        {t.skip}
      </a>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-3 no-underline" aria-label={`${t.siteName}, ${t.nav.home}`}>
          <LogoMark className="h-12 w-12" />
          <span className="leading-tight">
            <span className="block font-serif text-2xl font-bold text-ink">{t.siteName}</span>
            <span className="block text-sm text-muted">{t.tagline}</span>
          </span>
        </Link>

        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
          <Link
            href="/bible/"
            className={`${pill} border-sun bg-dawn text-ink no-underline hover:bg-sun`}
          >
            <BookOpen className="h-5 w-5" aria-hidden="true" />
            {t.nav.bible}
          </Link>
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className={`${pill} border-primary bg-paper text-primary hover:bg-primary-soft`}
            aria-label={t.langButtonLabel}
            lang={lang === "en" ? "es" : "en"}
          >
            <Languages className="h-5 w-5" aria-hidden="true" />
            {t.langButton}
          </button>
          <ReadAloud className={`${pill} border-primary bg-paper text-primary hover:bg-primary-soft`} />
          <button
            type="button"
            role="switch"
            aria-checked={helper}
            onClick={() => setHelper(!helper)}
            title={t.helperHint}
            className={`${pill} ${
              helper ? "border-hope bg-hope text-white" : "border-line bg-paper text-muted hover:border-hope hover:text-hope"
            }`}
          >
            <HandHeart className="h-5 w-5" aria-hidden="true" />
            {helper ? t.helperOn : t.helperMode}
          </button>
        </div>
      </div>

      <nav aria-label="Main" className="border-t border-line bg-cream">
        <ul className="mx-auto flex max-w-6xl flex-wrap gap-1 px-2 py-2">
          {links.map((l) => {
            const active = l.href === "/" ? path === "/" : path?.startsWith(l.href.replace(/\/$/, ""));
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-full px-3 py-1.5 text-sm font-semibold no-underline md:px-4 md:text-base ${
                    active ? "bg-primary text-white" : "text-ink hover:bg-primary-soft"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
