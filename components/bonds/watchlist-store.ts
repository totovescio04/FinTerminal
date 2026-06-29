"use client";

import { useSyncExternalStore } from "react";

const KEY = "finterminal-watchlist";
let ids: string[] = [];
let hydrated = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function persist(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

/** Hydrate the watchlist from localStorage once on the client. */
export function hydrateWatchlist(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) {
        ids = parsed;
        emit();
      }
    }
  } catch {
    /* ignore */
  }
}

/** Toggle a bond id in the watchlist. */
export function toggleWatch(id: string): void {
  ids = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  persist();
  emit();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => ids;

/** Subscribe to the watchlist ids. */
export function useWatchlist(): string[] {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}
