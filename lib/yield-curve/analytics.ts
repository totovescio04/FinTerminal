/**
 * @file analytics.ts
 * Curve-shape analytics derived from zero rates.
 */

import type { CurveAnalytics, YieldCurve } from "./types";
import { zeroRate } from "./spot";

/**
 * Compute slope, steepness, curvature, spreads and yield stats.
 * @formula
 *  - slope 2s10s   = z(10) − z(2)
 *  - steepness 2s30s = z(30) − z(2)
 *  - curvature     = 2·z(5) − z(2) − z(10)   (butterfly)
 *  - spread 5s30s  = z(30) − z(5)
 */
export function computeAnalytics(curve: YieldCurve): CurveAnalytics {
  const z = (t: number) => zeroRate(curve, t);
  const rates = curve.points.map((p) => p.rate);
  const z2 = z(2);
  const z5 = z(5);
  const z10 = z(10);
  const z30 = z(30);
  return {
    slope2s10s: z10 - z2,
    steepness2s30s: z30 - z2,
    curvature: 2 * z5 - z2 - z10,
    averageYield: rates.reduce((s, r) => s + r, 0) / rates.length,
    maxYield: Math.max(...rates),
    minYield: Math.min(...rates),
    spread2s10s: z10 - z2,
    spread5s30s: z30 - z5,
  };
}
