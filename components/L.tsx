"use client";

import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { useApp } from "@/lib/app-context";

/** Shows the English or Spanish version, based on the language button. */
export function L({ en, es }: { en: ReactNode; es: ReactNode }) {
  const { lang } = useApp();
  return <>{lang === "es" ? es : en}</>;
}

export function PageTitle({ en, es, introEn, introEs }: { en: string; es: string; introEn?: ReactNode; introEs?: ReactNode }) {
  return (
    <div className="dawn-glow">
      <div className="mx-auto max-w-4xl px-4 pb-6 pt-10 md:pt-14">
        <h1 className="font-serif text-4xl font-bold leading-tight text-ink md:text-5xl">
          <L en={en} es={es} />
        </h1>
        {introEn && (
          <p className="mt-4 text-xl text-ink md:text-2xl">
            <L en={introEn} es={introEs} />
          </p>
        )}
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[2rem] border-2 border-line bg-paper p-5 md:p-8 print:rounded-none print:border print:p-3 ${className}`}>{children}</section>;
}

export function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 font-semibold">
      {children}
      <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
    </a>
  );
}

export function CallButton({ number, label }: { number: string; label: ReactNode }) {
  const digits = number.replace(/\D/g, "");
  const href = digits.length <= 4 ? `tel:${digits}` : `tel:+1${digits.slice(-10)}`;
  return (
    <a
      href={href}
      className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-primary px-5 text-lg font-bold text-white no-underline hover:bg-primary-dark"
    >
      {label}
    </a>
  );
}
