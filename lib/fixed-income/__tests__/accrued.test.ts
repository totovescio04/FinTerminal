import { describe, expect, it } from "vitest";
import { accruedInterest } from "../accruedInterest";
import { canonicalBond, d } from "./fixtures";

describe("accrued interest", () => {
  it("is zero on a coupon/issue date", () => {
    expect(accruedInterest(canonicalBond())).toBeCloseTo(0, 10);
  });

  it("is half a coupon at the period midpoint (ACT/ACT)", () => {
    // Period 2020-01-15 -> 2020-07-15 is 182 days; settling at 91 days = 50%.
    const bond = canonicalBond({ settlementDate: d("2020-04-15") });
    expect(accruedInterest(bond)).toBeCloseTo(1.25, 8); // 2.5 * 0.5
  });
});
