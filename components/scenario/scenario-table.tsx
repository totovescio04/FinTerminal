"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { bp, signed, signedPct } from "./format";
import type { ScenarioResult } from "./scenario-engine";

interface ScenarioTableProps {
  scenarios: ScenarioResult[];
  selectedShift: number;
}

/** Sensitivity table: exact vs. duration vs. convexity estimates and errors. */
export function ScenarioTable({ scenarios, selectedShift }: ScenarioTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Yield Shift</TableHead>
            <TableHead className="text-right">Exact Price</TableHead>
            <TableHead className="text-right">Duration Est.</TableHead>
            <TableHead className="text-right">Convexity Est.</TableHead>
            <TableHead className="text-right">Abs. Error</TableHead>
            <TableHead className="text-right">Rel. Error</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scenarios.map((s) => {
            const relError = s.exactClean === 0 ? 0 : (s.errorConvexity / s.exactClean) * 100;
            return (
              <TableRow key={s.shiftBps} className={cn(s.shiftBps === selectedShift && "bg-primary/5")}>
                <TableCell className="font-medium tabular-nums">{bp(s.shiftBps)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(s.exactClean, 4)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(s.durationPrice, 4)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(s.convexityPrice, 4)}</TableCell>
                <TableCell className="text-right tabular-nums">{signed(s.errorConvexity, 5)}</TableCell>
                <TableCell className="text-right tabular-nums">{signedPct(relError, 4)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
