# Bond Comparator (`components/comparator`)

Compare up to 4 bonds side by side. **No math lives here** — every metric is
read from the existing engines.

## How it consumes the engines

```
BondSelector (Database / Watchlist / Portfolio)
        ↓  ComparatorBond { form: BondFormValues, … }
useBondAnalytics(form, "yield")  ×4 slots   →  @/components/fixed-income (engine)
        ↓  BondAnalyticsOk (pricing, durations, risk, cashFlows, …)
ComparisonResult  +  computeScenario(...)   →  @/components/scenario
                  +  ustYield(t) = zeroRate(USTcurve, t)  →  @/lib/yield-curve
        ↓
metrics.ts (descriptors) → ComparisonTable · Summary · Rankings · Spreads · Charts · Export
```

- **Pricing / duration / convexity / DV01 / PVBP / cash flows** → `useBondAnalytics`
  (financial engine).
- **Scenarios (+/− bp for all bonds at once)** → `computeScenario` (scenario engine).
- **Treasury spread** → UST curve bootstrapped with the **yield-curve engine**;
  spread = bond yield − `zeroRate(UST, remainingYears)`.
- **WAL** and the **inter-bond spread** are reshapes of engine outputs, not new
  formulas.

## Adding a new metric

Append one descriptor to `METRICS` in `metrics.ts`:

```ts
{ key: "myMetric", label: "My Metric", display: (r) => fmt(r.analytics.…),
  highlight: "high", rank: (r) => r.analytics.… }
```

The comparison table, CSV/Excel/PDF export and (if you add it to `RANKINGS`) the
ranking table all pick it up automatically. Highlighting is driven by
`highlight` + `rank`; text metrics omit them.

## Components

`BondComparator` (orchestrator) · `BondSelector` · `ComparisonTable` ·
`MetricComparison` · `ComparisonSummary` · `ComparisonCharts` ·
`CashFlowComparison` · `SpreadAnalysis` · `RankingTable`. Export to CSV/Excel/PDF
via `export.ts`.
