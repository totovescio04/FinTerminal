import { describe, expect, it } from "vitest";
import { applyMaxAssets, buildBounds } from "../constraints";
import { projectToSimplexBox } from "../solver";
import { DEFAULT_CONSTRAINTS } from "../types";

describe("constraints", () => {
  it("long-only bounds", () => {
    const b = buildBounds(3, { ...DEFAULT_CONSTRAINTS, maxWeight: 0.5, cash: 0.1 });
    expect(b.l[0]).toBe(0);
    expect(b.u[0]).toBe(0.5);
    expect(b.total).toBeCloseTo(0.9, 12);
  });
  it("projection sums to total and respects bounds", () => {
    const l = [0, 0, 0];
    const u = [0.5, 0.5, 0.5];
    const w = projectToSimplexBox([0.8, 0.1, -0.2], l, u, 1);
    expect(w.reduce((s, x) => s + x, 0)).toBeCloseTo(1, 8);
    expect(Math.max(...w)).toBeLessThan(0.5 + 1e-9);
    expect(Math.min(...w)).toBeGreaterThan(-1e-9);
  });
  it("maxAssets keeps the largest weights and renormalizes", () => {
    const trimmed = applyMaxAssets([0.5, 0.3, 0.15, 0.05], 2, 1);
    expect(trimmed.filter((w) => w > 0)).toHaveLength(2);
    expect(trimmed.reduce((s, x) => s + x, 0)).toBeCloseTo(1, 9);
  });
});
