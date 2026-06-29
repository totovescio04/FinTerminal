"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils/format";
import type { RiskContribution } from "@/lib/risk";

/** Per-position risk contributions (duration / convexity / DV01 / MV weight). */
export function RiskContributionTable({ contributions }: { contributions: RiskContribution[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Bond</TableHead>
            <TableHead className="text-right">MV Weight</TableHead>
            <TableHead className="text-right">Duration Contrib.</TableHead>
            <TableHead className="text-right">Convexity Contrib.</TableHead>
            <TableHead className="text-right">DV01</TableHead>
            <TableHead className="text-right">DV01 Weight</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contributions.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.label}</TableCell>
              <TableCell className="text-right tabular-nums">{formatPercent(c.marketValueWeight * 100, 2)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatNumber(c.durationContribution, 3)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatNumber(c.convexityContribution, 2)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatCurrency(c.dv01)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatPercent(c.dv01Weight * 100, 2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
