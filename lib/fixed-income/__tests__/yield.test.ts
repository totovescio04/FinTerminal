import { describe, expect, it } from "vitest";
import { cleanPrice } from "../pricing";
import { yieldFromPrice } from "../yield";
import { canonicalBond } from "./fixtures";

describe("yield solver", () => {
  it("recovers the coupon yield from a par price", () => {
    const r = yieldFromPrice(canonicalBond(), 100);
    expect(r.yield).toBeCloseTo(0.05, 8);
    expect(r.converged).toBe(true);
  });

  it("round-trips price -> yield -> price for several yields", () => {
    const bond = canonicalBond();
    for (const y of [0.01, 0.03, 0.045, 0.07, 0.1]) {
      const p = cleanPrice(bond, y);
      const solved = yieldFromPrice(bond, p).yield;
      expect(solved).toBeCloseTo(y, 8);
    }
  });

  it("uses Newton-Raphson as the primary method", () => {
    expect(yieldFromPrice(canonicalBond(), 95).method).toBe("newton-raphson");
  });
});
