/**
 * @file types.ts
 * Unified model for the Bond Comparator. A ComparatorBond carries a
 * BondFormValues (the engine input) plus reference metadata; analytics are
 * derived from the financial engine — nothing is recomputed here.
 */

import type { BondFormValues, BondAnalyticsOk } from "@/components/fixed-income";
import type { ScenarioResult } from "@/components/scenario";

export const MAX_COMPARE = 4;

/** Palette used to colour each compared bond consistently across charts. */
export const BOND_COLORS = ["hsl(var(--primary))", "hsl(38 92% 50%)", "hsl(142 64% 40%)", "hsl(262 83% 62%)"] as const;

/** A bond selected for comparison (source-agnostic). */
export interface ComparatorBond {
  /** Unique key, e.g. "db:al30" or "pf:<id>". */
  id: string;
  ticker: string;
  name: string;
  /** Engine input (yield-driven). */
  form: BondFormValues;
  currency: string;
  rating?: string;
  country?: string;
  issuer?: string;
  sector?: string;
}

/** A bond plus its engine analytics, scenario result and Treasury spread. */
export interface ComparisonResult {
  bond: ComparatorBond;
  color: string;
  analytics: BondAnalyticsOk;
  /** Scenario reprice at the active shift (null if shift = 0 or invalid). */
  scenario: ScenarioResult | null;
  /** Yield spread vs the UST reference curve at the bond's tenor (bps). */
  ustSpreadBps: number;
  /** Remaining years to maturity. */
  remainingYears: number;
  /** Weighted average life (years), reshaped from engine cash flows. */
  wal: number;
}
