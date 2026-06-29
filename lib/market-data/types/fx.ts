/**
 * @file fx.ts
 * FX rate model and supported currencies.
 */

import type { ProviderId } from "./common";

export type Currency = "USD" | "EUR" | "ARS" | "BRL" | "JPY" | "GBP";

/** An FX rate expressed as units of `quote` per 1 unit of `base`. */
export interface FXRate {
  base: Currency;
  quote: Currency;
  rate: number;
  changePct: number;
  asOf: string;
  source: ProviderId;
}
