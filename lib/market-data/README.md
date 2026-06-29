# Market Data Engine (`lib/market-data`)

An independent, source-agnostic data layer. React **never** calls an API — it
calls services; services call the repository; the repository selects a provider
via a fallback strategy and caches the result.

```
components / hooks (TanStack Query)
        │
        ▼
services            QuoteService · YieldCurveService · FXService · BenchmarkService
        │           HistoryService · IssuerService · marketService
        ▼
MarketDataRepository ── cache (CacheStore: Memory today, Redis-ready)
        │
        ▼  FallbackStrategy (Strategy Pattern)
providers (priority order) ── adapters (vendor payload → domain)
   Bloomberg → Refinitiv → MarketAxess → OpenFIGI → Polygon → FMP →
   AlphaVantage → Manual → LocalJson (always-on fallback / offline)
```

## Patterns

- **Provider Pattern** — every source implements `MarketDataProvider` with a
  capability list; it only implements the methods it supports.
- **Repository Pattern** — `MarketDataRepository` is the single entry point;
  it owns caching and provenance (`DataSource`: which provider, when, cached?).
- **Strategy Pattern** — `FallbackStrategy` tries each capable, available
  provider in order and returns the first success; if one fails it falls back to
  the next, ending at the local provider (so it never hard-fails / works offline).
- **Adapter Pattern** — `DataAdapter<TRaw, TDomain>` maps a vendor's raw shape to
  domain types (`polygonBarAdapter`, `fmpQuoteAdapter`, …).
- **Cache** — `CacheStore` interface with per-capability TTLs. `MemoryCacheStore`
  today; `RedisCacheStore` (same interface) for production — swap in one line.

## Adding a new data provider (e.g. Polygon)

1. **Adapter** — map the vendor payload to domain types in `adapters/`:
   ```ts
   export const polygonBarAdapter: DataAdapter<PolygonAgg, OHLCBar> = { adapt: (r) => ({ ... }) };
   ```
2. **Provider** — implement `MarketDataProvider` (extend `BaseMarketDataProvider`),
   declare `capabilities`, gate `isAvailable()` on credentials, and use the
   adapter inside the methods you support.
3. **Register** — add it to `createDefaultProviders()` in `config.ts`, in the
   priority position you want. **That is the only change.** Services, hooks,
   components and every screen keep working unchanged because they depend on the
   repository/services, not the source.

## Offline & real-time

- **Offline**: when `navigator.onLine` is false the repository restricts the
  chain to `local`/`manual`, so the app keeps working on cached/mock data.
- **Real-time**: a streaming provider can push fresh quotes; because everything
  is cache + provenance aware, every consumer (and the financial engine that
  prices off these yields) refreshes automatically.

## TanStack Query

`components/market-data` exposes `MarketDataProvider` (a scoped `QueryClient`)
and hooks (`useBondQuote`, `useYieldCurve`, `useFX`, `useHistoricalPrices`,
`useMarketSnapshot`, …) with `staleTime` so identical requests are de-duplicated
and never re-fetched needlessly.
