"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/cash-flow";
import { PF_COLORS } from "./chart-colors";
import type { PositionAnalytics } from "./types";

interface DurationContributionChartProps {
  positions: PositionAnalytics[];
}

/** Duration contribution per holding = weight × modified duration. */
export function DurationContributionChart({ positions }: DurationContributionChartProps) {
  const data = positions.map((p) => ({ label: p.position.ticker, contribution: p.weight * p.modifiedDuration }));
  return (
    <ChartContainer title="Duration Contribution" description="Weight × modified duration by holding.">
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={PF_COLORS.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" stroke={PF_COLORS.axis} fontSize={11} tickLine={false} />
        <YAxis stroke={PF_COLORS.axis} fontSize={11} tickLine={false} width={44} tickFormatter={(v: number) => v.toFixed(2)} />
        <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} content={<ChartTooltip valueFormatter={(v) => `${v.toFixed(3)}y`} />} />
        <Bar dataKey="contribution" name="Contribution" fill={PF_COLORS.primary} radius={[3, 3, 0, 0]} isAnimationActive animationDuration={400} />
      </BarChart>
    </ChartContainer>
  );
}
