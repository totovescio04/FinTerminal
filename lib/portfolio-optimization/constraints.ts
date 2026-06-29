/**
 * @file constraints.ts
 * Translate {@link Constraints} into solver bounds and post-process weights.
 */

import type { Constraints } from "./types";
import { sum } from "./utils";

export interface Bounds {
  l: number[];
  u: number[];
  total: number;
}

/** Build per-asset lower/upper bounds and the investable total (1 − cash). */
export function buildBounds(n: number, c: Constraints): Bounds {
  const lower = c.allowShort ? -Math.abs(c.maxWeight) : Math.max(c.minWeight, 0);
  const l = new Array<number>(n).fill(lower);
  const u = new Array<number>(n).fill(c.maxWeight);
  const total = 1 - c.cash;
  return { l, u, total };
}

/**
 * Cap the number of holdings: keep the largest `maxAssets` weights, zero the
 * rest and renormalize to `total`.
 */
export function applyMaxAssets(weights: number[], maxAssets: number, total: number): number[] {
  if (maxAssets >= weights.length) return weights;
  const idx = weights
    .map((w, i) => ({ w: Math.abs(w), i }))
    .sort((a, b) => b.w - a.w)
    .slice(0, maxAssets)
    .map((x) => x.i);
  const keep = new Set(idx);
  const trimmed = weights.map((w, i) => (keep.has(i) ? w : 0));
  const s = sum(trimmed);
  return s === 0 ? trimmed : trimmed.map((w) => (w / s) * total);
}
