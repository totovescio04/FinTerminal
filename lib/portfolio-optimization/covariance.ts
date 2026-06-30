/**
 * @file covariance.ts
 * Covariance / correlation matrices.
 */

import { mean } from "./utils";

/**
 * Sample covariance matrix from a returns matrix (rows = assets, cols = periods).
 * @returns N×N covariance (divided by T−1).
 */
export function covarianceMatrix(returns: number[][]): number[][] {
  const n = returns.length;
  if (n === 0) return [];
  const T = returns[0]!.length;
  const means = returns.map((r) => mean(r));
  const cov: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  const denom = T > 1 ? T - 1 : 1;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let s = 0;
      for (let t = 0; t < T; t++) s += (returns[i]![t]! - means[i]!) * (returns[j]![t]! - means[j]!);
      const v = s / denom;
      cov[i]![j] = v;
      cov[j]![i] = v;
    }
  }
  return cov;
}

/** Correlation matrix from a covariance matrix. */
export function correlationMatrix(cov: number[][]): number[][] {
  const sd = cov.map((row, i) => Math.sqrt(row[i]!));
  return cov.map((row, i) =>
    row.map((v, j) => {
      const d = sd[i]! * sd[j]!;
      return d === 0 ? (i === j ? 1 : 0) : v / d;
    }),
  );
}

/** Build a covariance matrix from per-asset volatilities and a correlation matrix. */
export function covFromVolCorr(vols: number[], corr: number[][]): number[][] {
  return vols.map((vi, i) => vols.map((vj, j) => vi * vj * (corr[i]![j] ?? 0)));
}
