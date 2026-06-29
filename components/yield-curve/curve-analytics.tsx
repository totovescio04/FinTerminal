"use client";

import { MetricCard } from "@/components/fixed-income";
import { formatNumber } from "@/lib/utils/format";
import type { CurveAnalytics as Analytics } from "@/lib/yield-curve";

const bps = (v: number) => `${(v * 10000).toFixed(1)} bp`;
const pct = (v: number) => `${formatNumber(v * 100, 3)}%`;

/** Curve-shape analytics cards. */
export function CurveAnalytics({ analytics }: { analytics: Analytics }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MetricCard label="Slope 2s10s" value={bps(analytics.slope2s10s)} emphasis tooltip="z(10) − z(2)." />
      <MetricCard label="Steepness 2s30s" value={bps(analytics.steepness2s30s)} tooltip="z(30) − z(2)." />
      <MetricCard label="Curvature" value={bps(analytics.curvature)} tooltip="2·z(5) − z(2) − z(10)." />
      <MetricCard label="Spread 5s30s" value={bps(analytics.spread5s30s)} tooltip="z(30) − z(5)." />
      <MetricCard label="Average Yield" value={pct(analytics.averageYield)} />
      <MetricCard label="Max Yield" value={pct(analytics.maxYield)} />
      <MetricCard label="Min Yield" value={pct(analytics.minYield)} />
      <MetricCard label="Spread 2s10s" value={bps(analytics.spread2s10s)} />
    </div>
  );
}
