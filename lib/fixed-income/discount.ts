/**
 * @file discount.ts
 * Discount factors and present/future value primitives, for both single-rate
 * (yield) discounting and spot-curve discounting.
 *
 * Reference: Fabozzi, "Bond Markets, Analysis and Strategies" — time value of money.
 */

import type { CompoundingConvention, DiscountFactor, YieldCurve } from "./types";
import { compoundingPeriods, interpolateCurve } from "./utils";

/**
 * Discount factor for a single rate.
 * @param rate Annualized rate (decimal).
 * @param time Time in years.
 * @param periodsPerYear Compounding periods per year (default 1). Use
 *        {@link continuousDiscountFactor} for continuous compounding.
 * @returns (1 + rate/m)^(-time*m)
 */
export function discountFactor(rate: number, time: number, periodsPerYear = 1): number {
  const m = periodsPerYear;
  return Math.pow(1 + rate / m, -time * m);
}

/**
 * Continuously-compounded discount factor.
 * @returns e^(-rate*time)
 */
export function continuousDiscountFactor(rate: number, time: number): number {
  return Math.exp(-rate * time);
}

/**
 * Discount factor from a rate quoted under a named compounding convention.
 * @returns The discount factor at `time` years.
 */
export function discountFactorFromConvention(
  rate: number,
  time: number,
  compounding: CompoundingConvention,
): number {
  const m = compoundingPeriods(compounding);
  if (!Number.isFinite(m)) return continuousDiscountFactor(rate, time);
  return discountFactor(rate, time, m);
}

/**
 * Present value of a single amount discounted at a single rate.
 * @returns amount * discountFactor(rate, time, periodsPerYear)
 */
export function presentValue(
  amount: number,
  rate: number,
  time: number,
  periodsPerYear = 1,
): number {
  return amount * discountFactor(rate, time, periodsPerYear);
}

/**
 * Future value of a single amount compounded at a single rate.
 * @returns amount * (1 + rate/m)^(time*m)
 */
export function futureValue(
  amount: number,
  rate: number,
  time: number,
  periodsPerYear = 1,
): number {
  const m = periodsPerYear;
  return amount * Math.pow(1 + rate / m, time * m);
}

/**
 * Spot discount factor from a zero/spot curve at a given tenor.
 * The spot rate is linearly interpolated from the curve and discounted under
 * the curve's compounding convention.
 */
export function spotDiscountFactor(curve: YieldCurve, time: number): number {
  const rate = interpolateCurve(curve.points, time);
  return discountFactorFromConvention(rate, time, curve.compounding);
}

/**
 * Present value of an amount using a spot curve.
 * @returns amount * spotDiscountFactor(curve, time)
 */
export function presentValueFromCurve(amount: number, curve: YieldCurve, time: number): number {
  return amount * spotDiscountFactor(curve, time);
}

/**
 * Build an ordered set of {@link DiscountFactor} from a spot curve at the
 * provided times.
 */
export function discountFactors(curve: YieldCurve, times: number[]): DiscountFactor[] {
  return times.map((time) => ({ time, factor: spotDiscountFactor(curve, time) }));
}
