"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";
import type { VaRResult } from "@/lib/risk";

interface VaRPanelProps {
  confidence: number;
  horizonDays: number;
  vol: number;
  onConfidence: (c: number) => void;
  onHorizon: (h: number) => void;
  onVol: (v: number) => void;
  result: VaRResult;
}

const CONF = [95, 99];
const HORIZON = [1, 10, 30];

/** Value-at-Risk panel. Parametric implemented; historical/MC scaffolded. */
export function VaRPanel({ confidence, horizonDays, vol, onConfidence, onHorizon, onVol, result }: VaRPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle>Value at Risk</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Confidence</Label>
            <div className="flex gap-1">
              {CONF.map((c) => (
                <Button key={c} size="sm" variant={c === confidence ? "default" : "outline"} onClick={() => onConfidence(c)}>{c}%</Button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Horizon</Label>
            <div className="flex gap-1">
              {HORIZON.map((h) => (
                <Button key={h} size="sm" variant={h === horizonDays ? "default" : "outline"} onClick={() => onHorizon(h)}>{h}d</Button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Daily yield vol (bp)</Label>
            <Input type="number" step="0.5" value={String(vol)} onChange={(e) => onVol(e.target.value === "" ? 0 : Number(e.target.value))} className="h-8 w-24 tabular-nums" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-primary/5 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Parametric VaR ({confidence}% · {horizonDays}d)</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-negative">{formatCurrency(result.value)}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {(["parametric", "historical", "montecarlo"] as const).map((m) => (
            <Badge key={m} variant={m === "parametric" ? "secondary" : "muted"} className={cn("capitalize")}>
              {m === "parametric" ? "Parametric · active" : `${m} · ready`}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
