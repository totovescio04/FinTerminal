"use client";

import { Card, CardContent } from "@/components/ui/card";
import { METRICS, bestIndex } from "./metrics";
import type { ComparisonResult } from "./types";

const WINNERS: { metricKey: string; label: string }[] = [
  { metricKey: "yield", label: "Highest Yield" },
  { metricKey: "modified", label: "Lowest Duration" },
  { metricKey: "convexity", label: "Highest Convexity" },
  { metricKey: "currentYield", label: "Highest Current Yield" },
  { metricKey: "rating", label: "Best Rating" },
  { metricKey: "dv01", label: "Lowest Risk (DV01)" },
];

/** Headline "winners" across the key highlighted metrics. */
export function ComparisonSummary({ results }: { results: ComparisonResult[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {WINNERS.map((w) => {
        const metric = METRICS.find((m) => m.key === w.metricKey)!;
        const idx = bestIndex(results, metric);
        const winner = idx >= 0 ? results[idx] : undefined;
        return (
          <Card key={w.metricKey}>
            <CardContent className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{w.label}</p>
              <p className="mt-1.5 flex items-center gap-1.5 text-lg font-semibold">
                {winner && <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: winner.color }} />}
                {winner ? winner.bond.ticker : "—"}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">{winner ? metric.display(winner) : ""}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
