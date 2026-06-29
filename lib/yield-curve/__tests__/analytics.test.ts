import { describe, expect, it } from "vitest";
import { buildCurve } from "../curve";
import { computeAnalytics } from "../analytics";
import { zeroRate } from "../spot";

describe("analytics", () => {
  const curve = buildCurve([
    { tenor: 2, rate: 0.042 },
    { tenor: 5, rate: 0.045 },
    { tenor: 10, rate: 0.05 },
    { tenor: 30, rate: 0.052 },
  ]);

  it("computes slope, spreads and curvature", () => {
    const a = computeAnalytics(curve);
    expect(a.slope2s10s).toBeCloseTo(zeroRate(curve, 10) - zeroRate(curve, 2), 12);
    expect(a.spread5s30s).toBeCloseTo(zeroRate(curve, 30) - zeroRate(curve, 5), 12);
    expect(a.curvature).toBeCloseTo(2 * zeroRate(curve, 5) - zeroRate(curve, 2) - zeroRate(curve, 10), 12);
  });

  it("reports yield stats", () => {
    const a = computeAnalytics(curve);
    expect(a.maxYield).toBeCloseTo(0.052, 12);
    expect(a.minYield).toBeCloseTo(0.042, 12);
  });
});
