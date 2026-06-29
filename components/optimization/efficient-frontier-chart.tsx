"use client";

import { CartesianGrid, Line, LineChart, ReferenceDot, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartToolbar } from "@/components/cash-flow";
import { OPT } from "./opt-colors";
import { PointTooltip } from "./point-tooltip";
import type { FrontierPoint } from "@/lib/portfolio-optimization";

interface Marker { vol: number; ret: number }

interface EfficientFrontierChartProps {
  frontier: FrontierPoint[];
  current: Marker;
  minVar: Marker;
  maxSharpe: Marker;
}

/** Efficient frontier with min-variance, max-Sharpe and current markers. */
export function EfficientFrontierChart({ frontier, current, minVar, maxSharpe }: EfficientFrontierChartProps) {
  const data = frontier.map((p) => ({ x: p.volatility * 100, y: p.expectedReturn * 100 }));
  return (
    <ChartContainer
      title="Efficient Frontier"
      description="Risk vs. expected return."
      height={300}
      toolbar={<ChartToolbar><ChartLegend items={[{ label: "Frontier", color: OPT.frontier }, { label: "Min Var", color: OPT.minVar }, { label: "Max Sharpe", color: OPT.maxSharpe }, { label: "Current", color: OPT.current }]} /></ChartToolbar>}
    >
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={OPT.grid} strokeDasharray="3 3" />
        <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} tickFormatter={(v: number) => `${v.toFixed(1)}%`} stroke={OPT.axis} fontSize={11} tickLine={false} name="Risk" />
        <YAxis dataKey="y" type="number" domain={["auto", "auto"]} tickFormatter={(v: number) => `${v.toFixed(1)}%`} stroke={OPT.axis} fontSize={11} tickLine={false} width={48} name="Return" />
        <Tooltip content={<PointTooltip />} />
        <Line type="monotone" dataKey="y" name="Frontier" stroke={OPT.frontier} strokeWidth={2} dot={false} isAnimationActive animationDuration={400} />
        <ReferenceDot x={minVar.vol * 100} y={minVar.ret * 100} r={5} fill={OPT.minVar} stroke="white" strokeWidth={1.5} />
        <ReferenceDot x={maxSharpe.vol * 100} y={maxSharpe.ret * 100} r={5} fill={OPT.maxSharpe} stroke="white" strokeWidth={1.5} />
        <ReferenceDot x={current.vol * 100} y={current.ret * 100} r={5} fill={OPT.current} stroke="white" strokeWidth={1.5} />
      </LineChart>
    </ChartContainer>
  );
}
