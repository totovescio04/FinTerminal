"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RANKINGS } from "./metrics";
import type { ComparisonResult } from "./types";

/** Automatic rankings (yield, convexity, duration, price, risk). */
export function RankingTable({ results }: { results: ComparisonResult[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Rankings</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RANKINGS.map((rk) => {
          const sorted = [...results].sort((a, b) => (rk.direction === "desc" ? rk.value(b) - rk.value(a) : rk.value(a) - rk.value(b)));
          return (
            <div key={rk.key}>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{rk.label}</p>
              <ol className="space-y-1.5">
                {sorted.map((r, i) => (
                  <li key={r.bond.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">{i + 1}.</span>
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                      {r.bond.ticker}
                    </span>
                    <span className="tabular-nums">{rk.format(r)}</span>
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
