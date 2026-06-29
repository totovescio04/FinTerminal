/**
 * @file returns.ts
 * Expected-returns helpers.
 */

import { mean } from "./utils";

/** Mean return per asset from a returns matrix (rows = assets). */
export function expectedReturnsFromSeries(returns: number[][]): number[] {
  return returns.map((r) => mean(r));
}

/** Annualize a per-period return given periods per year. */
export function annualizeReturn(perPeriod: number, periodsPerYear = 252): number {
  return Math.pow(1 + perPeriod, periodsPerYear) - 1;
}

/** Annualize a per-period volatility. */
export function annualizeVol(perPeriodVol: number, periodsPerYear = 252): number {
  return perPeriodVol * Math.sqrt(periodsPerYear);
}
