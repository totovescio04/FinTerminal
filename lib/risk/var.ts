/**
 * @file var.ts
 * Value-at-Risk models. Parametric (delta-normal) is implemented; historical and
 * Monte-Carlo have working structures ready for richer data.
 *
 * Parametric (fixed income, delta-normal):
 *   VaR = z(α) · σ_yield(bp) · |DV01(currency)| · √horizonDays
 * using the engine's aggregate DV01 (currency change per 1bp).
 */

import type { VaRResult } from "./types";
import { seededNormal } from "./utils";

/** Standard-normal quantiles by confidence level. */
export const VAR_Z: Record<number, number> = { 90: 1.2816, 95: 1.6449, 99: 2.3263 };

export interface ParametricVaRParams {
  /** Portfolio DV01 in currency (value change per 1bp) — from the engine. */
  dv01Currency: number;
  /** Assumed daily yield volatility in basis points. */
  dailyYieldVolBp: number;
  confidence: number;
  horizonDays: number;
}

/** Parametric (delta-normal) VaR. */
export function parametricVaR(params: ParametricVaRParams): VaRResult {
  const z = VAR_Z[params.confidence] ?? 1.6449;
  const value = z * params.dailyYieldVolBp * Math.abs(params.dv01Currency) * Math.sqrt(params.horizonDays);
  return { method: "parametric", confidence: params.confidence, horizonDays: params.horizonDays, value };
}

/**
 * Historical VaR from a series of historical P&L (or value-change) observations.
 * Empirical quantile, scaled by √horizon. Returns 0 if no data is supplied.
 */
export function historicalVaR(pnl: number[], confidence: number, horizonDays: number): VaRResult {
  if (pnl.length === 0) return { method: "historical", confidence, horizonDays, value: 0 };
  const sorted = [...pnl].sort((a, b) => a - b);
  const idx = Math.max(0, Math.floor((1 - confidence / 100) * sorted.length));
  const quantile = Math.abs(sorted[idx] ?? 0);
  return { method: "historical", confidence, horizonDays, value: quantile * Math.sqrt(horizonDays) };
}

/**
 * Monte-Carlo VaR: simulate normal daily yield moves and apply DV01.
 * Deterministic (seeded) so it is reproducible/testable.
 */
export function monteCarloVaR(
  dv01Currency: number,
  dailyYieldVolBp: number,
  confidence: number,
  horizonDays: number,
  draws = 10_000,
  seed = 12345,
): VaRResult {
  const rnd = seededNormal(seed);
  const pnls: number[] = [];
  for (let i = 0; i < draws; i++) {
    const move = rnd() * dailyYieldVolBp * Math.sqrt(horizonDays); // bp move over horizon
    pnls.push(-dv01Currency * move);
  }
  pnls.sort((a, b) => a - b);
  const idx = Math.max(0, Math.floor((1 - confidence / 100) * pnls.length));
  return { method: "montecarlo", confidence, horizonDays, value: Math.abs(pnls[idx] ?? 0) };
}
