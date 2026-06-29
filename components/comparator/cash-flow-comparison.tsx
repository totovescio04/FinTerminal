"use client";

import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartTooltip, ChartToolbar } from "@/components/cash-flow";
import type { ComparisonResult } from "./types";

const GRID = "hsl(var(--border))";
const AXIS = "hsl(var(--muted-foreground))";

/** Overlay every bond's cash flows by payment period, coloured per bond. */
export function CashFlowComparison({ results }: { results: ComparisonResult[] }) {
  const maxLen = results.reduce((m, r) => Math.max(m, r.analytics.cashFlows.length), 0);
  const data: Record<string, number>[] = [];
  for (let k = 0; k < maxLen; k++) {
    const row: Record<string, number> = { period: k + 1 };
    results.forEach((r, i) => {
      row[`b${i}`] = r.analytics.cashFlows[k]?.totalCashFlow ?? 0;
    });
    data.push(row);
  }
  return (
    <ChartContainer
      title="Cash Flow Comparison"
      description="Total cash flow by payment period (per 100 face)."
      toolbar={<ChartToolbar><ChartLegend items={results.map((r) => ({ label: r.bond.ticker, color: r.color }))} /></ChartToolbar>}
    >
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="period" stroke={AXIS} fontSize={11} tickLine={false} />
        <YAxis stroke={AXIS} fontSize={11} tickLine={false} width={48} />
        <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} content={<ChartTooltip labelPrefix="Period " valueFormatter={(v) => v.toFixed(2)} />} />
        {results.map((r, i) => (
          <Bar key={r.bond.id} dataKey={`b${i}`} name={r.bond.ticker} fill={r.color} radius={[2, 2, 0, 0]} isAnimationActive animationDuration={400}>
            <Cell fill={r.color} />
          </Bar>
        ))}
      </BarChart>
    </ChartContainer>
  );
}
