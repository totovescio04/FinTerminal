/**
 * @file index.ts
 * Public surface of the Market Data Engine. React code consumes the services
 * (or the hooks/components in components/market-data) — never providers/JSON.
 */

export * from "./types";
export { MARKET_DATA_TTL, createDefaultProviders } from "./config";
export { MarketDataRepository } from "./repositories";
export type { MarketDataResult } from "./repositories";
export { FallbackStrategy } from "./repositories";
export type { ProviderSelectionStrategy } from "./repositories";
export { MemoryCacheStore, RedisCacheStore } from "./cache";
export type { RedisLike } from "./cache";
export type { MarketDataProvider, CacheStore } from "./interfaces";
export {
  BaseMarketDataProvider,
  LocalJsonProvider,
  ManualProvider,
  BloombergProvider,
  RefinitivProvider,
  MarketAxessProvider,
  OpenFigiProvider,
  PolygonProvider,
  FmpProvider,
  AlphaVantageProvider,
} from "./providers";
export {
  quoteService,
  yieldCurveService,
  fxService,
  benchmarkService,
  historyService,
  issuerService,
  marketService,
  marketDataRepository,
} from "./services";
export { convertCurrency } from "./utils";
