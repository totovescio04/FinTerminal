# Risk layer (`lib/risk`)

Pure, framework-free risk math. It **aggregates and models risk over numbers the
financial engine already produced** — it never prices anything itself.

## What comes from where

```
Portfolio positions
   ↓  analyzePosition(pos)            → @/components/portfolio (financial engine)
   ↓  RiskPosition { marketValue, modifiedDuration, convexity, dv01, … }  (engine output)
   ↓  lib/risk:
      aggregateRisk      → MV-weighted duration/convexity, Σ DV01/PVBP, avg yield/coupon, WAL
      exposureBy*        → exposure by issuer/country/currency/sector/rating/coupon type
      maturityBuckets    → 0-1 … 20y+ with count/value/weight/duration
      riskContributions  → per-bond duration/convexity/DV01/MV contribution
      riskHeatmap        → market value by duration × yield
      topRisks           → highest duration/DV01/convexity/exposure/concentration
      parametricVaR      → z(α)·σ_bp·|DV01|·√horizon   (historical & MC also provided)
scenario / stress repricing
   ↓  computeScenario(base, bps)      → @/components/scenario (engine repricing via priceFromYield)
```

## How each metric is computed

- **Aggregates** — market-value-weighted averages of engine per-position numbers
  (`dollarDuration = modifiedDuration × marketValue`; DV01/PVBP summed).
- **Scenario / Stress P&L** — each holding repriced with `computeScenario`
  (exact `priceFromYield`), scaled to face value, summed across the book.
  Stress *shapes* (parallel/steepen/flatten/twist/butterfly) live in `stress.ts`
  and only return a basis-point shift per tenor — the pricing is the engine's.
- **Parametric VaR** — delta-normal: `z(α) · σ_yield(bp) · |DV01(currency)| · √days`,
  using the engine's aggregate DV01. `historicalVaR` (empirical quantile) and
  `monteCarloVaR` (seeded normal) are implemented for the other methods.
- **Exposure / contributions / heatmap** — group/weight engine market values.

## Adding a new risk model

Drop a pure function in `lib/risk` that takes `RiskPosition[]` (or engine
numbers) and returns your metric, export it from `index.ts`, and render it in a
`components/risk` panel. Because inputs are already engine-derived, new models
never duplicate pricing. (e.g. CVaR, key-rate durations, factor VaR.)

## Tests

21 unit tests (aggregate, DV01, exposure, maturity buckets, VaR, stress shapes,
contributions, heatmap, top risks) — all passing.
