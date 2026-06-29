/**
 * @file portfolio-store.ts
 * Framework-free portfolio store (useSyncExternalStore) with automatic
 * localStorage persistence. Only raw {@link Position} inputs are stored; all
 * analytics are recomputed from the engine on every render.
 */

"use client";

import { useSyncExternalStore } from "react";
import { PORTFOLIO_STORAGE_KEY, SAMPLE_POSITIONS } from "./constants";
import type { Position } from "./types";

let state: Position[] = SAMPLE_POSITIONS;
let hydrated = false;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function persist(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / serialization errors */
  }
}

/** Hydrate from localStorage once on the client (call from a mount effect). */
export function hydratePortfolio(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Position[];
      if (Array.isArray(parsed)) {
        state = parsed;
        emit();
      }
    }
  } catch {
    /* ignore malformed storage */
  }
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `pos-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Add a position (id is generated). */
export function addPosition(position: Omit<Position, "id">): void {
  state = [...state, { ...position, id: newId() }];
  persist();
  emit();
}

/** Update an existing position by id. */
export function updatePosition(id: string, patch: Omit<Position, "id">): void {
  state = state.map((p) => (p.id === id ? { ...patch, id } : p));
  persist();
  emit();
}

/** Remove a position by id. */
export function removePosition(id: string): void {
  state = state.filter((p) => p.id !== id);
  persist();
  emit();
}

/** Replace all positions (e.g. future CSV/Excel/API import). */
export function setPositions(positions: Position[]): void {
  state = positions;
  persist();
  emit();
}

/** Clear the portfolio. */
export function clearPortfolio(): void {
  state = [];
  persist();
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Position[] {
  return state;
}

/** Subscribe a component to the portfolio positions. */
export function usePortfolio(): Position[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
