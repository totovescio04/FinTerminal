"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ScenarioType } from "@/lib/yield-curve";

const TYPES: { value: ScenarioType; label: string }[] = [
  { value: "parallel", label: "Parallel" },
  { value: "steepen", label: "Steepen" },
  { value: "flatten", label: "Flatten" },
  { value: "twist", label: "Twist" },
  { value: "butterfly", label: "Butterfly" },
];

interface ScenarioControlsProps {
  type: ScenarioType;
  bps: number;
  onTypeChange: (t: ScenarioType) => void;
  onBpsChange: (b: number) => void;
  onReset: () => void;
}

/** Curve scenario controls (shape + magnitude). */
export function ScenarioControls({ type, bps, onTypeChange, onBpsChange, onReset }: ScenarioControlsProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>Scenario</Label>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <Button key={t.value} type="button" size="sm" variant={t.value === type ? "default" : "outline"} onClick={() => onTypeChange(t.value)} className={cn(bps === 0 && "opacity-80")}>
              {t.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <Label>Magnitude (bp)</Label>
          <Input type="number" step="5" value={String(bps)} onChange={(e) => onBpsChange(e.target.value === "" ? 0 : Number(e.target.value))} className="tabular-nums" />
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} disabled={bps === 0}>
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
      </div>
    </div>
  );
}
