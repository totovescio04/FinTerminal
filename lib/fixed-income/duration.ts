/**
 * @file duration.ts
 * Duration measures: Macaulay, modified, dollar (money) and effective duration.
 *
 * Reference: Fabozzi — duration as the price sensitivity to yield.
 */

import type { Bond, DurationResult } from "./types";
import { BASIS_POINT } from "./constants";
import { periodsPerYear } from "./utils";
import { computePriceComponents, dirtyPrice } from "./pricing";

/**
 * Macaulay duration: the present-value-weighted average time to receipt of the
 * bond's cash flows.
 * @param bond Normalized bond.
 * @param yld Yield (decimal).
 * @returns Macaulay duration in years.
 * @formula D_mac = (Σ t_k * PV_k) / (Σ PV_k), t_k in years.
 */
export function macaulayDuration(bond: Bond, yld: number): number {
  const pc = computePriceComponents(bond, yld);
  const weighted = pc.cashFlows.reduce((sum, cf) => sum + cf.yearFraction * cf.presentValue, 0);
  return weighted / pc.dirtyCurrency;
}

/**
 * Modified duration: the percentage price change for a unit change in yield.
 * @param bond Normalized bond.
 * @param yld Yield (decimal).
 * @returns Modified duration in years.
 * @formula D_mod = D_mac / (1 + y/m).
 */
export function modifiedDuration(bond: Bond, yld: number): number {
  const m = periodsPerYear(bond.frequency);
  return macaulayDuration(bond, yld) / (1 + yld / m);
}

/**
 * Dollar (money) duration: the money price change for a unit change in yield,
 * per 100 of face value.
 * @returns Dollar duration per 100 face.
 * @formula D$ = D_mod * dirtyPrice.
 */
export function dollarDuration(bond: Bond, yld: number): number {
  return modifiedDuration(bond, yld) * dirtyPrice(bond, yld);
}

/**
 * Effective duration computed by repricing for symmetric yield bumps.
 * @param bond Normalized bond.
 * @param yld Yield (decimal).
 * @param bumpBps Symmetric bump in basis points (default 1).
 * @returns Effective duration in years.
 * @formula D_eff = (P(-Δy) - P(+Δy)) / (2 * P0 * Δy).
 */
export function effectiveDuration(bond: Bond, yld: number, bumpBps = 1): number {
  const dy = bumpBps * BASIS_POINT;
  const p0 = dirtyPrice(bond, yld);
  const pUp = dirtyPrice(bond, yld + dy);
  const pDn = dirtyPrice(bond, yld - dy);
  return (pDn - pUp) / (2 * p0 * dy);
}

/**
 * Compute all duration measures at once.
 * @returns A {@link DurationResult}.
 */
export function durationMetrics(bond: Bond, yld: number): DurationResult {
  return {
    macaulay: macaulayDuration(bond, yld),
    modified: modifiedDuration(bond, yld),
    dollar: dollarDuration(bond, yld),
    effective: effectiveDuration(bond, yld),
  };
}
