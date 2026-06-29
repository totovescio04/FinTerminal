"use client";

import { CartesianGrid, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/cash-flow";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import type { ScenarioPoint } from "@/lib/risk";
import { RISK } from "./risk-colors";

interface ScenarioRunnerProps {
  points: ScenarioPoint[];
  selected: number;
  onSelect: (bps: number) => void;
  dv01: number;
}

/** Run parallel scenarios across the whole book. */
export function ScenarioRunner({ points, selected, onSelect, dv01 }: ScenarioRunnerProps) {
  const current = points.find((p) => p.shiftBps === selected) ?? points.find((p) => p.shiftBps === 0);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {points.map((p) => (
          <Button key={p.shiftBps} size="sm" variant={p.shiftBps === selected ? "default" : "outline"} onClick={() => onSelect(p.shiftBps)} className="tabular-nums">
            {p.shiftBps > 0 ? "+" : ""}{p.shiftBps} bp
          </Button>
        ))}
      </div>

      {current && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">New Value</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{formatCurrency(current.newValue)}</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{current.pnl >= 0 ? "Gain" : "Loss"}</p>
            <p className={cn("mt-1 text-lg font-semibold tabular-nums", current.pnl >= 0 ? "text-positive" : "text-negative")}>
              {current.pnl >= 0 ? "+" : ""}{formatCurrency(current.pnl)}
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Change %</p>
            <p className={cn("mt-1 text-lg font-semibold tabular-nums", current.changePct >= 0 ? "text-positive" : "text-negative")}>
              {current.changePct >= 0 ? "+" : ""}{formatNumber(current.changePct, 2)}%
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Portfolio DV01</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{formatCurrency(dv01)}</p>
          </div>
        </div>
      )}

      <ChartContainer title="Scenario P&L" description="Portfolio P&L across parallel shifts." height={220}>
        <LineChart data={points} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
          <CartesianGrid stroke={RISK.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="shiftBps" type="number" domain={["dataMin", "dataMax"]} tickFormatter={(v: number) => `${v > 0 ? "+" : ""}${v}`} stroke={RISK.axis} fontSize={11} tickLine={false} />
          <YAxis stroke={RISK.axis} fontSize={11} tickLine={false} width={56} tickFormatter={(v: number) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0))} />
          <Tooltip cursor={{ stroke: RISK.axis, strokeDasharray: "4 4" }} content={<ChartTooltip labelPrefix="Shift " labelSuffix=" bp" valueFormatter={(v) => formatCurrency(v)} />} />
          <ReferenceLine y={0} stroke={RISK.axis} />
          <Line type="monotone" dataKey="pnl" name="P&L" stroke={RISK.primary} strokeWidth={2} dot={false} isAnimationActive animationDuration={400} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
