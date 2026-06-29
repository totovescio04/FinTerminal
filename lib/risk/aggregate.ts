/**
 * @file aggregate.ts
 * Portfolio-level risk aggregation: market-value-weighted durations/convexity
 * and summed DV01/PVBP. Inputs are engine-derived per-position numbers.
 */

import type { RiskAggregate, RiskPosition } from "./types";

/** Aggregate risk metrics across the book. */
export function aggregateRisk(positions: RiskPosition[]): RiskAggregate {
  const mv = positions.reduce((s, p) => s + p.marketValue, 0);
  const w = (selector: (p: RiskPosition) => number) =>
    mv === 0 ? 0 : positions.reduce((s, p) => s + p.marketValue * selector(p), 0) / mv;
  const modifiedDuration = w((p) => p.modifiedDuration);
  return {
    marketValue: mv,
    modifiedDuration,
    macaulayDuration: w((p) => p.macaulayDuration),
    dollarDuration: modifiedDuration * mv,
    convexity: w((p) => p.convexity),
    dv01: positions.reduce((s, p) => s + p.dv01, 0),
    pvbp: positions.reduce((s, p) => s + p.pvbp, 0),
    averageYield: w((p) => p.yield),
    weightedCoupon: w((p) => p.couponRate),
    weightedAverageLife: w((p) => p.wal),
    numberOfPositions: positions.length,
  };
}
