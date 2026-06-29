"use client";

import { Bar, BarChart, CartesianGrid, Label, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartToolbar } from "./chart-toolbar";
import { ChartLegend } from "./chart-legend";
import { ChartTooltip } from "./chart-tooltip";
import { CHART } from "./chart-theme";
import type { DurationDatum } from "./analytics-series";

interface DurationChartProps {
  data: DurationDatum[];
  macaulay: number;
}

/**
 * Duration visualization: each flow's time-weight (PV / total PV) against its
 * year fraction, with a vertical reference line at the Macaulay duration.
 */
export function DurationChart({ data, macaulay }: DurationChartProps) {
  const maxTime = data.reduce((m, d) => Math.max(m, d.time), 0);
  return (
    <ChartContainer
      title="Duration Visualization"
      description="PV weight of each cash flow over time; the line marks Macaulay duration."
      toolbar={
        <ChartToolbar>
          <ChartLegend items={[{ label: "PV weight", color: CHART.primary }, { label: "Macaulay D", color: CHART.negative }]} />
        </ChartToolbar>
      }
    >
      <BarChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={CHART.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="time"
          type="number"
          domain={[0, Math.ceil(maxTime)]}
          tickFormatter={(v: number) => `${v.toFixed(1)}y`}
          stroke={CHART.axis}
          fontSize={11}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v: number) => `${(v * 100).toFixed(1)}%`}
          stroke={CHART.axis}
          fontSize={11}
          tickLine={false}
          width={48}
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
          content={<ChartTooltip labelPrefix="t = " valueFormatter={(v) => `${(v * 100).toFixed(3)}%`} />}
        />
        <Bar dataKey="weight" name="PV weight" fill={CHART.primary} barSize={8} isAnimationActive animationDuration={400} />
        <ReferenceLine x={macaulay} stroke={CHART.negative} strokeWidth={2}>
          <Label value={`D = ${macaulay.toFixed(2)}y`} position="top" fill={CHART.negative} fontSize={11} />
        </ReferenceLine>
      </BarChart>
    </ChartContainer>
  );
}
