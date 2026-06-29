/**
 * @file discount.ts
 * Discount factors and present-value from a curve.
 */

import type { DiscountFactorRow, YieldCurve } from "./types";
import { discountFromZero } from "./utils";
import { zeroRate } from "./spot";

/** Discount factor at tenor `t`. */
export function discountFactor(curve: YieldCurve, t: number): number {
  if (t <= 0) return 1;
  return discountFromZero(zeroRate(curve, t), t, curve.compounding);
}

/** Discount factors for a list of tenors (exportable). */
export function discountFactors(curve: YieldCurve, tenors: number[]): DiscountFactorRow[] {
  return tenors.map((tenor) => ({ tenor, discountFactor: discountFactor(curve, tenor) }));
}

/**
 * Present value of dated cash flows using the curve.
 * @param times Times to each cash flow (years).
 * @param amounts Cash-flow amounts (same length as `times`).
 * @returns Σ amount_i · DF(time_i).
 */
export function presentValue(times: number[], amounts: number[], curve: YieldCurve): number {
  return times.reduce((sum, t, i) => sum + (amounts[i] ?? 0) * discountFactor(curve, t), 0);
}
