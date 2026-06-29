"use client";

import { MetricCard } from "@/components/fixed-income";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import type { RiskAggregate } from "@/lib/risk";

/** Portfolio-level risk KPIs (engine-weighted). Beta/Tracking are scaffolded. */
export function RiskKPICards({ agg }: { agg: RiskAggregate }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      <MetricCard label="Market Value" value={formatCurrency(agg.marketValue)} emphasis />
      <MetricCard label="Modified Duration" value={`${formatNumber(agg.modifiedDuration, 3)}y`} />
      <MetricCard label="Macaulay Duration" value={`${formatNumber(agg.macaulayDuration, 3)}y`} />
      <MetricCard label="Dollar Duration" value={formatCurrency(agg.dollarDuration)} />
      <MetricCard label="Convexity" value={formatNumber(agg.convexity, 3)} />
      <MetricCard label="Portfolio DV01" value={formatCurrency(agg.dv01)} tooltip="Σ position DV01 (currency / bp)." />
      <MetricCard label="Portfolio PVBP" value={formatCurrency(agg.pvbp)} />
      <MetricCard label="Average Yield" value={`${formatNumber(agg.averageYield * 100, 3)}%`} />
      <MetricCard label="Weighted Coupon" value={`${formatNumber(agg.weightedCoupon, 3)}%`} />
      <MetricCard label="Weighted Avg Life" value={`${formatNumber(agg.weightedAverageLife, 2)} yrs`} />
      <MetricCard label="Portfolio Beta" value="—" tooltip="Scaffolded — requires a benchmark return series." />
      <MetricCard label="Tracking Error" value="—" tooltip="Scaffolded — requires a benchmark return series." />
    </div>
  );
}
