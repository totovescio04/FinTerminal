"use client";

import { CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartTooltip, ChartToolbar } from "@/components/cash-flow";
import { SC_COLORS } from "./chart-colors";
import type { SensitivityPoint } from "./scenario-engine";

interface ScenarioChartProps {
  data: SensitivityPoint[];
  baseYieldPct: number;
  basePrice: number;
  scenarioYieldPct: number;
  scenarioPrice: number;
}

/** Price-sensitivity curve with the current and selected-scenario points marked. */
export function ScenarioChart({ data, baseYieldPct, basePrice, scenarioYieldPct, scenarioPrice }: ScenarioChartProps) {
  return (
    <ChartContainer
      title="Price Sensitivity"
      description="Clean price across yields; current and scenario points highlighted."
      height={300}
      toolbar={
        <ChartToolbar>
          <ChartLegend items={[{ label: "Current", color: SC_COLORS.accent }, { label: "Scenario", color: SC_COLORS.amber }]} />
        </ChartToolbar>
      }
    >
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={SC_COLORS.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="yieldPct" type="number" domain={["dataMin", "dataMax"]} tickFormatter={(v: number) => `${v.toFixed(1)}%`} stroke={SC_COLORS.axis} fontSize={11} tickLine={false} />
        <YAxis domain={["auto", "auto"]} tickFormatter={(v: number) => v.toFixed(0)} stroke={SC_COLORS.axis} fontSize={11} tickLine={false} width={48} />
        <Tooltip cursor={{ stroke: SC_COLORS.axis, strokeDasharray: "4 4" }} content={<ChartTooltip labelPrefix="Yield " labelSuffix="%" valueFormatter={(v) => v.toFixed(4)} />} />
        <ReferenceLine x={scenarioYieldPct} stroke={SC_COLORS.amber} strokeDasharray="4 4" />
        <Line type="monotone" dataKey="price" name="Price" stroke={SC_COLORS.primary} strokeWidth={2} dot={false} isAnimationActive animationDuration={400} />
        <ReferenceDot x={baseYieldPct} y={basePrice} r={5} fill={SC_COLORS.accent} stroke="white" strokeWidth={1.5} />
        <ReferenceDot x={scenarioYieldPct} y={scenarioPrice} r={5} fill={SC_COLORS.amber} stroke="white" strokeWidth={1.5} />
      </LineChart>
    </ChartContainer>
  );
}
