/**
 * @file analytics-series.ts
 * Pure derivations of chart-ready series from engine output. These functions
 * perform NO financial math of their own — pricing comes from the engine's
 * `priceFromYield`, and every other series is a reshape of the engine's
 * `CashFlow[]` / duration / risk results.
 */

import { priceFromYield, type Bond } from "@/lib/fixed-income";
import type { BondAnalyticsOk } from "@/components/fixed-income";

/** A point on the price/yield curve (yield in %, clean price per 100). */
export interface PriceYieldPoint {
  yieldPct: number;
  price: number;
}

/** A price/yield point plus the duration tangent (for convexity). */
export interface ConvexityPoint extends PriceYieldPoint {
  tangent: number;
}

/** Sample the price/yield curve around the current yield using the engine. */
export function buildPriceYieldSeries(
  bond: Bond,
  ytmDecimal: number,
  spread = 0.05,
  steps = 40,
): PriceYieldPoint[] {
  const lo = ytmDecimal - spread;
  const hi = ytmDecimal + spread;
  const points: PriceYieldPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const y = lo + ((hi - lo) * i) / steps;
    if (y <= -0.99) continue;
    points.push({ yieldPct: y * 100, price: priceFromYield(bond, y).cleanPrice });
  }
  return points;
}

/**
 * Build the convexity series: the true price curve plus the linear (duration)
 * approximation tangent at the current yield. The gap between them visualises
 * convexity. The tangent uses the engine's modified duration — no re-derivation.
 */
export function buildConvexitySeries(
  bond: Bond,
  ytmDecimal: number,
  modifiedDuration: number,
  currentCleanPrice: number,
  currentDirtyPrice: number,
  spread = 0.05,
  steps = 40,
): ConvexityPoint[] {
  // The tangent's slope is dC/dy = dD/dy = -modified * dirtyPrice (accrued is
  // yield-independent), evaluated at the current clean-price level. This makes
  // the line truly tangent to the plotted clean-price curve, so the curve sits
  // above it everywhere — that gap is convexity.
  return buildPriceYieldSeries(bond, ytmDecimal, spread, steps).map((p) => {
    const dy = p.yieldPct / 100 - ytmDecimal;
    return { ...p, tangent: currentCleanPrice - modifiedDuration * currentDirtyPrice * dy };
  });
}

/** Aggregated figures for the KPI bar and the table summary row. */
export interface CashFlowSummaryData {
  totalCoupons: number;
  totalPrincipal: number;
  totalPresentValue: number;
  averageDiscountFactor: number;
  weightedAverageLife: number;
  remainingPrincipal: number;
}

/** Summary aggregates derived from the engine's cash flows. */
export function buildCashFlowSummary(a: BondAnalyticsOk): CashFlowSummaryData {
  const cfs = a.cashFlows;
  const totalCoupons = cfs.reduce((s, cf) => s + cf.couponAmount, 0);
  const totalPrincipal = cfs.reduce((s, cf) => s + cf.principalAmount, 0);
  const totalPresentValue = cfs.reduce((s, cf) => s + cf.presentValue, 0);
  const averageDiscountFactor =
    cfs.length === 0 ? 0 : cfs.reduce((s, cf) => s + cf.discountFactor, 0) / cfs.length;
  const principalWeighted = cfs.reduce((s, cf) => s + cf.yearFraction * cf.principalAmount, 0);
  const weightedAverageLife = totalPrincipal === 0 ? 0 : principalWeighted / totalPrincipal;
  return {
    totalCoupons,
    totalPrincipal,
    totalPresentValue,
    averageDiscountFactor,
    weightedAverageLife,
    remainingPrincipal: a.bond.redemption,
  };
}

/** Datum for the duration weight chart. */
export interface DurationDatum {
  label: string;
  time: number;
  weight: number;
  pv: number;
}

/** Time-weight of each cash flow (PV / total PV) vs. its year fraction. */
export function buildDurationSeries(a: BondAnalyticsOk): DurationDatum[] {
  const dirty = a.pricing.presentValue;
  return a.cashFlows.map((cf) => ({
    label: `#${cf.index}`,
    time: cf.yearFraction,
    weight: dirty === 0 ? 0 : cf.presentValue / dirty,
    pv: cf.presentValue,
  }));
}

/** Datum for the present-value distribution chart. */
export interface PvDatum {
  label: string;
  pv: number;
  weightPct: number;
}

/** Present value of each flow and its weight (%) on total price. */
export function buildPvSeries(a: BondAnalyticsOk): PvDatum[] {
  const dirty = a.pricing.presentValue;
  return a.cashFlows.map((cf) => ({
    label: `#${cf.index}`,
    pv: cf.presentValue,
    weightPct: dirty === 0 ? 0 : (cf.presentValue / dirty) * 100,
  }));
}

/** Datum for the cash-flow timeline. */
export interface TimelineDatum {
  label: string;
  coupon: number;
  principal: number;
  total: number;
}

/** Coupon / principal / total per payment, labelled by payment number. */
export function buildTimelineSeries(a: BondAnalyticsOk): TimelineDatum[] {
  return a.cashFlows.map((cf) => ({
    label: `#${cf.index}`,
    coupon: cf.couponAmount,
    principal: cf.principalAmount,
    total: cf.totalCashFlow,
  }));
}

/** Datum for the discount-factor decay chart. */
export interface DiscountDatum {
  label: string;
  time: number;
  discountFactor: number;
}

/** Discount factor vs. time (year fraction) for each cash flow. */
export function buildDiscountSeries(a: BondAnalyticsOk): DiscountDatum[] {
  return a.cashFlows.map((cf) => ({
    label: `#${cf.index}`,
    time: cf.yearFraction,
    discountFactor: cf.discountFactor,
  }));
}
