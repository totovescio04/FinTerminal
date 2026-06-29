/**
 * @file index.ts
 * Public entry point of the FinTerminal fixed-income engine.
 *
 * The entire library is pure TypeScript with no React or I/O dependencies, so
 * it can be consumed from any layer of the application:
 *
 * @example
 * import {
 *   createBond,
 *   priceFromYield,
 *   yieldFromPrice,
 *   macaulayDuration,
 *   modifiedDuration,
 *   convexity,
 *   dv01,
 *   generateCashFlows,
 *   generateSchedule,
 * } from "@/lib/fixed-income";
 */

// Domain types
export type {
  DayCountConvention,
  Frequency,
  CompoundingConvention,
  StubType,
  BondInput,
  Bond,
  Coupon,
  Schedule,
  CashFlow,
  PricingResult,
  YieldResult,
  DurationResult,
  RiskMetrics,
  DiscountFactor,
  CurvePoint,
  YieldCurve,
  PortfolioPosition,
  PortfolioMetrics,
  DayCountResult,
  SolverOptions,
} from "./types";

// Constants
export {
  DEFAULT_TOLERANCE,
  DEFAULT_MAX_ITERATIONS,
  BASIS_POINT,
  FREQUENCY_PERIODS,
  FREQUENCY_MONTHS,
} from "./constants";

// Utilities
export {
  utcDate,
  toUTCMidnight,
  isLeapYear,
  daysInYear,
  daysInMonth,
  isEndOfMonth,
  actualDays,
  compareDates,
  addMonths,
  periodsPerYear,
  compoundingPeriods,
  effectiveAnnualRate,
  nominalRate,
  convertRate,
  roundFinancial,
  clamp,
  linearInterpolate,
  interpolateCurve,
} from "./utils";

// Day count
export { dayCount, yearFraction } from "./daycount";

// Validation
export {
  BondValidationError,
  validateBondInput,
  assertValidFrequency,
  assertValidYield,
  assertValidPrice,
  createBond,
} from "./validation";

// Schedule
export { generateSchedule, currentCouponPeriod } from "./schedule";
export type { CouponPeriodContext } from "./schedule";

// Cash flows
export { generateCashFlows, periodCouponAmount } from "./cashflows";
export type { CashFlowOptions } from "./cashflows";

// Accrued interest
export { accruedInterest, accruedDays } from "./accruedInterest";

// Discounting
export {
  discountFactor,
  continuousDiscountFactor,
  discountFactorFromConvention,
  presentValue,
  futureValue,
  spotDiscountFactor,
  presentValueFromCurve,
  discountFactors,
} from "./discount";

// Pricing
export { priceFromYield, dirtyPrice, cleanPrice, computePriceComponents } from "./pricing";
export type { PriceComponents } from "./pricing";

// Yield solver
export { yieldFromPrice, solveRoot } from "./yield";
export type { SolverResult } from "./yield";

// Duration
export {
  macaulayDuration,
  modifiedDuration,
  dollarDuration,
  effectiveDuration,
  durationMetrics,
} from "./duration";

// Convexity
export { convexity, effectiveConvexity } from "./convexity";

// Risk
export { dv01, pvbp, parallelShift, priceChange, riskMetrics } from "./risk";
export type { ParallelShiftResult, PriceChangeResult } from "./risk";

// Portfolio
export { positionMarketValue, portfolioMetrics } from "./portfolio";
