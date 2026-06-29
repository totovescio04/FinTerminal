/**
 * @file instruments.ts
 * Quote, OHLC, volume and historical series models.
 */

import type { ProviderId } from "./common";

/** A live (or snapshot) bond quote. */
export interface BondQuote {
  symbol: string;
  isin?: string;
  bid: number;
  ask: number;
  last: number;
  mid: number;
  /** Yield to maturity implied by the quote (percent). */
  yield: number;
  /** Spread to benchmark in basis points. */
  spreadBps?: number;
  /** Day change in percent. */
  changePct: number;
  volume?: number;
  currency: string;
  timestamp: string;
  source: ProviderId;
}

/** A daily OHLC bar. */
export interface OHLCBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/** A single historical observation (price / yield / duration / spread). */
export interface HistoricalPoint {
  date: string;
  value: number;
}

/** Field tracked by a historical series. */
export type HistoricalField = "price" | "yield" | "duration" | "spread";

/** A historical series with optional OHLC bars (for price). */
export interface HistoricalSeries {
  symbol: string;
  field: HistoricalField;
  points: HistoricalPoint[];
  bars?: OHLCBar[];
  source: ProviderId;
}
