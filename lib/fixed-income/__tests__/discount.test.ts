import { describe, expect, it } from "vitest";
import {
  continuousDiscountFactor,
  discountFactor,
  futureValue,
  presentValue,
  spotDiscountFactor,
} from "../discount";
import type { YieldCurve } from "../types";

describe("discount factors", () => {
  it("annual discount factor", () => {
    expect(discountFactor(0.05, 1, 1)).toBeCloseTo(1 / 1.05, 12);
  });

  it("present and future value invert", () => {
    const fv = futureValue(100, 0.05, 3, 1);
    expect(presentValue(fv, 0.05, 3, 1)).toBeCloseTo(100, 10);
  });

  it("continuous discount factor", () => {
    expect(continuousDiscountFactor(0.05, 2)).toBeCloseTo(Math.exp(-0.1), 12);
  });

  it("spot discounting off a flat curve", () => {
    const curve: YieldCurve = {
      points: [
        { tenor: 1, rate: 0.05 },
        { tenor: 10, rate: 0.05 },
      ],
      compounding: "Annual",
    };
    expect(spotDiscountFactor(curve, 2)).toBeCloseTo(1 / Math.pow(1.05, 2), 12);
  });
});
