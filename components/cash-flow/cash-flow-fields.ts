/**
 * @file cash-flow-fields.ts
 * Single source of truth for the cash-flow columns. Both the TanStack table and
 * the CSV/Excel exporters are generated from these descriptors, so headers and
 * formatting never drift apart.
 */

import type { CashFlow } from "@/lib/fixed-income";

export type CashFlowFieldType = "int" | "number" | "date";

export interface CashFlowField {
  key: keyof CashFlow;
  header: string;
  type: CashFlowFieldType;
  decimals?: number;
  /** Whether the value is a numeric column (right-aligned in the table). */
  numeric: boolean;
}

export const CASH_FLOW_FIELDS: CashFlowField[] = [
  { key: "index", header: "Payment #", type: "int", numeric: false },
  { key: "paymentDate", header: "Payment Date", type: "date", numeric: false },
  { key: "couponAmount", header: "Coupon Amount", type: "number", decimals: 4, numeric: true },
  { key: "principalAmount", header: "Principal Payment", type: "number", decimals: 4, numeric: true },
  { key: "totalCashFlow", header: "Total Cash Flow", type: "number", decimals: 4, numeric: true },
  { key: "discountFactor", header: "Discount Factor", type: "number", decimals: 6, numeric: true },
  { key: "presentValue", header: "Present Value", type: "number", decimals: 4, numeric: true },
  { key: "remainingPrincipal", header: "Remaining Principal", type: "number", decimals: 4, numeric: true },
  { key: "accrualDays", header: "Days Since Previous Coupon", type: "int", numeric: true },
  { key: "yearFraction", header: "Year Fraction", type: "number", decimals: 6, numeric: true },
];

/** Format a single cash-flow cell as a display/export string. */
export function formatCashFlowCell(cf: CashFlow, field: CashFlowField): string {
  const value = cf[field.key];
  if (field.type === "date" && value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "number") {
    if (field.type === "int") return String(value);
    return value.toFixed(field.decimals ?? 2);
  }
  return String(value);
}
