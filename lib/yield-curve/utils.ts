/**
 * @file utils.ts
 * Math helpers: discount-factor / zero-rate conversions, tenor parsing.
 */

import type { Compounding } from "./types";

export const BASIS_POINT = 1e-4;

/**
 * Discount factor for a zero rate.
 * @formula annual: (1 + z)^(-t); continuous: e^(-z·t).
 */
export function discountFromZero(rate: number, tenor: number, compounding: Compounding): number {
  if (compounding === "continuous") return Math.exp(-rate * tenor);
  return Math.pow(1 + rate, -tenor);
}

/**
 * Zero rate implied by a discount factor.
 * @formula annual: DF^(-1/t) - 1; continuous: -ln(DF)/t.
 */
export function zeroFromDiscount(df: number, tenor: number, compounding: Compounding): number {
  if (tenor <= 0) return 0;
  if (compounding === "continuous") return -Math.log(df) / tenor;
  return Math.pow(df, -1 / tenor) - 1;
}

/** Linear interpolation between two points. */
export function lerp(x: number, x0: number, y0: number, x1: number, y1: number): number {
  if (x1 === x0) return y0;
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

/** Parse a tenor label ("1M", "6M", "2Y", "30Y") into years. */
export function tenorToYears(label: string): number {
  const m = /^(\d+(?:\.\d+)?)\s*([DWMY])$/i.exec(label.trim());
  if (!m) throw new Error(`Invalid tenor label: ${label}`);
  const n = Number(m[1]);
  switch (m[2]!.toUpperCase()) {
    case "D":
      return n / 365;
    case "W":
      return (n * 7) / 365;
    case "M":
      return n / 12;
    case "Y":
      return n;
    default:
      throw new Error(`Invalid tenor unit: ${label}`);
  }
}

/** Round to a number of decimals. */
export function round(value: number, decimals = 8): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}
