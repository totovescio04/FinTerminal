"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/fixed-income";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { PortfolioRiskHighlights } from "./portfolio-engine";

interface PortfolioRiskProps {
  highlights: PortfolioRiskHighlights;
}

function scoreColor(score: number): string {
  if (score < 33) return "bg-positive";
  if (score < 66) return "bg-amber-500";
  return "bg-negative";
}

/** Risk panel: extremes across the book plus a heuristic risk score. */
export function PortfolioRisk({ highlights }: PortfolioRiskProps) {
  const h = highlights;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Risk Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <MetricCard label="Largest Position" value={h.largestPosition?.position.ticker ?? "—"} hint={h.largestPosition ? formatCurrency(h.largestPosition.marketValue) : undefined} />
          <MetricCard label="Highest Duration" value={h.highestDuration?.position.ticker ?? "—"} hint={h.highestDuration ? `${formatNumber(h.highestDuration.modifiedDuration, 2)}y` : undefined} />
          <MetricCard label="Highest Convexity" value={h.highestConvexity?.position.ticker ?? "—"} hint={h.highestConvexity ? formatNumber(h.highestConvexity.convexity, 2) : undefined} />
          <MetricCard label="Highest DV01" value={h.highestDv01?.position.ticker ?? "—"} hint={h.highestDv01 ? formatCurrency(h.highestDv01.dv01) : undefined} />
          <MetricCard label="Average Yield" value={`${formatNumber(h.averageYield, 3)}%`} />
          <MetricCard label="Risk Score" value={formatNumber(h.riskScore, 0)} emphasis />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>Portfolio Risk Score</span>
            <span className="tabular-nums">{formatNumber(h.riskScore, 0)} / 100</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className={cn("h-full rounded-full transition-all", scoreColor(h.riskScore))} style={{ width: `${Math.min(100, h.riskScore)}%` }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
