"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils/format";
import type { Currency } from "@/lib/market-data";
import { useFX } from "./use-market-data";

interface FXCardProps {
  base: Currency;
  quote: Currency;
}

/** FX rate tile (quote per base). */
export function FXCard({ base, quote }: FXCardProps) {
  const { data, isLoading } = useFX(base, quote);
  if (isLoading || !data) {
    return <Card><CardContent className="space-y-2 p-4"><Skeleton className="h-4 w-16" /><Skeleton className="h-6 w-24" /></CardContent></Card>;
  }
  const fx = data.data;
  const up = fx.changePct >= 0;
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{base}/{quote}</p>
        <p className="mt-1 text-xl font-semibold tabular-nums">{formatNumber(fx.rate, fx.rate > 100 ? 2 : 4)}</p>
        <p className={cn("text-xs font-medium", up ? "text-positive" : "text-negative")}>{up ? "+" : ""}{formatNumber(fx.changePct, 2)}%</p>
      </CardContent>
    </Card>
  );
}
