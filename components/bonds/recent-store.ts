"use client";

import { useSyncExternalStore } from "react";

const KEY = "finterminal-recent";
const MAX = 10;
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

/** Hydrate recently-viewed ids from localStorage once on the client. */
export function hydrateRecent(): void {
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

/** Record a viewed bond (most recent first, de-duplicated, capped). */
export function pushRecent(id: string): void {
  ids = [id, ...ids.filter((x) => x !== id)].slice(0, MAX);
  persist();
  emit();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => ids;

/** Subscribe to recently-viewed ids. */
export function useRecent(): string[] {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}
