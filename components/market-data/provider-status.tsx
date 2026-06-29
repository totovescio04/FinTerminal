"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useProviderStatuses } from "./use-market-data";

/** Live availability of every registered data provider (fallback chain). */
export function ProviderStatus() {
  const { data, isLoading } = useProviderStatuses();
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Data Providers</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                <span className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", p.available ? "bg-positive" : "bg-muted-foreground/40")} />
                  <span className="font-medium">{p.name}</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {p.available ? "available" : "not configured"} · {p.capabilities.length} caps
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
