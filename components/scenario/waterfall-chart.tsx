"use client";

import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis, type TooltipProps } from "recharts";
import { ChartContainer } from "@/components/cash-flow";
import { formatNumber } from "@/lib/utils/format";
import { signed } from "./format";
import { SC_COLORS } from "./chart-colors";
import type { ScenarioResult } from "./scenario-engine";

interface WaterfallChartProps {
  result: ScenarioResult;
  basePrice: number;
}

interface WaterfallRow {
  label: string;
  base: number;
  value: number;
  fill: string;
  note: string;
}

function WaterfallTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  const datum = (payload[0]?.payload ?? {}) as { note?: string };
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-elevated">
      <p className="font-medium text-foreground">{String(label)}</p>
      <p className="tabular-nums text-muted-foreground">{datum.note}</p>
    </div>
  );
}

/** Waterfall: Initial price → duration change → convexity change → final price. */
export function WaterfallChart({ result, basePrice }: WaterfallChartProps) {
  const clean0 = basePrice;
  const afterDur = clean0 + result.durationEffect;
  const final = afterDur + result.convexityEffect;
  const prices = [clean0, afterDur, final];
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  const pad = Math.max((hi - lo) * 0.3, 0.2);
  const domainMin = lo - pad;
  const domainMax = hi + pad;

  const rows: WaterfallRow[] = [
    { label: "Initial", base: domainMin, value: clean0 - domainMin, fill: SC_COLORS.primary, note: `Price ${formatNumber(clean0, 4)}` },
    {
      label: "Duration",
      base: Math.min(clean0, afterDur),
      value: Math.abs(result.durationEffect),
      fill: result.durationEffect >= 0 ? SC_COLORS.positive : SC_COLORS.negative,
      note: `Δ ${signed(result.durationEffect)}`,
    },
    {
      label: "Convexity",
      base: Math.min(afterDur, final),
      value: Math.abs(result.convexityEffect),
      fill: result.convexityEffect >= 0 ? SC_COLORS.positive : SC_COLORS.negative,
      note: `Δ ${signed(result.convexityEffect)}`,
    },
    { label: "Final", base: domainMin, value: final - domainMin, fill: SC_COLORS.accent, note: `Price ${formatNumber(final, 4)}` },
  ];

  return (
    <ChartContainer title="Price Waterfall" description="From initial price through duration and convexity to the final price.">
      <BarChart data={rows} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={SC_COLORS.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" stroke={SC_COLORS.axis} fontSize={11} tickLine={false} />
        <YAxis domain={[domainMin, domainMax]} tickFormatter={(v: number) => v.toFixed(1)} stroke={SC_COLORS.axis} fontSize={11} tickLine={false} width={48} />
        <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} content={<WaterfallTooltip />} />
        <Bar dataKey="base" stackId="w" fill="transparent" isAnimationActive={false} />
        <Bar dataKey="value" stackId="w" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={400}>
          {rows.map((row) => (
            <Cell key={row.label} fill={row.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
