"use client";

import { useMemo } from "react";
import {
  createBond,
  durationMetrics,
  generateCashFlows,
  priceFromYield,
  riskMetrics,
  yieldFromPrice,
  type Bond,
  type CashFlow,
  type DurationResult,
  type PricingResult,
  type RiskMetrics,
} from "@/lib/fixed-income";
import type { BondFormValues, PriceMode } from "./schema";

/** Successful analytics derived entirely from the fixed-income engine. */
export interface BondAnalyticsOk {
  ok: true;
  bond: Bond;
  /** Yield to maturity as a decimal (e.g. 0.05). */
  yieldDecimal: number;
  pricing: PricingResult;
  durations: DurationResult;
  risk: RiskMetrics;
  cashFlows: CashFlow[];
  /** Current yield in percent (annual coupon / clean price). */
  currentYield: number;
  /** Number of coupons remaining after settlement. */
  remainingCoupons: number;
  /** Dirty market value in currency (dirtyPrice/100 * faceValue). */
  marketValue: number;
}

/** Failed analytics (invalid or inconsistent inputs). */
export interface BondAnalyticsError {
  ok: false;
  error: string;
}

export type BondAnalytics = BondAnalyticsOk | BondAnalyticsError;

/**
 * Derive every metric for the calculator from the engine. The hook is pure:
 * it stores nothing, recomputing from `values` and `mode` on each change.
 *
 * Engine functions consumed (the ONLY source of financial math):
 *  - `createBond`            normalize + validate inputs
 *  - `yieldFromPrice`        clean price -> YTM (price-driven mode)
 *  - `priceFromYield`        YTM -> clean/dirty/accrued + discounted cash flows
 *  - `durationMetrics`       Macaulay / modified / dollar / effective duration
 *  - `riskMetrics`           DV01 / PVBP / convexity
 *  - `generateCashFlows`     projected, discounted cash flows
 *
 * @param values Current form values (coupon & yield in percent; price per 100).
 * @param mode Whether yield or clean price is the authoritative input.
 * @returns A discriminated union: analytics on success, or an error message.
 */
export function useBondAnalytics(values: BondFormValues, mode: PriceMode): BondAnalytics {
  return useMemo<BondAnalytics>(() => {
    try {
      const numeric = [values.faceValue, values.couponRate, values.yield, values.cleanPrice];
      if (numeric.some((n) => !Number.isFinite(n))) {
        return { ok: false, error: "Complete all numeric fields with valid values." };
      }

      const bond = createBond({
        faceValue: values.faceValue,
        couponRate: values.couponRate / 100,
        issueDate: new Date(values.issueDate),
        maturityDate: new Date(values.maturityDate),
        settlementDate: new Date(values.settlementDate),
        frequency: values.frequency,
        dayCount: values.dayCount,
      });

      const yieldDecimal =
        mode === "yield" ? values.yield / 100 : yieldFromPrice(bond, values.cleanPrice).yield;

      const pricing = priceFromYield(bond, yieldDecimal);
      const durations = durationMetrics(bond, yieldDecimal);
      const risk = riskMetrics(bond, yieldDecimal);
      const cashFlows = generateCashFlows(bond, { yield: yieldDecimal });

      const currentYield = (values.couponRate / pricing.cleanPrice) * 100;
      const marketValue = (pricing.dirtyPrice / 100) * bond.faceValue;

      return {
        ok: true,
        bond,
        yieldDecimal,
        pricing,
        durations,
        risk,
        cashFlows,
        currentYield,
        remainingCoupons: cashFlows.length,
        marketValue,
      };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "Invalid bond inputs." };
    }
    
  }, [
    values.faceValue,
    values.couponRate,
    values.frequency,
    values.issueDate,
    values.settlementDate,
    values.maturityDate,
    values.dayCount,
    values.yield,
    values.cleanPrice,
    mode,
  ]);
}
