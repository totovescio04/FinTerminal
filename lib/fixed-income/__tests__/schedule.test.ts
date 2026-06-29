import { describe, expect, it } from "vitest";
import { generateSchedule } from "../schedule";
import { canonicalBond, d } from "./fixtures";

const iso = (date: Date) => date.toISOString().slice(0, 10);

describe("schedule generation", () => {
  it("generates 20 semiannual periods for a 10y bond", () => {
    const s = generateSchedule(canonicalBond());
    expect(s.periods).toHaveLength(20);
    expect(s.periodsPerYear).toBe(2);
    expect(iso(s.couponDates[0]!)).toBe("2020-07-15");
    expect(iso(s.couponDates[19]!)).toBe("2030-01-15");
  });

  it("generates 20 quarterly periods for a 5y bond", () => {
    const s = generateSchedule(
      canonicalBond({ maturityDate: d("2025-01-15"), frequency: "Quarterly" }),
    );
    expect(s.periods).toHaveLength(20);
    expect(s.periodsPerYear).toBe(4);
  });

  it("generates 120 monthly periods for a 10y bond", () => {
    const s = generateSchedule(canonicalBond({ frequency: "Monthly" }));
    expect(s.periods).toHaveLength(120);
  });

  it("marks all periods regular for an on-cycle bond", () => {
    const s = generateSchedule(canonicalBond());
    expect(s.periods.every((p) => p.isRegular)).toBe(true);
  });

  it("supports a short first coupon stub", () => {
    const s = generateSchedule(
      canonicalBond({
        issueDate: d("2020-04-15"),
        settlementDate: d("2020-04-15"),
        firstCouponDate: d("2020-07-15"),
      }),
    );
    expect(s.periods[0]!.stub).toBe("short");
    expect(iso(s.periods[0]!.paymentDate)).toBe("2020-07-15");
  });
});
