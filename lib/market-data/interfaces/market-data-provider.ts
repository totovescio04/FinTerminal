/**
 * @file market-data-provider.ts
 * The contract every data source implements. Methods are optional and gated by
 * {@link MarketDataProvider.capabilities}, so a provider only implements what it
 * actually supports (Provider Pattern). The repository routes calls to the first
 * capable, available provider.
 */

import type {
  Benchmark,
  BondQuote,
  Currency,
  FXRate,
  HistoricalField,
  HistoricalSeries,
  HistoryRange,
  Issuer,
  MarketSnapshot,
  ProviderCapability,
  ProviderId,
  YieldCurve,
} from "@/lib/market-data/types";

export interface MarketDataProvider {
  readonly id: ProviderId;
  readonly name: string;
  readonly capabilities: ProviderCapability[];

  /** Whether the provider can currently serve requests. */
  isAvailable(): Promise<boolean>;

  getQuote?(symbol: string): Promise<BondQuote>;
  getQuotes?(symbols: string[]): Promise<BondQuote[]>;
  getYieldCurve?(curveId: string): Promise<YieldCurve>;
  getFXRate?(base: Currency, quote: Currency): Promise<FXRate>;
  getHistory?(symbol: string, field: HistoricalField, range: HistoryRange): Promise<HistoricalSeries>;
  getSnapshot?(): Promise<MarketSnapshot>;
  getIssuer?(issuerId: string): Promise<Issuer>;
  getBenchmark?(benchmarkId: string): Promise<Benchmark>;
}
