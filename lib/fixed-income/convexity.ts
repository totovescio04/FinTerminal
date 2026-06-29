/**
 * @file convexity.ts
 * Convexity — the second-order sensitivity of price to yield. Computed from the
 * exact analytic definition (no simplified approximation).
 *
 * Reference: Fabozzi — convexity as (1/P) d2P/dy2.
 */

import type { Bond } from "./types";
import { BASIS_POINT } from "./constants";
import { computePriceComponents, dirtyPrice } from "./pricing";

/**
 * Analytic convexity of a bond.
 * @param bond Normalized bond.
 * @param yld Yield (decimal).
 * @returns Convexity in years^2.
 * @formula C = (1/P) * Σ CF_k * n_k(n_k+1)/m^2 * (1 + y/m)^(-(n_k+2)),
 *          where n_k is the time to cash flow k expressed in coupon periods and
 *          m is the number of periods per year. This is the exact second
 *          derivative of price with respect to yield, normalized by price.
 */
export function convexity(bond: Bond, yld: number): number {
  const pc = computePriceComponents(bond, yld);
  const m = pc.periodsPerYear;
  const v2 = 1 / Math.pow(1 + yld / m, 2);
  const sum = pc.cashFlows.reduce((acc, cf) => {
    const n = cf.yearFraction * m; // time in coupon periods
    return acc + (cf.presentValue * (n * (n + 1))) / (m * m) * v2;
  }, 0);
  return sum / pc.dirtyCurrency;
}

/**
 * Effective convexity computed by repricing for symmetric yield bumps.
 * @param bond Normalized bond.
 * @param yld Yield (decimal).
 * @param bumpBps Symmetric bump in basis points (default 1).
 * @returns Effective convexity in years^2.
 * @formula C_eff = (P(+Δy) + P(-Δy) - 2*P0) / (P0 * Δy^2).
 */
export function effectiveConvexity(bond: Bond, yld: number, bumpBps = 1): number {
  const dy = bumpBps * BASIS_POINT;
  const p0 = dirtyPrice(bond, yld);
  const pUp = dirtyPrice(bond, yld + dy);
  const pDn = dirtyPrice(bond, yld - dy);
  return (pUp + pDn - 2 * p0) / (p0 * dy * dy);
}
