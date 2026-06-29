# components/cash-flow — Cash Flow Viewer + Visual Analytics

Second functional module. Fully reactive; **all numbers come from the engine**
(`@/lib/fixed-income`). This folder contains no financial formulas — only
reshaping of engine output into table rows and chart series.

## Data flow

```
shared bond store (bond-store.ts, seeded from calculator defaults)
   ↓  BondForm (reused from components/fixed-income)
   ↓  useBondAnalytics(values, mode)         ← single call to the engine
   ↓  BondAnalyticsOk { bond, pricing, durations, risk, cashFlows, ... }
   ↓  analytics-series.ts  (pure reshapers)
   ↓  KPI bar · 6 charts · TanStack table     ← re-render in real time
```

## How each chart obtains its data (engine functions used)

| Section            | Source                                                              |
| ------------------ | ------------------------------------------------------------------- |
| Cash Flow Table    | `generateCashFlows(bond, { yield })` → rows (sort/filter/export)    |
| Price vs Yield     | `priceFromYield(bond, y).cleanPrice` sampled across yield ±5%       |
| Timeline           | `cashFlows[].couponAmount / principalAmount / totalCashFlow`        |
| PV Distribution    | `cashFlows[].presentValue` + weight = PV / Σ PV                     |
| Duration           | `cashFlows[].presentValue & yearFraction`; line at `durations.macaulay` |
| Convexity          | `priceFromYield` curve vs. tangent (slope = `-durations.modified·dirty`) |
| Discount Factors   | `cashFlows[].discountFactor vs yearFraction`                        |
| KPI bar            | aggregates of `cashFlows` + `pricing.presentValue` + `bond.redemption` |

Two display-only aggregates are computed here (not engine finance): the PV
*weight* (ratio) and *weighted average life* (a time-weighted average of
principal). Both are reshapes of engine outputs, not re-derived pricing/risk.

## Files

- `analytics-series.ts` — pure series builders from engine output
- `cash-flow-fields.ts` — column descriptors (single source for table + export)
- `export.ts` — CSV (full), Excel (.xls HTML, full), PDF (print pipeline)
- `bond-store.ts` — shared bond state (`useSyncExternalStore`, no deps)
- `chart-{container,toolbar,legend,tooltip}.tsx` — reusable chart shells
- `{price-yield,timeline,present-value,duration,convexity,discount-factor}-chart.tsx`
- `cash-flow-{table,row,summary,kpi-bar}.tsx`, `export-menu.tsx`
- `cash-flow-viewer.tsx` — orchestrator (route: `/cash-flows`)
