import { describe, expect, it } from "vitest";
import { portfolioMetrics, positionMarketValue } from "../portfolio";
import { dirtyPrice } from "../pricing";
import type { PortfolioPosition } from "../types";
import { canonicalBond, d } from "./fixtures";

describe("portfolio", () => {
  const a = canonicalBond();
  const b = canonicalBond({ couponRate: 0.04, maturityDate: d("2027-01-15") });

  const positions: PortfolioPosition[] = [
    { bond: a, yield: 0.05, quantity: 1000 },
    { bond: b, yield: 0.045, quantity: 500 },
  ];

  it("position market value scales price by face and quantity", () => {
    const mv = positionMarketValue(positions[0]!);
    expect(mv).toBeCloseTo((dirtyPrice(a, 0.05) / 100) * 100 * 1000, 6);
  });

  it("aggregates market value and face value", () => {
    const m = portfolioMetrics(positions);
    const expectedMV =
      positionMarketValue(positions[0]!) + positionMarketValue(positions[1]!);
    expect(m.marketValue).toBeCloseTo(expectedMV, 6);
    expect(m.totalFaceValue).toBeCloseTo(100 * 1000 + 100 * 500, 6);
  });

  it("weights coupon by face value", () => {
    const m = portfolioMetrics(positions);
    const expectedCoupon = (0.05 * 100000 + 0.04 * 50000) / 150000;
    expect(m.averageCoupon).toBeCloseTo(expectedCoupon, 10);
  });

  it("produces positive aggregate risk measures", () => {
    const m = portfolioMetrics(positions);
    expect(m.modifiedDuration).toBeGreaterThan(0);
    expect(m.convexity).toBeGreaterThan(0);
    expect(m.dv01).toBeGreaterThan(0);
  });
});
