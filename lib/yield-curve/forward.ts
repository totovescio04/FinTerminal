/**
 * @file forward.ts
 * Forward rate calculation between two tenors.
 */

import type { YieldCurve } from "./types";
import { discountFactor } from "./discount";

/** The forward-rate identity, for documentation/UI. */
export const FORWARD_FORMULA =
  "(1 + z₂)^t₂ = (1 + z₁)^t₁ · (1 + f)^(t₂ − t₁)  ⇒  f = (DF(t₁)/DF(t₂))^{1/(t₂ − t₁)} − 1";

/**
 * Forward rate between `t1` and `t2` (t2 > t1).
 * @formula annual: (DF(t1)/DF(t2))^{1/(t2−t1)} − 1; continuous: ln(DF(t1)/DF(t2))/(t2−t1).
 */
export function forwardRate(curve: YieldCurve, t1: number, t2: number): number {
  const dt = t2 - t1;
  if (dt <= 0) throw new Error("forwardRate: t2 must be greater than t1");
  const df1 = discountFactor(curve, t1);
  const df2 = discountFactor(curve, t2);
  if (curve.compounding === "continuous") return Math.log(df1 / df2) / dt;
  return Math.pow(df1 / df2, 1 / dt) - 1;
}

/**
 * Named forward like "1Y1Y", "2Y1Y", "5Y5Y": start × length → forward(start, start+length).
 */
export function namedForward(curve: YieldCurve, label: string): number {
  const m = /^(\d+(?:\.\d+)?)Y(\d+(?:\.\d+)?)Y$/i.exec(label.trim());
  if (!m) throw new Error(`Invalid forward label: ${label}`);
  const start = Number(m[1]);
  const length = Number(m[2]);
  return forwardRate(curve, start, start + length);
}
