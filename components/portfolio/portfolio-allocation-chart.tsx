"use client";

import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { ChartContainer, ChartLegend, ChartTooltip, ChartToolbar } from "@/components/cash-flow";
import { formatCurrency } from "@/lib/utils/format";
import { paletteColor } from "./chart-colors";
import type { AllocationSlice } from "./types";

interface PortfolioAllocationChartProps {
  data: AllocationSlice[];
}

/** Portfolio allocation by asset (pie / donut), weighted by market value. */
export function PortfolioAllocationChart({ data }: PortfolioAllocationChartProps) {
  const legend = data.slice(0, 8).map((d, i) => ({ label: d.label, color: paletteColor(i) }));
  return (
    <ChartContainer
      title="Portfolio Allocation"
      description="Share of market value by holding."
      toolbar={<ChartToolbar><ChartLegend items={legend} /></ChartToolbar>}
    >
      <PieChart>
        <Tooltip content={<ChartTooltip valueFormatter={(v) => formatCurrency(v)} />} />
        <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} isAnimationActive animationDuration={400}>
          {data.map((slice, i) => (
            <Cell key={slice.label} fill={paletteColor(i)} stroke="hsl(var(--card))" strokeWidth={2} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
