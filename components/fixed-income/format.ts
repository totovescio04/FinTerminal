/**
 * @file format.ts
 * Display formatting helpers for the calculator. These are presentation-only —
 * they perform NO financial math.
 */

import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils/format";

const DASH = "—";

/** Format a number with fixed decimals, or a dash when undefined. */
export function num(value: number | undefined, decimals = 4): string {
  return value === undefined || !Number.isFinite(value) ? DASH : formatNumber(value, decimals);
}

/** Format a percent value (already in percent units), or a dash. */
export function pct(value: number | undefined, decimals = 3): string {
  return value === undefined || !Number.isFinite(value) ? DASH : formatPercent(value, decimals);
}

/** Format a currency amount, or a dash. */
export function money(value: number | undefined, currency = "USD"): string {
  return value === undefined || !Number.isFinite(value) ? DASH : formatCurrency(value, currency);
}

/** Format a Date as "dd MMM yyyy" in UTC (dates are stored at UTC midnight). */
export function formatDate(value: Date | undefined): string {
  if (!value || Number.isNaN(value.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(value);
}
