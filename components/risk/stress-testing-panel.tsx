"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import type { StressResult } from "@/lib/risk";

/** Predefined stress-test results. */
export function StressTestingPanel({ results }: { results: StressResult[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Scenario</TableHead>
            <TableHead className="text-right">New Value</TableHead>
            <TableHead className="text-right">Impact $</TableHead>
            <TableHead className="text-right">Impact %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.label}</TableCell>
              <TableCell className="text-right tabular-nums">{formatCurrency(r.newValue)}</TableCell>
              <TableCell className={cn("text-right tabular-nums", r.impact >= 0 ? "text-positive" : "text-negative")}>
                {r.impact >= 0 ? "+" : ""}{formatCurrency(r.impact)}
              </TableCell>
              <TableCell className={cn("text-right tabular-nums", r.impactPct >= 0 ? "text-positive" : "text-negative")}>
                {r.impactPct >= 0 ? "+" : ""}{formatNumber(r.impactPct, 2)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
