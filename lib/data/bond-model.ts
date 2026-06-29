/**
 * @file bond-model.ts
 * Domain model for a bond instrument plus rating helpers. This is the
 * source-agnostic representation the whole app consumes — independent of where
 * the data came from.
 */

import type { DayCountConvention, Frequency } from "@/lib/fixed-income";

export type CouponType = "Fixed" | "Floating" | "Zero" | "InflationLinked" | "Step";
export type AmortizationType = "Bullet" | "Amortizing" | "Sinkable";
export type RatingClass = "IG" | "HY" | "NR";

/** A fully-typed bond reference record (domain model). */
export interface BondRecord {
  id: string;
  ticker: string;
  isin: string;
  cusip?: string;
  name: string;
  issuer: string;
  country: string;
  currency: string;
  coupon: number;
  couponType: CouponType;
  frequency: Frequency;
  issueDate: string;
  settlementDays: number;
  maturityDate: string;
  faceValue: number;
  dayCount: DayCountConvention;
  callable: boolean;
  puttable: boolean;
  inflationLinked: boolean;
  floatingRate: boolean;
  fixedRate: boolean;
  zeroCoupon: boolean;
  amortizationType: AmortizationType;
  rating: string;
  ratingClass: RatingClass;
  sector: string;
  market: string;
  exchange: string;
  /** Indicative market yield (percent). */
  marketYield: number;
  /** Indicative clean market price per 100 face. */
  marketPrice: number;
}

/** Reference valuation date used to derive settlement from settlement days. */
export const VALUATION_DATE = "2026-06-29";

/** S&P-style rating scale, best to worst. */
export const RATING_SCALE: string[] = [
  "AAA", "AA+", "AA", "AA-", "A+", "A", "A-",
  "BBB+", "BBB", "BBB-", "BB+", "BB", "BB-",
  "B+", "B", "B-", "CCC+", "CCC", "CCC-", "CC", "C", "D",
];

/** Numeric rank of a rating (lower = stronger); 99 if unknown. */
export function ratingRank(rating: string): number {
  const i = RATING_SCALE.indexOf(rating.toUpperCase());
  return i === -1 ? 99 : i;
}

/** Investment-grade if rated BBB- or better; otherwise high-yield. */
export function ratingClass(rating: string): RatingClass {
  const rank = ratingRank(rating);
  if (rank === 99) return "NR";
  return rank <= RATING_SCALE.indexOf("BBB-") ? "IG" : "HY";
}
