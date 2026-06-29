import { describe, expect, it } from "vitest";
import { efficientFrontier, monteCarlo } from "../frontier";
import { covFromVolCorr } from "../covariance";
import { buildBounds } from "../constraints";
import { DEFAULT_CONSTRAINTS } from "../types";

describe("efficient frontier + monte carlo", () => {
  const Sigma = covFromVolCorr([0.1, 0.15, 0.2], [
    [1, 0.2, 0.1],
    [0.2, 1, 0.3],
    [0.1, 0.3, 1],
  ]);
  const mu = [0.03, 0.05, 0.08];
  const bounds = buildBounds(3, DEFAULT_CONSTRAINTS);

  it("frontier weights sum to 1 and volatility is non-decreasing in return", () => {
    const f = efficientFrontier(mu, Sigma, bounds, 25);
    for (const p of f) expect(p.weights.reduce((s, x) => s + x, 0)).toBeCloseTo(1, 6);
    for (let i = 1; i < f.length; i++) expect(f[i]!.volatility).toBeGreaterThan(f[i - 1]!.volatility - 1e-6);
  });

  it("monte carlo is deterministic and finds a lower-variance point than average", () => {
    const a = monteCarlo(mu, Sigma, bounds, 4000, 7);
    const b = monteCarlo(mu, Sigma, bounds, 4000, 7);
    expect(a.minVariance.volatility).toBeCloseTo(b.minVariance.volatility, 12);
    const avgVol = a.portfolios.reduce((s, p) => s + p.volatility, 0) / a.portfolios.length;
    expect(a.minVariance.volatility).toBeLessThan(avgVol);
    const maxSampleSharpe = Math.max(...a.portfolios.map((p) => p.sharpe));
    expect(a.maxSharpe.sharpe).toBeGreaterThan(maxSampleSharpe - 1e-9);
  });
});
