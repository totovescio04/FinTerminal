"use client";

import { cn } from "@/lib/utils";
import type { MarketStatus as Status } from "@/lib/market-data";

interface MarketStatusProps {
  status: Status;
  asOf?: string;
}

const LABEL: Record<Status, string> = { open: "Market Open", closed: "Market Closed", pre: "Pre-Market", post: "After Hours" };
const COLOR: Record<Status, string> = { open: "bg-positive", closed: "bg-negative", pre: "bg-amber-500", post: "bg-amber-500" };

/** Trading session indicator. */
export function MarketStatus({ status, asOf }: MarketStatusProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs">
      <span className={cn("h-2 w-2 rounded-full", COLOR[status], status === "open" && "animate-pulse")} />
      <span className="font-medium">{LABEL[status]}</span>
      {asOf && <span className="text-muted-foreground">· {asOf}</span>}
    </div>
  );
}
