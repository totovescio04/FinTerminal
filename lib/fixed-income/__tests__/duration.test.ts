import { describe, expect, it } from "vitest";
import { dirtyPrice } from "../pricing";
import {
  durationMetrics,
  effectiveDuration,
  macaulayDuration,
  modifiedDuration,
} from "../duration";
import { canonicalBond } from "./fixtures";

describe("duration", () => {
  const bond = canonicalBond();
  const y = 0.05;

  it("modified = macaulay / (1 + y/m)", () => {
    const mac = macaulayDuration(bond, y);
    const mod = modifiedDuration(bond, y);
    expect(mod).toBeCloseTo(mac / (1 + y / 2), 10);
  });

  it("modified duration matches a finite-difference price sensitivity", () => {
    const h = 1e-5;
    const p0 = dirtyPrice(bond, y);
    const fd = -(dirtyPrice(bond, y + h) - dirtyPrice(bond, y - h)) / (2 * h) / p0;
    expect(modifiedDuration(bond, y)).toBeCloseTo(fd, 6);
  });

  it("effective duration ~ modified duration", () => {
    expect(effectiveDuration(bond, y)).toBeCloseTo(modifiedDuration(bond, y), 4);
  });

  it("durationMetrics bundles consistent values", () => {
    const m = durationMetrics(bond, y);
    expect(m.macaulay).toBeGreaterThan(m.modified);
    expect(m.dollar).toBeCloseTo(m.modified * dirtyPrice(bond, y), 8);
  });
});
