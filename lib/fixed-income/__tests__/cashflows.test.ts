import { describe, expect, it } from "vitest";
import { generateCashFlows } from "../cashflows";
import { canonicalBond } from "./fixtures";

describe("cash flows", () => {
  it("produces 20 flows summing to all coupons + principal", () => {
    const cfs = generateCashFlows(canonicalBond());
    expect(cfs).toHaveLength(20);
    const couponSum = cfs.reduce((s, cf) => s + cf.couponAmount, 0);
    expect(couponSum).toBeCloseTo(50, 8); // 20 * 2.5
    const last = cfs[19]!;
    expect(last.principalAmount).toBeCloseTo(100, 8);
    expect(last.totalCashFlow).toBeCloseTo(102.5, 8);
    expect(last.remainingPrincipal).toBe(0);
  });

  it("leaves flows undiscounted when no yield is supplied", () => {
    const cfs = generateCashFlows(canonicalBond());
    expect(cfs.every((cf) => cf.discountFactor === 1)).toBe(true);
  });

  it("discounts monotonically when a yield is supplied", () => {
    const cfs = generateCashFlows(canonicalBond(), { yield: 0.05 });
    for (let i = 1; i < cfs.length; i++) {
      expect(cfs[i]!.discountFactor).toBeLessThan(cfs[i - 1]!.discountFactor);
    }
    const pvSum = cfs.reduce((s, cf) => s + cf.presentValue, 0);
    expect(pvSum).toBeCloseTo(100, 8); // priced at par
  });
});
