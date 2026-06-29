"use client";

import type { CashFlow } from "@/lib/fixed-income";
import { formatNumber } from "@/lib/utils/format";

interface CashFlowSummaryProps {
  rows: CashFlow[];
}

/** Totals strip shown beneath the table (coupons, principal, present value). */
export function CashFlowSummary({ rows }: CashFlowSummaryProps) {
  const totalCoupons = rows.reduce((s, r) => s + r.couponAmount, 0);
  const totalPrincipal = rows.reduce((s, r) => s + r.principalAmount, 0);
  const totalPv = rows.reduce((s, r) => s + r.presentValue, 0);
  const cell = (label: string, value: number) => (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold tabular-nums">{formatNumber(value, 4)}</span>
    </div>
  );
  return (
    <div className="flex flex-wrap items-center gap-x-10 gap-y-2 rounded-lg border border-border bg-muted/30 px-4 py-3">
      {cell("Total Coupons", totalCoupons)}
      {cell("Total Principal", totalPrincipal)}
      {cell("Total Present Value", totalPv)}
    </div>
  );
}
