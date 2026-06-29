"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartToolbar } from "./chart-toolbar";
import { ChartLegend } from "./chart-legend";
import { ChartTooltip } from "./chart-tooltip";
import { CHART } from "./chart-theme";
import type { TimelineDatum } from "./analytics-series";

interface TimelineChartProps {
  data: TimelineDatum[];
}

/** Cash-flow timeline: stacked coupon + principal per payment (bars). */
export function TimelineChart({ data }: TimelineChartProps) {
  return (
    <ChartContainer
      title="Cash Flow Timeline"
      description="Coupon and principal for every scheduled payment."
      toolbar={
        <ChartToolbar>
          <ChartLegend items={[{ label: "Coupon", color: CHART.primary }, { label: "Principal", color: CHART.positive }]} />
        </ChartToolbar>
      }
    >
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={CHART.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" stroke={CHART.axis} fontSize={11} tickLine={false} />
        <YAxis stroke={CHART.axis} fontSize={11} tickLine={false} width={48} />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
          content={<ChartTooltip extraRows={[{ key: "total", label: "Total" }]} />}
        />
        <Bar dataKey="coupon" name="Coupon" stackId="cf" fill={CHART.primary} radius={[0, 0, 0, 0]} isAnimationActive animationDuration={400} />
        <Bar dataKey="principal" name="Principal" stackId="cf" fill={CHART.positive} radius={[3, 3, 0, 0]} isAnimationActive animationDuration={400} />
      </BarChart>
    </ChartContainer>
  );
}
