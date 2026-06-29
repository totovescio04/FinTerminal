/**
 * @file risk.ts
 * Interest-rate risk measures: DV01, PVBP, convexity and scenario price changes.
 *
 * Reference: Fabozzi — DV01 / PVBP and the duration-convexity price approximation.
 */

import type { Bond, RiskMetrics } from "./types";
import { BASIS_POINT } from "./constants";
import { dirtyPrice } from "./pricing";
import { macaulayDuration, modifiedDuration } from "./duration";
import { convexity } from "./convexity";

/**
 * DV01 — the dollar value of one basis point, per 100 of face value.
 * @param bond Normalized bond.
 * @param yld Yield (decimal).
 * @returns Approximate price change (currency, per 100 face) for a 1bp move.
 * @formula DV01 = D_mod * dirtyPrice * 0.0001.
 */
export function dv01(bond: Bond, yld: number): number {
  return modifiedDuration(bond, yld) * dirtyPrice(bond, yld) * BASIS_POINT;
}

/**
 * PVBP — the price value of a basis point, per 100 of face value, computed by a
 * full repricing for a 1bp decrease in yield.
 * @returns The (positive) price change for a 1bp move.
 * @formula PVBP = P(y - 1bp) - P(y).
 */
export function pvbp(bond: Bond, yld: number): number {
  return dirtyPrice(bond, yld - BASIS_POINT) - dirtyPrice(bond, yld);
}

/** Result of a parallel yield shift scenario. */
export interface ParallelShiftResult {
  /** Shift applied, in basis points. */
  shiftBps: number;
  /** Yield after the shift (decimal). */
  shiftedYield: number;
  /** Dirty price before the shift (per 100 face). */
  priceBefore: number;
  /** Dirty price after the shift (per 100 face). */
  priceAfter: number;
  /** Exact price change (per 100 face). */
  priceChange: number;
}

/**
 * Apply a parallel shift (in basis points) to the yield and reprice exactly.
 * @returns A {@link ParallelShiftResult}.
 */
export function parallelShift(bond: Bond, yld: number, shiftBps: number): ParallelShiftResult {
  const shiftedYield = yld + shiftBps * BASIS_POINT;
  const priceBefore = dirtyPrice(bond, yld);
  const priceAfter = dirtyPrice(bond, shiftedYield);
  return {
    shiftBps,
    shiftedYield,
    priceBefore,
    priceAfter,
    priceChange: priceAfter - priceBefore,
  };
}

/** Exact vs. duration-convexity-approximated price change. */
export interface PriceChangeResult {
  /** Exact price change from repricing (per 100 face). */
  exact: number;
  /** Second-order (duration + convexity) approximation (per 100 face). */
  approximate: number;
}

/**
 * Price change for a yield move, both exact and via the duration-convexity
 * approximation.
 * @param bond Normalized bond.
 * @param yld Starting yield (decimal).
 * @param deltaYield Yield change (decimal, e.g. 0.005 for +50bp).
 * @returns A {@link PriceChangeResult}.
 * @formula ΔP ≈ -D_mod * P * Δy + 0.5 * C * P * Δy^2.
 */
export function priceChange(bond: Bond, yld: number, deltaYield: number): PriceChangeResult {
  const p0 = dirtyPrice(bond, yld);
  const exact = dirtyPrice(bond, yld + deltaYield) - p0;
  const dMod = modifiedDuration(bond, yld);
  const conv = convexity(bond, yld);
  const approximate = -dMod * p0 * deltaYield + 0.5 * conv * p0 * deltaYield * deltaYield;
  return { exact, approximate };
}

/**
 * Compute a bundle of risk measures at once.
 * @returns A {@link RiskMetrics} bundle.
 */
export function riskMetrics(bond: Bond, yld: number): RiskMetrics {
  return {
    macaulayDuration: macaulayDuration(bond, yld),
    modifiedDuration: modifiedDuration(bond, yld),
    dv01: dv01(bond, yld),
    pvbp: pvbp(bond, yld),
    convexity: convexity(bond, yld),
  };
}
