/**
 * @file constants.ts
 * Defaults and option lists for the Portfolio module.
 */

import type { Option } from "@/components/fixed-income/options";
import type { Position } from "./types";

export const PORTFOLIO_STORAGE_KEY = "finterminal-portfolio";

export const CURRENCY_OPTIONS: Option<string>[] = [
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "GBP", value: "GBP" },
  { label: "JPY", value: "JPY" },
];

/** Sample holdings shown on first load (fully editable / removable). */
export const SAMPLE_POSITIONS: Position[] = [
  {
    id: "seed-ust-5-2030",
    ticker: "T 5 01/30",
    bondName: "US Treasury 5% 2030",
    faceValue: 100,
    quantity: 10000,
    purchasePrice: 99.5,
    yield: 5,
    couponRate: 5,
    issueDate: "2020-01-15",
    settlementDate: "2025-06-30",
    maturityDate: "2030-01-15",
    frequency: "Semiannual",
    dayCount: "ACT/ACT",
    currency: "USD",
  },
  {
    id: "seed-corp-375-2028",
    ticker: "ACME 3.75 28",
    bondName: "Acme Corp 3.75% 2028",
    faceValue: 100,
    quantity: 6000,
    purchasePrice: 96.25,
    yield: 4.6,
    couponRate: 3.75,
    issueDate: "2021-03-01",
    settlementDate: "2025-06-30",
    maturityDate: "2028-03-01",
    frequency: "Semiannual",
    dayCount: "30/360",
    currency: "USD",
  },
  {
    id: "seed-bund-2-2035",
    ticker: "DBR 2 35",
    bondName: "Bund 2% 2035",
    faceValue: 100,
    quantity: 8000,
    purchasePrice: 88.1,
    yield: 3.2,
    couponRate: 2,
    issueDate: "2022-02-15",
    settlementDate: "2025-06-30",
    maturityDate: "2035-02-15",
    frequency: "Annual",
    dayCount: "ACT/ACT",
    currency: "EUR",
  },
];

/** A blank position template for the editor. */
export const BLANK_POSITION: Omit<Position, "id"> = {
  ticker: "",
  bondName: "",
  faceValue: 100,
  quantity: 1000,
  purchasePrice: 100,
  yield: 5,
  couponRate: 5,
  issueDate: "2020-01-15",
  settlementDate: "2025-06-30",
  maturityDate: "2030-01-15",
  frequency: "Semiannual",
  dayCount: "ACT/ACT",
  currency: "USD",
};
