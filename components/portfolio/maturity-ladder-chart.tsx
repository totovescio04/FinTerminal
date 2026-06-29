"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/cash-flow";
import { formatCurrency } from "@/lib/utils/format";
import { PF_COLORS } from "./chart-colors";
import type { AllocationSlice } from "./types";

interface MaturityLadderChartProps {
  data: AllocationSlice[];
}

/** Maturity ladder: market value by maturity year. */
export function MaturityLadderChart({ data }: MaturityLadderChartProps) {
  const series = data.map((d) => ({ label: d.label, value: d.value }));
  return (
    <ChartContainer title="Maturity Ladder" description="Market value distributed by maturity year.">
      <BarChart data={series} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={PF_COLORS.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" stroke={PF_COLORS.axis} fontSize={11} tickLine={false} />
        <YAxis stroke={PF_COLORS.axis} fontSize={11} tickLine={false} width={48} tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0))} />
        <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} content={<ChartTooltip labelPrefix="Maturity " valueFormatter={(v) => formatCurrency(v)} />} />
        <Bar dataKey="value" name="Market Value" fill={PF_COLORS.primary} radius={[3, 3, 0, 0]} isAnimationActive animationDuration={400} />
      </BarChart>
    </ChartContainer>
  );
}
