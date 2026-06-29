/**
 * @file optimizer.ts
 * The optimizer facade: dispatches to the right algorithm for each objective.
 */

import type { OptimizationInput, OptimizationResult } from "./types";
import { dot, inverse, matVec, scaleVec, sum } from "./utils";
import { portfolioStats } from "./statistics";
import { diversificationRatio } from "./risk";
import { minVarianceWeights, projectToSimplexBox } from "./solver";
import { applyMaxAssets, buildBounds, type Bounds } from "./constraints";
import { efficientFrontier } from "./frontier";
import { validateInput } from "./validation";

/** Maximum-diversification weights: w ∝ Σ⁻¹σ, projected onto the constraints. */
export function maxDiversificationWeights(Sigma: number[][], bounds: Bounds): number[] {
  const { l, u, total } = bounds;
  const sd = Sigma.map((row, i) => Math.sqrt(Math.max(row[i]!, 0)));
  let raw: number[];
  try {
    raw = matVec(inverse(Sigma), sd);
  } catch {
    raw = sd;
  }
  const s = sum(raw);
  if (s !== 0) raw = scaleVec(total / s, raw);
  return projectToSimplexBox(raw, l, u, total);
}

/** Risk-parity (equal risk contribution) weights via fixed-point iteration. */
export function riskParityWeights(Sigma: number[][], bounds: Bounds, iters = 1000): number[] {
  const { l, u, total } = bounds;
  const n = Sigma.length;
  let w = new Array<number>(n).fill(total / n);
  for (let k = 0; k < iters; k++) {
    const Sw = matVec(Sigma, w);
    const rc = w.map((wi, i) => Math.max(wi * Sw[i]!, 1e-15));
    const target = rc.reduce((a, b) => a + b, 0) / n;
    // Convergent multiplicative ERC update: wᵢ ← wᵢ·√(target / rcᵢ).
    const next = w.map((wi, i) => wi * Math.sqrt(target / rc[i]!));
    const s = sum(next);
    w = next.map((x) => (x / s) * total);
  }
  return projectToSimplexBox(w, l, u, total);
}

/** Optimize a portfolio for the requested objective. */
export function optimize(input: OptimizationInput): OptimizationResult {
  validateInput(input);
  const { expectedReturns: mu, covariance: Sigma, objective, constraints, riskFreeRate = 0 } = input;
  const bounds = buildBounds(mu.length, constraints);
  const { l, u, total } = bounds;

  let weights: number[];
  switch (objective) {
    case "minVariance":
      weights = minVarianceWeights(Sigma, l, u, total);
      break;
    case "targetReturn":
      weights = minVarianceWeights(Sigma, l, u, total, { mu, target: input.targetReturn ?? dot(mu, mu.map(() => 1 / mu.length)) });
      break;
    case "maxSharpe": {
      const frontier = efficientFrontier(mu, Sigma, bounds, 60, riskFreeRate);
      weights = frontier.reduce((best, p) => (p.sharpe > best.sharpe ? p : best), frontier[0]!).weights;
      break;
    }
    case "targetRisk": {
      const frontier = efficientFrontier(mu, Sigma, bounds, 60, riskFreeRate);
      const target = input.targetRisk ?? frontier[0]!.volatility;
      const feasible = frontier.filter((p) => p.volatility <= target + 1e-9);
      weights = (feasible.length > 0
        ? feasible.reduce((best, p) => (p.expectedReturn > best.expectedReturn ? p : best), feasible[0]!)
        : frontier.reduce((best, p) => (Math.abs(p.volatility - target) < Math.abs(best.volatility - target) ? p : best), frontier[0]!)
      ).weights;
      break;
    }
    case "maxDiversification":
      weights = maxDiversificationWeights(Sigma, bounds);
      break;
    case "riskParity":
      weights = riskParityWeights(Sigma, bounds);
      break;
  }

  if (constraints.maxAssets && constraints.maxAssets < mu.length) {
    weights = applyMaxAssets(weights, constraints.maxAssets, total);
  }

  const stats = portfolioStats(weights, mu, Sigma, riskFreeRate);
  return {
    weights,
    expectedReturn: stats.expectedReturn,
    variance: stats.variance,
    volatility: stats.volatility,
    sharpe: stats.sharpe,
    diversificationRatio: diversificationRatio(weights, Sigma),
    cash: constraints.cash,
  };
}
