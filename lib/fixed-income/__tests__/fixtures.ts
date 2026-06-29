import { createBond } from "../validation";
import type { Bond, BondInput } from "../types";

export const d = (iso: string): Date => new Date(iso);

/** 10y 5% semiannual ACT/ACT bond, settling on the issue/coupon date. */
export function canonicalBond(overrides: Partial<BondInput> = {}): Bond {
  return createBond({
    faceValue: 100,
    couponRate: 0.05,
    issueDate: d("2020-01-15"),
    maturityDate: d("2030-01-15"),
    settlementDate: d("2020-01-15"),
    frequency: "Semiannual",
    dayCount: "ACT/ACT",
    ...overrides,
  });
}
