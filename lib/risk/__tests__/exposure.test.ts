import { describe, expect, it } from "vitest";
import { exposureByCurrency, exposureByIssuer, maturityBuckets } from "../exposure";
import { POSITIONS } from "./fixtures";

describe("exposure", () => {
  it("by currency weights sum to 1", () => {
    const ex = exposureByCurrency(POSITIONS);
    expect(ex.reduce((s, e) => s + e.weight, 0)).toBeCloseTo(1, 9);
    expect(ex.find((e) => e.key === "USD")!.weight).toBeCloseTo(0.75, 9);
  });
  it("by issuer aggregates duplicates", () => {
    const ex = exposureByIssuer(POSITIONS);
    expect(ex.find((e) => e.key === "Issuer A")!.value).toBe(2_000_000);
  });
  it("maturity buckets place positions correctly", () => {
    const b = maturityBuckets(POSITIONS);
    expect(b.find((x) => x.label === "1–3y")!.count).toBe(1);
    expect(b.find((x) => x.label === "5–7y")!.count).toBe(1);
    expect(b.find((x) => x.label === "10–20y")!.count).toBe(1);
    const total = b.reduce((s, x) => s + x.value, 0);
    expect(total).toBe(4_000_000);
  });
});
