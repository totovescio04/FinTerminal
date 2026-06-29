import { describe, expect, it } from "vitest";
import { stressShiftBps } from "../stress";

describe("stress shapes", () => {
  it("parallel is constant across tenors", () => {
    const s = { id: "p", label: "p", type: "parallel" as const, magnitudeBps: 150 };
    expect(stressShiftBps(s, 1)).toBe(150);
    expect(stressShiftBps(s, 30)).toBe(150);
  });
  it("steepener raises the long end vs the short end", () => {
    const s = { id: "s", label: "s", type: "steepen" as const, magnitudeBps: 50 };
    expect(stressShiftBps(s, 20)).toBeGreaterThan(stressShiftBps(s, 2));
  });
  it("flattener is the inverse of steepener", () => {
    const st = { id: "s", label: "s", type: "steepen" as const, magnitudeBps: 50 };
    const fl = { id: "f", label: "f", type: "flatten" as const, magnitudeBps: 50 };
    expect(stressShiftBps(fl, 20)).toBeCloseTo(-stressShiftBps(st, 20), 9);
  });
  it("butterfly lowers the belly relative to the wings", () => {
    const s = { id: "b", label: "b", type: "butterfly" as const, magnitudeBps: 50 };
    expect(stressShiftBps(s, 10)).toBeLessThan(stressShiftBps(s, 0));
  });
});
