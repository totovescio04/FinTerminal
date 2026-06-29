"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils/format";
import type { ComparisonResult } from "./types";

/** Yield spreads: between bonds (vs the first as reference) and vs UST. */
export function SpreadAnalysis({ results }: { results: ComparisonResult[] }) {
  const ref = results[0];
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Spread Analysis</CardTitle>
        <CardDescription>Spreads in basis points{ref ? ` · reference: ${ref.bond.ticker}` : ""}.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Bond</TableHead>
                <TableHead className="text-right">Yield</TableHead>
                <TableHead className="text-right">vs {ref?.bond.ticker ?? "ref"}</TableHead>
                <TableHead className="text-right">vs UST</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((r) => {
                const vsRef = ref ? (r.analytics.yieldDecimal - ref.analytics.yieldDecimal) * 10000 : 0;
                return (
                  <TableRow key={r.bond.id}>
                    <TableCell className="font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                        {r.bond.ticker}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{formatNumber(r.analytics.yieldDecimal * 100, 3)}%</TableCell>
                    <TableCell className="text-right tabular-nums">{vsRef >= 0 ? "+" : ""}{formatNumber(vsRef, 1)} bp</TableCell>
                    <TableCell className="text-right tabular-nums">{r.ustSpreadBps >= 0 ? "+" : ""}{formatNumber(r.ustSpreadBps, 1)} bp</TableCell>
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
