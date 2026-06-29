/**
 * @file risk.ts
 * Portfolio risk decomposition.
 */

import { matVec, scaleVec } from "./utils";
import { portfolioVolatility } from "./statistics";

/** Marginal risk contribution of each asset: (Σw)/σ_p. */
export function marginalRiskContributions(w: number[], Sigma: number[][]): number[] {
  const vol = portfolioVolatility(w, Sigma);
  if (vol === 0) return w.map(() => 0);
  return scaleVec(1 / vol, matVec(Sigma, w));
}

/** Risk contribution of each asset: w_i · MRC_i (sums to σ_p). */
export function riskContributions(w: number[], Sigma: number[][]): number[] {
  const mrc = marginalRiskContributions(w, Sigma);
  return w.map((wi, i) => wi * (mrc[i] ?? 0));
}

/**
 * Diversification ratio: (Σ w_i σ_i) / σ_p. ≥ 1; higher = more diversified.
 */
export function diversificationRatio(w: number[], Sigma: number[][]): number {
  const vol = portfolioVolatility(w, Sigma);
  if (vol === 0) return 1;
  const weightedAvgVol = w.reduce((s, wi, i) => s + Math.abs(wi) * Math.sqrt(Sigma[i]![i]!), 0);
  return weightedAvgVol / vol;
}
