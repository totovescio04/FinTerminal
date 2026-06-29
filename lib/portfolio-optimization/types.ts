/**
 * @file types.ts
 * Asset-class-agnostic optimization types. The engine works on an expected-
 * returns vector + covariance matrix + constraints — nothing fixed-income
 * specific lives here, so it can be reused for equities.
 */

/** Optimization objective. */
export type Objective =
  | "minVariance"
  | "maxSharpe"
  | "targetReturn"
  | "targetRisk"
  | "maxDiversification"
  | "riskParity";

/** Portfolio constraints. */
export interface Constraints {
  /** Minimum weight per asset. */
  minWeight: number;
  /** Maximum weight per asset. */
  maxWeight: number;
  /** Allow negative weights (short selling). */
  allowShort: boolean;
  /** Cash held aside (0–1); risky weights sum to 1 − cash. */
  cash: number;
  /** Cap the number of non-zero holdings (optional). */
  maxAssets?: number;
}

/** Default long-only, fully-invested constraints. */
export const DEFAULT_CONSTRAINTS: Constraints = {
  minWeight: 0,
  maxWeight: 1,
  allowShort: false,
  cash: 0,
};

/** Optimization request. */
export interface OptimizationInput {
  expectedReturns: number[];
  covariance: number[][];
  objective: Objective;
  constraints: Constraints;
  riskFreeRate?: number;
  /** Target return (for "targetReturn"). */
  targetReturn?: number;
  /** Target volatility (for "targetRisk"). */
  targetRisk?: number;
}

/** Optimization result. */
export interface OptimizationResult {
  weights: number[];
  expectedReturn: number;
  variance: number;
  volatility: number;
  sharpe: number;
  diversificationRatio: number;
  cash: number;
}

/** Portfolio statistics bundle. */
export interface PortfolioStats {
  expectedReturn: number;
  variance: number;
  volatility: number;
  sharpe: number;
}

/** A point on the efficient frontier. */
export interface FrontierPoint {
  expectedReturn: number;
  volatility: number;
  sharpe: number;
  weights: number[];
}

/** A Monte-Carlo sampled portfolio. */
export interface RandomPortfolio {
  expectedReturn: number;
  volatility: number;
  sharpe: number;
}

/** Monte-Carlo simulation result. */
export interface MonteCarloResult {
  portfolios: RandomPortfolio[];
  minVariance: FrontierPoint;
  maxSharpe: FrontierPoint;
}
