/**
 * @file schedule.ts
 * Professional coupon-schedule generation with support for regular periods and
 * short/long first and last coupons (stubs).
 *
 * Reference: ICMA / market-standard backward-generation from the maturity date.
 */

import type { Bond, Coupon, Schedule, StubType } from "./types";
import { FREQUENCY_MONTHS } from "./constants";
import { addMonths, compareDates, isEndOfMonth, periodsPerYear } from "./utils";
import { dayCount } from "./daycount";

/** Context describing the coupon period that contains the settlement date. */
export interface CouponPeriodContext {
  /** The coupon period currently accruing. */
  period: Coupon;
  /** Remaining periods (current + future) whose payment is after settlement. */
  remaining: Coupon[];
  /** Accrued days from the period start to settlement (per day count). */
  accrualDays: number;
  /** Total days in the current period (per day count). */
  periodDays: number;
  /** Accrued fraction of the current period (accrualDays / periodDays). */
  accrualFraction: number;
  /** Fraction of the current period still remaining (1 - accrualFraction). */
  w: number;
}

function classify(start: Date, end: Date, stepMonths: number): { isRegular: boolean; stub: StubType } {
  const regularStart = addMonths(end, -stepMonths, isEndOfMonth(end));
  const cmp = compareDates(start, regularStart);
  if (cmp === 0) return { isRegular: true, stub: "regular" };
  // start earlier than the regular start => longer than a regular period.
  return { isRegular: false, stub: cmp < 0 ? "long" : "short" };
}

function buildPeriods(nodes: Date[], stepMonths: number): Coupon[] {
  const periods: Coupon[] = [];
  for (let i = 1; i < nodes.length; i++) {
    const start = nodes[i - 1]!;
    const end = nodes[i]!;
    const { isRegular, stub } = classify(start, end, stepMonths);
    periods.push({ index: i, startDate: start, endDate: end, paymentDate: end, isRegular, stub });
  }
  return periods;
}

/**
 * Generate a bond's coupon schedule.
 *
 * @param bond Normalized bond.
 * @returns A {@link Schedule} with one {@link Coupon} per accrual period, the
 *          ordered payment dates, and periods-per-year.
 * @remarks
 *  - Without `firstCouponDate`, regular dates are generated backward from
 *    maturity in steps of (12 / frequency) months; the accrual start of the
 *    first coupon is the theoretical previous coupon date (which may precede the
 *    issue date for a bond bought between coupon dates).
 *  - With `firstCouponDate`, the first payment is fixed and the first/last
 *    periods may be short or long stubs (flagged on each {@link Coupon}).
 *  - Month-end dates are preserved when the maturity date is a month-end.
 */
export function generateSchedule(bond: Bond): Schedule {
  const m = periodsPerYear(bond.frequency);
  const stepMonths = FREQUENCY_MONTHS[bond.frequency];
  const eom = isEndOfMonth(bond.maturityDate);

  let nodes: Date[];

  if (bond.firstCouponDate) {
    // Forward generation from an explicit first coupon date.
    const payments: Date[] = [bond.firstCouponDate];
    let cursor = bond.firstCouponDate;
    while (compareDates(addMonths(cursor, stepMonths, eom), bond.maturityDate) < 0) {
      cursor = addMonths(cursor, stepMonths, eom);
      payments.push(cursor);
    }
    // Ensure maturity is the final payment.
    if (compareDates(payments[payments.length - 1]!, bond.maturityDate) !== 0) {
      payments.push(bond.maturityDate);
    }
    nodes = [bond.issueDate, ...payments];
  } else {
    // Backward generation from maturity to (and including) the boundary on/before issue.
    const boundaries: Date[] = [];
    let k = 0;
    for (;;) {
      const dt = addMonths(bond.maturityDate, -stepMonths * k, eom);
      boundaries.unshift(dt);
      if (compareDates(dt, bond.issueDate) <= 0) break;
      k += 1;
      if (k > 12_000) throw new Error("generateSchedule: schedule did not terminate");
    }
    nodes = boundaries;
  }

  const periods = buildPeriods(nodes, stepMonths);
  return {
    periods,
    couponDates: periods.map((p) => p.paymentDate),
    frequency: bond.frequency,
    periodsPerYear: m,
  };
}

/**
 * Determine the coupon period that contains the settlement date and the
 * associated accrual fraction.
 *
 * @param bond Normalized bond.
 * @returns A {@link CouponPeriodContext}. If settlement falls exactly on a
 *          coupon date, the next period is current with zero accrual.
 */
export function currentCouponPeriod(bond: Bond): CouponPeriodContext {
  const schedule = generateSchedule(bond);
  const settlement = bond.settlementDate;
  const remaining = schedule.periods.filter((p) => compareDates(p.endDate, settlement) > 0);
  if (remaining.length === 0) {
    throw new Error("currentCouponPeriod: bond has no cash flows after settlement");
  }
  const period = remaining[0]!;
  const periodDC = dayCount(period.startDate, period.endDate, bond.dayCount);
  const accrualDC = dayCount(period.startDate, settlement, bond.dayCount);
  const periodDays = periodDC.days;
  const accrualDays = accrualDC.days;
  const accrualFraction = periodDays > 0 ? accrualDays / periodDays : 0;
  return {
    period,
    remaining,
    accrualDays,
    periodDays,
    accrualFraction,
    w: 1 - accrualFraction,
  };
}
