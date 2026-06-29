/**
 * @file format.ts
 * Presentation-only formatting for scenarios (signed values, basis points).
 */

import { formatCurrency, formatNumber } from "@/lib/utils/format";

/** Signed fixed-decimal number, e.g. "+1.2345" / "-0.5000". */
export function signed(value: number, decimals = 4): string {
  const sign = value > 0 ? "+" : "";
  return sign + formatNumber(value, decimals);
}

/** Signed percent, e.g. "+1.25%". */
export function signedPct(value: number, decimals = 3): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value, decimals)}%`;
}

/** Signed currency, e.g. "+$1,234". */
export function signedMoney(value: number, currency = "USD"): string {
  const sign = value > 0 ? "+" : "";
  return sign + formatCurrency(value, currency);
}

/** Basis-point label, e.g. "+50 bp" / "0 bp". */
export function bp(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value} bp`;
}
