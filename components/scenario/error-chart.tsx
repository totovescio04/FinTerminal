"use client";

import { CartesianGrid, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartTooltip, ChartToolbar } from "@/components/cash-flow";
import { SC_COLORS } from "./chart-colors";
import type { ScenarioResult } from "./scenario-engine";

interface ErrorChartProps {
  scenarios: ScenarioResult[];
}

/** Approximation error (duration vs. duration+convexity) across all shifts. */
export function ErrorChart({ scenarios }: ErrorChartProps) {
  const data = scenarios.map((s) => ({
    shiftBps: s.shiftBps,
    errorDuration: s.errorDuration,
    errorConvexity: s.errorConvexity,
  }));
  return (
    <ChartContainer
      title="Approximation Error"
      description="Exact minus estimate, by scenario. Convexity shrinks the error."
      height={300}
      toolbar={
        <ChartToolbar>
          <ChartLegend items={[{ label: "Duration", color: SC_COLORS.negative }, { label: "Duration + Convexity", color: SC_COLORS.primary }]} />
        </ChartToolbar>
      }
    >
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={SC_COLORS.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="shiftBps" type="number" domain={["dataMin", "dataMax"]} tickFormatter={(v: number) => `${v > 0 ? "+" : ""}${v}`} stroke={SC_COLORS.axis} fontSize={11} tickLine={false} />
        <YAxis tickFormatter={(v: number) => v.toFixed(2)} stroke={SC_COLORS.axis} fontSize={11} tickLine={false} width={48} />
        <Tooltip cursor={{ stroke: SC_COLORS.axis, strokeDasharray: "4 4" }} content={<ChartTooltip labelPrefix="Shift " labelSuffix=" bp" valueFormatter={(v) => v.toFixed(5)} />} />
        <ReferenceLine y={0} stroke={SC_COLORS.axis} />
        <Line type="monotone" dataKey="errorDuration" name="Duration" stroke={SC_COLORS.negative} strokeWidth={2} dot={false} isAnimationActive animationDuration={400} />
        <Line type="monotone" dataKey="errorConvexity" name="Duration + Convexity" stroke={SC_COLORS.primary} strokeWidth={2} dot={false} isAnimationActive animationDuration={400} />
      </LineChart>
    </ChartContainer>
  );
}
