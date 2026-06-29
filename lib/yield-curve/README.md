# Yield Curve Engine (`lib/yield-curve`)

Pure-TypeScript curve engine: bootstrap, interpolation, spot/forward/discount,
analytics and scenarios. No external libraries, no React — consumable by Bond
Pricing, Portfolio and the Market Data Engine.

```ts
import { bootstrap, discountFactor, forwardRate, presentValue } from "@/lib/yield-curve";
const curve = bootstrap([{ tenor: 1, parRate: 0.045 }, { tenor: 5, parRate: 0.05 }]);
const price = presentValue([1,2,3,4,5], [5,5,5,5,105], curve); // value a bond off the curve
```

## Algorithms

- **Bootstrap** (`bootstrap.ts`) — from par yields, solving one tenor at a time:
  money-market points `DF(T)=1/(1+c·T)`; coupon points
  `DF(T)=(1 − c·Σ_{i<T} DF(i))/(1+c)`; then `z(T)=DF(T)^(-1/T)−1`.
- **Spot/Zero** (`spot.ts`) — `zeroRate(curve,t)` via the chosen interpolation.
- **Discount** (`discount.ts`) — `DF(t)=(1+z)^(-t)` (annual) or `e^(-z·t)`
  (continuous); `presentValue(times, amounts, curve)` for instrument pricing.
- **Forward** (`forward.ts`) — `f=(DF(t₁)/DF(t₂))^{1/(t₂−t₁)}−1`; named forwards
  like `1Y1Y`, `5Y5Y`.
- **Interpolation** (`interpolation.ts`) — linear, log-linear, natural cubic
  spline, flat-forward (linear in z·t).
- **Analytics** (`analytics.ts`) — slope 2s10s, steepness 2s30s, curvature,
  spreads 2s10s / 5s30s, avg/max/min yield.
- **Scenarios** (`curve.ts`) — parallel, steepen, flatten, twist, butterfly;
  return a new curve so spot/forward/discount/pricing all recompute.
- **Validation** (`validation.ts`) — increasing tenors, no duplicates/negatives,
  no missing data.

## Using it from other modules (Bond Pricing & Portfolio)

Map an instrument's cash flows to `{ times, amounts }` and call
`presentValue(times, amounts, curve)`, or discount individual flows with
`discountFactor(curve, t)`. A portfolio prices every position against the same
curve; a scenario curve reprices the whole book. The curve nodes can come from
the **Market Data Engine** (`yieldCurveService.getCurve(...)`) — feed those
`{tenor, rate}` points into `buildCurve(...)` (or bootstrap par quotes) and the
rest of the engine works unchanged.

## Tests

23 unit tests (bootstrap, interpolation, forward, discount, curve, analytics,
validation) — all passing.
