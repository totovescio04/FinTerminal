# lib/fixed-income — Fixed Income Engine

A pure-TypeScript bond valuation engine. **No React, no I/O, no global state** —
functions in, numbers out. Every component of FinTerminal consumes analytics
from here; no financial formula lives in the UI layer.

```ts
import {
  createBond,
  priceFromYield,
  yieldFromPrice,
  macaulayDuration,
  modifiedDuration,
  convexity,
  dv01,
  generateCashFlows,
  generateSchedule,
} from "@/lib/fixed-income";
```

## Module map

| File                 | Responsibility                                                        |
| -------------------- | -------------------------------------------------------------------- |
| `types.ts`           | All domain interfaces (`Bond`, `CashFlow`, `RiskMetrics`, …).         |
| `constants.ts`       | Tolerances, basis point, frequency maps.                             |
| `utils.ts`           | UTC date math, rate/frequency conversion, rounding, interpolation.   |
| `daycount.ts`        | ACT/ACT (ISDA), 30/360 US, 30E/360, ACT/365, ACT/360.                |
| `schedule.ts`        | Coupon schedule generation + short/long stubs; current-period logic. |
| `cashflows.ts`       | Cash-flow generation (optionally discounted).                        |
| `accruedInterest.ts` | Accrued interest at settlement.                                      |
| `discount.ts`        | Discount factors, present/future value, spot-curve discounting.      |
| `pricing.ts`         | `priceFromYield`, `dirtyPrice`, `cleanPrice` — flow-by-flow.         |
| `yield.ts`           | YTM solver: Newton-Raphson with bisection fallback.                  |
| `duration.ts`        | Macaulay, modified, dollar, effective duration.                     |
| `convexity.ts`       | Analytic and effective convexity.                                   |
| `risk.ts`            | DV01, PVBP, parallel shift, price change, risk bundle.              |
| `portfolio.ts`       | Position market value + portfolio aggregation.                      |
| `validation.ts`      | Input validation + `createBond` normalization.                      |
| `index.ts`           | Public API surface.                                                 |

## Conventions

- **Prices** are quoted per 100 of face value (clean/dirty/accrued).
- **Yields** are decimals, compounded at the coupon frequency.
- **Discounting** uses the street/ISMA method: cash flow `k` is discounted by
  `(1 + y/m)^-(k-1+w)`, where `w` is the unexpired fraction of the current
  coupon period — so accrued interest and price stay mutually consistent.
- All dates are handled in **UTC** to avoid timezone drift.

## Tests

```bash
npm test        # vitest run  (lib/**/*.test.ts)
```

53 tests cover day count, schedule, cash flows, accrued interest, pricing,
yield round-tripping, duration, convexity, DV01/PVBP and validation, with
analytic results cross-checked against finite-difference repricing.
