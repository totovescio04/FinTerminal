"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { QUICK_SHIFTS_BP } from "./constants";
import { ScenarioSlider } from "./scenario-slider";
import { bp } from "./format";

interface ScenarioControlsProps {
  shiftBps: number;
  onChange: (value: number) => void;
}

/** Scenario controls: quick presets, a slider, and a manual basis-point input. */
export function ScenarioControls({ shiftBps, onChange }: ScenarioControlsProps) {
  const id = useId();
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Quick parallel shift</Label>
        <div className="flex flex-wrap gap-2">
          {QUICK_SHIFTS_BP.map((value) => {
            const active = value === shiftBps;
            return (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={active ? "default" : "outline"}
                onClick={() => onChange(value)}
                className={cn("px-2.5 tabular-nums", value === 0 && "font-semibold")}
              >
                {bp(value)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Fine adjust</Label>
        <ScenarioSlider value={shiftBps} onChange={onChange} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={id}>Manual (bp)</Label>
        <Input
          id={id}
          type="number"
          step="1"
          value={Number.isFinite(shiftBps) ? String(shiftBps) : ""}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          className="tabular-nums"
        />
      </div>
    </div>
  );
}
