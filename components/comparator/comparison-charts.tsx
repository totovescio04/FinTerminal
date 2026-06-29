"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ReferenceDot,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { priceFromYield } from "@/lib/fixed-income";
import { ChartContainer, ChartLegend, ChartTooltip, ChartToolbar } from "@/components/cash-flow";
import { ustYield } from "./instrument";
import { CashFlowComparison } from "./cash-flow-comparison";
import type { ComparisonResult } from "./types";

const GRID = "hsl(var(--border))";
const AXIS = "hsl(var(--muted-foreground))";

function legend(results: ComparisonResult[]) {
  return <ChartToolbar><ChartLegend items={results.map((r) => ({ label: r.bond.ticker, color: r.color }))} /></ChartToolbar>;
}

/** Price vs yield overlay — each bond's clean price across a common yield grid. */
function PriceYieldComparison({ results }: { results: ComparisonResult[] }) {
  const data: Record<string, number>[] = [];
  for (let y = 0.5; y <= 12.0001; y += 0.5) {
    const row: Record<string, number> = { yieldPct: Math.round(y * 100) / 100 };
    results.forEach((r, i) => {
      row[`b${i}`] = priceFromYield(r.analytics.bond, y / 100).cleanPrice;
    });
    data.push(row);
  }
  return (
    <ChartContainer title="Price vs Yield" description="Clean price across yields for each bond." height={280} toolbar={legend(results)}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="yieldPct" type="number" domain={["dataMin", "dataMax"]} tickFormatter={(v: number) => `${v}%`} stroke={AXIS} fontSize={11} tickLine={false} />
        <YAxis stroke={AXIS} fontSize={11} tickLine={false} width={48} domain={["auto", "auto"]} />
        <Tooltip cursor={{ stroke: AXIS, strokeDasharray: "4 4" }} content={<ChartTooltip labelPrefix="Yield " labelSuffix="%" valueFormatter={(v) => v.toFixed(3)} />} />
        {results.map((r, i) => (
          <Line key={r.bond.id} type="monotone" dataKey={`b${i}`} name={r.bond.ticker} stroke={r.color} strokeWidth={2} dot={false} isAnimationActive animationDuration={400} />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

function BarCompare({ results, title, description, value, fmt }: {
  results: ComparisonResult[];
  title: string;
  description: string;
  value: (r: ComparisonResult) => number;
  fmt: (v: number) => string;
}) {
  const data = results.map((r) => ({ ticker: r.bond.ticker, value: value(r), fill: r.color }));
  return (
    <ChartContainer title={title} description={description}>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="ticker" stroke={AXIS} fontSize={11} tickLine={false} />
        <YAxis stroke={AXIS} fontSize={11} tickLine={false} width={48} />
        <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} content={<ChartTooltip valueFormatter={(v) => fmt(v)} />} />
        <Bar dataKey="value" name={title} radius={[3, 3, 0, 0]} isAnimationActive animationDuration={400}>
          {data.map((d) => (
            <Cell key={d.ticker} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

/** Yield-curve comparison: UST reference line with each bond's yield plotted at its tenor. */
function CreditCurveComparison({ results }: { results: ComparisonResult[] }) {
  const tenors = [0.5, 1, 2, 3, 5, 7, 10, 20, 30];
  const data = tenors.map((t) => ({ tenor: t, ust: ustYield(t) * 100 }));
  return (
    <ChartContainer title="Yield Curve Comparison" description="Bond yields vs the UST reference curve." height={280} toolbar={legend(results)}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="tenor" type="number" domain={[0, 30]} tickFormatter={(v: number) => `${v}y`} stroke={AXIS} fontSize={11} tickLine={false} />
        <YAxis stroke={AXIS} fontSize={11} tickLine={false} width={48} domain={["auto", "auto"]} tickFormatter={(v: number) => `${v.toFixed(1)}%`} />
        <Tooltip cursor={{ stroke: AXIS, strokeDasharray: "4 4" }} content={<ChartTooltip labelPrefix="Tenor " labelSuffix="y" valueFormatter={(v) => `${v.toFixed(2)}%`} />} />
        <Line type="monotone" dataKey="ust" name="UST" stroke={AXIS} strokeWidth={2} dot={false} />
        {results.map((r) => (
          <ReferenceDot key={r.bond.id} x={r.remainingYears} y={r.analytics.yieldDecimal * 100} r={5} fill={r.color} stroke="white" strokeWidth={1.5} />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

/** All comparison charts in a responsive grid. */
export function ComparisonCharts({ results }: { results: ComparisonResult[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
      <PriceYieldComparison results={results} />
      <CreditCurveComparison results={results} />
      <BarCompare results={results} title="Duration Comparison" description="Modified duration (years)." value={(r) => r.analytics.durations.modified} fmt={(v) => `${v.toFixed(3)}y`} />
      <BarCompare results={results} title="Convexity Comparison" description="Convexity." value={(r) => r.analytics.risk.convexity} fmt={(v) => v.toFixed(2)} />
      <CashFlowComparison results={results} />
      <BarCompare results={results} title="Present Value Distribution" description="Present value per 100 face." value={(r) => r.analytics.pricing.presentValue} fmt={(v) => v.toFixed(2)} />
    </div>
  );
}
