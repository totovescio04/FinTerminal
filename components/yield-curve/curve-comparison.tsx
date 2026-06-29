"use client";

import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartTooltip, ChartToolbar } from "@/components/cash-flow";
import { YC } from "./yc-colors";
import type { ComparisonPoint } from "./series";

/** Overlay of the base curve vs. the scenario curve (spot rates). */
export function CurveComparison({ data }: { data: ComparisonPoint[] }) {
  return (
    <ChartContainer
      title="Curve Comparison"
      description="Base vs. scenario spot curve."
      height={280}
      toolbar={<ChartToolbar><ChartLegend items={[{ label: "Base", color: YC.spot }, { label: "Scenario", color: YC.scenario }]} /></ChartToolbar>}
    >
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={YC.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="tenor" type="number" domain={["dataMin", "dataMax"]} tickFormatter={(v: number) => `${v}y`} stroke={YC.axis} fontSize={11} tickLine={false} />
        <YAxis tickFormatter={(v: number) => `${v.toFixed(1)}%`} stroke={YC.axis} fontSize={11} tickLine={false} width={48} domain={["auto", "auto"]} />
        <Tooltip cursor={{ stroke: YC.axis, strokeDasharray: "4 4" }} content={<ChartTooltip labelPrefix="Tenor " labelSuffix="y" valueFormatter={(v) => `${v.toFixed(3)}%`} />} />
        <Line type="monotone" dataKey="base" name="Base" stroke={YC.spot} strokeWidth={2} dot={false} isAnimationActive animationDuration={400} />
        <Line type="monotone" dataKey="scenario" name="Scenario" stroke={YC.scenario} strokeWidth={2} strokeDasharray="5 4" dot={false} isAnimationActive animationDuration={400} />
      </LineChart>
    </ChartContainer>
  );
}
