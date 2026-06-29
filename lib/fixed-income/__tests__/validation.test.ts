import { describe, expect, it } from "vitest";
import {
  BondValidationError,
  assertValidFrequency,
  assertValidPrice,
  assertValidYield,
  createBond,
} from "../validation";
import type { BondInput, Frequency } from "../types";
import { d } from "./fixtures";

const base: BondInput = {
  faceValue: 100,
  couponRate: 0.05,
  issueDate: d("2020-01-15"),
  maturityDate: d("2030-01-15"),
  settlementDate: d("2021-01-15"),
  frequency: "Semiannual",
  dayCount: "ACT/ACT",
};

describe("validation", () => {
  it("accepts a well-formed bond and defaults redemption to face value", () => {
    expect(createBond(base).redemption).toBe(100);
  });

  it("rejects a negative coupon", () => {
    expect(() => createBond({ ...base, couponRate: -0.01 })).toThrow(BondValidationError);
  });

  it("rejects a non-positive face value", () => {
    expect(() => createBond({ ...base, faceValue: 0 })).toThrow(BondValidationError);
  });

  it("rejects inconsistent dates (issue after maturity)", () => {
    expect(() =>
      createBond({ ...base, issueDate: d("2031-01-15") }),
    ).toThrow(BondValidationError);
  });

  it("rejects a matured bond (settlement on/after maturity)", () => {
    expect(() =>
      createBond({ ...base, settlementDate: d("2030-01-15") }),
    ).toThrow(BondValidationError);
  });

  it("rejects an invalid frequency", () => {
    const bad = "Weekly" as unknown as Frequency;
    expect(() => assertValidFrequency(bad)).toThrow(BondValidationError);
  });

  it("rejects invalid yields and prices", () => {
    expect(() => assertValidYield(Number.NaN)).toThrow(BondValidationError);
    expect(() => assertValidYield(-1.5)).toThrow(BondValidationError);
    expect(() => assertValidPrice(-5)).toThrow(BondValidationError);
    expect(() => assertValidPrice(0)).toThrow(BondValidationError);
  });
});
