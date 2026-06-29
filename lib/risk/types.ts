/**
 * @file types.ts
 * Risk-layer types. A RiskPosition holds per-position numbers ALREADY computed
 * by the financial engine (pricing/duration/convexity/DV01) plus reference
 * metadata. This layer only aggregates / models risk over those numbers — it
 * contains no pricing math.
 */

export type CouponType = "Fixed" | "Floating" | "Zero" | "InflationLinked" | "Step";

/** Per-position risk inputs (engine-derived numbers + metadata). */
export interface RiskPosition {
  id: string;
  label: string;
  issuer: string;
  country: string;
  sector: string;
  rating: string;
  ratingClass: "IG" | "HY" | "NR";
  currency: string;
  couponType: CouponType;
  /** Market value (currency). */
  marketValue: number;
  /** Yield to maturity (decimal). */
  yield: number;
  /** Coupon rate (percent). */
  couponRate: number;
  remainingYears: number;
  wal: number;
  modifiedDuration: number;
  macaulayDuration: number;
  /** Dollar duration per 100 face (engine). */
  dollarDuration: number;
  convexity: number;
  /** DV01 / PVBP scaled to the position (currency). */
  dv01: number;
  pvbp: number;
}

/** Aggregated portfolio risk metrics. */
export interface RiskAggregate {
  marketValue: number;
  modifiedDuration: number;
  macaulayDuration: number;
  dollarDuration: number;
  convexity: number;
  dv01: number;
  pvbp: number;
  averageYield: number;
  weightedCoupon: number;
  weightedAverageLife: number;
  numberOfPositions: number;
}

/** An exposure slice. */
export interface ExposureSlice {
  key: string;
  value: number;
  weight: number;
  count: number;
}

/** A maturity bucket summary. */
export interface MaturityBucket {
  label: string;
  count: number;
  value: number;
  weight: number;
  duration: number;
}

/** A per-position risk contribution. */
export interface RiskContribution {
  id: string;
  label: string;
  marketValueWeight: number;
  durationContribution: number;
  convexityContribution: number;
  dv01: number;
  dv01Weight: number;
}

/** VaR result. */
export interface VaRResult {
  method: "parametric" | "historical" | "montecarlo";
  confidence: number;
  horizonDays: number;
  value: number;
}

/** A scenario point (parallel shift applied to the whole book). */
export interface ScenarioPoint {
  shiftBps: number;
  newValue: number;
  pnl: number;
  changePct: number;
}

/** A stress-test result. */
export interface StressResult {
  id: string;
  label: string;
  newValue: number;
  impact: number;
  impactPct: number;
}
