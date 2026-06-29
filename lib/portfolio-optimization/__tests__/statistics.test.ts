import { describe, expect, it } from "vitest";
import { portfolioReturn, portfolioVariance, portfolioVolatility, sharpeRatio, sortinoRatio } from "../statistics";
import { covFromVolCorr } from "../covariance";

describe("statistics", () => {
  const Sigma = covFromVolCorr([0.1, 0.2], [[1, 0.2], [0.2, 1]]);
  const w = [0.6, 0.4];
  const mu = [0.04, 0.07];
  it("portfolio return = wᵀμ", () => expect(portfolioReturn(w, mu)).toBeCloseTo(0.6 * 0.04 + 0.4 * 0.07, 12));
  it("portfolio variance = wᵀΣw", () => {
    const manual = 0.6 ** 2 * 0.01 + 0.4 ** 2 * 0.04 + 2 * 0.6 * 0.4 * 0.2 * 0.1 * 0.2;
    expect(portfolioVariance(w, Sigma)).toBeCloseTo(manual, 12);
  });
  it("sharpe = excess / vol", () => {
    const vol = portfolioVolatility(w, Sigma);
    expect(sharpeRatio(portfolioReturn(w, mu), vol, 0.02)).toBeCloseTo((portfolioReturn(w, mu) - 0.02) / vol, 12);
  });
  it("sortino uses downside deviation", () => {
    expect(sortinoRatio([0.02, -0.01, 0.03, -0.02], 0)).toBeGreaterThan(0);
  });
});
