import { describe, expect, it } from "vitest";
import { applyScenario, buildCurve, curveTable } from "../curve";
import { zeroRate } from "../spot";

describe("curve", () => {
  const base = buildCurve([
    { tenor: 2, rate: 0.042 },
    { tenor: 5, rate: 0.045 },
    { tenor: 10, rate: 0.046 },
    { tenor: 30, rate: 0.048 },
  ]);

  it("builds a sorted, validated curve", () => {
    const c = buildCurve([
      { tenor: 10, rate: 0.046 },
      { tenor: 2, rate: 0.042 },
    ]);
    expect(c.points[0]!.tenor).toBe(2);
  });

  it("curveTable has decreasing discount factors", () => {
    const rows = curveTable(base, [2, 5, 10, 30]);
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i]!.discountFactor).toBeLessThan(rows[i - 1]!.discountFactor);
    }
  });

  it("parallel shift moves every node by the shift", () => {
    const shifted = applyScenario(base, { type: "parallel", bps: 50 });
    for (const t of [2, 5, 10, 30]) {
      expect(zeroRate(shifted, t)).toBeCloseTo(zeroRate(base, t) + 0.005, 12);
    }
  });

  it("steepening raises the long end and lowers the short end", () => {
    const steep = applyScenario(base, { type: "steepen", bps: 50 });
    expect(zeroRate(steep, 30)).toBeGreaterThan(zeroRate(base, 30));
    expect(zeroRate(steep, 2)).toBeLessThan(zeroRate(base, 2));
  });
});
