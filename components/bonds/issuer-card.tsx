"use client";

import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RatingBadge } from "./rating-badge";
import type { BondRecord } from "@/lib/data/bond-model";

interface IssuerCardProps {
  record: BondRecord;
}

/** Compact issuer summary used on the detail page. */
export function IssuerCard({ record }: IssuerCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Building2 className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{record.issuer}</p>
          <p className="text-xs text-muted-foreground">
            {record.country} · {record.sector} · {record.currency}
          </p>
        </div>
        <RatingBadge rating={record.rating} />
      </CardContent>
    </Card>
  );
}
