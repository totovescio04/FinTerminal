"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartTooltip, ChartToolbar } from "@/components/cash-flow";
import { formatCurrency } from "@/lib/utils/format";
import {
  exposureByCountry,
  exposureByCurrency,
  exposureBySector,
  maturityBuckets,
  type ExposureSlice,
  type RiskPosition,
} from "@/lib/risk";
import { RISK, paletteColor } from "./risk-colors";

function PieCard({ title, slices }: { title: string; slices: ExposureSlice[] }) {
  return (
    <ChartContainer
      title={title}
      description="Share of market value."
      toolbar={<ChartToolbar><ChartLegend items={slices.slice(0, 6).map((s, i) => ({ label: s.key, color: paletteColor(i) }))} /></ChartToolbar>}
    >
      <PieChart>
        <Tooltip content={<ChartTooltip valueFormatter={(v) => formatCurrency(v)} />} />
        <Pie data={slices} dataKey="value" nameKey="key" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} isAnimationActive animationDuration={400}>
          {slices.map((s, i) => (
            <Cell key={s.key} fill={paletteColor(i)} stroke="hsl(var(--card))" strokeWidth={2} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

function BarCard({ title, description, data, color, fmt }: {
  title: string;
  description: string;
  data: { label: string; value: number }[];
  color: string;
  fmt: (v: number) => string;
}) {
  return (
    <ChartContainer title={title} description={description}>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={RISK.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" stroke={RISK.axis} fontSize={10} tickLine={false} />
        <YAxis stroke={RISK.axis} fontSize={11} tickLine={false} width={48} tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(1))} />
        <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} content={<ChartTooltip valueFormatter={fmt} />} />
        <Bar dataKey="value" name={title} fill={color} radius={[3, 3, 0, 0]} isAnimationActive animationDuration={400} />
      </BarChart>
    </ChartContainer>
  );
}

/** Risk visualizations: exposure pies + duration / DV01 / convexity / maturity / allocation bars. */
export function RiskCharts({ positions }: { positions: RiskPosition[] }) {
  const buckets = maturityBuckets(positions);
  return (
    <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
      <PieCard title="Exposure (Sector)" slices={exposureBySector(positions)} />
      <PieCard title="Currency Allocation" slices={exposureByCurrency(positions)} />
      <BarCard title="Maturity Ladder" description="Market value by maturity bucket." data={buckets.map((b) => ({ label: b.label, value: b.value }))} color={RISK.primary} fmt={(v) => formatCurrency(v)} />
      <BarCard title="Duration Distribution" description="Avg modified duration by bucket." data={buckets.map((b) => ({ label: b.label, value: b.duration }))} color="hsl(262 83% 62%)" fmt={(v) => `${v.toFixed(2)}y`} />
      <BarCard title="DV01 Contribution" description="DV01 by holding." data={positions.map((p) => ({ label: p.label, value: p.dv01 }))} color={RISK.negative} fmt={(v) => formatCurrency(v)} />
      <BarCard title="Convexity Contribution" description="Convexity by holding." data={positions.map((p) => ({ label: p.label, value: p.convexity }))} color="hsl(38 92% 50%)" fmt={(v) => v.toFixed(2)} />
      <BarCard title="Country Allocation" description="Market value by country." data={exposureByCountry(positions).map((s) => ({ label: s.key, value: s.value }))} color={RISK.positive} fmt={(v) => formatCurrency(v)} />
    </div>
  );
}
