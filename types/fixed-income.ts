/**
 * Domain contracts for the fixed-income engine.
 *
 * These types are defined now so the UI and the (future) analytics engine share
 * a single source of truth. No calculations are implemented in Stage 1.
 */

export type DayCountConvention =
  | "30/360"
  | "ACT/360"
  | "ACT/365"
  | "ACT/ACT";

export type CouponFrequency = 1 | 2 | 4 | 12;

export interface Bond {
  id: string;
  isin?: string;
  issuer: string;
  faceValue: number;
  couponRate: number;
  couponFrequency: CouponFrequency;
  issueDate: string;
  maturityDate: string;
  dayCount: DayCountConvention;
  currency: string;
}

/** Placeholder result shapes the engine will return in Stage 2. */
export interface BondAnalytics {
  cleanPrice: number;
  dirtyPrice: number;
  yieldToMaturity: number;
  macaulayDuration: number;
  modifiedDuration: number;
  convexity: number;
  dv01: number;
}

export interface CashFlow {
  date: string;
  coupon: number;
  principal: number;
  total: number;
}

export interface CurvePoint {
  tenor: number;
  rate: number;
}
