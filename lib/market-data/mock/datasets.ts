/**
 * @file datasets.ts
 * Coherent (not random) mock datasets for the local provider: bond quotes,
 * curves, FX and benchmarks. Values are internally consistent — distressed
 * sovereigns trade at deep discounts with high yields, treasuries near par, etc.
 */

import type { Currency } from "@/lib/market-data/types";
import type { PerUsdTable } from "@/lib/market-data/utils";

/** Reference "as of" date for the mock market. */
export const ASOF = "2026-06-29";

/** Seed for a single instrument quote. */
export interface QuoteSeed {
  symbol: string;
  isin: string;
  name: string;
  currency: Currency;
  /** Indicative clean price per 100 face. */
  price: number;
  /** Indicative yield (percent). */
  yield: number;
  changePct: number;
  spreadBps?: number;
}

export const QUOTE_SEEDS: QuoteSeed[] = [
  { symbol: "AL30", isin: "ARARGE3209S6", name: "Argentina Bonar 2030", currency: "USD", price: 62.4, yield: 14.2, changePct: 0.8, spreadBps: 980 },
  { symbol: "GD30", isin: "US040114HS26", name: "Argentina Global 2030", currency: "USD", price: 64.1, yield: 13.8, changePct: 0.6, spreadBps: 940 },
  { symbol: "GD35", isin: "US040114HT09", name: "Argentina Global 2035", currency: "USD", price: 55.7, yield: 13.1, changePct: -0.4, spreadBps: 870 },
  { symbol: "AE38", isin: "US040114HW38", name: "Argentina Bonar 2038", currency: "USD", price: 58.9, yield: 12.6, changePct: 0.3, spreadBps: 820 },
  { symbol: "GD41", isin: "US040114HX11", name: "Argentina Global 2041", currency: "USD", price: 53.2, yield: 12.9, changePct: -0.2, spreadBps: 850 },
  { symbol: "T 4 34", isin: "US91282CKT37", name: "US Treasury 4% 2034", currency: "USD", price: 96.8, yield: 4.42, changePct: -0.1, spreadBps: 0 },
  { symbol: "T 4 7/8 52", isin: "US912810TM09", name: "US Treasury 4.875% 2052", currency: "USD", price: 98.1, yield: 4.98, changePct: -0.2, spreadBps: 0 },
  { symbol: "T 2 30", isin: "US91282Cae45", name: "US Treasury 2% 2030", currency: "USD", price: 90.3, yield: 4.05, changePct: 0.05, spreadBps: 0 },
  { symbol: "AAPL 30", isin: "US037833EK41", name: "Apple Inc 2030", currency: "USD", price: 95.6, yield: 4.55, changePct: 0.1, spreadBps: 48 },
  { symbol: "JPM 31", isin: "US46625HRL66", name: "JPMorgan 2031", currency: "USD", price: 92.4, yield: 4.78, changePct: -0.05, spreadBps: 72 },
  { symbol: "F 29", isin: "US345370CA64", name: "Ford Motor 2029", currency: "USD", price: 99.2, yield: 6.35, changePct: 0.2, spreadBps: 235 },
  { symbol: "DBR 2 35", isin: "DE0001102614", name: "Bund 2% 2035", currency: "EUR", price: 88.4, yield: 3.18, changePct: -0.1, spreadBps: 0 },
];

/** UST par curve — coherent, gently upward sloping. */
export const UST_CURVE: { tenor: number; yield: number }[] = [
  { tenor: 0.25, yield: 4.85 },
  { tenor: 0.5, yield: 4.7 },
  { tenor: 1, yield: 4.45 },
  { tenor: 2, yield: 4.2 },
  { tenor: 3, yield: 4.12 },
  { tenor: 5, yield: 4.18 },
  { tenor: 7, yield: 4.3 },
  { tenor: 10, yield: 4.45 },
  { tenor: 20, yield: 4.8 },
  { tenor: 30, yield: 4.92 },
];

/** Argentine USD sovereign curve — high, inverted at the front. */
export const ARG_CURVE: { tenor: number; yield: number }[] = [
  { tenor: 1, yield: 15.5 },
  { tenor: 2, yield: 14.6 },
  { tenor: 3, yield: 14.0 },
  { tenor: 5, yield: 13.4 },
  { tenor: 7, yield: 12.9 },
  { tenor: 10, yield: 12.5 },
  { tenor: 20, yield: 12.2 },
];

/** Units of each currency per 1 USD. */
export const PER_USD: PerUsdTable = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 157.2,
  ARS: 1015,
  BRL: 5.42,
};

/** Day change (%) per currency vs USD. */
export const FX_CHANGE: Record<Currency, number> = {
  USD: 0,
  EUR: 0.18,
  GBP: -0.12,
  JPY: -0.35,
  ARS: 0.55,
  BRL: 0.27,
};
