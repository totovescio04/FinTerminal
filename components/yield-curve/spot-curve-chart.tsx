"use client";

import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/cash-flow";
import { YC } from "./yc-colors";
import type { CurveSeriesPoint } from "./series";

/** Spot (zero) curve chart. */
export function SpotCurveChart({ data }: { data: CurveSeriesPoint[] }) {
  return (
    <ChartContainer title="Spot Curve" description="Zero/spot rates across tenors." height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={YC.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="tenor" type="number" domain={["dataMin", "dataMax"]} tickFormatter={(v: number) => `${v}y`} stroke={YC.axis} fontSize={11} tickLine={false} />
        <YAxis tickFormatter={(v: number) => `${v.toFixed(1)}%`} stroke={YC.axis} fontSize={11} tickLine={false} width={48} domain={["auto", "auto"]} />
        <Tooltip cursor={{ stroke: YC.axis, strokeDasharray: "4 4" }} content={<ChartTooltip labelPrefix="Tenor " labelSuffix="y" valueFormatter={(v) => `${v.toFixed(3)}%`} />} />
        <Line type="monotone" dataKey="spot" name="Spot" stroke={YC.spot} strokeWidth={2} dot={false} isAnimationActive animationDuration={400} />
      </LineChart>
    </ChartContainer>
  );
}
