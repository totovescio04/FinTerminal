/**
 * @file market-data-repository.ts
 * Central repository: routes every request through the cache, then the
 * fallback {@link ProviderSelectionStrategy}. Components/services never talk to
 * providers directly. Offline mode restricts the chain to local/manual sources.
 */

import type { CacheStore } from "@/lib/market-data/interfaces";
import type { MarketDataProvider } from "@/lib/market-data/interfaces";
import type {
  Benchmark,
  BondQuote,
  Currency,
  DataSource,
  FXRate,
  HistoricalField,
  HistoricalSeries,
  HistoryRange,
  Issuer,
  MarketSnapshot,
  ProviderCapability,
  ProviderId,
  ProviderStatus,
  YieldCurve,
} from "@/lib/market-data/types";
import { cacheKey, isOnline } from "@/lib/market-data/utils";
import { MARKET_DATA_TTL } from "@/lib/market-data/config";
import { FallbackStrategy, type ProviderSelectionStrategy } from "./fallback-strategy";

/** A value with its provenance (which provider, when, from cache?). */
export interface MarketDataResult<T> {
  data: T;
  source: DataSource;
}

interface CachedPayload<T> {
  value: T;
  provider: ProviderId;
  asOf: string;
}

export class MarketDataRepository {
  private readonly providers: MarketDataProvider[];
  private readonly cache: CacheStore;
  private readonly strategy: ProviderSelectionStrategy;

  constructor(providers: MarketDataProvider[], cache: CacheStore, strategy: ProviderSelectionStrategy = new FallbackStrategy()) {
    this.providers = providers;
    this.cache = cache;
    this.strategy = strategy;
  }

  /** Providers eligible right now (offline → local/manual only). */
  private eligible(): MarketDataProvider[] {
    if (isOnline()) return this.providers;
    return this.providers.filter((p) => p.id === "local" || p.id === "manual");
  }

  private async resolve<T>(
    key: string,
    ttl: number,
    capability: ProviderCapability,
    call: (provider: MarketDataProvider) => Promise<T>,
  ): Promise<MarketDataResult<T>> {
    const hit = await this.cache.get<CachedPayload<T>>(key);
    if (hit) {
      return { data: hit.value, source: { provider: hit.provider, asOf: hit.asOf, cached: true } };
    }
    const { value, provider } = await this.strategy.resolve(this.eligible(), capability, call);
    const asOf = new Date().toISOString();
    await this.cache.set<CachedPayload<T>>(key, { value, provider, asOf }, ttl);
    return { data: value, source: { provider, asOf, cached: false } };
  }

  getQuote(symbol: string): Promise<MarketDataResult<BondQuote>> {
    return this.resolve(cacheKey("quote", symbol), MARKET_DATA_TTL.quote, "quote", (p) => {
      if (!p.getQuote) throw new Error(`${p.id}: getQuote unsupported`);
      return p.getQuote(symbol);
    });
  }

  getQuotes(symbols: string[]): Promise<MarketDataResult<BondQuote[]>> {
    return this.resolve(cacheKey("quotes", symbols.join(",") || "all"), MARKET_DATA_TTL.quote, "quote", (p) => {
      if (!p.getQuotes) throw new Error(`${p.id}: getQuotes unsupported`);
      return p.getQuotes(symbols);
    });
  }

  getYieldCurve(curveId: string): Promise<MarketDataResult<YieldCurve>> {
    return this.resolve(cacheKey("curve", curveId), MARKET_DATA_TTL.curve, "curve", (p) => {
      if (!p.getYieldCurve) throw new Error(`${p.id}: getYieldCurve unsupported`);
      return p.getYieldCurve(curveId);
    });
  }

  getFXRate(base: Currency, quote: Currency): Promise<MarketDataResult<FXRate>> {
    return this.resolve(cacheKey("fx", base, quote), MARKET_DATA_TTL.fx, "fx", (p) => {
      if (!p.getFXRate) throw new Error(`${p.id}: getFXRate unsupported`);
      return p.getFXRate(base, quote);
    });
  }

  getHistory(symbol: string, field: HistoricalField, range: HistoryRange): Promise<MarketDataResult<HistoricalSeries>> {
    return this.resolve(cacheKey("history", symbol, field, range), MARKET_DATA_TTL.history, "history", (p) => {
      if (!p.getHistory) throw new Error(`${p.id}: getHistory unsupported`);
      return p.getHistory(symbol, field, range);
    });
  }

  getSnapshot(): Promise<MarketDataResult<MarketSnapshot>> {
    return this.resolve(cacheKey("snapshot"), MARKET_DATA_TTL.snapshot, "snapshot", (p) => {
      if (!p.getSnapshot) throw new Error(`${p.id}: getSnapshot unsupported`);
      return p.getSnapshot();
    });
  }

  getBenchmark(benchmarkId: string): Promise<MarketDataResult<Benchmark>> {
    return this.resolve(cacheKey("benchmark", benchmarkId), MARKET_DATA_TTL.benchmark, "benchmark", (p) => {
      if (!p.getBenchmark) throw new Error(`${p.id}: getBenchmark unsupported`);
      return p.getBenchmark(benchmarkId);
    });
  }

  getIssuer(issuerId: string): Promise<MarketDataResult<Issuer>> {
    return this.resolve(cacheKey("issuer", issuerId), MARKET_DATA_TTL.issuer, "issuer", (p) => {
      if (!p.getIssuer) throw new Error(`${p.id}: getIssuer unsupported`);
      return p.getIssuer(issuerId);
    });
  }

  /** Health/availability of every registered provider (for status UI). */
  async getProviderStatuses(): Promise<ProviderStatus[]> {
    return Promise.all(
      this.providers.map(async (p) => {
        const start = Date.now();
        let available = false;
        try {
          available = await p.isAvailable();
        } catch {
          available = false;
        }
        return { id: p.id, name: p.name, available, capabilities: p.capabilities, latencyMs: Date.now() - start };
      }),
    );
  }

  /** Clear the cache (e.g. force-refresh). */
  clearCache(): Promise<void> {
    return this.cache.clear();
  }
}
