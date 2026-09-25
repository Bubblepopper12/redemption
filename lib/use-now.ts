"use client";

import { useSyncExternalStore } from "react";

// One shared clock for the whole page (instead of one timer per card).
let current: Date | null = null;
const listeners = new Set<() => void>();
let timer: number | undefined;

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!timer) {
    current = new Date();
    timer = window.setInterval(() => {
      current = new Date();
      listeners.forEach((l) => l());
    }, 60000);
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

/**
 * The current time, updated every minute. It is null while the page is being
 * built, so "Open now" never shows a stale time from when the site was built.
 */
export function useNow(): Date | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}
