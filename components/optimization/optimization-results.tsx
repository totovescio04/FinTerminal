"use client";

import { MetricCard } from "@/components/fixed-income";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils/format";
import type { OptimizationResult } from "@/lib/portfolio-optimization";
import type { OptAsset } from "./use-optimization-inputs";
import { allocColor } from "./opt-colors";

export interface PortfolioAggregates {
  yield: number;
  duration: number;
  convexity: number;
  dv01: number;
}

interface OptimizationResultsProps {
  result: OptimizationResult;
  assets: OptAsset[];
  aggregates: PortfolioAggregates;
}

/** Optimal weights + resulting risk/return/yield/duration figures. */
export function OptimizationResults({ result, assets, aggregates }: OptimizationResultsProps) {
  const rows = assets
    .map((a, i) => ({ label: a.label, weight: result.weights[i] ?? 0, color: allocColor(i) }))
    .filter((r) => Math.abs(r.weight) > 1e-4)
    .sort((a, b) => b.weight - a.weight);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Expected Return" value={formatPercent(result.expectedReturn * 100, 3)} emphasis />
        <MetricCard label="Volatility" value={formatPercent(result.volatility * 100, 3)} />
        <MetricCard label="Sharpe Ratio" value={formatNumber(result.sharpe, 3)} emphasis />
        <MetricCard label="Diversification" value={formatNumber(result.diversificationRatio, 3)} />
        <MetricCard label="Yield" value={formatPercent(aggregates.yield * 100, 3)} />
        <MetricCard label="Duration" value={`${formatNumber(aggregates.duration, 3)}y`} />
        <MetricCard label="Convexity" value={formatNumber(aggregates.convexity, 2)} />
        <MetricCard label="DV01" value={formatCurrency(aggregates.dv01)} />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Optimal Weight</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.cash > 1e-4 && (
              <TableRow>
                <TableCell className="font-medium text-muted-foreground">Cash</TableCell>
                <TableCell className="text-right tabular-nums">{formatPercent(result.cash * 100, 2)}</TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.label}>
                <TableCell className="font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                    {r.label}
                  </span>
                </TableCell>
                <TableCell className="text-right tabular-nums">{formatPercent(r.weight * 100, 2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
