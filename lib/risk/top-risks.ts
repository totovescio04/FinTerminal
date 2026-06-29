/**
 * @file top-risks.ts
 * Automatic "top risks" highlights across the book.
 */

import { exposureByIssuer } from "./exposure";
import type { RiskPosition } from "./types";

export interface TopRiskItem {
  id: string;
  label: string;
  value: number;
}

export interface TopRisks {
  highestDuration: TopRiskItem | null;
  highestDv01: TopRiskItem | null;
  highestConvexity: TopRiskItem | null;
  largestExposure: TopRiskItem | null;
  topConcentration: TopRiskItem | null;
}

function maxBy(positions: RiskPosition[], selector: (p: RiskPosition) => number): TopRiskItem | null {
  if (positions.length === 0) return null;
  const best = positions.reduce((b, p) => (selector(p) > selector(b) ? p : b), positions[0]!);
  return { id: best.id, label: best.label, value: selector(best) };
}

/** Compute the top-risk highlights. */
export function topRisks(positions: RiskPosition[]): TopRisks {
  const issuers = exposureByIssuer(positions);
  const top = issuers[0];
  return {
    highestDuration: maxBy(positions, (p) => p.modifiedDuration),
    highestDv01: maxBy(positions, (p) => p.dv01),
    highestConvexity: maxBy(positions, (p) => p.convexity),
    largestExposure: maxBy(positions, (p) => p.marketValue),
    topConcentration: top ? { id: top.key, label: top.key, value: top.weight } : null,
  };
}
