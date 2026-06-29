import { describe, expect, it } from "vitest";
import { aggregateRisk } from "../aggregate";
import { POSITIONS } from "./fixtures";

describe("aggregate risk", () => {
  const a = aggregateRisk(POSITIONS);
  it("market value sums", () => expect(a.marketValue).toBe(4_000_000));
  it("MV-weighted modified duration", () => expect(a.modifiedDuration).toBeCloseTo(6, 9));
  it("DV01 and PVBP sum", () => {
    expect(a.dv01).toBe(900);
    expect(a.pvbp).toBe(900);
  });
  it("dollar duration = modified × MV", () => expect(a.dollarDuration).toBeCloseTo(6 * 4_000_000, 6));
  it("weighted yield", () => expect(a.averageYield).toBeCloseTo((1e6 * 0.05 + 2e6 * 0.06 + 1e6 * 0.13) / 4e6, 9));
});
