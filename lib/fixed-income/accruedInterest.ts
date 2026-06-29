/**
 * @file accruedInterest.ts
 * Accrued interest using the day-count convention, settlement date and the
 * surrounding coupon dates.
 *
 * Reference: ICMA Rule 251 — accrued interest = coupon * (accrued days / period days).
 */

import type { Bond } from "./types";
import { currentCouponPeriod } from "./schedule";
import { periodCouponAmount } from "./cashflows";

/**
 * Accrued interest of a bond at its settlement date, per 100 of face value.
 *
 * @param bond Normalized bond.
 * @returns Accrued interest per 100 of face value.
 * @formula AI = couponAmount * (accruedDays / periodDays), scaled to 100 face.
 *          On a coupon date the accrued interest is zero.
 */
export function accruedInterest(bond: Bond): number {
  const context = currentCouponPeriod(bond);
  const coupon = periodCouponAmount(bond, context.period);
  const accrued = coupon * context.accrualFraction;
  return (accrued / bond.faceValue) * 100;
}

/**
 * Number of accrued days at settlement, under the bond's day-count convention.
 * @returns Accrued days from the previous coupon date to settlement.
 */
export function accruedDays(bond: Bond): number {
  return currentCouponPeriod(bond).accrualDays;
}
