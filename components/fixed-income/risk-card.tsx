"use client";

import { MetricCard } from "./metric-card";
import { MetricGroup } from "./metric-group";
import { num } from "./format";

interface RiskCardProps {
  dv01?: number;
  pvbp?: number;
  convexity?: number;
  loading?: boolean;
}

/** Risk metrics: DV01, PVBP and convexity from the engine's riskMetrics(). */
export function RiskCard({ dv01, pvbp, convexity, loading }: RiskCardProps) {
  return (
    <MetricGroup title="Risk">
      <MetricCard label="DV01" value={num(dv01, 5)} loading={loading} emphasis tooltip="Dollar value of 1bp, per 100 face." />
      <MetricCard label="PVBP" value={num(pvbp, 5)} loading={loading} tooltip="Price value of a basis point (full reprice)." />
      <MetricCard label="Convexity" value={num(convexity)} loading={loading} tooltip="Second-order price sensitivity to yield." />
    </MetricGroup>
  );
}
