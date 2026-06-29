/**
 * @file options.ts
 * Select option lists for the Bond Calculator, aligned 1:1 with the engine's
 * `Frequency` and `DayCountConvention` types.
 */

import type { DayCountConvention, Frequency } from "@/lib/fixed-income";

export interface Option<T extends string> {
  label: string;
  value: T;
}

export const FREQUENCY_OPTIONS: Option<Frequency>[] = [
  { label: "Annual", value: "Annual" },
  { label: "Semiannual", value: "Semiannual" },
  { label: "Quarterly", value: "Quarterly" },
  { label: "Monthly", value: "Monthly" },
];

export const DAY_COUNT_OPTIONS: Option<DayCountConvention>[] = [
  { label: "Actual/Actual (ISDA)", value: "ACT/ACT" },
  { label: "30/360 US", value: "30/360" },
  { label: "30E/360", value: "30E/360" },
  { label: "Actual/365", value: "ACT/365" },
  { label: "Actual/360", value: "ACT/360" },
];
