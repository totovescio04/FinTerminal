"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartTooltip } from "./chart-tooltip";
import { CHART } from "./chart-theme";
import type { PvDatum } from "./analytics-series";

interface PresentValueChartProps {
  data: PvDatum[];
}

/** Present-value distribution: PV of each flow with its weight on total price. */
export function PresentValueChart({ data }: PresentValueChartProps) {
  return (
    <ChartContainer
      title="Present Value Distribution"
      description="Discounted value of each cash flow and its weight on price."
    >
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={CHART.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" stroke={CHART.axis} fontSize={11} tickLine={false} />
        <YAxis stroke={CHART.axis} fontSize={11} tickLine={false} width={48} />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
          content={<ChartTooltip extraRows={[{ key: "weightPct", label: "Weight", suffix: "%", decimals: 2 }]} />}
        />
        <Bar dataKey="pv" name="Present Value" fill={CHART.violet} radius={[3, 3, 0, 0]} isAnimationActive animationDuration={400} />
      </BarChart>
    </ChartContainer>
  );
}
