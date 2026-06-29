/**
 * @file cashflows.ts
 * Cash-flow generation for a bond, optionally discounted at a yield.
 *
 * Reference: Fabozzi — bond cash-flow construction; ISMA/street discounting
 * using the fraction of the current coupon period.
 */

import type { Bond, CashFlow, Coupon } from "./types";
import { compareDates, periodsPerYear } from "./utils";
import { yearFraction } from "./daycount";
import { currentCouponPeriod, generateSchedule } from "./schedule";

/** Options controlling cash-flow generation. */
export interface CashFlowOptions {
  /** If provided, cash flows are discounted at this yield (decimal). */
  yield?: number;
}

/**
 * Coupon amount (in currency, on face value) for a coupon period.
 * @returns Regular periods pay `faceValue * couponRate / periodsPerYear`;
 *          stub periods pay `faceValue * couponRate * yearFraction(period)`.
 */
export function periodCouponAmount(bond: Bond, period: Coupon): number {
  const m = periodsPerYear(bond.frequency);
  if (period.isRegular) {
    return (bond.faceValue * bond.couponRate) / m;
  }
  const yf = yearFraction(period.startDate, period.endDate, bond.dayCount);
  return bond.faceValue * bond.couponRate * yf;
}

/**
 * Generate the bond's remaining cash flows from settlement to maturity.
 *
 * @param bond Normalized bond.
 * @param options Optional yield for discounting.
 * @returns An array of {@link CashFlow}. The discount-time of cash flow `j`
 *          (0-based) is `(j + w)` coupon periods, where `w` is the unexpired
 *          fraction of the current coupon period. When no yield is supplied,
 *          `discountFactor = 1` and `presentValue = totalCashFlow`.
 * @formula discountFactor_j = (1 + y/m)^(-(j + w)); PV_j = CF_j * discountFactor_j.
 */
export function generateCashFlows(bond: Bond, options?: CashFlowOptions): CashFlow[] {
  const schedule = generateSchedule(bond);
  const m = schedule.periodsPerYear;
  const context = currentCouponPeriod(bond);
  const lastPeriod = schedule.periods[schedule.periods.length - 1]!;
  const y = options?.yield;

  return context.remaining.map((period, j) => {
    const coupon = periodCouponAmount(bond, period);
    const isLast = compareDates(period.endDate, lastPeriod.endDate) === 0;
    const principal = isLast ? bond.redemption : 0;
    const total = coupon + principal;
    const n = j + context.w;
    const accrualDays = period.endDate
      ? Math.round((period.endDate.getTime() - period.startDate.getTime()) / 86_400_000)
      : 0;

    let discountFactor = 1;
    let presentValue = total;
    if (y !== undefined) {
      discountFactor = Math.pow(1 + y / m, -n);
      presentValue = total * discountFactor;
    }

    return {
      index: j + 1,
      paymentDate: period.paymentDate,
      couponAmount: coupon,
      principalAmount: principal,
      totalCashFlow: total,
      accrualDays,
      yearFraction: n / m,
      discountFactor,
      presentValue,
      remainingPrincipal: isLast ? 0 : bond.redemption,
    };
  });
}
