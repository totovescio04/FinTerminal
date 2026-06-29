"use client";

import { setBondMode, setBondValues } from "@/components/cash-flow";
import { addPosition } from "@/components/portfolio";
import type { BondFormValues } from "@/components/fixed-income";
import type { Position } from "@/components/portfolio";
import { BondMapper } from "@/lib/mappers/bond-mapper";
import type { BondRecord } from "@/lib/data/bond-model";
import { pushRecent } from "./recent-store";

/** Map a domain record to Bond Calculator / shared-store form values. */
export function recordToForm(record: BondRecord): BondFormValues {
  return {
    bondName: record.name,
    ticker: record.ticker,
    faceValue: record.faceValue,
    couponRate: record.coupon,
    frequency: record.frequency,
    issueDate: record.issueDate,
    settlementDate: BondMapper.settlementDate(record),
    maturityDate: record.maturityDate,
    dayCount: record.dayCount,
    yield: record.marketYield,
    cleanPrice: record.marketPrice,
  };
}

/** Map a domain record to a portfolio position draft. */
export function recordToPosition(record: BondRecord): Omit<Position, "id"> {
  return {
    ticker: record.ticker,
    bondName: record.name,
    faceValue: record.faceValue,
    quantity: 1000,
    purchasePrice: record.marketPrice,
    yield: record.marketYield,
    couponRate: record.coupon,
    issueDate: record.issueDate,
    settlementDate: BondMapper.settlementDate(record),
    maturityDate: record.maturityDate,
    frequency: record.frequency,
    dayCount: record.dayCount,
    currency: record.currency,
  };
}

/**
 * Push a bond into the shared analysis store. Cash Flow Viewer and Scenario
 * Analysis read this store, so they auto-fill with the selected bond. Also
 * records the bond as recently viewed.
 */
export function loadBondIntoAnalysis(record: BondRecord): void {
  setBondValues(recordToForm(record));
  setBondMode("yield");
  pushRecent(record.id);
}

/** Add a bond to the portfolio (uses the portfolio module's public API). */
export function addBondToPortfolio(record: BondRecord): void {
  addPosition(recordToPosition(record));
}
