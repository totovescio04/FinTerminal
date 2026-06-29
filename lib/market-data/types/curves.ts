/**
 * @file curves.ts
 * Yield / treasury curve models.
 */

import type { ProviderId } from "./common";

/** A point on a curve. */
export interface MarketCurvePoint {
  /** Tenor in years. */
  tenor: number;
  /** Zero/par yield (percent). */
  yield: number;
}

/** A yield curve. */
export interface YieldCurve {
  id: string;
  name: string;
  currency: string;
  asOf: string;
  points: MarketCurvePoint[];
  source: ProviderId;
}

/** A government (treasury) curve — same shape, semantic alias. */
export type TreasuryCurve = YieldCurve;
