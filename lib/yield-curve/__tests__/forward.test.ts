import { describe, expect, it } from "vitest";
import { buildCurve } from "../curve";
import { forwardRate, namedForward } from "../forward";

describe("forward rates", () => {
  it("a flat curve has forwards equal to the spot rate", () => {
    const curve = buildCurve([
      { tenor: 1, rate: 0.05 },
      { tenor: 10, rate: 0.05 },
    ]);
    expect(forwardRate(curve, 1, 2)).toBeCloseTo(0.05, 9);
    expect(forwardRate(curve, 2, 5)).toBeCloseTo(0.05, 9);
  });

  it("satisfies the forward identity", () => {
    const curve = buildCurve([
      { tenor: 1, rate: 0.04 },
      { tenor: 2, rate: 0.045 },
      { tenor: 5, rate: 0.05 },
    ]);
    const f = forwardRate(curve, 1, 2);
    const z1 = 0.04;
    const z2 = 0.045;
    expect(Math.pow(1 + z2, 2)).toBeCloseTo(Math.pow(1 + z1, 1) * Math.pow(1 + f, 1), 9);
  });

  it("named forward 1Y1Y equals forward(1,2)", () => {
    const curve = buildCurve([
      { tenor: 1, rate: 0.04 },
      { tenor: 2, rate: 0.045 },
      { tenor: 5, rate: 0.05 },
    ]);
    expect(namedForward(curve, "1Y1Y")).toBeCloseTo(forwardRate(curve, 1, 2), 12);
    expect(namedForward(curve, "5Y5Y")).toBeCloseTo(forwardRate(curve, 5, 10), 12);
  });
});
