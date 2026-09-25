"use client";

import { useSyncExternalStore } from "react";

// The web address printed on the Help Sheet and the flyer.
// 1. NEXT_PUBLIC_SITE_URL, if set when the site is built (see README), or the
//    production address Vercel/Netlify provide at build time (next.config.mjs).
// 2. Otherwise, the address this page was actually opened from, so the paper
//    always points to a site that really exists.
const CONFIGURED = process.env.NEXT_PUBLIC_SITE_URL || "";

export function useSiteUrl(): string {
  return useSyncExternalStore(
    () => () => {},
    () => CONFIGURED || window.location.origin,
    () => CONFIGURED,
  );
}

export function shortUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
