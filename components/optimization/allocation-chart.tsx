"use client";

import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { ChartContainer, ChartLegend, ChartTooltip, ChartToolbar } from "@/components/cash-flow";
import { formatPercent } from "@/lib/utils/format";
import { allocColor } from "./opt-colors";
import type { OptAsset } from "./use-optimization-inputs";

interface AllocationChartProps {
  weights: number[];
  assets: OptAsset[];
  cash: number;
}

/** Optimal allocation pie. */
export function AllocationChart({ weights, assets, cash }: AllocationChartProps) {
  const slices = assets
    .map((a, i) => ({ key: a.label, value: weights[i] ?? 0, color: allocColor(i) }))
    .filter((s) => Math.abs(s.value) > 1e-4);
  if (cash > 1e-4) slices.push({ key: "Cash", value: cash, color: "hsl(var(--muted-foreground))" });
  return (
    <ChartContainer
      title="Allocation"
      description="Optimal portfolio weights."
      toolbar={<ChartToolbar><ChartLegend items={slices.map((s) => ({ label: s.key, color: s.color }))} /></ChartToolbar>}
    >
      <PieChart>
        <Tooltip content={<ChartTooltip valueFormatter={(v) => formatPercent(v * 100, 2)} />} />
        <Pie data={slices} dataKey="value" nameKey="key" cx="50%" cy="50%" innerRadius={50} outerRadius={82} paddingAngle={2} isAnimationActive animationDuration={400}>
          {slices.map((s) => (
            <Cell key={s.key} fill={s.color} stroke="hsl(var(--card))" strokeWidth={2} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
