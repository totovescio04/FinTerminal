/**
 * @file contribution.ts
 * Per-position risk contributions (duration, convexity, DV01, market value).
 */

import type { RiskContribution, RiskPosition } from "./types";

/** Compute each position's contribution to portfolio risk. */
export function riskContributions(positions: RiskPosition[]): RiskContribution[] {
  const mv = positions.reduce((s, p) => s + p.marketValue, 0);
  const totalDv01 = positions.reduce((s, p) => s + p.dv01, 0);
  return positions
    .map((p) => {
      const weight = mv === 0 ? 0 : p.marketValue / mv;
      return {
        id: p.id,
        label: p.label,
        marketValueWeight: weight,
        durationContribution: weight * p.modifiedDuration,
        convexityContribution: weight * p.convexity,
        dv01: p.dv01,
        dv01Weight: totalDv01 === 0 ? 0 : p.dv01 / totalDv01,
      };
    })
    .sort((a, b) => b.dv01 - a.dv01);
}
