"use client";

import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartTooltip } from "./chart-tooltip";
import { CHART } from "./chart-theme";
import type { DiscountDatum } from "./analytics-series";

interface DiscountFactorChartProps {
  data: DiscountDatum[];
}

/** Discount factor decay vs. time (engine discount factors per cash flow). */
export function DiscountFactorChart({ data }: DiscountFactorChartProps) {
  return (
    <ChartContainer
      title="Discount Factors"
      description="How each cash flow's discount factor decays with time."
    >
      <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <defs>
          <linearGradient id="dfFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART.accent} stopOpacity={0.35} />
            <stop offset="100%" stopColor={CHART.accent} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={CHART.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="time"
          type="number"
          domain={[0, "dataMax"]}
          tickFormatter={(v: number) => `${v.toFixed(1)}y`}
          stroke={CHART.axis}
          fontSize={11}
          tickLine={false}
        />
        <YAxis domain={[0, 1]} tickFormatter={(v: number) => v.toFixed(2)} stroke={CHART.axis} fontSize={11} tickLine={false} width={48} />
        <Tooltip
          cursor={{ stroke: CHART.axis, strokeDasharray: "4 4" }}
          content={<ChartTooltip labelPrefix="t = " valueFormatter={(v) => v.toFixed(6)} />}
        />
        <Area type="monotone" dataKey="discountFactor" name="Discount Factor" stroke={CHART.accent} strokeWidth={2} fill="url(#dfFill)" isAnimationActive animationDuration={400} />
      </AreaChart>
    </ChartContainer>
  );
}
