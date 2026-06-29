import { describe, expect, it } from "vitest";
import { historicalVaR, monteCarloVaR, parametricVaR, VAR_Z } from "../var";

describe("VaR", () => {
  it("parametric matches the delta-normal formula", () => {
    const r = parametricVaR({ dv01Currency: 900, dailyYieldVolBp: 6.5, confidence: 95, horizonDays: 1 });
    expect(r.value).toBeCloseTo(VAR_Z[95]! * 6.5 * 900 * 1, 6);
  });
  it("99% VaR exceeds 95% VaR", () => {
    const v95 = parametricVaR({ dv01Currency: 900, dailyYieldVolBp: 6.5, confidence: 95, horizonDays: 1 }).value;
    const v99 = parametricVaR({ dv01Currency: 900, dailyYieldVolBp: 6.5, confidence: 99, horizonDays: 1 }).value;
    expect(v99).toBeGreaterThan(v95);
  });
  it("scales with the square root of horizon", () => {
    const v1 = parametricVaR({ dv01Currency: 900, dailyYieldVolBp: 6.5, confidence: 95, horizonDays: 1 }).value;
    const v10 = parametricVaR({ dv01Currency: 900, dailyYieldVolBp: 6.5, confidence: 95, horizonDays: 10 }).value;
    expect(v10 / v1).toBeCloseTo(Math.sqrt(10), 6);
  });
  it("historical empirical quantile", () => {
    const pnl = [-100, -50, -20, 10, 30, 60, -200, 5, -10, -75];
    const r = historicalVaR(pnl, 90, 1);
    expect(r.value).toBeGreaterThan(0);
  });
  it("monte carlo is deterministic and positive", () => {
    const a = monteCarloVaR(900, 6.5, 95, 1, 5000, 42);
    const b = monteCarloVaR(900, 6.5, 95, 1, 5000, 42);
    expect(a.value).toBe(b.value);
    expect(a.value).toBeGreaterThan(0);
  });
});
