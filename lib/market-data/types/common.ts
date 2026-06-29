/**
 * @file common.ts
 * Shared market-data primitives: provider identity, capabilities, source
 * provenance and market status.
 */

/** Supported / planned data-source identifiers. */
export type ProviderId =
  | "local"
  | "bloomberg"
  | "refinitiv"
  | "marketaxess"
  | "openfigi"
  | "polygon"
  | "fmp"
  | "alphavantage"
  | "manual";

/** A capability a provider may offer. */
export type ProviderCapability =
  | "quote"
  | "curve"
  | "fx"
  | "history"
  | "snapshot"
  | "issuer"
  | "benchmark";

/** Trading session status. */
export type MarketStatus = "open" | "closed" | "pre" | "post";

/** Health of a provider at a point in time. */
export interface ProviderStatus {
  id: ProviderId;
  name: string;
  available: boolean;
  capabilities: ProviderCapability[];
  latencyMs?: number;
}

/** Provenance attached to every datum (which source, when, cached?). */
export interface DataSource {
  provider: ProviderId;
  asOf: string;
  cached: boolean;
}

/** Lookback window for historical queries. */
export type HistoryRange = "1W" | "1M" | "3M" | "6M" | "1Y" | "5Y";
