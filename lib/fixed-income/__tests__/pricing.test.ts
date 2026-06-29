import { describe, expect, it } from "vitest";
import { cleanPrice, dirtyPrice, priceFromYield } from "../pricing";
import { canonicalBond, d } from "./fixtures";

describe("pricing", () => {
  it("prices at par when yield equals coupon on a coupon date", () => {
    expect(cleanPrice(canonicalBond(), 0.05)).toBeCloseTo(100, 8);
  });

  it("prices at a discount when yield > coupon", () => {
    expect(cleanPrice(canonicalBond(), 0.06)).toBeLessThan(100);
  });

  it("prices at a premium when yield < coupon", () => {
    expect(cleanPrice(canonicalBond(), 0.04)).toBeGreaterThan(100);
  });

  it("prices a zero-coupon bond as a pure discount factor", () => {
    const zero = canonicalBond({
      couponRate: 0,
      frequency: "Annual",
      maturityDate: d("2025-01-15"),
    });
    // 100 / 1.05^5
    expect(dirtyPrice(zero, 0.05)).toBeCloseTo(100 / Math.pow(1.05, 5), 8);
  });

  it("dirty = clean + accrued", () => {
    const bond = canonicalBond({ settlementDate: d("2020-04-15") });
    const r = priceFromYield(bond, 0.05);
    expect(r.dirtyPrice).toBeCloseTo(r.cleanPrice + r.accruedInterest, 10);
  });
});
