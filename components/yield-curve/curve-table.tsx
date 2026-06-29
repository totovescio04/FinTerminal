"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/utils/format";
import type { CurveTableRow } from "@/lib/yield-curve";

/** Maturity / spot / forward / discount / zero table. */
export function CurveTable({ rows }: { rows: CurveTableRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Maturity</TableHead>
            <TableHead className="text-right">Spot Rate</TableHead>
            <TableHead className="text-right">Forward (1y)</TableHead>
            <TableHead className="text-right">Discount Factor</TableHead>
            <TableHead className="text-right">Zero (cont.)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.tenor}>
              <TableCell className="font-medium tabular-nums">{r.tenor}y</TableCell>
              <TableCell className="text-right tabular-nums">{formatNumber(r.spotRate * 100, 3)}%</TableCell>
              <TableCell className="text-right tabular-nums">{formatNumber(r.forwardRate * 100, 3)}%</TableCell>
              <TableCell className="text-right tabular-nums">{formatNumber(r.discountFactor, 6)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatNumber(r.zeroRate * 100, 3)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
