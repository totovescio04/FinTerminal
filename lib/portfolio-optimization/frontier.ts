/**
 * @file frontier.ts
 * Efficient frontier construction and Monte-Carlo simulation.
 */

import type { FrontierPoint, MonteCarloResult, RandomPortfolio } from "./types";
import { dot, seededRandom, sum } from "./utils";
import { portfolioVolatility, sharpeRatio } from "./statistics";
import { minVarianceWeights, projectToSimplexBox } from "./solver";
import type { Bounds } from "./constraints";

/** Maximum achievable return under the bounds (greedy allocation). */
export function maxReturnFeasible(mu: number[], bounds: Bounds): number {
  const { l, u, total } = bounds;
  const w = [...l];
  let remaining = total - sum(l);
  const order = mu.map((_, i) => i).sort((a, b) => mu[b]! - mu[a]!);
  for (const i of order) {
    const add = Math.min(u[i]! - w[i]!, remaining);
    w[i]! += add;
    remaining -= add;
    if (remaining <= 1e-12) break;
  }
  return dot(w, mu);
}

function point(weights: number[], mu: number[], Sigma: number[][], rf: number): FrontierPoint {
  const expectedReturn = dot(weights, mu);
  const volatility = portfolioVolatility(weights, Sigma);
  return { expectedReturn, volatility, sharpe: sharpeRatio(expectedReturn, volatility, rf), weights };
}

/** Build the efficient frontier as `points` minimum-variance portfolios across target returns. */
export function efficientFrontier(
  mu: number[],
  Sigma: number[][],
  bounds: Bounds,
  points = 50,
  riskFree = 0,
): FrontierPoint[] {
  const { l, u, total } = bounds;
  const minVar = minVarianceWeights(Sigma, l, u, total);
  const rMin = dot(minVar, mu);
  const rMax = maxReturnFeasible(mu, bounds);
  const out: FrontierPoint[] = [];
  for (let k = 0; k < points; k++) {
    const target = points === 1 ? rMin : rMin + ((rMax - rMin) * k) / (points - 1);
    const w = minVarianceWeights(Sigma, l, u, total, { mu, target });
    out.push(point(w, mu, Sigma, riskFree));
  }
  // Order by volatility so the frontier is a clean, monotonic envelope.
  return out.sort((a, b) => a.volatility - b.volatility);
}

/**
 * Monte-Carlo: thousands of random feasible portfolios; returns the cloud plus
 * the minimum-variance and maximum-Sharpe samples.
 */
export function monteCarlo(
  mu: number[],
  Sigma: number[][],
  bounds: Bounds,
  count = 5000,
  seed = 12345,
  riskFree = 0,
): MonteCarloResult {
  const { l, u, total } = bounds;
  const n = mu.length;
  const rng = seededRandom(seed);
  const portfolios: RandomPortfolio[] = [];
  let minVol = Infinity;
  let minVolW: number[] = new Array<number>(n).fill(total / n);
  let maxSharpe = -Infinity;
  let maxSharpeW: number[] = new Array<number>(n).fill(total / n);
  const keepEvery = Math.max(1, Math.floor(count / 3000));

  for (let i = 0; i < count; i++) {
    const raw = Array.from({ length: n }, (_, j) => l[j]! + rng() * (u[j]! - l[j]!));
    const w = projectToSimplexBox(raw, l, u, total);
    const ret = dot(w, mu);
    const vol = portfolioVolatility(w, Sigma);
    const sh = sharpeRatio(ret, vol, riskFree);
    if (vol < minVol) {
      minVol = vol;
      minVolW = w;
    }
    if (sh > maxSharpe) {
      maxSharpe = sh;
      maxSharpeW = w;
    }
    if (i % keepEvery === 0) portfolios.push({ expectedReturn: ret, volatility: vol, sharpe: sh });
  }
  return {
    portfolios,
    minVariance: point(minVolW, mu, Sigma, riskFree),
    maxSharpe: point(maxSharpeW, mu, Sigma, riskFree),
  };
}
