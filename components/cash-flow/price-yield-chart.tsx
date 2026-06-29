"use client";

import {
  Brush,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "./chart-container";
import { ChartToolbar } from "./chart-toolbar";
import { ChartLegend } from "./chart-legend";
import { ChartTooltip } from "./chart-tooltip";
import { CHART } from "./chart-theme";
import type { PriceYieldPoint } from "./analytics-series";

interface PriceYieldChartProps {
  data: PriceYieldPoint[];
  currentYieldPct: number;
  currentPrice: number;
}

/**
 * Price vs. yield curve. Points come from the engine's `priceFromYield` sampled
 * around the current yield. Includes a crosshair (tooltip cursor), the current
 * point highlighted, and a Brush for zoom/pan.
 */
export function PriceYieldChart({ data, currentYieldPct, currentPrice }: PriceYieldChartProps) {
  return (
    <ChartContainer
      title="Price vs Yield"
      description="Clean price across yields ±5% around the current level."
      height={300}
      toolbar={
        <ChartToolbar>
          <ChartLegend items={[{ label: "Price curve", color: CHART.primary }, { label: "Current", color: CHART.amber }]} />
        </ChartToolbar>
      }
    >
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={CHART.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="yieldPct"
          type="number"
          domain={["dataMin", "dataMax"]}
          tickFormatter={(v: number) => `${v.toFixed(1)}%`}
          stroke={CHART.axis}
          fontSize={11}
          tickLine={false}
        />
        <YAxis
          domain={["auto", "auto"]}
          tickFormatter={(v: number) => v.toFixed(0)}
          stroke={CHART.axis}
          fontSize={11}
          tickLine={false}
          width={48}
        />
        <Tooltip
          cursor={{ stroke: CHART.axis, strokeDasharray: "4 4" }}
          content={<ChartTooltip labelPrefix="Yield " labelSuffix="%" valueFormatter={(v) => v.toFixed(4)} />}
        />
        <ReferenceLine x={currentYieldPct} stroke={CHART.amber} strokeDasharray="4 4" />
        <Line
          type="monotone"
          dataKey="price"
          name="Price"
          stroke={CHART.primary}
          strokeWidth={2}
          dot={false}
          isAnimationActive
          animationDuration={400}
        />
        <ReferenceDot x={currentYieldPct} y={currentPrice} r={5} fill={CHART.amber} stroke="white" strokeWidth={1.5} />
        <Brush dataKey="yieldPct" height={20} stroke={CHART.grid} travellerWidth={8} tickFormatter={(v: number) => `${v.toFixed(1)}%`} />
      </LineChart>
    </ChartContainer>
  );
}
