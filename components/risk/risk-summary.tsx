"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils/format";
import type { TopRisks } from "@/lib/risk";

/** Automatic top-risk highlights. */
export function RiskSummary({ top }: { top: TopRisks }) {
  const items: { label: string; name: string; value: string }[] = [
    { label: "Highest Duration", name: top.highestDuration?.label ?? "—", value: top.highestDuration ? `${formatNumber(top.highestDuration.value, 2)}y` : "" },
    { label: "Highest DV01", name: top.highestDv01?.label ?? "—", value: top.highestDv01 ? formatCurrency(top.highestDv01.value) : "" },
    { label: "Highest Convexity", name: top.highestConvexity?.label ?? "—", value: top.highestConvexity ? formatNumber(top.highestConvexity.value, 2) : "" },
    { label: "Largest Exposure", name: top.largestExposure?.label ?? "—", value: top.largestExposure ? formatCurrency(top.largestExposure.value) : "" },
    { label: "Top Concentration", name: top.topConcentration?.label ?? "—", value: top.topConcentration ? formatPercent(top.topConcentration.value * 100, 1) : "" },
  ];
  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle>Top Risks</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {items.map((it) => (
          <div key={it.label} className="rounded-lg border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{it.label}</p>
            <p className="mt-1 truncate text-sm font-semibold">{it.name}</p>
            <p className="text-xs text-muted-foreground tabular-nums">{it.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
