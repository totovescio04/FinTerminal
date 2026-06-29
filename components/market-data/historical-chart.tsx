"use client";

import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/cash-flow";
import { Skeleton } from "@/components/ui/skeleton";
import type { HistoricalField, HistoryRange } from "@/lib/market-data";
import { useHistoricalPrices } from "./use-market-data";

interface HistoricalChartProps {
  symbol: string;
  field?: HistoricalField;
  range?: HistoryRange;
}

const AXIS = "hsl(var(--muted-foreground))";
const GRID = "hsl(var(--border))";
const LINE = "hsl(217 91% 60%)";

/** Historical price/yield chart for an instrument. */
export function HistoricalChart({ symbol, field = "price", range = "3M" }: HistoricalChartProps) {
  const { data, isLoading } = useHistoricalPrices(symbol, field, range);
  const title = `${symbol} · ${field} (${range})`;
  if (isLoading || !data) {
    return <ChartContainer title={title}><Skeleton className="h-[260px] w-full" /></ChartContainer>;
  }
  const points = data.data.points.map((p) => ({ date: p.date.slice(5), value: p.value }));
  return (
    <ChartContainer title={title} description={`Source: ${data.source.provider}${data.source.cached ? " (cached)" : ""}`}>
      <AreaChart data={points} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <defs>
          <linearGradient id="histFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={LINE} stopOpacity={0.3} />
            <stop offset="100%" stopColor={LINE} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" stroke={AXIS} fontSize={10} tickLine={false} minTickGap={24} />
        <YAxis stroke={AXIS} fontSize={11} tickLine={false} width={48} domain={["auto", "auto"]} tickFormatter={(v: number) => v.toFixed(field === "price" ? 1 : 2)} />
        <Tooltip cursor={{ stroke: AXIS, strokeDasharray: "4 4" }} content={<ChartTooltip valueFormatter={(v) => v.toFixed(4)} />} />
        <Area type="monotone" dataKey="value" name={field} stroke={LINE} strokeWidth={2} fill="url(#histFill)" isAnimationActive animationDuration={400} />
      </AreaChart>
    </ChartContainer>
  );
}
