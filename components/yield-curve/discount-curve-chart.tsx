"use client";

import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/cash-flow";
import { YC } from "./yc-colors";
import type { CurveSeriesPoint } from "./series";

/** Discount-factor curve chart. */
export function DiscountCurveChart({ data }: { data: CurveSeriesPoint[] }) {
  return (
    <ChartContainer title="Discount Curve" description="Discount factors DF(t) decaying with tenor." height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <defs>
          <linearGradient id="dfCurveFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={YC.discount} stopOpacity={0.3} />
            <stop offset="100%" stopColor={YC.discount} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={YC.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="tenor" type="number" domain={["dataMin", "dataMax"]} tickFormatter={(v: number) => `${v}y`} stroke={YC.axis} fontSize={11} tickLine={false} />
        <YAxis domain={[0, 1]} tickFormatter={(v: number) => v.toFixed(2)} stroke={YC.axis} fontSize={11} tickLine={false} width={48} />
        <Tooltip cursor={{ stroke: YC.axis, strokeDasharray: "4 4" }} content={<ChartTooltip labelPrefix="Tenor " labelSuffix="y" valueFormatter={(v) => v.toFixed(5)} />} />
        <Area type="monotone" dataKey="discount" name="Discount Factor" stroke={YC.discount} strokeWidth={2} fill="url(#dfCurveFill)" isAnimationActive animationDuration={400} />
      </AreaChart>
    </ChartContainer>
  );
}
