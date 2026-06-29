/**
 * @file fx.ts
 * Currency conversion via a USD pivot so all cross-rates stay coherent.
 */

import type { Currency, FXRate, ProviderId } from "@/lib/market-data/types";

/** Units of each currency per 1 USD (the single source of truth for crosses). */
export type PerUsdTable = Record<Currency, number>;

/** Convert an amount between currencies using the per-USD table. */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  perUsd: PerUsdTable,
): number {
  if (from === to) return amount;
  const usd = amount / perUsd[from];
  return usd * perUsd[to];
}

/** Build a coherent {@link FXRate} (quote per base) from the per-USD table. */
export function buildFXRate(
  base: Currency,
  quote: Currency,
  perUsd: PerUsdTable,
  changePct: number,
  asOf: string,
  source: ProviderId,
): FXRate {
  const rate = perUsd[quote] / perUsd[base];
  return { base, quote, rate, changePct, asOf, source };
}
