/**
 * @file instrument.ts
 * Map Bond Database records and Portfolio positions into the unified
 * {@link ComparatorBond}, and a UST reference curve (built with the Yield Curve
 * Engine) for Treasury-spread calculation.
 */

import { recordToForm } from "@/components/bonds";
import type { BondRecord } from "@/lib/data/bond-model";
import type { Position } from "@/components/portfolio";
import { bootstrap, zeroRate } from "@/lib/yield-curve";
import type { ComparatorBond } from "./types";

/** UST reference curve (par points) — bootstrapped once via the curve engine. */
const UST_REFERENCE = bootstrap([
  { tenor: 0.5, parRate: 0.047 },
  { tenor: 1, parRate: 0.0445 },
  { tenor: 2, parRate: 0.042 },
  { tenor: 3, parRate: 0.0412 },
  { tenor: 5, parRate: 0.0418 },
  { tenor: 7, parRate: 0.043 },
  { tenor: 10, parRate: 0.0445 },
  { tenor: 20, parRate: 0.048 },
  { tenor: 30, parRate: 0.0492 },
]);

/** Treasury (UST) zero yield at a tenor (decimal). */
export function ustYield(tenorYears: number): number {
  return zeroRate(UST_REFERENCE, Math.max(tenorYears, 0.05));
}

/** Build a ComparatorBond from a Bond Database record. */
export function fromRecord(record: BondRecord): ComparatorBond {
  return {
    id: `db:${record.id}`,
    ticker: record.ticker,
    name: record.name,
    form: recordToForm(record),
    currency: record.currency,
    rating: record.rating,
    country: record.country,
    issuer: record.issuer,
    sector: record.sector,
  };
}

/** Build a ComparatorBond from a Portfolio position. */
export function fromPosition(position: Position): ComparatorBond {
  return {
    id: `pf:${position.id}`,
    ticker: position.ticker,
    name: position.bondName,
    form: {
      bondName: position.bondName,
      ticker: position.ticker,
      faceValue: position.faceValue,
      couponRate: position.couponRate,
      frequency: position.frequency,
      issueDate: position.issueDate,
      settlementDate: position.settlementDate,
      maturityDate: position.maturityDate,
      dayCount: position.dayCount,
      yield: position.yield,
      cleanPrice: position.purchasePrice,
    },
    currency: position.currency,
  };
}
