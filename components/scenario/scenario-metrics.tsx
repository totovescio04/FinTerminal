"use client";

import { MetricCard } from "@/components/fixed-income";
import { bp, signed, signedMoney, signedPct } from "./format";
import type { ScenarioResult } from "./scenario-engine";

interface ScenarioMetricsProps {
  result: ScenarioResult;
}

/** KPI grid for the selected scenario (all values engine-derived). */
export function ScenarioMetrics({ result }: ScenarioMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MetricCard label="Price Change" value={signed(result.exactChange)} hint="per 100 face" emphasis tooltip="Exact clean-price change (engine repricing)." />
      <MetricCard label="Yield Change" value={bp(result.shiftBps)} tooltip="Applied parallel shift." />
      <MetricCard label="Duration Effect" value={signed(result.durationEffect)} tooltip="−modified · dirty · Δy." />
      <MetricCard label="Convexity Effect" value={signed(result.convexityEffect)} tooltip="½ · convexity · dirty · Δy²." />
      <MetricCard label="Dollar Gain" value={signedMoney(result.dollarGain)} emphasis tooltip="Exact P&L scaled to face value." />
      <MetricCard label="Percentage Gain" value={signedPct(result.exactChangePct)} tooltip="Exact change / base clean price." />
      <MetricCard label="Error Duration" value={signed(result.errorDuration)} tooltip="Exact − duration estimate." />
      <MetricCard label="Error Convexity" value={signed(result.errorConvexity, 6)} tooltip="Exact − (duration + convexity) estimate." />
    </div>
  );
}
