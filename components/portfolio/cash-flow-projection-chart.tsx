"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartTooltip, ChartToolbar } from "@/components/cash-flow";
import { formatCurrency } from "@/lib/utils/format";
import { PF_COLORS } from "./chart-colors";
import type { AggregatedCashFlow } from "./types";

interface CashFlowProjectionChartProps {
  data: AggregatedCashFlow[];
}

/** Aggregated portfolio cash-flow projection (coupon + principal over time). */
export function CashFlowProjectionChart({ data }: CashFlowProjectionChartProps) {
  const series = data.map((d) => ({ label: d.date.slice(0, 7), coupon: d.coupon, principal: d.principal }));
  return (
    <ChartContainer
      title="Cash Flow Projection"
      description="Aggregated coupons and principal across the book."
      toolbar={<ChartToolbar><ChartLegend items={[{ label: "Coupon", color: PF_COLORS.primary }, { label: "Principal", color: PF_COLORS.positive }]} /></ChartToolbar>}
    >
      <BarChart data={series} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={PF_COLORS.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" stroke={PF_COLORS.axis} fontSize={10} tickLine={false} minTickGap={16} />
        <YAxis stroke={PF_COLORS.axis} fontSize={11} tickLine={false} width={48} tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0))} />
        <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} content={<ChartTooltip valueFormatter={(v) => formatCurrency(v)} />} />
        <Bar dataKey="coupon" name="Coupon" stackId="cf" fill={PF_COLORS.primary} isAnimationActive animationDuration={400} />
        <Bar dataKey="principal" name="Principal" stackId="cf" fill={PF_COLORS.positive} radius={[3, 3, 0, 0]} isAnimationActive animationDuration={400} />
      </BarChart>
    </ChartContainer>
  );
}
