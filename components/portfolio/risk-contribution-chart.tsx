"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/cash-flow";
import { formatCurrency } from "@/lib/utils/format";
import { PF_COLORS } from "./chart-colors";
import type { PositionAnalytics } from "./types";

interface RiskContributionChartProps {
  positions: PositionAnalytics[];
}

/** DV01 risk contribution by holding (currency per basis point). */
export function RiskContributionChart({ positions }: RiskContributionChartProps) {
  const data = positions.map((p) => ({ label: p.position.ticker, dv01: p.dv01 }));
  return (
    <ChartContainer title="Risk Contribution" description="DV01 contribution by holding.">
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={PF_COLORS.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" stroke={PF_COLORS.axis} fontSize={11} tickLine={false} />
        <YAxis stroke={PF_COLORS.axis} fontSize={11} tickLine={false} width={48} tickFormatter={(v: number) => v.toFixed(0)} />
        <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} content={<ChartTooltip valueFormatter={(v) => formatCurrency(v)} />} />
        <Bar dataKey="dv01" name="DV01" fill={PF_COLORS.negative} radius={[3, 3, 0, 0]} isAnimationActive animationDuration={400} />
      </BarChart>
    </ChartContainer>
  );
}
