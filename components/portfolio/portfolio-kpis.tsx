"use client";

import { MetricCard } from "@/components/fixed-income";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import type { PortfolioAnalytics } from "./types";

interface PortfolioKPIsProps {
  data: PortfolioAnalytics;
}

/** Ten portfolio-level KPIs (engine-weighted aggregates). */
export function PortfolioKPIs({ data }: PortfolioKPIsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      <MetricCard label="Market Value" value={formatCurrency(data.marketValue)} emphasis />
      <MetricCard label="Average Yield" value={`${formatNumber(data.averageYield, 3)}%`} tooltip="Market-value-weighted YTM." />
      <MetricCard label="Weighted Coupon" value={`${formatNumber(data.averageCoupon, 3)}%`} tooltip="Face-value-weighted coupon." />
      <MetricCard label="Modified Duration" value={`${formatNumber(data.modifiedDuration, 3)}y`} tooltip="MV-weighted modified duration." />
      <MetricCard label="Convexity" value={formatNumber(data.convexity, 3)} tooltip="MV-weighted convexity." />
      <MetricCard label="Portfolio DV01" value={formatCurrency(data.dv01)} tooltip="Σ position DV01 (currency / bp)." />
      <MetricCard label="Portfolio PVBP" value={formatCurrency(data.pvbp)} tooltip="Σ position PVBP." />
      <MetricCard label="Weighted Avg Life" value={`${formatNumber(data.weightedAverageLife, 2)} yrs`} />
      <MetricCard label="Number of Bonds" value={String(data.numberOfBonds)} />
      <MetricCard label="Total Face Value" value={formatCurrency(data.totalFaceValue)} />
    </div>
  );
}
