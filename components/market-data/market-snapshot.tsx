"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils/format";
import { MarketStatus } from "./market-status";
import { DataSourceBadge } from "./data-source-badge";
import { useMarketSnapshot } from "./use-market-data";

const change = (v: number) => cn("text-xs font-medium tabular-nums", v >= 0 ? "text-positive" : "text-negative");

/** Aggregated market snapshot: status, benchmarks, FX and top movers. */
export function MarketSnapshot() {
  const { data, isLoading } = useMarketSnapshot();
  if (isLoading || !data) {
    return <Card><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>;
  }
  const s = data.data;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle>Market Snapshot</CardTitle>
        <div className="flex items-center gap-2">
          <MarketStatus status={s.status} asOf={s.asOf} />
          <DataSourceBadge source={data.source} />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Benchmarks</p>
          <ul className="space-y-1.5">
            {s.benchmarks.map((b) => (
              <li key={b.id} className="flex items-center justify-between text-sm">
                <span>{b.name}</span>
                <span className="flex items-center gap-2">
                  <span className="font-medium tabular-nums">{formatNumber(b.yield ?? b.level ?? 0, 2)}%</span>
                  <span className={change(b.changePct)}>{b.changePct >= 0 ? "+" : ""}{formatNumber(b.changePct, 2)}%</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">FX (per USD)</p>
          <ul className="space-y-1.5">
            {s.fx.map((f) => (
              <li key={`${f.base}${f.quote}`} className="flex items-center justify-between text-sm">
                <span>{f.base}/{f.quote}</span>
                <span className="flex items-center gap-2">
                  <span className="font-medium tabular-nums">{formatNumber(f.rate, f.rate > 100 ? 1 : 4)}</span>
                  <span className={change(f.changePct)}>{f.changePct >= 0 ? "+" : ""}{formatNumber(f.changePct, 2)}%</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Top Movers</p>
          <ul className="space-y-1.5">
            {s.topMovers.map((q) => (
              <li key={q.symbol} className="flex items-center justify-between text-sm">
                <span>{q.symbol}</span>
                <span className="flex items-center gap-2">
                  <span className="font-medium tabular-nums">{formatNumber(q.last, 2)}</span>
                  <span className={change(q.changePct)}>{q.changePct >= 0 ? "+" : ""}{formatNumber(q.changePct, 2)}%</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
