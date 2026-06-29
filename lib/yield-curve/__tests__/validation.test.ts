import { describe, expect, it } from "vitest";
import { CurveValidationError, validateCurvePoints } from "../validation";

describe("validation", () => {
  it("accepts a valid increasing curve", () => {
    expect(() => validateCurvePoints([{ tenor: 1, rate: 0.04 }, { tenor: 2, rate: 0.045 }])).not.toThrow();
  });
  it("rejects duplicates", () => {
    expect(() => validateCurvePoints([{ tenor: 2, rate: 0.04 }, { tenor: 2, rate: 0.045 }])).toThrow(CurveValidationError);
  });
  it("rejects negative tenors", () => {
    expect(() => validateCurvePoints([{ tenor: -1, rate: 0.04 }, { tenor: 2, rate: 0.045 }])).toThrow(CurveValidationError);
  });
  it("rejects fewer than 2 points", () => {
    expect(() => validateCurvePoints([{ tenor: 1, rate: 0.04 }])).toThrow(CurveValidationError);
  });
});
