"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/cash-flow";
import { formatCurrency } from "@/lib/utils/format";
import { PF_COLORS } from "./chart-colors";
import type { PositionAnalytics } from "./types";

interface YieldDistributionChartProps {
  positions: PositionAnalytics[];
}

/** Histogram of market value bucketed by yield (0.5% bins). */
export function YieldDistributionChart({ positions }: YieldDistributionChartProps) {
  const width = 0.5;
  const buckets = new Map<number, number>();
  for (const p of positions) {
    const yPct = p.yieldDecimal * 100;
    const bin = Math.floor(yPct / width) * width;
    buckets.set(bin, (buckets.get(bin) ?? 0) + p.marketValue);
  }
  const data = [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([bin, value]) => ({ label: `${bin.toFixed(1)}–${(bin + width).toFixed(1)}%`, value }));
  return (
    <ChartContainer title="Yield Distribution" description="Market value by yield bucket.">
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={PF_COLORS.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" stroke={PF_COLORS.axis} fontSize={10} tickLine={false} />
        <YAxis stroke={PF_COLORS.axis} fontSize={11} tickLine={false} width={48} tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0))} />
        <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} content={<ChartTooltip valueFormatter={(v) => formatCurrency(v)} />} />
        <Bar dataKey="value" name="Market Value" fill="hsl(262 83% 62%)" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={400} />
      </BarChart>
    </ChartContainer>
  );
}
