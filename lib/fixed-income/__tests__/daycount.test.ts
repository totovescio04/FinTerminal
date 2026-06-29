import { describe, expect, it } from "vitest";
import { dayCount, yearFraction } from "../daycount";
import { d } from "./fixtures";

describe("day count conventions", () => {
  it("30/360 US over a full year = 360 days, fraction 1", () => {
    const r = dayCount(d("2020-01-01"), d("2021-01-01"), "30/360");
    expect(r.days).toBe(360);
    expect(r.periodDays).toBe(360);
    expect(r.fraction).toBeCloseTo(1, 12);
  });

  it("30/360 US adjusts day 31 -> 30", () => {
    const r = dayCount(d("2020-01-31"), d("2020-04-30"), "30/360");
    expect(r.days).toBe(90);
    expect(r.fraction).toBeCloseTo(0.25, 12);
  });

  it("30E/360 adjusts both day 31 -> 30", () => {
    const r = dayCount(d("2020-01-30"), d("2020-07-30"), "30E/360");
    expect(r.days).toBe(180);
    expect(r.fraction).toBeCloseTo(0.5, 12);
  });

  it("ACT/365 uses a 365 denominator over a leap year", () => {
    const r = dayCount(d("2020-01-01"), d("2021-01-01"), "ACT/365");
    expect(r.days).toBe(366);
    expect(r.fraction).toBeCloseTo(366 / 365, 12);
  });

  it("ACT/360 uses a 360 denominator", () => {
    const r = dayCount(d("2020-01-01"), d("2021-01-01"), "ACT/360");
    expect(r.days).toBe(366);
    expect(r.fraction).toBeCloseTo(366 / 360, 12);
  });

  it("ACT/ACT ISDA over one full leap year = 1.0", () => {
    expect(yearFraction(d("2020-01-01"), d("2021-01-01"), "ACT/ACT")).toBeCloseTo(1, 12);
  });

  it("ACT/ACT ISDA over one full non-leap year = 1.0", () => {
    expect(yearFraction(d("2021-01-01"), d("2022-01-01"), "ACT/ACT")).toBeCloseTo(1, 12);
  });

  it("ACT/ACT ISDA splits a cross-year interval by year length", () => {
    // 2019 (365) portion + 2020 (366) portion.
    const f = yearFraction(d("2019-07-01"), d("2020-07-01"), "ACT/ACT");
    const expected = 184 / 365 + 182 / 366; // Jul1->Jan1 = 184 days, Jan1->Jul1(2020) = 182 days
    expect(f).toBeCloseTo(expected, 12);
  });
});
