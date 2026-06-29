/**
 * @file zero.ts
 * Zero-rate conversions and par-rate (par curve) derivation.
 */

import type { YieldCurve } from "./types";
import { zeroFromDiscount } from "./utils";
import { discountFactor } from "./discount";
import { zeroRate } from "./spot";

export { discountFromZero, zeroFromDiscount } from "./utils";

/** Continuously-compounded zero rate at `t` (regardless of curve compounding). */
export function continuousZero(curve: YieldCurve, t: number): number {
  return zeroFromDiscount(discountFactor(curve, t), t, "continuous");
}

/** Zero rate at `t` (curve compounding). */
export function zero(curve: YieldCurve, t: number): number {
  return zeroRate(curve, t);
}

/**
 * Par yield at maturity `T` implied by the curve.
 * @formula c = (1 − DF(T)) / Σ (1/m)·DF(t_i), coupons at t_i = k/m up to T.
 */
export function parRate(curve: YieldCurve, T: number, frequency = 1): number {
  const m = frequency;
  const dt = 1 / m;
  let annuity = 0;
  for (let k = 1; k * dt <= T + 1e-9; k++) {
    annuity += dt * discountFactor(curve, k * dt);
  }
  const dfT = discountFactor(curve, T);
  return annuity === 0 ? 0 : (1 - dfT) / annuity;
}

/** Par curve: par yields at the given tenors. */
export function parCurve(curve: YieldCurve, tenors: number[], frequency = 1): { tenor: number; rate: number }[] {
  return tenors.map((tenor) => ({ tenor, rate: parRate(curve, tenor, frequency) }));
}
