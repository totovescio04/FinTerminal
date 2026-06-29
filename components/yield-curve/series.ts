/**
 * @file series.ts
 * Pure chart-series builders over a yield curve. All values come from the
 * Yield Curve Engine (`@/lib/yield-curve`) — no math here.
 */

import { discountFactor, forwardRate, zeroRate, type YieldCurve } from "@/lib/yield-curve";

/** Tenors (years) sampled for smooth plotting. */
export const PLOT_TENORS = [0.25, 0.5, 1, 1.5, 2, 3, 4, 5, 7, 10, 15, 20, 25, 30];

export interface CurveSeriesPoint {
  tenor: number;
  spot: number;
  forward: number;
  discount: number;
}

/** Build spot / 1y-forward / discount series across the plot tenors. */
export function buildCurveSeries(curve: YieldCurve): CurveSeriesPoint[] {
  return PLOT_TENORS.map((tenor) => ({
    tenor,
    spot: zeroRate(curve, tenor) * 100,
    forward: forwardRate(curve, tenor, tenor + 1) * 100,
    discount: discountFactor(curve, tenor),
  }));
}

export interface ComparisonPoint {
  tenor: number;
  base: number;
  scenario: number;
}

/** Overlay base vs scenario spot rates (percent). */
export function buildComparisonSeries(base: YieldCurve, scenario: YieldCurve): ComparisonPoint[] {
  return PLOT_TENORS.map((tenor) => ({
    tenor,
    base: zeroRate(base, tenor) * 100,
    scenario: zeroRate(scenario, tenor) * 100,
  }));
}
