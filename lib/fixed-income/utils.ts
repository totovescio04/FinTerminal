/**
 * @file utils.ts
 * Date, rate, rounding and interpolation helpers used throughout the engine.
 * All date math is performed in UTC to avoid timezone/DST drift.
 */

import type { CompoundingConvention, CurvePoint, Frequency } from "./types";
import { FREQUENCY_PERIODS } from "./constants";

// ----------------------------------------------------------------------------
// Date utilities (UTC)
// ----------------------------------------------------------------------------

/** Construct a UTC date at midnight. */
export function utcDate(year: number, monthIndex: number, day: number): Date {
  return new Date(Date.UTC(year, monthIndex, day));
}

/** Strip any time component, normalizing to UTC midnight. */
export function toUTCMidnight(date: Date): Date {
  return utcDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

/** True if `year` is a Gregorian leap year. */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Number of days in a given year. */
export function daysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

/** Number of days in a given month (0-based month index). */
export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

/** True if `date` is the last calendar day of its month. */
export function isEndOfMonth(date: Date): boolean {
  return date.getUTCDate() === daysInMonth(date.getUTCFullYear(), date.getUTCMonth());
}

/** Actual number of calendar days from `start` to `end` (signed). */
export function actualDays(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

/** Chronological comparison: negative if a < b, positive if a > b, 0 if equal. */
export function compareDates(a: Date, b: Date): number {
  return a.getTime() - b.getTime();
}

/**
 * Add a number of months to a date in UTC.
 * @param preserveEndOfMonth When true and `date` is month-end, the result is
 * snapped to the last day of the target month (used for coupon schedules).
 */
export function addMonths(date: Date, months: number, preserveEndOfMonth = false): Date {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const total = month + months;
  const targetYear = year + Math.floor(total / 12);
  let targetMonth = total % 12;
  if (targetMonth < 0) targetMonth += 12;
  const dim = daysInMonth(targetYear, targetMonth);
  if (preserveEndOfMonth && isEndOfMonth(date)) {
    return utcDate(targetYear, targetMonth, dim);
  }
  return utcDate(targetYear, targetMonth, Math.min(day, dim));
}

// ----------------------------------------------------------------------------
// Frequency / rate utilities
// ----------------------------------------------------------------------------

/** Coupon periods per year for a frequency. */
export function periodsPerYear(frequency: Frequency): number {
  return FREQUENCY_PERIODS[frequency];
}

/** Map a compounding convention to periods per year (Infinity = continuous). */
export function compoundingPeriods(compounding: CompoundingConvention): number {
  switch (compounding) {
    case "Annual":
      return 1;
    case "Semiannual":
      return 2;
    case "Quarterly":
      return 4;
    case "Monthly":
      return 12;
    case "Continuous":
      return Number.POSITIVE_INFINITY;
  }
}

/**
 * Effective annual rate from a nominal rate compounded `m` times per year.
 * @returns (1 + nominal/m)^m - 1
 */
export function effectiveAnnualRate(nominal: number, m: number): number {
  return Math.pow(1 + nominal / m, m) - 1;
}

/**
 * Nominal rate compounded `m` times per year equivalent to an effective rate.
 * @returns m * ((1 + effective)^(1/m) - 1)
 */
export function nominalRate(effective: number, m: number): number {
  return m * (Math.pow(1 + effective, 1 / m) - 1);
}

/**
 * Convert a nominal rate from one compounding frequency to another, holding the
 * effective annual rate constant.
 */
export function convertRate(rate: number, fromM: number, toM: number): number {
  const effective = effectiveAnnualRate(rate, fromM);
  return nominalRate(effective, toM);
}

// ----------------------------------------------------------------------------
// Numeric helpers
// ----------------------------------------------------------------------------

/** Round to `decimals` places using standard half-away-from-zero rounding. */
export function roundFinancial(value: number, decimals = 8): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/** Clamp `value` into the inclusive range [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two points.
 * @returns y0 + (y1 - y0) * (x - x0) / (x1 - x0)
 */
export function linearInterpolate(
  x: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): number {
  if (x1 === x0) return y0;
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

/**
 * Interpolate a rate from an ordered set of curve points (ascending tenor).
 * Uses linear interpolation with flat extrapolation beyond the endpoints.
 */
export function interpolateCurve(points: CurvePoint[], tenor: number): number {
  if (points.length === 0) throw new Error("interpolateCurve: empty curve");
  const sorted = [...points].sort((a, b) => a.tenor - b.tenor);
  const first = sorted[0]!;
  const last = sorted[sorted.length - 1]!;
  if (tenor <= first.tenor) return first.rate;
  if (tenor >= last.tenor) return last.rate;
  for (let i = 0; i < sorted.length - 1; i++) {
    const lo = sorted[i]!;
    const hi = sorted[i + 1]!;
    if (tenor >= lo.tenor && tenor <= hi.tenor) {
      return linearInterpolate(tenor, lo.tenor, lo.rate, hi.tenor, hi.rate);
    }
  }
  return last.rate;
}
