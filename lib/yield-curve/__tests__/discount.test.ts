import { describe, expect, it } from "vitest";
import { discountFromZero, zeroFromDiscount } from "../utils";
import { buildCurve } from "../curve";
import { presentValue } from "../discount";

describe("discount factors", () => {
  it("zero <-> discount round trip (annual & continuous)", () => {
    for (const comp of ["annual", "continuous"] as const) {
      const df = discountFromZero(0.05, 3, comp);
      expect(zeroFromDiscount(df, 3, comp)).toBeCloseTo(0.05, 12);
    }
  });

  it("present value of cash flows on a flat 5% curve", () => {
    const curve = buildCurve([
      { tenor: 1, rate: 0.05 },
      { tenor: 2, rate: 0.05 },
    ]);
    const pv = presentValue([1, 2], [5, 105], curve);
    expect(pv).toBeCloseTo(5 / 1.05 + 105 / 1.05 ** 2, 9);
  });
});
