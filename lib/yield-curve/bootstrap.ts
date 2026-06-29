/**
 * @file bootstrap.ts
 * Par-yield bootstrap (no external libraries). Builds the zero curve from par
 * rates, deriving discount factors and zero rates one tenor at a time.
 *
 * Algorithm (annual coupons, frequency 1):
 *  - Money-market points (T ≤ 1): single payment, DF(T) = 1 / (1 + c·T).
 *  - Coupon points (T > 1): the par bond prices to 1, so
 *        1 = c · Σ_{i=1}^{T-1} DF(i) + (1 + c) · DF(T)
 *    ⇒ DF(T) = (1 − c · Σ_{i=1}^{T-1} DF(i)) / (1 + c).
 *  Intermediate-year DFs use already-bootstrapped nodes (or interpolation when a
 *  coupon year falls between nodes).
 *  Zero rate: z(T) = DF(T)^(-1/T) − 1 (annual) or −ln DF(T)/T (continuous).
 */

import type { BootstrapInput, CurveOptions, CurvePoint, YieldCurve } from "./types";
import { discountFromZero, tenorToYears, zeroFromDiscount } from "./utils";
import { discountFactor } from "./discount";

export function bootstrap(inputs: BootstrapInput[], options: CurveOptions = {}): YieldCurve {
  const compounding = options.compounding ?? "annual";
  const interpolation = options.interpolation ?? "linear";
  const sorted = [...inputs].sort((a, b) => a.tenor - b.tenor);
  const points: CurvePoint[] = [];
  const partial = (): YieldCurve => ({ compounding, interpolation, points });

  const dfAtYear = (year: number): number => {
    const node = points.find((p) => Math.abs(p.tenor - year) < 1e-9);
    if (node) return discountFromZero(node.rate, year, compounding);
    if (points.length === 0) return 1;
    return discountFactor(partial(), year);
  };

  for (const input of sorted) {
    const T = input.tenor;
    const c = input.parRate;
    let dfT: number;
    if (T <= 1 + 1e-9) {
      dfT = 1 / (1 + c * T);
    } else {
      let couponPv = 0;
      for (let i = 1; i <= Math.round(T) - 1; i++) {
        couponPv += c * dfAtYear(i);
      }
      dfT = (1 - couponPv) / (1 + c);
    }
    points.push({ tenor: T, rate: zeroFromDiscount(dfT, T, compounding) });
  }

  return { compounding, interpolation, points };
}

/** Bootstrap from labelled tenors ("1M", "2Y", …). */
export function bootstrapFromLabels(
  inputs: { tenor: string; parRate: number }[],
  options: CurveOptions = {},
): YieldCurve {
  return bootstrap(
    inputs.map((i) => ({ tenor: tenorToYears(i.tenor), parRate: i.parRate })),
    options,
  );
}
