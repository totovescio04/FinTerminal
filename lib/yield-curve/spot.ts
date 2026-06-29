/**
 * @file spot.ts
 * Spot / zero rate evaluation at any tenor via the curve's interpolation method.
 */

import type { YieldCurve } from "./types";
import { discountFromZero, zeroFromDiscount } from "./utils";
import { interpolate, linearArray } from "./interpolation";

/**
 * Zero/spot rate at tenor `t` (decimal). Flat extrapolation beyond the ends.
 * - linear / cubic: interpolate the rate directly.
 * - logLinear: linear in ln(discount factor).
 * - flatForward: linear in z·t (piecewise-constant forward).
 */
export function zeroRate(curve: YieldCurve, t: number): number {
  const { points, interpolation, compounding } = curve;
  if (points.length === 0) throw new Error("zeroRate: empty curve");
  const xs = points.map((p) => p.tenor);
  const zs = points.map((p) => p.rate);
  if (t <= xs[0]!) return zs[0]!;
  if (t >= xs[xs.length - 1]!) return zs[zs.length - 1]!;

  switch (interpolation) {
    case "linear":
      return interpolate(t, xs, zs, "linear");
    case "cubic":
      return interpolate(t, xs, zs, "cubic");
    case "logLinear": {
      const lnDf = points.map((p) => Math.log(discountFromZero(p.rate, p.tenor, compounding)));
      return zeroFromDiscount(Math.exp(linearArray(t, xs, lnDf)), t, compounding);
    }
    case "flatForward": {
      const rt = points.map((p) => p.rate * p.tenor);
      return linearArray(t, xs, rt) / t;
    }
  }
}

/** Alias — spot rate is the zero rate in this representation. */
export const spotRate = zeroRate;
