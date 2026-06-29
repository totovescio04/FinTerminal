"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DataSource } from "@/lib/market-data";

interface DataSourceBadgeProps {
  source: DataSource;
  className?: string;
}

/** Shows which provider served the data and whether it came from cache. */
export function DataSourceBadge({ source, className }: DataSourceBadgeProps) {
  return (
    <Badge variant={source.cached ? "muted" : "secondary"} className={cn("gap-1", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", source.cached ? "bg-muted-foreground" : "bg-positive")} />
      {source.provider}
      <span className="text-[10px] opacity-70">{source.cached ? "cached" : "live"}</span>
    </Badge>
  );
}
