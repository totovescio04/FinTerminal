import { describe, expect, it } from "vitest";
import { dirtyPrice } from "../pricing";
import { convexity, effectiveConvexity } from "../convexity";
import { canonicalBond } from "./fixtures";

describe("convexity", () => {
  const bond = canonicalBond();
  const y = 0.05;

  it("is positive for an option-free bond", () => {
    expect(convexity(bond, y)).toBeGreaterThan(0);
  });

  it("matches a finite-difference second derivative", () => {
    const h = 1e-4;
    const p0 = dirtyPrice(bond, y);
    const fd = (dirtyPrice(bond, y + h) + dirtyPrice(bond, y - h) - 2 * p0) / (p0 * h * h);
    const analytic = convexity(bond, y);
    expect(Math.abs(analytic - fd) / analytic).toBeLessThan(1e-4);
  });

  it("analytic ~ effective convexity", () => {
    const a = convexity(bond, y);
    const e = effectiveConvexity(bond, y);
    expect(Math.abs(a - e) / a).toBeLessThan(1e-3);
  });
});
