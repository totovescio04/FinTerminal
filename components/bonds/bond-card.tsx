"use client";

import { Plus, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils/format";
import { RatingBadge } from "./rating-badge";
import type { BondRecord } from "@/lib/data/bond-model";

interface BondCardProps {
  record: BondRecord;
  watched?: boolean;
  onSelect?: (record: BondRecord) => void;
  onToggleWatch?: (id: string) => void;
  onAdd?: (record: BondRecord) => void;
}

/** Compact bond tile for watchlist, recently-viewed and mobile lists. */
export function BondCard({ record, watched, onSelect, onToggleWatch, onAdd }: BondCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-elevated">
      <CardContent className="p-4">
        <button type="button" onClick={() => onSelect?.(record)} className="block w-full text-left">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{record.ticker}</p>
              <p className="truncate text-xs text-muted-foreground">{record.name}</p>
            </div>
            <RatingBadge rating={record.rating} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div><span className="text-muted-foreground">Coupon</span><p className="font-medium tabular-nums">{formatNumber(record.coupon, 3)}%</p></div>
            <div><span className="text-muted-foreground">Yield</span><p className="font-medium tabular-nums">{formatNumber(record.marketYield, 2)}%</p></div>
            <div><span className="text-muted-foreground">Maturity</span><p className="font-medium tabular-nums">{record.maturityDate.slice(0, 7)}</p></div>
          </div>
        </button>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{record.country} · {record.currency}</span>
          <div className="flex items-center gap-1">
            {onToggleWatch && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onToggleWatch(record.id)} aria-label="Toggle watchlist">
                <Star className={cn("h-3.5 w-3.5", watched && "fill-amber-400 text-amber-400")} />
              </Button>
            )}
            {onAdd && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onAdd(record)} aria-label="Add to portfolio">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
