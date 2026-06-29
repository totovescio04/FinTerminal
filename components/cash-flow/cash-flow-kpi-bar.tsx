"use client";

import { MetricCard } from "@/components/fixed-income";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import type { CashFlowSummaryData } from "./analytics-series";

interface CashFlowKpiBarProps {
  summary?: CashFlowSummaryData;
  loading?: boolean;
}

/** Top KPI strip summarising the bond's cash flows (all engine-derived). */
export function CashFlowKpiBar({ summary, loading = false }: CashFlowKpiBarProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      <MetricCard label="Total Coupons" value={summary ? formatCurrency(summary.totalCoupons) : "—"} loading={loading} />
      <MetricCard label="Remaining Principal" value={summary ? formatCurrency(summary.remainingPrincipal) : "—"} loading={loading} />
      <MetricCard label="Total Present Value" value={summary ? formatCurrency(summary.totalPresentValue) : "—"} loading={loading} emphasis />
      <MetricCard label="Avg Discount Factor" value={summary ? formatNumber(summary.averageDiscountFactor, 4) : "—"} loading={loading} />
      <MetricCard label="Weighted Avg Life" value={summary ? `${formatNumber(summary.weightedAverageLife, 2)} yrs` : "—"} loading={loading} />
    </div>
  );
}
