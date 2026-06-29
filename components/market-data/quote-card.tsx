"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils/format";
import { useBondQuote } from "./use-market-data";
import { DataSourceBadge } from "./data-source-badge";

interface QuoteCardProps {
  symbol: string;
}

/** Live quote tile for one instrument (bid/ask/last/yield/change). */
export function QuoteCard({ symbol }: QuoteCardProps) {
  const { data, isLoading } = useBondQuote(symbol);
  if (isLoading || !data) {
    return (
      <Card><CardContent className="space-y-2 p-4"><Skeleton className="h-4 w-20" /><Skeleton className="h-7 w-28" /><Skeleton className="h-3 w-full" /></CardContent></Card>
    );
  }
  const q = data.data;
  const up = q.changePct >= 0;
  return (
    <Card className="transition-shadow hover:shadow-elevated">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold">{q.symbol}</p>
            <p className="text-xs text-muted-foreground">{q.currency}{q.isin ? ` · ${q.isin}` : ""}</p>
          </div>
          <DataSourceBadge source={data.source} />
        </div>
        <div className="mt-2 flex items-end justify-between">
          <p className="text-2xl font-semibold tabular-nums">{formatNumber(q.last, 3)}</p>
          <span className={cn("inline-flex items-center gap-0.5 text-sm font-medium", up ? "text-positive" : "text-negative")}>
            {up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {up ? "+" : ""}{formatNumber(q.changePct, 2)}%
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div><span className="text-muted-foreground">Bid</span><p className="font-medium tabular-nums">{formatNumber(q.bid, 3)}</p></div>
          <div><span className="text-muted-foreground">Ask</span><p className="font-medium tabular-nums">{formatNumber(q.ask, 3)}</p></div>
          <div><span className="text-muted-foreground">Yield</span><p className="font-medium tabular-nums">{formatNumber(q.yield, 2)}%</p></div>
        </div>
      </CardContent>
    </Card>
  );
}
