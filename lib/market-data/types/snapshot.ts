/**
 * @file snapshot.ts
 * Aggregated market snapshot model.
 */

import type { MarketStatus, ProviderId } from "./common";
import type { BondQuote } from "./instruments";
import type { Benchmark } from "./credit";
import type { FXRate } from "./fx";

/** A point-in-time market snapshot across asset classes. */
export interface MarketSnapshot {
  asOf: string;
  status: MarketStatus;
  benchmarks: Benchmark[];
  fx: FXRate[];
  topMovers: BondQuote[];
  source: ProviderId;
}
