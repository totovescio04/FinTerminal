"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import type { PortfolioAnalytics } from "./types";

interface PortfolioSummaryProps {
  data: PortfolioAnalytics;
}

/** Compact summary: counts and currency allocation. */
export function PortfolioSummary({ data }: PortfolioSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Portfolio Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Holdings</dt>
            <dd className="font-semibold tabular-nums">{data.numberOfBonds}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Market Value</dt>
            <dd className="font-semibold tabular-nums">{formatCurrency(data.marketValue)}</dd>
          </div>
        </dl>
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">By currency</p>
          <ul className="space-y-2">
            {data.allocationByCurrency.map((slice) => (
              <li key={slice.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{slice.label}</span>
                  <span className="tabular-nums text-muted-foreground">{formatPercent(slice.weight * 100, 1)}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${slice.weight * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
