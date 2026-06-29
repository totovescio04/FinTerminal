"use client";

import { MetricCard } from "./metric-card";
import { MetricGroup } from "./metric-group";
import { num } from "./format";

interface DurationCardProps {
  macaulay?: number;
  modified?: number;
  dollar?: number;
  loading?: boolean;
}

/** Duration metrics straight from the engine's durationMetrics(). */
export function DurationCard({ macaulay, modified, dollar, loading }: DurationCardProps) {
  return (
    <MetricGroup title="Duration">
      <MetricCard label="Macaulay" value={num(macaulay)} hint="years" loading={loading} tooltip="PV-weighted average time to cash flows." />
      <MetricCard label="Modified" value={num(modified)} hint="years" loading={loading} emphasis tooltip="Approx. % price change per 100bp yield move." />
      <MetricCard label="Dollar Duration" value={num(dollar)} loading={loading} tooltip="Money price change per unit yield, per 100 face." />
    </MetricGroup>
  );
}
