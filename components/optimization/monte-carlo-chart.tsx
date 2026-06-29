"use client";

import { CartesianGrid, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartToolbar } from "@/components/cash-flow";
import { OPT } from "./opt-colors";
import { PointTooltip } from "./point-tooltip";
import type { FrontierPoint, RandomPortfolio } from "@/lib/portfolio-optimization";

interface Marker { vol: number; ret: number }

interface MonteCarloChartProps {
  portfolios: RandomPortfolio[];
  minVar: FrontierPoint;
  maxSharpe: FrontierPoint;
  current: Marker;
}

/** Monte-Carlo cloud of random portfolios with key portfolios marked. */
export function MonteCarloChart({ portfolios, minVar, maxSharpe, current }: MonteCarloChartProps) {
  const cloud = portfolios.map((p) => ({ x: p.volatility * 100, y: p.expectedReturn * 100 }));
  return (
    <ChartContainer
      title="Monte Carlo"
      description="Thousands of random portfolios."
      height={300}
      toolbar={<ChartToolbar><ChartLegend items={[{ label: "Random", color: OPT.cloud }, { label: "Min Var", color: OPT.minVar }, { label: "Max Sharpe", color: OPT.maxSharpe }, { label: "Current", color: OPT.current }]} /></ChartToolbar>}
    >
      <ScatterChart margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={OPT.grid} strokeDasharray="3 3" />
        <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} tickFormatter={(v: number) => `${v.toFixed(1)}%`} stroke={OPT.axis} fontSize={11} tickLine={false} name="Risk" />
        <YAxis dataKey="y" type="number" domain={["auto", "auto"]} tickFormatter={(v: number) => `${v.toFixed(1)}%`} stroke={OPT.axis} fontSize={11} tickLine={false} width={48} name="Return" />
        <ZAxis range={[12, 12]} />
        <Tooltip content={<PointTooltip />} cursor={{ strokeDasharray: "4 4" }} />
        <Scatter data={cloud} fill={OPT.cloud} fillOpacity={0.35} isAnimationActive={false} />
        <Scatter data={[{ x: minVar.volatility * 100, y: minVar.expectedReturn * 100, label: "Min Variance" }]} fill={OPT.minVar} />
        <Scatter data={[{ x: maxSharpe.volatility * 100, y: maxSharpe.expectedReturn * 100, label: "Max Sharpe" }]} fill={OPT.maxSharpe} />
        <Scatter data={[{ x: current.vol * 100, y: current.ret * 100, label: "Current" }]} fill={OPT.current} />
      </ScatterChart>
    </ChartContainer>
  );
}
