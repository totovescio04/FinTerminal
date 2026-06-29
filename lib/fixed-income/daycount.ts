/**
 * @file daycount.ts
 * Day-count conventions. Each convention returns the days counted, the
 * denominator (period/year days) and the resulting year fraction.
 *
 * References:
 *  - ISDA 2006 Definitions, Section 4.16 (Day Count Fractions).
 *  - ICMA Rule 251 / SIFMA standard bond-basis conventions.
 */

import type { DayCountConvention, DayCountResult } from "./types";
import { actualDays, daysInYear } from "./utils";

interface YMD {
  y: number;
  m: number; // 1-based month
  d: number;
}

function ymd(date: Date): YMD {
  return { y: date.getUTCFullYear(), m: date.getUTCMonth() + 1, d: date.getUTCDate() };
}

/**
 * 30/360 (US / Bond Basis) day count between two dates.
 * @formula days = 360*(y2-y1) + 30*(m2-m1) + (d2-d1) with US adjustments:
 *   if d1 = 31 then d1 = 30; if d2 = 31 and d1 = 30 then d2 = 30.
 */
function days30360US(start: Date, end: Date): number {
  const a = ymd(start);
  const b = ymd(end);
  let d1 = a.d;
  let d2 = b.d;
  if (d1 === 31) d1 = 30;
  if (d2 === 31 && d1 === 30) d2 = 30;
  return 360 * (b.y - a.y) + 30 * (b.m - a.m) + (d2 - d1);
}

/**
 * 30E/360 (Eurobond Basis) day count between two dates.
 * @formula days = 360*(y2-y1) + 30*(m2-m1) + (d2-d1) with:
 *   if d1 = 31 then d1 = 30; if d2 = 31 then d2 = 30.
 */
function days30E360(start: Date, end: Date): number {
  const a = ymd(start);
  const b = ymd(end);
  const d1 = a.d === 31 ? 30 : a.d;
  const d2 = b.d === 31 ? 30 : b.d;
  return 360 * (b.y - a.y) + 30 * (b.m - a.m) + (d2 - d1);
}

/**
 * Actual/Actual (ISDA) year fraction between two dates.
 * @formula Splits the interval by calendar year: each portion is divided by the
 * number of days in its own year (365 or 366) and the parts are summed.
 */
function fractionActActISDA(start: Date, end: Date): number {
  const y1 = start.getUTCFullYear();
  const y2 = end.getUTCFullYear();
  if (y1 === y2) {
    return actualDays(start, end) / daysInYear(y1);
  }
  // Portion in the start year (start -> Jan 1 of next year).
  const startYearEnd = new Date(Date.UTC(y1 + 1, 0, 1));
  let fraction = actualDays(start, startYearEnd) / daysInYear(y1);
  // Whole years in between.
  for (let y = y1 + 1; y < y2; y++) fraction += 1;
  // Portion in the end year (Jan 1 of end year -> end).
  const endYearStart = new Date(Date.UTC(y2, 0, 1));
  fraction += actualDays(endYearStart, end) / daysInYear(y2);
  return fraction;
}

/**
 * Compute days, denominator and year fraction for a day-count convention.
 *
 * @param start Period/interval start date.
 * @param end Period/interval end date.
 * @param convention Day-count convention to apply.
 * @returns {@link DayCountResult} with `days`, `periodDays` (denominator) and
 *          `fraction` (= days / periodDays) such that the identity always holds.
 * @formula
 *  - ACT/360: days = actual; denominator = 360.
 *  - ACT/365: days = actual; denominator = 365.
 *  - 30/360, 30E/360: days = 30/360 rule; denominator = 360.
 *  - ACT/ACT (ISDA): fraction per ISDA; days = actual; denominator = days/fraction.
 */
export function dayCount(
  start: Date,
  end: Date,
  convention: DayCountConvention,
): DayCountResult {
  switch (convention) {
    case "ACT/360": {
      const days = actualDays(start, end);
      return { days, periodDays: 360, fraction: days / 360 };
    }
    case "ACT/365": {
      const days = actualDays(start, end);
      return { days, periodDays: 365, fraction: days / 365 };
    }
    case "30/360": {
      const days = days30360US(start, end);
      return { days, periodDays: 360, fraction: days / 360 };
    }
    case "30E/360": {
      const days = days30E360(start, end);
      return { days, periodDays: 360, fraction: days / 360 };
    }
    case "ACT/ACT": {
      const days = actualDays(start, end);
      const fraction = fractionActActISDA(start, end);
      const periodDays = fraction === 0 ? daysInYear(start.getUTCFullYear()) : days / fraction;
      return { days, periodDays, fraction };
    }
  }
}

/**
 * Year fraction between two dates under a day-count convention.
 * @returns The `fraction` field of {@link dayCount}.
 */
export function yearFraction(
  start: Date,
  end: Date,
  convention: DayCountConvention,
): number {
  return dayCount(start, end, convention).fraction;
}
