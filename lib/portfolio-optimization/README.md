# Portfolio Optimization Engine (`lib/portfolio-optimization`)

Asset-class-agnostic mean-variance optimization. Pure TypeScript, no external
libraries. It works on an **expected-returns vector μ + covariance matrix Σ +
constraints** — so the same engine optimizes bonds today and equities tomorrow.

```ts
import { optimize, efficientFrontier, monteCarlo } from "@/lib/portfolio-optimization";
const r = optimize({ expectedReturns: mu, covariance: Sigma, objective: "maxSharpe",
                     constraints: { minWeight: 0, maxWeight: 0.4, allowShort: false, cash: 0 } });
```

## Algorithms

- **Solver** (`solver.ts`) — constrained QP by **projected gradient descent**.
  The feasible set is the box [l, u] ∩ budget hyperplane (Σw = total); projection
  is a 1-D bisection (water-filling). Step = 1 / spectral-norm(Q).
- **Minimum Variance** — minimize wᵀΣw.
- **Target Return** — minimize wᵀΣw + γ(wᵀμ − target)² (soft equality).
- **Maximum Sharpe** — scan the efficient frontier, take the max-Sharpe point.
- **Target Risk** — frontier point with the highest return at vol ≤ target.
- **Maximum Diversification** — w ∝ Σ⁻¹σ, projected onto the constraints.
- **Risk Parity** — equal risk contribution via the convergent multiplicative
  update wᵢ ← wᵢ·√(target / rcᵢ).
- **Efficient Frontier** (`frontier.ts`) — min-variance portfolios across a grid
  of target returns, ordered by volatility.
- **Monte Carlo** — thousands of seeded random feasible portfolios; returns the
  cloud + the min-variance and max-Sharpe samples.
- **Statistics** — return, variance, volatility, Sharpe, Sortino, Treynor,
  Information ratio (Calmar scaffolded); risk decomposition + diversification ratio.
- **Covariance** — sample covariance from a returns matrix, correlation, and
  `covFromVolCorr(vols, corr)` (used by the FI risk model).

## Constraints

`minWeight`, `maxWeight`, `allowShort`, `cash` (risky weights sum to 1 − cash)
and `maxAssets` (keep the largest k, renormalize).

## Adding a new optimizer

Add a function returning weights for `Bounds`, wire a `case` into `optimize()`'s
switch, and add the label to the UI's objective list. Reuse `solveQP` /
`minVarianceWeights` for quadratic objectives.

## Reusing it for equities

Nothing here is fixed-income specific. Feed equity expected returns and a
covariance matrix estimated from price-return series (`covarianceMatrix`,
`expectedReturnsFromSeries`) and the same optimizers, frontier and Monte-Carlo
apply unchanged.

## Tests

17 unit tests (covariance/correlation, statistics, constraints, optimizer with a
2-asset closed-form check, frontier, Monte Carlo) — all passing.
