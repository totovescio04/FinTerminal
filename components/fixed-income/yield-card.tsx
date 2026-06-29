"use client";

import { MetricCard } from "./metric-card";
import { MetricGroup } from "./metric-group";
import { pct } from "./format";

interface YieldCardProps {
  /** Yield to maturity in percent. */
  ytm?: number;
  /** Current yield in percent. */
  currentYield?: number;
  loading?: boolean;
}

/** Yield metrics: yield to maturity and current yield. */
export function YieldCard({ ytm, currentYield, loading }: YieldCardProps) {
  return (
    <MetricGroup title="Yield">
      <MetricCard label="Yield to Maturity" value={pct(ytm)} loading={loading} emphasis tooltip="Internal rate of return if held to maturity (engine solver)." />
      <MetricCard label="Current Yield" value={pct(currentYield)} loading={loading} tooltip="Annual coupon divided by clean price." />
    </MetricGroup>
  );
}
