/**
 * @file pricing.ts
 * Bond valuation by discounting each cash flow individually (no closed-form
 * approximations).
 *
 * Reference: Fabozzi — present value of a bond's cash flows; ISMA/street
 * fractional-period discounting.
 */

import type { Bond, CashFlow, PricingResult } from "./types";
import { periodsPerYear } from "./utils";
import { generateCashFlows } from "./cashflows";
import { accruedInterest } from "./accruedInterest";
import { assertValidYield } from "./validation";

/** Internal breakdown shared by the duration/convexity/risk modules. */
export interface PriceComponents {
  /** Yield used (decimal). */
  yield: number;
  /** Coupon periods per year. */
  periodsPerYear: number;
  /** Dirty present value in currency. */
  dirtyCurrency: number;
  /** Dirty price per 100 face. */
  dirtyPrice: number;
  /** Clean price per 100 face. */
  cleanPrice: number;
  /** Accrued interest per 100 face. */
  accruedInterest: number;
  /** Discounted cash flows. */
  cashFlows: CashFlow[];
}

/**
 * Compute the full pricing breakdown for a bond at a given yield.
 * @param bond Normalized bond.
 * @param yld Yield (decimal, compounded at the coupon frequency).
 * @returns A {@link PriceComponents} breakdown.
 * @formula DirtyPV = Σ CF_k * (1 + y/m)^(-(k-1+w)); Clean = Dirty - Accrued.
 */
export function computePriceComponents(bond: Bond, yld: number): PriceComponents {
  assertValidYield(yld);
  const m = periodsPerYear(bond.frequency);
  const cashFlows = generateCashFlows(bond, { yield: yld });
  const dirtyCurrency = cashFlows.reduce((sum, cf) => sum + cf.presentValue, 0);
  const dirtyPrice = (dirtyCurrency / bond.faceValue) * 100;
  const ai = accruedInterest(bond);
  const cleanPrice = dirtyPrice - ai;
  return {
    yield: yld,
    periodsPerYear: m,
    dirtyCurrency,
    dirtyPrice,
    cleanPrice,
    accruedInterest: ai,
    cashFlows,
  };
}

/**
 * Value a bond from a yield, returning clean/dirty price, accrued interest and
 * the discounted cash flows.
 * @param bond Normalized bond.
 * @param yld Yield (decimal).
 * @returns A {@link PricingResult}.
 */
export function priceFromYield(bond: Bond, yld: number): PricingResult {
  const pc = computePriceComponents(bond, yld);
  return {
    yield: yld,
    cleanPrice: pc.cleanPrice,
    dirtyPrice: pc.dirtyPrice,
    accruedInterest: pc.accruedInterest,
    presentValue: pc.dirtyCurrency,
    cashFlows: pc.cashFlows,
  };
}

/**
 * Dirty (full) price per 100 face from a yield.
 * @returns Dirty price per 100 face.
 */
export function dirtyPrice(bond: Bond, yld: number): number {
  return computePriceComponents(bond, yld).dirtyPrice;
}

/**
 * Clean price per 100 face from a yield (dirty price minus accrued interest).
 * @returns Clean price per 100 face.
 */
export function cleanPrice(bond: Bond, yld: number): number {
  return computePriceComponents(bond, yld).cleanPrice;
}
