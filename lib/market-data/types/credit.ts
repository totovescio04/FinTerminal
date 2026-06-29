/**
 * @file credit.ts
 * Issuer, credit rating, spread and benchmark models.
 */

import type { ProviderId } from "./common";

export type RatingAgency = "S&P" | "Moody's" | "Fitch";

/** A credit rating from a single agency. */
export interface CreditRating {
  agency: RatingAgency;
  rating: string;
  outlook: "Positive" | "Stable" | "Negative";
  date: string;
}

/** An issuer reference. */
export interface Issuer {
  id: string;
  name: string;
  country: string;
  sector: string;
  ratings: CreditRating[];
  source: ProviderId;
}

/** A spread observation for an instrument vs. a benchmark. */
export interface Spread {
  symbol: string;
  benchmark: string;
  spreadBps: number;
  zSpreadBps?: number;
  oasBps?: number;
  asOf: string;
  source: ProviderId;
}

/** A benchmark level (UST point, sovereign, corporate index, etc.). */
export interface Benchmark {
  id: string;
  name: string;
  type: "UST" | "Sovereign" | "Corporate" | "Index";
  /** Yield (percent) where applicable. */
  yield?: number;
  /** Index level where applicable. */
  level?: number;
  changePct: number;
  currency: string;
  source: ProviderId;
}
