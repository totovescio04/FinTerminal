/**
 * @file types.ts
 * UI-level types for the Portfolio Analytics module. Only raw position inputs
 * are stored; every metric is derived from the engine at render time.
 */

import type { Bond, DayCountConvention, Frequency } from "@/lib/fixed-income";

/** A user-entered portfolio holding (the only persisted data). */
export interface Position {
  id: string;
  ticker: string;
  bondName: string;
  faceValue: number;
  quantity: number;
  /** Clean purchase price per 100 face. */
  purchasePrice: number;
  /** Yield to maturity in percent. */
  yield: number;
  /** Annual coupon rate in percent. */
  couponRate: number;
  issueDate: string;
  settlementDate: string;
  maturityDate: string;
  frequency: Frequency;
  dayCount: DayCountConvention;
  currency: string;
}

/** Per-position analytics, all derived from the engine. */
export interface PositionAnalytics {
  position: Position;
  bond: Bond;
  yieldDecimal: number;
  cleanPrice: number;
  dirtyPrice: number;
  accruedInterest: number;
  marketValue: number;
  costBasis: number;
  pnl: number;
  returnPct: number;
  modifiedDuration: number;
  macaulayDuration: number;
  convexity: number;
  dollarDuration: number;
  effectiveDuration: number;
  /** DV01 / PVBP scaled to the position's face (currency). */
  dv01: number;
  pvbp: number;
  currentYield: number;
  /** Weighted average life of the position (years). */
  wal: number;
  /** Share of portfolio market value (0–1); filled by the aggregator. */
  weight: number;
}

/** An allocation slice (asset / currency / maturity bucket). */
export interface AllocationSlice {
  label: string;
  value: number;
  weight: number;
}

/** One row of the aggregated portfolio cash-flow schedule. */
export interface AggregatedCashFlow {
  date: string;
  coupon: number;
  principal: number;
  total: number;
  presentValue: number;
}

/** Aggregated portfolio analytics (engine-weighted + reshaped). */
export interface PortfolioAnalytics {
  positions: PositionAnalytics[];
  marketValue: number;
  totalFaceValue: number;
  numberOfBonds: number;
  averageYield: number;
  averageCoupon: number;
  modifiedDuration: number;
  macaulayDuration: number;
  convexity: number;
  dv01: number;
  pvbp: number;
  weightedAverageLife: number;
  allocationByAsset: AllocationSlice[];
  allocationByCurrency: AllocationSlice[];
  allocationByMaturity: AllocationSlice[];
  aggregatedCashFlows: AggregatedCashFlow[];
}

/** Filter state for the portfolio table and charts. */
export interface PortfolioFilterState {
  search: string;
  currency: string;
  yieldMin: string;
  yieldMax: string;
  durationMin: string;
  durationMax: string;
  couponMin: string;
  couponMax: string;
  maturityFromYear: string;
  maturityToYear: string;
}

/** Empty (no-op) filter state. */
export const EMPTY_FILTERS: PortfolioFilterState = {
  search: "",
  currency: "",
  yieldMin: "",
  yieldMax: "",
  durationMin: "",
  durationMax: "",
  couponMin: "",
  couponMax: "",
  maturityFromYear: "",
  maturityToYear: "",
};
