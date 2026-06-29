"use client";

import { CartesianGrid, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import { ChartContainer } from "@/components/cash-flow";
import { OPT } from "./opt-colors";
import { PointTooltip } from "./point-tooltip";
import type { OptAsset } from "./use-optimization-inputs";

const YIELD_VOL_ANNUAL = 0.0103;

/** Per-asset risk vs. return scatter. */
export function RiskReturnChart({ assets }: { assets: OptAsset[] }) {
  const data = assets.map((a) => ({ x: a.modifiedDuration * YIELD_VOL_ANNUAL * 100, y: a.yield * 100, label: a.label }));
  return (
    <ChartContainer title="Risk / Return by Asset" description="Each bond's volatility vs. yield." height={300}>
      <ScatterChart margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={OPT.grid} strokeDasharray="3 3" />
        <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} tickFormatter={(v: number) => `${v.toFixed(1)}%`} stroke={OPT.axis} fontSize={11} tickLine={false} name="Risk" />
        <YAxis dataKey="y" type="number" domain={["auto", "auto"]} tickFormatter={(v: number) => `${v.toFixed(1)}%`} stroke={OPT.axis} fontSize={11} tickLine={false} width={48} name="Return" />
        <ZAxis range={[60, 60]} />
        <Tooltip content={<PointTooltip />} cursor={{ strokeDasharray: "4 4" }} />
        <Scatter data={data} fill={OPT.frontier} />
      </ScatterChart>
    </ChartContainer>
  );
}
