"use client";

import { CartesianGrid, Line, LineChart, ReferenceDot, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartToolbar } from "./chart-toolbar";
import { ChartLegend } from "./chart-legend";
import { ChartTooltip } from "./chart-tooltip";
import { CHART } from "./chart-theme";
import type { ConvexityPoint } from "./analytics-series";

interface ConvexityChartProps {
  data: ConvexityPoint[];
  currentYieldPct: number;
  currentPrice: number;
}

/**
 * Convexity visualization: the true price/yield curve vs. the straight duration
 * tangent. The gap between them is the bond's convexity — the curve always lies
 * above the tangent for an option-free bond.
 */
export function ConvexityChart({ data, currentYieldPct, currentPrice }: ConvexityChartProps) {
  return (
    <ChartContainer
      title="Convexity Visualization"
      description="Price curve vs. duration tangent — the gap is convexity (curve sits above the line)."
      height={300}
      toolbar={
        <ChartToolbar>
          <ChartLegend items={[{ label: "Price", color: CHART.primary }, { label: "Duration tangent", color: CHART.amber }]} />
        </ChartToolbar>
      }
    >
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={CHART.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="yieldPct"
          type="number"
          domain={["dataMin", "dataMax"]}
          tickFormatter={(v: number) => `${v.toFixed(1)}%`}
          stroke={CHART.axis}
          fontSize={11}
          tickLine={false}
        />
        <YAxis tickFormatter={(v: number) => v.toFixed(0)} stroke={CHART.axis} fontSize={11} tickLine={false} width={48} />
        <Tooltip
          cursor={{ stroke: CHART.axis, strokeDasharray: "4 4" }}
          content={<ChartTooltip labelPrefix="Yield " labelSuffix="%" valueFormatter={(v) => v.toFixed(4)} />}
        />
        <Line type="monotone" dataKey="price" name="Price" stroke={CHART.primary} strokeWidth={2} dot={false} isAnimationActive animationDuration={400} />
        <Line type="linear" dataKey="tangent" name="Duration tangent" stroke={CHART.amber} strokeWidth={1.75} strokeDasharray="5 4" dot={false} isAnimationActive animationDuration={400} />
        <ReferenceDot x={currentYieldPct} y={currentPrice} r={5} fill={CHART.amber} stroke="white" strokeWidth={1.5} />
      </LineChart>
    </ChartContainer>
  );
}
