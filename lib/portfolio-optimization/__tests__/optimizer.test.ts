import { describe, expect, it } from "vitest";
import { optimize, riskParityWeights } from "../optimizer";
import { riskContributions } from "../risk";
import { covFromVolCorr } from "../covariance";
import { buildBounds } from "../constraints";
import { DEFAULT_CONSTRAINTS } from "../types";

describe("optimizer", () => {
  const sig1 = 0.1, sig2 = 0.2, rho = 0.2;
  const Sigma2 = covFromVolCorr([sig1, sig2], [[1, rho], [rho, 1]]);
  const mu2 = [0.04, 0.07];

  it("minimum variance matches the 2-asset closed form", () => {
    const r = optimize({ expectedReturns: mu2, covariance: Sigma2, objective: "minVariance", constraints: DEFAULT_CONSTRAINTS });
    const w1 = (sig2 ** 2 - rho * sig1 * sig2) / (sig1 ** 2 + sig2 ** 2 - 2 * rho * sig1 * sig2);
    expect(r.weights[0]!).toBeCloseTo(w1, 3);
    expect(r.weights.reduce((s, x) => s + x, 0)).toBeCloseTo(1, 6);
  });

  it("max Sharpe is at least the min-variance Sharpe", () => {
    const mv = optimize({ expectedReturns: mu2, covariance: Sigma2, objective: "minVariance", constraints: DEFAULT_CONSTRAINTS });
    const ms = optimize({ expectedReturns: mu2, covariance: Sigma2, objective: "maxSharpe", constraints: DEFAULT_CONSTRAINTS });
    expect(ms.sharpe).toBeGreaterThan(mv.sharpe - 1e-6);
  });

  it("target return is achieved", () => {
    const r = optimize({ expectedReturns: mu2, covariance: Sigma2, objective: "targetReturn", constraints: DEFAULT_CONSTRAINTS, targetReturn: 0.06 });
    expect(r.expectedReturn).toBeCloseTo(0.06, 2);
  });

  it("max diversification ratio is ≥ 1", () => {
    const r = optimize({ expectedReturns: mu2, covariance: Sigma2, objective: "maxDiversification", constraints: DEFAULT_CONSTRAINTS });
    expect(r.diversificationRatio).toBeGreaterThan(1 - 1e-9);
  });

  it("risk parity equalizes risk contributions", () => {
    const Sigma = covFromVolCorr([0.2, 0.1], [[1, 0], [0, 1]]);
    const w = riskParityWeights(Sigma, buildBounds(2, DEFAULT_CONSTRAINTS));
    const rc = riskContributions(w, Sigma);
    expect(rc[0]!).toBeCloseTo(rc[1]!, 4);
  });
});
