/**
 * @file bond-store.ts
 * A tiny framework-free store (via React's useSyncExternalStore) that holds the
 * active bond definition. The Cash Flow Viewer reads and writes it, so the bond
 * persists across navigation and is ready to be shared with other modules
 * (e.g. Scenario Analysis) without prop-drilling. No extra dependency.
 */

"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_BOND_FORM, type BondFormValues, type PriceMode } from "@/components/fixed-income";

export interface BondState {
  values: BondFormValues;
  mode: PriceMode;
}

let state: BondState = { values: DEFAULT_BOND_FORM, mode: "yield" };
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

/** Read the current bond state (also used as the SSR snapshot). */
export function getBondState(): BondState {
  return state;
}

/** Replace the bond form values. */
export function setBondValues(values: BondFormValues): void {
  state = { ...state, values };
  emit();
}

/** Set the authoritative pricing input (yield vs. clean price). */
export function setBondMode(mode: PriceMode): void {
  state = { ...state, mode };
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Subscribe a component to the bond store. */
export function useBondState(): BondState {
  return useSyncExternalStore(subscribe, getBondState, getBondState);
}
