"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { METRICS, bestIndex } from "./metrics";
import type { ComparisonResult } from "./types";

/** Full metric comparison matrix with automatic best-value highlighting. */
export function ComparisonTable({ results }: { results: ComparisonResult[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="sticky left-0 bg-muted/40">Metric</TableHead>
            {results.map((r) => (
              <TableHead key={r.bond.id} className="text-right">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                  {r.bond.ticker}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {METRICS.map((metric) => {
            const best = bestIndex(results, metric);
            return (
              <TableRow key={metric.key}>
                <TableCell className="sticky left-0 bg-card font-medium text-muted-foreground">{metric.label}</TableCell>
                {results.map((r, i) => (
                  <TableCell
                    key={r.bond.id}
                    className={cn("text-right tabular-nums", i === best && "bg-positive/10 font-semibold text-positive")}
                  >
                    {metric.display(r)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
