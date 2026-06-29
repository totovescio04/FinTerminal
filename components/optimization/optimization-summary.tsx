"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils/format";

export interface ComparisonRow {
  metric: string;
  current: number;
  optimized: number;
  format: "pct" | "num" | "money";
  better: "high" | "low";
}

/** Current vs optimized portfolio comparison. */
export function OptimizationSummary({ rows }: { rows: ComparisonRow[] }) {
  const fmt = (v: number, f: ComparisonRow["format"]) =>
    f === "pct" ? formatPercent(v * 100, 3) : f === "money" ? formatCurrency(v) : formatNumber(v, 3);
  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle>Current vs Optimized</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Optimized</TableHead>
                <TableHead className="text-right">Δ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const delta = r.optimized - r.current;
                const improved = r.better === "high" ? delta > 0 : delta < 0;
                return (
                  <TableRow key={r.metric}>
                    <TableCell className="font-medium text-muted-foreground">{r.metric}</TableCell>
                    <TableCell className="text-right tabular-nums">{fmt(r.current, r.format)}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{fmt(r.optimized, r.format)}</TableCell>
                    <TableCell className={cn("text-right tabular-nums", improved ? "text-positive" : "text-negative")}>
                      {delta >= 0 ? "+" : ""}{fmt(delta, r.format)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
