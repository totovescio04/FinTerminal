"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils/format";
import { signed, signedMoney, signedPct } from "./format";
import type { ScenarioResult } from "./scenario-engine";

interface ScenarioCardProps {
  result: ScenarioResult;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function Method({ name, price, change, error }: { name: string; price: number; change: number; error?: number }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium">{name}</p>
        {error === undefined ? (
          <Badge variant="muted">exact</Badge>
        ) : (
          <Badge variant="secondary">err {signed(error, 4)}</Badge>
        )}
      </div>
      <p className="mt-2 text-lg font-semibold tabular-nums">{formatNumber(price, 4)}</p>
      <p className="text-xs text-muted-foreground tabular-nums">Δ {signed(change)}</p>
    </div>
  );
}

/**
 * Scenario results: the new yield/prices and the three pricing methods
 * (exact engine price vs. duration vs. duration+convexity) with their errors.
 */
export function ScenarioCard({ result }: ScenarioCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Scenario Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
          <Stat label="New Yield" value={`${formatNumber(result.newYieldPct, 3)}%`} />
          <Stat label="Clean Price" value={formatNumber(result.exactClean, 4)} />
          <Stat label="Dirty Price" value={formatNumber(result.exactDirty, 4)} />
          <Stat label="Accrued Interest" value={formatNumber(result.accruedInterest, 4)} />
          <Stat label="Change %" value={signedPct(result.exactChangePct)} />
          <Stat label="Change $" value={signedMoney(result.dollarGain)} />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Pricing method comparison
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Method name="Exact (engine)" price={result.exactClean} change={result.exactChange} />
            <Method name="Modified Duration" price={result.durationPrice} change={result.durationEffect} error={result.errorDuration} />
            <Method name="Duration + Convexity" price={result.convexityPrice} change={result.durationEffect + result.convexityEffect} error={result.errorConvexity} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
