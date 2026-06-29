"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bp } from "./format";

interface ScenarioToolbarProps {
  bondName: string;
  ticker: string;
  shiftBps: number;
  onReset: () => void;
}

/** Header strip showing the active bond and the selected shift, with a reset. */
export function ScenarioToolbar({ bondName, ticker, shiftBps, onReset }: ScenarioToolbarProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">{bondName || "Active bond"}</span>
        <Badge variant="secondary">{ticker || "—"}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={shiftBps === 0 ? "muted" : shiftBps > 0 ? "negative" : "positive"}>
          Scenario {bp(shiftBps)}
        </Badge>
        <Button variant="ghost" size="sm" onClick={onReset} disabled={shiftBps === 0}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>
    </div>
  );
}
