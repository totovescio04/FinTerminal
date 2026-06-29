/**
 * @file constants.ts
 * Shared numeric constants and convention maps for the fixed-income engine.
 */

import type { Frequency } from "./types";

/** Default convergence tolerance for the yield solver. */
export const DEFAULT_TOLERANCE = 1e-10;

/** Default maximum iterations for the yield solver. */
export const DEFAULT_MAX_ITERATIONS = 1000;

/** One basis point expressed as a decimal (0.01%). */
export const BASIS_POINT = 1e-4;

/** Day-count denominators. */
export const DAYS_360 = 360;
export const DAYS_365 = 365;

/** Number of coupon periods per year for each supported payment frequency. */
export const FREQUENCY_PERIODS: Record<Frequency, number> = {
  Annual: 1,
  Semiannual: 2,
  Quarterly: 4,
  Monthly: 12,
};

/** Number of whole months between coupons for each frequency. */
export const FREQUENCY_MONTHS: Record<Frequency, number> = {
  Annual: 12,
  Semiannual: 6,
  Quarterly: 3,
  Monthly: 1,
};
