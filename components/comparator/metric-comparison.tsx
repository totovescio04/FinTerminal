"use client";

import { cn } from "@/lib/utils";
import { METRICS, bestIndex } from "./metrics";
import type { ComparisonResult } from "./types";

/** Compare a single metric across bonds as a labelled, colour-coded row. */
export function MetricComparison({ results, metricKey }: { results: ComparisonResult[]; metricKey: string }) {
  const metric = METRICS.find((m) => m.key === metricKey);
  if (!metric) return null;
  const best = bestIndex(results, metric);
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{metric.label}</p>
      <div className="mt-2 space-y-1.5">
        {results.map((r, i) => (
          <div key={r.bond.id} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
              {r.bond.ticker}
            </span>
            <span className={cn("tabular-nums", i === best && "font-semibold text-positive")}>{metric.display(r)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
