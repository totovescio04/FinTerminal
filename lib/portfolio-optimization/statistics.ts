/**
 * @file statistics.ts
 * Portfolio statistics and performance ratios.
 */

import type { PortfolioStats } from "./types";
import { dot, quadForm } from "./utils";

/** Expected return wᵀμ. */
export const portfolioReturn = (w: number[], mu: number[]): number => dot(w, mu);

/** Variance wᵀΣw. */
export const portfolioVariance = (w: number[], Sigma: number[][]): number => quadForm(w, Sigma);

/** Volatility √(wᵀΣw). */
export const portfolioVolatility = (w: number[], Sigma: number[][]): number =>
  Math.sqrt(Math.max(portfolioVariance(w, Sigma), 0));

/** Sharpe ratio (excess return / volatility). */
export function sharpeRatio(expectedReturn: number, volatility: number, riskFree = 0): number {
  return volatility === 0 ? 0 : (expectedReturn - riskFree) / volatility;
}

/** Sortino ratio from a return series (excess return / downside deviation). */
export function sortinoRatio(returns: number[], riskFree = 0): number {
  if (returns.length === 0) return 0;
  const mean = returns.reduce((s, r) => s + r, 0) / returns.length;
  const downside = returns.filter((r) => r < riskFree);
  const dd = Math.sqrt(downside.reduce((s, r) => s + (r - riskFree) ** 2, 0) / returns.length);
  return dd === 0 ? 0 : (mean - riskFree) / dd;
}

/** Treynor ratio (excess return / beta). */
export function treynorRatio(expectedReturn: number, beta: number, riskFree = 0): number {
  return beta === 0 ? 0 : (expectedReturn - riskFree) / beta;
}

/** Information ratio (mean active return / tracking error). */
export function informationRatio(activeReturns: number[]): number {
  if (activeReturns.length === 0) return 0;
  const mean = activeReturns.reduce((s, r) => s + r, 0) / activeReturns.length;
  const te = Math.sqrt(activeReturns.reduce((s, r) => s + (r - mean) ** 2, 0) / activeReturns.length);
  return te === 0 ? 0 : mean / te;
}

/** Calmar ratio (return / max drawdown). Structure prepared. */
export function calmarRatio(annualReturn: number, maxDrawdown: number): number {
  return maxDrawdown === 0 ? 0 : annualReturn / Math.abs(maxDrawdown);
}

/** Bundle of portfolio statistics. */
export function portfolioStats(w: number[], mu: number[], Sigma: number[][], riskFree = 0): PortfolioStats {
  const expectedReturn = portfolioReturn(w, mu);
  const variance = portfolioVariance(w, Sigma);
  const volatility = Math.sqrt(Math.max(variance, 0));
  return { expectedReturn, variance, volatility, sharpe: sharpeRatio(expectedReturn, volatility, riskFree) };
}
