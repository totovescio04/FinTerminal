import { describe, expect, it } from "vitest";
import { dirtyPrice } from "../pricing";
import { modifiedDuration } from "../duration";
import { dv01, parallelShift, priceChange, pvbp, riskMetrics } from "../risk";
import { canonicalBond } from "./fixtures";

describe("risk metrics", () => {
  const bond = canonicalBond();
  const y = 0.05;

  it("DV01 = modified duration * dirty price * 1bp", () => {
    expect(dv01(bond, y)).toBeCloseTo(modifiedDuration(bond, y) * dirtyPrice(bond, y) * 1e-4, 10);
  });

  it("DV01 ~ PVBP", () => {
    expect(dv01(bond, y)).toBeCloseTo(pvbp(bond, y), 4);
  });

  it("parallel shift reprices exactly", () => {
    const s = parallelShift(bond, y, 50);
    expect(s.priceAfter).toBeCloseTo(dirtyPrice(bond, y + 0.005), 10);
    expect(s.priceChange).toBeLessThan(0); // higher yield -> lower price
  });

  it("duration+convexity approximation is close to the exact reprice", () => {
    const r = priceChange(bond, y, 0.005);
    expect(Math.abs(r.exact - r.approximate)).toBeLessThan(0.02);
  });

  it("riskMetrics bundle is internally consistent", () => {
    const r = riskMetrics(bond, y);
    expect(r.modifiedDuration).toBeLessThan(r.macaulayDuration);
    expect(r.convexity).toBeGreaterThan(0);
  });
});
